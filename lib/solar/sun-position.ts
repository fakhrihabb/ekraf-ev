/**
 * Sun Position Algorithm (SPA)
 * Simplified implementation based on NREL Solar Position Algorithm
 * Calculates sun position (azimuth, elevation) for given location and time
 */

export interface SunPosition {
    azimuth: number;      // Degrees from North (0-360)
    elevation: number;    // Degrees above horizon (-90 to 90)
    sunrise: Date;
    sunset: Date;
}

/**
 * Calculate sun position for given location and time
 * @param latitude Degrees
 * @param longitude Degrees
 * @param date JavaScript Date object
 * @returns Sun position data
 */
export function calculateSunPosition(
    latitude: number,
    longitude: number,
    date: Date = new Date()
): SunPosition {
    const lat = latitude * Math.PI / 180;  // Convert to radians
    const lon = longitude * Math.PI / 180;

    // Julian day calculation
    const jd = dateToJulianDay(date);

    // Solar declination (simplified)
    const n = dayOfYear(date);
    const declination = -23.45 * Math.cos((360 / 365) * (n + 10) * Math.PI / 180);
    const decRad = declination * Math.PI / 180;

    // Hour angle
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
    const localSolarTime = utcHours + (longitude / 15);  // Longitude correction
    const hourAngle = (localSolarTime - 12) * 15 * Math.PI / 180;

    // Solar elevation (altitude)
    const sinElevation =
        Math.sin(lat) * Math.sin(decRad) +
        Math.cos(lat) * Math.cos(decRad) * Math.cos(hourAngle);
    const elevation = Math.asin(sinElevation) * 180 / Math.PI;

    // Solar azimuth
    const cosAzimuth =
        (Math.sin(decRad) - Math.sin(lat) * sinElevation) /
        (Math.cos(lat) * Math.cos(Math.asin(sinElevation)));

    let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * 180 / Math.PI;

    // Adjust azimuth for afternoon (hour angle > 0)
    if (hourAngle > 0) {
        azimuth = 360 - azimuth;
    }

    // Calculate sunrise/sunset times
    const { sunrise, sunset } = calculateSunriseSunset(latitude, longitude, date, declination);

    return {
        azimuth,
        elevation,
        sunrise,
        sunset,
    };
}

/**
 * Calculate sunrise and sunset times
 */
function calculateSunriseSunset(
    latitude: number,
    longitude: number,
    date: Date,
    declination: number
): { sunrise: Date; sunset: Date } {
    const lat = latitude * Math.PI / 180;
    const decRad = declination * Math.PI / 180;

    // Hour angle at sunrise/sunset
    const cosHourAngle = -Math.tan(lat) * Math.tan(decRad);

    // Check if sun rises/sets (polar regions may not)
    if (cosHourAngle < -1 || cosHourAngle > 1) {
        // Use default 6am-6pm for edge cases
        const sunrise = new Date(date);
        sunrise.setHours(6, 0, 0, 0);
        const sunset = new Date(date);
        sunset.setHours(18, 0, 0, 0);
        return { sunrise, sunset };
    }

    const hourAngleRad = Math.acos(cosHourAngle);
    const hourAngleDeg = hourAngleRad * 180 / Math.PI;

    // Sunrise/sunset times (in hours from solar noon)
    const sunriseHour = 12 - (hourAngleDeg / 15) - (longitude / 15);
    const sunsetHour = 12 + (hourAngleDeg / 15) - (longitude / 15);

    const sunrise = new Date(date);
    sunrise.setUTCHours(Math.floor(sunriseHour), (sunriseHour % 1) * 60, 0, 0);

    const sunset = new Date(date);
    sunset.setUTCHours(Math.floor(sunsetHour), (sunsetHour % 1) * 60, 0, 0);

    return { sunrise, sunset };
}

/**
 * Convert date to Julian day
 */
function dateToJulianDay(date: Date): number {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;

    return date.getDate() +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045;
}

/**
 * Get day of year (1-365/366)
 */
function dayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Calculate average sun hours per day for a location
 * Useful for quick solar potential estimates
 */
export function calculateAverageSunHours(
    latitude: number,
    longitude: number
): number {
    // Sample sun position for each month (15th day)
    const monthlyHours: number[] = [];

    for (let month = 0; month < 12; month++) {
        const date = new Date(2024, month, 15, 12, 0, 0);  // Noon on 15th
        const { sunrise, sunset } = calculateSunPosition(latitude, longitude, date);

        const dayLengthHours = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);
        monthlyHours.push(dayLengthHours);
    }

    // Average across year
    return monthlyHours.reduce((sum, h) => sum + h, 0) / 12;
}
