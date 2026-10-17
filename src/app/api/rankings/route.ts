import { NextResponse } from 'next/server';
import { getPeople, getAllDateSessions, getRankings, setRankings } from '@/lib/store';
import { generateRankings } from '@/lib/agent';

export async function GET() {
  const people = getPeople().filter(p => p.status === 'ready' && p.profile);
  const allRankings = people.map(p => getRankings(p.id)).filter(Boolean);
  return NextResponse.json(allRankings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { personId } = body;

  const people = getPeople().filter(p => p.status === 'ready' && p.profile);
  const person = people.find(p => p.id === personId);

  if (!person || !person.profile) {
    return NextResponse.json({ error: 'Person not found or not analyzed' }, { status: 404 });
  }

  const allProfilesData = people
    .filter(p => p.id !== personId && p.profile)
    .map(p => ({ id: p.id, profile: p.profile! }));

  const dateSessions = getAllDateSessions().filter(
    s =>
      (s.person1Id === personId || s.person2Id === personId) &&
      s.status === 'complete'
  );

  try {
    const rankingsList = await generateRankings(
      person.profile,
      allProfilesData,
      dateSessions
    );

    const ranking = {
      personId,
      rankings: rankingsList.map(r => ({
        ...r,
        dateSessionId: dateSessions.find(
          s =>
            (s.person1Id === r.personId && s.person2Id === personId) ||
            (s.person2Id === r.personId && s.person1Id === personId)
        )?.id,
      })),
    };

    setRankings(ranking);
    return NextResponse.json(ranking);
  } catch (error: unknown) {
    console.error('Rankings error:', error);
    return NextResponse.json(
      { error: 'Rankings generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
