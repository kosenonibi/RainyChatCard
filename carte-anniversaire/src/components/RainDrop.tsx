import React from 'react';
import { motion } from 'framer-motion';

interface RainDropProps {
  delay: number;
  duration: number;
  left: number;
}

export const RainDrop: React.FC<RainDropProps> = ({ delay, duration, left }) => (
  <motion.div
    className="absolute w-0.5 bg-gradient-to-b from-blue-300/60 to-blue-500/30"
    style={{ left: `${left}%`, top: '-10px' }}
    initial={{ y: -10, height: Math.random() * 20 + 15 }}
    animate={{ y: '100vh' }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: 'linear'
    }}
  />
);