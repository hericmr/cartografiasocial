import { supabase } from '../supabaseClient';

export const galleryService = {
  // Buscar todas as galerias ativas
  async getActiveGalleries() {
    try {
      const { data, error } = await supabase
        .from('image_galleries')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar galerias:', error);
      return { data: null, error };
    }
  },

  // Buscar galeria por ID
  async getGalleryById(galleryId) {
    try {
      const { data, error } = await supabase
        .from('image_galleries')
        .select('*')
        .eq('id', galleryId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar galeria:', error);
      return { data: null, error };
    }
  },

  // Buscar imagens de uma galeria
  async getGalleryImages(galleryId) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', galleryId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar imagens da galeria:', error);
      return { data: null, error };
    }
  },

  // Criar nova galeria
  async createGallery(galleryData) {
    try {
      const { data, error } = await supabase
        .from('image_galleries')
        .insert([galleryData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar galeria:', error);
      return { data: null, error };
    }
  },

  // Atualizar galeria
  async updateGallery(galleryId, updates) {
    try {
      const { data, error } = await supabase
        .from('image_galleries')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', galleryId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar galeria:', error);
      return { data: null, error };
    }
  },

  // Deletar galeria
  async deleteGallery(galleryId) {
    try {
      const { error } = await supabase
        .from('image_galleries')
        .delete()
        .eq('id', galleryId);

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      console.error('Erro ao deletar galeria:', error);
      return { data: null, error };
    }
  },

  // Buscar todas as galerias (para admin)
  async getAllGalleries() {
    try {
      const { data, error } = await supabase
        .from('image_galleries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar todas as galerias:', error);
      return { data: null, error };
    }
  }
};