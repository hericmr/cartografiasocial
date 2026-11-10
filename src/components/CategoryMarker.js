import React from "react";
import { getCategoria } from "./categorias";

const CategoryMarker = ({ tipo }) => {
  const { nome, cor } = getCategoria(tipo);

  return (
    <div className="flex items-center gap-2 px-4 sm:px-6 lg:px-8 pb-3 text-sm font-semibold text-gray-600">
      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cor }} aria-hidden="true" />
      <span className="uppercase tracking-wide text-xs">{nome}</span>
    </div>
  );
};

export default CategoryMarker;
