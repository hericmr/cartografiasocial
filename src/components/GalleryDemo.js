import React, { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import ImageGallery from './gallery/ImageGallery';

const GalleryDemo = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const { data, error } = await galleryService.getActiveGalleries();
      if (error) throw error;
      setGalleries(data || []);
    } catch (err) {
      console.error('Erro ao carregar galerias:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando galerias...</span>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma galeria disponível</h3>
          <p className="mt-1 text-sm text-gray-500">Crie uma galeria no painel administrativo.</p>
          <div className="mt-6">
            <a
              href="/admin?tab=galleries"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir para o painel administrativo
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGalleryId) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => setSelectedGalleryId(null)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar para lista de galerias
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Galerias de Imagens
              </h1>
            </div>
          </div>
        </div>
        <ImageGallery galleryId={selectedGalleryId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Galerias de Imagens
          </h1>
          <p className="text-lg text-gray-600">
            Explore nossas galerias de imagens interativas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedGalleryId(gallery.id)}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {gallery.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {gallery.description || 'Sem descrição'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Criada em {new Date(gallery.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex items-center text-blue-600">
                    <span className="text-sm font-medium mr-1">Ver galeria</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Quer criar suas próprias galerias?
          </p>
          <a
            href="/admin?tab=galleries"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Acessar painel administrativo
          </a>
        </div>
      </div>
    </div>
  );
};

export default GalleryDemo;