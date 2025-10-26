import React from 'react';
import InputField from '../../AddLocationPanel/components/InputField';
import { opcoes } from '../../AddLocationPanel/constants';

const BasicInfoSection = ({ 
  editedLocation, 
  setEditedLocation, 
  dropdownOpen, 
  setDropdownOpen, 
  handleTipoChange, 
  errors 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Básicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputField
            label="Título"
            id="titulo"
            type="text"
            value={editedLocation.titulo || ""}
            onChange={(e) =>
              setEditedLocation((prev) => ({
                ...prev,
                titulo: e.target.value,
              }))
            }
            placeholder="Digite o título do local"
            error={errors.titulo}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Marcador <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between text-gray-800 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span>
                {editedLocation.tipo || "Selecione o tipo de marcador"}
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
                    className={`w-full text-left p-3 hover:bg-gray-50 flex items-center ${opcao.cor} text-gray-800 border-b border-gray-100 last:border-b-0`}
                  >
                    {opcao.icone.startsWith("http") ? (
                      <img
                        src={opcao.icone}
                        alt={opcao.label}
                        className="w-6 h-6 mr-3"
                      />
                    ) : (
                      <span className="mr-3 text-lg">{opcao.icone}</span>
                    )}
                    <span className="font-medium">{opcao.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;