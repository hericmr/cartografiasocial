import React, { useState, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarMediaViewer = ({ imagens = [], scrollProgress = 0 }) => {
  const [current, setCurrent] = useState(0);
  const [manualOverrideUntil, setManualOverrideUntil] = useState(0);
  const [imageAspectRatios, setImageAspectRatios] = useState(new Map());

  const hasItems = imagens && imagens.length > 0;
  const currentItem = useMemo(() => {
    if (!hasItems || current < 0 || current >= imagens.length) return null;
    return imagens[current] || null;
  }, [imagens, current, hasItems]);
  
  // Detect if current image is tall/narrow (portrait orientation)
  const isTallImage = useMemo(() => {
    if (!currentItem) return false;
    const aspectRatio = imageAspectRatios.get(currentItem);
    // If height > width, it's a tall image (aspect ratio < 1 means portrait)
    return aspectRatio !== undefined && aspectRatio < 1;
  }, [currentItem, imageAspectRatios]);
  
  // Handler to detect image dimensions when image loads
  const handleImageLoad = useCallback((e) => {
    if (!currentItem) return;
    const img = e.target || e.currentTarget;
    if (img && img.naturalWidth && img.naturalHeight) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatios(prev => new Map(prev).set(currentItem, aspectRatio));
    }
  }, [currentItem]);

  // Sync current image to scroll progress
  React.useEffect(() => {
    if (!hasItems || typeof scrollProgress !== 'number') return;
    // If user recently navigated manually, skip syncing from scroll
    if (Date.now() < manualOverrideUntil) return;
    const idx = Math.floor(scrollProgress * Math.max(0, imagens.length - 1));
    if (Number.isFinite(idx) && idx !== current) {
      setCurrent(idx);
    }
  }, [scrollProgress, hasItems, imagens.length, current, manualOverrideUntil]);

  const prev = useCallback(() => {
    if (!hasItems) return;
    setCurrent((idx) => (idx > 0 ? idx - 1 : imagens.length - 1));
    setManualOverrideUntil(Date.now() + 1200);
  }, [hasItems, imagens.length]);

  const next = useCallback(() => {
    if (!hasItems) return;
    setCurrent((idx) => (idx < imagens.length - 1 ? idx + 1 : 0));
    setManualOverrideUntil(Date.now() + 1200);
  }, [hasItems, imagens.length]);

  if (!hasItems) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-600 bg-gray-50">
        <p>Nenhuma imagem disponível.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0">
        {hasItems && imagens.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              onClick={prev}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              onClick={next}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="w-full h-full bg-black/5 overflow-y-auto overflow-x-hidden flex items-start justify-center">
          {currentItem && (
            <img
              src={currentItem}
              alt={`Imagem ${current + 1} de ${imagens.length}`}
              className={isTallImage ? 'w-full object-contain' : 'w-full h-full object-cover'}
              style={{ 
                maxHeight: isTallImage ? 'none' : '100%',
                minHeight: isTallImage ? '100%' : 'auto',
                maxWidth: '100%', 
                display: 'block',
                objectPosition: isTallImage ? 'top center' : 'center center',
                filter: 'saturate(1.3)'
              }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={handleImageLoad}
            />
          )}
        </div>

        {/* Image counter at bottom */}
        {imagens.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center">
            <div
              className="text-white px-3 py-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.88)',
                borderRadius: '8px',
              }}
            >
              <span className="text-sm font-semibold">
                {current + 1} / {imagens.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SidebarMediaViewer);


