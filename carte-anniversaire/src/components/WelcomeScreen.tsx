import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  messagesCount: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ messagesCount }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl mb-4"
        >
          🎁
        </motion.div>
        <p className="text-blue-200 text-lg font-semibold">
          You have {messagesCount} new messages!
        </p>
        <p className="text-blue-300/70 text-sm mt-2">
          Click the header above to open
        </p>
      </motion.div>
    </div>
  );
};