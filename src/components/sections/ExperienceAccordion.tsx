import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const experienceItems = [
  {
    id: 1,
    title: "The Atmosphere",
    subtitle: "SENSORY COMFORT",
    description: "Immerse yourself in a space designed for comfort and inspiration. Every corner tells a story of design and hospitality.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200"
  },
  {
    id: 2,
    title: "The Craft",
    subtitle: "PRECISION & ART",
    description: "Witness the art of precision in every detail. From the bean selection to the final pour, we prioritize the craft.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200"
  },
  {
    id: 3,
    title: "The Community",
    subtitle: "SHARED MOMENTS",
    description: "A place where stories are shared and connections are made. Join a vibrant community that values quality and time.",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec41b50d?w=1200"
  }
];

export default function ExperienceAccordion() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="py-32 overflow-hidden bg-black/50">
      <div className="max-w-7xl mx-auto px-4 mb-20 text-center">
        <span className="font-tech text-[10px] tracking-[0.6em] uppercase opacity-30 mb-4 block">Immersive Experience</span>
        <h2 className="text-huge font-heading text-stroke hover:text-white transition-colors duration-700">Beyond Taste</h2>
      </div>
      
      <div className="flex flex-col md:flex-row h-[700px] gap-4 px-4 max-w-[1400px] mx-auto">
        {experienceItems.map((item) => (
          <motion.div
            key={item.id}
            className="relative overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            animate={{
              flex: hovered === item.id ? 2.5 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img 
              src={item.image} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                scale: hovered === item.id ? 1.05 : 1.15,
                filter: hovered === item.id ? 'brightness(0.7) contrast(1.1)' : 'brightness(0.4) grayscale(0.5)'
              }}
              transition={{ duration: 1.5 }}
            />
            
            <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 transition-colors duration-700" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-12 overflow-hidden">
              <motion.div
                animate={{
                  y: hovered === item.id ? 0 : 40,
                  opacity: hovered === item.id ? 1 : 0.5
                }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-tech text-[11px] tracking-[0.5em] mb-4 block text-white/50">0{item.id} — {item.subtitle}</span>
                <h3 className="text-5xl font-heading mb-6 tracking-[0.1em]">{item.title}</h3>
              </motion.div>

              <AnimatePresence>
                {hovered === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <p className="text-sm opacity-60 max-w-sm font-light leading-relaxed mb-8">
                      {item.description}
                    </p>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100px' }}
                      className="h-[1px] bg-white/40"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
