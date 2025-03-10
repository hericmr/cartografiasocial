// components/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-500 animate-gradient-x text-white">
    {/* Container do ícone de carregamento */}
    <div className="relative">
      {/* Spinner animado */}
      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-slow"></div>
      
      {/* Ícone centralizado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/cartografiasocial/favicon.ico" 
          alt="Ícone de carregamento" 
          className="w-12 h-12 animate-bounce-slow" 
        />
      </div>
    </div>

    {/* Texto de carregamento */}
    <p className="mt-6 text-xl font-semibold animate-pulse">
      Carregando dados...
    </p>

    {/* Texto adicional para engajamento */}
    <p className="mt-2 text-sm text-gray-300 animate-fade-in">
      Prepare-se para explorar!
    </p>

    {/* Efeito de partículas (opcional) */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        ></div>
      ))}
    </div>
  </div>
);

export default LoadingScreen;

/* Adicionando animações personalizadas no CSS */
// No arquivo CSS correspondente, adicione:
// .animate-spin-slow {
//   animation: spin 3s linear infinite;
// }
// .animate-bounce-slow {
//   animation: bounce 2s infinite;
// }
// .animate-float {
//   animation: float 4s ease-in-out infinite;
// }
// @keyframes float {
//   0%, 100% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(-20px);
//   }
// }