import { NextRequest, NextResponse } from 'next/server';
import yts from 'yt-search';
import { cleanYouTubeTitle, getDeterministicColor } from '@/lib/utils';
import { Track } from '@/types/music';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ tracks: [] });
    }

    const searchResult = await yts({ query: query.trim() });
    const rawVideos = searchResult.videos || [];

    // Filter and map to Track interface
    const tracks: Track[] = rawVideos.slice(0, 20).map((v: any) => {
      const { title, artist } = cleanYouTubeTitle(v.title, v.author?.name || 'Unknown Artist');
      return {
        id: v.videoId,
        title,
        artist,
        album: v.author?.name ? `${v.author.name} Essentials` : 'Single',
        thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        duration: v.timestamp || '3:30',
        durationSeconds: v.seconds || 210,
        accentColor: getDeterministicColor(v.videoId + v.title),
        views: v.views ? (v.views > 1000000 ? `${(v.views / 1000000).toFixed(1)}M` : `${(v.views / 1000).toFixed(0)}K`) : undefined,
      };
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error searching YouTube Music:', error);
    return NextResponse.json(
      { error: 'Failed to search tracks', tracks: [] },
      { status: 500 }
    );
  }
}
