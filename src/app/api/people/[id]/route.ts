import { NextResponse } from 'next/server';
import { getPerson, setPerson } from '@/lib/store';
import { scrapeLinkedIn, scrapeInstagram } from '@/lib/scraper';
import { analyzePersonProfile } from '@/lib/agent';
import { hasConfiguredProvider } from '@/lib/providers';

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

  const body = await request.json().catch(() => ({}));
  const requestedProvider = body.aiProvider === 'gemini' || body.aiProvider === 'sarvam' || body.aiProvider === 'fallback'
    ? body.aiProvider
    : person.aiProvider;
  const suppliedKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
  if (suppliedKey.length > 500) {
    return NextResponse.json({ error: 'The supplied API key is not valid.' }, { status: 400 });
  }
  if (requestedProvider && requestedProvider !== 'fallback' && !suppliedKey && !hasConfiguredProvider(requestedProvider)) {
    return NextResponse.json({ error: `Add a ${requestedProvider === 'sarvam' ? 'Sarvam' : 'Gemini'} API key to test that provider.` }, { status: 400 });
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
      requestedProvider,
      suppliedKey || undefined
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
