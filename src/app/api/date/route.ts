import { NextResponse } from 'next/server';
import { getPerson, getDateSessionsForPair, setDateSession } from '@/lib/store';
import { runAgentDate } from '@/lib/agent';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const body = await request.json();
  const { person1Id, person2Id, force } = body;

  if (!person1Id || !person2Id) {
    return NextResponse.json(
      { error: 'person1Id and person2Id are required' },
      { status: 400 }
    );
  }
  if (person1Id === person2Id) {
    return NextResponse.json({ error: 'Choose two different people for a date' }, { status: 400 });
  }

  const person1 = getPerson(person1Id);
  const person2 = getPerson(person2Id);

  if (!person1 || !person2) {
    return NextResponse.json({ error: 'One or both people not found' }, { status: 404 });
  }

  if (!person1.profile || !person2.profile) {
    return NextResponse.json(
      { error: 'Both people must have analyzed profiles before dating' },
      { status: 400 }
    );
  }

  // Check if date session already exists
  const existing = getDateSessionsForPair(person1Id, person2Id);
  if (existing && existing.status === 'complete' && !force) {
    return NextResponse.json(existing);
  }

  const sessionId = uuidv4();
  const session = {
    id: sessionId,
    person1Id,
    person2Id,
    messages: [],
    compatibilityScore: 0,
    compatibilitySummary: '',
    highlights: [],
    status: 'running' as const,
    createdAt: new Date().toISOString(),
  };

  setDateSession(session);

  try {
    const result = await runAgentDate(
      person1.profile,
      person2.profile,
      person1Id,
      person2Id
    );

    const completed = {
      ...session,
      ...result,
      status: 'complete' as const,
    };

    setDateSession(completed);
    return NextResponse.json(completed);
  } catch (error: unknown) {
    console.error('Date session error:', error);
    setDateSession({ ...session, status: 'error' });
    return NextResponse.json(
      { error: 'Date session failed', details: String(error) },
      { status: 500 }
    );
  }
}
