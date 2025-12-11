/**
 * Solar Analysis Panel Component
 * Expandable component showing detailed solar panel analysis
 */

'use client';

import { ChevronDown, ChevronUp, Sun, TrendingUp, DollarSign, Zap } from 'lucide-react';
import { useState } from 'react';

interface SolarAnalysisPanelProps {
    solarAnalysis: any;
    solarScore: number;
}

export default function SolarAnalysisPanel({ solarAnalysis, solarScore }: SolarAnalysisPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!solarAnalysis) return null;

    const {
        annual_radiation_kwh_m2,
        optimal_tilt_deg,
        average_sun_hours,
        shadow_factor,
        blocked_hours_per_day,
        terrain_obstacles,
        panel_config,
        roi_analysis,
        monthly_production_kwh,
        recommendation,
    } = solarAnalysis;

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="glass-panel p-4 rounded-lg">
            {/* Header - Always Visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
            >
                <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-sm font-medium text-gray-700">Solar Panel Potential</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getScoreColor(solarScore)}`}>
                        {solarScore}/100
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Summary Stats - Always Visible */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-gray-600">Annual Production</span>
                    <p className="font-medium text-gray-800">
                        {Math.round(panel_config.annual_production_kwh).toLocaleString()} kWh/year
                    </p>
                </div>
                <div>
                    <span className="text-gray-600">Payback Period</span>
                    <p className="font-medium text-gray-800">
                        {roi_analysis.payback_period_years.toFixed(1)} years
                    </p>
                </div>
            </div>

            {/* Expandable Details */}
            {isExpanded && (
                <div className="mt-4 space-y-4 border-t pt-4">
                    {/* Solar Radiation */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <h4 className="text-xs font-semibold text-gray-700">Solar Radiation</h4>
                        </div>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Annual Radiation:</span>
                                <span className="font-medium">{Math.round(annual_radiation_kwh_m2)} kWh/m²/year</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Optimal Tilt:</span>
                                <span className="font-medium">{optimal_tilt_deg}°</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Avg Sun Hours:</span>
                                <span className="font-medium">{average_sun_hours.toFixed(1)} hours/day</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shadow Factor:</span>
                                <span className="font-medium">{(shadow_factor * 100).toFixed(0)}% clear</span>
                            </div>
                        </div>
                    </div>

                    {/* Terrain Obstacles */}
                    <div>
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Terrain Impact</h4>
                        <div className="text-xs">
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-600">Blocked Hours:</span>
                                <span className="font-medium">{blocked_hours_per_day.toFixed(1)} hours/day</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                                {terrain_obstacles.join(', ')}
                            </div>
                        </div>
                    </div>

                    {/* Panel Configuration */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sun className="w-4 h-4 text-blue-500" />
                            <h4 className="text-xs font-semibold text-gray-700">Panel Configuration</h4>
                        </div>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Panel Area:</span>
                                <span className="font-medium">{panel_config.area_m2} m²</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Efficiency:</span>
                                <span className="font-medium">{(panel_config.efficiency * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Annual Output:</span>
                                <span className="font-medium">{Math.round(panel_config.annual_production_kwh).toLocaleString()} kWh</span>
                            </div>
                        </div>
                    </div>

                    {/* ROI Analysis */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <h4 className="text-xs font-semibold text-gray-700">ROI Analysis</h4>
                        </div>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Installation Cost:</span>
                                <span className="font-medium">{formatCurrency(roi_analysis.installation_cost_idr)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Annual Savings:</span>
                                <span className="font-medium text-green-600">{formatCurrency(roi_analysis.annual_savings_idr)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payback Period:</span>
                                <span className="font-medium">{roi_analysis.payback_period_years.toFixed(1)} years</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">25-Year ROI:</span>
                                <span className="font-medium text-green-600">{roi_analysis.roi_25_years_percent.toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">25-Year Profit:</span>
                                <span className="font-medium text-green-600">{formatCurrency(roi_analysis.net_profit_25_years_idr)}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-purple-500" />
                            <h4 className="text-xs font-semibold text-gray-700">Monthly Production</h4>
                        </div>
                        <div className="flex gap-1 items-end h-20 bg-gray-50 rounded p-2">
                            {monthly_production_kwh.map((production: number, index: number) => {
                                const maxProduction = Math.max(...monthly_production_kwh);
                                const heightPercent = Math.max(10, (production / maxProduction) * 100); // Min 10% height
                                const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-1" title={`${months[index]}: ${Math.round(production)} kWh`}>
                                        <div className="w-full flex items-end justify-center" style={{ height: '60px' }}>
                                            <div
                                                className="w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t min-h-[6px]"
                                                style={{ height: `${heightPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-[8px] text-gray-500">{months[index]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-blue-50 p-2 rounded text-xs text-gray-700">
                        <span className="font-medium">💡 Recommendation: </span>
                        {recommendation}
                    </div>
                </div>
            )}
        </div>
    );
}
