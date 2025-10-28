import React, { useState, useEffect } from 'react';
import { orangeIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon } from './CustomIcon';
import ContentModal from './ContentModal';
import ContentCarousel from './ContentCarousel';
import { Search, Filter, Grid, List, Heart, Star, Clock, Eye, Play, Volume2 } from 'lucide-react';

const CATEGORIAS = {
  'lazer': { cor: 'blue-700', bgCor: 'bg-blue-200', borderCor: 'border-blue-200', icone: blueIcon, label: 'Lazer' },
  'assistencia': { cor: 'green-700', bgCor: 'bg-green-100', borderCor: 'border-green-200', icone: greenIcon, label: 'Assistência' },
  'historico': { cor: 'yellow-600', bgCor: 'bg-yellow-100', borderCor: 'border-yellow-200', icone: yellowIcon, label: 'Históricos' },
  'comunidades': { cor: 'red-600', bgCor: 'bg-red-100', borderCor: 'border-red-200', icone: redIcon, label: 'Comunidades' },
  'educação': { cor: 'violet-600', bgCor: 'bg-violet-200', borderCor: 'border-violet-200', icone: violetIcon, label: 'Educação' },
  'religiao': { cor: 'black', bgCor: 'bg-gray-200', borderCor: 'border-gray-200', icone: blackIcon, label: 'Religião' },
  'bairro': { cor: 'orange-500', bgCor: 'bg-orange-200', borderCor: 'border-orange-200', icone: orangeIcon, label: 'Bairro' }
};

const ConteudoCartografia = ({ locations }) => {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [sortBy, setSortBy] = useState('titulo'); // 'titulo', 'pontuacao', 'tipo'
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Carregar favoritos e histórico do localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setFavorites(savedFavorites);
    setRecentlyViewed(savedRecentlyViewed);
  }, []);

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

  // Adicionar aos favoritos
  const toggleFavorite = (localId) => {
    const newFavorites = favorites.includes(localId)
      ? favorites.filter(id => id !== localId)
      : [...favorites, localId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Adicionar ao histórico de visualização
  const addToRecentlyViewed = (local) => {
    const newRecentlyViewed = [local, ...recentlyViewed.filter(item => item.id !== local.id)].slice(0, 10);
    setRecentlyViewed(newRecentlyViewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(newRecentlyViewed));
  };

  // Abrir modal de conteúdo
  const openContentModal = (local) => {
    setSelectedContent(local);
    setShowModal(true);
    addToRecentlyViewed(local);
  };

  // Fechar modal
  const closeContentModal = () => {
    setShowModal(false);
    setSelectedContent(null);
  };

  // Abrir carrossel
  const openCarousel = (startIndex = 0) => {
    setCarouselStartIndex(startIndex);
    setShowCarousel(true);
  };

  // Fechar carrossel
  const closeCarousel = () => {
    setShowCarousel(false);
    setCarouselStartIndex(0);
  };

  // Obter locais filtrados para o carrossel
  const getFilteredLocations = () => {
    let filteredLocations = locations;

    // Aplicar filtros
    if (categoriaSelecionada !== 'todos') {
      filteredLocations = filteredLocations.filter(local => 
        local.tipo?.toLowerCase() === categoriaSelecionada.toLowerCase()
      );
    }

    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      filteredLocations = filteredLocations.filter(local => 
        local.titulo?.toLowerCase().includes(termo) ||
        local.descricao_detalhada?.toLowerCase().includes(termo) ||
        local.descricao?.toLowerCase().includes(termo)
      );
    }

    if (showFavoritesOnly) {
      filteredLocations = filteredLocations.filter(local => favorites.includes(local.id));
    }

    // Aplicar ordenação
    filteredLocations.sort((a, b) => {
      switch (sortBy) {
        case 'titulo':
          return (a.titulo || '').localeCompare(b.titulo || '');
        case 'pontuacao':
          return (b.pontuacaoPercentual || 0) - (a.pontuacaoPercentual || 0);
        case 'tipo':
          return (a.tipo || '').localeCompare(b.tipo || '');
        default:
          return 0;
      }
    });

    return filteredLocations;
  };

  // Agrupa os locais por categoria
  const locaisPorCategoria = locations.reduce((acc, local) => {
    const categoria = local.tipo?.toLowerCase() || 'outros';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(local);
    return acc;
  }, {});

  // Filtra e ordena os locais
  const filtrarEOrdenarLocais = (locais) => {
    let locaisFiltrados = locais;

    // Filtro por busca
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      locaisFiltrados = locaisFiltrados.filter(local => 
        local.titulo?.toLowerCase().includes(termo) ||
        local.descricao_detalhada?.toLowerCase().includes(termo) ||
        local.descricao?.toLowerCase().includes(termo)
      );
    }

    // Filtro por favoritos
    if (showFavoritesOnly) {
      locaisFiltrados = locaisFiltrados.filter(local => favorites.includes(local.id));
    }

    // Ordenação
    locaisFiltrados.sort((a, b) => {
      switch (sortBy) {
        case 'titulo':
          return (a.titulo || '').localeCompare(b.titulo || '');
        case 'pontuacao':
          return (b.pontuacaoPercentual || 0) - (a.pontuacaoPercentual || 0);
        case 'tipo':
          return (a.tipo || '').localeCompare(b.tipo || '');
        default:
          return 0;
      }
    });

    return locaisFiltrados;
  };

  const abrirLocal = (local) => {
    openContentModal(local);
  };

  // Função para renderizar o ícone SVG com a cor correta
  const renderIconeSVG = (categoria) => {
    const categoriaInfo = CATEGORIAS[categoria.toLowerCase()];
    if (!categoriaInfo) return null;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill={`currentColor`}
          className={`text-${categoriaInfo.cor}`}
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        />
        <circle cx="12" cy="9" r="3" fill="white"/>
      </svg>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50" role="main" aria-label="Conteúdo da Cartografia Social">
      {/* Cabeçalho fixo */}
      <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Conteúdo da Cartografia Social
          </h1>

          {/* Barra de busca e filtros */}
          <div className="space-y-4">
            {/* Primeira linha: Busca e filtros principais */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar por título ou descrição..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  aria-label="Buscar conteúdo"
                  role="searchbox"
                />
              </div>
              <select
                className="p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoriaSelecionada}
                onChange={(e) => setCategoriaSelecionada(e.target.value)}
                aria-label="Filtrar por categoria"
              >
                <option value="todos">Todas as categorias</option>
                {Object.entries(CATEGORIAS).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            {/* Segunda linha: Controles adicionais */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center space-x-4">
                {/* Filtro de favoritos */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Heart className={`w-5 h-5 ${showFavoritesOnly ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-600">Apenas favoritos</span>
                </label>

                {/* Ordenação */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="titulo">Ordenar por título</option>
                    <option value="pontuacao">Ordenar por completude</option>
                    <option value="tipo">Ordenar por tipo</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                {/* Botão do carrossel */}
                <button
                  onClick={() => openCarousel(0)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  title="Abrir carrossel de apresentação"
                  aria-label="Abrir carrossel de apresentação dos locais"
                >
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Carrossel</span>
                </button>

                {/* Modo de visualização */}
                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="Visualização em grade"
                    aria-label="Alternar para visualização em grade"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="Visualização em lista"
                    aria-label="Alternar para visualização em lista"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{locations.length} locais totais</span>
              </div>
              {favorites.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{favorites.length} favoritos</span>
                </div>
              )}
              {recentlyViewed.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recentlyViewed.length} visualizados recentemente</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo com rolagem */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {Object.entries(locaisPorCategoria)
            .filter(([categoria]) => 
              categoriaSelecionada === 'todos' || categoria.toLowerCase() === categoriaSelecionada.toLowerCase()
            )
            .map(([categoria, locais]) => {
              const locaisFiltrados = filtrarEOrdenarLocais(locais);
              if (locaisFiltrados.length === 0) return null;

              const categoriaInfo = CATEGORIAS[categoria.toLowerCase()];
              const bgColor = categoriaInfo?.bgCor || 'bg-white';
              const textColor = categoriaInfo?.cor || 'gray-800';
              const borderColor = categoriaInfo?.borderCor || 'border-gray-200';

              return (
                <div key={categoria} className={`${bgColor} rounded-lg shadow-lg p-6 transition-all hover:shadow-xl`}>
                  <div className="flex items-center mb-6 pb-3 border-b">
                    {renderIconeSVG(categoria)}
                    <h2 className={`text-xl font-semibold ml-2 text-${textColor}`}>
                      {categoriaInfo?.label || categoria}
                    </h2>
                    <span className="ml-auto text-sm text-gray-500">
                      {locaisFiltrados.length} {locaisFiltrados.length === 1 ? 'local' : 'locais'}
                    </span>
                  </div>
                  
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                    : "space-y-3 sm:space-y-4"
                  }>
                    {locaisFiltrados.map((local) => (
                      <div
                        key={local.id}
                        onClick={() => abrirLocal(local)}
                        className={`cursor-pointer border ${borderColor} rounded-lg p-5 hover:bg-white transition-all duration-200 hover:shadow-md group focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none ${
                          viewMode === 'list' ? 'flex items-start space-x-4' : ''
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-label={`Ver detalhes de ${local.titulo}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            abrirLocal(local);
                          }
                        }}
                      >
                        {/* Imagem */}
                        {local.imagens && local.imagens.length > 0 && (
                          <div className={`${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'mb-4'}`}>
                            <img
                              src={local.imagens[0]}
                              alt={`Imagem de ${local.titulo}`}
                              className={`w-full ${viewMode === 'list' ? 'h-24' : 'h-48'} object-cover rounded-lg shadow-sm`}
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Conteúdo */}
                        <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-medium text-${textColor} group-hover:text-${textColor} transition-colors ${
                              viewMode === 'list' ? 'text-lg' : ''
                            }`}>
                              {local.titulo}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(local.id);
                              }}
                              className={`p-1 rounded-full transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none ${
                                favorites.includes(local.id)
                                  ? 'text-red-500 hover:text-red-600'
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                              title={favorites.includes(local.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                              aria-label={favorites.includes(local.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                              aria-pressed={favorites.includes(local.id)}
                            >
                              <Heart className={`w-4 h-4 ${favorites.includes(local.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <p className={`text-gray-600 text-sm ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                            {local.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, viewMode === 'list' ? 150 : 200)}...
                          </p>

                          {/* Informações adicionais */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full bg-${textColor.replace('-700', '-100')} text-${textColor}`}>
                                {categoriaInfo?.label || local.tipo}
                              </span>
                              {local.audioUrl && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Volume2 className="w-3 h-3 mr-1" />
                                  Áudio
                                </div>
                              )}
                              {local.imagens && local.imagens.length > 1 && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Eye className="w-3 h-3 mr-1" />
                                  {local.imagens.length} fotos
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    local.pontuacaoPercentual >= 80 ? 'bg-green-500' :
                                    local.pontuacaoPercentual >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${local.pontuacaoPercentual}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">
                                {local.pontuacaoPercentual}%
                              </span>
                            </div>
                          </div>

                          {viewMode === 'grid' && (
                            <div className={`text-sm text-${textColor} opacity-0 group-hover:opacity-100 transition-opacity mt-2`}>
                              Clique para ver mais →
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Modal de conteúdo */}
      <ContentModal
        isVisible={showModal}
        onClose={closeContentModal}
        content={selectedContent}
        onNavigate={abrirLocal}
      />

      {/* Carrossel de conteúdo */}
      <ContentCarousel
        isVisible={showCarousel}
        onClose={closeCarousel}
        locations={getFilteredLocations()}
        startIndex={carouselStartIndex}
      />
    </div>
  );
};

export default ConteudoCartografia;