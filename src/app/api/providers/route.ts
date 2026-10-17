import { NextResponse } from 'next/server';
import { getAvailableProviders, resolveProvider } from '@/lib/providers';

export async function GET() {
  return NextResponse.json({ available: getAvailableProviders(), default: resolveProvider() });
}
