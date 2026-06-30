import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PetalsRain from './PetalsRain';
import { Sparkles, Calendar, Clock, CloudLightning, ShieldCheck, ArrowRight } from 'lucide-react';

interface PremiumWelcomeModalProps {
  onClose: () => void;
  userName?: string;
}

export default function PremiumWelcomeModal({ onClose, userName = 'Alex Carter' }: PremiumWelcomeModalProps) {
  const [time, setTime] = useState('');
  const [sparkles, setSparkles] = useState<Array<{ id: number; top: string; left: string; delay: number }>>([]);

  // Time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate 12 random sparkles for background celebrations
  useEffect(() => {
    const list = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      delay: Math.random() * 0.8
    }));
    setSparkles(list);
  }, []);

  // Auto-close after 5 seconds
  useEffect(() => {
    const autoClose = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(autoClose);
  }, [onClose]);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 overflow-hidden font-orbitron select-none bg-black/60 backdrop-blur-md">
      {/* Background Grids & Falling Flower Petals Rain */}
      <div className="nexus-grid-bg opacity-20 pointer-events-none" />
      <PetalsRain />

      {/* Floating Sparkles celebration overlays */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.5, delay: sp.delay, repeat: Infinity }}
          className="absolute text-amber-400 pointer-events-none"
          style={{ top: sp.top, left: sp.left }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      ))}

      {/* Centered Glassmorphic Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20, filter: 'blur(8px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        className="relative w-full max-w-lg p-8 bg-white/45 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_24px_50px_rgba(212,175,55,0.12)] text-center mx-4 overflow-hidden"
      >
        {/* Gold top border accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#F5C542] to-transparent animate-pulse" />

        {/* User Profile Avatar with glowing spin rings */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#F5C542]/40 p-1 animate-spin-slow">
            <div className="w-full h-full rounded-full border border-pink-400/30 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl shadow-inner">
                💎
              </div>
            </div>
          </div>
          {/* Clearance Level Floating Badge */}
          <div className="absolute -bottom-1 -right-2 bg-stone-900 text-[#F5C542] text-[7px] font-black tracking-widest px-2 py-0.5 rounded-full border border-white shadow-md">
            VIP ELITE
          </div>
        </div>

        {/* Header telemetry greetings */}
        <div className="mb-6">
          <span className="text-[9px] text-[#F5C542] tracking-widest uppercase font-black block">
            ✨ WELCOME BACK!
          </span>
          <h2 className="text-2xl font-black tracking-widest text-stone-950 mt-1 uppercase">
            {userName}
          </h2>
          <p className="text-[10px] text-[#78716c] font-sans tracking-wide mt-2 font-bold uppercase">
            Your Luxury Shopping Experience is Ready.
          </p>
        </div>

        {/* Volumetric widgets grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-left text-stone-850 font-bold">
          {/* Card 1: Synced Time */}
          <div className="p-3 bg-white/30 border border-white/60 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5C542]/10 flex items-center justify-center text-[#F5C542] border border-[#F5C542]/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-[#78716c] uppercase block tracking-wider font-bold">SYNCED TIME</span>
              <span className="text-xs font-mono font-bold text-stone-800">{time || '00:00:00'}</span>
            </div>
          </div>

          {/* Card 2: Membership Level */}
          <div className="p-3 bg-white/30 border border-white/60 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
              <CloudLightning className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-[#78716c] block uppercase tracking-wider font-bold">MEMBER DECK</span>
              <span className="text-[10px] font-bold text-stone-800 uppercase">VIP Emerald Node</span>
            </div>
          </div>

          {/* Card 3: Current Date */}
          <div className="p-3 bg-white/30 border border-white/60 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-[#78716c] block uppercase tracking-wider font-bold">NODE DATE</span>
              <span className="text-[10px] font-bold text-stone-800">{today}</span>
            </div>
          </div>

          {/* Card 4: Loyalty Points */}
          <div className="p-3 bg-white/30 border border-white/60 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5C542]/10 flex items-center justify-center text-[#F5C542] border border-[#F5C542]/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] text-[#78716c] block uppercase tracking-wider font-bold">LOYALTY XP</span>
              <span className="text-[10px] font-bold text-stone-800">87,420 NEX PTS</span>
            </div>
          </div>
        </div>

        {/* Action Button selections */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-stone-900 text-white font-black tracking-widest text-[9px] rounded-xl hover:bg-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            ENTER DASHBOARD
            <ArrowRight className="w-3.5 h-3.5 text-[#F5C542]" />
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-white/40 hover:bg-white/80 border border-slate-300 text-stone-800 font-black tracking-widest text-[9px] rounded-xl transition-all duration-300 cursor-pointer"
          >
            EXPLORE NEW ARRIVALS
          </button>
        </div>

        {/* Dismissal ticker */}
        <span className="text-[7px] text-slate-500 font-mono tracking-widest block mt-4 animate-pulse uppercase font-bold">
          LOADING PORTAL CHANNELS... AUTO LAUNCH IN 5 SECONDS
        </span>
      </motion.div>
    </div>
  );
}
