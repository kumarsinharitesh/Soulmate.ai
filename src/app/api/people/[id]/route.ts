import { NextResponse } from 'next/server';
import { getPerson, setPerson } from '@/lib/store';
import { scrapeLinkedIn, scrapeInstagram } from '@/lib/scraper';
import { analyzePersonProfile } from '@/lib/agent';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const person = getPerson(id);

  if (!person) {
    return NextResponse.json({ error: 'Person not found' }, { status: 404 });
  }

  return NextResponse.json(person);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const person = getPerson(id);

  if (!person) {
    return NextResponse.json({ error: 'Person not found' }, { status: 404 });
  }

  if (person.status === 'ready') {
    return NextResponse.json(person);
  }

  // Start analysis
  setPerson({ ...person, status: 'analyzing' });

  try {
    const [linkedinData, instagramData] = await Promise.all([
      scrapeLinkedIn(person.linkedinUrl),
      scrapeInstagram(person.instagramUrl),
    ]);

    const profile = await analyzePersonProfile(
      linkedinData,
      instagramData,
      person.name,
      person.aiProvider
    );

    const updatedPerson = {
      ...person,
      status: 'ready' as const,
      profile,
    };

    setPerson(updatedPerson);
    return NextResponse.json(updatedPerson);
  } catch (error: unknown) {
    console.error('Analysis error:', error);
    setPerson({ ...person, status: 'error' });
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}
