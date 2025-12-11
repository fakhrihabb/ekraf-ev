
import { NextResponse } from 'next/server';
import { ProjectHistoryService } from '../../../../lib/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const history = await ProjectHistoryService.fetchHistory(id);
    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
