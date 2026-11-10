import React, { useMemo } from "react";
import { Marker } from 'react-map-gl/maplibre';
import { getCategoria, normalizar } from './categorias';

// Marcador SVG; estilos em index.css (.custom-marker)
const StyledMarker = ({ color, onClick, title }) => (
  <button type="button" className="custom-marker" onClick={onClick} title={title} aria-label={title}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
      <path
        fill={color}
        stroke="white"
        strokeWidth="1"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      />
      <circle cx="12" cy="9" r="3" fill="white" />
    </svg>
  </button>
);

const MarcadoresClusterizados = ({ dataPoints, visibility, onClick, searchQuery }) => {
  const filteredMarkers = useMemo(() => {
    if (!Array.isArray(dataPoints)) return [];
    const query = normalizar(searchQuery);

    return dataPoints.filter((ponto) => {
      if (!ponto.tipo || ponto.tipo === 'intro') return false;
      if (!visibility[getCategoria(ponto.tipo).camada]) return false;
      if (query && !normalizar(ponto.titulo).includes(query)) return false;
      return Number.isFinite(ponto.latitude) && Number.isFinite(ponto.longitude);
    });
  }, [dataPoints, visibility, searchQuery]);

  return (
    <>
      {filteredMarkers.map((ponto) => (
        <Marker
          key={ponto.id}
          longitude={ponto.longitude}
          latitude={ponto.latitude}
          anchor="bottom"
        >
          <StyledMarker
            color={getCategoria(ponto.tipo).cor}
            onClick={() => onClick && onClick(ponto)}
            title={ponto.titulo || 'Sem título'}
          />
        </Marker>
      ))}
    </>
  );
};

export default React.memo(MarcadoresClusterizados);
