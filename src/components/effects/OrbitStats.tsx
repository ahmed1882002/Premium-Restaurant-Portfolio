import React from 'react';
import { motion } from 'framer-motion';

interface OrbitStatsProps {
  primaryColor: string;
  stats: { label: string; value: string }[];
}

export default function OrbitStats({ primaryColor, stats }: OrbitStatsProps) {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Central Glowing Circle */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-[100px] opacity-20 animate-pulse"
        style={{ backgroundColor: primaryColor }}
      />
      
      {/* Inner Orbit Circle */}
      <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full" />
      
      {/* Outer Orbit Circle */}
      <div className="absolute w-[450px] h-[450px] border border-white/5 rounded-full" />

      {/* Orbiting Dots with Labels */}
      {stats.map((stat, i) => {
        const radius = i % 2 === 0 ? 150 : 225;
        const duration = i % 2 === 0 ? 20 : 30;
        const delay = i * (duration / stats.length);

        return (
          <motion.div
            key={i}
            className="absolute flex items-center gap-4"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: -delay,
            }}
            style={{
              width: radius * 2,
              height: radius * 2,
            }}
          >
            <div className="relative flex items-center gap-4 origin-left" style={{ marginLeft: radius * 2 }}>
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                style={{ backgroundColor: 'white' }}
              />
              <motion.div 
                className="bg-white/5 backdrop-blur-md border border-white/10 p-4 min-w-[150px]"
                animate={{ rotate: -360 }} // Keep text upright
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: -delay,
                }}
              >
                <div className="text-2xl font-serif italic" style={{ color: primaryColor }}>{stat.value}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Central Visual Element */}
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-tech text-[10px] tracking-[0.8em] uppercase opacity-30 block mb-4">Core Values</span>
          <h3 className="text-6xl font-serif italic">The Art of <br/> Flavor</h3>
        </motion.div>
      </div>
    </div>
  );
}
