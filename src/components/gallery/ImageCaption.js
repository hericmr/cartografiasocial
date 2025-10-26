import React from 'react';

const ImageCaption = ({ caption, altText, imageIndex, totalImages }) => {
  if (!caption && !altText) return null;

  return (
    <div className="mt-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-500">
          Imagem {imageIndex} de {totalImages}
        </span>
      </div>
      
      {caption && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Legenda
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {caption}
          </p>
        </div>
      )}
      
      {altText && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Texto alternativo:</span> {altText}
        </div>
      )}
    </div>
  );
};

export default ImageCaption;