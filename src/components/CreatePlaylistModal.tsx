'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, Music } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
}: CreatePlaylistModalProps) {
  const { createPlaylist, setSelectedPlaylist, setActiveView } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlaylist = createPlaylist(title.trim(), description.trim());
    setSelectedPlaylist(newPlaylist);
    setActiveView('playlist');
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#282828] text-white w-full max-w-md rounded-xl p-6 shadow-2xl border border-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#b3b3b3] hover:text-white rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#1DB954] flex items-center justify-center text-black">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Create New Playlist</h2>
            <p className="text-xs text-[#b3b3b3]">
              Build your custom collection with YouTube Music
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#b3b3b3] mb-1">
              Playlist Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late Night Vibes"
              className="w-full bg-[#3e3e3e] border border-transparent focus:border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#b3b3b3] mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a vibe or catchy description..."
              className="w-full bg-[#3e3e3e] border border-transparent focus:border-white/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#b3b3b3] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-bold text-sm rounded-full transition shadow-lg hover:scale-105 active:scale-95"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
