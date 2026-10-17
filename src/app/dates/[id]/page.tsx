'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { DateSession, Person } from '@/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function DateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [session, setSession] = useState<DateSession | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`/api/dates/${id}`).then(r => r.json()),
      fetch('/api/people').then(r => r.json()),
    ]).then(([sessionData, peopleData]) => {
      setSession(sessionData);
      setPeople(peopleData);
      setLoading(false);
    });
  }, [id]);

  // Animate messages appearing
  useEffect(() => {
    if (!session) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleMessages(i);
      if (i >= session.messages.length) clearInterval(timer);
    }, 300);
    return () => clearInterval(timer);
  }, [session]);

  const getPerson = (id: string) => people.find(p => p.id === id);

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
        <div className="container" style={{paddingTop: 60, maxWidth: 800}}>
          <div className="skeleton" style={{height: 200, borderRadius: 16, marginBottom: 24}} />
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="skeleton" style={{height: 80, borderRadius: 12, marginBottom: 16}} />
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="empty-state">
          <span className="icon">💬</span>
          <h3>Date session not found</h3>
          <Link href="/dates" className="btn btn-primary" style={{marginTop: 20}}>← Back to dates</Link>
        </div>
      </div>
    );
  }

  const p1 = getPerson(session.person1Id);
  const p2 = getPerson(session.person2Id);

  const scoreColor = session.compatibilityScore >= 80 ? '#a855f7' :
    session.compatibilityScore >= 60 ? '#06b6d4' : '#f59e0b';

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">✦ Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/dates" className="nav-link">← All dates</Link>
              <Link href="/people" className="nav-link">People</Link>
              <Link href="/rankings" className="nav-link">Rankings</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 40, paddingBottom: 80, maxWidth: 860}}>
        {/* Header card */}
        <div className="card" style={{padding: '40px 48px', marginBottom: 32, position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: -80, right: -80, width: 250, height: 250, background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent)', pointerEvents: 'none'}} />

          {/* Date participants */}
          <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28, flexWrap: 'wrap'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div className="avatar avatar-lg" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)'}}>
                {p1 ? getInitials(p1.name) : '?'}
              </div>
              <div>
                <div style={{fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem'}}>
                  {p1?.name || session.person1Id}
                </div>
                {p1?.profile && (
                  <div style={{fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif'}}>
                    {p1.profile.socialBattery} · {p1.profile.energyLevel?.replace('-', ' ')} energy
                  </div>
                )}
              </div>
            </div>

            <div style={{fontSize: '2rem', color: 'var(--accent-secondary)', flex: 1, textAlign: 'center'}}>♥</div>

            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div>
                <div style={{fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', textAlign: 'right'}}>
                  {p2?.name || session.person2Id}
                </div>
                {p2?.profile && (
                  <div style={{fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', textAlign: 'right'}}>
                    {p2.profile.socialBattery} · {p2.profile.energyLevel?.replace('-', ' ')} energy
                  </div>
                )}
              </div>
              <div className="avatar avatar-lg" style={{background: 'linear-gradient(135deg, #06b6d4, #a855f7)'}}>
                {p2 ? getInitials(p2.name) : '?'}
              </div>
            </div>
          </div>

          {/* Score + summary */}
          {session.compatibilityScore > 0 && (
            <div style={{display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', padding: '24px 0', borderTop: '1px solid var(--border-subtle)'}}>
              <div style={{textAlign: 'center'}}>
                <div style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 700,
                  fontSize: '3.5rem',
                  lineHeight: 1,
                  background: `linear-gradient(135deg, ${scoreColor}, var(--accent-secondary))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 4,
                }}>
                  {session.compatibilityScore}
                </div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em'}}>
                  compatibility
                </div>
              </div>
              <div style={{flex: 1}}>
                <div className="compat-bar" style={{marginBottom: 12}}>
                  <div className="compat-fill" style={{width: `${session.compatibilityScore}%`, background: `linear-gradient(90deg, ${scoreColor}, var(--accent-secondary))`}} />
                </div>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif'}}>
                  {session.compatibilitySummary}
                </p>
              </div>
            </div>
          )}

          {/* Highlights */}
          {session.highlights && session.highlights.length > 0 && (
            <div style={{marginTop: 20}}>
              <div className="section-title">✨ Date highlights</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                {session.highlights.map((h, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px',
                    background: 'rgba(168,85,247,0.05)',
                    border: '1px solid rgba(168,85,247,0.1)',
                    borderRadius: 10,
                    fontSize: '0.87rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'DM Sans, sans-serif',
                    lineHeight: 1.5,
                  }}>
                    <span style={{color: 'var(--accent-primary)', flexShrink: 0}}>✦</span>
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat transcript */}
        <div className="card">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}}>
            <h2 style={{fontFamily: 'Playfair Display, serif', fontSize: '1.3rem'}}>The conversation</h2>
            <span style={{fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif'}}>
              {session.messages.length} messages
            </span>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
            {session.messages.map((msg, i) => {
              const isLeft = msg.agentId === session.person1Id;
              const person = getPerson(msg.agentId);
              const visible = i < visibleMessages;

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: isLeft ? 'row' : 'row-reverse',
                    gap: 12,
                    alignItems: 'flex-start',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="avatar"
                    style={{
                      background: isLeft ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'linear-gradient(135deg, #06b6d4, #a855f7)',
                      flexShrink: 0,
                      fontSize: '0.85rem',
                    }}
                  >
                    {person ? getInitials(person.name) : '?'}
                  </div>

                  {/* Message */}
                  <div style={{maxWidth: '72%'}}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginBottom: 4,
                      fontFamily: 'DM Sans, sans-serif',
                      textAlign: isLeft ? 'left' : 'right',
                    }}>
                      {msg.agentName}
                      {msg.emotion && (
                        <span className="emotion-chip" style={{marginLeft: 6}}>
                          {msg.emotion}
                        </span>
                      )}
                    </div>
                    <div className={`chat-bubble chat-bubble-${isLeft ? 'left' : 'right'}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap'}}>
          {p1 && (
            <Link href={`/people/${p1.id}`} className="btn btn-secondary">
              View {p1.name}&apos;s profile
            </Link>
          )}
          {p2 && (
            <Link href={`/people/${p2.id}`} className="btn btn-secondary">
              View {p2.name}&apos;s profile
            </Link>
          )}
          <Link href="/rankings" className="btn btn-primary">
            See full rankings →
          </Link>
        </div>
      </main>
    </div>
  );
}
