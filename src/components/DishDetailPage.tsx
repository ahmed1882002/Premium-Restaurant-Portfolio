import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { siteConfigs, getSiteConfig } from '@/data/siteConfigs';
import { getDefaultMenu } from '@/data/defaultMenus';
import { getAssetPath } from '@/utils/assetHelper';
import SteamEffect from '@/components/effects/SteamEffect';

export default function DishDetailPage() {
  const { itemId: uniqueId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = React.useState(1);

  // Parse the unique ID (format: siteId-itemId)
  const [siteIdFromUrl, ...itemIdParts] = (uniqueId || '').split('-');
  const actualItemId = itemIdParts.join('-');

  // Find which site this item belongs to
  let foundItem: any = null;
  let foundSiteId = '';

  // First try the siteId from the URL for efficiency
  if (siteIdFromUrl) {
    const config = siteConfigs.find(c => c.id === siteIdFromUrl);
    if (config) {
      const storageKey = `flavortable_${config.id}_menu`;
      const stored = localStorage.getItem(storageKey);
      let siteMenu = stored ? JSON.parse(stored) : getDefaultMenu(config.id);
      if (siteMenu) {
        const item = siteMenu.items.find((i: any) => String(i.id) === String(actualItemId));
        if (item) {
          foundItem = item;
          foundSiteId = config.id;
        }
      }
    }
  }

  // Fallback search if not found (for backward compatibility)
  if (!foundItem) {
    for (const config of siteConfigs) {
      const storageKey = `flavortable_${config.id}_menu`;
      const stored = localStorage.getItem(storageKey);
      let siteMenu = stored ? JSON.parse(stored) : getDefaultMenu(config.id);
      
      if (siteMenu) {
        const item = siteMenu.items.find((i: any) => String(i.id) === String(uniqueId));
        if (item) {
          foundItem = item;
          foundSiteId = config.id;
          break;
        }
      }
    }
  }

  const config = getSiteConfig(foundSiteId || 'sakura');
  const item = foundItem;

  if (!item) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-serif italic text-2xl">
      Dish not found
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-500"
    >
      {/* Back Button */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-sans font-bold hover:opacity-100 opacity-50 transition-opacity"
        >
          <div className="w-10 h-[1px] bg-foreground group-hover:w-16 transition-all duration-500" />
          Back
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Cinematic Image */}
        <div className="lg:w-1/2 relative h-[60vh] lg:h-screen overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            src={getAssetPath(item.image || '/images/placeholder.jpg')} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          
          <SteamEffect className="bottom-0 top-auto scale-[3] opacity-40" />
        </div>

        {/* Right Side: Details & Purchase */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 relative bg-black/20">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="font-sans text-[10px] tracking-[0.8em] uppercase opacity-40 mb-4 block">Signature Selection</span>
            <h1 className="text-7xl lg:text-8xl font-serif italic mb-8 leading-[0.9] tracking-tight">
              {item.name}
            </h1>
            
            <div className="w-20 h-[1px] bg-white/20 mb-8" />
            
            <p className="text-xl lg:text-2xl font-serif italic opacity-60 leading-relaxed mb-12 max-w-lg">
              {item.description}
            </p>

            <div className="flex items-center gap-12 mb-16">
              <span className="text-6xl font-sans font-bold" style={{ color: config.colors.primary }}>
                ${item.price}
              </span>
              <div className="flex items-center border border-white/10 px-4 py-2 gap-6">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl opacity-40 hover:opacity-100 transition-opacity">－</button>
                <span className="text-xl font-sans font-bold min-w-[20px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-2xl opacity-40 hover:opacity-100 transition-opacity">＋</button>
              </div>
            </div>

            <div className="space-y-6">
              <textarea 
                placeholder="Special instructions (e.g. allergies, extra spice...)"
                className="w-full bg-white/5 border border-white/10 p-6 font-sans text-sm outline-none focus:border-white/30 transition-colors"
                rows={3}
              />
              
              <button 
                className="w-full group relative px-16 py-8 overflow-hidden border border-white/20 transition-all duration-700"
                style={{ backgroundColor: config.colors.primary + '10' }}
              >
                <div 
                  className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                  style={{ backgroundColor: config.colors.primary }}
                />
                <span className="relative z-10 font-sans text-[12px] uppercase tracking-[0.6em] font-bold group-hover:text-black">
                  Add To Selection — ${(item.price * quantity).toFixed(2)}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
