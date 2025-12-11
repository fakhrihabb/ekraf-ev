/**
 * Google Gemini AI Client
 * Developer 2: Day 2 Implementation
 * 
 * For generating insights in Bahasa Indonesia
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisScores, Recommendation } from '@/lib/supabase/types';

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
    if (genAI) return genAI;

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        console.warn('Gemini API key not configured');
        return null;
    }

    genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
}

/**
 * Generate AI insights using Gemini
 */
export async function generateInsights(
    address: string,
    scores: AnalysisScores,
    recommendation: Recommendation,
    solarScore?: number | null,
    solarAnalysis?: any
): Promise<string> {
    const client = getGeminiClient();

    if (!client) {
        // Fallback to template-based insights
        return generateFallbackInsights(scores, recommendation.type, solarScore, solarAnalysis);
    }

    try {
        const model = client.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                maxOutputTokens: 400, // Limit to ~200 words
                temperature: 0.7,
            },
        });

        // Build solar info for prompt
        let solarInfo = '';
        if (solarScore !== null && solarScore !== undefined && solarAnalysis) {
            const payback = solarAnalysis.roi_analysis?.payback_period_years || 0;
            const roi25yr = solarAnalysis.roi_analysis?.roi_25_years_percent || 0;
            solarInfo = `\nSolar: Skor ${solarScore}, Payback ${payback.toFixed(1)} tahun, ROI 25-tahun ${Math.round(roi25yr)}%`;
        }

        // Optimized prompt (shorter, more specific)
        const prompt = `Analisis lokasi infrastruktur EV di Indonesia:
Lokasi: ${address}
Skor: Permintaan ${scores.demand}, Grid ${scores.grid}, Akses ${scores.accessibility}, Kompetisi ${scores.competition}${solarInfo}, Overall ${scores.overall}
Rekomendasi: ${recommendation.type}

Tulis analisis 150-200 kata (Bahasa Indonesia) yang mencakup:
1. Kekuatan utama lokasi${solarScore ? ' (termasuk potensi solar panel)' : ''}
2. Risiko/kekhawatiran
3. Perbandingan dengan area lain
4. Rekomendasi spesifik

Gunakan bahasa profesional, jangan sebutkan angka berlebihan.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text || generateFallbackInsights(scores, recommendation.type, solarScore, solarAnalysis);
    } catch (error) {
        console.error('Error generating insights with Gemini:', error);
        return generateFallbackInsights(scores, recommendation.type, solarScore, solarAnalysis);
    }
}

/**
 * Fallback template-based insights
 */
function generateFallbackInsights(
    scores: AnalysisScores,
    type: string,
    solarScore?: number | null,
    solarAnalysis?: any
): string {
    const { demand, grid, accessibility, competition, overall } = scores;

    let insights = `Analisis untuk lokasi ini menunjukkan skor kelayakan keseluruhan sebesar ${overall}/100. `;

    // Strengths
    const strengths = [];
    if (demand > 70) strengths.push('tingkat permintaan yang tinggi');
    if (grid > 70) strengths.push('kesiapan jaringan listrik yang baik');
    if (accessibility > 70) strengths.push('aksesibilitas yang sangat baik');
    if (competition > 70) strengths.push('tingkat kompetisi yang rendah');
    if (solarScore && solarScore > 70) {
        const payback = solarAnalysis?.roi_analysis?.payback_period_years || 0;
        strengths.push(`potensi solar panel yang sangat baik (payback ${payback.toFixed(1)} tahun)`);
    }

    if (strengths.length > 0) {
        insights += `Kekuatan utama lokasi ini adalah ${strengths.join(', ')}. `;
    }

    // Concerns
    const concerns = [];
    if (demand < 50) concerns.push('permintaan yang moderat');
    if (grid < 50) concerns.push('jarak ke jaringan listrik terdekat');
    if (accessibility < 50) concerns.push('aksesibilitas yang terbatas');
    if (competition < 50) concerns.push('tingkat kompetisi yang tinggi');

    if (concerns.length > 0) {
        insights += `Perhatian utama meliputi ${concerns.join(', ')}. `;
    }

    // Recommendation
    if (type === 'SPKLU') {
        insights += `Berdasarkan analisis ini, kami merekomendasikan infrastruktur SPKLU (Stasiun Pengisian Kendaraan Listrik Umum) untuk lokasi ini. `;
    } else if (type === 'SPBKLU') {
        insights += `Berdasarkan analisis ini, kami merekomendasikan infrastruktur SPBKLU (Stasiun Penukaran Baterai Kendaraan Listrik Umum) untuk lokasi ini. `;
    } else {
        insights += `Berdasarkan analisis ini, kami merekomendasikan infrastruktur Hybrid yang menggabungkan SPKLU dan SPBKLU untuk melayani berbagai kebutuhan. `;
    }

    // Financial note
    insights += `Proyeksi finansial menunjukkan potensi pengembalian investasi yang layak dengan estimasi modal dan pendapatan yang telah diperhitungkan. `;

    // Solar note
    if (solarScore && solarAnalysis) {
        const roi25yr = solarAnalysis.roi_analysis?.roi_25_years_percent || 0;
        if (solarScore > 70) {
            insights += `Potensi solar panel sangat baik dengan ROI 25-tahun mencapai ${Math.round(roi25yr)}%.`;
        } else if (solarScore > 50) {
            insights += `Potensi solar panel cukup baik untuk supplemental power.`;
        }
    }

    return insights;
}
