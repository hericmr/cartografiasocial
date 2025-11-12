import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from "react-leaflet";

const isMobile = () => {
  return window.innerWidth <= 768; // Define mobile para telas menores que 768px
};

// Component to handle map ready callback
const MapReadyHandler = ({ onReady }) => {
  const map = useMap();
  const hasCalledReady = useRef(false);
  
  useEffect(() => {
    if (!map || !onReady || hasCalledReady.current) return;
    
    let isMounted = true;
    let timeoutId = null;
    
    // Use whenReady to ensure map is fully initialized
    map.whenReady(() => {
      // Minimal delay to ensure all internal map structures are ready
      timeoutId = setTimeout(() => {
        if (isMounted && map && !map._destroyed && !hasCalledReady.current) {
          hasCalledReady.current = true;
          onReady();
        }
      }, 50);
    });
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [map, onReady]);
  
  return null;
};

const MapaBase = ({ children, onReady }) => {
  // Define coordenadas e zoom baseados no dispositivo
  const defaultPosition = isMobile() ? [-23.98, -46.36] : [-23.955, -46.35]; // Desktop: latitude ajustada para cima (norte), longitude ajustada para esquerda (oeste)
  const defaultZoom = isMobile() ? 12 : 14; // Ajuste do zoom: mobile 12, desktop 14 (mais próximo)

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MapContainer
        center={defaultPosition}
        zoom={defaultZoom}
        className="h-full w-full"
        attributionControl={true}
        zoomControl={false}
        preferCanvas={false}
      >
        {/* TileLayer com o mapa de fundo */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy;  &mdash; Desenvolvido por <a href='https://hericmr.github.io/me/portuguese' target='_blank' rel='noopener noreferrer'>Heric Moura</a> e <a href='https://br.linkedin.com/in/leandrofadelli/pt?original_referer=https%3A%2F%2Fwww.google.com%2F' target='_blank' rel='noopener noreferrer'>Leandro Fadelli</a>"
          maxZoom={19}
          minZoom={10}
        />

        {/* Handler to detect when map is ready */}
        {onReady && <MapReadyHandler onReady={onReady} />}

        {/* Conteúdo adicional do mapa (marcadores, camadas, etc.) */}
        {children}
      </MapContainer>
    </div>
  );
};

export default MapaBase;