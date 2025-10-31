import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  sender: string;
  avatar?: string;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ sender, avatar }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start gap-3"
    >
      <div className="w-10 h-10 rounded-full shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
        {avatar ? (
          <img
            src={`/assets/${avatar}`}
            alt={sender}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm bg-blue-500/60">${getInitials(sender)}</div>`;
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-blue-500/60 flex items-center justify-center text-white font-bold text-sm">
            {getInitials(sender)}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-blue-200 text-sm font-semibold mb-1">{sender}</span>
        <div className="bg-blue-500/60 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};