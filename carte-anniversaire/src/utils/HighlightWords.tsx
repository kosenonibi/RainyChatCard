// carte-anniversaire/src/utils/highlightWords.tsx
import React from 'react';

// Liste des mots à mettre en évidence avec leurs styles
const HIGHLIGHT_WORDS: Record<string, string> = {
    'friends': 'text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold inline-block animate-bounce',
    'Friends': 'text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold inline-block animate-bounce',
    'FRIENDS': 'text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold text-xl inline-block animate-bounce',
    '💙': 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] inline-block animate-pulse',
};

export const highlightWords = (text: string): React.ReactNode => {
  // Créer un pattern regex pour tous les mots à mettre en évidence
  const pattern = Object.keys(HIGHLIGHT_WORDS)
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Échapper les caractères spéciaux
    .join('|');

  const regex = new RegExp(`(${pattern})`, 'g');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const highlightClass = HIGHLIGHT_WORDS[part];

    if (highlightClass) {
      return (
        <span key={index} className={highlightClass}>
          {part}
        </span>
      );
    }

    return part;
  });
};