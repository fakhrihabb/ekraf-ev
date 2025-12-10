import { NextResponse } from 'next/server';

export async function GET() {
  // Stub: In the future, this will fetch from Supabase
  return NextResponse.json({ message: "API endpoint for fetching projects" });
}

export async function POST(request: Request) {
  // Stub: In the future, this will save to Supabase
  const body = await request.json();
  return NextResponse.json({ message: "Project created (stub)", project: body });
}
