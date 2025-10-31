import React, { useState, useEffect } from 'react';
import { FireworkExplosion } from './FireworkExplosion';

export const Confetti: React.FC = () => {
  const [explosions, setExplosions] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newExplosions = [];
    const explosionCount = 15;

    for (let i = 0; i < explosionCount; i++) {
      newExplosions.push({
        id: i,
        x: Math.random() * 60 + 20,
        y: Math.random() * 40 + 10,
        delay: (i * 20000) / explosionCount / 1000
      });
    }

    setExplosions(newExplosions);
  }, []);

  return (
    <>
      {explosions.map((explosion) => (
        <FireworkExplosion
          key={explosion.id}
          id={explosion.id}
          x={explosion.x}
          y={explosion.y}
          delay={explosion.delay}
        />
      ))}
    </>
  );
};