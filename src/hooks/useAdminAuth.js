import { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Hook para verificar e gerenciar autenticação de administrador
 * @returns {object} { isAdmin, setIsAdmin }
 */
export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Verifica se há credenciais armazenadas ao inicializar
    return authService.hasStoredCredentials();
  });

  useEffect(() => {
    // Verifica periodicamente se ainda há credenciais válidas
    const checkAuth = () => {
      setIsAdmin(authService.hasStoredCredentials());
    };

    // Verifica a cada 5 segundos
    const interval = setInterval(checkAuth, 5000);

    // Verifica quando a página recebe foco
    window.addEventListener('focus', checkAuth);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  return { isAdmin, setIsAdmin };
};


