import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PopupWelcome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed top-6 right-6 z-[100] max-w-sm w-full p-4 glass-panel rounded-xl border border-nexus-border shadow-glass flex gap-3 items-center"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-nexus-cyan/15 border border-nexus-cyan/30 flex items-center justify-center text-nexus-cyan animate-pulse">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-orbitron text-xs font-black tracking-widest text-white uppercase">
              CONNECTION SECURE
            </h4>
            <p className="text-[11px] font-sans text-slate-300 mt-1">
              Welcome to NEXUS. Your premium portal is ready.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
