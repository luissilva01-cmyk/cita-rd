// src/hooks/useOnboarding.js
import { useState, useEffect } from "react";

export function useOnboarding() {
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);

  useEffect(() => {
    const completado = localStorage.getItem("onboarding_completado");
    
    if (!completado) {
      // Mostrar después de 1 segundo
      setTimeout(() => {
        setMostrarOnboarding(true);
      }, 1000);
    }
  }, []);

  const cerrarOnboarding = () => {
    setMostrarOnboarding(false);
  };

  const resetearOnboarding = () => {
    localStorage.removeItem("onboarding_completado");
    setMostrarOnboarding(true);
  };

  return {
    mostrarOnboarding,
    cerrarOnboarding,
    resetearOnboarding
  };
}
