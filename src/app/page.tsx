'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlayerProvider, usePlayer } from '@/context/PlayerContext';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import PlayerBar from '@/components/PlayerBar';
import HomeView from '@/components/HomeView';
import SearchView from '@/components/SearchView';
import PlaylistDetailView from '@/components/PlaylistDetailView';
import LikedSongsView from '@/components/LikedSongsView';
import LyricsModal from '@/components/LyricsModal';
import QueueDrawer from '@/components/QueueDrawer';
import YouTubeEngine from '@/components/YouTubeEngine';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';

function MainAppShell() {
  const {
    activeView,
    selectedPlaylist,
    activeColor,
  } = usePlayer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (mainContentRef.current) {
      setScrolled(mainContentRef.current.scrollTop > 30);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white font-sans antialiased selection:bg-[#1DB954] selection:text-black">
      {/* Top Body: Left Sidebar + Center Main View */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        {/* Center Main Viewport */}
        <main
          ref={mainContentRef}
          onScroll={handleScroll}
          className="flex-1 rounded-xl bg-[#121212] my-2 mr-2 overflow-y-auto relative flex flex-col transition-colors duration-700"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${
              activeColor || '#1e3264'
            }40, transparent 70%)`,
          }}
        >
          {/* Sticky Top Navigation */}
          <TopNav scrolled={scrolled} />

          {/* Dynamic Content Views */}
          <div className="flex-1 px-6 pt-4">
            {activeView === 'home' && !selectedPlaylist && <HomeView />}
            {activeView === 'search' && !selectedPlaylist && <SearchView />}
            {activeView === 'liked' && !selectedPlaylist && <LikedSongsView />}
            {activeView === 'playlist' && selectedPlaylist && (
              <PlaylistDetailView playlist={selectedPlaylist} />
            )}
            {activeView === 'library' && !selectedPlaylist && <HomeView />}
          </div>
        </main>

        {/* Queue Drawer */}
        <QueueDrawer />

        {/* Synced Lyrics Fullscreen/Drawer */}
        <LyricsModal />
      </div>

      {/* YouTube Playback Engine (Invisible audio + floating PiP) */}
      <YouTubeEngine />

      {/* Persistent Bottom Spotify Player Bar */}
      <PlayerBar />

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
