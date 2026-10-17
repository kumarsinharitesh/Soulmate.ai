import { Person, DateSession, CompatibilityRanking, RankedMatch, PersonProfile } from '@/types';
import { SEED_PEOPLE } from '@/lib/seed-data';
import { SEED_DATE_SESSIONS } from '@/lib/seed-dates';
import { assessCompatibility } from '@/lib/compatibility';

// Preserve in-memory store across hot module reloading in development
const globalStore = globalThis as unknown as {
  __dating_people?: Map<string, Person>;
  __dating_sessions?: Map<string, DateSession>;
  __dating_rankings?: Map<string, CompatibilityRanking>;
};

if (!globalStore.__dating_people) {
  globalStore.__dating_people = new Map<string, Person>();
}
if (!globalStore.__dating_sessions) {
  globalStore.__dating_sessions = new Map<string, DateSession>();
}
if (!globalStore.__dating_rankings) {
  globalStore.__dating_rankings = new Map<string, CompatibilityRanking>();
}

const people = globalStore.__dating_people;
const dateSessions = globalStore.__dating_sessions;
const rankings = globalStore.__dating_rankings;

function calculateCompatibility(p1: PersonProfile, p2: PersonProfile) {
  return assessCompatibility(p1, p2);
  /*
  // 1. Shared values calculation
  const p1Values = new Set((p1.values || []).map(v => v.toLowerCase()));
  const p2Values = (p2.values || []).map(v => v.toLowerCase());
  const sharedValues = p2Values.filter(v => p1Values.has(v));

  // 2. Shared or complementary interests/hobbies
  const p1Interests = new Set([...(p1.interests || []), ...(p1.hobbies || [])].map(i => i.toLowerCase()));
  const p2Interests = [...(p2.interests || []), ...(p2.hobbies || [])].map(i => i.toLowerCase());
  const sharedInterests = p2Interests.filter(i => p1Interests.has(i));

  // 3. Social battery harmony
  let batteryScore = 15;
  if (p1.socialBattery === p2.socialBattery) {
    batteryScore = 18;
  } else if (
    (p1.socialBattery === 'ambivert' && (p2.socialBattery === 'extrovert' || p2.socialBattery === 'introvert')) ||
    (p2.socialBattery === 'ambivert' && (p1.socialBattery === 'extrovert' || p1.socialBattery === 'introvert'))
  ) {
    batteryScore = 20; // Ambiverts bridge both wonderfully
  } else {
    batteryScore = 16; // Extrovert + Introvert balance
  }

  // 4. Energy level pairing
  let energyScore = 15;
  if (p1.energyLevel === p2.energyLevel) {
    energyScore = 20;
  } else if (
    (p1.energyLevel === 'high' && p2.energyLevel === 'very-high') ||
    (p1.energyLevel === 'very-high' && p2.energyLevel === 'high') ||
    (p1.energyLevel === 'medium' && p2.energyLevel === 'high')
  ) {
    energyScore = 18;
  } else {
    energyScore = 14;
  }

  // Base score 40 + factors
  let score = 42 + batteryScore + energyScore;
  score += Math.min(12, sharedValues.length * 3);
  score += Math.min(8, sharedInterests.length * 2);

  // Deterministic fine-tuning based on name strings to give unique variance between 64 and 93
  const hash = (p1.name + p2.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variance = (hash % 11) - 5;
  score = Math.max(62, Math.min(95, score + variance));

  // Synthesis of personalized summary and reasons
  const topValues = sharedValues.length > 0
    ? sharedValues.slice(0, 2).map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(' and ')
    : `${p1.values?.[0] || 'authenticity'} and ${p2.values?.[0] || 'growth'}`;

  const summary = `${p1.name} and ${p2.name} share a compelling dynamic centered on ${topValues}. ` +
    `Their ${p1.energyLevel} and ${p2.energyLevel} energy levels provide ` +
    `${p1.energyLevel === p2.energyLevel ? 'a natural, synchronized rhythm' : 'a stimulating balance of pace and depth'}, ` +
    `while their mutual commitment to their life's work creates an innate emotional understanding.`;

  const reasons = [
    sharedValues.length > 0
      ? `Strong philosophical alignment on ${topValues}`
      : `Complementary core values: ${p1.values?.[0]} meets ${p2.values?.[0]}`,
    sharedInterests.length > 0
      ? `Mutual lifestyle passions including ${sharedInterests.slice(0, 2).join(', ')}`
      : `Harmonious communication styles that balance ${p1.personality?.[0] || 'focus'} with ${p2.personality?.[0] || 'depth'}`,
    `Compatible social dynamics between ${p1.socialBattery} and ${p2.socialBattery} temperaments`,
  ];

  return { score, summary, reasons }; */
}

export function ensureInitialized(): void {
  if (people.size > 0) return;

  // 1. Seed People
  SEED_PEOPLE.forEach(p => people.set(p.id, p));

  // 2. Seed Dates
  SEED_DATE_SESSIONS.forEach(s => dateSessions.set(s.id, s));

  // 3. Generate Complete Compatibility Rankings for ALL 25 People
  const allReadyPeople = Array.from(people.values()).filter(p => p.status === 'ready' && p.profile);

  for (const person of allReadyPeople) {
    if (!person.profile) continue;

    const matches: RankedMatch[] = [];

    for (const candidate of allReadyPeople) {
      if (candidate.id === person.id || !candidate.profile) continue;

      // Check for pre-seeded or existing date session
      const existingSession = Array.from(dateSessions.values()).find(
        s =>
          (s.person1Id === person.id && s.person2Id === candidate.id) ||
          (s.person1Id === candidate.id && s.person2Id === person.id)
      );

      if (existingSession && existingSession.status === 'complete') {
        matches.push({
          personId: candidate.id,
          score: existingSession.compatibilityScore,
          summary: existingSession.compatibilitySummary,
          reasons: existingSession.highlights || [
            'Demonstrated strong chemistry in simulated agent date session',
            'Mutual emotional and intellectual resonance',
          ],
          dateSessionId: existingSession.id,
        });
      } else {
        const comp = calculateCompatibility(person.profile, candidate.profile);
        matches.push({
          personId: candidate.id,
          score: comp.score,
          summary: comp.summary,
          reasons: comp.reasons,
        });
      }
    }

    // Sort matches in descending order of compatibility score
    matches.sort((a, b) => b.score - a.score);

    rankings.set(person.id, {
      personId: person.id,
      rankings: matches,
    });
  }
}

export function getStore() {
  ensureInitialized();
  return { people, dateSessions, rankings };
}

export function getPeople(): Person[] {
  ensureInitialized();
  return Array.from(people.values());
}

export function getPerson(id: string): Person | undefined {
  ensureInitialized();
  return people.get(id);
}

export function setPerson(person: Person): void {
  ensureInitialized();
  people.set(person.id, person);
}

export function getDateSession(id: string): DateSession | undefined {
  ensureInitialized();
  return dateSessions.get(id);
}

export function getDateSessionsForPair(p1: string, p2: string): DateSession | undefined {
  ensureInitialized();
  return Array.from(dateSessions.values()).find(
    s =>
      (s.person1Id === p1 && s.person2Id === p2) ||
      (s.person1Id === p2 && s.person2Id === p1)
  );
}

export function setDateSession(session: DateSession): void {
  ensureInitialized();
  dateSessions.set(session.id, session);

  // Keep already-generated rankings honest when a new agent date completes.
  // This also makes a just-run date immediately visible in both people's lists.
  if (session.status === 'complete') {
    for (const personId of [session.person1Id, session.person2Id]) {
      const otherId = personId === session.person1Id ? session.person2Id : session.person1Id;
      const ranking = rankings.get(personId);
      if (!ranking) continue;
      const match = ranking.rankings.find(item => item.personId === otherId);
      if (!match) continue;
      match.score = session.compatibilityScore;
      match.summary = session.compatibilitySummary;
      match.reasons = session.highlights;
      match.dateSessionId = session.id;
      ranking.rankings.sort((a, b) => b.score - a.score);
    }
  }
}

export function getAllDateSessions(): DateSession[] {
  ensureInitialized();
  return Array.from(dateSessions.values());
}

export function getRankings(personId: string): CompatibilityRanking | undefined {
  ensureInitialized();
  return rankings.get(personId);
}

export function setRankings(ranking: CompatibilityRanking): void {
  ensureInitialized();
  rankings.set(ranking.personId, ranking);
}

export function getAllRankings(): CompatibilityRanking[] {
  ensureInitialized();
  return Array.from(rankings.values());
}

export function clearAll(): void {
  people.clear();
  dateSessions.clear();
  rankings.clear();
}
