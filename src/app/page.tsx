'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { SignalMark } from '@/components/SignalMark';

export default function HomePage() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<string[]>(['fallback']);
  const [aiProvider, setAiProvider] = useState('fallback');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    fetch('/api/providers').then(async response => response.ok ? response.json() : null).then(data => {
      if (!data) return;
      setProviders(data.available);
      setAiProvider(data.default);
    }).catch(() => undefined);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl || !instagramUrl) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, linkedinUrl, instagramUrl, aiProvider }),
      });
      const data = await res.json();
      if (res.ok) {
        const analysisResponse = await fetch(`/api/people/${data.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ aiProvider, apiKey }),
        });
        const analysis = await analysisResponse.json();
        if (!analysisResponse.ok) {
          throw new Error(analysis.error || 'Profile was added but analysis could not start.');
        }
        setSuccess(data.id);
        setLinkedinUrl('');
        setInstagramUrl('');
        setName('');
        setApiKey('');
      } else {
        setError(data.error || 'We could not add that profile. Please check both public profile links.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/people" className="nav-link">People</Link>
              <Link href="/dates" className="nav-link">Dates</Link>
              <Link href="/rankings" className="nav-link">Rankings</Link>
              <Link href="/add" className="btn btn-primary" style={{padding: '8px 20px', fontSize: '0.88rem'}}>
                + Add Person
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className="dot dot-pulse" />
              <span>25 agents actively dating</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Your agent dates
              <br />
              <em>on your behalf</em>
            </h1>
            
            <p className={styles.heroSubtitle}>
              Paste a LinkedIn and Instagram. An AI agent reads your public profiles,
              builds a deep understanding of who you are, then dates every other agent
              on your behalf and ranks compatible matches.
            </p>
            
            <div className={styles.heroActions}>
              <Link href="/people" className="btn btn-primary" style={{fontSize: '1.05rem', padding: '14px 32px'}}>
                Explore the dating pool
              </Link>
              <Link href="/dates" className="btn btn-secondary" style={{fontSize: '1.05rem', padding: '14px 32px'}}>
                Watch a date
              </Link>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>25</span>
                <span className={styles.statLabel}>Real people</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>300+</span>
                <span className={styles.statLabel}>Agent conversations</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>2</span>
                <span className={styles.statLabel}>Sources per person</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>How it works</h2>
            <p>Four steps from profile to perfect match</p>
          </div>

          <div className={styles.steps}>
            {[
              {
                num: '01',
                icon: <SignalMark kind="link" label="Two links" />,
                title: 'Two links in',
                desc: 'LinkedIn public profile + public Instagram. Nothing else. That\'s all your agent needs.',
                color: 'var(--accent-primary)',
              },
              {
                num: '02',
                icon: <SignalMark kind="profile" label="Profile analysis" />,
                title: 'Agent reads you',
                desc: 'Your agent maps needs, hobbies, interests, values, and communication style from the two public profiles.',
                color: 'var(--accent-secondary)',
              },
              {
                num: '03',
                icon: <SignalMark kind="dialogue" label="Agent conversation" />,
                title: 'Agents date each other',
                desc: 'Your agent holds conversations with other agents using the profile analysis as context.',
                color: 'var(--accent-tertiary)',
              },
              {
                num: '04',
                icon: <SignalMark kind="ranking" label="Compatibility rankings" />,
                title: 'Rankings emerge',
                desc: 'Conversation signals create a ranked list with reasons and compatibility scores.',
                color: 'var(--accent-gold)',
              },
            ].map((step, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum} style={{color: step.color}}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick add */}
      <section className={styles.quickAdd}>
        <div className="container">
          <div className={styles.quickAddInner}>
            <div className={styles.quickAddHeader}>
              <h2>Add yourself</h2>
              <p>Paste your two links and your agent will get to work</p>
            </div>

            {success ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3>You&apos;re in the pool!</h3>
                <p>Your profile is queued for analysis.</p>
                <div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20}}>
                  <Link href={`/people/${success}`} className="btn btn-primary">
                    Analyze my profile
                  </Link>
                  <button className="btn btn-secondary" onClick={() => setSuccess(null)}>
                    Add another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.quickForm}>
                <div className={styles.formRow}>
                  <div>
                    <label className="label">Name (optional)</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.formRow2}>
                  <div>
                    <label className="label">LinkedIn URL *</label>
                    <input
                      className="input"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Instagram URL *</label>
                    <input
                      className="input"
                      type="url"
                      placeholder="https://instagram.com/username"
                      value={instagramUrl}
                      onChange={e => setInstagramUrl(e.target.value)}
                      required
                    />
                  </div>
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
                </div>
                {aiProvider !== 'fallback' && (
                  <div>
                    <label className="label">Test API key (optional)</label>
                    <input
                      className="input"
                      type="password"
                      autoComplete="off"
                      placeholder={aiProvider === 'sarvam' ? 'Sarvam API key' : 'Gemini API key'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                    />
                    <p className={styles.formNote}>Used for this analysis only. It is never stored.</p>
                  </div>
                )}
                {error && <p role="alert" className={styles.formError}>{error}</p>}
                <p className={styles.formNote}>Use only profiles you are authorized to add. We use the two links you provide to build a compatibility preview.</p>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !linkedinUrl || !instagramUrl}
                  style={{width: '100%', justifyContent: 'center'}}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">◌</span>
                      Adding...
                    </>
                  ) : (
                    <>Enter the dating pool</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Source section */}
      <section className={styles.sourceSection}>
        <div className="container">
          <div className={styles.sourceDiagram}>
            <div className={styles.sourceBox}>
              <div className={styles.sourceIcon}>in</div>
              <strong>LinkedIn</strong>
              <span>Public profile</span>
            </div>
            <div className={styles.sourcePlus}>+</div>
            <div className={styles.sourceBox}>
              <div className={styles.sourceIcon} style={{background: 'var(--gradient-gold)'}}><SignalMark kind="camera" label="Instagram" small /></div>
              <strong>Instagram</strong>
              <span>Public profile</span>
            </div>
            <div className={styles.sourceArrow}>↓</div>
            <div className={styles.sourceAgent}>
              <div className={styles.agentPulse} />
              <strong>The Agent</strong>
              <span>Reads both, analyzes the person</span>
            </div>
            <div className={styles.sourceArrow}>↓</div>
            <div className={styles.sourceOutput}>
              <strong>Profile page</strong>
              <span>needs · hobbies · interests</span>
            </div>
            <div className={styles.sourceArrow}>↓</div>
            <div className={styles.sourceOutput} style={{background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236, 72, 153, 0.2)'}}>
              <strong>Agents date</strong>
              <span>each agent dates on that person&apos;s behalf</span>
            </div>
            <div className={styles.sourceArrow}>↓</div>
            <div className={styles.sourceOutput} style={{background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)'}}>
              <strong>Ranking</strong>
              <span>who fits each person best</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>
            <span className="gradient-text" style={{fontFamily: 'Playfair Display, serif', fontWeight: 700}}>Soulmate.ai</span>
            {' '}Built with Next.js and public-profile analysis
          </p>
          <p style={{marginTop: 8, color: 'var(--text-muted)', fontSize: '0.85rem'}}>
            All profiles are analyzed from public information only. No private data accessed.
          </p>
        </div>
      </footer>
    </div>
  );
}
