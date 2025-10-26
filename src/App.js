import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from './supabaseClient';
import MapaSantos from "./components/MapaSantos";
import Navbar from "./components/Navbar";
import PainelInformacoes from "./components/PainelInformacoes";
import AddLocationButton from "./components/AddLocationButton";
import ConteudoCartografia from "./components/ConteudoCartografia";
import AdminPanel from "./components/AdminPanel";
import WelcomePanel from "./components/WelcomePanel";
import ImageGallery from "./components/gallery/ImageGallery";
import GalleryDemo from "./components/GalleryDemo";

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/cartografiasocial/favicon.ico" alt="Ícone de carregamento" className="w-8 h-8" />
      </div>
    </div>
    <p className="mt-4 text-lg font-semibold animate-pulse">Carregando dados...</p>
  </div>
);

const AppContent = () => {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcomePanel, setShowWelcomePanel] = useState(false);
  const [welcomePanelConfig, setWelcomePanelConfig] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchDataPoints = async () => {
    console.log("Iniciando consulta ao Supabase na tabela 'locations'...");
    const { data, error } = await supabase
      .from('locations3')
      .select('*');
    
    if (error) {
      console.error("Erro na consulta ao Supabase:", error);
      throw new Error(error.message);
    }
    
    console.log("Consulta realizada com sucesso. Dados recebidos:", data);
    return data;
  };

  const formatData = (dataPoints) => {
    console.log("Iniciando formatação dos dados...");
    const formattedData = dataPoints.map((e, index) => {
      console.log(`Formatando registro ${index}:`, e);

      // Links
      e.links = (e.links && typeof e.links === 'string')
        ? e.links.split(";").map((l) => {
            let [texto, url] = l.split(':');
            return { texto: texto || "Sem título", url: url || "#" };
          })
        : [];

      // Imagens
      e.imagens = (e.imagens && typeof e.imagens === 'string')
        ? e.imagens.split(",")
        : [];

      // Áudio
      e.audioUrl = e.audio || "";

      // Título e Descrição
      e.titulo = e.titulo || "Título não disponível";
      e.descricao = e.descricao || "Sem descrição";

      // Coordenadas
      if (e.localizacao && typeof e.localizacao === 'string') {
        const [lat, lng] = e.localizacao.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          e.latitude = lat;
          e.longitude = lng;
        } else {
          console.warn("Coordenadas inválidas para o registro:", e);
          e.latitude = null;
          e.longitude = null;
        }
      } else {
        e.latitude = null;
        e.longitude = null;
      }

      // Descrição detalhada
      if (e.descricao_detalhada) {
        e.descricao_detalhada = e.descricao_detalhada
          .replace(/\n/g, "<br>")
          .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          .replace(/\*(.*?)\*/g, "<i>$1</i>");
      }

      // Cálculo da pontuação
      let pontuacao = 0;
      
      // Título (15 pontos)
      if (e.titulo && e.titulo !== "Título não disponível") {
        pontuacao += 15;
      }
      
      // Descrição detalhada (25 pontos)
      if (e.descricao_detalhada && e.descricao_detalhada.length > 100) {
        pontuacao += 25;
      }
      
      // Imagens (15 pontos)
      if (e.imagens && e.imagens.length > 0) {
        pontuacao += 15;
      }
      
      // Áudio (15 pontos)
      if (e.audioUrl) {
        pontuacao += 15;
      }
      
      // Links (15 pontos)
      if (e.links && e.links.length > 0) {
        pontuacao += 15;
      }

      // Vídeo (15 pontos)
      if (e.video) {
        pontuacao += 15;
      }

      e.pontuacao = pontuacao;
      e.pontuacaoPercentual = Math.round((pontuacao / 100) * 100);

      console.log(`Registro ${index} formatado:`, e);
      return e;
    });
    console.log("Formatação concluída. Dados formatados:", formattedData);
    return formattedData;
  };

  const handleLocationAdded = (newLocation) => {
    const formattedLocation = formatData([newLocation])[0];
    setDataPoints((prevDataPoints) => [...prevDataPoints, formattedLocation]);
  };

  const fetchWelcomeConfig = async () => {
    try {
      console.log('🔍 [WELCOME] Iniciando busca por painel de boas-vindas...');
      const { data, error } = await supabase
        .from('welcome_panels')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      console.log('🔍 [WELCOME] Resposta do Supabase:', { data, error });
      
      if (error) throw error;

      if (data) {
        console.log('✅ [WELCOME] Painel encontrado:', data);
        setWelcomePanelConfig(data);
        
        // Sempre mostrar o painel quando o site é aberto
        console.log('🎉 [WELCOME] Mostrando painel de boas-vindas sempre!');
        setShowWelcomePanel(true);
      } else {
        console.log('❌ [WELCOME] Nenhum painel ativo encontrado');
      }
    } catch (err) {
      console.error('❌ [WELCOME] Erro ao carregar configurações do painel de boas-vindas:', err);
    }
  };

  // Função para recarregar configurações do painel
  const refreshWelcomeConfig = async () => {
    console.log('🔄 [WELCOME] Recarregando configurações do painel...');
    await fetchWelcomeConfig();
  };

  const closeWelcomePanel = () => {
    console.log('🔒 [WELCOME] Fechando painel de boas-vindas');
    setShowWelcomePanel(false);
    localStorage.setItem('welcomePanelShown', 'true');
  };



  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("Inicializando aplicativo...");
        let dataPoints = await fetchDataPoints();
        console.log("Dados brutos recebidos do Supabase:", dataPoints);
        if (dataPoints.length === 0) {
          console.warn("Nenhum dado encontrado na tabela 'locations'.");
        }
        dataPoints = formatData(dataPoints);
        console.log("Dados formatados:", dataPoints);
        setDataPoints(dataPoints);
        
        // Carregar configurações do painel de boas-vindas
        await fetchWelcomeConfig();
      } catch (err) {
        console.error("Erro ao buscar ou formatar dados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Configurar listener para mudanças na tabela welcome_panels
    const welcomePanelsSubscription = supabase
      .channel('welcome_panels_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'welcome_panels'
        },
        (payload) => {
          console.log('🔄 [WELCOME] Mudança detectada na tabela welcome_panels:', payload);
          // Recarregar configurações quando houver mudanças
          fetchWelcomeConfig();
        }
      )
      .subscribe();

    // Listener para evento customizado de atualização
    const handleWelcomePanelUpdate = () => {
      console.log('🔄 [WELCOME] Evento de atualização recebido, recarregando...');
      fetchWelcomeConfig();
    };

    window.addEventListener('welcomePanelUpdated', handleWelcomePanelUpdate);
    
    // Expor função de refresh globalmente para debug
    window.refreshWelcomePanel = refreshWelcomeConfig;

    // Cleanup dos listeners
    return () => {
      welcomePanelsSubscription.unsubscribe();
      window.removeEventListener('welcomePanelUpdated', handleWelcomePanelUpdate);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Erro ao carregar os dados:</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente...
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onConteudoClick={() => navigate('/conteudo')} />
      
      {/* Welcome Panel */}
      {(() => {
        console.log('🔍 [WELCOME] Renderizando - showWelcomePanel:', showWelcomePanel, 'welcomePanelConfig:', welcomePanelConfig);
        return null;
      })()}
      {showWelcomePanel && welcomePanelConfig && (
        <WelcomePanel 
          isVisible={showWelcomePanel}
          onClose={closeWelcomePanel}
          onEdit={() => navigate('/admin?tab=welcome')}
          config={welcomePanelConfig}
        />
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={
            <main className="flex-grow">
              <MapaSantos 
                dataPoints={dataPoints} // Mostra todos os pontos sempre
              />
              <PainelInformacoes dataPoints={dataPoints} />
              <AddLocationButton onLocationAdded={handleLocationAdded} />
            </main>
          } 
        />
        <Route 
          path="/conteudo" 
          element={<ConteudoCartografia locations={dataPoints} />} 
        />
        <Route 
          path="/admin" 
          element={<AdminPanel />} 
        />
        <Route 
          path="/galeria/:galleryId" 
          element={<ImageGallery galleryId={window.location.pathname.split('/').pop()} />} 
        />
        <Route 
          path="/galerias" 
          element={<GalleryDemo />} 
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router basename="/cartografiasocial">
      <AppContent />
    </Router>
  );
};

export default App;