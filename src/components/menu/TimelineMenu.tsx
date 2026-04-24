import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import type { Category, MenuItem } from '@/types/menu';
import { getAssetPath } from '@/utils/assetHelper';

interface TimelineMenuProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  getItemsByCategory: (id: string) => MenuItem[];
  primaryColor: string;
}

function CategoryRow({ 
  category, 
  index, 
  items,
  primaryColor,
  siteId
}: { 
  category: Category, 
  index: number, 
  items: MenuItem[],
  primaryColor: string,
  siteId: string
}) {
  const isLeft = index % 2 !== 0;
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const navigate = useNavigate();

  // Use the image of the first item as the category representative
  const categoryImage = items[0]?.image || '/images/placeholder.jpg';

  const handleNavigate = () => {
    navigate(`/category/${category.id}`);
  };

  return (
    <div ref={ref} className="relative flex flex-col items-center w-full">
      {/* Vertical Line Segment */}
      <div className="w-[1px] h-16 md:h-32 bg-gradient-to-b from-foreground/40 to-foreground/20" />

      <div className={`flex items-center w-full justify-center gap-0 md:gap-20 flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Category Label */}
        <motion.button
          onClick={handleNavigate}
          initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? 50 : -50 }}
          className="px-12 py-6 z-20 min-w-[250px] text-center shadow-2xl transition-all duration-700 bg-background text-foreground border border-border hover:border-primary hover:text-primary hover:scale-105"
        >
          <div className="font-serif text-3xl italic leading-none">{category.name}</div>
          <div className="font-sans text-[10px] font-bold mt-3 opacity-40 tracking-[0.4em] uppercase">
            View Selection
          </div>
        </motion.button>

        {/* Horizontal Connector */}
        <motion.div 
          initial={{ height: 0 }}
          animate={isInView ? { height: 40, width: 1 } : { height: 0 }}
          className="bg-foreground/40 md:h-[1px] md:w-32 block"
        />

        {/* Category Visual */}
        <div className="flex-1 max-w-xl mt-12 md:mt-0 px-6 md:px-0">
          <div className={`flex flex-col ${isLeft ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}>
            <motion.div
              onClick={handleNavigate}
              initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 } : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
              className="relative aspect-[16/7] w-full overflow-hidden mb-8 shadow-2xl group cursor-pointer border border-foreground/10"
            >
              <img 
                src={getAssetPath(categoryImage)} 
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-sans text-[10px] tracking-[0.6em] uppercase text-white font-bold">Discover {category.name}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelineMenu({
  categories,
  activeCategory,
  onCategoryChange,
  getItemsByCategory,
  primaryColor,
}: TimelineMenuProps) {
  // We need the siteId to build the item link. We can infer it from the context or a prop.
  // For now, let's assume it's passed or available.
  const { siteId } = useParams();

  return (
    <div className="relative py-20">
      {/* Central Animated Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-foreground/10 via-foreground/40 to-foreground/10 -translate-x-1/2 block" />
      
      <div className="space-y-0">
        {categories.map((category, index) => (
          <CategoryRow 
            key={category.id} 
            category={category} 
            index={index}
            items={getItemsByCategory(category.id)}
            primaryColor={primaryColor}
            siteId={siteId || ''}
          />
        ))}
      </div>
    </div>
  );
}
