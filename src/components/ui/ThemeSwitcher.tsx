import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore, NexusTheme } from '../../store/nexusStore';
import { Palette } from 'lucide-react';

interface ThemeOption {
  id: NexusTheme;
  label: string;
  color: string; // Tailwind background color string for indicator dot
}

const THEMES: ThemeOption[] = [
  { id: 'luxury-white-gold', label: 'Luxury White Gold', color: 'bg-[#d4af37]' },
  { id: 'midnight-luxury', label: 'Midnight Luxury', color: 'bg-[#3b82f6]' },
  { id: 'ocean-sapphire', label: 'Ocean Sapphire', color: 'bg-[#0ea5e9]' },
  { id: 'sakura-premium', label: 'Sakura Premium', color: 'bg-[#db2777]' },
  { id: 'royal-purple', label: 'Royal Purple', color: 'bg-[#a78bfa]' },
  { id: 'emerald-elite', label: 'Emerald Elite', color: 'bg-[#10b981]' },
  { id: 'sunset-elite', label: 'Sunset Elite', color: 'bg-[#f97316]' },
  { id: 'white-crystal', label: 'White Crystal', color: 'bg-[#64748b]' },
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useNexusStore();

  return (
    <div className="fixed bottom-6 left-6 z-40 font-orbitron select-none">
      <div className="flex items-center gap-3">
        {/* Toggle Palette Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white hover:text-nexus-cyan hover:border-nexus-cyan/40 cursor-pointer shadow-glass transition-all duration-300 active:scale-95"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Expandable Theme Shelf */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-glass border border-nexus-border"
            >
              {THEMES.map((item) => {
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id)}
                    title={item.label}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 group ${
                      isSelected ? 'border border-white/50 scale-105' : 'border border-transparent'
                    }`}
                  >
                    {/* Inner Colored Node dot */}
                    <div className={`w-4 h-4 rounded-full ${item.color} group-hover:scale-125 transition-transform duration-200`} />
                    
                    {/* Selected Halo border overlay */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeThemeHalo"
                        className="absolute inset-0 rounded-full border-2 border-nexus-cyan blur-[2px] pointer-events-none"
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
