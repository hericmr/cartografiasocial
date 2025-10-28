import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion";
import { orangeIcon, orangeBairroIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon, healthIcon } from "./CustomIcon";

const MarcadoresSimples = ({ dataPoints, visibility, onClick }) => {
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

  // Filtrar e mapear marcadores
  const filteredMarkers = dataPoints
    .map((ponto, index) => {
      if (!ponto.tipo) {
        console.warn(`Ponto sem tipo definido: ${ponto.titulo}`);
        return null;
      }

      const dataPointType = getDataPointType(ponto.tipo);
      
      if (!dataPointType.enabled) return null;

      if (isNaN(ponto.latitude) || isNaN(ponto.longitude)) {
        console.warn(`Coordenadas inválidas para o ponto: ${ponto.titulo}`);
        return null;
      }

      return { ...ponto, index, dataPointType };
    })
    .filter(Boolean);

  // Variantes para animação
  const markerVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: [1, 1.2, 1] }
  };

  return (
    <>
      {filteredMarkers.map((ponto) => (
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
            icon={ponto.dataPointType.icon}
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
    </>
  );
};

export default MarcadoresSimples;