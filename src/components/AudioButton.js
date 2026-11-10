import React from "react";
import { Volume2, VolumeX } from "lucide-react";

const AudioButton = ({ isAudioEnabled, toggleAudio }) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={toggleAudio}
        className="flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        aria-label={isAudioEnabled ? "Parar áudio" : "Ouvir áudio"}
        aria-live="polite"
      >
        {isAudioEnabled ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <span>{isAudioEnabled ? "Parar áudio" : "Ouvir áudio"}</span>
      </button>
    </div>
  );
};

export default AudioButton;