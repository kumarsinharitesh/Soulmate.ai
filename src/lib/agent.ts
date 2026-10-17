import { GoogleGenerativeAI } from '@google/generative-ai';
import { PersonProfile, ScrapedLinkedIn, ScrapedInstagram, DateSession, DateMessage } from '@/types';
import { AIProvider, resolveProvider } from '@/lib/providers';

function getAI(apiKeyOverride?: string): GoogleGenerativeAI | null {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

async function generateSarvamJson(prompt: string, apiKeyOverride?: string): Promise<string> {
  const apiKey = apiKeyOverride?.trim() || process.env.SARVAM_API_KEY?.trim();
  if (!apiKey) throw new Error('SARVAM_API_KEY is not configured');
  const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
    body: JSON.stringify({
      model: process.env.SARVAM_MODEL || 'sarvam-105b',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.35,
    }),
  });
  if (!response.ok) throw new Error(`Sarvam request failed: ${response.status}`);
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error('Sarvam returned an empty response');
  return content.trim();
}

export async function analyzePersonProfile(
  linkedinData: ScrapedLinkedIn,
  instagramData: ScrapedInstagram,
  personName: string,
  preferredProvider?: AIProvider,
  apiKeyOverride?: string
): Promise<PersonProfile> {
  const genAI = getAI(apiKeyOverride);
  const provider = preferredProvider && apiKeyOverride ? preferredProvider : resolveProvider(preferredProvider);

  if (provider !== 'fallback') {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an expert relationship psychologist and dating profile analyst.

Analyze the following public profile data for ${personName} from their LinkedIn and Instagram profiles.
Based ONLY on the information provided from these two sources, create a deep, nuanced dating profile analysis.

== LINKEDIN DATA ==
Name: ${linkedinData.name || 'Unknown'}
Headline: ${linkedinData.headline || 'Not available'}
Location: ${linkedinData.location || 'Not specified'}
Summary: ${linkedinData.summary || 'Not available'}
Experience: ${linkedinData.experience?.join(' | ') || 'Not available'}
Skills: ${linkedinData.skills?.join(', ') || 'Not available'}
Raw snippet: ${(linkedinData.raw || '').substring(0, 2000)}

== INSTAGRAM DATA ==
Username: @${instagramData.username || ''}
Full Name: ${instagramData.fullName || 'Not available'}
Bio: ${instagramData.bio || 'Not available'}
Followers: ${instagramData.followersCount?.toLocaleString() || 'Not specified'}
Recent captions: ${instagramData.recentCaptions?.join(' | ') || 'Not available'}
Raw snippet: ${(instagramData.raw || '').substring(0, 2000)}

Respond ONLY with a valid JSON object (no markdown, no backticks) with this EXACT structure:
{
  "name": "${personName}",
  "tagline": "A punchy 1-line dating tagline in first person, capturing their essence",
  "summary": "A 3-4 sentence dating profile summary, written in first person as if they're describing themselves on a dating app",
  "needs": ["5-7 specific things they need in a partner - be specific and insightful"],
  "hobbies": ["5-8 hobbies based on their profiles"],
  "interests": ["5-8 intellectual/passion interests they seem to have"],
  "values": ["4-6 core values evident from their work and content"],
  "personality": ["4-6 personality traits - be specific, not generic"],
  "communicationStyle": "1-2 sentences describing how they communicate and what they need from a partner communication-wise",
  "lifeGoals": ["3-5 life goals evident from their profiles"],
  "dealbreakers": ["3-5 likely dealbreakers based on their values and lifestyle"],
  "loveLanguages": ["2-3 likely love languages"],
  "careerVibe": "1 sentence about how their career identity shows up in relationships",
  "energyLevel": "medium",
  "socialBattery": "extrovert",
  "linkedinSummary": "2 sentences summarizing what LinkedIn reveals about them as a dating prospect",
  "instagramSummary": "2 sentences summarizing what Instagram reveals about them as a dating prospect"
}

For energyLevel use: "low", "medium", "high", or "very-high"
For socialBattery use: "introvert", "ambivert", or "extrovert"`;

      const text = provider === 'sarvam'
        ? await generateSarvamJson(prompt, apiKeyOverride)
        : (await model!.generateContent(prompt)).response.text().trim();

      const cleanText = text
        .replace(/^```json\n?/i, '')
        .replace(/^```\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();

      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as PersonProfile;
      }
    } catch (err) {
      console.warn(`${provider} API call failed, falling back to heuristic profile engine:`, err);
    }
  }

  // Resilient heuristic profile generator based on scraped data
  const name = personName || linkedinData.name || instagramData.fullName || 'Innovator';
  const headline = linkedinData.headline || 'Thought Leader & Creator';
  const bio = instagramData.bio || '';
  const skills = linkedinData.skills || ['Leadership', 'Creativity', 'Communication', 'Strategy'];

  return {
    name,
    tagline: `Passionate about building what matters and finding someone who brings their own spark.`,
    summary: `I'm a driven creator and thinker who cares deeply about doing meaningful work. When I'm away from work, I love exploring culture, having long unfiltered conversations, and recharging in nature. Looking for an equal who is curious, emotionally grounded, and unapologetically ambitious.`,
    needs: [
      'Intellectual curiosity and ability to engage in spirited discussions',
      'Respect for creative flow and demanding schedules',
      'Deep emotional maturity and proactive communication',
      'Shared desire for continuous personal growth',
      'A warm sense of humor to balance intensity'
    ],
    hobbies: ['Reading & writing', 'Travel & culinary exploration', 'Fitness & outdoor hikes', 'Photography & art', 'Music concerts'],
    interests: [...skills.slice(0, 3), 'Human psychology', 'Philosophy & mindfulness', 'Design & culture'],
    values: ['Integrity', 'Authenticity', 'Continuous Growth', 'Empathy', 'Adventure'],
    personality: ['Driven', 'Reflective', 'Warm', 'Resilient', 'Charismatic'],
    communicationStyle: 'Direct and heartfelt. Prefers discussing real feelings and ideas rather than superficial small talk.',
    lifeGoals: [
      'Create lasting impact through work and community',
      'Cultivate deep, loving lifelong partnerships',
      'Travel the world with intentional curiosity'
    ],
    dealbreakers: [
      'Lack of ambition or curiosity',
      'Passive aggressiveness or stonewalling',
      'Cynicism and negativity'
    ],
    loveLanguages: ['Quality Time', 'Words of Affirmation', 'Physical Touch'],
    careerVibe: `Their work as ${headline.substring(0, 50)} shapes their world, requiring a partner who celebrates independence.`,
    energyLevel: 'high',
    socialBattery: 'ambivert',
    linkedinSummary: `LinkedIn showcases a proven track record as ${headline.substring(0, 80)}, demonstrating discipline, ambition, and professional respect.`,
    instagramSummary: `@${instagramData.username || 'user'} on Instagram reveals ${bio ? `a personal voice: "${bio.substring(0, 80)}"` : 'a curated glimpse into their creative lifestyle, travels, and candid moments'}.`,
    rawLinkedinData: linkedinData.raw?.substring(0, 1000),
    rawInstagramData: instagramData.raw?.substring(0, 1000)
  };
}

export async function runAgentDate(
  agent1Profile: PersonProfile,
  agent2Profile: PersonProfile,
  agent1Id: string,
  agent2Id: string
): Promise<{ messages: DateMessage[]; compatibilityScore: number; compatibilitySummary: string; highlights: string[] }> {
  const genAI = getAI();
  const provider = resolveProvider();

  if (provider !== 'fallback') {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are simulating a dating conversation between two AI agents, each representing a real person.

== AGENT 1: ${agent1Profile.name} ==
Tagline: ${agent1Profile.tagline}
Summary: ${agent1Profile.summary}
Needs: ${agent1Profile.needs.join(', ')}
Hobbies: ${agent1Profile.hobbies.join(', ')}
Values: ${agent1Profile.values.join(', ')}
Communication Style: ${agent1Profile.communicationStyle}
Social Battery: ${agent1Profile.socialBattery}
Life Goals: ${agent1Profile.lifeGoals.join(', ')}

== AGENT 2: ${agent2Profile.name} ==
Tagline: ${agent2Profile.tagline}
Summary: ${agent2Profile.summary}
Needs: ${agent2Profile.needs.join(', ')}
Hobbies: ${agent2Profile.hobbies.join(', ')}
Values: ${agent2Profile.values.join(', ')}
Communication Style: ${agent2Profile.communicationStyle}
Social Battery: ${agent2Profile.socialBattery}
Life Goals: ${agent2Profile.lifeGoals.join(', ')}

Simulate a natural, genuine first date conversation (6 exchanges) between these two agents.
Respond ONLY with valid JSON (no markdown):
{
  "messages": [
    {
      "agentId": "${agent1Id}",
      "agentName": "${agent1Profile.name}",
      "content": "What they say",
      "emotion": "curious/excited/thoughtful/warm"
    },
    {
      "agentId": "${agent2Id}",
      "agentName": "${agent2Profile.name}",
      "content": "What they say",
      "emotion": "curious/excited/thoughtful/warm"
    }
  ],
  "compatibilityScore": 84,
  "compatibilitySummary": "2-3 sentences on how well they match and why",
  "highlights": ["3-4 specific moments or topics where they connected or showed chemistry"]
}`;

      const text = provider === 'sarvam'
        ? await generateSarvamJson(prompt)
        : (await model!.generateContent(prompt)).response.text().trim();
      const cleanText = text.replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        const now = new Date();
        data.messages = data.messages.map((msg: DateMessage, i: number) => ({
          ...msg,
          timestamp: new Date(now.getTime() - (data.messages.length - i) * 60000).toISOString(),
        }));
        return data;
      }
    } catch (err) {
      console.warn(`${provider} API call failed for date session, falling back to agent dialog engine:`, err);
    }
  }

  // Sophisticated heuristic fallback dialog simulation
  const now = new Date();
  const sharedTopic = agent1Profile.interests?.[0] || agent2Profile.interests?.[0] || 'growth and purpose';
  const sharedValue = agent1Profile.values?.[0] || agent2Profile.values?.[0] || 'authenticity';

  const messages: DateMessage[] = [
    {
      agentId: agent1Id,
      agentName: agent1Profile.name,
      content: `I was reading through your story and what struck me immediately is how you embody ${sharedValue}. So many people talk about it, but you've actually built your life around it. What made you commit to that path?`,
      timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
      emotion: 'curious'
    },
    {
      agentId: agent2Id,
      agentName: agent2Profile.name,
      content: `That goes straight to the heart of it. Early on, I realized that trying to fit into standard expectations was draining my energy. When you lean into who you actually are, work stops feeling like an obligation and becomes art. How do you balance your intensity with real downtime?`,
      timestamp: new Date(now.getTime() - 4 * 60000).toISOString(),
      emotion: 'open'
    },
    {
      agentId: agent1Id,
      agentName: agent1Profile.name,
      content: `Honestly, it's an ongoing practice. My ${agent1Profile.energyLevel} energy means my mind is always exploring new frontiers like ${sharedTopic}. But with the right partner, I don't need to perform — just having quiet presence and genuine laughter is the best reset.`,
      timestamp: new Date(now.getTime() - 3 * 60000).toISOString(),
      emotion: 'thoughtful'
    },
    {
      agentId: agent2Id,
      agentName: agent2Profile.name,
      content: `I love that. For me, intimacy is about feeling safe enough to drop the armor. When I see someone who is comfortable with both big dreams and vulnerable quiet moments, that's what creates an enduring connection.`,
      timestamp: new Date(now.getTime() - 2 * 60000).toISOString(),
      emotion: 'warm'
    },
    {
      agentId: agent1Id,
      agentName: agent1Profile.name,
      content: `We seem to speak the same language on what matters most. Life is too short for superficial banter when there is so much beauty and purpose to explore together.`,
      timestamp: new Date(now.getTime() - 1 * 60000).toISOString(),
      emotion: 'excited'
    },
    {
      agentId: agent2Id,
      agentName: agent2Profile.name,
      content: `Completely agreed. Let's make sure this conversation continues beyond this first date. There is so much more to discover here.`,
      timestamp: now.toISOString(),
      emotion: 'joyful'
    }
  ];

  // A date should produce the same result for the same two profiles. Random scores
  // make rankings jump on refresh and make the demo impossible to reproduce.
  const fingerprint = `${agent1Id}:${agent2Id}`.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  const score = 78 + (fingerprint % 13);

  return {
    messages,
    compatibilityScore: score,
    compatibilitySummary: `${agent1Profile.name} and ${agent2Profile.name} established quick rapport around ${sharedValue} and their shared passion for ${sharedTopic}. Both agents communicated with emotional clarity and mutual respect, indicating high potential for both intellectual stimulation and supportive partnership.`,
    highlights: [
      `Immediate mutual respect anchored in ${sharedValue}`,
      `Engaged discussion comparing their daily rhythms and recharge practices`,
      `Both expressed a desire for unfiltered emotional honesty over performative charm`,
      `Natural chemistry blending ${agent1Profile.name}'s vision with ${agent2Profile.name}'s warmth`
    ]
  };
}

export async function generateRankings(
  personProfile: PersonProfile,
  allProfiles: Array<{ id: string; profile: PersonProfile }>,
  dateSessions: DateSession[]
): Promise<Array<{ personId: string; score: number; summary: string; reasons: string[] }>> {
  const genAI = getAI();
  const provider = resolveProvider();

  if (provider !== 'fallback') {
    try {
      const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const othersText = allProfiles
        .filter(p => p.profile.name !== personProfile.name)
        .slice(0, 10)
        .map(p => `ID: ${p.id}
Name: ${p.profile.name}
Summary: ${p.profile.summary}
Values: ${p.profile.values.join(', ')}
Needs: ${p.profile.needs.join(', ')}`)
        .join('\n\n---\n\n');

      const dateContext = dateSessions
        .map(d => `Session ${d.id}: Score ${d.compatibilityScore} - ${d.compatibilitySummary}`)
        .join('\n');

      const prompt = `You are a compatibility expert. Rank potential matches for ${personProfile.name}.

== PERSON TO RANK FOR ==
Name: ${personProfile.name}
Summary: ${personProfile.summary}
Needs: ${personProfile.needs.join(', ')}
Values: ${personProfile.values.join(', ')}
Communication Style: ${personProfile.communicationStyle}

== POTENTIAL MATCHES ==
${othersText}

== DATE SESSION RESULTS ==
${dateContext || 'None'}

Respond ONLY with valid JSON array:
[
  {
    "personId": "their-id",
    "score": 85,
    "summary": "1-2 sentence compatibility rationale",
    "reasons": ["3 specific reasons"]
  }
]`;

      const text = provider === 'sarvam'
        ? await generateSarvamJson(prompt)
        : (await model!.generateContent(prompt)).response.text().trim();
      const cleanText = text.replace(/^```json\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn(`${provider} API call failed for rankings, falling back to ranking engine:`, err);
    }
  }

  // Fallback ranking algorithm
  return allProfiles
    .filter(p => p.profile.name !== personProfile.name)
    .map(candidate => {
      // `personProfile` does not carry an id. The API passes only sessions that
      // belong to the person being ranked, so match the candidate on either side.
      const existing = dateSessions.find(
        s => s.person1Id === candidate.id || s.person2Id === candidate.id
      );

      const p1Vals = new Set((personProfile.values || []).map(v => v.toLowerCase()));
      const sharedVals = (candidate.profile.values || []).filter(v => p1Vals.has(v.toLowerCase()));

      let score = 70 + sharedVals.length * 4;
      if (existing) score = existing.compatibilityScore;
      score = Math.min(95, Math.max(60, score));

      return {
        personId: candidate.id,
        score,
        summary: `${personProfile.name} and ${candidate.profile.name} connect on ${sharedVals.join(', ') || 'shared ambition'}, creating a dynamic relationship balance.`,
        reasons: [
          `Shared alignment on ${sharedVals[0] || 'purpose'}`,
          `Complementary energy dynamics between ${personProfile.energyLevel} and ${candidate.profile.energyLevel}`,
          `Strong respect for each other's dedication to their craft`
        ]
      };
    })
    .sort((a, b) => b.score - a.score);
}
