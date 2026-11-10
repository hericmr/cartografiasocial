import { useState, useRef, useEffect } from "react";

const useAudio = (audioUrl) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("ended", () => setIsAudioEnabled(false));
    }

    if (isAudioEnabled) {
      audioRef.current.pause();
      setIsAudioEnabled(false);
    } else {
      audioRef.current.play()
        .then(() => setIsAudioEnabled(true))
        .catch((error) => console.error("Erro ao reproduzir áudio:", error));
    }
  };

  // Troca de ponto: para o áudio anterior
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsAudioEnabled(false);
    };
  }, [audioUrl]);

  return { isAudioEnabled, toggleAudio };
};

export default useAudio;
