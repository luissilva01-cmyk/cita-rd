import { useState, useCallback, useRef } from 'react';

export const useMatchAnimation = () => {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const audioRef = useRef(null);

  // Precargar sonido de match
  const preloadMatchSound = useCallback(() => {
    try {
      audioRef.current = new Audio('/sounds/match.mp3');
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';
    } catch (error) {
      console.log('No se pudo precargar el sonido de match:', error);
    }
  }, []);

  // Reproducir sonido de match
  const playMatchSound = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => 
          console.log('No se pudo reproducir el sonido:', e)
        );
      }
    } catch (error) {
      console.log('Error reproduciendo sonido:', error);
    }
  }, []);

  // Mostrar animación de match
  const triggerMatchAnimation = useCallback((user) => {
    setMatchedUser(user);
    setShowMatchModal(true);
    playMatchSound();
    
    // Vibración en dispositivos móviles
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [playMatchSound]);

  // Cerrar modal de match
  const closeMatchModal = useCallback(() => {
    setShowMatchModal(false);
    setMatchedUser(null);
  }, []);

  // Crear confetti programático
  const createConfetti = useCallback(() => {
    // Esta función puede ser usada para crear confetti en cualquier momento
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#ff9ff3', '#54a0ff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.transition = 'all 3s ease-out';
        
        document.body.appendChild(confetti);
        
        // Animar caída
        setTimeout(() => {
          confetti.style.top = window.innerHeight + 'px';
          confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
          confetti.style.opacity = '0';
        }, 10);
        
        // Limpiar elemento
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 3000);
      }, i * 50);
    }
  }, []);

  return {
    showMatchModal,
    matchedUser,
    triggerMatchAnimation,
    closeMatchModal,
    createConfetti,
    preloadMatchSound,
    playMatchSound
  };
};

// Hook para efectos de sonido generales
export const useSoundEffects = () => {
  const likeSound = useRef(null);
  const passSound = useRef(null);
  const superLikeSound = useRef(null);

  const preloadSounds = useCallback(() => {
    try {
      likeSound.current = new Audio('/sounds/like.mp3');
      passSound.current = new Audio('/sounds/pass.mp3');
      superLikeSound.current = new Audio('/sounds/superlike.mp3');
      
      [likeSound, passSound, superLikeSound].forEach(sound => {
        if (sound.current) {
          sound.current.volume = 0.2;
          sound.current.preload = 'auto';
        }
      });
    } catch (error) {
      console.log('No se pudieron precargar los sonidos:', error);
    }
  }, []);

  const playLikeSound = useCallback(() => {
    try {
      if (likeSound.current) {
        likeSound.current.currentTime = 0;
        likeSound.current.play().catch(e => console.log('Error:', e));
      }
    } catch (error) {
      console.log('Error reproduciendo like sound:', error);
    }
  }, []);

  const playPassSound = useCallback(() => {
    try {
      if (passSound.current) {
        passSound.current.currentTime = 0;
        passSound.current.play().catch(e => console.log('Error:', e));
      }
    } catch (error) {
      console.log('Error reproduciendo pass sound:', error);
    }
  }, []);

  const playSuperLikeSound = useCallback(() => {
    try {
      if (superLikeSound.current) {
        superLikeSound.current.currentTime = 0;
        superLikeSound.current.play().catch(e => console.log('Error:', e));
      }
    } catch (error) {
      console.log('Error reproduciendo superlike sound:', error);
    }
  }, []);

  return {
    preloadSounds,
    playLikeSound,
    playPassSound,
    playSuperLikeSound
  };
};