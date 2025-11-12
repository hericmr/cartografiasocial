import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMap } from 'react-leaflet';

// Reusable minimalistic button component
const ControlButton = ({ children, onClick, href, ariaLabel, title, className = '' }) => {
  const baseClasses = "w-10 h-10 rounded-lg bg-white/90 hover:bg-white backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-200 hover:shadow-lg active:scale-95";
  const classes = `${baseClasses} ${className}`;
  
  if (href) {
    return (
      <Link to={href} className={classes} aria-label={ariaLabel} title={title}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel} title={title}>
      {children}
    </button>
  );
};

// Internal component for map connection
const MapControlsInternal = ({ onZoomChange }) => {
  const map = useMap();
  
  useEffect(() => {
    if (onZoomChange && map) {
      onZoomChange.current = (delta) => {
        const currentZoom = map.getZoom();
        const newZoom = currentZoom + delta;
        map.setZoom(newZoom, { animate: true, duration: 0.2 });
      };
    }
  }, [map, onZoomChange]);

  return null;
};

// Main controls component
const MapControls = ({ onLayersToggle, layersMenuOpen }) => {
  const [textScale, setTextScale] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cartografiasocial:textScale') : null;
    return stored ? parseFloat(stored) : 1;
  });
  const zoomChangeRef = React.useRef(null);

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
        <ControlButton
          href="/"
          ariaLabel="Sair do mapa"
          title="Sair do mapa"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
            <path d="M16 17L21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" />
          </svg>
        </ControlButton>

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

