import React from 'react';

interface SteamEffectProps {
  className?: string;
}

export default function SteamEffect({ className = "" }: SteamEffectProps) {
  return (
    <div className={`absolute top-0 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none ${className}`}>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-12 h-24 bg-gradient-to-t from-white/20 to-transparent blur-xl rounded-full animate-steam"
          style={{
            animationDelay: `${i * 0.5}s`,
            left: `${(i - 2.5) * 20}px`,
          }}
        />
      ))}
    </div>
  );
}
