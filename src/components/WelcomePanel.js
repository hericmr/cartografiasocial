import React, { useState, useEffect } from 'react';
import { X, Eye, Play, Pause, Volume2 } from 'lucide-react';

const WelcomePanel = ({ isVisible, onClose, onEdit, config }) => {
  console.log('🎭 [WELCOME_PANEL] Componente renderizado - isVisible:', isVisible, 'config:', config);
  
  const [content, setContent] = useState(config?.content || '');
  const [title, setTitle] = useState(config?.title || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const images = [
    "/cartografiasocial/fotos/turma.png",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_162955.jpg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_163006.jpg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_163037.jpg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_163051.jpg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0081.jpeg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0083.jpeg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0085.jpeg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0087.jpeg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0089.jpeg",
    "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0091.jpeg"
  ];

  // Function declarations
  const nextImage = () => {
    const nextIndex = (selectedImageIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setSelectedImageIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
    setSelectedImage(images[prevIndex]);
    setSelectedImageIndex(prevIndex);
  };

  const openImageModal = (imageSrc) => {
    const index = images.indexOf(imageSrc);
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  };

  useEffect(() => {
    if (config) {
      console.log('✅ [WELCOME_PANEL] Usando config fornecido:', config);
      setContent(config.content || '');
      setTitle(config.title || '');
    }
  }, [config]);

  // Adicionar listeners de teclado para navegação de imagens
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;

      switch (event.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            prevImage();
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            nextImage();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedImageIndex, images.length, nextImage, prevImage, closeImageModal]);


  const handleClose = () => {
    // Parar áudio se estiver tocando
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    // Marcar como visualizado no localStorage
    localStorage.setItem('welcomePanelShown', 'true');
    onClose();
  };

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

  if (!isVisible) {
    console.log('🚫 [WELCOME_PANEL] Painel não está visível, não renderizando');
    return null;
  }
  
  console.log('✅ [WELCOME_PANEL] Painel está visível, renderizando...');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando painel de boas-vindas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Header com primeira imagem */}
        {images.length > 0 && (
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <img
              src={images[0]}
              alt="Imagem principal"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Áudio */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <button
                onClick={toggleAudio}
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              <p className="text-sm text-gray-600">Ouça a apresentação completa do projeto</p>
              <Volume2 className="w-5 h-5 text-blue-600 ml-auto" />
            </div>
            <audio
              ref={setAudioRef}
              onEnded={handleAudioEnded}
              className="w-full"
              controls
            >
              <source src="/cartografiasocial/audio/intro.mp3" type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>

          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Galeria de Imagens */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Galeria de Imagens</h3>
            <p className="text-sm text-gray-600 mb-4">Clique nas imagens para ampliá-las</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  onClick={() => openImageModal(image)}
                  title="Clique para ampliar"
                >
                  <img
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-2">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end items-center">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Começar a explorar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de visualização de imagem */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-60 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Botão fechar */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              title="Fechar (ESC)"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Botão anterior */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                title="Imagem anterior (←)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Botão próximo */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                title="Próxima imagem (→)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Imagem */}
            <img
              src={selectedImage}
              alt={`Imagem ${selectedImageIndex + 1} de ${images.length}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Contador de imagens */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} de {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePanel;