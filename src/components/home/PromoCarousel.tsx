import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

interface PromoSlide {
  id: number;
  badge: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
  actionText: string;
}

const SLIDES: PromoSlide[] = [
  {
    id: 1,
    badge: 'LUXURY EDITIONS',
    title: 'Apple Signature Hub',
    description: 'Immerse in the pristine white glassmorphism of elite iPhones, MacBooks, and iPads. Calibrated for maximum creative flow.',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-sky-50 via-indigo-50/50 to-amber-50/30',
    actionText: 'SECURE CORE NODE'
  },
  {
    id: 2,
    badge: 'PREMIUM FASHION',
    title: 'Nike Air Max Elite',
    description: 'Step into carbon-reinforced levitation tech. Clean silhouettes, premium fabrics, and responsive comfort indexes.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-orange-50 via-rose-50/50 to-amber-50/30',
    actionText: 'EXPLORE FOOTWEAR'
  },
  {
    id: 3,
    badge: 'TESLA FUTURE LAB',
    title: 'Autonomous Smart Deck',
    description: 'Control your entire environmental array with integrated Tesla smart-home nodes. Titanium build with real-time sync.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop',
    gradient: 'from-emerald-50 via-teal-50/50 to-sky-50/30',
    actionText: 'SYNC CONTROLLER'
  }
];

export default function PromoCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-80 rounded-2xl border border-nexus-border relative overflow-hidden glass-panel select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute inset-0 w-full h-full flex flex-col md:flex-row justify-between items-center p-8 gap-6 bg-gradient-to-r ${SLIDES[current].gradient}`}
        >
          {/* Slide Texts */}
          <div className="flex-1 space-y-4 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/35 text-[9px] font-orbitron font-black text-[#d4af37] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {SLIDES[current].badge}
            </span>
            
            <h2 className="font-orbitron font-black text-2xl md:text-4xl text-slate-900 tracking-wider uppercase">
              {SLIDES[current].title}
            </h2>
            
            <p className="text-xs md:text-sm text-slate-600 font-sans max-w-lg leading-relaxed">
              {SLIDES[current].description}
            </p>
            
            <button className="px-5 py-3 bg-[#d4af37] text-white hover:bg-slate-900 hover:text-white border border-transparent font-orbitron font-black text-[9px] tracking-widest rounded-xl cursor-pointer transition-all duration-300 shadow-sm flex items-center gap-2 mx-auto md:mx-0">
              {SLIDES[current].actionText}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Slide Image with parallax-like entry */}
          <motion.div 
            initial={{ x: 25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden border border-slate-200/80 shadow-md shrink-0 relative bg-white"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            <img 
              src={SLIDES[current].image} 
              alt={SLIDES[current].title} 
              className="w-full h-full object-cover select-none"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
              current === i ? 'bg-[#d4af37] w-6 shadow-sm' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
