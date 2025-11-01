// carte-anniversaire/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import messagesData from './data/messages.json';
import easterEggsData from './data/easterEggs.json';
import { RainDrop } from './components/RainDrop';
import { Confetti } from './components/Confetti';
import { ChatHeader } from './components/ChatHeader';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MessageBubble } from './components/MessageBubble';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatInput } from './components/ChatInput';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useEasterEggMode } from './hooks/useEasterEggMode';

type Message = {
  id: number;
  text: string;
  sender: string;
  avatar?: string;
  color: string;
  delay: number;
  final?: boolean;
  image?: string;
  isEasterEgg?: boolean;
}

type EasterEgg = {
  code: string;
  message: Message;
}

const BirthdayCard = () => {
  const [messages] = useState<Message[]>(messagesData);
  const [easterEggs] = useState<EasterEgg[]>(easterEggsData);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [unlockedSecrets, setUnlockedSecrets] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState('');
  const [typingSenderAvatar, setTypingSenderAvatar] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [showSecretUnlocked, setShowSecretUnlocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isMuted, toggleMute } = useAudioPlayer('/assets/rain-sound.mp3');
  const easterEggModeEnabled = useEasterEggMode();

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

  const handleSecretCode = (code: string) => {
    if (!conversationStarted || !easterEggModeEnabled) return;

    // Vérifier si le code existe dans les easter eggs
    const easterEgg = easterEggs.find(egg => egg.code === code);

    if (easterEgg && !unlockedSecrets.has(code)) {
      // Marquer le secret comme déverrouillé
      setUnlockedSecrets(prev => new Set(prev).add(code));

      // Afficher l'animation de déverrouillage
      setShowSecretUnlocked(true);
      setTimeout(() => setShowSecretUnlocked(false), 2000);

      // Afficher l'indicateur de frappe
      setIsTyping(true);
      setTypingSender(easterEgg.message.sender);
      setTypingSenderAvatar(easterEgg.message.avatar || '');

      // Ajouter le message secret après un délai
      setTimeout(() => {
        setDisplayedMessages(prev => [...prev, easterEgg.message]);
        setIsTyping(false);
        setTypingSender('');
        setTypingSenderAvatar('');

        // Confettis pour les messages finaux
        if (easterEgg.message.final) {
          setTimeout(() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }, 200);
        }
      }, 2000);
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

      {/* Animation de déverrouillage de secret */}
      <AnimatePresence>
        {showSecretUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-purple-600/90 backdrop-blur-md text-white px-8 py-6 rounded-2xl shadow-2xl text-center">
              <div className="text-6xl mb-2">🔓</div>
              <div className="text-2xl font-bold">Secret Déverrouillé !</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contrôle du son */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 p-3 bg-blue-500/20 backdrop-blur-sm rounded-full hover:bg-blue-500/30 transition-colors"
      >
        {isMuted ? <VolumeX className="text-white" size={24} /> : <Volume2 className="text-white" size={24} />}
      </button>

      {/* Compteur de secrets */}
      {conversationStarted && easterEggModeEnabled && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 z-50 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <span className="text-white text-sm font-semibold">
            🔐 Secrets: {unlockedSecrets.size}/{easterEggs.length}
          </span>
        </motion.div>
      )}

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

        <ChatInput
          onSecretCodeEntered={handleSecretCode}
          conversationStarted={conversationStarted}
          easterEggModeEnabled={easterEggModeEnabled}
        />
      </div>
    </div>
  );
};

export default BirthdayCard;