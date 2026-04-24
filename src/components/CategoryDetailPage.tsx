import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { siteConfigs, getSiteConfig } from '@/data/siteConfigs';
import { getDefaultMenu } from '@/data/defaultMenus';
import { getAssetPath } from '@/utils/assetHelper';

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // Global search for the category
  let foundCategory: any = null;
  let foundSiteId = '';

  siteConfigs.forEach(config => {
    // Corrected the storage key
    const storageKey = `flavortable_${config.id}_menu`;
    const stored = localStorage.getItem(storageKey);
    let siteMenu = stored ? JSON.parse(stored) : getDefaultMenu(config.id);

    if (siteMenu) {
      // The siteMenu structure from useMenuData has categories and items separately
      const category = siteMenu.categories.find((c: any) => c.id === categoryId);
      if (category) {
        foundCategory = category;
        foundSiteId = config.id;
        // In the data structure, we need to attach items to the category for the grid
        foundCategory.items = siteMenu.items.filter((i: any) => i.category === categoryId);
      }
    }
  });

  const config = getSiteConfig(foundSiteId || 'sakura');
  const category = foundCategory;
  const items = category?.items || [];

  if (!category) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-serif italic text-2xl">
      Category not found
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-background text-foreground transition-colors duration-500"
    >
      {/* Premium Header */}
      <div className="relative h-[50vh] overflow-hidden flex items-center justify-center">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          src={items[0]?.image || '/images/placeholder.jpg'} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]" />
        
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="font-sans text-[10px] tracking-[0.8em] uppercase opacity-40 mb-6 block">Selection</span>
            <h1 className="text-8xl font-serif italic mb-8">{category.name}</h1>
            <div className="w-24 h-[1px] bg-white/20 mx-auto" />
          </motion.div>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold opacity-50 hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-500" />
          Back
        </button>
      </div>

      {/* Dishes Grid */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              onClick={() => navigate(`/item/${foundSiteId}-${item.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-8 shadow-2xl border border-white/5">
                <img 
                  src={getAssetPath(item.image || '/images/placeholder.jpg')} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-700 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/60">View Details</span>
                </div>
              </div>
              
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-3xl italic group-hover:text-warm-accent transition-colors">
                  {item.name}
                </h3>
                <div className="flex flex-col items-end">
                  <span className="font-sans text-sm font-bold opacity-40">${item.price}</span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-colors mt-1 font-bold">Tap to Order</span>
                </div>
              </div>
              <div className="w-full h-[1px] bg-white/5 mt-4 group-hover:bg-white/20 transition-colors" />
              <p className="font-serif italic text-lg opacity-30 mt-4 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="py-20 text-center opacity-10 font-huge text-9xl pointer-events-none select-none">
        {category.name}
      </div>
    </div>
  );
}
