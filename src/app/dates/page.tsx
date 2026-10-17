'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DateSession, Person } from '@/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 80 ? '#a855f7' : score >= 60 ? '#06b6d4' : '#f59e0b';
  const r = 28;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  return (
    <div style={{position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={70} height={70} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={35} cy={35} r={r} fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth={5} />
        <circle cx={35} cy={35} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${filled} ${c - filled}`} strokeLinecap="round"
          style={{transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)'}} />
      </svg>
      <span style={{
        position: 'absolute',
        fontFamily: 'Playfair Display, serif',
        fontWeight: 700,
        fontSize: '1rem',
        color: color,
      }}>
        {score}
      </span>
    </div>
  );
}

export default function DatesPage() {
  const [sessions, setSessions] = useState<DateSession[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningDate, setRunningDate] = useState(false);
  const [selectedP1, setSelectedP1] = useState('');
  const [selectedP2, setSelectedP2] = useState('');
  const [showDateRunner, setShowDateRunner] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/people').then(r => r.json()),
      fetch('/api/dates').then(r => r.json()),
    ]).then(([peopleData, sessionsData]) => {
      setPeople(peopleData);
      setSessions(sessionsData);
      setLoading(false);
    });
  }, []);

  const readyPeople = people.filter(p => p.status === 'ready' && p.profile);

  const handleRunDate = async () => {
    if (!selectedP1 || !selectedP2 || selectedP1 === selectedP2) return;
    setRunningDate(true);
    try {
      const res = await fetch('/api/date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1Id: selectedP1, person2Id: selectedP2 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Date could not be started');
      setSessions(prev => {
        const exists = prev.find(s => s.id === data.id);
        if (exists) return prev.map(s => s.id === data.id ? data : s);
        return [data, ...prev];
      });
      setShowDateRunner(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Date could not be started. Please try again.');
    } finally {
      setRunningDate(false);
    }
  };

  const getPerson = (id: string) => people.find(p => p.id === id);

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">✦ Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/people" className="nav-link">People</Link>
              <Link href="/dates" className="nav-link active">Dates</Link>
              <Link href="/rankings" className="nav-link">Rankings</Link>
              <button className="btn btn-primary" style={{padding: '8px 20px', fontSize: '0.88rem'}} onClick={() => setShowDateRunner(true)}>
                + Run a date
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 40, paddingBottom: 80}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16}}>
          <div>
            <h1 style={{fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontFamily: 'Playfair Display, serif', marginBottom: 8}}>
              Agent <span style={{fontStyle: 'italic', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>dates</span>
            </h1>
            <p style={{color: 'var(--text-secondary)', fontFamily: 'DM Sans, sans-serif'}}>
              Real conversations between AI agents, each speaking on behalf of their person.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowDateRunner(true)}>
            ✦ Run a new date
          </button>
        </div>

        {/* Date runner modal */}
        {showDateRunner && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            backdropFilter: 'blur(8px)',
          }} onClick={() => setShowDateRunner(false)}>
            <div className="card" style={{maxWidth: 520, width: '100%', padding: 40}} onClick={e => e.stopPropagation()}>
              <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 8}}>Run a new date</h2>
              <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 28, fontFamily: 'DM Sans, sans-serif'}}>
                Select two analyzed people and watch their agents go on a date.
              </p>

              <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24}}>
                <div>
                  <label className="label">Person 1</label>
                  <select
                    className="input"
                    value={selectedP1}
                    onChange={e => setSelectedP1(e.target.value)}
                    style={{appearance: 'auto'}}
                  >
                    <option value="">Select a person...</option>
                    {readyPeople.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{textAlign: 'center', color: 'var(--accent-primary)', fontSize: '1.2rem'}}>♥</div>
                <div>
                  <label className="label">Person 2</label>
                  <select
                    className="input"
                    value={selectedP2}
                    onChange={e => setSelectedP2(e.target.value)}
                    style={{appearance: 'auto'}}
                  >
                    <option value="">Select a person...</option>
                    {readyPeople.filter(p => p.id !== selectedP1).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', gap: 12}}>
                <button
                  className="btn btn-primary"
                  onClick={handleRunDate}
                  disabled={!selectedP1 || !selectedP2 || selectedP1 === selectedP2 || runningDate}
                  style={{flex: 1, justifyContent: 'center'}}
                >
                  {runningDate ? (
                    <><span className="animate-spin">⟳</span> Agents are dating...</>
                  ) : (
                    <>💬 Start the date</>
                  )}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowDateRunner(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {Array.from({length: 4}).map((_, i) => (
              <div key={i} className="skeleton" style={{height: 120, borderRadius: 16}} />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <span className="icon">💬</span>
            <h3>No dates yet</h3>
            <p>Run a date between two analyzed people to see their agents in conversation</p>
            <button className="btn btn-primary" style={{marginTop: 20}} onClick={() => setShowDateRunner(true)}>
              ✦ Run the first date
            </button>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
            {sessions.map((session, i) => {
              const p1 = getPerson(session.person1Id);
              const p2 = getPerson(session.person2Id);
              return (
                <Link key={session.id} href={`/dates/${session.id}`} style={{textDecoration: 'none'}}>
                  <div className="card" style={{
                    display: 'flex', alignItems: 'center', gap: 24, padding: '24px 32px',
                    animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
                    cursor: 'pointer',
                  }}>
                    {/* Avatars */}
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="avatar" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)', zIndex: 2, border: '2px solid var(--bg-card)'}}>
                        {p1 ? getInitials(p1.name) : '?'}
                      </div>
                      <div className="avatar" style={{background: 'linear-gradient(135deg, #06b6d4, #a855f7)', marginLeft: -12, border: '2px solid var(--bg-card)'}}>
                        {p2 ? getInitials(p2.name) : '?'}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap'}}>
                        <span style={{fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1rem'}}>
                          {p1?.name || session.person1Id}
                        </span>
                        <span style={{color: 'var(--accent-primary)'}}>♥</span>
                        <span style={{fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1rem'}}>
                          {p2?.name || session.person2Id}
                        </span>
                        <span className={`badge ${session.status === 'complete' ? 'badge-green' : session.status === 'running' ? 'badge-purple' : 'badge-pink'}`} style={{fontSize: '0.72rem', marginLeft: 4}}>
                          {session.status}
                        </span>
                      </div>
                      {session.compatibilitySummary && (
                        <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif',
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                          {session.compatibilitySummary}
                        </p>
                      )}
                      {session.messages.length > 0 && (
                        <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, fontFamily: 'DM Sans, sans-serif'}}>
                          {session.messages.length} messages · {session.highlights?.length || 0} highlights
                        </p>
                      )}
                    </div>

                    {/* Score */}
                    {session.compatibilityScore > 0 && (
                      <ScoreCircle score={session.compatibilityScore} />
                    )}

                    <span style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
