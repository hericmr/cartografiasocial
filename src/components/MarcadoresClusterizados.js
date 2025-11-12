import React, { useMemo, useCallback } from "react";
import { Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { orangeIcon, orangeBairroIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon, healthIcon } from "./CustomIcon";

const MarcadoresClusterizados = ({ dataPoints, visibility, onClick }) => {
  // Memoizar DataPointType baseado na visibilidade
  const DataPointType = useMemo(() => ({
    ASSISTENCIA: { icon: greenIcon, enabled: visibility.assistencia, color: '#22c55e' },
    HISTORICO: { icon: yellowIcon, enabled: visibility.historicos, color: '#eab308' },
    LAZER: { icon: blueIcon, enabled: visibility.culturais, color: '#3b82f6' },
    COMUNIDADES: { icon: redIcon, enabled: visibility.comunidades, color: '#ef4444' },
    EDUCACAO: { icon: violetIcon, enabled: visibility.educação, color: '#8b5cf6' },
    RELIGIAO: { icon: blackIcon, enabled: visibility.religiao, color: '#374151' },
    SAUDE: { icon: healthIcon, enabled: visibility.saude, color: '#10b981' },
    BAIRRO: { icon: orangeBairroIcon, enabled: visibility.bairrosLaranja, color: '#f97316' },
  }), [visibility.assistencia, visibility.historicos, visibility.culturais, visibility.comunidades, visibility.educação, visibility.religiao, visibility.saude, visibility.bairrosLaranja]);

  // Função para mapear tipos de pontos e retornar a chave da categoria (memoizada)
  const getDataPointType = useCallback((tipo) => {
    const tipoLower = tipo.toLowerCase();
    
    switch (tipoLower) {
      case "assistencia":
        return { type: DataPointType.ASSISTENCIA, key: 'ASSISTENCIA' };
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

  // Agrupar marcadores por tipo (usando string como chave) - MEMOIZADO
  const groupedMarkers = useMemo(() => {
    return dataPoints.reduce((groups, ponto, index) => {
      if (!ponto.tipo) {
        return groups;
      }

      const { type: dataPointType, key: tipoKey } = getDataPointType(ponto.tipo);
      
      if (!dataPointType.enabled) return groups;

      if (isNaN(ponto.latitude) || isNaN(ponto.longitude)) {
        return groups;
      }
      
      if (!groups[tipoKey]) {
        groups[tipoKey] = [];
      }
      
      groups[tipoKey].push({ ...ponto, index, dataPointType });
      return groups;
    }, {});
  }, [dataPoints, getDataPointType]);

  // Configurações de cluster personalizadas por tipo (memoizadas)
  const clusterConfig = useMemo(() => ({
    chunkedLoading: true,
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16,
    removeOutsideVisibleBounds: true,
    animate: false, // Desabilitar animação para melhor performance
    animateAddingMarkers: false, // Desabilitar animação para melhor performance
  }), []);

  // Função para criar ícone de cluster personalizado (memoizada)
  const createClusterCustomIcon = useCallback((cluster, color) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 40 : count < 100 ? 50 : 60;
    
    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${count < 100 ? '14px' : '12px'};
      ">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  }, []);

  return (
    <>
      {Object.entries(groupedMarkers).map(([tipoKey, markers]) => {
        const tipo = markers[0]?.dataPointType;
        if (!tipo || markers.length === 0) return null;

        return (
          <MarkerClusterGroup
            key={tipoKey}
            {...clusterConfig}
            iconCreateFunction={(cluster) => createClusterCustomIcon(cluster, tipo.color)}
          >
            {markers.map((ponto) => (
              <Marker
                key={ponto.index}
                position={[ponto.latitude, ponto.longitude]}
                icon={tipo.icon}
                eventHandlers={{
                  click: () => {
                    if (onClick) {
                      onClick(ponto);
                    }
                  },
                }}
              >
                <Tooltip 
                  className="bg-white text-gray-800 font-medium p-2 rounded shadow-md"
                  direction="top" 
                  offset={[0, -20]} 
                  opacity={0.9}
                >
                  <div className="text-center">
                    <div className="font-bold text-sm">{ponto.titulo || "Sem título"}</div>
                    <div className="text-xs text-gray-600 capitalize">{ponto.tipo}</div>
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MarkerClusterGroup>
        );
      })}
    </>
  );
};

export default React.memo(MarcadoresClusterizados);
