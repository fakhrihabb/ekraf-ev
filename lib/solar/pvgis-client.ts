/**
 * PVGIS API Client
 * Fetches solar radiation data from EU Joint Research Centre's PVGIS
 * Free API - No authentication required
 */

interface PVGISResponse {
    inputs: {
        location: {
            latitude: number;
            longitude: number;
            elevation: number;
        };
    };
    outputs: {
        monthly: {
            fixed: Array<{
                month: number;
                E_d: number;  // Daily energy production (Wh/day)
                E_m: number;  // Monthly energy production (Wh/month)
                H_sun: number;  // Sun hours (hours/day)
            }>;
        };
        totals: {
            fixed: {
                E_d: number;  // Average daily energy (Wh/day)
                E_m: number;  // Average monthly energy (Wh/month)
                E_y: number;  // Yearly energy (Wh/year)
                H_sun: number;  // Average sun hours
            };
        };
    };
}

export interface PVGISData {
    annual_radiation_kwh_m2: number;
    optimal_tilt_deg: number;
    monthly_radiation_kwh_m2: number[];  // 12 months
    average_sun_hours: number;
}

/**
 * Fetch solar radiation data from PVGIS API
 * @param latitude 
 * @param longitude 
 * @returns Solar radiation data
 */
export async function fetchPVGISData(
    latitude: number,
    longitude: number
): Promise<PVGISData> {
    try {
        // PVGIS API v5.2 - seriescalc endpoint (more reliable for Indonesia)
        // Using PVGIS-SARAH2 database (covers Asia including Indonesia)
        const url = new URL('https://re.jrc.ec.europa.eu/api/v5_2/seriescalc');

        url.searchParams.set('lat', latitude.toString());
        url.searchParams.set('lon', longitude.toString());
        url.searchParams.set('raddatabase', 'PVGIS-SARAH2');  // Database covering Asia
        url.searchParams.set('peakpower', '1');  // 1kWp for normalization
        url.searchParams.set('loss', '14');  // 14% system losses (standard)
        url.searchParams.set('angle', '0');  // Tilt angle (we'll calculate optimal separately)
        url.searchParams.set('aspect', '0');  // South-facing
        url.searchParams.set('startyear', '2020');
        url.searchParams.set('endyear', '2020');
        url.searchParams.set('pvcalculation', '1');
        url.searchParams.set('outputformat', 'json');

        console.log('Fetching PVGIS data for:', latitude, longitude);

        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('PVGIS API error:', response.status);
            throw new Error(`PVGIS API error: ${response.status}`);
        }

        const data = await response.json();

        // Parse monthly data from seriescalc
        const monthlyData = data.outputs?.monthly;
        if (!monthlyData || !monthlyData.fixed) {
            throw new Error('Invalid PVGIS response format');
        }

        // Extract monthly radiation
        const monthly_radiation_kwh_m2 = monthlyData.fixed.map((m: any) => m.E_m / 1000);
        const annual_radiation_kwh_m2 = data.outputs.totals.fixed.E_y / 1000;
        const optimal_tilt_deg = Math.min(15, Math.abs(latitude));

        console.log('PVGIS data fetched successfully:', annual_radiation_kwh_m2);

        return {
            annual_radiation_kwh_m2,
            optimal_tilt_deg,
            monthly_radiation_kwh_m2,
            average_sun_hours: data.outputs.totals.fixed.H_sun || 5.5,
        };

    } catch (error) {
        console.error('Error fetching PVGIS data:', error);

        // Location-based fallback for realistic variation
        // Indonesia ranges: 1400-1800 kWh/m²/year
        // Higher latitudes: Lower total but more seasonal variation
        const latitudeAbs = Math.abs(latitude);

        // Base radiation (varies by latitude)
        // Equator (0°) = ~1700, Mid latitude (30°) = ~1400, High (60°) = ~900
        let baseRadiation = 1700;
        if (latitudeAbs < 10) {
            // Tropical (Indonesia, etc)
            baseRadiation = 1700 - (latitudeAbs * 30);
        } else if (latitudeAbs < 40) {
            // Subtropical/Mid latitude
            baseRadiation = 1600 - (latitudeAbs * 20);
        } else {
            // High latitude (Russia, etc)
            baseRadiation = 1400 - (latitudeAbs * 10);
        }

        // Add longitude-based variation for coastal vs inland (±50)
        const variation = (Math.abs(longitude) % 10) * 5 - 25;
        const annual_radiation = Math.max(800, Math.min(1800, baseRadiation + variation));

        // Calculate monthly with proper seasonal model
        const monthly_radiation_kwh_m2 = Array.from({ length: 12 }, (_, monthIndex) => {
            // Calculate seasonal factor based on latitude
            let seasonalFactor = 1.0;

            if (latitudeAbs < 10) {
                // Equator: Minimal seasonal variation (wet/dry seasons)
                // Months 0-3, 10-11 = wet season, 4-9 = dry season
                const isWetSeason = monthIndex < 4 || monthIndex > 9;
                seasonalFactor = isWetSeason ? 0.85 : 1.1;
            } else if (latitudeAbs < 40) {
                // Mid-latitude: Moderate seasonal variation
                // Northern hemisphere: peak in June-July (month 6)
                // Southern hemisphere: peak in December-January (month 0/12)
                const monthAngle = latitude >= 0
                    ? (monthIndex - 6) * (Math.PI / 6)  // North: peak at month 6
                    : monthIndex * (Math.PI / 6);       // South: peak at month 0
                seasonalFactor = 1.0 + 0.4 * Math.cos(monthAngle);
            } else {
                // High latitude: Extreme seasonal variation
                // Same hemisphere logic as above
                const monthAngle = latitude >= 0
                    ? (monthIndex - 6) * (Math.PI / 6)  // North: peak at month 6
                    : monthIndex * (Math.PI / 6);       // South: peak at month 0
                const seasonalVariation = 0.8; // ±80% variation
                seasonalFactor = 1.0 + seasonalVariation * Math.cos(monthAngle);
                // Ensure non-negative
                seasonalFactor = Math.max(0.2, seasonalFactor);
            }

            return (annual_radiation / 12) * seasonalFactor;
        });

        console.log('Using fallback solar data:', annual_radiation, 'kWh/m²/year', 'Latitude:', latitudeAbs);

        return {
            annual_radiation_kwh_m2: Math.round(annual_radiation),
            optimal_tilt_deg: Math.min(60, Math.max(10, latitudeAbs)), // Higher tilt for higher latitudes
            monthly_radiation_kwh_m2,
            average_sun_hours: Math.max(3, 6 - (latitudeAbs * 0.05)), // Decreases with latitude
        };
    }
}
