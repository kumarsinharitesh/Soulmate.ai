import * as cheerio from 'cheerio';
import { ScrapedLinkedIn, ScrapedInstagram } from '@/types';

const SCRAPE_TIMEOUT = 15000;

function getHeaders() {
  return {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0',
  };
}

export async function scrapeLinkedIn(url: string): Promise<ScrapedLinkedIn> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT);

    const response = await fetch(url, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`LinkedIn fetch failed: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract structured data from LinkedIn public profile
    const result: ScrapedLinkedIn = {
      raw: html.substring(0, 8000),
    };

    // Try to get name
    result.name =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      '';

    // Try to get headline
    result.headline =
      $('[class*="headline"]').first().text().trim() ||
      $('[class*="top-card-layout__headline"]').first().text().trim() ||
      $('meta[name="description"]').attr('content') ||
      '';

    // Try to get summary/about
    result.summary =
      $('[class*="summary"]').first().text().trim() ||
      $('[class*="about"]').first().text().trim() ||
      '';

    // Try to get location
    result.location =
      $('[class*="location"]').first().text().trim() ||
      $('[class*="top-card__subline-item"]').first().text().trim() ||
      '';

    // Try to get experience
    const experience: string[] = [];
    $('[class*="experience"]').each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (text.length > 10 && text.length < 500) {
        experience.push(text);
      }
    });
    result.experience = experience.slice(0, 5);

    // Extract JSON-LD structured data
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Person') {
          if (!result.name && json.name) result.name = json.name;
          if (!result.headline && json.jobTitle) result.headline = json.jobTitle;
          if (!result.summary && json.description) result.summary = json.description;
          if (!result.location && json.address?.addressLocality) {
            result.location = json.address.addressLocality;
          }
        }
      } catch {
        // ignore JSON parse errors
      }
    });

    // Extract Open Graph data as fallback
    if (!result.name) {
      result.name = $('meta[property="og:title"]').attr('content') || '';
    }
    if (!result.summary) {
      result.summary = $('meta[property="og:description"]').attr('content') || '';
    }

    return result;
  } catch (error: unknown) {
    console.error('LinkedIn scrape error:', error);
    // Return minimal structure with URL-derived info
    const handle = url.split('/in/')[1]?.replace('/', '') || '';
    return {
      name: handle.replace(/-/g, ' '),
      headline: 'Professional',
      raw: `LinkedIn profile: ${url}`,
    };
  }
}

export async function scrapeInstagram(
  usernameOrUrl: string
): Promise<ScrapedInstagram> {
  try {
    // Extract username from URL if needed
    let username = usernameOrUrl;
    if (usernameOrUrl.includes('instagram.com/')) {
      username =
        usernameOrUrl.split('instagram.com/')[1]?.replace(/\//g, '') || '';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT);

    // Try to fetch public Instagram profile page
    const response = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        ...getHeaders(),
        'X-IG-App-ID': '936619743392459',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const html = await response.text();
    const $ = cheerio.load(html);

    const result: ScrapedInstagram = {
      username,
      raw: html.substring(0, 5000),
    };

    // Try OG tags
    result.fullName = $('meta[property="og:title"]').attr('content') || '';
    result.bio = $('meta[property="og:description"]').attr('content') || '';

    // Try to extract from __additionalData or window._sharedData
    const scripts = $('script').toArray();
    for (const script of scripts) {
      const content = $(script).html() || '';
      if (content.includes('biography') || content.includes('edge_owner')) {
        try {
          // Look for JSON data embedded in scripts
          const bioMatch = content.match(/"biography":"([^"]+)"/);
          if (bioMatch) result.bio = bioMatch[1].replace(/\\n/g, ' ');

          const nameMatch = content.match(/"full_name":"([^"]+)"/);
          if (nameMatch) result.fullName = nameMatch[1];

          const followersMatch = content.match(/"followed_by":{"count":(\d+)/);
          if (followersMatch) result.followersCount = parseInt(followersMatch[1]);

          const followingMatch = content.match(/"follow":{"count":(\d+)/);
          if (followingMatch) result.followingCount = parseInt(followingMatch[1]);

          // Extract recent captions
          const captionMatches = content.matchAll(/"text":"([^"]{20,500})"/g);
          const captions: string[] = [];
          for (const match of captionMatches) {
            if (
              !match[1].includes('\\u') &&
              captions.length < 10
            ) {
              captions.push(match[1]);
            }
          }
          if (captions.length > 0) result.recentCaptions = captions;
        } catch {
          // ignore
        }
      }
    }

    // Parse OG description for follower counts
    if (result.bio && result.bio.includes('Followers')) {
      const parts = result.bio.split(' - ');
      if (parts.length > 1) {
        result.bio = parts[parts.length - 1];
      }
    }

    return result;
  } catch (error: unknown) {
    console.error('Instagram scrape error:', error);
    const username = usernameOrUrl.includes('instagram.com/')
      ? usernameOrUrl.split('instagram.com/')[1]?.replace(/\//g, '')
      : usernameOrUrl;
    return {
      username,
      fullName: username,
      bio: `Instagram profile: @${username}`,
      raw: `Instagram: ${usernameOrUrl}`,
    };
  }
}
