
import { NextResponse } from 'next/server';
import { ProjectHistoryService } from '../../../../lib/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notes = await ProjectHistoryService.fetchNotes(id);
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { note_text } = body;

    if (!note_text) {
      return NextResponse.json({ error: 'Note text is required' }, { status: 400 });
    }

    const newNote = await ProjectHistoryService.addNote(id, note_text);
    return NextResponse.json(newNote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
