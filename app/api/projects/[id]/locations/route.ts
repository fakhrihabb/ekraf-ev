import { NextRequest, NextResponse } from "next/server";
import { SupabaseService } from "../../../../lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // We can reuse fetchProjectById to get locations, or make a specific query
  // For now, let's just return the locations from the project fetch
  try {
    const { id } = await params;
    const project = await SupabaseService.fetchProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project.locations);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const newLocation = await SupabaseService.addLocation(id, body);
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add location" }, { status: 500 });
  }
}
