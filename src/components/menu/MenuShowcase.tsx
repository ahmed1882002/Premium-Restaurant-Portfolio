import React from 'react';
import { motion } from 'framer-motion';
import type { MenuItem } from '@/types/menu';

interface MenuShowcaseProps {
  items: MenuItem[];
  primaryColor: string;
}

export default function MenuShowcase({ items, primaryColor }: MenuShowcaseProps) {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl font-serif italic mb-6"
          >
            قائمتنا المميزة
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="font-sans text-sm tracking-widest uppercase"
          >
            اكتشف مجموعتنا المختارة بعناية من المشروبات والحلويات الفاخرة
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 hidden md:block" />

          <div className="space-y-0">
            {items.map((item, index) => {
              const isLeft = index % 2 !== 0;

              return (
                <div key={item.id} className="relative flex flex-col items-center">
                  {/* Vertical Line Segment with animation */}
                  <div className="w-[1px] h-32 bg-gradient-to-b from-white/20 to-transparent hidden md:block" />

                  <div className={`flex items-center w-full justify-center gap-0 md:gap-12 flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Label Box */}
                    <motion.div
                      initial={{ clipPath: 'inset(0 100% 0 0)' }}
                      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="bg-white text-black px-10 py-4 font-serif text-2xl italic z-10 min-w-[200px] text-center"
                    >
                      {item.name}
                    </motion.div>

                    {/* Horizontal Connector Line */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: 120 }}
                      className="h-[1px] bg-white/20 hidden md:block"
                    />

                    {/* Content Wrapper */}
                    <div className="flex-1 max-w-lg mt-8 md:mt-0">
                      <div className={`flex flex-col ${isLeft ? 'items-end text-right' : 'items-start text-left'}`}>
                        <motion.div
                          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                          whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="relative aspect-video w-full overflow-hidden mb-6 shadow-2xl border border-white/5"
                        >
                          <img 
                            src={item.image || '/images/placeholder.jpg'} 
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                          />
                        </motion.div>
                        <motion.p 
                          initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                          whileInView={{ opacity: 0.6, x: 0 }}
                          className="font-serif italic text-xl leading-relaxed max-w-sm"
                        >
                          {item.description}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
