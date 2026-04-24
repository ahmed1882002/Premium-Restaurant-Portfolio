import { Link } from 'react-router-dom';
import { siteConfigs } from '@/data/siteConfigs';
import { useEffect, useRef, useState } from 'react';

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['#FFB7C5', '#C65D3B', '#C73E1D', '#C9A227', '#E8A838', '#8A9A5B', '#4CAF50', '#BF360C', '#0277BD', '#FF7043'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Draw connections
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 150) * 0.1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'cafe'>('all');

  const filteredSites = siteConfigs.filter((site) => {
    if (filter === 'all') return true;
    return site.type === filter;
  });

  const restaurants = siteConfigs.filter((s) => s.type === 'restaurant');
  const cafes = siteConfigs.filter((s) => s.type === 'cafe');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      <ParticleCanvas />

      {/* Hero */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/60">10 Unique Menu Experiences</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
            FlavorTable
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-8">
            A premium multi-brand menu platform featuring 10 distinct restaurant and cafe websites,
            each with unique 3D visuals and full menu management.
          </p>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(['all', 'restaurant', 'cafe'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === f
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Sites' : f === 'restaurant' ? 'Restaurants' : 'Cafes'}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm text-white/40">
            <div>
              <span className="text-2xl font-bold text-white">{restaurants.length}</span>
              <span className="ml-2">Restaurants</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{cafes.length}</span>
              <span className="ml-2">Cafes</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">10</span>
              <span className="ml-2">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {filter === 'all' || filter === 'restaurant' ? (
            <div className="mb-12">
              {filter === 'all' && (
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                  Restaurants
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {(filter === 'all' ? restaurants : filteredSites).map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            </div>
          ) : null}

          {filter === 'all' || filter === 'cafe' ? (
            <div>
              {filter === 'all' && (
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                    </svg>
                  </span>
                  Cafes
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {(filter === 'all' ? cafes : filteredSites).map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/30 text-sm">
            FlavorTable — Premium Menu Platform &copy; {new Date().getFullYear()}
          </p>
          <p className="text-white/20 text-xs mt-2">
            Each site features unique 3D visuals, full menu management, and responsive design.
            Click the gear icon on any site to edit the menu.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SiteCard({ site }: { site: import('@/types/menu').SiteConfig }) {
  return (
    <Link
      to={`/${site.id}`}
      className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-white/20"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={site.heroImage}
          alt={site.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div
          className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium"
          style={{
            backgroundColor: site.colors.primary + '40',
            color: site.colors.primary,
          }}
        >
          {site.type}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white group-hover:text-white transition-colors">
          {site.name}
        </h3>
        <p className="text-xs text-white/40 mt-1 line-clamp-2">{site.description}</p>
        <div className="flex gap-1 mt-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: site.colors.primary }}
            title="Primary"
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: site.colors.secondary }}
            title="Secondary"
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: site.colors.accent }}
            title="Accent"
          />
        </div>
      </div>
    </Link>
  );
}
