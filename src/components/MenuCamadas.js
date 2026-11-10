import React, { useState, useEffect, useMemo } from "react";
import { IconWrapper } from "./icons";
import { CATEGORIAS } from "./categorias";

const MenuCamadas = ({ estados, acoes, menuAberto: externalMenuAberto, onMenuToggle }) => {
  const [internalMenuAberto, setInternalMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Use external state if provided, otherwise use internal state
  const menuAberto = externalMenuAberto !== undefined ? externalMenuAberto : internalMenuAberto;
  
  // Handle menu toggle - if external control, use toggle function; otherwise use internal state
  const setMenuAberto = (value) => {
    if (onMenuToggle && externalMenuAberto !== undefined) {
      // External control - if value is explicitly false, close; if true, open; otherwise toggle
      if (value === false && menuAberto) {
        onMenuToggle();
      } else if (value === true && !menuAberto) {
        onMenuToggle();
      } else if (value === undefined) {
        onMenuToggle();
      }
    } else {
      // Internal control
      setInternalMenuAberto(typeof value === 'boolean' ? value : !internalMenuAberto);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuClasses = `
    bg-white/95 backdrop-blur-md p-3 shadow-xl text-gray-800
    ${isMobile
      ? "fixed bottom-0 left-0 right-0 rounded-t-2xl pb-5 max-h-[70vh] overflow-y-auto"
      : "w-64 rounded-xl max-h-[calc(100vh-2rem)] overflow-y-auto"
    }
  `;

  const switchClasses = (ativo) => `
    w-full h-10 flex items-center justify-between gap-2 px-2 rounded-lg transition-colors duration-150
    hover:bg-gray-100 ${ativo ? "" : "opacity-60"}
    focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600
  `;

  // Ícone e cor de cada camada (cores iguais às dos marcadores no mapa)
  const getLayerIcon = (label) => {
    const iconMap = {
      "Limites dos Bairros": { name: "MapTrifold", variant: "regular", color: "#d1d5db" },
      "Bairros": { name: "MapPin", variant: "fill", color: CATEGORIAS.bairro.cor },
      "Assistência": { name: "HandsClapping", variant: "fill", color: CATEGORIAS.assistencia.cor },
      "Históricos": { name: "Clock", variant: "fill", color: CATEGORIAS.historico.cor },
      "Lazer e cultura": { name: "GameController", variant: "fill", color: CATEGORIAS.lazer.cor },
      "Comunidades": { name: "Users", variant: "fill", color: CATEGORIAS.comunidades.cor },
      "Educação": { name: "GraduationCap", variant: "fill", color: CATEGORIAS.educacao.cor },
      "Religião": { name: "Buildings", variant: "fill", color: CATEGORIAS.religiao.cor },
      "Saúde": { name: "FirstAid", variant: "fill", color: CATEGORIAS.saude.cor }
    };

    return iconMap[label] || { name: "MapPin", variant: "regular", color: "#6B7280" };
  };

  const opcoes = useMemo(() => ([
    { id: 'bairros', acao: acoes.toggleBairros, estado: estados.bairros, color: "#9CA3AF", label: "Limites dos Bairros" },
    { id: 'bairrosLaranja', acao: acoes.toggleBairrosLaranja, estado: estados.bairrosLaranja, color: "#FF5722", label: "Bairros" },
    { id: 'assistencia', acao: acoes.toggleAssistencia, estado: estados.assistencia, color: "#10B981", label: "Assistência" },
    { id: 'historicos', acao: acoes.toggleHistoricos, estado: estados.historicos, color: "#FBBF24", label: "Históricos" },
    { id: 'culturais', acao: acoes.toggleCulturais, estado: estados.culturais, color: "#3B82F6", label: "Lazer e cultura" },
    { id: 'comunidades', acao: acoes.toggleComunidades, estado: estados.comunidades, color: "#EF4444", label: "Comunidades" },
    { id: 'educação', acao: acoes.toggleEducação, estado: estados.educação, color: "#8B5CF6", label: "Educação" },
    { id: 'religiao', acao: acoes.toggleReligiao, estado: estados.religiao, color: "#4B5563", label: "Religião" },
    { id: 'saude', acao: acoes.toggleSaude, estado: estados.saude, color: "#00BCD4", label: "Saúde" },
  ]), [acoes, estados]);

  const baseIds = ["bairros", "bairrosLaranja"];
  const pointIds = ["assistencia", "historicos", "culturais", "comunidades", "educação", "religiao", "saude"];

  return (
    <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "top-4 left-[4.5rem]"} z-10`}>
      {/* Menu de camadas */}
      {menuAberto && (
        <div className={menuClasses}>
          {/* Grupo Base */}
          <div className="mb-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 px-2">Base</div>
            {opcoes.filter(o => baseIds.includes(o.id)).map(({ id, acao, estado, label }) => {
              const iconConfig = getLayerIcon(label);
              return (
                <button
                  key={id}
                  role="switch"
                  aria-checked={estado}
                  onClick={(e) => {
                    if (e.altKey && acoes.solo) {
                      acoes.solo(id);
                    } else {
                      acao();
                    }
                  }}
                  className={switchClasses(estado)}
                  title={estado ? "Ocultar camada" : "Mostrar camada"}
                >
                  <div className="flex items-center gap-2">
                    <IconWrapper
                      name={iconConfig.name}
                      variant={iconConfig.variant}
                      color={iconConfig.color}
                      size="md"
                    />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                  <span aria-hidden="true" className={`inline-flex items-center px-0.5 w-9 h-5 rounded-full transition-colors ${estado ? 'bg-green-600' : 'bg-gray-300'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${estado ? 'translate-x-5' : 'translate-x-0'}`} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grupo Pontos */}
          <div>
            <div className="flex items-center justify-between mb-1 px-2 pt-2 border-t border-gray-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Pontos</div>
              <div className="flex gap-1">
                <button
                  onClick={() => acoes.toggleAllPoints && acoes.toggleAllPoints(true)}
                  className="text-[11px] font-semibold px-2 py-1 rounded text-green-800 hover:bg-green-50"
                  title="Mostrar todas as camadas de pontos"
                >
                  Todos
                </button>
                <button
                  onClick={() => acoes.toggleAllPoints && acoes.toggleAllPoints(false)}
                  className="text-[11px] font-semibold px-2 py-1 rounded text-gray-600 hover:bg-gray-100"
                  title="Ocultar todas as camadas de pontos"
                >
                  Nenhum
                </button>
              </div>
            </div>

            {opcoes.filter(o => pointIds.includes(o.id)).map(({ id, acao, estado, label }) => {
              const iconConfig = getLayerIcon(label);
              return (
                <button
                  key={id}
                  role="switch"
                  aria-checked={estado}
                  onClick={(e) => {
                    if (e.altKey && acoes.solo) {
                      acoes.solo(id);
                    } else {
                      acao();
                    }
                  }}
                  className={switchClasses(estado)}
                  title={estado ? "Ocultar camada (Alt+Clique: Somente esta)" : "Mostrar camada (Alt+Clique: Somente esta)"}
                >
                  <div className="flex items-center gap-2">
                    <IconWrapper
                      name={iconConfig.name}
                      variant={iconConfig.variant}
                      color={iconConfig.color}
                      size="md"
                    />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                  <span aria-hidden="true" className={`inline-flex items-center px-0.5 w-9 h-5 rounded-full transition-colors ${estado ? 'bg-green-600' : 'bg-gray-300'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${estado ? 'translate-x-5' : 'translate-x-0'}`} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Botão de Minimizar (Mobile) */}
          {isMobile && menuAberto && (
            <button
              onClick={() => setMenuAberto(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 mt-3 text-sm text-white"
              aria-label="Minimizar menu"
            >
              <IconWrapper
                name="Minus"
                variant="regular"
                size="sm"
                color="white"
              />
              <span className="font-semibold">Ver o mapa</span>
            </button>
          )}
        </div>
      )}

      {/* Botão flutuante para reabrir o menu no mobile */}
      {isMobile && !menuAberto && (
        <button
          onClick={() => setMenuAberto(true)}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-gray-800 font-semibold px-5 py-3 rounded-full shadow-xl hover:bg-gray-50 z-20 text-sm"
          aria-label="Abrir camadas do mapa"
        >
          <IconWrapper
            name="List"
            variant="regular"
            size="md"
            color="#166534"
          />
          Camadas
        </button>
      )}
    </div>
  );
};

export default MenuCamadas;