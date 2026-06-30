import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Cpu, ArrowRight, Chrome, Apple, Terminal } from 'lucide-react';

interface LoginCardProps {
  onLoginSuccess: () => void;
  isLoggingIn: boolean;
}

export default function LoginCard({ onLoginSuccess, isLoggingIn }: LoginCardProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mouse Tilt States for 3D Crystal Panel Effect
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates from center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Max 10deg rotation
    const rotX = -(mouseY / (height / 2)) * 10;
    const rotY = (mouseX / (width / 2)) * 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validations
    if (!email || !password) {
      setError('Please fill in all security protocols.');
      return;
    }
    
    if (password.length < 6) {
      setError('Keyphrase must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate luxury verification authorization delay
    setTimeout(() => {
      onLoginSuccess();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {!isLoggingIn && (
        <div className="relative z-10 w-full max-w-lg select-none px-4">
          
          {/* Floating Premium Product Visuals Orbiting the Card */}
          <div className="hidden lg:block absolute -left-24 top-1/4 pointer-events-none animate-bounce-slow text-4xl" style={{ animationDuration: '4s' }}>⌚</div>
          <div className="hidden lg:block absolute -right-24 top-1/3 pointer-events-none animate-bounce-slow text-4xl" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>📱</div>
          <div className="hidden lg:block absolute -left-28 bottom-1/4 pointer-events-none animate-bounce-slow text-4xl" style={{ animationDuration: '5s', animationDelay: '2.5s' }}>💍</div>
          <div className="hidden lg:block absolute -right-28 bottom-1/3 pointer-events-none animate-bounce-slow text-4xl" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>👜</div>

          {/* 3D Crystal Panel Container Card */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full bg-white/45 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_24px_50px_-12px_rgba(212,175,55,0.12)] relative"
          >
            {/* Elegant shine sweep golden border overlay */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#F5C542] to-transparent animate-pulse" />
            
            {/* Header branding */}
            <div className="text-center mb-8" style={{ transform: 'translateZ(20px)' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F5C542]/10 border border-[#F5C542]/20 text-[#F5C542] mb-4 animate-pulse">
                <Cpu className="w-6 h-6" />
              </div>
              
              <h1 className="font-orbitron text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#C9CED6] via-[#F5C542] to-[#C9CED6]">
                NEXUS
              </h1>
              <p className="text-[10px] font-orbitron font-bold tracking-widest text-[#78716c] mt-2 uppercase">
                Experience the Future of Luxury Shopping
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" style={{ transform: 'translateZ(10px)' }}>
              {/* Error logs */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-xl bg-nexus-magenta/10 border border-nexus-magenta/20 text-nexus-magenta text-xs font-orbitron font-bold uppercase tracking-wider"
                >
                  {error}
                </motion.div>
              )}

              {/* Full Name (Optional field) */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-orbitron tracking-widest text-[#78716c] block font-bold">
                  Operator Name (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    disabled={isLoading}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl w-full text-xs font-sans bg-white/20 border border-slate-200 focus:border-[#F5C542] focus:outline-none transition-colors duration-250 text-stone-800 placeholder:text-slate-400 font-medium"
                    placeholder="E.g., Alex Carter"
                  />
                </div>
              </div>

              {/* Email Identity field */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-orbitron tracking-widest text-[#78716c] block font-bold">
                  Email Identity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl w-full text-xs font-sans bg-white/20 border border-slate-200 focus:border-[#F5C542] focus:outline-none transition-colors duration-250 text-stone-800 placeholder:text-slate-400 font-medium"
                    placeholder="operator@nexus.com"
                  />
                </div>
              </div>

              {/* Password credentials keyphrase */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-orbitron tracking-widest text-[#78716c] block font-bold">
                  Security Keyphrase
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl w-full text-xs font-sans bg-white/20 border border-slate-200 focus:border-[#F5C542] focus:outline-none transition-colors duration-250 text-stone-800 placeholder:text-slate-400 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Recover Node / Remember Me checkbox links */}
              <div className="flex items-center justify-between text-[10px] font-orbitron text-[#78716c] font-bold">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    disabled={isLoading}
                    className="rounded border-slate-300 text-[#F5C542] focus:ring-[#F5C542] w-3 h-3 cursor-pointer" 
                  />
                  <span>Sync Node</span>
                </label>
                <a href="#" className="hover:text-[#F5C542] transition-colors duration-200">
                  Recover Key
                </a>
              </div>

              {/* Submit connection button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 bg-stone-900 text-white font-orbitron text-xs font-black tracking-widest rounded-xl hover:bg-black border border-transparent transition-all duration-300 group overflow-hidden shadow-md disabled:opacity-80 cursor-pointer"
              >
                {/* Gold hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5C542]/20 to-[#db2777]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <span className="flex items-center gap-2 text-[#F5C542]">
                      <svg className="animate-spin h-4 w-4 text-[#F5C542]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      DECRYPTING CREDENTIALS MATRIX...
                    </span>
                  ) : (
                    <>
                      ESTABLISH SYSTEM ACCESS
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 text-[#F5C542]" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Quick OAuth Authentication methods */}
            <div className="mt-6 border-t border-slate-200/60 pt-6 space-y-3" style={{ transform: 'translateZ(5px)' }}>
              <span className="text-[8px] font-orbitron tracking-widest text-[#78716c] block text-center font-bold">
                OR CONTINUE DIRECTLY WITH PROTOCOLS
              </span>
              <div className="flex gap-2.5">
                {/* Google */}
                <button
                  type="button"
                  onClick={onLoginSuccess}
                  className="flex-1 py-2.5 bg-white/40 hover:bg-white/90 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[9px] font-orbitron font-bold text-stone-700 cursor-pointer transition-colors duration-200"
                >
                  <Chrome className="w-3.5 h-3.5 text-nexus-cyan" />
                  GOOGLE
                </button>
                {/* Apple */}
                <button
                  type="button"
                  onClick={onLoginSuccess}
                  className="flex-1 py-2.5 bg-white/40 hover:bg-white/90 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[9px] font-orbitron font-bold text-stone-700 cursor-pointer transition-colors duration-200"
                >
                  <Apple className="w-3.5 h-3.5 text-stone-900" />
                  APPLE
                </button>
                {/* Microsoft */}
                <button
                  type="button"
                  onClick={onLoginSuccess}
                  className="flex-1 py-2.5 bg-white/40 hover:bg-white/90 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-[9px] font-orbitron font-bold text-stone-700 cursor-pointer transition-colors duration-200"
                >
                  <Terminal className="w-3.5 h-3.5 text-blue-500" />
                  MICROSOFT
                </button>
              </div>
            </div>

            {/* Footer specifications */}
            <div className="mt-6 text-center text-[8px] font-orbitron text-slate-400 font-bold tracking-widest" style={{ transform: 'translateZ(1px)' }}>
              NEXUS INFINITY SECURED NODE v9.0.0
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
