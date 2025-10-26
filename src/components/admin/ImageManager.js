import React, { useState, useEffect } from 'react';
import { useGallery } from '../../hooks/useGallery';
import ImageUploader from './ImageUploader';

const ImageManager = ({ gallery, onBack }) => {
  const { images, loading, refreshImages, updateImage, deleteImage, reorderImages } = useGallery(gallery.id);
  const [editingImage, setEditingImage] = useState(null);

  const handleImageUpdate = async (imageId, updates) => {
    try {
      await updateImage(imageId, updates);
      setEditingImage(null);
    } catch (err) {
      console.error('Erro ao atualizar imagem:', err);
      alert('Erro ao atualizar imagem');
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.')) return;

    try {
      await deleteImage(imageId);
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      alert('Erro ao deletar imagem');
    }
  };

  const handleReorder = async (fromIndex, toIndex) => {
    try {
      const newOrder = [...images];
      const [movedImage] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedImage);
      
      const imageIds = newOrder.map(img => img.id);
      await reorderImages(imageIds);
    } catch (err) {
      console.error('Erro ao reordenar imagens:', err);
      alert('Erro ao reordenar imagens');
    }
  };

  const handleUploadComplete = () => {
    refreshImages();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando imagens...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Gerenciar Imagens - {gallery.title}
          </h2>
          <p className="text-gray-600 text-sm">
            {images.length} imagem{images.length !== 1 ? 's' : ''} na galeria
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>

      {/* Upload de Imagens */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Adicionar Imagens
        </h3>
        <ImageUploader
          galleryId={gallery.id}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {/* Lista de Imagens */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">
          Imagens da Galeria
        </h3>
        
        {images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma imagem</h3>
            <p className="mt-1 text-sm text-gray-500">Use o upload acima para adicionar imagens à galeria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={image.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="relative mb-4">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Imagem da galeria'}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Legenda
                    </label>
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => {
                        // Atualizar estado local imediatamente para feedback visual
                        const updatedImages = images.map(img => 
                          img.id === image.id ? { ...img, caption: e.target.value } : img
                        );
                        // Aqui você poderia usar um estado local se necessário
                      }}
                      onBlur={(e) => handleImageUpdate(image.id, { caption: e.target.value })}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite a legenda..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Texto Alternativo
                    </label>
                    <input
                      type="text"
                      value={image.alt_text || ''}
                      onChange={(e) => {
                        // Atualizar estado local imediatamente para feedback visual
                      }}
                      onBlur={(e) => handleImageUpdate(image.id, { alt_text: e.target.value })}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Texto para acessibilidade..."
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => index > 0 && handleReorder(index, index - 1)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                        title="Mover para cima"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => index < images.length - 1 && handleReorder(index, index + 1)}
                        disabled={index === images.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                        title="Mover para baixo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleImageDelete(image.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;