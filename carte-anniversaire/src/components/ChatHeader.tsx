import React from 'react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  conversationStarted: boolean;
  messagesCount: number;
  onClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversationStarted,
  messagesCount,
  onClick
}) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-blue-500/20 backdrop-blur-md rounded-t-2xl p-4 border-b border-blue-400/30 ${
        !conversationStarted ? 'cursor-pointer hover:bg-blue-500/30 transition-all' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
          🎂
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold">Happy Birthday Rainy</h2>
            {!conversationStarted && (
              <motion.div
                className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {messagesCount}
              </motion.div>
            )}
          </div>
          <p className="text-blue-200 text-sm">
            {conversationStarted
              ? `${messagesCount} messages from your friends`
              : 'Click to open your messages 🎁'}
          </p>
        </div>
        {!conversationStarted && (
          <motion.div
            className="absolute -right-1 -top-1"
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <div className="bg-red-500 text-white text-lg w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              👆
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};