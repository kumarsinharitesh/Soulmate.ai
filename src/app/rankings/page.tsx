'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Person, CompatibilityRanking } from '@/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function RankingsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [allRankings, setAllRankings] = useState<CompatibilityRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/people').then(r => r.json()),
      fetch('/api/rankings').then(r => r.json()),
    ]).then(([peopleData, rankingsData]) => {
      setPeople(peopleData);
      setAllRankings(rankingsData);
      if (rankingsData.length > 0) {
        setSelectedPerson(rankingsData[0].personId);
      } else if (peopleData.filter((p: Person) => p.status === 'ready').length > 0) {
        setSelectedPerson(peopleData.filter((p: Person) => p.status === 'ready')[0].id);
      }
      setLoading(false);
    });
  }, []);

  const handleGenerate = async (personId: string) => {
    setGenerating(true);
    try {
      const res = await fetch('/api/rankings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rankings generation failed');
      setAllRankings(prev => {
        const exists = prev.find(r => r.personId === personId);
        if (exists) return prev.map(r => r.personId === personId ? data : r);
        return [...prev, data];
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Rankings generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const currentRanking = allRankings.find(r => r.personId === selectedPerson);
  const currentPerson = people.find(p => p.id === selectedPerson);
  const readyPeople = people.filter(p => p.status === 'ready');

  const getScoreColor = (score: number) =>
    score >= 85 ? '#a855f7' : score >= 70 ? '#06b6d4' : score >= 55 ? '#f59e0b' : '#6b7280';

  const getScoreLabel = (score: number) =>
    score >= 85 ? '🔥 Exceptional match' : score >= 70 ? '✨ Strong match' : score >= 55 ? '💛 Decent match' : '⬜ Low match';

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">✦ Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/people" className="nav-link">People</Link>
              <Link href="/dates" className="nav-link">Dates</Link>
              <Link href="/rankings" className="nav-link active">Rankings</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 40, paddingBottom: 80}}>
        <div style={{marginBottom: 40}}>
          <h1 style={{fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontFamily: 'Playfair Display, serif', marginBottom: 8}}>
            Compatibility <span style={{fontStyle: 'italic', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>rankings</span>
          </h1>
          <p style={{color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif'}}>
            Who fits each person best, based on profile signals and agent conversations.
          </p>
        </div>

        {loading ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="skeleton" style={{height: 80, borderRadius: 12}} />
            ))}
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start'}}>
            {/* Sidebar — person selector */}
            <div style={{position: 'sticky', top: 80}}>
              <div className="card" style={{padding: '16px'}}>
                <div className="section-title" style={{margin: '0 0 12px'}}>Select a person</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 4, maxHeight: '70vh', overflowY: 'auto'}}>
                  {readyPeople.map((person, i) => {
                    const hasRankings = allRankings.some(r => r.personId === person.id);
                    return (
                      <button
                        key={person.id}
                        onClick={() => setSelectedPerson(person.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                          textAlign: 'left', transition: 'all 0.2s',
                          background: selectedPerson === person.id ? 'rgba(168,85,247,0.12)' : 'transparent',
                          borderLeft: selectedPerson === person.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                        }}
                      >
                        <div className="avatar" style={{
                          width: 32, height: 32, fontSize: '0.75rem',
                          background: `linear-gradient(135deg, ${['#a855f7','#ec4899','#06b6d4','#f59e0b'][i % 4]}, ${['#ec4899','#06b6d4','#f59e0b','#a855f7'][i % 4]})`,
                        }}>
                          {getInitials(person.name)}
                        </div>
                        <div style={{flex: 1, minWidth: 0}}>
                          <div style={{fontSize: '0.85rem', fontWeight: 600, color: selectedPerson === person.id ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {person.name}
                          </div>
                        </div>
                        {hasRankings && (
                          <span style={{width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0}} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main — rankings display */}
            <div>
              {!selectedPerson ? (
                <div className="empty-state">
                  <span className="icon">🏆</span>
                  <h3>Select a person to view rankings</h3>
                </div>
              ) : currentPerson ? (
                <>
                  {/* Person header */}
                  <div className="card" style={{marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20}}>
                    <div className="avatar avatar-lg" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}>
                      {getInitials(currentPerson.name)}
                    </div>
                    <div style={{flex: 1}}>
                      <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 4}}>
                        {currentPerson.name}&apos;s matches
                      </h2>
                      {currentPerson.profile?.tagline && (
                        <p style={{fontSize: '0.87rem', color: 'var(--text-muted)', fontStyle: 'italic', fontFamily: 'Playfair Display, serif'}}>
                          &ldquo;{currentPerson.profile.tagline}&rdquo;
                        </p>
                      )}
                    </div>
                    <div style={{display: 'flex', gap: 10}}>
                      <Link href={`/people/${selectedPerson}`} className="btn btn-secondary" style={{padding: '8px 16px', fontSize: '0.85rem'}}>
                        View profile
                      </Link>
                      {!currentRanking && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleGenerate(selectedPerson)}
                          disabled={generating}
                          style={{padding: '8px 16px', fontSize: '0.85rem'}}
                        >
                          {generating ? <><span className="animate-spin">⟳</span></> : '🏆 Generate'}
                        </button>
                      )}
                    </div>
                  </div>

                  {currentRanking ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                      {currentRanking.rankings.map((match, i) => {
                        const matchPerson = people.find(p => p.id === match.personId);
                        const scoreColor = getScoreColor(match.score);
                        return (
                          <div
                            key={match.personId}
                            className="card"
                            style={{animation: `fadeIn 0.3s ease-out ${i * 0.06}s both`}}
                          >
                            <div style={{display: 'flex', alignItems: 'flex-start', gap: 20}}>
                              {/* Rank */}
                              <div style={{
                                minWidth: 44, height: 44, borderRadius: '50%',
                                background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                  i === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' :
                                  i === 2 ? 'linear-gradient(135deg, #cd7c2f, #92400e)' :
                                  'var(--bg-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '0.95rem',
                                color: i < 3 ? 'white' : 'var(--text-muted)',
                                fontFamily: 'Playfair Display, serif',
                                flexShrink: 0,
                              }}>
                                #{i + 1}
                              </div>

                              {/* Avatar */}
                              <div className="avatar" style={{
                                background: `linear-gradient(135deg, ${['#a855f7','#ec4899','#06b6d4','#f59e0b'][i % 4]}, ${['#ec4899','#06b6d4','#f59e0b','#a855f7'][i % 4]})`,
                                flexShrink: 0,
                              }}>
                                {matchPerson ? getInitials(matchPerson.name) : '?'}
                              </div>

                              {/* Info */}
                              <div style={{flex: 1, minWidth: 0}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap'}}>
                                  <Link href={`/people/${match.personId}`}
                                    style={{fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', fontFamily: 'Playfair Display, serif', fontSize: '1.05rem'}}>
                                    {matchPerson?.name || match.personId}
                                  </Link>
                                  <span className="badge badge-purple" style={{fontSize: '0.72rem'}}>{getScoreLabel(match.score)}</span>
                                </div>

                                {/* Score bar */}
                                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
                                  <div className="compat-bar" style={{flex: 1}}>
                                    <div className="compat-fill" style={{width: `${match.score}%`, background: `linear-gradient(90deg, ${scoreColor}, var(--accent-secondary))`}} />
                                  </div>
                                  <span style={{
                                    fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.3rem',
                                    background: `linear-gradient(135deg, ${scoreColor}, var(--accent-secondary))`,
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                    minWidth: 48, textAlign: 'right',
                                  }}>
                                    {match.score}%
                                  </span>
                                </div>

                                <p style={{fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, fontFamily: 'DM Sans, sans-serif'}}>
                                  {match.summary}
                                </p>

                                {/* Reasons */}
                                {match.reasons && match.reasons.length > 0 && (
                                  <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                                    {match.reasons.slice(0, 3).map((reason, j) => (
                                      <div key={j} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 8,
                                        fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif',
                                      }}>
                                        <span style={{color: scoreColor, flexShrink: 0, marginTop: 2}}>◆</span>
                                        {reason}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div style={{display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0}}>
                                <Link href={`/people/${match.personId}`} className="btn btn-ghost" style={{padding: '6px 12px', fontSize: '0.78rem'}}>
                                  Profile
                                </Link>
                                {match.dateSessionId && (
                                  <Link href={`/dates/${match.dateSessionId}`} className="btn btn-secondary" style={{padding: '6px 12px', fontSize: '0.78rem'}}>
                                    View date
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="card" style={{textAlign: 'center', padding: '60px 40px'}}>
                      <span className="icon" style={{fontSize: '3rem', display: 'block', marginBottom: 16, opacity: 0.5}}>🏆</span>
                      <h3 style={{fontFamily: 'Playfair Display, serif', marginBottom: 8}}>No rankings yet</h3>
                      <p style={{color: 'var(--text-muted)', marginBottom: 20, fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem'}}>
                        Generate AI-powered rankings for {currentPerson.name}
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleGenerate(selectedPerson)}
                        disabled={generating}
                      >
                        {generating ? (
                          <><span className="animate-spin">⟳</span> Generating rankings...</>
                        ) : (
                          <>🏆 Generate rankings</>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
