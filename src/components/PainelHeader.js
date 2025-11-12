import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import CategoryMarker from "./CategoryMarker";

const PainelHeader = ({ titulo, tipo, closePainel, toggleMaximize, isMaximized, shareUrl, shareTitle }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const isMobileLandscape = isMobile && typeof window !== 'undefined' && window.innerWidth > window.innerHeight;

  const shouldUseHalfHeader = isMaximized && (!isMobile || isMobileLandscape);
  const headerHalfClass = shouldUseHalfHeader ? 'mj-header-half-right' : '';
  const headerStyle = shouldUseHalfHeader ? {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    background: '#ffffff',
    borderBottom: '1px solid rgba(5, 150, 105, 0.1)',
    zIndex: 1000
  } : {};
  const containerPaddingClasses = isMobileLandscape
    ? 'px-3 py-2'
    : 'px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-3';
  const innerLayoutClasses = isMobileLandscape
    ? 'flex flex-row items-center justify-between gap-2 pr-2'
    : 'flex flex-col sm:flex-row items-start sm:items-center justify-between pr-12';
  const titleWrapperClasses = isMobileLandscape
    ? 'flex-1 min-w-0'
    : 'space-y-1';
  const titleClassName = isMobileLandscape
    ? 'font-bold text-gray-900 leading-tight tracking-tight break-words text-[clamp(1.05rem,3.4vw,1.6rem)]'
    : 'font-bold text-gray-900 leading-tight tracking-tight break-words text-2xl sm:text-3xl md:text-4xl';

  const renderActions = () => {
    if (isMobileLandscape) {
      return (
        <div className="flex items-center gap-1 ml-2" style={{ zIndex: 1005 }}>
          <button
            onClick={closePainel}
            className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Fechar painel"
            style={{ zIndex: 1005 }}
          >
            <X size={18} aria-hidden="true" className="stroke-2" />
          </button>
        </div>
      );
    }

    return (
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-3" style={{ zIndex: 1005 }}>
        {!isMobile && toggleMaximize && (
          <button
            onClick={toggleMaximize}
            className="p-2 text-green-700 hover:text-green-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={isMaximized ? "Restaurar painel" : "Maximizar painel"}
            title={isMaximized ? "Restaurar" : "Maximizar"}
            style={{ zIndex: 1005 }}
          >
            {isMaximized ? (
              <Minimize2 size={18} className="stroke-2" aria-hidden="true" />
            ) : (
              <Maximize2 size={18} className="stroke-2" aria-hidden="true" />
            )}
          </button>
        )}
        <button
          onClick={closePainel}
          className="p-2 text-gray-700 hover:text-gray-900 hover:bg-green-100 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Fechar painel"
          style={{ zIndex: 1005 }}
        >
          <X 
            size={20} 
            aria-hidden="true"
            className="stroke-2"
          />
        </button>
      </div>
    );
  };

  if (!titulo) return null;

  return (
    <header className={`relative border-b border-green-100 ${isMobileLandscape ? 'min-h-[60px]' : ''}`} style={{ zIndex: 1000, ...headerStyle }}>
      <div className={`${containerPaddingClasses} ${headerHalfClass}`} style={{ position: 'relative', zIndex: 1000 }}>
        <div className={innerLayoutClasses}>
          <div className={titleWrapperClasses} style={{ position: 'relative', zIndex: 1015 }}>
            <h2 
              id="painel-titulo"
              className={titleClassName}
            >
              {titulo}
            </h2>
          </div>

          {isMobileLandscape && renderActions()}
        </div>
      </div>

      {tipo && (
        <div className="px-0">
          <CategoryMarker tipo={tipo} />
        </div>
      )}

      {!isMobileLandscape && renderActions()}
    </header>
  );
};

export default PainelHeader;
