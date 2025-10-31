import React from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: string;
  avatar?: string;
  color: string;
  delay: number;
  final?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      layout
      className="flex justify-start gap-3"
    >
      {/* Avatar avec image */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
        {message.avatar ? (
          <img
            src={`/assets/${message.avatar}`}
            alt={message.sender}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${getInitials(message.sender)}</div>`;
              }
            }}
          />
        ) : (
          <div className={`w-full h-full ${message.color} flex items-center justify-center text-white font-bold text-sm`}>
            {getInitials(message.sender)}
          </div>
        )}
      </div>

      {/* Message */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-200 text-sm font-semibold">{message.sender}</span>
        </div>
        <div
          className={`${message.color} ${
            message.final
              ? 'text-white text-lg md:text-xl font-bold shadow-2xl shadow-blue-500/50 p-6 rounded-3xl'
              : 'bg-opacity-90 text-white p-4 rounded-2xl rounded-tl-none'
          } max-w-md`}
        >
          <div className="whitespace-pre-line">{message.text}</div>
        </div>
      </div>
    </motion.div>
  );
};