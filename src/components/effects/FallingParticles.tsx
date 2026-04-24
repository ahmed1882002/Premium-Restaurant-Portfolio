import React, { useMemo } from 'react';

interface FallingParticlesProps {
  type: 'coffee' | 'spices' | 'petals' | 'bubbles';
  count?: number;
}

export default function FallingParticles({ type, count = 15 }: FallingParticlesProps) {
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
      size: `${10 + Math.random() * 30}px`,
      rotation: `${Math.random() * 360}deg`,
    }));
  }, [count]);

  const getParticleContent = () => {
    switch (type) {
      case 'coffee':
        return '🫘';
      case 'spices':
        return '🌿';
      case 'petals':
        return '🌸';
      case 'bubbles':
        return '🫧';
      default:
        return '•';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
            rotate: p.rotation,
          }}
        >
          {getParticleContent()}
        </div>
      ))}
    </div>
  );
}
