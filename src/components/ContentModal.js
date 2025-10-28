import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, Share2, Heart, Download, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import ShareAndPrint from './ShareAndPrint';

const ContentModal = ({ isVisible, onClose, content, onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const images = content?.imagens || [];
  const audioUrl = content?.audioUrl || '';

  // Carregar estado de favorito do localStorage
  useEffect(() => {
    if (content?.id) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(favorites.includes(content.id));
    }
  }, [content?.id]);

  // Adicionar aos favoritos
  const toggleFavorite = () => {
    if (!content?.id) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorited 
      ? favorites.filter(id => id !== content.id)
      : [...favorites, content.id];
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

  // Navegação de imagens
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
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

  // Abrir modal de compartilhamento
  const shareContent = () => {
    setShowShareModal(true);
  };

  // Download de imagem
  const downloadImage = () => {
    if (images[currentImageIndex]) {
      const link = document.createElement('a');
      link.href = images[currentImageIndex];
      link.download = `${content?.titulo || 'imagem'}-${currentImageIndex + 1}.jpg`;
      link.click();
    }
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
          if (images.length > 1) prevImage();
          break;
        case 'ArrowRight':
          if (images.length > 1) nextImage();
          break;
        case ' ':
          event.preventDefault();
          if (audioUrl) toggleAudio();
          break;
        case 'f':
          event.preventDefault();
          toggleFavorite();
          break;
        case 's':
          event.preventDefault();
          shareContent();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, images.length, audioUrl]);

  if (!isVisible || !content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-screen h-screen max-w-none max-h-none rounded-none' : ''
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800 truncate">
              {content.titulo}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                }`}
                title="Adicionar aos favoritos (F)"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareContent}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Compartilhar (S)"
              >
                <Share2 className="w-5 h-5" />
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
            {/* Áudio */}
            {audioUrl && (
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
                  <source src={audioUrl} type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            )}

            {/* Galeria de Imagens */}
            {images.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Galeria de Imagens ({images.length})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={downloadImage}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Baixar imagem atual"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  {/* Imagem principal */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={images[currentImageIndex]}
                      alt={`${content.titulo} - Imagem ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover"
                    />
                    
                    {/* Navegação de imagens */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                          title="Imagem anterior (←)"
                        >
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                          title="Próxima imagem (→)"
                        >
                          <ArrowRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Contador de imagens */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} de {images.length}
                    </div>
                  </div>

                  {/* Miniaturas */}
                  {images.length > 1 && (
                    <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo textual */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: content.descricao_detalhada || content.descricao || 'Sem descrição disponível.' }} />
            </div>

            {/* Links */}
            {content.links && content.links.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Links Relacionados</h3>
                <div className="space-y-2">
                  {content.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        {link.texto}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        {link.url}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Informações adicionais */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Tipo:</span>
                  <span className="ml-2 text-gray-800">{content.tipo || 'Não especificado'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Completude:</span>
                  <div className="ml-2 inline-flex items-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          content.pontuacaoPercentual >= 80 ? 'bg-green-500' :
                          content.pontuacaoPercentual >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${content.pontuacaoPercentual}%` }}
                      />
                    </div>
                    <span className="text-gray-800">{content.pontuacaoPercentual}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Use as setas para navegar pelas imagens • F para favoritar • S para compartilhar • ESC para fechar
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de compartilhamento */}
      {showShareModal && (
        <ShareAndPrint
          content={content}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default ContentModal;