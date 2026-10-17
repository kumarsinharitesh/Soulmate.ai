import { NextResponse } from 'next/server';
import { getAvailableProviders, hasConfiguredProvider, resolveProvider } from '@/lib/providers';

export async function GET() {
  return NextResponse.json({
    available: ['gemini', 'sarvam', 'fallback'],
    configured: getAvailableProviders(),
    default: resolveProvider(),
    labels: {
      gemini: hasConfiguredProvider('gemini') ? 'Google Gemini' : 'Google Gemini (add a test key)',
      sarvam: hasConfiguredProvider('sarvam') ? 'Sarvam AI' : 'Sarvam AI (add a test key)',
      fallback: 'Local compatibility engine',
    },
  });
}
