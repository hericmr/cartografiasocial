import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import { imageService } from '../services/imageService';

export const useGallery = (galleryId) => {
  const [gallery, setGallery] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (galleryId) {
      fetchGalleryData();
    }
  }, [galleryId]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados da galeria
      const { data: galleryData, error: galleryError } = await galleryService.getGalleryById(galleryId);
      if (galleryError) throw galleryError;

      // Buscar imagens da galeria
      const { data: imagesData, error: imagesError } = await galleryService.getGalleryImages(galleryId);
      if (imagesError) throw imagesError;

      setGallery(galleryData);
      setImages(imagesData || []);
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshImages = async () => {
    try {
      const { data: imagesData, error } = await galleryService.getGalleryImages(galleryId);
      if (error) throw error;
      setImages(imagesData || []);
    } catch (err) {
      console.error('Erro ao atualizar imagens:', err);
    }
  };

  const updateImage = async (imageId, updates) => {
    try {
      const { data, error } = await imageService.updateImageMetadata(imageId, updates);
      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      ));
    } catch (err) {
      console.error('Erro ao atualizar imagem:', err);
      throw err;
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const { error } = await imageService.deleteImage(imageId);
      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      throw err;
    }
  };

  const reorderImages = async (newOrder) => {
    try {
      const { error } = await imageService.reorderImages(galleryId, newOrder);
      if (error) throw error;

      // Atualizar estado local
      const reorderedImages = newOrder.map(id => 
        images.find(img => img.id === id)
      ).filter(Boolean);
      
      setImages(reorderedImages);
    } catch (err) {
      console.error('Erro ao reordenar imagens:', err);
      throw err;
    }
  };

  return {
    gallery,
    images,
    loading,
    error,
    refreshImages,
    updateImage,
    deleteImage,
    reorderImages
  };
};