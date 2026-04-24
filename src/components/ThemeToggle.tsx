import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-3 rounded-full bg-foreground/10 border border-foreground/20 backdrop-blur-md hover:bg-foreground/20 transition-all duration-300 z-[100]"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 0 : 90,
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0,
          }}
          className="absolute inset-0 text-yellow-500"
        >
          <Sun size={24} />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? -90 : 0,
            opacity: theme === 'dark' ? 0 : 1,
            scale: theme === 'dark' ? 0 : 1,
          }}
          className="absolute inset-0 text-slate-700"
        >
          <Moon size={24} />
        </motion.div>
      </div>
    </motion.button>
  );
}
