'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Person } from '@/types';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getSocialBatteryBadge(sb: string) {
  const map: Record<string, {label: string; cls: string}> = {
    'extrovert': {label: '⚡ Extrovert', cls: 'badge-gold'},
    'ambivert': {label: '◐ Ambivert', cls: 'badge-purple'},
    'introvert': {label: '◯ Introvert', cls: 'badge-cyan'},
  };
  return map[sb] || {label: sb, cls: 'badge-purple'};
}

export default function PeoplePage() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ready' | 'pending'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/people')
      .then(r => r.json())
      .then(data => {
        setPeople(data);
        setLoading(false);
      });
  }, []);

  const filtered = people.filter(p => {
    if (filter === 'ready' && p.status !== 'ready') return false;
    if (filter === 'pending' && p.status === 'ready') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">✦ Soulmate.ai</Link>
            <div className="nav-links">
              <Link href="/people" className="nav-link active">People</Link>
              <Link href="/dates" className="nav-link">Dates</Link>
              <Link href="/rankings" className="nav-link">Rankings</Link>
              <Link href="/add" className="btn btn-primary" style={{padding: '8px 20px', fontSize: '0.88rem'}}>
                + Add Person
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container" style={{paddingTop: 40, paddingBottom: 80}}>
        <div className="page-header" style={{textAlign: 'left', padding: '40px 0 32px'}}>
          <h1>
            The <em style={{fontStyle: 'italic', background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>25 people</em> dating
          </h1>
          <p style={{color: 'var(--text-secondary)', marginTop: 8, fontSize: '1rem', fontFamily: 'DM Sans, sans-serif'}}>
            Real public figures. Each one analyzed from their LinkedIn and Instagram only.
          </p>
        </div>

        {/* Filters */}
        <div style={{display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center'}}>
          <input
            className="input"
            style={{maxWidth: 280, padding: '10px 16px'}}
            placeholder="Search people..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 4, borderRadius: 9999}}>
            {(['all', 'ready', 'pending'] as const).map(f => (
              <button
                key={f}
                className={`tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
                style={{flex: 'none', padding: '8px 16px', fontSize: '0.85rem'}}
              >
                {f === 'all' ? `All (${people.length})` :
                 f === 'ready' ? `Analyzed (${people.filter(p=>p.status==='ready').length})` :
                 `Pending (${people.filter(p=>p.status!=='ready').length})`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24}}>
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="card" style={{height: 220}}>
                <div className="skeleton" style={{height: '100%'}} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24}}>
            {filtered.map((person, i) => (
                <article
                  key={person.id}
                  className="card"
                  role="link"
                  tabIndex={0}
                  aria-label={`Open ${person.name}'s profile`}
                  onClick={() => router.push(`/people/${person.id}`)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      router.push(`/people/${person.id}`);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    animation: `fadeIn 0.3s ease-out ${i * 0.04}s both`,
                  }}
                >
                  {/* Header */}
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16}}>
                    <div
                      className="avatar avatar-lg"
                      style={{
                        background: `linear-gradient(135deg, ${['#a855f7','#ec4899','#06b6d4','#f59e0b'][i % 4]}, ${['#ec4899','#06b6d4','#f59e0b','#a855f7'][i % 4]})`,
                      }}
                    >
                      {getInitials(person.name)}
                    </div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
                        <h3 style={{fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Playfair Display, serif'}}>{person.name}</h3>
                        <div className={`status-dot status-${person.status}`} title={person.status} />
                      </div>
                      {person.profile && (
                        <p style={{fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, fontFamily: 'DM Sans, sans-serif'}}>
                          {person.profile.tagline}
                        </p>
                      )}
                      {!person.profile && (
                        <span className="badge badge-purple" style={{fontSize: '0.75rem'}}>
                          {person.status === 'analyzing' ? '⟳ Analyzing...' : 'Not yet analyzed'}
                        </span>
                      )}
                    </div>
                  </div>

                  {person.profile && (
                    <>
                      {/* Energy + social battery */}
                      <div style={{display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap'}}>
                        <span className={`badge ${getSocialBatteryBadge(person.profile.socialBattery).cls}`} style={{fontSize: '0.75rem'}}>
                          {getSocialBatteryBadge(person.profile.socialBattery).label}
                        </span>
                        <span className="badge badge-pink" style={{fontSize: '0.75rem'}}>
                          ⚡ {person.profile.energyLevel?.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Hobbies */}
                      <div style={{display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16}}>
                        {person.profile.hobbies.slice(0, 4).map((h, i) => (
                          <span key={i} className="tag">{h}</span>
                        ))}
                        {person.profile.hobbies.length > 4 && (
                          <span className="tag" style={{color: 'var(--text-muted)'}}>+{person.profile.hobbies.length - 4}</span>
                        )}
                      </div>

                      {/* Links */}
                      <div style={{display: 'flex', gap: 8, marginTop: 'auto'}}>
                        <a
                          href={person.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="btn btn-ghost"
                          style={{padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, background: 'rgba(0,119,181,0.1)', color: '#60a5fa', border: '1px solid rgba(0,119,181,0.2)'}}
                        >
                          in LinkedIn
                        </a>
                        <a
                          href={person.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="btn btn-ghost"
                          style={{padding: '6px 12px', fontSize: '0.78rem', borderRadius: 8, background: 'rgba(225,48,108,0.1)', color: '#f9a8d4', border: '1px solid rgba(225,48,108,0.2)'}}
                        >
                          📷 @{person.instagramHandle}
                        </a>
                      </div>
                    </>
                  )}

                  {/* Status banner */}
                  {person.status === 'pending' && (
                    <div style={{marginTop: 16, padding: '10px 14px', background: 'rgba(168,85,247,0.05)', borderRadius: 8, border: '1px solid rgba(168,85,247,0.1)', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center'}}>
                      Click to analyze this person&apos;s profile →
                    </div>
                  )}
                </article>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <span className="icon">🔍</span>
            <h3>No results found</h3>
            <p>Try a different search term</p>
          </div>
        )}
      </main>
    </div>
  );
}
