import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import GalleryEditor from './GalleryEditor';
import ImageManager from './ImageManager';
import GallerySettings from './GallerySettings';

const GalleryAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('galleries');
  const [galleries, setGalleries] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const { data, error } = await galleryService.getAllGalleries();
      if (error) throw error;
      setGalleries(data || []);
    } catch (err) {
      console.error('Erro ao carregar galerias:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGallery = () => {
    setSelectedGallery(null);
    setActiveTab('editor');
  };

  const handleEditGallery = (gallery) => {
    setSelectedGallery(gallery);
    setActiveTab('editor');
  };

  const handleGallerySaved = () => {
    fetchGalleries();
    setActiveTab('galleries');
  };

  const handleDeleteGallery = async (galleryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta galeria? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await galleryService.deleteGallery(galleryId);
      if (error) throw error;
      
      setGalleries(prev => prev.filter(g => g.id !== galleryId));
      if (selectedGallery?.id === galleryId) {
        setSelectedGallery(null);
        setActiveTab('galleries');
      }
    } catch (err) {
      console.error('Erro ao deletar galeria:', err);
      alert('Erro ao deletar galeria. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando galerias...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Gerenciamento de Galerias
            </h1>
            <p className="text-gray-600 mt-1">
              Crie e gerencie galerias de imagens interativas
            </p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('galleries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'galleries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Galerias ({galleries.length})
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'editor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {selectedGallery ? 'Editar Galeria' : 'Nova Galeria'}
              </button>
              {selectedGallery && (
                <button
                  onClick={() => setActiveTab('images')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'images'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Gerenciar Imagens
                </button>
              )}
              {selectedGallery && (
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Configurações
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'galleries' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Lista de Galerias
                </h2>
                <button
                  onClick={handleCreateGallery}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Galeria
                </button>
              </div>
              
              {galleries.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma galeria</h3>
                  <p className="mt-1 text-sm text-gray-500">Comece criando uma nova galeria.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleCreateGallery}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Criar primeira galeria
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleries.map((gallery) => (
                    <div key={gallery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                          {gallery.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gallery.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {gallery.is_active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {gallery.description || 'Sem descrição'}
                      </p>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        Criada em: {new Date(gallery.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditGallery(gallery)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setSelectedGallery(gallery);
                              setActiveTab('images');
                            }}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Imagens
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteGallery(gallery.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'editor' && (
            <GalleryEditor
              gallery={selectedGallery}
              onSave={handleGallerySaved}
              onCancel={() => setActiveTab('galleries')}
            />
          )}

          {activeTab === 'images' && selectedGallery && (
            <ImageManager
              gallery={selectedGallery}
              onBack={() => setActiveTab('galleries')}
            />
          )}

          {activeTab === 'settings' && selectedGallery && (
            <GallerySettings
              gallery={selectedGallery}
              onSave={handleGallerySaved}
              onBack={() => setActiveTab('galleries')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryAdminPanel;