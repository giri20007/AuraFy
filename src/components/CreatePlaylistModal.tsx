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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="glass-dock text-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/15 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#a1a1aa] hover:text-white rounded-full glass-pill transition active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1DB954] flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/30">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Create New Playlist</h2>
            <p className="text-xs text-[#a1a1aa] font-medium">
              AuraFy Glass Collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
              Playlist Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Late Night Vibes"
              className="w-full bg-white/[0.08] border border-white/15 focus:border-[#1DB954] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#1DB954] transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Give your playlist a vibe or description..."
              className="w-full bg-white/[0.08] border border-white/15 focus:border-[#1DB954] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#1DB954] transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#a1a1aa] hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-full transition shadow-lg shadow-[#1DB954]/30 active:scale-95"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
