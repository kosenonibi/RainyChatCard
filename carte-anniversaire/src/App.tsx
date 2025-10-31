import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, VolumeX } from 'lucide-react';
import messagesData from './data/messages.json';

const RainDrop = ({ delay, duration, left }) => (
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

const FireworkExplosion = ({ x, y, delay, id }) => {
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 30;
    const velocity = Math.random() * 150 + 100;
    return {
      id: i,
      angle,
      velocity,
      size: Math.random() * 6 + 4,
      color: ['#fbbf24', '#f59e0b', '#60a5fa', '#3b82f6', '#a78bfa', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#06b6d4'][Math.floor(Math.random() * 10)]
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 + id }}>
      {particles.map((particle) => (
        <motion.div
          key={`${id}-${particle.id}`}
          className="absolute rounded-full shadow-lg"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity + 200,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5]
          }}
          transition={{
            duration: 2,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
    </div>
  );
};

const Confetti = () => {
  const [explosions, setExplosions] = useState([]);

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

const BirthdayCard = () => {
  const [messages] = useState(messagesData);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  const rainDrops = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: Math.random() * 1 + 0.5,
    left: Math.random() * 100
  }));

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const generateRainSound = () => {
      const bufferSize = audioContext.sampleRate * 2;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = isMuted ? 0 : 0.15;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start();

      return { source, gainNode };
    };

    const rainSound = generateRainSound();

    return () => {
      if (rainSound.source) {
        rainSound.source.stop();
      }
      audioContext.close();
    };
  }, []);

  useEffect(() => {
    messages.forEach((message, index) => {
      setTimeout(() => {
        setIsTyping(true);
        setTypingSender(message.sender);

        setTimeout(() => {
          setDisplayedMessages(prev => [...prev, message]);
          setIsTyping(false);
          setTypingSender('');

          if (message.final) {
            setTimeout(() => {
              setShowConfetti(true);
            }, 200);
          }
        }, 1800);
      }, message.delay);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages, isTyping]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-4 right-4 z-50 p-3 bg-blue-500/20 backdrop-blur-sm rounded-full hover:bg-blue-500/30 transition-colors"
      >
        {isMuted ? <VolumeX className="text-white" size={24} /> : <Volume2 className="text-white" size={24} />}
      </button>

      {/* Interface de chat */}
      <div className="relative z-10 flex flex-col h-full max-w-2xl mx-auto p-4">
        {/* En-tête */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-blue-500/20 backdrop-blur-md rounded-t-2xl p-4 border-b border-blue-400/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              🎂
            </div>
            <div>
              <h2 className="text-white font-semibold">Happy Birthday Rainy</h2>
              <p className="text-blue-200 text-sm">{messages.length} messages from your friends</p>
            </div>
          </div>
        </motion.div>

        {/* Zone de messages */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-md overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {displayedMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex justify-start gap-3"
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 ${message.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {getInitials(message.sender)}
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
            ))}
          </AnimatePresence>

          {/* Indicateur de saisie */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start gap-3"
            >
              <div className="w-10 h-10 bg-blue-500/60 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials(typingSender)}
              </div>
              <div className="flex flex-col">
                <span className="text-blue-200 text-sm font-semibold mb-1">{typingSender}</span>
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
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie (désactivée) */}
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
      </div>
    </div>
  );
};

export default BirthdayCard;