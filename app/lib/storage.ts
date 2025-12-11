import { Project, Location, ProjectHistory, ProjectNote } from './types';
import { supabase } from './supabase';

const STORAGE_KEY = 'sivana_projects';

export const LocalStorageService = {
  getProjects: (): Project[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProject: (project: Project): void => {
    const projects = LocalStorageService.getProjects();
    projects.push(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  },

  updateProject: (updatedProject: Project): void => {
    const projects = LocalStorageService.getProjects();
    const index = projects.findIndex((p) => p.id === updatedProject.id);
    if (index !== -1) {
      projects[index] = updatedProject;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  },

  deleteProject: (id: string): void => {
    const projects = LocalStorageService.getProjects();
    const newProjects = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  },
};

export const SupabaseService = {
  fetchProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, locations(count)');

    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      return [];
    }

    // Fetch average scores for each project
    const projectsWithScores = await Promise.all((data || []).map(async (p: any) => {
      // Get average overall_score from analyses for this project's locations
      const { data: avgData } = await supabase
        .from('analyses')
        .select('overall_score, location_id, locations!inner(project_id)')
        .eq('locations.project_id', p.id);

      const scores = avgData?.map((a: any) => a.overall_score).filter((s: number) => s != null) || [];
      const average_score = scores.length > 0
        ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
        : null;

      return {
        ...p,
        locations: [], // Placeholder as we don't fetch full locations list for the project list
        location_count: p.locations ? p.locations[0]?.count : 0,
        average_score
      };
    }));

    return projectsWithScores;
  },

  saveProject: async (project: Project): Promise<void> => {
    // Prepare data for insertion (exclude non-column fields)
    const { locations, location_count, ...projectData } = project;

    const { error } = await supabase
      .from('projects')
      .insert([projectData]);

    if (error) {
      console.error('Error saving project to Supabase:', error);
      throw error;
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project from Supabase:', error);
      throw error;
    }

    // Also remove from local storage to prevent "sync" logic from resurrecting it
    LocalStorageService.deleteProject(id);
  },

  // Task 3.2: New Methods for Project Details

  fetchProjectById: async (id: string): Promise<Project | null> => {
    // Fetch project with locations and their analysis
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        locations (
          *,
          analyses (
            id,
            location_id,
            demand_score,
            grid_score,
            accessibility_score,
            competition_score,
            overall_score,
            solar_score,
            insights_text,
            recommendation,
            financial_data_json,
            solar_analysis_json,
            created_at
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project details:', error);
      return null;
    }

    if (!data) return null;

    // Map to Project interface with full location data
    const locations = (data.locations || []).map((loc: any) => {
      // Get the latest analysis if exists (assuming one per location for now or take the first)
      const analysis = loc.analyses && loc.analyses.length > 0 ? loc.analyses[0] : undefined;

      // Debug log for solar data
      if (analysis) {
        console.log(`Location ${loc.id} - Solar Score:`, analysis.solar_score);
        console.log(`Location ${loc.id} - Solar Analysis JSON:`, analysis.solar_analysis_json);
      }

      return {
        ...loc,
        analysis,
        suitability_score: analysis?.overall_score
      };
    });

    return {
      ...data,
      locations,
      location_count: locations.length
    };
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<void> => {
    // Only allow updating specific fields
    const allowedUpdates = {
      name: updates.name,
      description: updates.description,
      objective: updates.objective,
      // updated_at is handled by DB trigger usually, but we can pass it if needed
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('projects')
      .update(allowedUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  addLocation: async (projectId: string, locationData: Partial<Location>): Promise<any> => {
    // Separate Location data from Analysis data
    const { suitability_score, analysis, ...dbLocationData } = locationData;

    // 1. Insert Location
    const { error: locError, data: locData } = await supabase
      .from('locations')
      .insert([{
        project_id: projectId,
        ...dbLocationData
      }])
      .select()
      .single();

    if (locError) {
      console.error('Error adding location:', locError);
      throw locError;
    }

    // 2. Insert Analysis (if score provided)
    // For MVP/Mock: random score means we need an analysis record
    if (suitability_score !== undefined || analysis) {
      const { error: anaError } = await supabase
        .from('analyses')
        .insert([{
          location_id: locData.id,
          overall_score: suitability_score || 0,
          demand_score: Math.floor(Math.random() * 100), // mocked sub-scores
          grid_score: Math.floor(Math.random() * 100),
          accessibility_score: Math.floor(Math.random() * 100),
          competition_score: Math.floor(Math.random() * 100),
        }]);

      if (anaError) {
        console.error('Error adding analysis for location:', anaError);
        // Note: Location was added, but analysis failed. 
        // Ideally we'd use a transaction or cleanup, but for MVP we log it.
      }
    }

    // Return with mapped structure for UI
    const result = {
      ...locData,
      suitability_score: suitability_score
    };

    // Log Activity
    await ProjectHistoryService.logAction(projectId, 'ADD_LOCATION', `Menambahkan lokasi "${dbLocationData.name || 'Lokasi Baru'}"`);

    return result;
  },

  removeLocation: async (locationId: string): Promise<void> => {
    // Fetch location details first to get project_id and name for logging
    const { data: locationData } = await supabase
      .from('locations')
      .select('project_id, name')
      .eq('id', locationId)
      .single();

    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', locationId);

    if (error) {
      console.error('Error removing location:', error);
      throw error;
    }

    // Log Activity if we found the location
    if (locationData) {
      await ProjectHistoryService.logAction(locationData.project_id, 'REMOVE_LOCATION', `Menghapus lokasi "${locationData.name}"`);
    }
  },

  updateLocation: async (id: string, updates: Partial<Location>): Promise<void> => {
    const allowedUpdates: any = {};
    if (updates.status !== undefined) allowedUpdates.status = updates.status;
    if (updates.notes !== undefined) allowedUpdates.notes = updates.notes;

    if (Object.keys(allowedUpdates).length === 0) return;

    const { error } = await supabase
      .from('locations')
      .update(allowedUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }
};

export const ProjectReportsService = {
  uploadReport: async (projectId: string, file: Blob, fileName: string): Promise<void> => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = fileName.replace(/[^a-zA-Z0-9]/g, '_');
    const path = `${projectId}/${timestamp}_${safeName}.pdf`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('projects-report')
      .upload(path, file, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading report:', uploadError);
      throw uploadError;
    }

    // 2. Save metadata to Database
    const { error: dbError } = await supabase
      .from('project_reports')
      .insert([{
        project_id: projectId,
        name: fileName,
        storage_path: path,
        size_bytes: file.size
      }]);

    if (dbError) {
      console.error('Error saving report metadata:', dbError);
      throw dbError;
    }

    // Log Activity
    await ProjectHistoryService.logAction(projectId, 'GENERATE_REPORT', `Membuat laporan "${fileName}"`);
  },

  getReports: async (projectId: string): Promise<any[]> => {
    const { data, error } = await supabase
      .from('project_reports')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
    return data || [];
  },

  getDownloadUrl: async (path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from('projects-report')
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    return data?.signedUrl || null;
  }
};

export const ProjectHistoryService = {
  fetchHistory: async (projectId: string): Promise<ProjectHistory[]> => {
    const { data, error } = await supabase
      .from('project_history')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching project history:', error);
      return [];
    }
    return data || [];
  },

  logAction: async (projectId: string, actionType: string, description: string): Promise<void> => {
    const { error } = await supabase
      .from('project_history')
      .insert([{
        project_id: projectId,
        action_type: actionType,
        description: description
      }]);

    if (error) {
      console.error('Error logging project history:', error);
    }
  },

  fetchNotes: async (projectId: string): Promise<ProjectNote[]> => {
    const { data, error } = await supabase
      .from('project_notes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching project notes:', error);
      return [];
    }
    return data || [];
  },

  addNote: async (projectId: string, noteText: string): Promise<ProjectNote | null> => {
    const { data, error } = await supabase
      .from('project_notes')
      .insert([{
        project_id: projectId,
        note_text: noteText
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding project note:', error);
      return null;
    }
    return data;
  }
};
