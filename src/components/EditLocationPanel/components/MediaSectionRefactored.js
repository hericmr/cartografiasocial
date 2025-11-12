import React from 'react';
import { Upload, X, Image as ImageIcon, Mic, Square, Play, Pause, Loader2 } from 'lucide-react';

const MediaSectionRefactored = ({ 
  mediaState, 
  audioState,
  handleImageSelect, 
  handleUploadImages, 
  removeImage,
  startRecording,
  stopRecording,
  handleAudioPlayback,
  handleUploadAudio
}) => {
  return (
    <div className="space-y-6">
      {/* Imagens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <ImageIcon className="w-4 h-4 inline mr-2" />
          Imagens
        </label>
        
        {/* Preview de imagens existentes */}
        {mediaState.imageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {mediaState.imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remover imagem"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botão de upload */}
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
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300 flex items-center gap-2"
            >
              {mediaState.uploadingImages ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar ({mediaState.selectedImages.length})</span>
              )}
            </button>
          )}
        </div>

        {mediaState.uploadError && (
          <p className="mt-2 text-sm text-red-600">{mediaState.uploadError}</p>
        )}
      </div>

      {/* Áudio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Mic className="w-4 h-4 inline mr-2" />
          Áudio da Descrição
        </label>

        <div className="flex flex-col gap-2">
          {!audioState.isRecording && !audioState.audioBlob && (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              aria-label="Iniciar gravação de áudio"
            >
              <Mic className="w-4 h-4" />
              <span>Gravar Áudio</span>
            </button>
          )}

          {audioState.isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse"
              aria-label="Parar gravação de áudio"
            >
              <Square className="w-4 h-4" />
              <span>Parar Gravação</span>
            </button>
          )}

          {audioState.audioBlob && !audioState.isRecording && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAudioPlayback}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                aria-label={audioState.isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
              >
                {audioState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{audioState.isPlaying ? 'Pausar' : 'Ouvir'}</span>
              </button>

              <button
                type="button"
                onClick={handleUploadAudio}
                disabled={audioState.uploadingAudio}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                aria-label="Salvar áudio"
              >
                {audioState.uploadingAudio ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Salvar Áudio</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaSectionRefactored;

