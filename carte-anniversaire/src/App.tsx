import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import messagesData from './data/messages.json';
import { RainDrop } from './components/RainDrop';
import { Confetti } from './components/Confetti';
import { ChatHeader } from './components/ChatHeader';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatInput } from './components/ChatInput';
import { useAudioPlayer } from './hooks/useAudioPlayer';

type Message = {
  id: number;
  text: string;
  sender: string;
  avatar?: string;
  color: string;
  delay: number;
  final?: boolean;
}

const BirthdayCard = () => {
  const [messages] = useState<Message[]>(messagesData);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState('');
  const [typingSenderAvatar, setTypingSenderAvatar] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isMuted, toggleMute } = useAudioPlayer('/assets/rain-sound.mp3');

  const rainDrops = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: Math.random() * 1 + 0.5,
    left: Math.random() * 100
  }));

  useEffect(() => {
    if (!conversationStarted) return;

    messages.forEach((message) => {
      setTimeout(() => {
        setIsTyping(true);
        setTypingSender(message.sender);
        setTypingSenderAvatar(message.avatar || '');

        setTimeout(() => {
          setDisplayedMessages(prev => [...prev, message]);
          setIsTyping(false);
          setTypingSender('');
          setTypingSenderAvatar('');

          if (message.final) {
            setTimeout(() => {
              setShowConfetti(true);
            }, 200);
          }
        }, 1800);
      }, message.delay);
    });
  }, [messages, conversationStarted]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      }
    }
  }, [displayedMessages, isTyping]);

  const handleStartConversation = () => {
    if (!conversationStarted) {
      setConversationStarted(true);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Pluie animée */}
      {rainDrops.map(drop => (
        <RainDrop key={drop.id} {...drop} />
      ))}

      {/* Confettis */}
      {showConfetti && <Confetti />}

      {/* Contrôle du son */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 p-3 bg-blue-500/20 backdrop-blur-sm rounded-full hover:bg-blue-500/30 transition-colors"
      >
        {isMuted ? <VolumeX className="text-white" size={24} /> : <Volume2 className="text-white" size={24} />}
      </button>

      {/* Interface de chat */}
      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto p-4">
        <ChatHeader
          conversationStarted={conversationStarted}
          messagesCount={messages.length}
          onClick={handleStartConversation}
        />

        {/* Zone de messages */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-md overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {!conversationStarted ? (
            <WelcomeScreen messagesCount={messages.length} />
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
          )}

          {/* Indicateur de saisie */}
          {conversationStarted && isTyping && (
            <TypingIndicator sender={typingSender} avatar={typingSenderAvatar} />
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput />
      </div>
    </div>
  );
};

export default BirthdayCard;