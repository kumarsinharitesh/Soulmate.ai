export interface Person {
  id: string;
  name: string;
  linkedinUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  profileImageUrl?: string;
  status: 'pending' | 'analyzing' | 'ready' | 'error';
  createdAt: string;
  aiProvider?: 'gemini' | 'sarvam' | 'fallback';
  profile?: PersonProfile;
}

export interface PersonProfile {
  name: string;
  tagline: string;
  summary: string;
  needs: string[];
  hobbies: string[];
  interests: string[];
  values: string[];
  personality: string[];
  communicationStyle: string;
  lifeGoals: string[];
  dealbreakers: string[];
  loveLanguages: string[];
  careerVibe: string;
  energyLevel: 'low' | 'medium' | 'high' | 'very-high';
  socialBattery: 'introvert' | 'ambivert' | 'extrovert';
  linkedinSummary: string;
  instagramSummary: string;
  rawLinkedinData?: string;
  rawInstagramData?: string;
}

export interface DateSession {
  id: string;
  person1Id: string;
  person2Id: string;
  messages: DateMessage[];
  compatibilityScore: number;
  compatibilitySummary: string;
  highlights: string[];
  status: 'pending' | 'running' | 'complete' | 'error';
  createdAt: string;
}

export interface DateMessage {
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  emotion?: string;
}

export interface CompatibilityRanking {
  personId: string;
  rankings: RankedMatch[];
}

export interface RankedMatch {
  personId: string;
  score: number;
  summary: string;
  reasons: string[];
  dateSessionId?: string;
}

export interface ScrapedLinkedIn {
  name?: string;
  headline?: string;
  summary?: string;
  experience?: string[];
  education?: string[];
  skills?: string[];
  location?: string;
  raw?: string;
}

export interface ScrapedInstagram {
  username?: string;
  fullName?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  recentCaptions?: string[];
  highlights?: string[];
  raw?: string;
}
