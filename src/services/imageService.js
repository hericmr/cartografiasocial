import { supabase } from '../supabaseClient';

export const imageService = {
  // Upload de imagem para Supabase Storage
  async uploadImage(file, galleryId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery-${galleryId}/${fileName}`;

      // Upload para Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      return { 
        data: { 
          imageUrl: publicUrl, 
          imagePath: filePath,
          fileName: fileName
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Erro no upload da imagem:', error);
      return { data: null, error };
    }
  },

  // Salvar metadados da imagem no banco
  async saveImageMetadata(imageData) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([imageData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao salvar metadados da imagem:', error);
      return { data: null, error };
    }
  },

  // Atualizar metadados da imagem
  async updateImageMetadata(imageId, updates) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar metadados da imagem:', error);
      return { data: null, error };
    }
  },

  // Deletar imagem
  async deleteImage(imageId) {
    try {
      // Buscar dados da imagem para deletar do storage
      const { data: imageData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('image_path')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Deletar do storage
      if (imageData?.image_path) {
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove([imageData.image_path]);

        if (storageError) {
          console.warn('Erro ao deletar do storage:', storageError);
        }
      }

      // Deletar do banco
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      return { data: true, error: null };
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return { data: null, error };
    }
  },

  // Reordenar imagens
  async reorderImages(galleryId, imageOrder) {
    try {
      const updates = imageOrder.map((imageId, index) => ({
        id: imageId,
        display_order: index
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('gallery_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Erro ao reordenar imagens:', error);
      return { data: null, error };
    }
  },

  // Upload múltiplo de imagens
  async uploadMultipleImages(files, galleryId, onProgress) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Upload da imagem
        const uploadResult = await this.uploadImage(file, galleryId);
        if (uploadResult.error) throw uploadResult.error;

        // Salvar metadados
        const metadataResult = await this.saveImageMetadata({
          gallery_id: galleryId,
          image_url: uploadResult.data.imageUrl,
          image_path: uploadResult.data.imagePath,
          alt_text: file.name,
          display_order: i
        });

        if (metadataResult.error) throw metadataResult.error;

        results.push(metadataResult.data);
        
        // Callback de progresso
        if (onProgress) {
          onProgress(((i + 1) / files.length) * 100);
        }
      } catch (error) {
        console.error(`Erro no upload da imagem ${file.name}:`, error);
        results.push({ error: error.message, fileName: file.name });
      }
    }

    return results;
  }
};