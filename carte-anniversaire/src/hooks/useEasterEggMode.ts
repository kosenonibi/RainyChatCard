// carte-anniversaire/src/hooks/useEasterEggMode.ts
import { useState, useEffect } from 'react';

export const useEasterEggMode = () => {
  const [isEasterEggModeEnabled, setIsEasterEggModeEnabled] = useState(false);

  useEffect(() => {
    // Vérifier si le paramètre 'secrets' est présent dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const hasSecretsParam = urlParams.has('secrets');

    setIsEasterEggModeEnabled(hasSecretsParam);

    // Optionnel : log pour le debug (à retirer en production)
    if (hasSecretsParam) {
      console.log('🔓 Mode Easter Eggs activé !');
    }
  }, []);

  return isEasterEggModeEnabled;
};