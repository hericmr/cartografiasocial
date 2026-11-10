import React from "react";

const LoadingScreen = ({ message = "Carregando o mapa..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-950 text-white" role="status">
    <div className="w-14 h-14 border-4 border-white/20 border-t-green-400 rounded-full animate-spin" />
    <p className="mt-4 text-base font-semibold text-green-100">{message}</p>
  </div>
);

export default LoadingScreen;
