import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { sounds } from '../../utils/sounds';
import { Cpu, Terminal } from 'lucide-react';

const LOG_MESSAGES = [
  'INITIALIZING NEXUS CORE...',
  'SECURE CONNECTION ESTABLISHED (AES-512)...',
  'SYNCING SPACETIME CODES...',
  'CALIBRATING 3D GRAPHICS PIPELINE...',
  'FETCHING PORTAL TELEMETRY DATA...',
  'NEXUS INTERFACE COMPILATION SUCCESS.',
  'PORTAL NODE STANDBY.'
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const setIntroComplete = useNexusStore((state) => state.setIntroComplete);

  useEffect(() => {
    // Increment progress simulated sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress > (currentLogIdx + 1) * (100 / LOG_MESSAGES.length)) {
      setCurrentLogIdx((prev) => Math.min(prev + 1, LOG_MESSAGES.length - 1));
    }
  }, [progress, currentLogIdx]);

  const handleEnter = () => {
    sounds.playWhoosh();
    // Fade sequence triggers after whoosh sound triggers
    setTimeout(() => {
      setIntroComplete(true);
    }, 250);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#030303] flex flex-col items-center justify-center z-50 select-none font-orbitron overflow-hidden">
      {/* Background Grids */}
      <div className="nexus-grid-bg opacity-30" />
      <div className="glow-spot-cyan opacity-40" />

      <div className="relative w-full max-w-lg p-6 flex flex-col items-center text-center z-10">
        
        {/* Animated Cyber Ring Loader */}
        <div className="relative mb-12 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            className="w-32 h-32 rounded-full border border-dashed border-nexus-cyan/40 p-2"
          >
            <div className="w-full h-full rounded-full border border-nexus-magenta/20 p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-nexus-cyan/5 to-nexus-magenta/5 border border-white/5 flex items-center justify-center shadow-neon-cyan/20">
                <Cpu className="w-8 h-8 text-nexus-cyan animate-pulse" />
              </div>
            </div>
          </motion.div>

          <div className="absolute inset-0 w-32 h-32 border border-nexus-cyan/20 rounded-full blur-sm scale-110 pointer-events-none animate-pulse-slow" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-white mb-2 glow-text-cyan">
          NEXUS
        </h1>
        
        {/* Progressive Bar */}
        <div className="h-1 bg-white/5 w-48 rounded-full overflow-hidden mb-6 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-nexus-cyan to-nexus-magenta" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Sync Indicator */}
        <span className="text-sm font-semibold tracking-widest text-nexus-cyan mb-8">
          {progress}% CORE SYNC
        </span>

        {/* System Logs */}
        <div className="w-full h-24 bg-black/60 backdrop-blur-md rounded-lg border border-nexus-border p-4 flex flex-col gap-1 items-start text-left text-[9px] font-mono text-slate-400 overflow-hidden">
          <div className="flex gap-1 items-center text-nexus-cyan border-b border-nexus-border/50 pb-1 w-full mb-1">
            <Terminal className="w-3 h-3" />
            <span className="tracking-widest">TELEMETRY LOGGER</span>
          </div>
          
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentLogIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-nexus-cyan font-bold"
            >
              &gt; {LOG_MESSAGES[currentLogIdx]}
            </motion.div>
          </AnimatePresence>
          {currentLogIdx > 0 && (
            <div className="opacity-40">&gt; {LOG_MESSAGES[currentLogIdx - 1]}</div>
          )}
          {currentLogIdx > 1 && (
            <div className="opacity-20">&gt; {LOG_MESSAGES[currentLogIdx - 2]}</div>
          )}
        </div>

        {/* Click Trigger */}
        <div className="h-16 mt-10">
          <AnimatePresence>
            {isReady && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)' }}
                onClick={handleEnter}
                className="px-8 py-3 bg-white text-black font-black tracking-widest rounded-lg cursor-pointer border border-transparent hover:bg-black hover:text-white hover:border-white transition-all duration-300 shadow-neon-white"
              >
                ESTABLISH PORTAL LINK
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
