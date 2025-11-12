import React, { useEffect, useState } from 'react';
import PainelHeader from './PainelHeader';
import SidebarMediaViewer from './SidebarMediaViewer';
import usePainelVisibility from './hooks/usePainelVisibility';
import { usePainelDimensions } from './hooks/usePainelDimensions';
import './PainelInformacoes.css';

const PainelContainer = ({ 
  painelInfo, 
  closePainel, 
  children,
  isMaximized,
  onToggleMaximize,
  contentRef,
  refreshKey,
  shareUrl,
  shareTitle
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelDimensions = usePainelDimensions(isMobile, isMaximized);
  const isMobileLandscape = painelDimensions.isMobileLandscape;
  const isMobilePortrait = isMobile && !isMobileLandscape;
  const shouldUseDesktopLayout = !isMobilePortrait;
  const useSplitLayout = shouldUseDesktopLayout && (isMaximized || isMobileLandscape);

  if (!painelInfo) return null;

  const baseClasses = `
    fixed
    ${isMobilePortrait
      ? `inset-x-0 top-0 w-full h-full`
      : 'top-0 bottom-0 right-0 w-full sm:w-3/4 lg:w-[49%] h-auto'
    }
    rounded-t-xl shadow-xl z-[9999] transform transition-all duration-500 ease-in-out
    bg-white border-t-4 border-white mj-panel
  `;
  
  const visibilityClasses = isVisible 
    ? isMobile 
      ? "translate-y-0 opacity-100" 
      : "translate-y-0 opacity-100"
    : isMobile 
      ? "translate-y-full opacity-0" 
      : "translate-y-full opacity-0";

  const layoutInfo = {
    isMobile,
    isMobilePortrait,
    isMobileLandscape,
    shouldUseDesktopLayout,
    useSplitLayout
  };

  const content = typeof children === 'function' ? children(layoutInfo) : children;

  // Get images from painelInfo
  const imagens = painelInfo.imagens || [];

  return (
    <div
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      aria-modal="true"
      className={`${baseClasses} ${visibilityClasses}${isMobilePortrait ? ' painel-informacoes-mobile' : ''}${useSplitLayout ? ' mj-maximized' : ''}${useSplitLayout && isMobileLandscape ? ' mj-mobile-landscape' : ''}`}
      style={{
        height: painelDimensions.height,
        maxHeight: painelDimensions.maxHeight,
        width: isMobilePortrait ? '100%' : painelDimensions.width,
        top: 0,
        display: "flex",
        flexDirection: "column",
        position: 'fixed',
        ...(isMobilePortrait && {
          borderRadius: painelDimensions.isMobileLandscape ? '0' : '1rem 1rem 0 0',
          boxShadow: painelDimensions.isMobileLandscape 
            ? '0 0 0 0' 
            : '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
        })
      }}
    >
      <PainelHeader 
        titulo={painelInfo.titulo} 
        tipo={painelInfo.tipo}
        closePainel={closePainel}
        toggleMaximize={onToggleMaximize}
        isMaximized={isMaximized}
        shareUrl={shareUrl}
        shareTitle={shareTitle}
      />
      
      {useSplitLayout ? (
        <div className="flex-1 mj-split">
          <aside className="mj-split-left">
            <SidebarMediaViewer
              imagens={imagens}
              refreshKey={refreshKey || 0}
              scrollProgress={scrollProgress}
            />
          </aside>
          <div
            ref={contentRef}
            className="mj-split-right overflow-y-auto mj-panel-content"
            onScroll={(e) => {
              const el = e.currentTarget;
              const max = el.scrollHeight - el.clientHeight;
              const ratio = max > 0 ? el.scrollTop / max : 0;
              setScrollProgress(Math.min(1, Math.max(0, ratio)));
            }}
          >
            <div className={`${isMobilePortrait ? 'p-3 sm:p-4' : 'p-6'} space-y-4 sm:space-y-5`}>
              <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none mj-prose">
                {content}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div ref={contentRef} className="flex-1 overflow-y-auto mj-panel-content">
          {imagens && imagens.length > 0 && (
            <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 overflow-hidden">
              <img
                src={imagens[0]}
                alt={`${painelInfo.titulo} - Imagem principal`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`${isMobilePortrait ? 'p-3 sm:p-4' : 'p-6'} space-y-4 sm:space-y-5 -mt-2`}>
            <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none mj-prose">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PainelContainer);


