import React, { useState, useEffect } from 'react';
import { orangeIcon, blackIcon, violetIcon, redIcon, blueIcon, greenIcon, yellowIcon } from './CustomIcon';
import ContentModal from './ContentModal';
import { Search, Filter, Heart, Clock, Eye, Volume2, MapPin, ArrowRight } from 'lucide-react';

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
  const [sortBy, setSortBy] = useState('titulo'); // 'titulo', 'pontuacao', 'tipo'
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Carregar favoritos e histórico do localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setFavorites(savedFavorites);
    setRecentlyViewed(savedRecentlyViewed);
  }, []);

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
          fill="currentColor"
          className={`text-${categoriaInfo.cor}`}
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        />
        <circle cx="12" cy="9" r="3" fill="white" />
      </svg>
    );
  };

  const LocationHighlightCard = ({ local, categoriaInfo }) => {
    const isFavorite = favorites.includes(local.id);

    const abrirModalComBloqueio = (event) => {
      event.preventDefault();
      event.stopPropagation();
      abrirLocal(local);
    };

    const descricaoLimpa = local.descricao_detalhada
      ? local.descricao_detalhada.replace(/<[^>]*>/g, '').substring(0, 140)
      : local.descricao?.substring(0, 140);

    const categoriaLabel = categoriaInfo?.label || local.tipo || 'Sem categoria';
    const tipoKey = (local.tipo || '').toLowerCase();

    const badgeBg =
      {
        'lazer': 'bg-blue-500/90',
        'assistencia': 'bg-green-600/90',
        'histórico': 'bg-yellow-500/90',
        'historico': 'bg-yellow-500/90',
        'comunidades': 'bg-red-500/90',
        'educação': 'bg-violet-600/90',
        'educacao': 'bg-violet-600/90',
        'religiao': 'bg-gray-700/90',
        'religião': 'bg-gray-700/90',
        'bairro': 'bg-orange-500/90'
      }[tipoKey] || 'bg-green-600/90';

    return (
      <div
        className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-green-100 bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
        onClick={() => abrirLocal(local)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            abrirLocal(local);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes de ${local.titulo}`}
      >
        <div className="relative h-56 w-full overflow-hidden">
          {local.imagens && local.imagens.length > 0 ? (
            <>
              <img
                src={local.imagens[0]}
                alt={`Imagem de ${local.titulo}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white">
              <MapPin className="h-12 w-12 opacity-60" />
            </div>
          )}

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-900 shadow">
            {renderIconeSVG(local.tipo || 'outros')}
            <span>{categoriaLabel}</span>
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-2">
            <button
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                isFavorite ? 'text-red-400' : 'text-white'
              }`}
              onClick={(event) => {
                event.stopPropagation();
                toggleFavorite(local.id);
              }}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-pressed={isFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {local.imagens && local.imagens.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white">
              <Eye className="h-3 w-3" />
              <span>{local.imagens.length} fotos</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-lg font-semibold text-green-900 transition-colors group-hover:text-green-700">
              {local.titulo}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {descricaoLimpa}
              {descricaoLimpa && descricaoLimpa.length >= 140 ? '…' : ''}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-500">
              {local.audioUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  <Volume2 className="h-3.5 w-3.5" />
                  Áudio
                </span>
              )}
              {local.links && local.links.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Links
                </span>
              )}
            </div>

          </div>

          <button
            className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors ${badgeBg} hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white`}
            onClick={abrirModalComBloqueio}
          >
            Ver detalhes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
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
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-4">
                {/* Filtro de favoritos */}
                <label className="flex cursor-pointer items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Heart className={`h-5 w-5 ${showFavoritesOnly ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  <span className="text-sm text-gray-600">Apenas favoritos</span>
                </label>

                {/* Ordenação */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded border px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="titulo">Ordenar por título</option>
                    <option value="pontuacao">Ordenar por completude</option>
                    <option value="tipo">Ordenar por tipo</option>
                  </select>
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
                  
                  <div className="flex flex-col gap-6">
                    {locaisFiltrados.map((local) => (
                      <LocationHighlightCard
                        key={local.id}
                        local={local}
                        categoriaInfo={categoriaInfo}
                      />
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
    </div>
  );
};

export default ConteudoCartografia;