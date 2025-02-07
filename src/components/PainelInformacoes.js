import React, { useRef, useEffect } from "react";
import PainelHeader from "./PainelHeader";
import PainelMedia from "./PainelMedia";
import PainelDescricao from "./PainelDescricao";
import PainelLinks from "./PainelLinks";
import usePainelVisibility from "./usePainelVisibility";
import useAudio from "./useAudio";
import AudioButton from "./AudioButton";
import ShareButton from "./ShareButton";

const PainelInformacoes = ({ painelInfo, closePainel }) => {
  const { isVisible, isMobile } = usePainelVisibility(painelInfo);
  const painelRef = useRef(null);
  const { isAudioEnabled, toggleAudio } = useAudio(painelInfo?.audioUrl);

  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiado!");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (painelRef.current && !painelRef.current.contains(event.target)) {
        closePainel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePainel]);

  if (!painelInfo) return null;

  return (
    <div
      ref={painelRef}
      role="dialog"
      aria-labelledby="painel-titulo"
      aria-describedby="painel-descricao"
      className={`fixed top-20 right-2 left-2 sm:left-auto sm:w-3/4 lg:w-[49%] bg-green-50 rounded-xl shadow-lg z-30 transform transition-transform duration-700 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        maxHeight: isMobile ? "89vh" : "90vh",
        height: "auto",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PainelHeader titulo={painelInfo.titulo} closePainel={closePainel} />
      <div className="p-6 overflow-y-auto flex-1">
        {painelInfo.audioUrl && (
          <AudioButton isAudioEnabled={isAudioEnabled} toggleAudio={toggleAudio} />
        )}

        <PainelMedia
          imagens={painelInfo.imagens}
          video={painelInfo.video}
          titulo={painelInfo.titulo}
        />
        <PainelDescricao descricao={painelInfo.descricao} />
        <PainelLinks links={painelInfo.links || []} />

        <div className="mt-4 text-center">
          <ShareButton onClick={copiarLink} />
        </div>
      </div>
    </div>
  );
};

export default PainelInformacoes;