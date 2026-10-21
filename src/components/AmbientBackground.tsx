'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';

export default function AmbientBackground() {
  const { activeColor } = usePlayer();

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* Dynamic Animated Glass Glow Orb 1 (Top Center/Right) */}
      <div
        className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 transition-colors duration-1000 animate-pulse-slow"
        style={{
          backgroundColor: activeColor || '#8400e7',
        }}
      />

      {/* Ambient Glow Orb 2 (Bottom Left) */}
      <div
        className="absolute -bottom-[20%] -left-[10%] w-[550px] h-[550px] rounded-full blur-[160px] opacity-25 transition-colors duration-1000"
        style={{
          backgroundColor: activeColor || '#1e3264',
        }}
      />

      {/* Ambient Subtle Accent Orb 3 (Center) */}
      <div className="absolute top-[35%] right-[5%] w-[450px] h-[450px] rounded-full bg-[#1DB954]/10 blur-[130px] opacity-30" />

      {/* iOS 17 Subtle Specular Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
    </div>
  );
}
