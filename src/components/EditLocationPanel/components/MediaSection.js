import React from 'react';
import { Upload, X } from 'lucide-react';

const MediaSection = ({ 
  mediaState, 
  handleImageSelect, 
  handleUploadImages, 
  removeImage 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Mídia</h3>
      
      {/* Imagens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-700">Imagens</h4>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Adicionar Imagens</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>
            {mediaState.selectedImages.length > 0 && (
              <button
                type="button"
                onClick={handleUploadImages}
                disabled={mediaState.uploadingImages}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
              >
                {mediaState.uploadingImages ? "Enviando..." : "Enviar Imagens"}
              </button>
            )}
          </div>
        </div>

        {/* Grid de imagens existentes */}
        {mediaState.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaState.imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {mediaState.uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{mediaState.uploadError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaSection;