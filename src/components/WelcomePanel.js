import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const WelcomePanel = ({ isVisible, onClose, config }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const images = config?.images || [];

  const prevImage = useCallback(() => {
    setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Teclado: Esc fecha o visualizador (ou o painel); setas navegam entre imagens
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (event) => {
      if (selectedIndex === null) {
        if (event.key === 'Escape') onClose();
        return;
      }
      if (event.key === 'Escape') setSelectedIndex(null);
      else if (event.key === 'ArrowLeft') prevImage();
      else if (event.key === 'ArrowRight') nextImage();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, selectedIndex, onClose, prevImage, nextImage]);

  if (!isVisible || !config) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 0 && (
          <div className="relative h-48 sm:h-72 overflow-hidden rounded-t-2xl">
            <img src={images[0]} alt="Turma de Serviço Social da UNIFESP" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-950/30 to-transparent" />
            <h2
              id="welcome-title"
              className="absolute bottom-4 left-5 right-16 text-white text-2xl sm:text-4xl font-bold leading-tight drop-shadow"
            >
              Cartografia Social de Santos
            </h2>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-8 space-y-6">
          {config.audioUrl && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-semibold text-green-900 mb-2">Ouça a apresentação do projeto</p>
              <audio controls preload="none" className="w-full">
                <source src={config.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}

          <div
            className="prose prose-green max-w-none text-gray-700 leading-relaxed prose-li:my-0.5 prose-ul:my-3 prose-p:my-3"
            dangerouslySetInnerHTML={{ __html: config.content }}
          />

          {images.length > 1 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fotos da turma</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.slice(1).map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedIndex(index + 1)}
                    className="aspect-square overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                    aria-label={`Ampliar foto ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 transition-colors font-semibold shadow"
            >
              Explorar o mapa
            </button>
          </div>
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIndex(null);
          }}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            aria-label="Fechar foto (Esc)"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-2 sm:left-6 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <img
            src={images[selectedIndex]}
            alt={`Foto ${selectedIndex + 1} de ${images.length}`}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-2 sm:right-6 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePanel;
