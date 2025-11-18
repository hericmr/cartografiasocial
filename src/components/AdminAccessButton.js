import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginModal from './AdminLoginModal';
import { useAdminAuth } from '../hooks/useAdminAuth';

/**
 * Componente para acesso ao painel administrativo via atalho de teclado
 * Atalho: Ctrl+Shift+A (Windows/Linux) ou Cmd+Shift+A (Mac)
 */
const AdminAccessButton = () => {
  const navigate = useNavigate();
  const { isAdmin, setIsAdmin } = useAdminAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Atalho de teclado: Ctrl+Shift+A (Windows/Linux) ou Cmd+Shift+A (Mac)
  useEffect(() => {
    const handleKeyPress = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (modifierKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleAdminAccess();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin]);

  const handleAdminAccess = () => {
    if (isAdmin) {
      // Se já está autenticado, vai direto para o painel
      navigate('/admin');
    } else {
      // Se não está autenticado, mostra modal de login
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    navigate('/admin');
  };

  // Componente invisível - apenas gerencia o atalho de teclado
  return (
    <AdminLoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      onSuccess={handleLoginSuccess}
    />
  );
};

export default AdminAccessButton;

