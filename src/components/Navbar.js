import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddLocationButton from './AddLocationButton';
import AdminLoginModal from './AdminLoginModal';
import SearchModal from './SearchModal';
import { useSearch } from '../contexts/SearchContext';
import { Settings, ChevronDown, Shield, Menu, X, LayoutGrid, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
    
const Navbar = () => {
  const logoCartografiaUrl = useMemo(
    () => `${process.env.PUBLIC_URL || ''}/logo_cartografia_2.png`,
    []
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openSearch } = useSearch();

  const handleAdminClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowAdminPanel(false);
    setShowLoginModal(false);
  };

  const isMapaPage = location.pathname === '/mapa';
  const isSobrePage = location.pathname === '/sobre';
  const isHomePage = location.pathname === '/';
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 text-white shadow-lg">
      {/* Barra azul marinho escura */}
      <div className="bg-blue-950 w-full h-16">
        <nav className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo e Título */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 group focus:outline-none"
          aria-label="Ir para a página inicial"
        >
          <img
            src={logoCartografiaUrl}
            alt="Cartografia Social de Santos"
            className="h-9 sm:h-10 md:h-12 w-auto transform group-hover:scale-105 transition-transform duration-200 drop-shadow-lg"
          />
        </button>

        {/* Versão Mobile - Menu Hambúrguer */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-blue-800/50 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Menu principal"
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>

        {/* Links de Navegação e Logos - Versão Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Botão de Busca */}
          <button
            onClick={openSearch}
            className="p-2 rounded-full hover:bg-blue-800/50 transition-all duration-200 group
                     focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
            aria-label="Buscar no site"
            title="Buscar no site"
          >
            <Search className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-200" />
          </button>

          {/* Botão Ver Mapa */}
          {!isMapaPage && (
            <button
              onClick={() => navigate('/mapa')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 
                       transition-all duration-200 rounded-lg hover:shadow-md active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Ver Mapa
            </button>
          )}

          {/* Botão Sobre */}
          <button
            onClick={() => navigate('/sobre')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSobrePage
                ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-md'
                : 'text-white bg-blue-800/50 hover:bg-blue-700/50 hover:shadow-md'
            }`}
          >
            Sobre o projeto
          </button>


          {/* Logo Unifesp */}
          <a 
            href="https://www.unifesp.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center group transition-transform duration-200 hover:scale-105"
          >
            <img
              src="/cartografiasocial/logo.png"
              alt="Logo da Unifesp"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <span className="text-[10px] sm:text-xs tracking-wide font-serif mt-0.5 opacity-90">
              Serviço Social
            </span>
          </a>

          {/* Área de Administração */}
          {!isAdmin ? (
            <button
              onClick={handleAdminClick}
              className="p-2 rounded-full hover:bg-blue-800/50 transition-all duration-200 group
                       focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
              aria-label="Configurações de administrador"
            >
              <Settings className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-200" />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white 
                         bg-blue-800/50 hover:bg-blue-700/50 rounded-lg transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
                <motion.div
                  animate={{ rotate: showAdminPanel ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {showAdminPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100"
                  >
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                      Gerenciar Locais
                    </div>
                    <div className="py-1">
                      <AddLocationButton />
                      <button
                        onClick={() => navigate('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 
                                 transition-colors duration-200 flex items-center gap-2"
                      >
                        <LayoutGrid className="h-4 w-4" />
                        Painel de Administração
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        </nav>
      </div>
      
      {/* Menu Mobile Expandido */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-blue-950 border-t border-blue-900/30"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {/* Botão de Busca Mobile */}
              <button
                onClick={() => {
                  openSearch();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-sm font-medium text-white bg-blue-800/50 hover:bg-blue-700/50 
                         rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                         focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
              >
                <Search className="w-4 h-4" />
                Buscar no site
              </button>

              {/* Botão Ver Mapa Mobile */}
              {!isMapaPage && (
                <button
                  onClick={() => handleNavigation('/mapa')}
                  className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 
                           rounded-lg transition-all duration-200 active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Ver Mapa
                </button>
              )}

              <button
                onClick={() => handleNavigation('/sobre')}
                className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                           isSobrePage
                             ? 'text-white bg-blue-600 hover:bg-blue-500'
                             : 'text-white bg-blue-800/50 hover:bg-blue-700/50'
                         }`}
              >
                Sobre o projeto
              </button>

              
              <div className="flex items-center justify-center py-2">
                <a 
                  href="https://www.unifesp.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center transform transition-transform duration-200 hover:scale-105"
                >
                  <img
                    src="/cartografiasocial/logo.png"
                    alt="Logo da Unifesp"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-[10px] tracking-wide font-serif mt-0.5 text-white/90">
                    Serviço Social
                  </span>
                </a>
              </div>
              
              {!isAdmin ? (
                <button
                  onClick={handleAdminClick}
                  className="w-full py-2.5 text-sm font-medium text-white bg-blue-800/50 hover:bg-blue-700/50 
                           rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                           focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
                >
                  <Settings className="w-4 h-4" />
                  Área administrativa
                </button>
              ) : (
                <>
                  <div className="w-full py-2 px-4 text-sm font-medium text-white/90 text-center border-t border-blue-800/30">
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" />
                      Acesso de Administrador
                    </span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <AddLocationButton />
                    <button
                      onClick={() => handleNavigation('/admin')}
                      className="w-full py-2.5 text-sm text-white bg-blue-800/50 hover:bg-blue-700/50 
                               rounded-lg transition-all duration-200 flex items-center justify-center gap-2
                               focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
                    >
                      <LayoutGrid className="h-4 w-4" />
                      Painel de Administração
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Login Admin */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Modal de Busca */}
      <SearchModal />
    </header>
  );
};

export default Navbar;