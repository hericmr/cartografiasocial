import { useState, useEffect } from "react";

/**
 * Hook para controlar visibilidade do painel
 * 
 * @param {Object|null} painelInfo - Informações do painel a ser exibido
 * @returns {Object} Objeto com isVisible e isMobile
 */
const usePainelVisibility = (painelInfo) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    if (painelInfo && typeof painelInfo === 'object') {
      setIsVisible(true);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = "hidden";
      }
    } else {
      setIsVisible(false);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = "";
      }
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = "";
      }
    };
  }, [painelInfo]);

  return { isVisible, isMobile };
};

export default usePainelVisibility;
