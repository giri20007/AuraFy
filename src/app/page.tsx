'use client';

import React, { useState, useRef } from 'react';
import { PlayerProvider, usePlayer } from '@/context/PlayerContext';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import PlayerBar from '@/components/PlayerBar';
import HomeView from '@/components/HomeView';
import SearchView from '@/components/SearchView';
import PlaylistDetailView from '@/components/PlaylistDetailView';
import LikedSongsView from '@/components/LikedSongsView';
import LibraryView from '@/components/LibraryView';
import LyricsModal from '@/components/LyricsModal';
import QueueDrawer from '@/components/QueueDrawer';
import YouTubeEngine from '@/components/YouTubeEngine';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import MobileMiniPlayer from '@/components/MobileMiniPlayer';
import MobileNowPlayingModal from '@/components/MobileNowPlayingModal';

function MainAppShell() {
  const {
    activeView,
    selectedPlaylist,
    activeColor,
  } = usePlayer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileFullPlayerOpen, setIsMobileFullPlayerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (mainContentRef.current) {
      setScrolled(mainContentRef.current.scrollTop > 20);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white font-sans antialiased selection:bg-[#1DB954] selection:text-black">
      {/* Top Body: Left Sidebar (Desktop only) + Main Viewport (Full width on Mobile) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Sidebar (Desktop only: hidden md:flex) */}
        <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        {/* Center Main Viewport (Full width on mobile, rounded card on desktop) */}
        <main
          ref={mainContentRef}
          onScroll={handleScroll}
          className="flex-1 md:rounded-xl bg-[#121212] md:my-2 md:mr-2 overflow-y-auto relative flex flex-col transition-colors duration-700 w-full"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${
              activeColor || '#1e3264'
            }40, transparent 70%)`,
          }}
        >
          {/* Sticky Top Navigation */}
          <TopNav scrolled={scrolled} />

          {/* Dynamic Content Views */}
          <div className="flex-1 px-3 sm:px-6 pt-2 sm:pt-4">
            {activeView === 'home' && !selectedPlaylist && <HomeView />}
            {activeView === 'search' && !selectedPlaylist && <SearchView />}
            {activeView === 'liked' && !selectedPlaylist && <LikedSongsView />}
            {activeView === 'library' && !selectedPlaylist && (
              <LibraryView onOpenCreateModal={() => setIsCreateModalOpen(true)} />
            )}
            {activeView === 'playlist' && selectedPlaylist && (
              <PlaylistDetailView playlist={selectedPlaylist} />
            )}
          </div>
        </main>

        {/* Queue Drawer (Desktop & Mobile) */}
        <QueueDrawer />

        {/* Synced Lyrics Fullscreen/Drawer */}
        <LyricsModal />
      </div>

      {/* YouTube Playback Engine (Background audio & PiP canvas video) */}
      <YouTubeEngine />

      {/* DESKTOP: Persistent Bottom Spotify Player Bar */}
      <PlayerBar />

      {/* MOBILE: Floating Mini Player (right above bottom nav) */}
      <MobileMiniPlayer onOpenFullPlayer={() => setIsMobileFullPlayerOpen(true)} />

      {/* MOBILE: Fixed Bottom Navigation Bar (Home, Search, Library) */}
      <MobileBottomNav />

      {/* MOBILE: Expandable Full-Screen Now Playing Screen */}
      <MobileNowPlayingModal
        isOpen={isMobileFullPlayerOpen}
        onClose={() => setIsMobileFullPlayerOpen(false)}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <PlayerProvider>
      <MainAppShell />
    </PlayerProvider>
  );
}
