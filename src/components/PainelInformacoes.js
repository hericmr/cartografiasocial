import React, { useRef, useState, memo } from "react";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import PainelContainer from "./PainelContainer";
import IntroPanel from "./IntroPanel";
import useAudio from "./hooks/useAudio";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";
import { useShare } from "./hooks/useShare";
import { useDynamicURL } from "./hooks/useDynamicURL";
import { useClickOutside } from "./hooks/useClickOutside";

// Componentes internos modularizados
const PainelMediaContent = memo(({ imagens, video, titulo, audioUrl, descricao_detalhada, links, useSplitLayout }) => {
  // When using split layout, hide inline media (it's shown in sidebar)
  if (useSplitLayout) {
    return (
      <div className="space-y-6">
        <PainelDescricao descricao={descricao_detalhada} />
        {links?.length > 0 && <PainelLinks links={links} />}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PainelMedia
        imagens={imagens}
        video={video}
        titulo={titulo}
        audioUrl={audioUrl}
      />
      <PainelDescricao descricao={descricao_detalhada} />
      {links?.length > 0 && <PainelLinks links={links} />}
    </div>
  );
});

const ShareSection = memo(({ copiarLink, compartilhar }) => (
  <div className="mt-8 flex justify-center space-x-4">
    <ShareButton onClick={copiarLink} onShare={compartilhar} />
  </div>
));

const PainelInformacoes = ({ painelInfo, closePainel, refreshKey = 0 }) => {
  const painelRef = useRef(null);
  const contentRef = useRef(null);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);
  const { gerarLinkCustomizado, copiarLink, compartilhar } = useShare(painelInfo);
  
  // Persistir estado de maximização entre aberturas
  const [isMaximized, setIsMaximized] = useState(() => {
    try {
      const stored = localStorage.getItem('cartografiasocial:painelIsMaximized');
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    } catch {}
    return false; // padrão: não maximizado
  });
  
  const toggleMaximize = () => {
    setIsMaximized(prev => {
      const next = !prev;
      try { localStorage.setItem('cartografiasocial:painelIsMaximized', String(next)); } catch {}
      return next;
    });
  };
  
  // Hooks customizados
  useDynamicURL(painelInfo, gerarLinkCustomizado);
  useClickOutside(painelRef, () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    closePainel();
  });

  if (!painelInfo) return null;

  const renderContent = (layoutInfo = {}) => {
    const { useSplitLayout = false } = layoutInfo;

    // Check if this is an intro panel (welcome content)
    const isIntro = painelInfo.tipo === 'intro' || painelInfo.titulo === 'Sobre o site';

    if (isIntro) {
      return <IntroPanel painelInfo={painelInfo} />;
    }

    return (
      <div className="relative">
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
        
        <PainelMediaContent
          imagens={painelInfo.imagens}
          video={painelInfo.video}
          titulo={painelInfo.titulo}
          audioUrl={painelInfo.audioUrl}
          descricao_detalhada={painelInfo.descricao_detalhada}
          links={painelInfo.links}
          useSplitLayout={useSplitLayout}
        />
        
        <ShareSection copiarLink={copiarLink} compartilhar={compartilhar} />
      </div>
    );
  };

  // Generate share URL
  const shareUrl = painelInfo ? gerarLinkCustomizado() : '';

  return (
    <div ref={painelRef}>
      <PainelContainer
        painelInfo={painelInfo}
        closePainel={closePainel}
        isMaximized={isMaximized}
        onToggleMaximize={toggleMaximize}
        contentRef={contentRef}
        refreshKey={refreshKey}
        shareUrl={shareUrl}
        shareTitle={painelInfo?.titulo}
      >
        {(layoutInfo) => renderContent(layoutInfo)}
      </PainelContainer>
    </div>
  );
};

export default memo(PainelInformacoes);