import { useState, useEffect } from 'react';
import NexusLogo3D from './components/NexusLogo3D';
import LoginCard from './components/LoginCard';
import LoadingScreen from './components/ui/LoadingScreen';
import PremiumWelcomeModal from './components/ui/PremiumWelcomeModal';
import ThemeSwitcher from './components/ui/ThemeSwitcher';
import DashboardPage from './pages/Dashboard/DashboardPage';
import { useNexusStore } from './store/nexusStore';
import { sounds } from './utils/sounds';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const { 
    theme, introComplete, isLoggingIn, isLoggedIn, 
    setLoggingIn, setLoggedIn 
  } = useNexusStore();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Initialise document attribute with default active theme on boot
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isLoggingIn) {
      // Zoom transition sequence matching camera animator (2.5s)
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoggingIn]);

  const handleLoginSuccess = () => {
    setLoggingIn(true);
  };

  const handleEnterDashboard = () => {
    sounds.playWhoosh();
    setShowWelcomeModal(false);
    setLoggedIn(true);
  };

  return (
    <div className={`relative w-screen bg-nexus-bg ${isLoggedIn ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>
      {/* Floating Theme Switcher Widget Deck */}
      {introComplete && <ThemeSwitcher />}

      <AnimatePresence mode="wait">
        {/* State 1: Cinematic Entry Screen */}
        {!introComplete && (
          <motion.div
            key="loader"
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50"
          >
            <LoadingScreen />
          </motion.div>
        )}

        {/* State 2: Login Interface (logo, login card, welcome overlay) */}
        {introComplete && !isLoggedIn && (
          <motion.div
            key="login-interface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#FFFDF7] via-[#F8F9FA] to-[#DDEEFF] overflow-hidden"
          >
            {/* Animated Aurora mesh background glow spots */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(221,238,255,0.45),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,230,255,0.45),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,253,247,0.3),transparent_70%)] pointer-events-none" />
            
            {/* Floating glass geometric reflection blobs */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-white/10 to-sky-200/10 blur-3xl -top-32 -left-32 pointer-events-none animate-pulse-slow" />
            <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-white/10 to-purple-200/10 blur-3xl -bottom-32 -right-32 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

            {/* Subtle luxury gold sparkles in background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,197,66,0.06),transparent_60%)] pointer-events-none" />
            
            {/* 3D Interactive Rotating Canvas */}
            <NexusLogo3D isZoomed={isLoggingIn} />

            {/* Login input card */}
            {!showWelcomeModal && (
              <LoginCard onLoginSuccess={handleLoginSuccess} isLoggingIn={isLoggingIn} />
            )}

            {/* Portal zoom energy pulse flash */}
            <AnimatePresence>
              {isLoggingIn && !showWelcomeModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 1, 0], scale: [1, 1, 1.5, 2] }}
                  transition={{ duration: 2.5, times: [0, 0.6, 0.9, 1] }}
                  className="absolute inset-0 bg-white mix-blend-screen pointer-events-none z-25"
                />
              )}
            </AnimatePresence>

            {/* Centered Premium Welcome Popup Overlay */}
            <AnimatePresence>
              {showWelcomeModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-30"
                >
                  <PremiumWelcomeModal onClose={handleEnterDashboard} userName="Operator Alex" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* State 3: Premium Bento Dashboard */}
        {introComplete && isLoggedIn && (
          <motion.div
            key="dashboard-scene"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full min-h-screen z-30 relative"
          >
            <DashboardPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
