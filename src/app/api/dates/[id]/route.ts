import { NextResponse } from 'next/server';
import { getDateSession } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = getDateSession(id);
  if (!session) {
    return NextResponse.json({ error: 'Date session not found' }, { status: 404 });
  }
  return NextResponse.json(session);
}
