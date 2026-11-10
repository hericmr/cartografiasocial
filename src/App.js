import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapaSantos from "./components/MapaSantos";
import LoadingScreen from "./components/LoadingScreen";

const DATA_URL = `${process.env.PUBLIC_URL}/data`;

const fetchJSON = async (path) => {
  const response = await fetch(`${DATA_URL}/${path}`);
  if (!response.ok) throw new Error(`HTTP ${response.status} ao carregar ${path}`);
  return response.json();
};

// Converte a marcação simples (**negrito**, *itálico*, quebras de linha) usada nas descrições
const formatarDescricao = (texto) =>
  texto
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>");

const buildWelcomeLocation = (config) => ({
  id: 'welcome-location',
  titulo: config.title,
  descricao_detalhada: config.content,
  imagens: config.images,
  audioUrl: config.audioUrl,
  latitude: -23.9608,
  longitude: -46.3331,
  tipo: 'intro',
  links: [],
});

const AppContent = () => {
  const [dataPoints, setDataPoints] = useState(null);
  const [welcomePanelConfig, setWelcomePanelConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchJSON("locations.json"), fetchJSON("welcome.json")])
      .then(([locations, welcome]) => {
        const points = locations.map((p) => ({
          ...p,
          descricao_detalhada: formatarDescricao(p.descricao_detalhada),
        }));
        setWelcomePanelConfig(welcome);
        setDataPoints([buildWelcomeLocation(welcome), ...points]);
      })
      .catch((err) => {
        console.error("Erro ao carregar os dados:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-green-950 text-white p-6 text-center">
        <p className="text-lg font-semibold">Não foi possível carregar o mapa.</p>
        <p className="text-sm text-green-200">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-5 py-2 rounded-lg bg-white text-green-900 font-semibold hover:bg-green-100"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!dataPoints) {
    return <LoadingScreen />;
  }

  return (
    <main id="main-content" className="min-h-screen">
      <MapaSantos dataPoints={dataPoints} welcomePanelConfig={welcomePanelConfig} />
    </main>
  );
};

const App = () => {
  return (
    <Router basename="/cartografiasocial">
      {/* Rota única: links antigos (/mapa, /admin...) caem no mapa preservando ?panel= */}
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
};

export default App;
