import { useState } from 'react';
import { imageService } from '../services/imageService';

export const useImageUpload = (galleryId) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);

  const uploadSingleImage = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Upload da imagem
      const uploadResult = await imageService.uploadImage(file, galleryId);
      if (uploadResult.error) throw uploadResult.error;

      setUploadProgress(50);

      // Salvar metadados
      const metadataResult = await imageService.saveImageMetadata({
        gallery_id: galleryId,
        image_url: uploadResult.data.imageUrl,
        image_path: uploadResult.data.imagePath,
        alt_text: file.name,
        display_order: 0
      });

      if (metadataResult.error) throw metadataResult.error;

      setUploadProgress(100);
      return { data: metadataResult.data, error: null };
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      return { data: null, error };
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleImages = async (files, onProgress) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadResults([]);

      const results = await imageService.uploadMultipleImages(
        files, 
        galleryId, 
        (progress) => {
          setUploadProgress(progress);
          if (onProgress) onProgress(progress);
        }
      );

      setUploadResults(results);
      return results;
    } catch (error) {
      console.error('Erro no upload múltiplo:', error);
      return [];
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadResults([]);
  };

  return {
    uploading,
    uploadProgress,
    uploadResults,
    uploadSingleImage,
    uploadMultipleImages,
    resetUpload
  };
};