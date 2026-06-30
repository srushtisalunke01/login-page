import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useNexusStore } from '../../store/nexusStore';
import { sounds } from '../../utils/sounds';

interface CelebrationScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConfettiItem {
  id: number;
  x: number;
  size: number;
  delay: number;
  color: string;
}

const CONFETTI_COLORS = ['bg-amber-400', 'bg-nexus-cyan', 'bg-nexus-magenta', 'bg-white', 'bg-emerald-400'];

export default function CelebrationScreen({ isOpen, onClose }: CelebrationScreenProps) {
  const [particles, setParticles] = useState<ConfettiItem[]>([]);
  const soundEnabled = useNexusStore((state) => state.soundEnabled);

  // Trigger success sound chime and auto-close timer
  useEffect(() => {
    if (isOpen) {
      if (soundEnabled) {
        sounds.playSuccess();
      }

      // Generate 50 luxury golden and neon confetti particles
      const list = Array.from({ length: 55 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage width
        size: Math.random() * 8 + 6, // size in px
        delay: Math.random() * 0.4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      }));
      setParticles(list);

      const timer = setTimeout(() => {
        onClose();
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, soundEnabled]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[2000] flex items-center justify-center font-orbitron overflow-hidden bg-black/90 backdrop-blur-md">
          {/* Neon Grid overlay */}
          <div className="nexus-grid-bg opacity-20 pointer-events-none" />

          {/* Falling Confetti Burst */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -50, x: `${p.x}vw`, rotate: 0, opacity: 0 }}
              animate={{ 
                y: '105vh', 
                x: `${p.x + (Math.random() * 16 - 8)}vw`, 
                rotate: 720,
                opacity: [0, 1, 1, 0]
              }}
              transition={{ duration: Math.random() * 2 + 1.8, delay: p.delay, ease: 'linear' }}
              className={`absolute rounded-sm pointer-events-none shadow-neon-cyan ${p.color}`}
              style={{ width: p.size, height: p.size }}
            />
          ))}

          {/* Floating Sparkles */}
          <div className="absolute text-nexus-cyan animate-ping pointer-events-none top-1/4 left-1/3">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute text-nexus-magenta animate-ping pointer-events-none bottom-1/4 right-1/3">
            <Sparkles className="w-6 h-6" />
          </div>

          {/* Centered Success Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 35 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, filter: 'blur(8px)' }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="w-full max-w-md p-8 glass-panel border border-nexus-border rounded-2xl text-center shadow-glass relative mx-4"
          >
            {/* Holographic header stripe */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-nexus-cyan via-white to-nexus-cyan animate-pulse" />

            {/* Glowing checkmark shield */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 shadow-neon-cyan">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>

            <span className="text-[9px] tracking-widest text-nexus-cyan font-bold block uppercase">
              COGNITIVE CLEARANCE APPROVED
            </span>
            
            <h2 className="text-2xl font-black tracking-widest text-white uppercase mt-2">
              Order Dispatched
            </h2>
            
            <p className="text-xs text-slate-400 font-sans tracking-wide mt-3 leading-relaxed">
              Your core upgrade nodes have been successfully linked to your profile matrix and dispatched via quantum freight.
            </p>

            {/* Logistics summary details card */}
            <div className="my-6 p-4 bg-white/5 border border-nexus-border rounded-xl text-left text-[10px] space-y-2 font-mono">
              <div className="flex justify-between border-b border-nexus-border/40 pb-1.5">
                <span className="text-slate-500">TRANSACTION ID</span>
                <span className="text-white font-bold select-all">TX-9024.B89-K</span>
              </div>
              <div className="flex justify-between border-b border-nexus-border/40 pb-1.5">
                <span className="text-slate-500">LOGISTICS FLEET</span>
                <span className="text-nexus-cyan flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  QUANTUM CARGO
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">ESTIMATED CONVERGENCE</span>
                <span className="text-emerald-400 font-bold">{formattedDelivery.toUpperCase()}</span>
              </div>
            </div>

            {/* Closing telemetry advice */}
            <span className="text-[7px] text-slate-500 font-mono tracking-widest block animate-pulse">
              SYNCING COMPILER PORTALS... DISMISSING HUD IN 3 SECONDS
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
