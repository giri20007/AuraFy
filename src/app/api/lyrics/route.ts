import { NextRequest, NextResponse } from 'next/server';
import { parseLRC } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title');
    const artist = searchParams.get('artist');

    if (!title) {
      return NextResponse.json({ lyrics: [], plainLyrics: '' });
    }

    const cleanTitle = title.split('(')[0].split('-')[0].trim();
    const cleanArtist = artist ? artist.split('(')[0].split(',')[0].trim() : '';

    const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}${
      cleanArtist ? `&artist_name=${encodeURIComponent(cleanArtist)}` : ''
    }`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AuraFy/1.0 (https://github.com/giri20007/AuraFy)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      // Try searching if direct get didn't match
      const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(
        `${cleanArtist} ${cleanTitle}`
      )}`;
      const searchRes = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'AuraFy/1.0 (https://github.com/giri20007/AuraFy)',
        },
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (Array.isArray(searchData) && searchData.length > 0) {
          const bestMatch = searchData[0];
          const parsed = bestMatch.syncedLyrics ? parseLRC(bestMatch.syncedLyrics) : [];
          return NextResponse.json({
            lyrics: parsed,
            plainLyrics: bestMatch.plainLyrics || '',
            hasSynced: parsed.length > 0,
          });
        }
      }

      return NextResponse.json({ lyrics: [], plainLyrics: 'No lyrics found for this track.' });
    }

    const data = await res.json();
    const parsed = data.syncedLyrics ? parseLRC(data.syncedLyrics) : [];

    return NextResponse.json({
      lyrics: parsed,
      plainLyrics: data.plainLyrics || '',
      hasSynced: parsed.length > 0,
    });
  } catch (error) {
    console.error('Lyrics error:', error);
    return NextResponse.json({ lyrics: [], plainLyrics: '' }, { status: 500 });
  }
}
