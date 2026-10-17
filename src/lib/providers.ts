export type AIProvider = 'gemini' | 'sarvam' | 'fallback';

function hasUsableKey(value: string | undefined): boolean {
  return Boolean(value?.trim()) && !/your_.*_key_here/i.test(value ?? '');
}

export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (hasUsableKey(process.env.GEMINI_API_KEY)) providers.push('gemini');
  if (hasUsableKey(process.env.SARVAM_API_KEY)) providers.push('sarvam');
  providers.push('fallback');
  return providers;
}

export function hasConfiguredProvider(provider: AIProvider): boolean {
  if (provider === 'gemini') return hasUsableKey(process.env.GEMINI_API_KEY);
  if (provider === 'sarvam') return hasUsableKey(process.env.SARVAM_API_KEY);
  return true;
}

export function resolveProvider(preferred?: string): AIProvider {
  const available = getAvailableProviders();
  const configured = (process.env.AI_PROVIDER || 'auto').toLowerCase();
  if ((preferred === 'gemini' || preferred === 'sarvam' || preferred === 'fallback') && available.includes(preferred)) return preferred;
  if ((configured === 'gemini' || configured === 'sarvam' || configured === 'fallback') && available.includes(configured)) return configured;
  return available.includes('gemini') ? 'gemini' : available.includes('sarvam') ? 'sarvam' : 'fallback';
}
