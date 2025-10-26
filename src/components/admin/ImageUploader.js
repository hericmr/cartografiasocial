import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '../../hooks/useImageUpload';

const ImageUploader = ({ galleryId, onUploadComplete }) => {
  const { uploading, uploadProgress, uploadMultipleImages } = useImageUpload(galleryId);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    try {
      const results = await uploadMultipleImages(acceptedFiles);
      
      // Verificar se houve erros
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.warn('Alguns uploads falharam:', errors);
      }

      // Callback de sucesso
      if (onUploadComplete) {
        onUploadComplete(results);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  }, [galleryId, uploadMultipleImages, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : uploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          {uploading ? (
            <>
              <div className="mx-auto h-12 w-12 text-blue-500">
                <svg className="animate-spin h-12 w-12" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Fazendo upload das imagens...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round(uploadProgress)}% concluído
                </p>
              </div>
            </>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a2 2 0 012.828 0L16 28m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
                  PNG, JPG, GIF, WEBP, SVG até 10MB cada
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progresso do upload</span>
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

      {!uploading && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>💡 Dica: Você pode selecionar múltiplas imagens de uma vez</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;