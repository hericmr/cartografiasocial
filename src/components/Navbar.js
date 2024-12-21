// components/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-600 shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white">
            Cartografia Social de Santos
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="https://portal.unifesp.br/web_imagens/institucional/logoUnifesp.png"
            alt="Logo Unifesp"
            className="h-10 w-auto object-contain"
          />
          <p className="text-xs tracking-wide text-white text-center w-full font-serif">
            Serviço Social
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
