import { useEffect, useRef, useState } from 'react';

export const useAudioPlayer = (audioPath: string) => {
  const [isMuted, setIsMuted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    audio.load();

    const handleCanPlay = () => {
      setAudioReady(true);
      if (!isMuted) {
        audio.play().catch(err => {
          console.log('Audio autoplay bloqué, cliquez pour activer:', err);
        });
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlay);

    const playOnInteraction = () => {
      if (!isMuted && audio.paused) {
        audio.play().catch(err => console.log('Audio playback failed:', err));
      }
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('keydown', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction);
    document.addEventListener('keydown', playOnInteraction);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      document.removeEventListener('click', playOnInteraction);
      document.removeEventListener('keydown', playOnInteraction);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }
  };

  return { isMuted, audioReady, toggleMute };
};