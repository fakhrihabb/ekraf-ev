
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
    const { error: analysisError } = await supabase
      .from('analyses')
      .insert([{
        location_id: locationData.id,
        overall_score: analysis.overall_score || 0,
        demand_score: analysis.demand_score || 0,
        grid_score: analysis.grid_score || 0,
        accessibility_score: analysis.accessibility_score || 0,
        competition_score: analysis.competition_score || 0,
        insights_text: analysis.insights_text || "",
        recommendation: analysis.recommendation || ""
      }]);

    if (analysisError) {
      console.error("Error creating analysis:", analysisError);
      // Non-fatal, but worth logging
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
