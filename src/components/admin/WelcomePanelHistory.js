import React, { useState, useEffect } from 'react';
import { 
  History, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Calendar,
  User,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const WelcomePanelHistory = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchPanels();
  }, []);

  const fetchPanels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('welcome_panels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPanels(data || []);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico de painéis');
    } finally {
      setLoading(false);
    }
  };

  const activatePanel = async (panelId) => {
    try {
      // Desativar painel atual
      await supabase
        .from('welcome_panels')
        .update({ is_active: false })
        .eq('is_active', true);

      // Ativar painel selecionado
      const { error } = await supabase
        .from('welcome_panels')
        .update({ is_active: true })
        .eq('id', panelId);

      if (error) throw error;

      // Recarregar lista
      await fetchPanels();
    } catch (err) {
      console.error('Erro ao ativar painel:', err);
      setError('Erro ao ativar painel');
    }
  };

  const deletePanel = async (panelId) => {
    if (!window.confirm('Tem certeza que deseja excluir este painel?')) return;

    try {
      const { error } = await supabase
        .from('welcome_panels')
        .delete()
        .eq('id', panelId);

      if (error) throw error;

      // Recarregar lista
      await fetchPanels();
    } catch (err) {
      console.error('Erro ao excluir painel:', err);
      setError('Erro ao excluir painel');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return '';
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <History className="w-6 h-6 mr-2" />
              Histórico de Painéis
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie versões anteriores e ative painéis específicos
            </p>
          </div>
          <button
            onClick={fetchPanels}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Panels List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {panels.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum painel encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conteúdo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versão
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {panels.map((panel) => (
                  <tr key={panel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {panel.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="w-3 h-3 mr-1" />
                          Inativo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {panel.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs">
                        {truncateContent(panel.content)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(panel.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        v{panel.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPanel(panel);
                            setShowPreview(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {!panel.is_active && (
                          <button
                            onClick={() => activatePanel(panel.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Ativar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deletePanel(panel.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Preview: {selectedPanel.title}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedPanel.content }} />
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <p><strong>Criado em:</strong> {formatDate(selectedPanel.created_at)}</p>
                <p><strong>Versão:</strong> {selectedPanel.version}</p>
                <p><strong>Status:</strong> {selectedPanel.is_active ? 'Ativo' : 'Inativo'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePanelHistory;