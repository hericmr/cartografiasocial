import React, { useState } from 'react';
import { useGallery } from '../../hooks/useGallery';
import ImageGrid from './ImageGrid';
import ImageModal from './ImageModal';
import GalleryText from './GalleryText';

const ImageGallery = ({ galleryId, className = '' }) => {
  const { gallery, images, loading, error } = useGallery(galleryId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => 
      prev > 0 ? prev - 1 : images.length - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => 
      prev < images.length - 1 ? prev + 1 : 0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando galeria...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">Erro ao carregar galeria</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!gallery || images.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">Nenhuma imagem encontrada</p>
        <p className="text-sm">Esta galeria ainda não possui imagens.</p>
      </div>
    );
  }

  return (
    <div className={`image-gallery ${className}`}>
      <GalleryText 
        title={gallery.title}
        description={gallery.description}
        mainText={gallery.main_text}
      />
      
      <ImageGrid 
        images={images}
        onImageClick={handleImageClick}
      />
      
      {showModal && (
        <ImageModal
          images={images}
          selectedIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onImageSelect={handleImageSelect}
        />
      )}
    </div>
  );
};

export default ImageGallery;