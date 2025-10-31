import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export const ChatInput: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-blue-500/20 backdrop-blur-md rounded-b-2xl p-4 border-t border-blue-400/30"
    >
      <div className="flex gap-2">
        <input
          type="text"
          disabled
          placeholder="... 🎁"
          className="flex-1 bg-slate-800/50 text-white placeholder-blue-300/50 px-4 py-3 rounded-full focus:outline-none cursor-not-allowed"
        />
        <button
          disabled
          className="bg-blue-500/50 p-3 rounded-full cursor-not-allowed"
        >
          <Send className="text-white" size={20} />
        </button>
      </div>
    </motion.div>
  );
};