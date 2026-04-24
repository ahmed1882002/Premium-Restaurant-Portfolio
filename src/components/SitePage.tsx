import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMenuData } from '@/hooks/useMenuData';
import ParticleScene from '@/components/three/ParticleScene';
import OrbitStats from '@/components/effects/OrbitStats';
import ThemeToggle from '@/components/ThemeToggle';
import AdminPanel from '@/components/admin/AdminPanel';
import { getAssetPath } from '@/utils/assetHelper';
import { getSiteConfig } from '@/data/siteConfigs';
import SteamEffect from '@/components/effects/SteamEffect';
import FallingParticles from '@/components/effects/FallingParticles';
import TimelineMenu from '@/components/menu/TimelineMenu';
import ExperienceAccordion from '@/components/sections/ExperienceAccordion';
import { motion } from 'framer-motion';

interface SitePageProps {
  siteId: string;
}

export default function SitePage({ siteId }: SitePageProps) {
  const config = getSiteConfig(siteId);
  const {
    menu,
    isAdminOpen,
    setIsAdminOpen,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    deleteCategory,
    exportMenu,
    importMenu,
    getItemsByCategory,
  } = useMenuData(siteId);

  const [activeCategory, setActiveCategory] = useState<string>('');
  const [editItem, setEditItem] = useState<null | import('@/types/menu').MenuItem>(null);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menu.categories.length > 0 && !activeCategory) {
      setActiveCategory(menu.categories[0].id);
    }
  }, [menu.categories, activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [siteId]);

  if (!config) return <div>Site not found</div>;

  const particleType = config.type === 'cafe' ? 'coffee' : 
                      config.id === 'sakura' ? 'petals' : 
                      config.id === 'seasidemornings' ? 'bubbles' : 'spices';

  const stats = [
    { label: 'Years of Excellence', value: '12+' },
    { label: 'Signature Dishes', value: '45' },
    { label: 'Happy Guests', value: '10K+' },
    { label: 'Expert Chefs', value: '08' },
  ];

  return (
    <div
      className="min-h-screen relative bg-background text-foreground transition-colors duration-500"
    >
      {/* Decorative Star Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-10 animate-pulse">✦</div>
        <div className="absolute top-1/3 right-20 animate-bounce delay-700 text-3xl">✦</div>
        <div className="absolute bottom-1/4 left-1/2 animate-ping text-xl">✦</div>
      </div>

      {/* Falling Thematic Particles */}
      <FallingParticles type={particleType} />

      {/* 3D Particle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <ParticleScene variant={siteId as any} className="w-full h-full" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="p-3 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 group"
              title="Back to Home"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-serif tracking-tight font-medium uppercase">{config.name}</h1>
          </div>
          <div className="flex items-center gap-6">
            <span
              className="text-[10px] px-4 py-1.5 uppercase tracking-[0.3em] font-sans font-semibold border border-primary/20 rounded-full"
              style={{ backgroundColor: config.colors.primary + '15', color: config.colors.primary }}
            >
              {config.type}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section - Inspired by the Splitted Text Layout */}
      <div ref={heroRef} className="relative pt-48 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-12">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.4, y: 0 }}
                className="font-sans text-[11px] tracking-[0.8em] uppercase font-bold"
              >
                Innovative Dining Experience
              </motion.span>
            </div>
            
            <div className="mb-16">
              <h1 className="text-huge font-huge mb-0 leading-[0.7] tracking-tighter flex flex-col items-center">
                <motion.span initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>PURE</motion.span>
                <motion.span initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-stroke">CULINARY</motion.span>
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }} style={{ color: config.colors.primary }}>ARTISTRY</motion.span>
              </h1>
            </div>

            {/* Orbit Stats Integration */}
            <div className="w-full mb-24 opacity-80">
              <OrbitStats primaryColor={config.colors.primary} stats={stats} />
            </div>

            <div className="relative w-full max-w-5xl aspect-[16/8] overflow-hidden mb-20 group shadow-2xl">
              <img
                src={getAssetPath(config.heroImage)}
                alt={config.name}
                className="w-full h-full object-cover animate-slow-zoom transition-transform duration-[4s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
              
              {/* Steam Effect for Cafes */}
              {config.type === 'cafe' && <SteamEffect className="bottom-0 top-auto scale-[2.5] mb-20 opacity-70" />}
            </div>

            <a
              href="#menu"
              className="group relative px-20 py-8 overflow-hidden transition-all duration-700 border border-white/20"
            >
              <div 
                className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                style={{ backgroundColor: config.colors.primary }}
              />
              <span className="relative z-10 font-sans text-[13px] uppercase tracking-[0.6em] font-bold group-hover:text-black">
                Enter Experience
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu" className="relative z-10 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-serif italic tracking-tight mb-6">Our Selection</h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent mx-auto" />
          </div>

          <TimelineMenu
            categories={menu.categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            getItemsByCategory={getItemsByCategory}
            primaryColor={config.colors.primary}
          />
        </div>
      </div>

      {/* Experience Section */}
      <ExperienceAccordion />

      {/* Footer */}
      <footer
        className="relative z-10 py-16 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="font-heading text-4xl tracking-tighter mb-8 opacity-20">{config.name}</div>
          <p className="opacity-50 text-[10px] tracking-[0.3em] uppercase">
            &copy; {new Date().getFullYear()} — Crafted by Ahmed Systems
          </p>
          <div className="flex gap-8 mt-12 opacity-30 hover:opacity-100 transition-opacity">
            <button onClick={() => setIsAdminOpen(true)} className="font-tech text-[9px] uppercase tracking-widest hover:text-white transition-colors">Admin Dashboard</button>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      <AdminPanel
        siteConfig={config}
        categories={menu.categories}
        onAddItem={addItem}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onExport={exportMenu}
        onImport={importMenu}
        editItem={editItem}
        onClearEdit={() => setEditItem(null)}
      />
    </div>
  );
}
