// carte-anniversaire/src/components/ChatInput.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock } from 'lucide-react';

interface ChatInputProps {
  onSecretCodeEntered: (code: string) => void;
  conversationStarted: boolean;
  easterEggModeEnabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSecretCodeEntered,
  conversationStarted,
  easterEggModeEnabled
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim()) {
      onSecretCodeEntered(inputValue.trim().toLowerCase());
      setInputValue('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-blue-500/20 backdrop-blur-md rounded-b-2xl p-4 border-t border-blue-400/30"
    >
      {easterEggModeEnabled ? (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                disabled={!conversationStarted}
                placeholder={
                  conversationStarted
                    ? "🔍 Search well, there are secret messages..."
                    : "..."
                }
                className={`w-full bg-slate-800/50 text-white placeholder-blue-300/50 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all ${
                  !conversationStarted ? 'cursor-not-allowed' : ''
                }`}
                onFocus={() => setShowHint(true)}
                onBlur={() => setTimeout(() => setShowHint(false), 200)}
              />

              <AnimatePresence>
                {showHint && conversationStarted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-slate-800/90 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm"
                  >
                    💡 Try typing a name or a special word...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={!conversationStarted || !inputValue.trim()}
              className={`p-3 rounded-full transition-all ${
                conversationStarted && inputValue.trim()
                  ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                  : 'bg-blue-500/50 cursor-not-allowed'
              }`}
            >
              {conversationStarted ? (
                <Send className="text-white" size={20} />
              ) : (
                <Lock className="text-white/50" size={20} />
              )}
            </button>
          </form>
        </>
      ) : (
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
      )}
    </motion.div>
  );
};