import React, { useState, useEffect, useMemo } from "react";
import { IconWrapper } from "./icons";

const MenuCamadas = ({ estados, acoes }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuClasses = `
    bg-green-900/30 backdrop-blur-md p-3 rounded-lg shadow-lg transition-all duration-300 text-white
    ${isMobile
      ? `fixed bottom-0 left-0 right-0 mx-2 mb-6 transition-transform duration-300 ${
          menuAberto ? 'translate-y-0' : 'translate-y-full'
        }`
      : "mt-2 w-64"
    }
  `;

  const switchClasses = (ativo) => `
    w-full h-10 flex items-center justify-between gap-2 px-3 rounded-lg transition-colors duration-200 mb-1.5
    ${ativo
      ? "bg-green-600 text-white hover:bg-green-600"
      : "bg-green-800/90 text-white hover:bg-green-700/90"}
    focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
  `;

  // Mapeamento de ícones para cada tipo de camada
  const getLayerIcon = (label) => {
    const iconMap = {
      "Limites dos Bairros": { name: "Map", variant: "regular", color: "#9CA3AF" },
      "Bairros": { name: "MapPin", variant: "fill", color: "#FF5722" },
      "Assistência": { name: "HandsClapping", variant: "fill", color: "#10B981" },
      "Históricos": { name: "Clock", variant: "fill", color: "#FBBF24" },
      "Lazer": { name: "GameController", variant: "fill", color: "#3B82F6" },
      "Comunidades": { name: "Users", variant: "fill", color: "#EF4444" },
      "Educação": { name: "GraduationCap", variant: "fill", color: "#8B5CF6" },
      "Religião": { name: "Church", variant: "fill", color: "#4B5563" },
      "Saúde": { name: "FirstAid", variant: "fill", color: "#00BCD4" }
    };
    
    return iconMap[label] || { name: "MapPin", variant: "regular", color: "#6B7280" };
  };

  const opcoes = useMemo(() => ([
    { id: 'bairros', acao: acoes.toggleBairros, estado: estados.bairros, color: "#9CA3AF", label: "Limites dos Bairros" },
    { id: 'bairrosLaranja', acao: acoes.toggleBairrosLaranja, estado: estados.bairrosLaranja, color: "#FF5722", label: "Bairros" },
    { id: 'assistencia', acao: acoes.toggleAssistencia, estado: estados.assistencia, color: "#10B981", label: "Assistência" },
    { id: 'historicos', acao: acoes.toggleHistoricos, estado: estados.historicos, color: "#FBBF24", label: "Históricos" },
    { id: 'culturais', acao: acoes.toggleCulturais, estado: estados.culturais, color: "#3B82F6", label: "Lazer" },
    { id: 'comunidades', acao: acoes.toggleComunidades, estado: estados.comunidades, color: "#EF4444", label: "Comunidades" },
    { id: 'educação', acao: acoes.toggleEducação, estado: estados.educação, color: "#8B5CF6", label: "Educação" },
    { id: 'religiao', acao: acoes.toggleReligiao, estado: estados.religiao, color: "#4B5563", label: "Religião" },
    { id: 'saude', acao: acoes.toggleSaude, estado: estados.saude, color: "#00BCD4", label: "Saúde" },
  ]), [acoes, estados]);

  const baseIds = ["bairros", "bairrosLaranja"];
  const pointIds = ["assistencia", "historicos", "culturais", "comunidades", "educação", "religiao", "saude"];

  return (
    <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "top-40 left-3"} z-10`}>
      {/* Botão de Toggle (visível apenas no PC) */}
      {!isMobile && (
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 w-10 h-10 bg-green-900/90 text-white rounded-full shadow-lg hover:bg-green-800 transition-all flex items-center justify-center text-sm"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          <IconWrapper
            name={menuAberto ? "X" : "List"}
            variant="regular"
            size="sm"
            color="white"
          />
        </button>
      )}

      {/* Menu de camadas */}
      {menuAberto && (
        <div className={menuClasses}>
          {/* Grupo Base */}
          <div className="mb-2">
            <div className="text-xs uppercase tracking-wide text-green-200/90 mb-1 px-1">Base</div>
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
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                  <span aria-hidden="true" className={`inline-block w-9 h-5 rounded-full transition-colors ${estado ? 'bg-green-300' : 'bg-gray-500'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${estado ? 'translate-x-5' : 'translate-x-0'}`} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grupo Pontos */}
          <div>
            <div className="flex items-center justify-between mb-1 px-1">
              <div className="text-xs uppercase tracking-wide text-green-200/90">Pontos</div>
              <div className="flex gap-1">
                <button
                  onClick={() => acoes.toggleAllPoints && acoes.toggleAllPoints(true)}
                  className="text-[11px] px-2 py-1 rounded bg-green-700/90 hover:bg-green-600/90"
                  title="Mostrar todas as camadas de pontos"
                >
                  Mostrar todos
                </button>
                <button
                  onClick={() => acoes.toggleAllPoints && acoes.toggleAllPoints(false)}
                  className="text-[11px] px-2 py-1 rounded bg-green-800/90 hover:bg-green-700/90"
                  title="Ocultar todas as camadas de pontos"
                >
                  Ocultar todos
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
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                  <span aria-hidden="true" className={`inline-block w-9 h-5 rounded-full transition-colors ${estado ? 'bg-green-300' : 'bg-gray-500'}`}>
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
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 bg-green-700/90 hover:bg-green-600/90 col-span-2 mt-2 text-sm text-white"
              aria-label="Minimizar menu"
            >
              <IconWrapper
                name="Minus"
                variant="regular"
                size="sm"
                color="white"
              />
              <span className="font-medium">Minimizar</span>
            </button>
          )}
        </div>
      )}

      {/* Botão flutuante para reabrir o menu no mobile */}
      {isMobile && !menuAberto && (
        <button
          onClick={() => setMenuAberto(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800 text-white p-3 rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-200 z-20 text-sm"
          aria-label="Abrir menu"
        >
          <IconWrapper
            name="List"
            variant="regular"
            size="md"
            color="white"
          />
        </button>
      )}
    </div>
  );
};

export default MenuCamadas;