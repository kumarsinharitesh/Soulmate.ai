'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Person, CompatibilityRanking } from '@/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function ScoreBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setTimeout(() => setWidth(score), 100);
  }, [score]);

  const color = score >= 80 ? '#a855f7' : score >= 60 ? '#06b6d4' : '#f59e0b';
  return (
    <div className="compat-bar" style={{flex: 1}}>
      <div className="compat-fill" style={{width: `${width}%`, background: `linear-gradient(90deg, ${color}, var(--accent-secondary))`}} />
    </div>
  );
}

export default function PersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [rankings, setRankings] = useState<CompatibilityRanking | null>(null);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'rankings'>('profile');
  const [generatingRankings, setGeneratingRankings] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/people/${id}`).then(async r => r.ok ? r.json() : null),
      fetch('/api/people').then(async r => r.ok ? r.json() : []),
    ]).then(([personData, peopleData]) => {
      setPerson(personData);
      setAllPeople(peopleData);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (person?.status === 'ready') {
      fetch('/api/rankings')
        .then(async r => r.ok ? r.json() : [])
        .then((data: CompatibilityRanking[]) => {
          const myRankings = data.find(r => r.personId === id);
          setRankings(myRankings || null);
        });
    }
  }, [person, id]);

  const handleAnalyze = async () => {
    if (!person) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/people/${id}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setPerson(data);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateRankings = async () => {
    setGeneratingRankings(true);
    try {
      const res = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rankings generation failed');
      setRankings(data);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Rankings generation failed. Please try again.');
    } finally {
      setGeneratingRankings(false);
    }
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh'}}>
        <nav className="nav">
          <div className="container">
            <div className="nav-inner">
              <Link href="/" className="nav-logo">✦ Soulmate.ai</Link>
            </div>
          </div>
        </nav>
        <div className="container" style={{paddingTop: 60}}>
          <div className="skeleton" style={{height: 400, borderRadius: 16}} />
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="empty-state">
          <span className="icon">🔍</span>
          <h3>Person not found</h3>
          <Link href="/people" className="btn btn-primary" style={{marginTop: 20}}>← Back to people</Link>
        </div>
      </div>
    );
  }

  const { profile } = person;
  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">✦ Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/people" className="nav-link">← All people</Link>
              <Link href="/dates" className="nav-link">Dates</Link>
              <Link href="/rankings" className="nav-link">Rankings</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 48, paddingBottom: 80, maxWidth: 900}}>
        {/* Profile Hero */}
        <div className="card" style={{padding: '40px 48px', marginBottom: 32, position: 'relative', overflow: 'hidden'}}>
          {/* Glow */}
          <div style={{position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent)', pointerEvents: 'none'}} />

          <div style={{display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap'}}>
            <div className="avatar avatar-xl" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}>
              {getInitials(person.name)}
            </div>

            <div style={{flex: 1, minWidth: 200}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap'}}>
                <h1 style={{fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontFamily: 'Playfair Display, serif'}}>{person.name}</h1>
                <div className={`status-dot status-${person.status}`} title={person.status} />
              </div>

              {profile ? (
                <>
                  <p style={{fontSize: '1rem', color: 'var(--accent-primary)', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.5, fontFamily: 'Playfair Display, serif'}}>
                    &ldquo;{profile.tagline}&rdquo;
                  </p>
                  <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20}}>
                    <span className="badge badge-purple">
                      {profile.socialBattery === 'extrovert' ? '⚡' : profile.socialBattery === 'introvert' ? '◯' : '◐'} {profile.socialBattery}
                    </span>
                    <span className="badge badge-pink">
                      Energy: {profile.energyLevel?.replace('-', ' ')}
                    </span>
                    {profile.loveLanguages?.slice(0,2).map((ll, i) => (
                      <span key={i} className="badge badge-cyan">{ll}</span>
                    ))}
                  </div>
                  <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                    <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary" style={{padding: '8px 16px', fontSize: '0.85rem', gap: 6}}>
                      <span style={{color: '#60a5fa'}}>in</span> LinkedIn ↗
                    </a>
                    <a href={person.instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary" style={{padding: '8px 16px', fontSize: '0.85rem', gap: 6}}>
                      📷 @{person.instagramHandle} ↗
                    </a>
                  </div>
                </>
              ) : (
                <div>
                  <p style={{color: 'var(--text-muted)', marginBottom: 20, fontFamily: 'DM Sans, sans-serif'}}>
                    This person hasn&apos;t been analyzed yet. Click below to let the agent read their LinkedIn and Instagram.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <><span className="animate-spin">⟳</span> Agent is reading profiles...</>
                    ) : (
                      <>🤖 Analyze with AI Agent</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {profile && (
          <>
            {/* Tabs */}
            <div className="tabs" style={{maxWidth: 400}}>
              <button className={`tab${activeTab === 'profile' ? ' active' : ''}`} onClick={() => setActiveTab('profile')}>
                Profile Analysis
              </button>
              <button className={`tab${activeTab === 'rankings' ? ' active' : ''}`} onClick={() => setActiveTab('rankings')}>
                Rankings
              </button>
            </div>

            {activeTab === 'profile' && (
              <div style={{animation: 'fadeIn 0.3s ease-out'}}>
                {/* Summary */}
                <div className="card" style={{marginBottom: 24}}>
                  <div className="section-title">About (in their words)</div>
                  <p style={{color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontStyle: 'italic'}}>
                    &ldquo;{profile.summary}&rdquo;
                  </p>
                </div>

                {/* 2-col grid */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24}}>
                  {/* Needs */}
                  <div className="card">
                    <div className="section-title">💜 Needs in a partner</div>
                    <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10}}>
                      {profile.needs.map((need, i) => (
                        <li key={i} style={{display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif'}}>
                          <span style={{color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2}}>◆</span>
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Values */}
                  <div className="card">
                    <div className="section-title">⚡ Core values</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                      {profile.values.map((v, i) => (
                        <span key={i} className="badge badge-purple">{v}</span>
                      ))}
                    </div>
                    <div className="section-title" style={{marginTop: 20}}>🎯 Personality</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                      {profile.personality.map((p, i) => (
                        <span key={i} className="badge badge-pink">{p}</span>
                      ))}
                    </div>
                  </div>

                  {/* Hobbies & Interests */}
                  <div className="card">
                    <div className="section-title">🎨 Hobbies</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16}}>
                      {profile.hobbies.map((h, i) => (
                        <span key={i} className="tag">{h}</span>
                      ))}
                    </div>
                    <div className="section-title">🧠 Interests</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                      {profile.interests.map((interest, i) => (
                        <span key={i} className="tag">{interest}</span>
                      ))}
                    </div>
                  </div>

                  {/* Dealbreakers + Love languages */}
                  <div className="card">
                    <div className="section-title">🚩 Dealbreakers</div>
                    <ul style={{listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16}}>
                      {profile.dealbreakers?.map((d, i) => (
                        <li key={i} style={{display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif'}}>
                          <span style={{color: '#ef4444', flexShrink: 0}}>✗</span> {d}
                        </li>
                      ))}
                    </ul>
                    <div className="section-title">💝 Love languages</div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                      {profile.loveLanguages?.map((ll, i) => (
                        <span key={i} className="badge badge-gold">{ll}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Communication + Career */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 24}}>
                  <div className="card">
                    <div className="section-title">💬 Communication style</div>
                    <p style={{color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif'}}>{profile.communicationStyle}</p>
                  </div>
                  <div className="card">
                    <div className="section-title">💼 Career vibe</div>
                    <p style={{color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif'}}>{profile.careerVibe}</p>
                  </div>
                </div>

                {/* Life goals */}
                <div className="card" style={{marginBottom: 24}}>
                  <div className="section-title">🌟 Life goals</div>
                  <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                    {profile.lifeGoals?.map((goal, i) => (
                      <div key={i} style={{
                        padding: '10px 16px',
                        background: 'rgba(168,85,247,0.05)',
                        border: '1px solid rgba(168,85,247,0.15)',
                        borderRadius: 10,
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'DM Sans, sans-serif',
                      }}>
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sources */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24}}>
                  <div className="card" style={{borderColor: 'rgba(0,119,181,0.2)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                      <div style={{width: 28, height: 28, borderRadius: 6, background: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem'}}>in</div>
                      <span style={{fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa'}}>What LinkedIn reveals</span>
                    </div>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif'}}>{profile.linkedinSummary}</p>
                  </div>
                  <div className="card" style={{borderColor: 'rgba(225,48,108,0.2)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                      <div style={{fontSize: '1.2rem'}}>📷</div>
                      <span style={{fontSize: '0.85rem', fontWeight: 600, color: '#f9a8d4'}}>What Instagram reveals</span>
                    </div>
                    <p style={{color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif'}}>{profile.instagramSummary}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rankings' && (
              <div style={{animation: 'fadeIn 0.3s ease-out'}}>
                {rankings ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                    {rankings.rankings.map((match, i) => {
                      const matchPerson = allPeople.find(p => p.id === match.personId);
                      return (
                        <div key={match.personId} className="card" style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px'}}>
                          <div style={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: i === 0 ? 'var(--gradient-gold)' : i === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : i === 2 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--bg-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: i < 3 ? 'white' : 'var(--text-muted)',
                            fontWeight: 700, fontSize: '0.9rem',
                            fontFamily: 'Playfair Display, serif',
                          }}>
                            #{i + 1}
                          </div>
                          <div className="avatar" style={{background: `linear-gradient(135deg, ${['#a855f7','#ec4899','#06b6d4','#f59e0b'][i % 4]}, ${['#ec4899','#06b6d4','#f59e0b','#a855f7'][i % 4]})`}}>
                            {matchPerson ? getInitials(matchPerson.name) : '?'}
                          </div>
                          <div style={{flex: 1, minWidth: 0}}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 12}}>
                              <Link href={`/people/${match.personId}`} style={{fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'Playfair Display, serif', fontSize: '1rem', ':hover': {color: 'var(--accent-primary)'}}}>
                                {matchPerson?.name || match.personId}
                              </Link>
                              <span style={{
                                fontFamily: 'Playfair Display, serif',
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                background: match.score >= 80 ? 'linear-gradient(135deg, #a855f7, #ec4899)' : match.score >= 60 ? 'linear-gradient(135deg, #06b6d4, #a855f7)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                flexShrink: 0,
                              }}>
                                {match.score}%
                              </span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
                              <ScoreBar score={match.score} />
                            </div>
                            <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif'}}>
                              {match.summary}
                            </p>
                          </div>
                          {match.dateSessionId && (
                            <Link href={`/dates/${match.dateSessionId}`} className="btn btn-secondary" style={{flexShrink: 0, padding: '8px 14px', fontSize: '0.8rem'}}>
                              View date →
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="icon">🏆</span>
                    <h3>No rankings yet</h3>
                    <p>Generate AI-powered compatibility rankings for {person.name}</p>
                    <button
                      className="btn btn-primary"
                      onClick={handleGenerateRankings}
                      disabled={generatingRankings}
                      style={{marginTop: 20}}
                    >
                      {generatingRankings ? (
                        <><span className="animate-spin">⟳</span> Generating rankings...</>
                      ) : (
                        <>🏆 Generate rankings</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
