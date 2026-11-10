import React from 'react';
import Map, { AttributionControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const isMobile = window.innerWidth <= 768;

// MapLibre usa [longitude, latitude]
const INITIAL_VIEW = isMobile
  ? { longitude: -46.335, latitude: -23.962, zoom: 12.2 }
  : { longitude: -46.35, latitude: -23.955, zoom: 13 };

// Definido fora do componente para não ser recriado (e reaplicado) a cada render
const MAP_STYLE = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Imagens &copy; Esri &middot; Desenvolvido por <a href="https://hericmr.github.io/me/portuguese" target="_blank" rel="noopener noreferrer">Heric Moura</a> e <a href="https://br.linkedin.com/in/leandrofadelli" target="_blank" rel="noopener noreferrer">Leandro Fadelli</a>'
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

const MapaBase = ({ children, onReady }) => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Mapa não controlado: mover/zoom não re-renderiza a árvore React */}
      <Map
        id="main-map"
        mapLib={maplibregl}
        initialViewState={INITIAL_VIEW}
        onLoad={onReady}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        minZoom={2}
        maxZoom={19}
        attributionControl={false}
      >
        <AttributionControl position="bottom-right" compact={true} />

        {children}
      </Map>
    </div>
  );
};

export default MapaBase;
