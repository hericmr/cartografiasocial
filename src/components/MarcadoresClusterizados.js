import React, { useMemo, useCallback } from "react";
import { Marker } from 'react-map-gl/maplibre';

// Componente de marcador estilizado com SVG
const StyledMarker = ({ color, onClick, title }) => {
  return (
    <div
      className="custom-marker"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
        transformOrigin: 'bottom center',
        animation: 'markerBounce 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      }}
      title={title}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path 
          fill={color} 
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        />
        <circle 
          cx="12" 
          cy="9" 
          r="3" 
          fill="white" 
          style={{
            animation: 'markerPulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </svg>
      <style>{`
        @keyframes markerBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes markerPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.7; }
        }
        .custom-marker:hover {
          transform: scale(1.15) translateY(-2px);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
        }
      `}</style>
    </div>
  );
};

const MarcadoresClusterizados = ({ dataPoints, visibility, onClick }) => {
  // Memoizar DataPointType baseado na visibilidade
  const DataPointType = useMemo(() => ({
    ASSISTENCIA: { enabled: visibility.assistencia, color: '#22c55e' },
    HISTORICO: { enabled: visibility.historicos, color: '#eab308' },
    LAZER: { enabled: visibility.culturais, color: '#3b82f6' },
    COMUNIDADES: { enabled: visibility.comunidades, color: '#ef4444' },
    EDUCACAO: { enabled: visibility.educação, color: '#8b5cf6' },
    RELIGIAO: { enabled: visibility.religiao, color: '#374151' },
    SAUDE: { enabled: visibility.saude, color: '#10b981' },
    BAIRRO: { enabled: visibility.bairrosLaranja, color: '#f97316' },
  }), [visibility]);

  // Função para mapear tipos de pontos
  const getDataPointType = useCallback((tipo) => {
    const tipoLower = tipo?.toLowerCase() || '';
    
    switch (tipoLower) {
      case "assistencia": return { type: DataPointType.ASSISTENCIA, key: 'ASSISTENCIA' };
      case "historico":
      case "histórico":
      case "patrimônio histórico":
      case "marco histórico":
      case "histórico / fonte":
      case "fortificação":
      case "engenharia":
        return { type: DataPointType.HISTORICO, key: 'HISTORICO' };
      case "lazer":
      case "cultura":
      case "cultura / teatro":
      case "cultura / natureza / comunitário":
      case "cultural":
      case "cultura alternativa / bar / música":
      case "história / arquitetura / cultura":
      case "turismo":
      case "museu":
      case "monumento":
      case "memorial":
      case "esportivo / cultural":
      case "mirante / esporte":
      case "esporte":
        return { type: DataPointType.LAZER, key: 'LAZER' };
      case "comunidades":
      case "ilha":
        return { type: DataPointType.COMUNIDADES, key: 'COMUNIDADES' };
      case "educação":
      case "educacao":
        return { type: DataPointType.EDUCACAO, key: 'EDUCACAO' };
      case "religiao":
      case "religioso":
      case "igreja":
        return { type: DataPointType.RELIGIAO, key: 'RELIGIAO' };
      case "saude":
      case "saúde":
        return { type: DataPointType.SAUDE, key: 'SAUDE' };
      case "bairro":
        return { type: DataPointType.BAIRRO, key: 'BAIRRO' };
      default:
        return { type: DataPointType.LAZER, key: 'LAZER' };
    }
  }, [DataPointType]);

  // Filtrar e processar marcadores
  const filteredMarkers = useMemo(() => {
    if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) {
      return [];
    }
    
    return dataPoints
      .map((ponto, index) => {
        if (!ponto.tipo) return null;
        
        const { type: dataPointType } = getDataPointType(ponto.tipo);
        if (!dataPointType.enabled) return null;
        
        const lat = parseFloat(ponto.latitude);
        const lng = parseFloat(ponto.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return null;
        
        return {
          ...ponto,
          id: ponto.id || index,
          latitude: lat,
          longitude: lng,
          color: dataPointType.color
        };
      })
      .filter(Boolean);
  }, [dataPoints, getDataPointType]);

  console.log('✅ [MarcadoresClusterizados] Marcadores processados:', filteredMarkers.length);

  return (
    <>
      {filteredMarkers.map((ponto) => (
        <Marker
          key={ponto.id}
          longitude={ponto.longitude}
          latitude={ponto.latitude}
          anchor="bottom"
          onClick={() => onClick && onClick(ponto)}
        >
          <StyledMarker
            color={ponto.color}
            onClick={() => onClick && onClick(ponto)}
            title={ponto.titulo || 'Sem título'}
          />
        </Marker>
      ))}
    </>
  );
};

export default React.memo(MarcadoresClusterizados);
