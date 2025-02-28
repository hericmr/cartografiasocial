import React, { useState, useEffect } from "react";

const MenuCamadas = ({ estados, acoes }) => {
  const [menuAberto, setMenuAberto] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuClasses = `bg-green-900 bg-opacity-70 backdrop-blur p-2 rounded-lg shadow-md transition-all duration-200 ${
    isMobile
      ? `fixed bottom-0 left-0 right-0 mx-2 mb-6 grid grid-cols-2 gap-2 transition-transform duration-200 ${
          menuAberto ? 'translate-y-0' : 'translate-y-full'
        }`
      : "mt-2 w-40"
  }`;

  const botaoClasses = (ativo, cor) =>
    `w-full flex items-center gap-1 px-1 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
      ativo ? cor : "bg-green-100 hover:bg-green-200"
    } mb-1`;

  const opcoes = [
    { acao: acoes.toggleBairros, estado: estados.bairros, icone: "🏘", label: "Bairros", cor: "bg-gray-200" },
    { acao: acoes.toggleAssistencia, estado: estados.assistencia, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png", label: "Assistência", cor: "bg-green-500 text-black" },
    { acao: acoes.toggleHistoricos, estado: estados.historicos, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png", label: "Históricos", cor: "bg-yellow-300" },
    { acao: acoes.toggleCulturais, estado: estados.culturais, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png", label: "Lazer", cor: "bg-blue-400" },
    { acao: acoes.toggleComunidades, estado: estados.comunidades, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png", label: "Comunidades", cor: "bg-red-500" },
    { acao: acoes.toggleEducação, estado: estados.educação, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png", label: "Educação", cor: "bg-purple-400" },
    { acao: acoes.toggleReligiao, estado: estados.religiao, icone: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png", label: "Religião", cor: "bg-gray-400" },
  ];

  return (
    <div className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "top-40 left-3"} z-10`}>
      {/* Botão de menu (visível apenas no PC) */}
      {!isMobile && (
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className={`p-2 ${isMobile ? "w-10 h-10 text-sm" : "w-12 h-12"} bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center`}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? "✖" : "☰"}
        </button>
      )}

      {/* Menu de camadas */}
      <div className={menuClasses}>
        {opcoes.map(({ acao, estado, icone, label, cor }, index) => (
          <button key={index} onClick={acao} className={botaoClasses(estado, cor)}>
            {typeof icone === "string" && icone.startsWith("http") ? (
              <img src={icone} alt={label} className="w-4 h-6 mr-3" />
            ) : (
              <span className="mr-4">{icone}</span>
            )}
            <span className="truncate">{label}</span>
          </button>
        ))}
        
        {isMobile && (
          <button
            onClick={() => setMenuAberto(false)}
            className="w-full flex items-center justify-center gap-1 px-1 py-2 rounded-lg transition-all duration-200 bg-gray-200 hover:bg-gray-300 col-span-2"
          >
            <span>➖</span>
            <span>Minimizar</span>
          </button>
        )}
      </div>

      {/* Botão flutuante para reabrir o menu no mobile */}
      {isMobile && !menuAberto && (
        <button
          onClick={() => setMenuAberto(true)}
          className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all z-20"
          aria-label="Abrir menu"
        >
          ☰
        </button>
      )}
    </div>
  );
};

export default MenuCamadas;