import { NextResponse } from 'next/server';
import { getAllDateSessions } from '@/lib/store';

export async function GET() {
  const sessions = getAllDateSessions();
  return NextResponse.json(sessions);
}
