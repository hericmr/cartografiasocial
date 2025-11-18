import React from 'react';
import { Marker } from 'react-map-gl/maplibre';

// Componente de marcador customizado para MapLibre
const CustomMarker = ({ longitude, latitude, color = '#4CAF50', onClick }) => {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClick={onClick}
    >
      <div
        className="custom-marker"
        style={{
          cursor: 'pointer',
          filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2))',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill={color} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          <circle cx="12" cy="9" r="3" fill="white" className="marker-pulse"/>
        </svg>
      </div>
    </Marker>
  );
};

// Função helper para obter cor baseada no tipo
export const getColorByType = (tipo) => {
  const tipoLower = tipo?.toLowerCase() || '';
  
  const colorMap = {
    assistencia: '#4CAF50',
    lazer: '#2196F3',
    historico: '#FFC107',
    histórico: '#FFC107',
    comunidades: '#F44336',
    educação: '#9C27B0',
    educacao: '#9C27B0',
    religiao: '#212121',
    religioso: '#212121',
    saude: '#00BCD4',
    saúde: '#00BCD4',
    bairro: '#FF9800',
  };
  
  return colorMap[tipoLower] || '#4CAF50';
};

export default CustomMarker;

