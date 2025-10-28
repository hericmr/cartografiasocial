import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { motion } from "framer-motion";
import L from "leaflet";
import { orangeIcon, orangeBairroIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon, healthIcon } from "./CustomIcon";

const MarcadoresClusterizados = ({ dataPoints, visibility, onClick }) => {
  const DataPointType = Object.freeze({
    ASSISTENCIA: { icon: greenIcon, enabled: visibility.assistencia, color: '#22c55e' },
    HISTORICO: { icon: yellowIcon, enabled: visibility.historicos, color: '#eab308' },
    LAZER: { icon: blueIcon, enabled: visibility.culturais, color: '#3b82f6' },
    COMUNIDADES: { icon: redIcon, enabled: visibility.comunidades, color: '#ef4444' },
    EDUCACAO: { icon: violetIcon, enabled: visibility.educação, color: '#8b5cf6' },
    RELIGIAO: { icon: blackIcon, enabled: visibility.religiao, color: '#374151' },
    SAUDE: { icon: healthIcon, enabled: visibility.saude, color: '#10b981' },
    BAIRRO: { icon: orangeBairroIcon, enabled: visibility.bairrosLaranja, color: '#f97316' },
  });

  // Função para mapear tipos de pontos
  const getDataPointType = (tipo) => {
    const tipoLower = tipo.toLowerCase();
    
    switch (tipoLower) {
      case "assistencia":
        return DataPointType.ASSISTENCIA;
      case "historico":
      case "histórico":
      case "patrimônio histórico":
      case "marco histórico":
      case "histórico / fonte":
      case "fortificação":
      case "engenharia":
        return DataPointType.HISTORICO;
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
        return DataPointType.LAZER;
      case "comunidades":
      case "ilha":
        return DataPointType.COMUNIDADES;
      case "educação":
      case "educacao":
        return DataPointType.EDUCACAO;
      case "religiao":
      case "religioso":
      case "igreja":
        return DataPointType.RELIGIAO;
      case "saude":
      case "saúde":
        return DataPointType.SAUDE;
      case "bairro":
        return DataPointType.BAIRRO;
      default:
        console.warn(`Tipo desconhecido: ${tipo}, usando ícone de lazer como fallback.`);
        return DataPointType.LAZER;
    }
  };

  // Agrupar marcadores por tipo
  const groupedMarkers = dataPoints.reduce((groups, ponto, index) => {
    if (!ponto.tipo) {
      console.warn(`Ponto sem tipo definido: ${ponto.titulo}`);
      return groups;
    }

    const dataPointType = getDataPointType(ponto.tipo);
    
    if (!dataPointType.enabled) return groups;

    if (isNaN(ponto.latitude) || isNaN(ponto.longitude)) {
      console.warn(`Coordenadas inválidas para o ponto: ${ponto.titulo}`);
      return groups;
    }

    const tipo = dataPointType;
    if (!groups[tipo]) {
      groups[tipo] = [];
    }
    
    groups[tipo].push({ ...ponto, index, dataPointType: tipo });
    return groups;
  }, {});

  // Variantes para animação
  const markerVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: [1, 1.2, 1] }
  };

  // Configurações de cluster personalizadas por tipo
  const clusterConfig = {
    chunkedLoading: true,
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16,
    removeOutsideVisibleBounds: true,
    animate: true,
    animateAddingMarkers: true,
  };

  // Função para criar ícone de cluster personalizado
  const createClusterCustomIcon = (cluster, color) => {
    const count = cluster.getChildCount();
    const size = count < 10 ? 40 : count < 100 ? 50 : 60;
    
    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
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
  };

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
              <motion.div
                key={ponto.index}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.3 }}
                variants={markerVariants}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Marker
                  position={[ponto.latitude, ponto.longitude]}
                  icon={tipo.icon}
                  eventHandlers={{
                    click: () => {
                      if (onClick) {
                        onClick(ponto);
                      } else {
                        console.warn("Nenhum handler onClick definido.");
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
              </motion.div>
            ))}
          </MarkerClusterGroup>
        );
      })}
    </>
  );
};

export default MarcadoresClusterizados;
