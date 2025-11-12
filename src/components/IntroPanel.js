import React, { memo } from 'react';
import PainelDescricao from './PainelDescricao';
import AudioButton from './AudioButton';
import useAudio from './hooks/useAudio';

const IntroPanel = memo(({ painelInfo }) => {
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  
  return (
    <div className="space-y-6">
      {painelInfo.audioUrl && typeof painelInfo.audioUrl === 'string' && painelInfo.audioUrl.trim() !== "" && (
        <div className="flex justify-end -mt-2 mb-4">
          <AudioButton 
            isAudioEnabled={isAudioEnabled} 
            toggleAudio={toggleAudio} 
            aria-label={isAudioEnabled ? "Desativar áudio" : "Ativar áudio"}
            className="hover:bg-green-100/50 transition-colors duration-200"
          />
        </div>
      )}
      <div className="prose prose-lg lg:prose-xl max-w-none">
        <div className="bg-green-100 rounded-lg p-6">
          <PainelDescricao descricao={painelInfo.descricao_detalhada} />
        </div>
      </div>
      {painelInfo.audioUrl && (
        <div className="mt-6">
          <audio controls className="w-full">
            <source src={painelInfo.audioUrl} type="audio/mpeg" />
            Seu navegador não suporta o elemento de áudio.
          </audio>
        </div>
      )}
    </div>
  );
});

export default IntroPanel;


