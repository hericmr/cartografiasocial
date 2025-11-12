import React from 'react';
import { Info as InfoIcon } from 'lucide-react';
import InputField from '../../AddLocationPanel/components/InputField';
import RichTextEditor from '../../AddLocationPanel/components/RichTextEditor';
import { opcoes } from '../../AddLocationPanel/constants';

const IconComponent = ({ color, size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size}
    className="flex-shrink-0"
  >
    <path 
      fill={color} 
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
    />
    <circle cx="12" cy="9" r="3" fill="white" />
  </svg>
);

const iconColorMap = {
  assistencia: "#4CAF50",
  lazer: "#2196F3", 
  historico: "#FFC107",
  comunidades: "#F44336",
  educação: "#9C27B0",
  religiao: "#212121",
  bairro: "#FF5722"
};

const InfoTab = ({ 
  editedLocation, 
  setEditedLocation, 
  dropdownOpen, 
  setDropdownOpen, 
  handleTipoChange, 
  errors 
}) => {
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <InputField
          label="Título"
          id="titulo"
          type="text"
          value={typeof editedLocation.titulo === 'string' ? editedLocation.titulo : ""}
          onChange={(e) => {
            const value = e.target.value;
            setEditedLocation((prev) => ({
              ...prev,
              titulo: typeof value === 'string' ? value : String(value),
            }));
          }}
          placeholder="Ex: Albergue Noturno"
          error={errors.titulo ? String(errors.titulo) : undefined}
          required
        />
      </div>

      {/* Tipo de Marcador */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Marcador <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between text-gray-800 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <span>
              {(() => {
                if (typeof editedLocation.tipo !== 'string') {
                  return "Selecione o tipo de marcador";
                }
                const opcaoSelecionada = opcoes.find(opcao => opcao.value === editedLocation.tipo);
                return opcaoSelecionada ? opcaoSelecionada.label : editedLocation.tipo;
              })()}
            </span>
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
              {opcoes.map((opcao, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTipoChange(opcao.value)}
                  className={`w-full text-left p-3 hover:bg-gray-50 flex items-center text-gray-800 border-b border-gray-100 last:border-b-0`}
                >
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <IconComponent color={iconColorMap[opcao.value] || "#666"} size={24} />
                  </div>
                  <span className="font-medium">{opcao.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {errors.tipo && <p className="text-red-500 text-sm mt-1">{String(errors.tipo)}</p>}
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={editedLocation.descricao_detalhada || ""}
          onChange={(value) => setEditedLocation(prev => ({ ...prev, descricao_detalhada: value }))}
          error={errors.descricao_detalhada}
        />
      </div>
    </div>
  );
};

export default InfoTab;

