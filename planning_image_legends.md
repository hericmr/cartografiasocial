# Plano de Implementação: Galeria de Imagens Interativa com Supabase

## Objetivo
Desenvolver uma galeria de imagens interativa com navegação (próxima/anterior), legendas editáveis e painel de administração, utilizando Supabase como Backend-as-a-Service.

## Análise da Estrutura Atual

### Tecnologias Já Disponíveis
- **React 18.3.1** - Framework principal
- **Supabase 2.49.1** - Backend e banco de dados
- **Tailwind CSS 3.4.16** - Estilização
- **React Router DOM 7.3.0** - Roteamento
- **Tiptap 3.8.0** - Editor de texto rico (já instalado)
- **Framer Motion 12.5.0** - Animações

### Componentes Existentes que Podem ser Reutilizados
- `AdminPanel.js` - Base para painel administrativo
- `WelcomePanel.js` - Estrutura de modal
- Sistema de autenticação existente
- Estrutura de upload de arquivos

## Fase 1: Estrutura do Supabase (Prioridade Alta)

### 1.1 Esquema de Banco de Dados

#### Tabela: `image_galleries`
```sql
CREATE TABLE image_galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  main_text TEXT, -- Texto principal da galeria
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

#### Tabela: `gallery_images`
```sql
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES image_galleries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- URL do Supabase Storage
  image_path TEXT NOT NULL, -- Caminho no storage
  caption TEXT, -- Legenda da imagem
  alt_text TEXT, -- Texto alternativo para acessibilidade
  display_order INTEGER DEFAULT 0, -- Ordem de exibição
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabela: `gallery_settings`
```sql
CREATE TABLE gallery_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES image_galleries(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_id, setting_key)
);
```

### 1.2 Configuração do Supabase Storage

#### Bucket: `gallery-images`
```sql
-- Política de acesso público para leitura
CREATE POLICY "Public read access for gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

-- Política de acesso para upload (apenas usuários autenticados)
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- Política de acesso para atualização (apenas usuários autenticados)
CREATE POLICY "Authenticated users can update gallery images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- Política de acesso para exclusão (apenas usuários autenticados)
CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);
```

### 1.3 Índices para Performance
```sql
-- Índices para otimização
CREATE INDEX idx_gallery_images_gallery_id ON gallery_images(gallery_id);
CREATE INDEX idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX idx_image_galleries_active ON image_galleries(is_active);
```

## Fase 2: Componentes Frontend (Prioridade Alta)

### 2.1 Estrutura de Arquivos
```
src/
├── components/
│   ├── gallery/
│   │   ├── ImageGallery.js          # Componente principal da galeria
│   │   ├── ImageGrid.js             # Grade de miniaturas
│   │   ├── ImageModal.js            # Modal de visualização ampliada
│   │   ├── ImageNavigation.js       # Botões de navegação
│   │   ├── ImageCaption.js          # Exibição de legendas
│   │   └── GalleryText.js           # Texto principal da galeria
│   ├── admin/
│   │   ├── GalleryAdminPanel.js     # Painel administrativo da galeria
│   │   ├── GalleryEditor.js         # Editor de galeria
│   │   ├── ImageUploader.js         # Upload de imagens
│   │   ├── ImageManager.js          # Gerenciamento de imagens
│   │   └── GallerySettings.js       # Configurações da galeria
│   └── ui/
│       ├── Modal.js                 # Modal reutilizável
│       ├── Button.js                # Botão reutilizável
│       └── LoadingSpinner.js        # Spinner de carregamento
├── hooks/
│   ├── useGallery.js                # Hook para gerenciar galeria
│   ├── useImageUpload.js            # Hook para upload de imagens
│   └── useImageNavigation.js        # Hook para navegação
├── services/
│   ├── galleryService.js            # Serviços da galeria
│   └── imageService.js              # Serviços de imagem
└── utils/
    ├── imageUtils.js                # Utilitários para imagens
    └── galleryUtils.js              # Utilitários da galeria
```

### 2.2 Componente Principal da Galeria

#### ImageGallery.js
```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ImageGrid from './ImageGrid';
import ImageModal from './ImageModal';
import GalleryText from './GalleryText';

const ImageGallery = ({ galleryId, className = '' }) => {
  const [gallery, setGallery] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGalleryData();
  }, [galleryId]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados da galeria
      const { data: galleryData, error: galleryError } = await supabase
        .from('image_galleries')
        .select('*')
        .eq('id', galleryId)
        .eq('is_active', true)
        .single();

      if (galleryError) throw galleryError;

      // Buscar imagens da galeria
      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', galleryId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (imagesError) throw imagesError;

      setGallery(galleryData);
      setImages(imagesData);
    } catch (err) {
      console.error('Erro ao carregar galeria:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Erro ao carregar galeria: {error}</p>
      </div>
    );
  }

  if (!gallery || images.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <p>Nenhuma imagem encontrada nesta galeria.</p>
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
        />
      )}
    </div>
  );
};

export default ImageGallery;
```

### 2.3 Componente de Grade de Imagens

#### ImageGrid.js
```javascript
import React from 'react';
import { motion } from 'framer-motion';

const ImageGrid = ({ images, onImageClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.map((image, index) => (
        <motion.div
          key={image.id}
          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg"
          onClick={() => onImageClick(index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <img
            src={image.image_url}
            alt={image.alt_text || image.caption || 'Imagem da galeria'}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay com legenda */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
            <div className="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-sm font-medium truncate">
                {image.caption || 'Sem legenda'}
              </p>
            </div>
          </div>
          
          {/* Ícone de zoom */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white bg-opacity-80 rounded-full p-2">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageGrid;
```

### 2.4 Modal de Visualização Ampliada

#### ImageModal.js
```javascript
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageNavigation from './ImageNavigation';
import ImageCaption from './ImageCaption';

const ImageModal = ({ 
  images, 
  selectedIndex, 
  onClose, 
  onPrevious, 
  onNext 
}) => {
  const currentImage = images[selectedIndex];

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevious, onNext]);

  if (!currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-7xl max-h-[90vh] w-full mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Imagem principal */}
          <div className="relative">
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || currentImage.caption || 'Imagem da galeria'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            
            {/* Navegação */}
            <ImageNavigation
              onPrevious={onPrevious}
              onNext={onNext}
              currentIndex={selectedIndex}
              totalImages={images.length}
            />
          </div>

          {/* Legenda */}
          <ImageCaption
            caption={currentImage.caption}
            altText={currentImage.alt_text}
            imageIndex={selectedIndex + 1}
            totalImages={images.length}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
```

### 2.5 Componente de Navegação

#### ImageNavigation.js
```javascript
import React from 'react';
import { motion } from 'framer-motion';

const ImageNavigation = ({ onPrevious, onNext, currentIndex, totalImages }) => {
  return (
    <>
      {/* Botão Anterior */}
      <motion.button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Botão Próximo */}
      <motion.button
        onClick={onNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 text-white transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* Contador de imagens */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {totalImages}
      </div>
    </>
  );
};

export default ImageNavigation;
```

## Fase 3: Painel Administrativo (Prioridade Alta)

### 3.1 Painel Principal de Administração

#### GalleryAdminPanel.js
```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
      const { data, error } = await supabase
        .from('image_galleries')
        .select('*')
        .order('created_at', { ascending: false });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('galleries')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'galleries'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Galerias
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nova Galeria
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {gallery.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {gallery.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        gallery.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {gallery.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditGallery(gallery)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGallery(gallery);
                            setActiveTab('images');
                          }}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Imagens
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
```

### 3.2 Editor de Galeria

#### GalleryEditor.js
```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
        const { error } = await supabase
          .from('image_galleries')
          .update({
            title: formData.title,
            description: formData.description,
            main_text: formData.main_text,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', gallery.id);

        if (error) throw error;
      } else {
        // Criar nova galeria
        const { error } = await supabase
          .from('image_galleries')
          .insert([{
            title: formData.title,
            description: formData.description,
            main_text: formData.main_text,
            is_active: formData.is_active
          }]);

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

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {gallery ? 'Editar Galeria' : 'Nova Galeria'}
      </h2>

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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite uma descrição breve da galeria"
          />
        </div>

        {/* Texto Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto Principal
          </label>
          <div className="border border-gray-300 rounded-lg min-h-[300px]">
            {editor && (
              <div className="p-4">
                <div className="border-b border-gray-200 pb-2 mb-4">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                      }`}
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                      }`}
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className={`px-3 py-1 rounded text-sm ${
                        editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
                      }`}
                    >
                      • Lista
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  {editor && <editor.Content />}
                </div>
              </div>
            )}
          </div>
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
            Galeria ativa
          </label>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Galeria'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryEditor;
```

## Fase 4: Upload e Gerenciamento de Imagens (Prioridade Alta)

### 4.1 Componente de Upload

#### ImageUploader.js
```javascript
import React, { useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ galleryId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery-${galleryId}/${fileName}`;

        // Upload para Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(filePath);

        // Salvar metadados no banco
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert([{
            gallery_id: galleryId,
            image_url: publicUrl,
            image_path: filePath,
            alt_text: file.name,
            display_order: i
          }]);

        if (dbError) throw dbError;

        setUploadProgress(((i + 1) / acceptedFiles.length) * 100);
      }

      onUploadComplete && onUploadComplete();
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [galleryId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragActive
                ? 'Solte as imagens aqui...'
                : 'Arraste imagens ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP até 10MB cada
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Fazendo upload...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
```

### 4.2 Gerenciador de Imagens

#### ImageManager.js
```javascript
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ImageUploader from './ImageUploader';

const ImageManager = ({ gallery, onBack }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, [gallery.id]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', gallery.id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error('Erro ao carregar imagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (imageId, updates) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      ));
      setEditingImage(null);
    } catch (err) {
      console.error('Erro ao atualizar imagem:', err);
      alert('Erro ao atualizar imagem');
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      // Buscar dados da imagem para deletar do storage
      const image = images.find(img => img.id === imageId);
      
      // Deletar do storage
      if (image?.image_path) {
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove([image.image_path]);

        if (storageError) console.warn('Erro ao deletar do storage:', storageError);
      }

      // Deletar do banco
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      alert('Erro ao deletar imagem');
    }
  };

  const handleReorder = async (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Atualizar display_order
    const updates = newImages.map((img, index) => ({
      id: img.id,
      display_order: index
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('gallery_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setImages(newImages);
    } catch (err) {
      console.error('Erro ao reordenar imagens:', err);
      alert('Erro ao reordenar imagens');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          className="text-gray-600 hover:text-gray-800"
        >
          ← Voltar
        </button>
      </div>

      {/* Upload de Imagens */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Adicionar Imagens
        </h3>
        <ImageUploader
          galleryId={gallery.id}
          onUploadComplete={fetchImages}
        />
      </div>

      {/* Lista de Imagens */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800">
          Imagens da Galeria
        </h3>
        
        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma imagem adicionada ainda.</p>
            <p className="text-sm">Use o upload acima para adicionar imagens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={image.id} className="border rounded-lg p-4">
                <div className="relative mb-3">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Imagem da galeria'}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Legenda
                    </label>
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => {
                        setImages(prev => prev.map(img => 
                          img.id === image.id ? { ...img, caption: e.target.value } : img
                        ));
                      }}
                      onBlur={() => handleImageUpdate(image.id, { caption: image.caption })}
                      className="w-full text-sm p-2 border rounded"
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
                        setImages(prev => prev.map(img => 
                          img.id === image.id ? { ...img, alt_text: e.target.value } : img
                        ));
                      }}
                      onBlur={() => handleImageUpdate(image.id, { alt_text: image.alt_text })}
                      className="w-full text-sm p-2 border rounded"
                      placeholder="Texto para acessibilidade..."
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => index > 0 && handleReorder(index, index - 1)}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Mover para cima"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => index < images.length - 1 && handleReorder(index, index + 1)}
                        disabled={index === images.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Mover para baixo"
                      >
                        ↓
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleImageDelete(image.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
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
```

## Fase 5: Integração com o Sistema Existente (Prioridade Média)

### 5.1 Modificar AdminPanel.js

```javascript
// Adicionar nova aba para galerias no AdminPanel existente
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('locations');
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ... código existente ... */}
      
      {/* Adicionar nova tab */}
      <button
        onClick={() => setActiveTab('galleries')}
        className={`py-4 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'galleries'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        Galerias de Imagens
      </button>
      
      {/* ... resto do código ... */}
      
      {activeTab === 'galleries' && (
        <GalleryAdminPanel />
      )}
    </div>
  );
};
```

### 5.2 Adicionar Rota para Galeria

```javascript
// Em App.js, adicionar nova rota
<Route 
  path="/galeria/:galleryId" 
  element={<ImageGallery galleryId={galleryId} />} 
/>
```

## Fase 6: Dependências e Instalação (Prioridade Alta)

### 6.1 Novas Dependências Necessárias

```json
{
  "dependencies": {
    "react-dropzone": "^14.2.3",
    "react-sortable-hoc": "^2.0.0",
    "react-beautiful-dnd": "^13.1.1"
  }
}
```

### 6.2 Scripts de Instalação

```bash
npm install react-dropzone react-sortable-hoc react-beautiful-dnd
```

## Fase 7: Funcionalidades Avançadas (Prioridade Baixa)

### 7.1 Recursos Adicionais
- **Lazy Loading**: Carregamento sob demanda das imagens
- **Compressão Automática**: Redução automática do tamanho das imagens
- **Filtros e Busca**: Filtros por data, tipo, etc.
- **Exportação**: Exportar galeria como PDF ou ZIP
- **Compartilhamento**: Links de compartilhamento para galerias específicas
- **Analytics**: Estatísticas de visualização das imagens

### 7.2 Otimizações de Performance
- **Image Optimization**: WebP automático com fallback
- **CDN Integration**: Integração com CDN para entrega global
- **Caching**: Cache inteligente de imagens
- **Progressive Loading**: Carregamento progressivo de imagens

## Cronograma de Implementação

### Semana 1: Base e Supabase
- [ ] Criar esquema do banco de dados
- [ ] Configurar Supabase Storage
- [ ] Implementar serviços básicos
- [ ] Testar conexão e CRUD

### Semana 2: Componentes Frontend
- [ ] Implementar ImageGallery principal
- [ ] Criar ImageGrid e ImageModal
- [ ] Implementar navegação por teclado
- [ ] Adicionar animações com Framer Motion

### Semana 3: Painel Administrativo
- [ ] Implementar GalleryAdminPanel
- [ ] Criar GalleryEditor com Tiptap
- [ ] Implementar ImageUploader
- [ ] Criar ImageManager

### Semana 4: Integração e Testes
- [ ] Integrar com AdminPanel existente
- [ ] Adicionar rotas e navegação
- [ ] Testes de funcionalidade
- [ ] Ajustes de responsividade

### Semana 5: Refinamentos
- [ ] Otimizações de performance
- [ ] Melhorias de UX/UI
- [ ] Testes de acessibilidade
- [ ] Documentação

## Métricas de Sucesso

### Funcionalidade
- [ ] Galeria exibe imagens em grade responsiva
- [ ] Modal de visualização com navegação funcional
- [ ] Upload de imagens para Supabase Storage
- [ ] Edição de legendas e texto principal
- [ ] Painel administrativo completo

### Performance
- [ ] Carregamento inicial < 3s
- [ ] Navegação entre imagens < 500ms
- [ ] Upload de imagens com progresso visual
- [ ] Responsividade em todos os dispositivos

### Usabilidade
- [ ] Interface intuitiva para administradores
- [ ] Navegação por teclado funcional
- [ ] Feedback visual adequado
- [ ] Mensagens de erro claras

### Segurança
- [ ] Validação de tipos de arquivo
- [ ] Controle de acesso administrativo
- [ ] Sanitização de dados
- [ ] Políticas de storage adequadas

## Considerações Técnicas

### Limitações do Supabase Storage
- Tamanho máximo por arquivo: 50MB
- Tipos de arquivo suportados: configuráveis
- Políticas de acesso: baseadas em autenticação

### Otimizações Recomendadas
- Implementar compressão de imagens no frontend
- Usar lazy loading para imagens fora da viewport
- Cache de metadados no localStorage
- Paginação para galerias com muitas imagens

### Acessibilidade
- Suporte completo a screen readers
- Navegação por teclado em todos os componentes
- Textos alternativos para todas as imagens
- Contraste adequado em todos os elementos

Este plano garante uma implementação robusta e escalável da galeria de imagens interativa, mantendo a compatibilidade com o sistema existente e proporcionando uma experiência rica tanto para administradores quanto para usuários finais.