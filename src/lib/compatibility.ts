import { PersonProfile } from '@/types';

const words = (items: string[]) => new Set(items.flatMap(item => item.toLowerCase().match(/[a-z]{4,}/g) || []).filter(word => !['with', 'that', 'their', 'they', 'from', 'into', 'about', 'someone', 'partner', 'strong', 'other'].includes(word)));
const common = (left: string[], right: string[]) => left.filter(item => right.some(candidate => candidate.toLowerCase() === item.toLowerCase()));
const pairHash = (left: string, right: string) => {
  let hash = 2166136261;
  for (const char of [left, right].sort().join('|')) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
};

export function assessCompatibility(p1: PersonProfile, p2: PersonProfile, id1 = p1.name, id2 = p2.name) {
  const sharedValues = common(p1.values || [], p2.values || []);
  const sharedInterests = common([...(p1.interests || []), ...(p1.hobbies || [])], [...(p2.interests || []), ...(p2.hobbies || [])]);
  const sharedGoals = common(p1.lifeGoals || [], p2.lifeGoals || []);
  const p1NeedWords = words(p1.needs || []);
  const p2OfferWords = words([...(p2.values || []), ...(p2.personality || []), p2.communicationStyle || '']);
  const p2NeedWords = words(p2.needs || []);
  const p1OfferWords = words([...(p1.values || []), ...(p1.personality || []), p1.communicationStyle || '']);
  const reciprocalNeeds = [...p1NeedWords].filter(word => p2OfferWords.has(word)).length + [...p2NeedWords].filter(word => p1OfferWords.has(word)).length;

  const battery = p1.socialBattery === p2.socialBattery ? 14 : p1.socialBattery === 'ambivert' || p2.socialBattery === 'ambivert' ? 12 : 9;
  const energy = p1.energyLevel === p2.energyLevel ? 13 : new Set([p1.energyLevel, p2.energyLevel]).size === 2 && ['high', 'very-high'].includes(p1.energyLevel) && ['high', 'very-high'].includes(p2.energyLevel) ? 11 : 8;
  // The small deterministic adjustment avoids arbitrary ties after the evidence
  // score is calculated, while keeping the profile-derived signals dominant.
  const score = Math.max(54, Math.min(96, 43 + Math.min(18, sharedValues.length * 6) + Math.min(12, sharedInterests.length * 4) + Math.min(8, sharedGoals.length * 4) + Math.min(8, reciprocalNeeds) + battery + energy + (pairHash(id1, id2) % 17 - 8)));
  const anchor = sharedValues[0] || sharedInterests[0] || `${p1.values?.[0] || 'authenticity'} and ${p2.values?.[0] || 'growth'}`;
  return {
    score,
    sharedValues,
    sharedInterests,
    sharedGoals,
    summary: `${p1.name} and ${p2.name} align around ${anchor}. Their ${p1.socialBattery}/${p2.socialBattery} social rhythm and ${p1.energyLevel}/${p2.energyLevel} energy profile ${p1.energyLevel === p2.energyLevel ? 'move at a similar pace' : 'create a complementary pace'}.`,
    reasons: [
      sharedValues.length ? `Shared values: ${sharedValues.slice(0, 2).join(', ')}` : `Value exchange: ${p1.values?.[0] || 'authenticity'} meets ${p2.values?.[0] || 'growth'}`,
      sharedInterests.length ? `Shared interests: ${sharedInterests.slice(0, 2).join(', ')}` : `Different interests can create fresh date ideas`,
      reciprocalNeeds ? `Their stated needs and personal strengths show reciprocal fit` : `Their communication and lifestyle patterns were considered`,
    ],
  };
}
