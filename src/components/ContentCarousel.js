import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Heart, X, Maximize2, Minimize2 } from 'lucide-react';

const ContentCarousel = ({ isVisible, onClose, locations, startIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const currentLocation = locations[currentIndex];

  // Carregar favoritos do localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  // Navegação
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % locations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? locations.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Controles de áudio
  const toggleAudio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Favoritos
  const toggleFavorite = (locationId) => {
    const newFavorites = favorites.includes(locationId)
      ? favorites.filter(id => id !== locationId)
      : [...favorites, locationId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isVisible) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case ' ':
          event.preventDefault();
          if (currentLocation?.audioUrl) toggleAudio();
          break;
        case 'f':
          event.preventDefault();
          if (currentLocation?.id) toggleFavorite(currentLocation.id);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentLocation]);

  // Auto-play (opcional)
  useEffect(() => {
    if (isPlaying && currentLocation?.audioUrl) {
      const timer = setTimeout(() => {
        nextSlide();
      }, 10000); // 10 segundos por slide

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentLocation]);

  if (!isVisible || !locations.length) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-screen h-screen max-w-none max-h-none rounded-none' : ''
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Carrossel de Conteúdo ({currentIndex + 1} de {locations.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => currentLocation?.id && toggleFavorite(currentLocation.id)}
                className={`p-2 rounded-lg transition-colors ${
                  currentLocation?.id && favorites.includes(currentLocation.id)
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                }`}
                title="Adicionar aos favoritos (F)"
              >
                <Heart className={`w-5 h-5 ${currentLocation?.id && favorites.includes(currentLocation.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Tela cheia"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fechar (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-6">
            {/* Imagem principal */}
            {currentLocation?.imagens && currentLocation.imagens.length > 0 && (
              <div className="mb-6">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentLocation.imagens[0]}
                    alt={currentLocation.titulo}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Navegação de slides */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all"
                    title="Slide anterior (←)"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-75 transition-all"
                    title="Próximo slide (→)"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Contador de slides */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} de {locations.length}
                  </div>
                </div>
              </div>
            )}

            {/* Áudio */}
            {currentLocation?.audioUrl && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleAudio}
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Áudio</h3>
                    <p className="text-sm text-gray-600">Ouça mais informações sobre este local</p>
                  </div>
                  <Volume2 className="w-5 h-5 text-blue-600" />
                </div>
                <audio
                  ref={setAudioRef}
                  onEnded={handleAudioEnded}
                  className="w-full mt-3"
                  controls
                >
                  <source src={currentLocation.audioUrl} type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            )}

            {/* Conteúdo textual */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentLocation?.titulo}
              </h3>
              <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline">
                <div dangerouslySetInnerHTML={{ 
                  __html: currentLocation?.descricao_detalhada || currentLocation?.descricao || 'Sem descrição disponível.' 
                }} />
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Informações</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Tipo:</span>
                  <span className="ml-2 text-gray-800">{currentLocation?.tipo || 'Não especificado'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Completude:</span>
                  <div className="ml-2 inline-flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          currentLocation?.pontuacaoPercentual >= 80 ? 'bg-green-500' :
                          currentLocation?.pontuacaoPercentual >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${currentLocation?.pontuacaoPercentual || 0}%` }}
                      />
                    </div>
                    <span className="text-gray-800">{currentLocation?.pontuacaoPercentual || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Miniaturas dos slides */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {locations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                title={location.titulo}
              >
                {location.imagens && location.imagens.length > 0 ? (
                  <img
                    src={location.imagens[0]}
                    alt={location.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Sem imagem</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer com controles */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Use as setas para navegar • F para favoritar • ESC para fechar
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={prevSlide}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={nextSlide}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;