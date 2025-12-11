/**
 * Location Comparison Utilities
 * Developer 2: Day 3 Implementation
 * 
 * Compare multiple locations side-by-side
 */

export interface LocationComparison {
    address: string;
    locationId?: string;
    scores: {
        demand: number;
        grid: number;
        accessibility: number;
        competition: number;
        overall: number;
    };
    rankings: {
        demand: number;
        grid: number;
        accessibility: number;
        competition: number;
        overall: number;
    };
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
}

export interface ComparisonResult {
    locations: LocationComparison[];
    best_overall: string;
    best_in_categories: {
        demand: string;
        grid: string;
        accessibility: string;
        competition: string;
    };
    recommendations: string;
}

/**
 * Compare multiple locations and generate rankings
 */
export function compareLocations(
    locations: Array<{
        address: string;
        locationId?: string;
        scores: {
            demand: number;
            grid: number;
            accessibility: number;
            competition: number;
            overall: number;
        };
        recommendation?: string;
    }>
): ComparisonResult {
    if (locations.length < 2) {
        throw new Error('At least 2 locations required for comparison');
    }

    if (locations.length > 10) {
        throw new Error('Maximum 10 locations allowed for comparison');
    }

    // Calculate rankings for each metric
    const rankByMetric = (metric: keyof typeof locations[0]['scores']) => {
        const sorted = [...locations].sort(
            (a, b) => b.scores[metric] - a.scores[metric]
        );
        const rankings = new Map<string, number>();
        sorted.forEach((loc, index) => {
            rankings.set(loc.address, index + 1);
        });
        return rankings;
    };

    const demandRankings = rankByMetric('demand');
    const gridRankings = rankByMetric('grid');
    const accessibilityRankings = rankByMetric('accessibility');
    const competitionRankings = rankByMetric('competition');
    const overallRankings = rankByMetric('overall');

    // Build comparison for each location
    const comparisons: LocationComparison[] = locations.map((loc) => {
        const rankings = {
            demand: demandRankings.get(loc.address) || 0,
            grid: gridRankings.get(loc.address) || 0,
            accessibility: accessibilityRankings.get(loc.address) || 0,
            competition: competitionRankings.get(loc.address) || 0,
            overall: overallRankings.get(loc.address) || 0,
        };

        // Identify strengths (rank 1 or 2)
        const strengths: string[] = [];
        if (rankings.demand <= 2) strengths.push('Permintaan Tinggi');
        if (rankings.grid <= 2) strengths.push('Kesiapan Grid');
        if (rankings.accessibility <= 2) strengths.push('Aksesibilitas');
        if (rankings.competition <= 2) strengths.push('Kompetisi Rendah');

        // Identify weaknesses (worst or second worst)
        const weaknesses: string[] = [];
        const worstRank = locations.length;
        if (rankings.demand >= worstRank - 1) weaknesses.push('Permintaan');
        if (rankings.grid >= worstRank - 1) weaknesses.push('Grid');
        if (rankings.accessibility >= worstRank - 1) weaknesses.push('Aksesibilitas');
        if (rankings.competition >= worstRank - 1) weaknesses.push('Kompetisi');

        return {
            address: loc.address,
            locationId: loc.locationId,
            scores: loc.scores,
            rankings,
            strengths,
            weaknesses,
            recommendation: loc.recommendation || 'SPKLU',
        };
    });

    // Find best overall
    const bestOverall = comparisons.reduce((best, current) =>
        current.rankings.overall < best.rankings.overall ? current : best
    );

    // Find best in each category
    const bestDemand = comparisons.reduce((best, current) =>
        current.scores.demand > best.scores.demand ? current : best
    );
    const bestGrid = comparisons.reduce((best, current) =>
        current.scores.grid > best.scores.grid ? current : best
    );
    const bestAccessibility = comparisons.reduce((best, current) =>
        current.scores.accessibility > best.scores.accessibility ? current : best
    );
    const bestCompetition = comparisons.reduce((best, current) =>
        current.scores.competition > best.scores.competition ? current : best
    );

    // Generate recommendations
    const recommendations = `Berdasarkan perbandingan ${locations.length} lokasi, ${bestOverall.address} merupakan pilihan terbaik secara keseluruhan dengan skor ${bestOverall.scores.overall}/100. ${bestOverall.strengths.length > 0
            ? `Kekuatan utama: ${bestOverall.strengths.join(', ')}.`
            : ''
        } ${bestOverall.weaknesses.length > 0
            ? `Perhatian: ${bestOverall.weaknesses.join(', ')}.`
            : ''
        }`;

    return {
        locations: comparisons,
        best_overall: bestOverall.address,
        best_in_categories: {
            demand: bestDemand.address,
            grid: bestGrid.address,
            accessibility: bestAccessibility.address,
            competition: bestCompetition.address,
        },
        recommendations,
    };
}
