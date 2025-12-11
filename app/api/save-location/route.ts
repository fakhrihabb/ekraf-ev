
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, analysis, projectId, newProjectName, locationName } = body;

    if (!location || !analysis || (!projectId && !newProjectName)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let targetProjectId = projectId;

    // 1. Create New Project if requested
    if (newProjectName) {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          id: crypto.randomUUID(),
          name: newProjectName,
          description: "Created from Intelligence Planner"
        }])
        .select()
        .single();

      if (projectError) {
        console.error("Error creating project:", projectError);
        return NextResponse.json({
          error: `Failed to create project: ${projectError.message}`,
          details: projectError
        }, { status: 500 });
      }
      targetProjectId = projectData.id;
    }

    // 2. Add Location
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .insert([{
        project_id: targetProjectId,
        name: locationName || "New Location",
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      }])
      .select()
      .single();

    if (locationError) {
      console.error("Error creating location:", locationError);
      return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
    }

    // 3. Add Analysis
    // Handle both old format (overall_score) and new format (scores.overall)
    const analysisData: any = {
      location_id: locationData.id,
      overall_score: analysis.scores?.overall || analysis.overall_score || 0,
      demand_score: analysis.scores?.demand || analysis.demand_score || 0,
      grid_score: analysis.scores?.grid || analysis.grid_score || 0,
      accessibility_score: analysis.scores?.accessibility || analysis.accessibility_score || 0,
      competition_score: analysis.scores?.competition || analysis.competition_score || 0,
      insights_text: analysis.insights || analysis.insights_text || "",
      recommendation: typeof analysis.recommendation === 'string'
        ? analysis.recommendation
        : JSON.stringify(analysis.recommendation || {}),
      financial_data_json: analysis.recommendation?.financial_estimates || analysis.financial_data_json || null
    };

    // Add solar fields if present
    if (analysis.solarScore !== null && analysis.solarScore !== undefined) {
      analysisData.solar_score = Math.round(analysis.solarScore);
    }

    if (analysis.solarAnalysis && Object.keys(analysis.solarAnalysis).length > 0) {
      analysisData.solar_analysis_json = analysis.solarAnalysis;
    }

    console.log('📊 Saving analysis with solar data:', {
      solar_score: analysisData.solar_score,
      has_solar_json: !!analysisData.solar_analysis_json
    });

    const { error: analysisError } = await supabase
      .from('analyses')
      .insert([analysisData]);

    if (analysisError) {
      console.error("❌ Error creating analysis:", analysisError);
      // Non-fatal, but worth logging
    } else {
      console.log("✅ Analysis saved successfully with solar data");
    }

    // 4. Log Actvity (History)
    if (newProjectName) {
      await supabase.from('project_history').insert([{
        project_id: targetProjectId,
        action_type: 'CREATE_PROJECT',
        description: `Proyek "${newProjectName}" dibuat dari Intelligence Planner`
      }]);
    }

    await supabase.from('project_history').insert([{
      project_id: targetProjectId,
      action_type: 'ADD_LOCATION',
      description: `Menambahkan lokasi "${locationName || "New Location"}"`
    }]);

    return NextResponse.json({
      success: true,
      projectId: targetProjectId,
      locationId: locationData.id
    });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
