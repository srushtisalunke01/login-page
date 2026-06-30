import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Petal {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

export default function PetalsRain() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate 45 random petals
    const list = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of viewport width
      size: Math.random() * 10 + 8, // 8px to 18px
      delay: Math.random() * 3, // staggered start delays
      duration: Math.random() * 5 + 5, // 5s to 10s fall speed
      rotate: Math.random() * 360,
    }));
    setPetals(list);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-40">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -40, x: `${petal.x}vw`, rotate: petal.rotate, opacity: 0 }}
          animate={{
            y: '105vh',
            x: [`${petal.x}vw`, `${petal.x + (Math.random() * 12 - 6)}vw`],
            rotate: petal.rotate + 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute"
          style={{
            width: petal.size,
            height: petal.size * 1.35,
            // Pinkish sakura petal color with soft gloss gradients
            background: 'linear-gradient(135deg, rgba(255, 192, 203, 0.8), rgba(255, 105, 180, 0.45))',
            borderRadius: '50% 0% 50% 50%',
            filter: 'drop-shadow(0 0 5px rgba(255, 192, 203, 0.4))'
          }}
        />
      ))}
    </div>
  );
}
