import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { sounds } from '../../utils/sounds';

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorStyle, setCursorStyle] = useState('border-nexus-cyan bg-transparent');

  const springConfig = { damping: 25, stiffness: 220 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset by half of cursor width (32px / 2 = 16px)
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') ||
        target.closest('.interactive-card');

      if (isInteractive) {
        setIsHovered(true);
        sounds.playHover();

        // Check if there is a specific hover type (e.g. magenta accent)
        if (target.closest('.danger-hover') || target.closest('.logout-btn') || target.classList.contains('text-nexus-magenta')) {
          setCursorStyle('border-nexus-magenta bg-nexus-magenta/10 scale-150');
        } else {
          setCursorStyle('border-nexus-cyan bg-nexus-cyan/15 scale-150');
        }
      } else {
        setIsHovered(false);
        setCursorStyle('border-nexus-cyan bg-transparent');
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.closest('.interactive-card');

      if (isInteractive) {
        sounds.playClick();
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 w-8 h-8 rounded-full border-2 ${cursorStyle} pointer-events-none z-[9999] transition-transform duration-300 ease-out hidden md:block`}
      style={{
        x: cursorX,
        y: cursorY,
        boxShadow: isHovered ? '0 0 25px var(--accent-primary)' : '0 0 10px var(--accent-primary)'
      }}
    />
  );
}
