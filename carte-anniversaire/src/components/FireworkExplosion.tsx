import React from 'react';
import { motion } from 'framer-motion';

interface FireworkExplosionProps {
  x: number;
  y: number;
  delay: number;
  id: number;
}

export const FireworkExplosion: React.FC<FireworkExplosionProps> = ({ x, y, delay, id }) => {
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = Math.random() * 150 + 100;
    return {
      id: i,
      angle,
      velocity,
      size: Math.random() * 6 + 4,
      color: ['#fbbf24', '#f59e0b', '#60a5fa', '#3b82f6', '#a78bfa', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#06b6d4'][Math.floor(Math.random() * 10)]
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 + id }}>
      {particles.map((particle) => (
        <motion.div
          key={`${id}-${particle.id}`}
          className="absolute rounded-full shadow-lg"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity + 200,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5]
          }}
          transition={{
            duration: 2,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
    </div>
  );
};