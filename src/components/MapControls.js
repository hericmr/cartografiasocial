import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';

// Reusable minimalistic button component
const ControlButton = ({ children, onClick, ariaLabel, title, className = '' }) => {
  const baseClasses = "w-10 h-10 rounded-lg bg-white/90 hover:bg-white backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-200 hover:shadow-lg active:scale-95";
  const classes = `${baseClasses} ${className}`;
  
  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel} title={title}>
      {children}
    </button>
  );
};

// Internal component for map connection
const MapControlsInternal = ({ onZoomChange }) => {
  const { 'main-map': map } = useMap();
  
  useEffect(() => {
    if (onZoomChange && map) {
      onZoomChange.current = (delta) => {
        const currentZoom = map.getZoom();
        const newZoom = currentZoom + delta;
        map.zoomTo(newZoom, { duration: 200 });
      };
    }
  }, [map, onZoomChange]);

  return null;
};

// Main controls component
const MapControls = ({ onLayersToggle, layersMenuOpen, onWelcomeClick, searchQuery, onSearchChange }) => {
  const [textScale, setTextScale] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cartografiasocial:textScale') : null;
    return stored ? parseFloat(stored) : 1;
  });
  const zoomChangeRef = useRef(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  useEffect(() => {
    const clamped = Math.min(1.3, Math.max(0.9, textScale));
    if (clamped !== textScale) {
      setTextScale(clamped);
      return;
    }
    document.documentElement.style.fontSize = `${16 * clamped}px`;
    try {
      localStorage.setItem('cartografiasocial:textScale', String(clamped));
    } catch {}
  }, [textScale]);

  const handleZoomChange = useCallback((delta) => {
    if (zoomChangeRef.current) {
      zoomChangeRef.current(delta);
    }
  }, []);

  const toggleTextScale = () => {
    setTextScale((v) => (v >= 1.3 ? 1.0 : Math.round((v + 0.15) * 100) / 100));
  };

  return (
    <>
      <MapControlsInternal onZoomChange={zoomChangeRef} />
      
      <div className="fixed top-4 left-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        {/* Search Control */}
        <div className={`flex items-center bg-white/90 backdrop-blur-sm shadow-md rounded-lg transition-all duration-300 overflow-hidden ${isSearchExpanded ? 'w-56' : 'w-10 h-10'}`}>
          <button 
            type="button"
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center hover:bg-white transition-all focus:outline-none"
            onClick={() => setIsSearchExpanded(true)}
            title="Pesquisar marcadores"
            aria-label="Pesquisar marcadores"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
               <circle cx="11" cy="11" r="8"></circle>
               <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          {isSearchExpanded && (
             <div className="flex-1 relative flex items-center h-10">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  onBlur={handleSearchBlur}
                  placeholder="Pesquisar..."
                  className="w-full bg-transparent border-none outline-none text-gray-700 pl-1 pr-8 text-[15px] placeholder-gray-500 font-medium font-sans"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      if (onSearchChange) onSearchChange('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 flex items-center justify-center text-gray-400 hover:text-gray-600 h-full w-6 focus:outline-none"
                    aria-label="Limpar pesquisa"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
             </div>
          )}
        </div>

        {onWelcomeClick && (
          <ControlButton
            onClick={onWelcomeClick}
            ariaLabel="Sobre o site"
            title="Sobre o site"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </ControlButton>
        )}

        <ControlButton
          onClick={toggleTextScale}
          ariaLabel="Ajustar tamanho do texto"
          title={`Tamanho: ${Math.round(textScale * 100)}%`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
            <path d="M4 20h16M6 16l6-12 6 12M8 12h8" />
          </svg>
        </ControlButton>

        {onLayersToggle && (
          <ControlButton
            onClick={onLayersToggle}
            ariaLabel={layersMenuOpen ? "Fechar menu de camadas" : "Abrir menu de camadas"}
            title={layersMenuOpen ? "Fechar camadas" : "Abrir camadas"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              {layersMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </ControlButton>
        )}

        <div className="flex flex-col gap-2">
          <ControlButton
            onClick={() => handleZoomChange(1)}
            ariaLabel="Aproximar mapa"
            title="Aproximar"
          >
            <span className="text-gray-700 text-lg font-medium leading-none">+</span>
          </ControlButton>
          <ControlButton
            onClick={() => handleZoomChange(-1)}
            ariaLabel="Afastar mapa"
            title="Afastar"
          >
            <span className="text-gray-700 text-lg font-medium leading-none">−</span>
          </ControlButton>
        </div>
      </div>
    </>
  );
};

export default MapControls;

