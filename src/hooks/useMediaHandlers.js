import { supabase } from '../supabaseClient';

export const useMediaHandlers = (mediaState, setMediaState, audioState, setAudioState, editedLocation, setEditedLocation) => {
  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setMediaState(prev => ({
        ...prev,
        uploadError: "Alguns arquivos foram ignorados. Use apenas imagens JPG/PNG até 5MB."
      }));
    }

    setMediaState(prev => ({
      ...prev,
      selectedImages: [...prev.selectedImages, ...validFiles]
    }));

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaState(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImages = async () => {
    if (mediaState.selectedImages.length === 0) return;

    setMediaState(prev => ({ ...prev, uploadingImages: true, uploadError: "" }));
    const uploadedUrls = [];

    try {
      for (const file of mediaState.selectedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `locations/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Combina as URLs existentes com as novas
      const existingUrls = editedLocation.imagens ? editedLocation.imagens.split(',').filter(url => url) : [];
      const allUrls = [...existingUrls, ...uploadedUrls];

      setEditedLocation(prev => ({
        ...prev,
        imagens: allUrls.join(',')
      }));

      setMediaState(prev => ({
        ...prev,
        selectedImages: [],
        imageUrls: allUrls
      }));
    } catch (error) {
      console.error('Erro no upload:', error);
      setMediaState(prev => ({
        ...prev,
        uploadError: "Erro ao fazer upload das imagens. Tente novamente."
      }));
    } finally {
      setMediaState(prev => ({ ...prev, uploadingImages: false }));
    }
  };

  const removeImage = (index) => {
    const newImageUrls = mediaState.imageUrls.filter((_, i) => i !== index);
    setMediaState(prev => ({
      ...prev,
      imageUrls: newImageUrls
    }));
    setEditedLocation(prev => ({
      ...prev,
      imagens: newImageUrls.join(',')
    }));
  };

  return {
    handleImageSelect,
    handleUploadImages,
    removeImage
  };
};