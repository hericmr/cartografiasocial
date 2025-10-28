import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import { motion } from "framer-motion"; 
import { orangeIcon, orangeBairroIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon, healthIcon } from "./CustomIcon"; // Ícones personalizados

const Marcadores = ({ dataPoints, visibility, onClick }) => {
  const DataPointType = Object.freeze({
    ASSISTENCIA: { icon: greenIcon, enabled: visibility.assistencia },
    HISTORICO:   { icon: yellowIcon, enabled: visibility.historicos },
    LAZER:       { icon: blueIcon, enabled: visibility.culturais },
    COMUNIDADES: { icon: redIcon, enabled: visibility.comunidades },
    EDUCACAO:    { icon: violetIcon, enabled: visibility.educação },
    RELIGIAO:    { icon: blackIcon, enabled: visibility.religiao },
    SAUDE:       { icon: healthIcon, enabled: visibility.saude },
    BAIRRO:      { icon: orangeBairroIcon, enabled: visibility.bairrosLaranja }, // Pontos dos bairros
  });

  // Variantes para animação inicial e efeito de pulsação
  const markerVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: [1, 1.2, 1] }
  };

  return (
    <>
      {dataPoints.map((ponto, index) => {
        if (!ponto.tipo) {
          console.warn(`Ponto sem tipo definido: ${ponto.titulo}`);
          return null;
        }

        let dataPointType;
        const tipo = ponto.tipo.toLowerCase();
        
        // Mapeamento expandido de tipos com ícones Phosphor
        switch (tipo) {
          case "assistencia":
            dataPointType = DataPointType.ASSISTENCIA;
            break;
          case "historico":
          case "histórico":
          case "patrimônio histórico":
          case "marco histórico":
          case "histórico / fonte":
          case "fortificação":
          case "engenharia":
            dataPointType = DataPointType.HISTORICO;
            break;
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
            dataPointType = DataPointType.LAZER;
            break;
          case "comunidades":
          case "ilha":
            dataPointType = DataPointType.COMUNIDADES;
            break;
          case "educação":
          case "educacao":
            dataPointType = DataPointType.EDUCACAO;
            break;
          case "religiao":
          case "religioso":
          case "igreja":
            dataPointType = DataPointType.RELIGIAO;
            break;
          case "saude":
          case "saúde":
            dataPointType = DataPointType.SAUDE;
            break;
          case "bairro":
            dataPointType = DataPointType.BAIRRO;
            break;
          default:
            console.warn(`Tipo desconhecido: ${ponto.tipo}, usando ícone de lazer como fallback.`);
            dataPointType = DataPointType.LAZER; // Fallback para lazer em vez de retornar null
        }
        
        if (!dataPointType.enabled) return null;

        if (isNaN(ponto.latitude) || isNaN(ponto.longitude)) {
          console.warn(`Coordenadas inválidas para o ponto: ${ponto.titulo}`);
          return null;
        }

        return (
          <motion.div
            key={index}
            initial="initial"
            animate="animate"
            whileHover={{ scale: 1.3 }}
            variants={markerVariants}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Marker
              position={[ponto.latitude, ponto.longitude]}
              icon={dataPointType.icon}
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
                {ponto.titulo || "Sem título"}
              </Tooltip>
            </Marker>
          </motion.div>
        );
      })}
    </>
  );
};

export default Marcadores;
