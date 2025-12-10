import { NextRequest, NextResponse } from "next/server";
import { SupabaseService } from "../../../../../lib/storage";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; locationId: string }> }
) {
  try {
    const { locationId } = await params;
    await SupabaseService.removeLocation(locationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
