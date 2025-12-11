/**
 * Mock Analysis Data Generator
 * Developer 2: Day 3 Implementation
 * 
 * Generate realistic test analyses for development and testing
 * Run with: npx tsx scripts/generate-mock-analyses.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Realistic mock locations across Indonesia
const MOCK_LOCATIONS = [
    // Jakarta - Urban (High demand, low grid, high accessibility, moderate competition)
    { name: 'Plaza Indonesia', address: 'Jl. M.H. Thamrin, Jakarta Pusat', lat: -6.1944, lng: 106.8229, type: 'urban' },
    { name: 'Grand Indonesia', address: 'Jl. M.H. Thamrin, Jakarta Pusat', lat: -6.1954, lng: 106.8234, type: 'urban' },
    { name: 'Senayan City', address: 'Jl. Asia Afrika, Jakarta Selatan', lat: -6.2253, lng: 106.8004, type: 'urban' },
    { name: 'Mall Kelapa Gading', address: 'Jl. Boulevard Raya, Jakarta Utara', lat: -6.1564, lng: 106.8994, type: 'urban' },
    { name: 'Pondok Indah Mall', address: 'Jl. Metro Pondok Indah, Jakarta Selatan', lat: -6.2650, lng: 106.7835, type: 'urban' },

    // Suburban (Moderate demand, good grid, good accessibility, low competition)
    { name: 'Bintaro Jaya', address: 'Bintaro, Tangerang Selatan', lat: -6.2685, lng: 106.7420, type: 'suburban' },
    { name: 'BSD City', address: 'BSD, Tangerang Selatan', lat: -6.2987, lng: 106.6640, type: 'suburban' },
    { name: 'Cibubur Junction', address: 'Cibubur, Jakarta Timur', lat: -6.3711, lng: 106.8949, type: 'suburban' },
    { name: 'Summarecon Bekasi', address: 'Bekasi, Jawa Barat', lat: -6.2254, lng: 107.0011, type: 'suburban' },
    { name: 'Lippo Cikarang', address: 'Cikarang, Bekasi', lat: -6.2703, lng: 107.1539, type: 'suburban' },

    // Rural (Low demand, moderate grid, low accessibility, high competition)
    { name: 'Pasar Bogor', address: 'Bogor, Jawa Barat', lat: -6.5944, lng: 106.7892, type: 'rural' },
    { name: 'Pasar Depok', address: 'Depok, Jawa Barat', lat: -6.4025, lng: 106.8194, type: 'rural' },
    { name: 'Terminal Karawang', address: 'Karawang, Jawa Barat', lat: -6.3213, lng: 107.3070, type: 'rural' },
    { name: 'Pasar Sukabumi', address: 'Sukabumi, Jawa Barat', lat: -6.9278, lng: 106.9271, type: 'rural' },
    { name: 'Pasar Cianjur', address: 'Cianjur, Jawa Barat', lat: -6.8175, lng: 107.1438, type: 'rural' },
];

// Infrastructure type distribution
const INFRA_TYPES = ['SPKLU', 'SPBKLU', 'Hybrid'];

/**
 * Generate realistic scores based on location type
 */
function generateScores(type: string) {
    if (type === 'urban') {
        return {
            demand: Math.floor(Math.random() * 20) + 80, // 80-100
            grid: Math.floor(Math.random() * 20) + 30, // 30-50
            accessibility: Math.floor(Math.random() * 20) + 80, // 80-100
            competition: Math.floor(Math.random() * 30) + 40, // 40-70
        };
    } else if (type === 'suburban') {
        return {
            demand: Math.floor(Math.random() * 20) + 50, // 50-70
            grid: Math.floor(Math.random() * 20) + 60, // 60-80
            accessibility: Math.floor(Math.random() * 20) + 60, // 60-80
            competition: Math.floor(Math.random() * 30) + 60, // 60-90
        };
    } else { // rural
        return {
            demand: Math.floor(Math.random() * 30) + 20, // 20-50
            grid: Math.floor(Math.random() * 30) + 40, // 40-70
            accessibility: Math.floor(Math.random() * 30) + 30, // 30-60
            competition: Math.floor(Math.random() * 20) + 80, // 80-100
        };
    }
}

/**
 * Calculate overall score
 */
function calculateOverall(scores: any) {
    return Math.round(
        scores.demand * 0.3 +
        scores.grid * 0.25 +
        scores.accessibility * 0.25 +
        scores.competition * 0.2
    );
}

/**
 * Determine infrastructure type based on scores
 */
function determineInfraType(scores: any): string {
    if (scores.demand > 80 && scores.accessibility > 70) {
        return 'Hybrid';
    } else if (scores.demand > 70 && scores.accessibility > 60) {
        return 'SPKLU';
    } else if (scores.demand >= 40 && scores.demand <= 70 && scores.competition > 60) {
        return 'SPBKLU';
    } else {
        return 'SPKLU';
    }
}

/**
 * Generate financial data
 */
function generateFinancialData(type: string, demand: number) {
    if (type === 'SPKLU') {
        const chargers = demand > 80 ? 4 : demand > 60 ? 2 : 1;
        return {
            technical_specs: {
                type: 'SPKLU',
                chargers,
                powerRequirement: demand > 80 ? '350 kW' : demand > 60 ? '150 kW' : '50 kW',
                spaceRequirement: '50-200 sq meters',
            },
            financial_estimates: {
                capitalInvestment: chargers * 400000000,
                monthlyOperationalCost: chargers * 8000000,
                revenueProjection: Math.round(chargers * 10 * 0.6 * 80000 * 30),
                paybackPeriodMonths: 60,
                currency: 'IDR',
            },
        };
    } else if (type === 'SPBKLU') {
        const swapStations = demand > 70 ? 2 : 1;
        return {
            technical_specs: {
                type: 'SPBKLU',
                swapStations,
                batteryInventory: swapStations * 10,
                spaceRequirement: '50-200 sq meters',
            },
            financial_estimates: {
                capitalInvestment: swapStations * 1500000000,
                monthlyOperationalCost: swapStations * 20000000,
                revenueProjection: Math.round(swapStations * 10 * 0.6 * 100000 * 30),
                paybackPeriodMonths: 80,
                currency: 'IDR',
            },
        };
    } else { // Hybrid
        return {
            technical_specs: {
                type: 'Hybrid',
                chargers: 4,
                powerRequirement: '350 kW',
                swapStations: 2,
                batteryInventory: 20,
                spaceRequirement: '50-200 sq meters',
            },
            financial_estimates: {
                capitalInvestment: 2500000000,
                monthlyOperationalCost: 30000000,
                revenueProjection: 57600000,
                paybackPeriodMonths: 91,
                currency: 'IDR',
            },
        };
    }
}

/**
 * Generate insight text
 */
function generateInsights(address: string, scores: any, type: string): string {
    const strengths = [];
    if (scores.demand > 70) strengths.push('tingkat permintaan yang tinggi');
    if (scores.grid > 70) strengths.push('kesiapan jaringan listrik yang baik');
    if (scores.accessibility > 70) strengths.push('aksesibilitas yang sangat baik');
    if (scores.competition > 70) strengths.push('tingkat kompetisi yang rendah');

    const overall = calculateOverall(scores);

    let insights = `Analisis untuk ${address} menunjukkan skor kelayakan keseluruhan sebesar ${overall}/100. `;

    if (strengths.length > 0) {
        insights += `Kekuatan utama lokasi ini adalah ${strengths.join(', ')}. `;
    }

    insights += `Rekomendasi infrastruktur ${type} dinilai sesuai dengan karakteristik lokasi. `;
    insights += `Proyeksi finansial menunjukkan potensi pengembalian investasi yang layak dengan estimasi modal dan pendapatan yang telah diperhitungkan.`;

    return insights;
}

/**
 * Main function to generate mock data
 */
async function generateMockData() {
    console.log('🚀 Starting mock data generation...\n');

    // Create a test project first
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
            name: 'Proyek Ekspansi SPKLU Jakarta 2025',
            description: 'Proyek perluasan jaringan SPKLU di wilayah Jabodetabek untuk mendukung adopsi kendaraan listrik',
        })
        .select()
        .single();

    if (projectError) {
        console.error('❌ Error creating project:', projectError);
        return;
    }

    console.log(`✅ Created project: ${project.name}\n`);

    // Generate analyses for each location
    for (const loc of MOCK_LOCATIONS) {
        console.log(`📍 Processing: ${loc.name}...`);

        // Create location
        const { data: location, error: locError } = await supabase
            .from('locations')
            .insert({
                project_id: project.id,
                name: loc.name,
                address: loc.address,
                latitude: loc.lat,
                longitude: loc.lng,
            })
            .select()
            .single();

        if (locError) {
            console.error(`   ❌ Error creating location: ${locError.message}`);
            continue;
        }

        // Generate scores
        const scores = generateScores(loc.type);
        const overall = calculateOverall(scores);
        const infraType = determineInfraType(scores);
        const financialData = generateFinancialData(infraType, scores.demand);
        const insights = generateInsights(loc.address, scores, infraType);

        // Create analysis
        const { error: analysisError } = await supabase
            .from('analyses')
            .insert({
                location_id: location.id,
                demand_score: scores.demand,
                grid_score: scores.grid,
                accessibility_score: scores.accessibility,
                competition_score: scores.competition,
                overall_score: overall,
                insights_text: insights,
                recommendation: infraType,
                financial_data_json: financialData,
            });

        if (analysisError) {
            console.error(`   ❌ Error creating analysis: ${analysisError.message}`);
        } else {
            console.log(`   ✅ Created analysis (Overall: ${overall}, Type: ${infraType})`);
        }
    }

    console.log(`\n🎉 Mock data generation complete!`);
    console.log(`📊 Generated ${MOCK_LOCATIONS.length} locations with analyses`);
    console.log(`📁 Project ID: ${project.id}`);
}

// Run the generator
generateMockData()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Error:', error);
        process.exit(1);
    });
