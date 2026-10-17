# Soulmate.ai

> A dating-pool prototype where profile agents analyze two public links, hold simulated dates, and produce compatibility rankings.

| Link | Add yours |
| --- | --- |
| Live demo | _Add deployed URL_ |
| Vercel deployment | _Add Vercel URL_ |
| Walkthrough video | _Add YouTube URL_ |

## What it does

Soulmate.ai starts with one LinkedIn profile and one public Instagram profile. It uses those sources to create a structured compatibility profile, lets two profile agents hold a simulated date, and ranks potential matches with supporting reasons.

The project includes a seeded demonstration pool of 25 public figures. You can also add a profile from the homepage or `/add`.

## Main screens

- `/people` - browse the profile pool and open a person’s analysis.
- `/people/[id]` - source links, needs, interests, values, communication style, and rankings.
- `/dates` - view saved conversations or start a new simulated agent date.
- `/rankings` - view match rankings for each analyzed person.
- `/add` - add two public profile links and choose an analysis provider.

## Stack

- Next.js 16, React 19, TypeScript
- CSS modules and global CSS design tokens
- Next.js Route Handlers for the app API
- Cheerio plus native `fetch` for public-page metadata extraction
- Google Gemini or Sarvam AI for optional model-backed analysis
- A deterministic local compatibility fallback when no model API is configured

## Source handling

The app accepts only HTTPS LinkedIn `/in/` URLs and public Instagram profile URLs. It extracts public HTML metadata such as Open Graph, JSON-LD, titles, descriptions, and visible page content. It does not use logins, cookies, private APIs, or private-profile data.

Please add only profiles you are authorized to use. Generated analysis and simulated conversations are compatibility previews, not factual claims about a person.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Choose an AI provider

The profile intake form shows only the providers configured on the server. Set the keys in `.env.local`; never commit this file.

```env
# gemini | sarvam | auto | fallback
AI_PROVIDER=auto

GEMINI_API_KEY=your_gemini_api_key_here

SARVAM_API_KEY=your_sarvam_api_key_here
SARVAM_MODEL=sarvam-105b
```

- `gemini`: use Google Gemini when its key is configured.
- `sarvam`: use Sarvam AI when its key is configured.
- `auto`: prefer Gemini, then Sarvam, then the local fallback.
- `fallback`: use the local deterministic engine only.

The API keys stay on the server. The browser receives only the names of providers that are configured and available.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add the same environment variables from `.env.local` in **Project Settings → Environment Variables**.
4. Deploy.

The current store is in memory for a self-contained demo. New people, dates, and rankings reset after a server restart or serverless cold start. Connect a database before using it as a persistent product.

## Verification

```bash
npm run lint
npm run build
```
