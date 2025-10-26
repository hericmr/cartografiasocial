import React from 'react';

const GalleryText = ({ title, description, mainText }) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      {title && (
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
      )}
      
      {description && (
        <p className="text-lg text-gray-600 mb-6">
          {description}
        </p>
      )}
      
      {mainText && (
        <div 
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: mainText }}
        />
      )}
    </div>
  );
};

export default GalleryText;