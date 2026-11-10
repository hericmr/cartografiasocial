import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

// No celular usa o menu nativo de compartilhar; no computador copia o link
const ShareButton = ({ onClick, onShare }) => {
  const [copiado, setCopiado] = useState(false);

  const handleClick = async () => {
    if (navigator.share && onShare) {
      onShare();
      return;
    }
    await onClick();
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-5 py-2.5 bg-green-800 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
      aria-live="polite"
    >
      {copiado ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
      {copiado ? "Link copiado!" : "Compartilhar este lugar"}
    </button>
  );
};

export default ShareButton;
