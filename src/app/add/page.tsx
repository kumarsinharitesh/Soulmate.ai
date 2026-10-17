'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignalMark } from '@/components/SignalMark';

export default function AddPersonPage() {
  const [formData, setFormData] = useState({
    name: '',
    linkedinUrl: '',
    instagramUrl: '',
  });
  const [step, setStep] = useState<'form' | 'analyzing' | 'done'>('form');
  const [personId, setPersonId] = useState('');
  const [error, setError] = useState('');
  const [providers, setProviders] = useState<string[]>(['fallback']);
  const [aiProvider, setAiProvider] = useState('fallback');

  useEffect(() => {
    fetch('/api/providers').then(async response => response.ok ? response.json() : null).then(data => {
      if (!data) return;
      setProviders(data.available);
      setAiProvider(data.default);
    }).catch(() => undefined);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep('analyzing');

    try {
      // First add the person
      const addRes = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, aiProvider }),
      });
      const person = await addRes.json();

      if (!addRes.ok) {
        throw new Error(person.error || 'Failed to add person');
      }

      setPersonId(person.id);

      // Then trigger analysis
      const analyzeRes = await fetch(`/api/people/${person.id}`, {
        method: 'POST',
      });
      const analyzed = await analyzeRes.json();

      if (analyzed.status === 'ready') {
        setStep('done');
      } else {
        throw new Error(analyzed.error || 'Analysis failed');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setStep('form');
    }
  };

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/people" className="nav-link">← People</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 60, paddingBottom: 80, maxWidth: 640}}>
        {step === 'form' && (
          <div style={{animation: 'fadeIn 0.4s ease-out'}}>
            <div style={{marginBottom: 40}}>
              <h1 style={{fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: 12}}>
                Add a person
              </h1>
              <p style={{color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7}}>
                Enter a LinkedIn and public Instagram URL. The agent reads both profiles, creates an analysis,
                and places the profile in the matching pool.
              </p>
            </div>

            <div className="card" style={{padding: '40px'}}>
              <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                <div>
                  <label className="label">Name (optional)</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                  />
                  <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'DM Sans, sans-serif'}}>
                    Leave blank and we&apos;ll extract it from the profiles
                  </p>
                </div>

                <div>
                  <label className="label">LinkedIn URL *</label>
                  <input
                    className="input"
                    type="url"
                    placeholder="https://www.linkedin.com/in/username/"
                    value={formData.linkedinUrl}
                    onChange={e => setFormData(prev => ({...prev, linkedinUrl: e.target.value}))}
                    required
                  />
                  <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'DM Sans, sans-serif'}}>
                    Must be a public LinkedIn profile
                  </p>
                </div>

                <div>
                  <label className="label">Instagram URL *</label>
                  <input
                    className="input"
                    type="url"
                    placeholder="https://www.instagram.com/username/"
                    value={formData.instagramUrl}
                    onChange={e => setFormData(prev => ({...prev, instagramUrl: e.target.value}))}
                    required
                  />
                  <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'DM Sans, sans-serif'}}>
                    Must be a public Instagram profile
                  </p>
                </div>

                <div>
                  <label className="label">Analysis agent</label>
                  <select className="input" value={aiProvider} onChange={e => setAiProvider(e.target.value)} style={{appearance: 'auto'}}>
                    {providers.map(provider => (
                      <option key={provider} value={provider}>
                        {provider === 'sarvam' ? 'Sarvam AI' : provider === 'gemini' ? 'Google Gemini' : 'Local compatibility engine'}
                      </option>
                    ))}
                  </select>
                  <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'DM Sans, sans-serif'}}>
                    Choose the engine that will create this person&apos;s profile analysis.
                  </p>
                </div>

                {error && (
                  <div style={{
                    padding: '12px 16px', borderRadius: 10,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                    fontSize: '0.88rem',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <div style={{borderTop: '1px solid var(--border-subtle)', paddingTop: 20}}>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20, padding: '14px 16px', background: 'rgba(168,85,247,0.05)', borderRadius: 10, border: '1px solid rgba(168,85,247,0.1)'}}>
                    <SignalMark kind="shield" label="Privacy" small />
                    <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif'}}>
                      Only public profile information is used. No login required. The agent reads only what anyone
                      can see when they visit these pages.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px'}}
                    disabled={!formData.linkedinUrl || !formData.instagramUrl}
                  >
                    Analyze with AI Agent
                  </button>
                </div>
              </form>
            </div>

            {/* What the agent does */}
            <div style={{marginTop: 32}}>
              <div className="section-title">What the agent will do</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                {[
                  { icon: <SignalMark kind="source" small />, text: 'Read the LinkedIn profile: headline, experience, education, skills' },
                  { icon: <SignalMark kind="camera" small />, text: 'Read the Instagram profile: bio, caption patterns, lifestyle signals' },
                  { icon: <SignalMark kind="profile" small />, text: 'Analyze the profile: needs, hobbies, interests, values, communication style' },
                  { icon: <SignalMark kind="dialogue" small />, text: 'Date every other agent: have real conversations as this person' },
                  { icon: <SignalMark kind="ranking" small />, text: 'Rank all potential matches: with scores, summaries, and evidence' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                    padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 10,
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{fontSize: '1.2rem', flexShrink: 0}}>{item.icon}</span>
                    <p style={{fontSize: '0.88rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5}}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'analyzing' && (
          <div style={{textAlign: 'center', paddingTop: 80, animation: 'fadeIn 0.4s ease-out'}}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
              border: '2px solid rgba(168,85,247,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '2.5rem',
              animation: 'float 2s ease-in-out infinite',
            }}>
              <SignalMark kind="profile" label="Analysis in progress" />
            </div>
            <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: 12}}>
              Agent is reading the profiles
            </h2>
            <p style={{color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px'}}>
              Scraping LinkedIn and Instagram, then analyzing with Gemini 1.5 Pro.
              This takes about 30 seconds.
            </p>
            <div style={{display: 'flex', gap: 8, justifyContent: 'center'}}>
              {['Reading LinkedIn', 'Reading Instagram', 'Analyzing'].map((step, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 9999,
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'DM Sans, sans-serif',
                  animation: `pulse ${1 + i * 0.3}s ease-in-out infinite`,
                }}>
                  <span className="animate-spin">◌</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'done' && (
          <div style={{textAlign: 'center', paddingTop: 80, animation: 'fadeIn 0.4s ease-out'}}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(34,197,94,0.15)',
              border: '2px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              fontSize: '2.5rem',
              animation: 'heartBeat 0.6s ease',
            }}>
              <span aria-label="Complete">Done</span>
            </div>
            <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: 12}}>
              Profile analyzed!
            </h2>
            <p style={{color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 40px'}}>
              The agent has finished reading the profiles and building a deep understanding.
              View the profile to see the analysis.
            </p>
            <div style={{display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link href={`/people/${personId}`} className="btn btn-primary" style={{fontSize: '1rem', padding: '14px 28px'}}>
                View profile analysis
              </Link>
              <Link href="/dates" className="btn btn-secondary" style={{fontSize: '1rem', padding: '14px 28px'}}>
                Run a date
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
