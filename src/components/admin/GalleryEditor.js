import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const GalleryEditor = ({ gallery, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    main_text: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || '',
        description: gallery.description || '',
        main_text: gallery.main_text || '',
        is_active: gallery.is_active
      });
    }
  }, [gallery]);

  useEffect(() => {
    const newEditor = new Editor({
      extensions: [StarterKit],
      content: formData.main_text,
      onUpdate: ({ editor }) => {
        setFormData(prev => ({
          ...prev,
          main_text: editor.getHTML()
        }));
      },
    });
    setEditor(newEditor);

    return () => {
      newEditor.destroy();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (gallery) {
        // Atualizar galeria existente
        const { error } = await galleryService.updateGallery(gallery.id, formData);
        if (error) throw error;
      } else {
        // Criar nova galeria
        const { error } = await galleryService.createGallery(formData);
        if (error) throw error;
      }

      onSave();
    } catch (err) {
      console.error('Erro ao salvar galeria:', err);
      alert('Erro ao salvar galeria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {gallery ? 'Editar Galeria' : 'Nova Galeria'}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {gallery ? 'Modifique os dados da galeria' : 'Preencha os dados para criar uma nova galeria'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Galeria *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Digite o título da galeria"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Digite uma descrição breve da galeria"
          />
        </div>

        {/* Texto Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto Principal
          </label>
          <div className="border border-gray-300 rounded-lg min-h-[300px] bg-white">
            {editor && (
              <div className="p-4">
                {/* Barra de ferramentas */}
                <div className="border-b border-gray-200 pb-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('bold') 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('italic') 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('heading', { level: 2 }) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('heading', { level: 3 }) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('bulletList') 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      • Lista
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('orderedList') 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      1. Lista
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBlockquote().run()}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        editor.isActive('blockquote') 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      " Citação
                    </button>
                  </div>
                </div>
                
                {/* Editor */}
                <div className="prose max-w-none min-h-[200px] focus:outline-none">
                  {editor && <editor.Content />}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use a barra de ferramentas para formatar o texto. Este conteúdo será exibido no topo da galeria.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Galeria ativa (visível para usuários)
          </label>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Salvando...' : (gallery ? 'Atualizar Galeria' : 'Criar Galeria')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryEditor;