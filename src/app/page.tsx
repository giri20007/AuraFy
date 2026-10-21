'use client';

import React, { useState, useRef } from 'react';
import { PlayerProvider, usePlayer } from '@/context/PlayerContext';
import AmbientBackground from '@/components/AmbientBackground';
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
    <div className="flex flex-col h-screen w-screen overflow-hidden text-white font-sans antialiased selection:bg-[#1DB954] selection:text-black relative">
      {/* iOS 17 Dynamic Liquid Ambient Glow Background */}
      <AmbientBackground />

      {/* Top Body: Left Sidebar (Desktop) + Main Viewport (Full width on Mobile) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Sidebar (Desktop only) */}
        <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        {/* Center Main Viewport with iOS 17 Glass styling */}
        <main
          ref={mainContentRef}
          onScroll={handleScroll}
          className="flex-1 md:rounded-2xl glass-panel md:my-2 md:mr-2 overflow-y-auto relative flex flex-col w-full shadow-2xl"
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

        {/* Queue Drawer */}
        <QueueDrawer />

        {/* Synced Lyrics Fullscreen/Drawer */}
        <LyricsModal />
      </div>

      {/* YouTube Playback Engine (Optional Canvas/Video Mode) */}
      <YouTubeEngine />

      {/* DESKTOP: Persistent Bottom Spotify Glass Player Bar */}
      <PlayerBar />

      {/* MOBILE: Floating Glass Mini Player */}
      <MobileMiniPlayer onOpenFullPlayer={() => setIsMobileFullPlayerOpen(true)} />

      {/* MOBILE: Fixed Glass Bottom Dock (Home, Search, Library) */}
      <MobileBottomNav />

      {/* MOBILE: Expandable Full-Screen iOS 17 Now Playing Screen */}
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
