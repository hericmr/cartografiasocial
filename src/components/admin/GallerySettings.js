import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const GallerySettings = ({ gallery, onSave, onBack }) => {
  const [settings, setSettings] = useState({
    show_captions: true,
    show_numbers: true,
    grid_columns: 4,
    image_spacing: 'medium',
    animation_speed: 'normal'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [gallery.id]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_settings')
        .select('*')
        .eq('gallery_id', gallery.id);

      if (error) throw error;

      // Converter array de configurações em objeto
      const settingsObj = {};
      data.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });

      setSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Converter objeto de configurações em array para salvar
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        gallery_id: gallery.id,
        setting_key: key,
        setting_value: value
      }));

      // Deletar configurações existentes
      await supabase
        .from('gallery_settings')
        .delete()
        .eq('gallery_id', gallery.id);

      // Inserir novas configurações
      const { error } = await supabase
        .from('gallery_settings')
        .insert(settingsArray);

      if (error) throw error;

      onSave();
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Configurações da Galeria
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Personalize a aparência e comportamento da galeria
        </p>
      </div>

      <div className="space-y-6">
        {/* Exibição */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Exibição</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mostrar legendas
                </label>
                <p className="text-xs text-gray-500">
                  Exibir legendas das imagens na grade
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.show_captions}
                onChange={(e) => handleSettingChange('show_captions', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mostrar números
                </label>
                <p className="text-xs text-gray-500">
                  Exibir números nas imagens da grade
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.show_numbers}
                onChange={(e) => handleSettingChange('show_numbers', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Layout</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colunas da grade
              </label>
              <select
                value={settings.grid_columns}
                onChange={(e) => handleSettingChange('grid_columns', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 coluna</option>
                <option value={2}>2 colunas</option>
                <option value={3}>3 colunas</option>
                <option value={4}>4 colunas</option>
                <option value={5}>5 colunas</option>
                <option value={6}>6 colunas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Espaçamento entre imagens
              </label>
              <select
                value={settings.image_spacing}
                onChange={(e) => handleSettingChange('image_spacing', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tight">Apertado</option>
                <option value="medium">Médio</option>
                <option value="loose">Largo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Animações */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Animações</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Velocidade das animações
            </label>
            <select
              value={settings.animation_speed}
              onChange={(e) => handleSettingChange('animation_speed', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="slow">Lenta</option>
              <option value="normal">Normal</option>
              <option value="fast">Rápida</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
};

export default GallerySettings;