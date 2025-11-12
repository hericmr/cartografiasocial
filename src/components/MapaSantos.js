import React, { useState, useEffect, useCallback, useMemo } from "react";
import slugify from "slugify";
import MapaBase from "./MapaBase";
import MarcadoresClusterizados from "./MarcadoresClusterizados";
import Bairros from "./Bairros";
import MenuCamadas from "./MenuCamadas";
import PainelInformacoes from "./PainelInformacoes";
import MapControls from "./MapControls";
import "./MapaSantos.css";

// LoadingScreen component (reused from App.js)
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/cartografiasocial/favicon.ico" alt="Ícone de carregamento" className="w-8 h-8" />
      </div>
    </div>
    <p className="mt-4 text-lg font-semibold animate-pulse">Carregando mapa...</p>
  </div>
);

// Função para converter título em slug (usando a mesma função do useShare para consistência)
const criarSlug = (texto) => {
  return slugify(texto, { lower: true, remove: /[*+~.()'"!:@]/g });
};

const MapaSantos = ({ dataPoints }) => {
  console.log("DataPoints recebidos:", dataPoints); // Verifique os dados recebidos

  const [geojsonData, setGeojsonData] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [layersMenuOpen, setLayersMenuOpen] = useState(true);
  const [visibilidade, setVisibilidade] = useState({
    bairros: false,
    bairrosLaranja: true,
    assistencia: true,
    historicos: true,
    culturais: true,
    comunidades: true,
    educação: true,
    religiao: true,
    saude: true,
    bairro: true,
  });
  const [painelInfo, setPainelInfo] = useState(null);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        // Tenta carregar do arquivo local primeiro (funciona em produção)
        const response = await fetch("/bairros.geojson");
        if (!response.ok) {
          // Fallback para URL externa se o arquivo local não estiver disponível
          const fallbackResponse = await fetch(
            "https://raw.githubusercontent.com/hericmr/gps/main/public/bairros.geojson"
          );
          if (!fallbackResponse.ok) throw new Error(`Erro ao carregar GeoJSON: HTTP status ${fallbackResponse.status}`);
          const data = await fallbackResponse.json();
          setGeojsonData(data);
        } else {
          const data = await response.json();
          setGeojsonData(data);
        }
      } catch (error) {
        console.error("Erro ao carregar GeoJSON:", error);
      }
    };
    fetchGeoJSON();
  }, []);

  // Função para abrir painel baseado no parâmetro da URL
  const abrirPainelDaURL = useCallback(() => {
    if (!dataPoints || dataPoints.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const panel = urlParams.get('panel');
    
    if (panel && panel !== '') {
      const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
      if (pointFound) {
        setPainelInfo(pointFound);
      } else {
        // Se o painel não foi encontrado, remover da URL
        setPainelInfo(null);
      }
    } else {
      // Se não há parâmetro panel, fechar o painel
      setPainelInfo(null);
    }
  }, [dataPoints]);

  // Abrir painel baseado no parâmetro da URL quando os dados estiverem disponíveis
  useEffect(() => {
    abrirPainelDaURL();
  }, [abrirPainelDaURL]);

  // Ouvir mudanças na URL (botão voltar/avançar do navegador)
  useEffect(() => {
    const handlePopState = () => {
      abrirPainelDaURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [abrirPainelDaURL]);

  const abrirPainel = useCallback((info) => {
    setPainelInfo(info);
    // A URL será atualizada automaticamente pelo hook useDynamicURL no PainelInformacoes
  }, []);

  const fecharPainel = useCallback(() => {
    setPainelInfo(null);
    // Remover parâmetro panel da URL
    const params = new URLSearchParams(window.location.search);
    params.delete('panel');
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.pushState({}, '', newUrl);
  }, []);

  const geoJSONStyle = {
    fillColor: "green",
    color: "white",
    weight: 1,
    fillOpacity: 0.4,
  };

  // Carregar visibilidade de URL/localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const layersParam = params.get('layers');
      const stored = localStorage.getItem('layersVisibility');
      let initial = null;

      if (layersParam) {
        const onKeys = new Set(layersParam.split(',').map(s => s.trim()).filter(Boolean));
        initial = {
          bairros: onKeys.has('bairros'),
          bairrosLaranja: onKeys.has('bairrosLaranja') || (!onKeys.has('bairros') && !onKeys.has('bairrosLaranja') ? true : false),
          assistencia: onKeys.has('assistencia'),
          historicos: onKeys.has('historicos'),
          culturais: onKeys.has('culturais'),
          comunidades: onKeys.has('comunidades'),
          educação: onKeys.has('educação'),
          religiao: onKeys.has('religiao'),
          saude: onKeys.has('saude'),
          bairro: onKeys.has('bairros') || onKeys.has('bairrosLaranja'),
        };
      } else if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          initial = { ...visibilidade, ...parsed };
        }
      }

      if (initial) {
        setVisibilidade(prev => ({ ...prev, ...initial }));
      }
    } catch (e) {
      console.warn('Falha ao carregar estado de camadas:', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistir visibilidade em URL/localStorage
  useEffect(() => {
    try {
      const onKeys = Object.keys(visibilidade).filter(k => visibilidade[k] === true);
      const params = new URLSearchParams(window.location.search);
      params.set('layers', onKeys.join(','));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
      localStorage.setItem('layersVisibility', JSON.stringify(visibilidade));
    } catch (e) {
      // ignore
    }
  }, [visibilidade]);

  const toggleVisibilidade = useCallback((chave) => {
    if (chave === "bairros") {
      // Exclusividade com bairrosLaranja
      setVisibilidade((prev) => ({
        ...prev,
        bairros: !prev.bairros,
        bairrosLaranja: false,
        bairro: !prev.bairros || false,
      }));
    } else if (chave === "bairrosLaranja") {
      // Exclusividade com bairros
      setVisibilidade((prev) => ({
        ...prev,
        bairrosLaranja: !prev.bairrosLaranja,
        bairros: false,
        bairro: !prev.bairrosLaranja || false,
      }));
    } else {
      setVisibilidade((prev) => ({ ...prev, [chave]: !prev[chave] }));
    }
  }, []);

  const toggleAllPoints = useCallback((value) => {
    setVisibilidade((prev) => ({
      ...prev,
      assistencia: value,
      historicos: value,
      culturais: value,
      comunidades: value,
      educação: value,
      religiao: value,
      saude: value,
    }));
  }, []);

  const soloLayer = useCallback((key) => {
    setVisibilidade((prev) => {
      const allKeys = Object.keys(prev);
      const next = {};
      for (const k of allKeys) {
        next[k] = k === key ? true : false;
      }
      // Sincroniza marcador de bairro quando solo em base
      if (key === 'bairros' || key === 'bairrosLaranja') {
        next.bairro = true;
      } else {
        next.bairro = false;
      }
      return next;
    });
  }, []);

  const toggleLayersMenu = useCallback(() => {
    setLayersMenuOpen(prev => !prev);
  }, []);

  const acoesMenu = useMemo(() => ({
    toggleBairros: () => toggleVisibilidade("bairros"),
    toggleBairrosLaranja: () => toggleVisibilidade("bairrosLaranja"),
    toggleAssistencia: () => toggleVisibilidade("assistencia"),
    toggleHistoricos: () => toggleVisibilidade("historicos"),
    toggleCulturais: () => toggleVisibilidade("culturais"),
    toggleComunidades: () => toggleVisibilidade("comunidades"),
    toggleEducação: () => toggleVisibilidade("educação"),
    toggleReligiao: () => toggleVisibilidade("religiao"),
    toggleSaude: () => toggleVisibilidade("saude"),
    toggleBairro: () => toggleVisibilidade("bairro"),
    toggleAllPoints: (value) => toggleAllPoints(value),
    solo: (key) => soloLayer(key),
  }), [toggleVisibilidade, toggleAllPoints, soloLayer]);

  return (
    <div className="relative h-screen">
      {/* Loading overlay - shown until map is ready */}
      {!mapReady && (
        <div className="absolute inset-0 z-[9999] bg-green-900">
          <LoadingScreen />
        </div>
      )}

      {/* Map - only render children when map is ready to avoid cleanup issues */}
      <MapaBase onReady={() => setMapReady(true)}>
        {mapReady && (
          <>
            {visibilidade.bairros && geojsonData && <Bairros data={geojsonData} style={geoJSONStyle} />}
            {dataPoints && <MarcadoresClusterizados dataPoints={dataPoints} visibility={visibilidade} onClick={abrirPainel} />}
            <MapControls 
              onLayersToggle={toggleLayersMenu}
              layersMenuOpen={layersMenuOpen}
            />
          </>
        )}
      </MapaBase>

      {/* Only show these when map is ready */}
      {mapReady && (
        <>
          {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={fecharPainel} />}
          
          <MenuCamadas
            estados={visibilidade}
            menuAberto={layersMenuOpen}
            onMenuToggle={toggleLayersMenu}
            acoes={acoesMenu}
          />
        </>
      )}
    </div>
  );
};

export default MapaSantos;