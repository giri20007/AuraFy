import { NextRequest, NextResponse } from 'next/server';
import { Track, Playlist } from '@/types/music';
import { parseSaavnSong } from '@/lib/saavn';
import { getDeterministicColor, formatSecondsToTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const TIDAL_TOKEN = 'CzET4vdadNUFQ5JU';
const TIDAL_HEADERS = {
  'X-Tidal-Token': TIDAL_TOKEN,
  'User-Agent': 'TIDAL_ANDROID/1039 okhttp/3.14.9',
};

const LANGUAGE_SEARCH_TERMS: Record<string, string> = {
  all: 'Top Hits 2026',
  hindi: 'Trending Hindi Songs 2026',
  tamil: 'Top Tamil Hits 2026',
  telugu: 'Top Telugu Songs 2026',
  punjabi: 'Top Punjabi Hits 2026',
  malayalam: 'Top Malayalam Hits 2026',
  english: 'Top English Songs 2026',
  spanish: 'Top Latin Hits 2026',
  kpop: 'Top K-Pop Hits 2026',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'all';

    // 1. Fetch Real TIDAL Top Tracks (Reverse-Engineered Tidal Featured Endpoint)
    let tidalTracks: Track[] = [];
    try {
      const tidalRes = await fetch(
        'https://api.tidal.com/v1/featured/top/tracks?countryCode=US&limit=10',
        {
          headers: TIDAL_HEADERS,
          next: { revalidate: 600 },
        }
      );

      if (tidalRes.ok) {
        const tidalData = await tidalRes.json();
        if (Array.isArray(tidalData.items)) {
          tidalTracks = tidalData.items.map((t: any) => {
            const coverPath = t.album?.cover ? t.album.cover.replace(/-/g, '/') : null;
            const thumbnail = coverPath
              ? `https://resources.tidal.com/images/${coverPath}/640x640.jpg`
              : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80';
            const artist =
              t.artists?.map((a: any) => a.name).join(', ') ||
              t.artist?.name ||
              'Unknown Artist';

            return {
              id: `tidal-${t.id}`,
              title: t.title,
              artist,
              album: t.album?.title || 'TIDAL Master',
              thumbnail,
              duration: formatSecondsToTime(t.duration || 180),
              durationSeconds: t.duration || 180,
              accentColor: t.album?.vibrantColor || getDeterministicColor(String(t.id)),
              views: t.popularity ? `${t.popularity}% Popularity` : 'HiFi Master',
            };
          });
        }
      }
    } catch (e) {
      console.warn('Tidal top tracks fetch error:', e);
    }

    // 2. Fetch Deezer Global Chart Tracks (High-Res 1000x1000 + Instant Audio Preview)
    let globalChartTracks: Track[] = [];
    try {
      const deezerRes = await fetch('https://api.deezer.com/chart/0/tracks?limit=12', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 600 },
      });

      if (deezerRes.ok) {
        const deezerData = await deezerRes.json();
        if (Array.isArray(deezerData.data)) {
          globalChartTracks = deezerData.data.map((t: any) => ({
            id: `dz-${t.id}`,
            title: t.title || t.title_short,
            artist: t.artist?.name || 'Unknown Artist',
            album: t.album?.title || 'Global Hit',
            thumbnail:
              t.album?.cover_xl ||
              t.album?.cover_big ||
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
            audioUrl: t.preview,
            previewUrl: t.preview,
            duration: formatSecondsToTime(t.duration || 180),
            durationSeconds: t.duration || 180,
            accentColor: getDeterministicColor(String(t.id) + t.title),
            views: t.rank ? `${(t.rank / 1000).toFixed(0)}K plays` : undefined,
          }));
        }
      }
    } catch (e) {
      console.warn('Deezer global chart fetch error:', e);
    }

    // Pair Tidal tracks with playable Deezer previews if matched
    if (tidalTracks.length > 0 && globalChartTracks.length > 0) {
      tidalTracks = tidalTracks.map((tt, idx) => {
        const match = globalChartTracks.find(
          (gt) =>
            gt.title.toLowerCase().includes(tt.title.toLowerCase()) ||
            tt.title.toLowerCase().includes(gt.title.toLowerCase())
        );
        return {
          ...tt,
          audioUrl: match ? match.audioUrl : globalChartTracks[idx % globalChartTracks.length]?.audioUrl,
          previewUrl: match ? match.previewUrl : globalChartTracks[idx % globalChartTracks.length]?.previewUrl,
        };
      });
    }

    // 3. Fetch Real Regional Trending Songs from JioSaavn with Decrypted 320kbps Streams
    let regionalTrendingTracks: Track[] = [];
    const query = LANGUAGE_SEARCH_TERMS[lang] || LANGUAGE_SEARCH_TERMS.all;
    try {
      const cookieHeader = lang !== 'all' ? `L=${encodeURIComponent(lang)};` : 'L=hindi,tamil,telugu,punjabi,english;';
      const saavnRes = await fetch(
        `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20&p=1&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Cookie: cookieHeader,
          },
          next: { revalidate: 600 },
        }
      );

      if (saavnRes.ok) {
        const saavnData = await saavnRes.json();
        if (Array.isArray(saavnData.results)) {
          regionalTrendingTracks = saavnData.results
            .map(parseSaavnSong)
            .filter((t: Track | null): t is Track => t !== null && Boolean(t.audioUrl));

          // Filter duplicates
          const seen = new Set<string>();
          regionalTrendingTracks = regionalTrendingTracks.filter((t) => {
            const clean = t.title.toLowerCase().trim();
            if (seen.has(clean)) return false;
            seen.add(clean);
            return true;
          });
        }
      }
    } catch (e) {
      console.warn('JioSaavn regional trending fetch error:', e);
    }

    // 4. Fetch Real TIDAL New Album Releases
    let newAlbums: any[] = [];
    try {
      const albumsRes = await fetch(
        'https://api.tidal.com/v1/featured/new/albums?countryCode=US&limit=8',
        {
          headers: TIDAL_HEADERS,
          next: { revalidate: 600 },
        }
      );

      if (albumsRes.ok) {
        const albumsData = await albumsRes.json();
        if (Array.isArray(albumsData.items)) {
          newAlbums = albumsData.items.map((a: any) => {
            const coverPath = a.cover ? a.cover.replace(/-/g, '/') : null;
            return {
              id: `album-${a.id}`,
              title: a.title,
              artist: a.artists?.map((art: any) => art.name).join(', ') || 'Various Artists',
              cover: coverPath
                ? `https://resources.tidal.com/images/${coverPath}/640x640.jpg`
                : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
              year: a.releaseDate ? a.releaseDate.slice(0, 4) : '2026',
              type: a.type || 'ALBUM',
            };
          });
        }
      }
    } catch (e) {
      console.warn('Tidal new albums fetch error:', e);
    }

    return NextResponse.json({
      tidalTopTracks: tidalTracks.length > 0 ? tidalTracks : globalChartTracks.slice(0, 8),
      globalChartTracks: globalChartTracks.slice(0, 8),
      regionalTrendingTracks: regionalTrendingTracks.slice(0, 10),
      newAlbums: newAlbums.slice(0, 8),
    });
  } catch (error) {
    console.error('Home feed API error:', error);
    return NextResponse.json({
      tidalTopTracks: [],
      globalChartTracks: [],
      regionalTrendingTracks: [],
      newAlbums: [],
    });
  }
}
