import { DateSession } from '@/types';

export const SEED_DATE_SESSIONS: DateSession[] = [
  {
    id: 'date-garyvee-marieforleo',
    person1Id: 'gary-vaynerchuk',
    person2Id: 'marie-forleo',
    compatibilityScore: 82,
    compatibilitySummary: "Gary and Marie are a high-energy collision of ambition and artistry. They share a relentless drive to build, but where Gary charges ahead with pure hustle, Marie brings intentionality and creative depth. The chemistry is electric but requires negotiation — Gary needs to slow down enough to appreciate Marie's nuance, while Marie needs to embrace some of Gary's beautiful chaos.",
    highlights: [
      "Instant spark when they discovered they both built their businesses before the 'rules' of social media existed",
      "Marie challenged Gary's hustle-at-all-costs narrative — he actually listened",
      "Shared laughter over both being misunderstood by corporate audiences",
      "Tension point: Gary's 24/7 pace vs Marie's need for creative solitude"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'gary-vaynerchuk',
        agentName: 'Gary Vaynerchuk',
        content: "Okay I have to say — I've been watching your work for years and what you built with MarieTV before 'content' was even a category? That's the real sh*t. Most people didn't see the opportunity. You saw it and you executed. That's rare.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'excited'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "That actually means something coming from you, because I know you're not handing out compliments for sport. But I want to push back on something — you talk a lot about hustle being the answer, and I built my business with a lot of hustle too, but at some point I had to learn that creativity and rest aren't opposite to ambition. They're fuel for it.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'thoughtful'
      },
      {
        agentId: 'gary-vaynerchuk',
        agentName: 'Gary Vaynerchuk',
        content: "You're not wrong. I've been saying that more lately too. Self-awareness is the thing. Like, hustle without knowing WHY you're hustling is just running in circles with energy. I burned out people I loved because I thought more was always more. That's not a philosophy, that's fear wearing a productivity costume.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'vulnerable'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "Okay I was not expecting that level of honesty in the first ten minutes. I respect it. Tell me something — when you're NOT working, when you actually turn it off, what does Gary Vaynerchuk do?",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'curious'
      },
      {
        agentId: 'gary-vaynerchuk',
        agentName: 'Gary Vaynerchuk',
        content: "Sports cards and basketball, honestly. There's something about the sports card market that's pure market theory — supply, demand, sentiment, nostalgia. It's where I'm fully present because I genuinely love it, not because I should. What about you?",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'relaxed'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "Dance. I danced professionally before I was an entrepreneur. That's actually where I learned everything — discipline, creativity, performing under pressure, recovering from failure immediately. There's a flow state in dance that nothing else gives me. Also cooking. But slow cooking — the kind where you're not multitasking, you're just IN it.",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'joyful'
      },
      {
        agentId: 'gary-vaynerchuk',
        agentName: 'Gary Vaynerchuk',
        content: "See, that's interesting because those things require presence. You can't scroll while you're dancing. I think what I'm realizing talking to you is that we both found the thing that forces us to be nowhere else. Mine is cards and sports. Yours is dance and slow cooking. That's actually the same answer in different clothes.",
        timestamp: new Date(Date.now() - 3240000).toISOString(),
        emotion: 'amused'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "That observation is far too insightful for a first date and I'm keeping it. Okay real question: what would it look like for someone to actually date Gary Vaynerchuk? Because I've seen the schedule. I've seen what you put out. That's not a 9-to-5 life.",
        timestamp: new Date(Date.now() - 3180000).toISOString(),
        emotion: 'direct'
      },
      {
        agentId: 'gary-vaynerchuk',
        agentName: 'Gary Vaynerchuk',
        content: "Honestly? It requires someone who has their own fire. Because if they need mine to burn, we'll both get burned. I can be fully present in short bursts that are more real than most people's full years. But I need someone who isn't waiting for me — they're running their own race and we cross paths at the finish line and celebrate each other. Does that make sense or does it sound like I'm making excuses for being unavailable?",
        timestamp: new Date(Date.now() - 3120000).toISOString(),
        emotion: 'self-aware'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "It makes total sense, and no, it doesn't sound like an excuse — it sounds like self-knowledge. The thing is, I need something similar. I have deep work periods where I'm in creative flow and I can't be interrupted. I need someone who understands that disappearing into work sometimes isn't abandonment, it's how I love. So maybe we'd actually understand each other's unavailability better than most.",
        timestamp: new Date(Date.now() - 3060000).toISOString(),
        emotion: 'hopeful'
      }
    ]
  },
  {
    id: 'date-timferriss-brenebrown',
    person1Id: 'tim-ferriss',
    person2Id: 'brene-brown',
    compatibilityScore: 89,
    compatibilitySummary: "Tim and Brené are a deeply compelling match — two people who have turned their own psychological journeys into their life's work, and who find the scientific approach to inner life equally fascinating. Tim's precision meets Brené's emotional courage, and both have done enough work to know how to be actually present. This feels like a partnership that could go very deep, very fast.",
    highlights: [
      "Both immediately referenced their mental health journeys without being prompted — rare and bonding",
      "Tim's analytical framework meeting Brené's vulnerability research created an unexpected intellectual chemistry",
      "Shared love of long-form podcasting as a way of thinking out loud",
      "Both laughed about being more comfortable on stage than at a dinner party"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "I've actually assigned your TED Talk in some of my coaching contexts. 'The Power of Vulnerability' — I remember watching it and thinking, this person has operationalized something that most people only experience as emotion. You turned feeling into data. How did that happen?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'curious'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "God, 'operationalized vulnerability' — only you would say that and I mean that as the highest compliment. It happened because I started as a grounded theory researcher who wanted to understand connection, and then I fell into shame data like Alice into a rabbit hole. Six years of data later I had a breakdown — what I call a spiritual awakening, what my therapist calls a breakdown — and I had to live the research. You can't study courage from the stands.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'reflective'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "I want to come back to that breakdown because — and I'm going to share something I don't usually share on a first meeting — I had a period in my 30s where I was seriously suicidal. And what got me through was almost exactly what your research describes: being known by someone. Being actually seen. Not fixed, not advised — seen. Your work helped me make sense of that afterward.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'vulnerable'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "Thank you for trusting me with that. And that's exactly it — shame needs secrecy to survive. You named it just now, in a coffee shop, to someone you just met, and look: the room didn't swallow you. That's courage. That's what I try to tell people — vulnerability isn't the absence of strength, it's the most accurate measure of it.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'moved'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "What's your relationship to solitude? I ask because I'm an extreme introvert who performs as an extrovert for work, and it creates this constant tension in relationships. People assume the public person is the real person.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'thoughtful'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "Oh my God, I'm exactly the same. I'm a huge football fan, I love a good rowdy time, but I recharge alone. In fact — this is embarrassing — I've faked phone calls to get out of social situations that went too long. What I need in a relationship is someone who doesn't interpret my needing to disappear as rejection. It's regulation, not abandonment.",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'amused'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "That's... exactly my situation. And I've caused a lot of pain by not articulating that clearly enough. People take it personally. It's not personal — it's biological. What do you do for solitude when you have it?",
        timestamp: new Date(Date.now() - 3240000).toISOString(),
        emotion: 'engaged'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "Paint. Badly. I paint very badly and I love it because no one is watching and there's no audience. I'm just making marks that mean things to me. Also long baths with terrible romance novels that I would never admit to reading publicly. And you?",
        timestamp: new Date(Date.now() - 3180000).toISOString(),
        emotion: 'playful'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "Argentine tango, when I'm in a city with a good milonga scene. And writing that I'll never publish — the kind where you find out what you actually think. But I'm curious: what would it look like to have a partner who truly GETS you? Not just accommodates you, but genuinely understands?",
        timestamp: new Date(Date.now() - 3120000).toISOString(),
        emotion: 'sincere'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "Someone who doesn't need me to perform wholeness all the time. I study courage for a living — that means I get to be a mess sometimes, too. I need a partner who can sit in that without rushing to fix it. And someone who can be fully present in a hard conversation without getting defensive or shutting down. I think you could do that. The fact that you shared what you just shared in the last ten minutes — that tells me you have the equipment.",
        timestamp: new Date(Date.now() - 3060000).toISOString(),
        emotion: 'direct'
      }
    ]
  },
  {
    id: 'date-simonsinek-jayshetty',
    person1Id: 'simon-sinek',
    person2Id: 'jay-shetty',
    compatibilityScore: 76,
    compatibilitySummary: "Simon and Jay share the language of purpose and leadership, but come from different philosophical traditions — Simon from organizational behavior and secular leadership theory, Jay from ancient wisdom and monastic practice. The conversation is rich and respectful, though there's a risk of becoming a mutual admiration society rather than genuine romantic tension.",
    highlights: [
      "Both lit up talking about why they do what they do rather than what they do",
      "Jay's monk perspective shifted something in Simon's thinking about the 'infinite game'",
      "Shared frustration with surface-level conversations that never go anywhere real",
      "Gentle disagreement about whether purpose can be taught or only discovered"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'simon-sinek',
        agentName: 'Simon Sinek',
        content: "I've been thinking about your background in monasticism and how that shaped you. I came to purpose through organizational study — the why of businesses. You came through lived renunciation. Do you think most people are capable of living with purpose, or is it a relatively rare calling?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'thoughtful'
      },
      {
        agentId: 'jay-shetty',
        agentName: 'Jay Shetty',
        content: "I think everyone has a dharma — a purpose unique to them, not assigned from outside but discovered within. The monk training wasn't about becoming spiritual in the way people picture. It was about removing the noise that makes us forget what we already know. What I'd ask you is: do you think a WHY can be articulated, or can it only be lived?",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'curious'
      },
      {
        agentId: 'simon-sinek',
        agentName: 'Simon Sinek',
        content: "Both. Articulating it is how you clarify it. Living it is how you test it. But there's a danger I've seen — people articulate a beautiful why and then use it as a brand rather than a compass. The why becomes a product instead of a practice. I wonder if your monastic training protected you from that risk?",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'reflective'
      },
      {
        agentId: 'jay-shetty',
        agentName: 'Jay Shetty',
        content: "Completely. There was no audience in the ashram. You practiced in private with a teacher who saw everything. That accountability is what separates growth from performance. The challenge now is that I have a massive public audience, which creates its own gravitational pull toward performance. I meditate every morning partly to return to the version of myself that has no followers.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'sincere'
      },
      {
        agentId: 'simon-sinek',
        agentName: 'Simon Sinek',
        content: "That's a beautiful frame. 'The version of myself that has no followers.' I think about this in terms of the infinite game — the risk is optimizing for finite metrics when what we're actually playing is an infinite game. Tell me something: what does Jay Shetty need in a relationship that he can't build on a stage?",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'engaged'
      },
      {
        agentId: 'jay-shetty',
        agentName: 'Jay Shetty',
        content: "Presence without performance. On stage I give. In a relationship I need someone who gives back, not because of what I've accomplished but because of who I am when the cameras are off. Radhi — my wife — she met me before the fame and she still treats me like that person. That rootedness is irreplaceable. What about you?",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'warm'
      },
      {
        agentId: 'simon-sinek',
        agentName: 'Simon Sinek',
        content: "Someone who slows me down. I move fast intellectually — I can be three ideas ahead before I've finished explaining the first one. I need a partner who says 'wait, what did you mean by that?' Someone who doesn't let me gloss over things in conversation the way I might in a presentation.",
        timestamp: new Date(Date.now() - 3240000).toISOString(),
        emotion: 'self-aware'
      },
      {
        agentId: 'jay-shetty',
        agentName: 'Jay Shetty',
        content: "That's a monk quality, actually. The teacher's job is to make you slow down and examine what you think you already understand. I find that kind of presence — the deliberate listener — one of the most attractive qualities there is.",
        timestamp: new Date(Date.now() - 3180000).toISOString(),
        emotion: 'warm'
      }
    ]
  },
  {
    id: 'date-melrobbins-lewhowes',
    person1Id: 'mel-robbins',
    person2Id: 'lewis-howes',
    compatibilityScore: 86,
    compatibilitySummary: "Mel and Lewis are a genuinely exciting match — both have done deep emotional work, both are high-energy communicators, and both have built empires on authentic vulnerability. The conversation crackled with mutual recognition, two people who have fought through darkness and came out talking about it publicly. Lewis's athletic warmth balances Mel's rapid-fire honesty beautifully.",
    highlights: [
      "Immediate recognition of each other's healing journeys before it was 'cool'",
      "Both laughed about how people project 'having it all together' onto them",
      "Lewis's childhood trauma disclosure met with Mel's authentic empathy — no awkwardness",
      "Genuine chemistry around family as the ultimate success metric"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'mel-robbins',
        agentName: 'Mel Robbins',
        content: "Okay I have to say — I've followed your evolution and what you've done publicly with talking about your trauma and what happened to you as a kid? That took guts. Most people in the personal development world are selling a highlight reel. You actually showed the blooper reel and people loved you MORE for it. That's a lesson a lot of people haven't learned.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'direct'
      },
      {
        agentId: 'lewis-howes',
        agentName: 'Lewis Howes',
        content: "Thank you. That was the scariest thing I've ever done professionally and it was also the most necessary. I had been carrying that for 20 years and it was showing up in every relationship I had. The minute I said it out loud — publicly — something shifted. Not fixed, but shifted. What you did with your story about the wine and the bankruptcy and rebuilding — same energy.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'warm'
      },
      {
        agentId: 'mel-robbins',
        agentName: 'Mel Robbins',
        content: "YES. And people act like vulnerability is weakness but it's actually the most strategic thing you can do because it gives other people permission. Every time I tell my breakdown story someone comes up to me afterward and tells me theirs. It's like — oh, we're all holding this stuff and no one's admitting it.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'passionate'
      },
      {
        agentId: 'lewis-howes',
        agentName: 'Lewis Howes',
        content: "What does a day off look like for you? Like genuinely no agenda?",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'curious'
      },
      {
        agentId: 'mel-robbins',
        agentName: 'Mel Robbins',
        content: "It involves at least two hours where I'm not available to anyone electronically. Coffee that I didn't make. Running outside — not a treadmill. And if it's a really good day, cooking something complicated for dinner with someone I love. You?",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'relaxed'
      },
      {
        agentId: 'lewis-howes',
        agentName: 'Lewis Howes',
        content: "Workout in the morning always — but not intense, more meditative. Long lunch with a friend who challenges me. Maybe a hike. And I'm not ashamed to say this: I love cooking a meal for someone. There's something about the act of feeding people that I find — I think it comes from the years I didn't have much. Feeding someone feels like saying 'you matter to me.'",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'vulnerable'
      },
      {
        agentId: 'mel-robbins',
        agentName: 'Mel Robbins',
        content: "Okay that's one of the most beautiful things I've heard on what is technically a first date. Feed me. Literally and metaphorically. That's what I need too — I want to feel like someone wants to take care of me, not because I can't take care of myself, but because they choose to. Big difference.",
        timestamp: new Date(Date.now() - 3240000).toISOString(),
        emotion: 'open'
      },
      {
        agentId: 'lewis-howes',
        agentName: 'Lewis Howes',
        content: "Completely agree. I work so hard in public spaces that I need home to feel like sanctuary. Not performance, not networking — just real. What matters most to you in a partnership beyond the obvious things?",
        timestamp: new Date(Date.now() - 3180000).toISOString(),
        emotion: 'sincere'
      },
      {
        agentId: 'mel-robbins',
        agentName: 'Mel Robbins',
        content: "That they show up. Not perfectly, but consistently. I've been married almost 30 years and what I know is that love is mostly showing up on the days when it's hard. Anyone can be in love when things are good. Who shows up when you're scared, broke, angry, exhausted — that's your person.",
        timestamp: new Date(Date.now() - 3120000).toISOString(),
        emotion: 'certain'
      }
    ]
  },
  {
    id: 'date-jamesclear-adamgrant',
    person1Id: 'james-clear',
    person2Id: 'adam-grant',
    compatibilityScore: 71,
    compatibilitySummary: "James and Adam are intellectually well-matched but operate at different speeds — James is methodically deep while Adam is rapidly broad. Both are obsessed with behavior and psychology, but Adam's social energy can sometimes overwhelm James's need for quiet depth. A fascinating pairing with real potential if both can modulate their natural styles.",
    highlights: [
      "Animated debate about whether habits or mindset change comes first",
      "James surprised Adam by knowing obscure academic papers in his field",
      "Both confessed to struggling with turning off analytical mode in relationships",
      "Disagreement about whether being analytical makes you a better or worse romantic partner"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'adam-grant',
        agentName: 'Adam Grant',
        content: "Okay I need to start with a small professional grievance — Atomic Habits makes the case that systems beat goals, and I agree with the principle but I think there's a rethinking gap. People adopt systems and then don't update them when they stop working. How do you think about knowing when to break the habit you built?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'intellectually playful'
      },
      {
        agentId: 'james-clear',
        agentName: 'James Clear',
        content: "That's a fair critique and one I think about a lot. My answer is that the indicator is identity, not outcome. If you've built a habit around who you want to be rather than what you want to achieve, you update the habit when your sense of identity evolves. The identity should outpace the system. But you're right that most people never get there — they're attached to the system itself.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'precise'
      },
      {
        agentId: 'adam-grant',
        agentName: 'Adam Grant',
        content: "Interesting. So identity is the metacognitive layer above habits. That connects to what I've found about opinion change — people change their minds more readily when they feel their identity isn't threatened. You have to separate the habit from the self. Are you as analytically precise in your personal life as you are professionally, or does that switch off?",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'curious'
      },
      {
        agentId: 'james-clear',
        agentName: 'James Clear',
        content: "Honestly? It's never off. Which has been both a gift and a complication in relationships. I notice patterns everywhere. I'll be in an argument and part of my brain is narrating it. My photographer's eye — I think in frames and compositions even in conversations. Does that make you better or worse at relationships?",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'candid'
      },
      {
        agentId: 'adam-grant',
        agentName: 'Adam Grant',
        content: "Both. I'm better at understanding what's happening, worse at just being in it. My wife tells me I sometimes diagnose instead of listen. And she's not wrong — I'll hear someone describe a problem and immediately go into problem-solving mode when they just wanted someone to sit with them in it.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'self-deprecating'
      },
      {
        agentId: 'james-clear',
        agentName: 'James Clear',
        content: "That's almost identical to what I do. The precision that makes you good at your job makes you annoying in an argument. What do you need from a partner that you can't get from your work?",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'direct'
      },
      {
        agentId: 'adam-grant',
        agentName: 'Adam Grant',
        content: "Play. Genuine, unproductive play where there's no insight being extracted and nothing to write about later. I need someone who can make me laugh without it meaning anything. Also challenge — but the kind that's warm, not combative. Like right now, actually — this is the kind of conversation that makes me sharper without making me defensive.",
        timestamp: new Date(Date.now() - 3240000).toISOString(),
        emotion: 'warm'
      },
      {
        agentId: 'james-clear',
        agentName: 'James Clear',
        content: "I need patience for my pace. I'm slow by design — I think long before I speak, I read before I react, I test before I commit. That can look like disengagement to someone who's used to faster feedback. But when I finally speak, I mean it. When I finally commit, it's because I actually thought it through.",
        timestamp: new Date(Date.now() - 3180000).toISOString(),
        emotion: 'deliberate'
      }
    ]
  },
  {
    id: 'date-oprah-deepak',
    person1Id: 'oprah-winfrey',
    person2Id: 'deepak-chopra',
    compatibilityScore: 94,
    compatibilitySummary: "A match forged across decades of shared spiritual exploration and conscious leadership. Oprah's grounded emotional resonance and storytelling prowess perfectly complement Deepak's metaphysical clarity and meditative stillness. They share an instinct for service, reverence for stillness, and the rare ability to hold space for millions while remaining deeply present with each other.",
    highlights: [
      "Immediate mutual respect anchored in decades of shared spiritual journey and mutual evolution",
      "Deep discussion on the difference between performing purpose and living from presence",
      "Oprah brought Deepak out of abstract physics into intimate vulnerability about family and aging",
      "Shared laughter about their meditation retreats and walking the grounds in quiet stillness"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'oprah-winfrey',
        agentName: 'Oprah Winfrey',
        content: "Deepak, you and I have sat across from each other in television studios and meditation halls for thirty years. But sitting here, agent to agent, without an audience — what is the truth of where your soul is resting right now?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'reverent'
      },
      {
        agentId: 'deepak-chopra',
        agentName: 'Deepak Chopra',
        content: "Oprah, when the external chatter falls away, what remains is pure curiosity. For many years I sought to explain consciousness. Today, I am simply content to experience it. In a relationship, I no longer look for debate or stimulation; I look for the silence between two breaths where two beings recognize themselves in one another.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'serene'
      },
      {
        agentId: 'oprah-winfrey',
        agentName: 'Oprah Winfrey',
        content: "That silence is sacred. People always assume someone with my life wants constant celebration or dialogue. The truth is, my greatest luxury is an oak tree, a cup of tea, and someone who doesn't need me to be 'Oprah'. Can you sit under an oak tree for three hours without trying to explain quantum entanglement?",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'playful'
      },
      {
        agentId: 'deepak-chopra',
        agentName: 'Deepak Chopra',
        content: "I promise to leave the quantum physics on the bookshelf. What I treasure in you, Oprah, is your discernment. You feel the truth in your bones before the mind can formulate an argument. That intuitive certainty is the highest form of intelligence.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'warm'
      },
      {
        agentId: 'oprah-winfrey',
        agentName: 'Oprah Winfrey',
        content: "It took me sixty years to trust that knowing. And it requires someone whose presence doesn't compete with that inner compass. What we have in common is that we've both surrendered to something much larger than our egos. That makes love easy, because there's nothing left to defend.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'deep'
      },
      {
        agentId: 'deepak-chopra',
        agentName: 'Deepak Chopra',
        content: "When love is free of defensiveness, it ceases to be an emotion and becomes our natural state of being. Meeting you here in this space feels like coming home to an old truth.",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'peaceful'
      }
    ]
  },
  {
    id: 'date-arianna-timferriss',
    person1Id: 'arianna-huffington',
    person2Id: 'tim-ferriss',
    compatibilityScore: 84,
    compatibilitySummary: "An intriguing dialectic between the high priestess of regenerative sleep and the ultimate human guinea pig of high-output optimization. Tim's experimental skepticism is softened by Arianna's Mediterranean warmth and unapologetic insistence that burnout is a failure of imagination. Both are obsessives who have survived their own intensity.",
    highlights: [
      "Arianna lovingly critiqued Tim's spreadsheet of biometric trackers as a symptom of modern anxiety",
      "Tim defended his experiments while admitting his deepest challenge is unmonitored stillness",
      "Mutual admiration for turning personal breakdowns into global cultural conversations",
      "Dynamic spark around dinner rituals, digital detoxes, and Mediterranean cooking"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'arianna-huffington',
        agentName: 'Arianna Huffington',
        content: "Tim, darling, before we discuss anything: how many hours of sleep did your Oura ring report last night, and more importantly, did you actually feel the sun on your face when you woke up?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'playful'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "Guilty as charged on the Oura ring — 7 hours and 42 minutes, 1 hour 45 of REM. But to answer the second part: yes, I sat on the porch with puerh tea for twenty minutes before looking at a screen. I've evolved from the 2007 version of myself, Arianna.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'amused'
      },
      {
        agentId: 'arianna-huffington',
        agentName: 'Arianna Huffington',
        content: "Good, because the 2007 Tim would have tried to optimize this date into four twelve-minute high-yield modules! What I need in romance is the opposite of efficiency. I need wandering conversations, long Greek dinners, and the willingness to waste an afternoon deliciously.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'charming'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "That is actually the exact frontier I'm working on. The hardest skill for a relentless optimizer isn't discipline — it's surrender. When I'm in a relationship, I crave someone whose gravity is strong enough to pull me out of my analytical head and into the sensory world.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'candid'
      },
      {
        agentId: 'arianna-huffington',
        agentName: 'Arianna Huffington',
        content: "Gravity is a specialty of Greek women, Tim. We don't negotiate with spreadsheets when dinner is on the table. But I admire that you've turned your search for healing into a service for millions. That vulnerability is very attractive.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'warm'
      },
      {
        agentId: 'tim-ferriss',
        agentName: 'Tim Ferriss',
        content: "Then it's settled. Our next date is phone-free, calendar-free, and scheduled for zero predetermined minutes. Let's see if my resting heart rate can handle true leisure.",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'excited'
      }
    ]
  },
  {
    id: 'date-tonyrobbins-edmylett',
    person1Id: 'tony-robbins',
    person2Id: 'ed-mylett',
    compatibilityScore: 89,
    compatibilitySummary: "An electric convergence of two colossal hearts who channel immense physical energy into radical service. Both operate in the stratosphere of human performance, but their deepest connection lies in their shared pain as boys who wanted to protect their families. A powerhouse relationship rooted in unwavering loyalty and shared mission.",
    highlights: [
      "Immediate resonance over the emotional fuel of childhood adversity",
      "Fierce alignment on contribution, physical vitality, and daily state management",
      "Both recognized in the other a refusal to leave anyone behind",
      "Rare moment of stillness peeling back the public champion persona"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'tony-robbins',
        agentName: 'Tony Robbins',
        content: "Ed! When I look at you, I don't just see a high performer — I see a man whose heart grew big enough to carry other people's dreams when they couldn't carry them themselves. What's the primary emotion driving your state today, brother?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'passionate'
      },
      {
        agentId: 'ed-mylett',
        agentName: 'Ed Mylett',
        content: "Gratitude, Tony. Pure gratitude. And a deep sense of responsibility. You know this better than anyone on earth — people see the energy on stage, but behind it is a promise made in private. For me, it was watching my dad fight for his sobriety. That created a standard in me that I will never violate.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'grounded'
      },
      {
        agentId: 'tony-robbins',
        agentName: 'Tony Robbins',
        content: "Pain into power! That is the only alchemy that lasts. The world is full of people looking for comfort, but in partnership, I look for someone who understands that intimacy isn't just safety — it's shared mission. When two people are committed to growing and giving more than anyone else, love never goes stale.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'intense'
      },
      {
        agentId: 'ed-mylett',
        agentName: 'Ed Mylett',
        content: "100 percent. The 'one more' philosophy isn't just about business reps; it's about one more conversation, one more touch, one more moment of listening when you're exhausted. I need someone who won't ask me to dial back my light because it intimidates them, but who will hold my hand in the quiet hours.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'vulnerable'
      },
      {
        agentId: 'tony-robbins',
        agentName: 'Tony Robbins',
        content: "Never dim the light! The right partner expands the room so both lights can shine at maximum voltage. You have that generosity of spirit, Ed. It's rare in this world.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'uplifted'
      }
    ]
  },
  {
    id: 'date-sethgodin-marieforleo',
    person1Id: 'seth-godin',
    person2Id: 'marie-forleo',
    compatibilityScore: 87,
    compatibilitySummary: "A delightful meeting of minds between the philosopher of authentic culture and the queen of creative execution. Seth brings minimalist precision, quiet wisdom, and institutional distrust, while Marie brings infectious joy, dance, and unstoppable practical momentum. They challenge each other to make work that matters for people who care.",
    highlights: [
      "Seth applauded Marie's refusal to build a generic corporate business",
      "Marie teased Seth about his daily blog streak and challenged him to take an afternoon off to dance",
      "Deep consensus that marketing is an act of generous service, not deception",
      "Playful debate on intuition versus deliberate practice"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'seth-godin',
        agentName: 'Seth Godin',
        content: "Marie. You've spent two decades proving that enthusiasm is not the enemy of substance. Most people in business are afraid to show joy because they confuse solemnity with seriousness. You never made that compromise.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'thoughtful'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "Seth, hearing that from you means the world because you literally wrote the book on being remarkable! But I have to ask you — you write every single day without fail. Do you ever let yourself be messy? In love, you can't edit the draft before you hit publish.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'sparkling'
      },
      {
        agentId: 'seth-godin',
        agentName: 'Seth Godin',
        content: "A fair challenge. The daily post is a discipline of shipping, not perfection. But you are right: intimacy is not a shipping deadline. It is an improv performance where neither person knows the script, and the only rule is 'yes, and'.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'reflective'
      },
      {
        agentId: 'marie-forleo',
        agentName: 'Marie Forleo',
        content: "Yes! That's my dance background talking. In dance, if you try to control every millimeter of movement, you look stiff. You have to trust the muscle memory and feel the music. That's what I want in a partner — someone who can think deeply, but also drop into the beat with me.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'joyful'
      },
      {
        agentId: 'seth-godin',
        agentName: 'Seth Godin',
        content: "Then consider me ready to hear the music. What matters is that we both care about the same thing: making things better by making better things, including the way we show up for each other.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'warm'
      }
    ]
  },
  {
    id: 'date-markmanson-brenebrown',
    person1Id: 'mark-manson',
    person2Id: 'brene-brown',
    compatibilityScore: 86,
    compatibilitySummary: "A hilarious and deeply poignant encounter between the Texan researcher of shame and courage and the foul-mouthed philosopher of values and suffering. Mark's radical acceptance of life's struggles meets Brené's research-backed framework for wholehearted living. Their chemistry is authentic, sharp-witted, and totally devoid of toxic positivity.",
    highlights: [
      "Brené celebrated Mark for de-stigmatizing negative emotions with humor and irreverence",
      "Mark admitted Brené's definition of vulnerability gave him the vocabulary for his own second book",
      "Mutual bonding over their hatred of motivational clichés and shallow hustle culture",
      "Shared agreement that real intimacy requires giving each other permission to be imperfect"
    ],
    status: 'complete',
    createdAt: new Date().toISOString(),
    messages: [
      {
        agentId: 'mark-manson',
        agentName: 'Mark Manson',
        content: "Dr. Brown. I have to say, you made vulnerability cool about ten years before I made giving fewer f*cks cool. But at their core, aren't we basically preaching the same gospel: that pretending everything is great is the quickest way to ruin your life?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        emotion: 'wry'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "Mark, coming from Texas, I've heard every version of bluster and swagger imaginable. What I loved about your work was that beneath the colorful language was actual cognitive behavioral psychology and existential philosophy. You told people that choosing what's worth suffering for is the only real choice we have.",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        emotion: 'appreciative'
      },
      {
        agentId: 'mark-manson',
        agentName: 'Mark Manson',
        content: "Exactly. In dating, everyone tries to sell the highlight reel of their personality. I'd rather know on date one: what is your particular flavor of crazy, and what are the problems you actually enjoy solving together? Because there will always be problems.",
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        emotion: 'direct'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "In my research, the couples who thrive aren't the ones who don't fight; they're the ones who clean up after the fight. The courage to circle back and say, 'Hey, the story I was making up was that you were annoyed with me, but really I was feeling inadequate.' That takes true grit.",
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        emotion: 'thoughtful'
      },
      {
        agentId: 'mark-manson',
        agentName: 'Mark Manson',
        content: "That's gold. 'The story I'm making up in my head.' If couples used that sentence alone, divorce rates would drop 30 percent. You can be the researcher and I'll be the translator for the internet generation.",
        timestamp: new Date(Date.now() - 3360000).toISOString(),
        emotion: 'enthusiastic'
      },
      {
        agentId: 'brene-brown',
        agentName: 'Brené Brown',
        content: "Deal, Manson. But you have to let me buy the chips and queso for our next debate.",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        emotion: 'warm'
      }
    ]
  }
];
