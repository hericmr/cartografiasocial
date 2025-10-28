import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageNavigation from './ImageNavigation';
import ImageCaption from './ImageCaption';

const ImageModal = ({ 
  images, 
  selectedIndex, 
  onClose, 
  onPrevious, 
  onNext,
  onImageSelect 
}) => {
  const currentImage = images[selectedIndex];

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevious, onNext]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Header com primeira imagem */}
        <div className="flex-shrink-0 bg-gray-900 bg-opacity-50 border-b border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {images.length > 0 && (
                <div className="flex space-x-2">
                  {images.slice(0, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt={image.alt_text || image.caption || `Imagem ${index + 1}`}
                      className={`w-12 h-12 object-cover rounded cursor-pointer transition-all duration-200 ${
                        index === selectedIndex 
                          ? 'ring-2 ring-blue-500 opacity-100' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      onClick={() => onImageSelect && onImageSelect(index)}
                    />
                  ))}
                  {images.length > 5 && (
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-medium">
                      +{images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Botão de fechar */}
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
              aria-label="Fechar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="relative max-w-7xl max-h-full w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Imagem principal */}
            <div className="relative">
              <img
                src={currentImage.image_url}
                alt={currentImage.alt_text || currentImage.caption || 'Imagem da galeria'}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
              
              {/* Navegação */}
              <ImageNavigation
                onPrevious={onPrevious}
                onNext={onNext}
                currentIndex={selectedIndex}
                totalImages={images.length}
              />
            </div>

            {/* Legenda */}
            <ImageCaption
              caption={currentImage.caption}
              altText={currentImage.alt_text}
              imageIndex={selectedIndex + 1}
              totalImages={images.length}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;