import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageNavigation from './ImageNavigation';
import ImageCaption from './ImageCaption';

const ImageModal = ({ 
  images, 
  selectedIndex, 
  onClose, 
  onPrevious, 
  onNext 
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-7xl max-h-[90vh] w-full mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Imagem principal */}
          <div className="relative">
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || currentImage.caption || 'Imagem da galeria'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
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
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;