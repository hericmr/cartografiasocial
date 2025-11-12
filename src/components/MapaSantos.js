import React, { useState, useEffect } from "react";
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

// Função para converter título em slug
const criarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '')         // Remove hífens do início e fim
    .trim();
};

const MapaSantos = ({ dataPoints }) => {
  console.log("DataPoints recebidos:", dataPoints); // Verifique os dados recebidos

  const urlParams = new URLSearchParams(window.location.search);
  const panel = urlParams.get('panel');
  var initialPanel = null;
  if (panel && panel !== '' && dataPoints && dataPoints.length > 0) {
    const pointFound = dataPoints.find((item) => criarSlug(item.titulo) === panel);
    if (pointFound != null) {
      initialPanel = pointFound;
    }
  }

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
  const [painelInfo, setPainelInfo] = useState(initialPanel);

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

  const abrirPainel = (info) => {
    setPainelInfo(info);
  };

  const fecharPainel = () => {
    setPainelInfo(null);
  };

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

  const toggleVisibilidade = (chave) => {
    console.log(`Alterando visibilidade: ${chave}`);
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
  };

  const toggleAllPoints = (value) => {
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
  };

  const soloLayer = (key) => {
    const allKeys = Object.keys(visibilidade);
    setVisibilidade((prev) => {
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
  };

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
              onLayersToggle={() => setLayersMenuOpen(!layersMenuOpen)}
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
            onMenuToggle={() => setLayersMenuOpen(!layersMenuOpen)}
            acoes={{
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
            }}
          />
        </>
      )}
    </div>
  );
};

export default MapaSantos;