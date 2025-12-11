/**
 * Solar Panel ROI Calculator
 * Calculates return on investment for solar panel installations
 */

import { SOLAR_CONFIG } from '@/app/constants/solar-config';

export interface SolarPanelConfig {
    area_m2: number;
    efficiency: number;
    annual_production_kwh: number;
}

export interface ROIAnalysis {
    installation_cost_idr: number;
    annual_savings_idr: number;
    payback_period_years: number;
    roi_25_years_percent: number;
    net_profit_25_years_idr: number;
}

export interface SolarROIResult {
    panel_config: SolarPanelConfig;
    roi_analysis: ROIAnalysis;
    monthly_production_kwh: number[];
    recommendation: string;
}

/**
 * Calculate solar panel ROI
 * @param annual_radiation_kwh_m2 Annual solar radiation (kWh/m²/year)
 * @param monthly_radiation_kwh_m2 Monthly solar radiation array (12 values)
 * @param shadow_factor Shadow reduction factor (0-1)
 * @param panel_area_m2 Panel area (default from config)
 * @returns Complete ROI analysis
 */
export function calculateSolarROI(
    annual_radiation_kwh_m2: number,
    monthly_radiation_kwh_m2: number[],
    shadow_factor: number,
    panel_area_m2: number = SOLAR_CONFIG.PANEL_AREA_M2
): SolarROIResult {
    // Panel configuration
    const efficiency = SOLAR_CONFIG.PANEL_EFFICIENCY;

    // Annual production (accounting for shadows)
    const annual_production_kwh =
        annual_radiation_kwh_m2 * panel_area_m2 * efficiency * shadow_factor;

    // Monthly production
    const monthly_production_kwh = monthly_radiation_kwh_m2.map(
        monthRad => monthRad * panel_area_m2 * efficiency * shadow_factor
    );

    const panel_config: SolarPanelConfig = {
        area_m2: panel_area_m2,
        efficiency,
        annual_production_kwh,
    };

    // ROI Calculation
    const installation_cost_idr = panel_area_m2 * SOLAR_CONFIG.INSTALLATION_COST_PER_M2_IDR;
    const annual_savings_idr = annual_production_kwh * SOLAR_CONFIG.ELECTRICITY_RATE_IDR_KWH;

    // Simple payback period (without degradation)
    const payback_period_years = installation_cost_idr / annual_savings_idr;

    // 25-year ROI calculation (with degradation)
    const net_profit_25_years_idr = calculate25YearProfit(
        annual_production_kwh,
        installation_cost_idr
    );

    const roi_25_years_percent = (net_profit_25_years_idr / installation_cost_idr) * 100;

    const roi_analysis: ROIAnalysis = {
        installation_cost_idr,
        annual_savings_idr,
        payback_period_years,
        roi_25_years_percent,
        net_profit_25_years_idr,
    };

    // Generate recommendation
    const recommendation = generateRecommendation(
        annual_radiation_kwh_m2,
        shadow_factor,
        payback_period_years
    );

    return {
        panel_config,
        roi_analysis,
        monthly_production_kwh,
        recommendation,
    };
}

/**
 * Calculate 25-year cumulative profit with degradation
 */
function calculate25YearProfit(
    annual_production_kwh: number,
    installation_cost_idr: number
): number {
    let cumulativeProfit = -installation_cost_idr;  // Start with negative (investment)

    for (let year = 1; year <= 25; year++) {
        // Apply degradation (0.5% per year)
        const degradationFactor = Math.pow(1 - SOLAR_CONFIG.PANEL_DEGRADATION, year - 1);
        const yearProduction = annual_production_kwh * degradationFactor;
        const yearSavings = yearProduction * SOLAR_CONFIG.ELECTRICITY_RATE_IDR_KWH;

        cumulativeProfit += yearSavings;
    }

    return cumulativeProfit;
}

/**
 * Generate recommendation based on analysis
 */
function generateRecommendation(
    annual_radiation_kwh_m2: number,
    shadow_factor: number,
    payback_period_years: number
): string {
    // Radiation quality
    let radiationQuality = '';
    if (annual_radiation_kwh_m2 > 1600) {
        radiationQuality = 'Excellent solar radiation';
    } else if (annual_radiation_kwh_m2 > 1400) {
        radiationQuality = 'Good solar radiation';
    } else if (annual_radiation_kwh_m2 > 1200) {
        radiationQuality = 'Moderate solar radiation';
    } else {
        radiationQuality = 'Limited solar radiation';
    }

    // Shadow impact
    let shadowImpact = '';
    if (shadow_factor > 0.9) {
        shadowImpact = 'minimal terrain shadowing';
    } else if (shadow_factor > 0.75) {
        shadowImpact = 'moderate terrain shadowing';
    } else {
        shadowImpact = 'significant terrain shadowing';
    }

    // ROI assessment
    let roiAssessment = '';
    if (payback_period_years < SOLAR_CONFIG.ROI_EXCELLENT_YEARS) {
        roiAssessment = 'Highly recommended for solar investment';
    } else if (payback_period_years < SOLAR_CONFIG.ROI_GOOD_YEARS) {
        roiAssessment = 'Good solar investment opportunity';
    } else if (payback_period_years < SOLAR_CONFIG.ROI_FAIR_YEARS) {
        roiAssessment = 'Fair solar potential, consider local incentives';
    } else {
        roiAssessment = 'Solar may not be economically viable at this location';
    }

    return `${radiationQuality} with ${shadowImpact}. ${roiAssessment}.`;
}

/**
 * Calculate solar score (0-100) for overall analysis
 */
export function calculateSolarScore(
    annual_radiation_kwh_m2: number,
    shadow_factor: number,
    payback_period_years: number
): number {
    // Component scores (0-100)

    // Radiation score (40% weight)
    let radiationScore = 0;
    if (annual_radiation_kwh_m2 >= 1600) radiationScore = 100;
    else if (annual_radiation_kwh_m2 >= 1400) radiationScore = 80;
    else if (annual_radiation_kwh_m2 >= 1200) radiationScore = 60;
    else if (annual_radiation_kwh_m2 >= 1000) radiationScore = 40;
    else radiationScore = 20;

    // Shadow score (30% weight) - directly use shadow_factor percentage
    const shadowScore = shadow_factor * 100;

    // ROI score (30% weight)
    let roiScore = 0;
    if (payback_period_years < 7) roiScore = 100;
    else if (payback_period_years < 10) roiScore = 80;
    else if (payback_period_years < 15) roiScore = 60;
    else if (payback_period_years < 20) roiScore = 40;
    else roiScore = 20;

    // Weighted average
    const finalScore = (radiationScore * 0.4) + (shadowScore * 0.3) + (roiScore * 0.3);

    return Math.round(finalScore);
}
