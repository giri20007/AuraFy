import { NextRequest, NextResponse } from 'next/server';
import { cleanYouTubeTitle, getDeterministicColor, formatSecondsToTime } from '@/lib/utils';
import { parseSaavnSong } from '@/lib/saavn';
import { Track } from '@/types/music';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'all';

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const trimmedQuery = query.trim();

    // 1. Primary Engine: JioSaavn (Full 320kbps direct AAC streams, all Indian & global languages)
    try {
      const cookieHeader = lang && lang !== 'all' ? `L=${encodeURIComponent(lang)};` : 'L=english,hindi,tamil,telugu,punjabi;';
      const saavnUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=30&p=1&q=${encodeURIComponent(
        trimmedQuery
      )}`;

      const saavnRes = await fetch(saavnUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Cookie: cookieHeader,
        },
        next: { revalidate: 300 },
      });

      if (saavnRes.ok) {
        const saavnData = await saavnRes.json();
        if (Array.isArray(saavnData.results) && saavnData.results.length > 0) {
          const saavnTracks: Track[] = saavnData.results
            .map(parseSaavnSong)
            .filter((t: Track | null): t is Track => t !== null && Boolean(t.audioUrl));

          // Filter out instrumental/karaoke versions unless specifically requested
          const genuineTracks = saavnTracks.filter((t) => {
            const titleLower = t.title.toLowerCase();
            const queryLower = trimmedQuery.toLowerCase();
            if (queryLower.includes('karaoke') || queryLower.includes('instrumental')) {
              return true;
            }
            return (
              !titleLower.includes('instrumental karaoke') &&
              !titleLower.includes('melody karaoke') &&
              !titleLower.includes('originally perfomed by') &&
              !titleLower.includes('originally performed by')
            );
          });

          const returnTracks = genuineTracks.length > 0 ? genuineTracks : saavnTracks;

          // If we found good genuine tracks with direct 320kbps audio, return them!
          if (returnTracks.length > 0) {
            return NextResponse.json({ tracks: returnTracks });
          }
        }
      }
    } catch (saavnErr) {
      console.warn('Saavn primary search error, falling back:', saavnErr);
    }

    // 2. Secondary Engine: Deezer Search API (Official global CDN audio & 1000x1000 artwork)
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
      console.warn('Deezer fallback error:', deezerErr);
    }

    // 3. Tertiary Engine: iTunes Search API (Official Apple Music CDN)
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
      console.warn('iTunes fallback error:', itunesErr);
    }

    return NextResponse.json({ tracks: [] });
  } catch (error) {
    console.error('Search endpoint fatal error:', error);
    return NextResponse.json({ tracks: [] });
  }
}
