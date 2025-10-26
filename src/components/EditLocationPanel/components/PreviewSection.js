import React from 'react';
import { Eye, Type, MapPin, Star, Link as LinkIcon } from 'lucide-react';

const PreviewSection = ({ 
  editedLocation, 
  mediaState, 
  showPreview, 
  setShowPreview 
}) => {
  const calculateScore = () => {
    let pontuacao = 0;
    if (editedLocation.titulo && editedLocation.titulo !== "Título não disponível") pontuacao += 15;
    if (editedLocation.descricao_detalhada && editedLocation.descricao_detalhada.length > 100) pontuacao += 25;
    if (editedLocation.imagens && editedLocation.imagens.length > 0) pontuacao += 15;
    if (editedLocation.audio) pontuacao += 15;
    if (editedLocation.links && editedLocation.links.length > 0) pontuacao += 15;
    if (editedLocation.video) pontuacao += 15;
    return Math.round((pontuacao / 100) * 100);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Preview do Local</h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
        </button>
      </div>
      
      {showPreview && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="space-y-4">
            {/* Header do Preview */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {editedLocation.titulo || 'Título do Local'}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Type className="w-4 h-4 mr-1" />
                    <span className="capitalize">{editedLocation.tipo || 'Tipo não definido'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {editedLocation.latitude && editedLocation.longitude 
                        ? `${parseFloat(editedLocation.latitude).toFixed(4)}, ${parseFloat(editedLocation.longitude).toFixed(4)}`
                        : 'Localização não definida'
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5" />
                <span className="ml-1 text-sm font-medium">
                  {calculateScore()}%
                </span>
              </div>
            </div>

            {/* Descrição */}
            {editedLocation.descricao_detalhada && (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: editedLocation.descricao_detalhada }} />
              </div>
            )}

            {/* Links */}
            {editedLocation.links && (
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                <a 
                  href={editedLocation.links} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  {editedLocation.links}
                </a>
              </div>
            )}

            {/* Imagens Preview */}
            {mediaState.imageUrls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Imagens ({mediaState.imageUrls.length})</h4>
                <div className="grid grid-cols-3 gap-2">
                  {mediaState.imageUrls.slice(0, 6).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                  {mediaState.imageUrls.length > 6 && (
                    <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                      +{mediaState.imageUrls.length - 6} mais
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Áudio Preview */}
            {editedLocation.audio && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Áudio disponível</p>
                  <p className="text-xs text-gray-600">Clique para reproduzir</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;