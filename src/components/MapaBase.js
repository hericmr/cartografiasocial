import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map, { NavigationControl, AttributionControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const isMobile = () => {
  return window.innerWidth <= 768; // Define mobile para telas menores que 768px
};

// Component to handle map ready callback
const MapReadyHandler = ({ onReady, mapRef }) => {
  const hasCalledReady = useRef(false);
  
  useEffect(() => {
    if (!onReady || hasCalledReady.current) return;
    
    let isMounted = true;
    let timeoutId = null;
    
    // Wait for map instance to be available
    const checkMapReady = () => {
      if (mapRef?.current || window.__mapInstance) {
        timeoutId = setTimeout(() => {
          if (isMounted && !hasCalledReady.current) {
            hasCalledReady.current = true;
            onReady();
          }
        }, 100);
      } else {
        // Tentar novamente após um delay
        setTimeout(checkMapReady, 100);
      }
    };
    
    checkMapReady();
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [mapRef, onReady]);
  
  return null;
};

const MapaBase = ({ children, onReady }) => {
  // Define coordenadas e zoom baseados no dispositivo
  // MapLibre usa [longitude, latitude] (inverso do Leaflet que usa [lat, lng])
  const defaultLongitude = isMobile() ? -46.36 : -46.35;
  const defaultLatitude = isMobile() ? -23.98 : -23.955;
  const defaultZoom = isMobile() ? 11 : 13;
  
  const [viewState, setViewState] = useState({
    longitude: defaultLongitude,
    latitude: defaultLatitude,
    zoom: defaultZoom
  });
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Callback para quando o mapa carregar - captura a instância real
  const handleMapLoad = useCallback((event) => {
    mapInstanceRef.current = event.target;
    window.__mapInstance = event.target; // Expor para debug
    console.log('🟢 [MapaBase] Mapa carregado, instância:', event.target);
    console.log('🟢 [MapaBase] Mapa ID:', event.target.getContainer()?.id);
    console.log('🟢 [MapaBase] Mapa está carregado?', event.target.loaded());
  }, []);

  // Estilo customizado usando tiles do ArcGIS (mesmo que estava usando antes)
  const customStyle = {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '&copy; Desenvolvido por <a href="https://hericmr.github.io/me/portuguese" target="_blank" rel="noopener noreferrer">Heric Moura</a> e <a href="https://br.linkedin.com/in/leandrofadelli/pt?original_referer=https%3A%2F%2Fwww.google.com%2F" target="_blank" rel="noopener noreferrer">Leandro Fadelli</a>'
      }
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 2,
        maxzoom: 19
      }
    ]
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Map
        id="main-map"
        ref={mapRef}
        mapLib={maplibregl}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        style={{ width: '100%', height: '100%' }}
        mapStyle={customStyle}
        minZoom={2}
        maxZoom={19}
        attributionControl={false}
      >
        {/* Handler to detect when map is ready */}
        {onReady && <MapReadyHandler onReady={onReady} mapRef={mapInstanceRef} />}

        {/* Controles de navegação */}
        <NavigationControl position="top-right" />
        <AttributionControl 
          position="bottom-right"
          compact={true}
        />

        {/* Conteúdo adicional do mapa (marcadores, camadas, etc.) */}
        {children}
      </Map>
    </div>
  );
};

export default MapaBase;
