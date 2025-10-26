import React, { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Save,
  Eye,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const WelcomePanelEditor = ({ onWelcomePanelUpdated }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Desabilitar link do StarterKit para evitar conflito
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    fetchWelcomeConfig();
  }, []);

  const fetchWelcomeConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('welcome_panels')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;

      if (data) {
        setContent(data.content || '');
        setTitle(data.title || '');
        setEnabled(true); // Se existe painel ativo, está habilitado
        
        if (editor) {
          editor.commands.setContent(data.content || '');
        }
      } else {
        // Se não há painel ativo, criar um padrão
        setContent('');
        setTitle('');
        setEnabled(false);
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações do painel');
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (enabled) {
        // Desativar painel atual
        await supabase
          .from('welcome_panels')
          .update({ is_active: false })
          .eq('is_active', true);

        // Criar novo painel
        const { error } = await supabase
          .from('welcome_panels')
          .insert([{
            title: title,
            content: content,
            is_active: true,
            theme: 'default',
            show_close_button: true,
            auto_close_seconds: null,
            display_conditions: {
              first_visit_only: true,
              show_on_mobile: true,
              show_on_desktop: true
            },
            created_by: 'admin'
          }]);

        if (error) throw error;
      } else {
        // Desativar painel atual
        const { error } = await supabase
          .from('welcome_panels')
          .update({ is_active: false })
          .eq('is_active', true);

        if (error) throw error;
      }

      setSuccess('Configurações salvas com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Recarregar configurações
      await fetchWelcomeConfig();
      
      // Notificar o App sobre a atualização
      if (onWelcomePanelUpdated) {
        onWelcomePanelUpdated();
      }
      
      // Disparar evento customizado para notificar outros componentes
      window.dispatchEvent(new CustomEvent('welcomePanelUpdated'));
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    const url = window.prompt('Digite a URL do link:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Digite a URL da imagem:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Editor do Painel de Boas-vindas
        </h2>
        <p className="text-gray-600">
          Personalize o painel de boas-vindas que será exibido aos usuários na primeira visita.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Painel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o título do painel de boas-vindas"
            />
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Painel de boas-vindas ativo
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-lg shadow">
        {/* Toolbar */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bold') ? 'bg-gray-200' : ''
              }`}
              title="Negrito"
            >
              <Bold className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('italic') ? 'bg-gray-200' : ''
              }`}
              title="Itálico"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
              }`}
              title="Título 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
              }`}
              title="Título 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
              }`}
              title="Título 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
              title="Lista com marcadores"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('orderedList') ? 'bg-gray-200' : ''
              }`}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-100 ${
                editor?.isActive('blockquote') ? 'bg-gray-200' : ''
              }`}
              title="Citação"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <button
              onClick={addLink}
              className="p-2 rounded hover:bg-gray-100"
              title="Adicionar link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-100"
              title="Adicionar imagem"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-4">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
          </button>

          <div className="flex space-x-4">
            <button
              onClick={fetchWelcomeConfig}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                console.log('🔄 [EDITOR] Testando atualização do painel...');
                window.dispatchEvent(new CustomEvent('welcomePanelUpdated'));
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Testar Atualização
            </button>
            <button
              onClick={saveContent}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview do Painel</h3>
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title || 'Título do Painel'}</h2>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePanelEditor;