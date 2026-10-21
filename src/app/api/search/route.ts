import { NextRequest, NextResponse } from 'next/server';
import { cleanYouTubeTitle, getDeterministicColor, formatSecondsToTime } from '@/lib/utils';
import { Track } from '@/types/music';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const trimmedQuery = query.trim();

    // 1. Try Deezer Search API (Free, high quality 1000x1000 art, direct CDN audio)
    try {
      const deezerRes = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(trimmedQuery)}&limit=25`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          next: { revalidate: 300 },
        }
      );

      if (deezerRes.ok) {
        const deezerData = await deezerRes.json();
        if (Array.isArray(deezerData.data) && deezerData.data.length > 0) {
          const tracks: Track[] = deezerData.data.map((t: any) => {
            const rawTitle = t.title || t.title_short || 'Unknown Title';
            const artistName = t.artist?.name || 'Unknown Artist';
            const { title, artist } = cleanYouTubeTitle(rawTitle, artistName);
            const durationSec = t.duration || 180;
            const cover =
              t.album?.cover_xl ||
              t.album?.cover_big ||
              t.album?.cover_medium ||
              t.artist?.picture_xl ||
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80';

            return {
              id: String(t.id),
              title,
              artist,
              album: t.album?.title || `${artist} Single`,
              thumbnail: cover,
              audioUrl: t.preview,
              previewUrl: t.preview,
              duration: formatSecondsToTime(durationSec),
              durationSeconds: durationSec,
              accentColor: getDeterministicColor(String(t.id) + title),
              views: t.rank ? `${(t.rank / 1000).toFixed(0)}K plays` : undefined,
            };
          });

          return NextResponse.json({ tracks });
        }
      }
    } catch (deezerErr) {
      console.warn('Deezer search fallback triggered:', deezerErr);
    }

    // 2. Fallback to iTunes Search API (Official Apple, zero rate limits)
    try {
      const itunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          trimmedQuery
        )}&entity=song&limit=25`,
        { next: { revalidate: 300 } }
      );

      if (itunesRes.ok) {
        const itunesData = await itunesRes.json();
        if (Array.isArray(itunesData.results) && itunesData.results.length > 0) {
          const tracks: Track[] = itunesData.results.map((t: any) => {
            const durationSec = Math.floor((t.trackTimeMillis || 180000) / 1000);
            const cover = t.artworkUrl100
              ? t.artworkUrl100.replace('100x100bb', '600x600bb')
              : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80';

            return {
              id: String(t.trackId),
              title: t.trackName || 'Unknown Title',
              artist: t.artistName || 'Unknown Artist',
              album: t.collectionName || 'Single',
              thumbnail: cover,
              audioUrl: t.previewUrl,
              previewUrl: t.previewUrl,
              duration: formatSecondsToTime(durationSec),
              durationSeconds: durationSec,
              accentColor: getDeterministicColor(String(t.trackId) + t.trackName),
            };
          });

          return NextResponse.json({ tracks });
        }
      }
    } catch (itunesErr) {
      console.warn('iTunes search fallback triggered:', itunesErr);
    }

    return NextResponse.json({ tracks: [] });
  } catch (error) {
    console.error('Search endpoint fatal error:', error);
    // Never crash with 500, return safe empty array
    return NextResponse.json({ tracks: [] });
  }
}
