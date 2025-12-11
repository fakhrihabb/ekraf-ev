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
    recommendation: Recommendation
): Promise<string> {
    const client = getGeminiClient();

    if (!client) {
        // Fallback to template-based insights
        return generateFallbackInsights(scores, recommendation.type);
    }

    try {
        const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Kamu adalah analis lokasi untuk infrastruktur kendaraan listrik di Indonesia.

Data Analisis:
- Lokasi: ${address}
- Skor Permintaan: ${scores.demand}/100
- Skor Grid: ${scores.grid}/100
- Skor Aksesibilitas: ${scores.accessibility}/100
- Skor Kompetisi: ${scores.competition}/100
- Skor Keseluruhan: ${scores.overall}/100
- Rekomendasi: ${recommendation.type}

Berikan analisis 150-200 kata dalam Bahasa Indonesia yang mencakup:
1. Mengapa lokasi ini mendapat skor tersebut (sebutkan kekuatan spesifik)
2. Risiko atau kekhawatiran utama
3. Perbandingan dengan rata-rata area
4. Rekomendasi spesifik untuk pengembangan

Gunakan bahasa profesional namun mudah dipahami. Jangan menyebutkan angka skor secara berlebihan.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text || generateFallbackInsights(scores, recommendation.type);
    } catch (error) {
        console.error('Error generating insights with Gemini:', error);
        return generateFallbackInsights(scores, recommendation.type);
    }
}

/**
 * Fallback template-based insights
 */
function generateFallbackInsights(scores: AnalysisScores, type: string): string {
    const { demand, grid, accessibility, competition, overall } = scores;

    let insights = `Analisis untuk lokasi ini menunjukkan skor kelayakan keseluruhan sebesar ${overall}/100. `;

    // Strengths
    const strengths = [];
    if (demand > 70) strengths.push('tingkat permintaan yang tinggi');
    if (grid > 70) strengths.push('kesiapan jaringan listrik yang baik');
    if (accessibility > 70) strengths.push('aksesibilitas yang sangat baik');
    if (competition > 70) strengths.push('tingkat kompetisi yang rendah');

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
    insights += `Proyeksi finansial menunjukkan potensi pengembalian investasi yang layak dengan estimasi modal dan pendapatan yang telah diperhitungkan.`;

    return insights;
}
