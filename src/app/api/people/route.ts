import { NextResponse } from 'next/server';
import { getPeople, setPerson } from '@/lib/store';

function parseProfileUrl(value: unknown, platform: 'linkedin' | 'instagram'): URL | null {
  if (typeof value !== 'string' || value.length > 2_000) return null;
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    const validHost = platform === 'linkedin' ? host === 'linkedin.com' : host === 'instagram.com';
    const validPath = platform === 'linkedin'
      ? /^\/in\/[^/]+\/?$/i.test(url.pathname)
      : /^\/[^/]+\/?$/i.test(url.pathname) && !['explore', 'accounts', 'p', 'reel'].includes(url.pathname.split('/')[1]?.toLowerCase());
    return url.protocol === 'https:' && validHost && validPath ? url : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const people = getPeople();
  return NextResponse.json(people);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, linkedinUrl, instagramUrl, aiProvider } = body;
  const linkedin = parseProfileUrl(linkedinUrl, 'linkedin');
  const instagram = parseProfileUrl(instagramUrl, 'instagram');
  const selectedProvider = aiProvider === 'gemini' || aiProvider === 'sarvam' || aiProvider === 'fallback' ? aiProvider : undefined;

  if (!linkedin || !instagram) {
    return NextResponse.json(
      { error: 'Enter an HTTPS LinkedIn /in/ profile URL and an HTTPS public Instagram profile URL.' },
      { status: 400 }
    );
  }

  // Generate ID from name or URL
  const normalizedName = typeof name === 'string' ? name.trim().slice(0, 100) : '';
  const idBase = (normalizedName || linkedin.toString())
    .toLowerCase()
    .replace(/https?:\/\/(www\.)?/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  // Extract Instagram handle from URL
  const instagramHandle = instagram.pathname.split('/').filter(Boolean)[0] || '';
  let id = idBase || `user-${Date.now()}`;
  const existingIds = new Set(getPeople().map(person => person.id));
  if (existingIds.has(id)) id = `${id}-${Date.now().toString(36)}`;

  const person = {
    id,
    name: normalizedName || idBase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    linkedinUrl: linkedin.toString(),
    instagramUrl: instagram.toString(),
    instagramHandle,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    aiProvider: selectedProvider,
  };

  setPerson(person);

  return NextResponse.json(person, { status: 201 });
}
