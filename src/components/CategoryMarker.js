import React from "react";

const CategoryMarker = ({ tipo }) => {
  // Mapeamento de tipos para cores e nomes
  const categoryConfig = {
    assistencia: { 
      color: "#4CAF50", 
      name: "Assistência",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    historico: { 
      color: "#FFC107", 
      name: "Histórico",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    lazer: { 
      color: "#2196F3", 
      name: "Lazer",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    comunidades: { 
      color: "#F44336", 
      name: "Comunidades",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    educação: { 
      color: "#9C27B0", 
      name: "Educação",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    religiao: { 
      color: "#212121", 
      name: "Religião",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700"
    },
    saude: { 
      color: "#00BCD4", 
      name: "Saúde",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700"
    },
    bairro: { 
      color: "#FF9800", 
      name: "Bairro",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    }
  };

  const config = categoryConfig[tipo?.toLowerCase()] || categoryConfig.assistencia;

  return (
    <div className={`w-full flex items-center gap-2 px-8 py-2 text-sm font-medium ${config.bgColor} ${config.textColor}`}>
      {/* Ícone do marcador igual ao do mapa */}
      <div className="w-4 h-4 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
          <path fill={config.color} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      </div>
      {/* Nome da categoria */}
      <span className="text-xs font-medium tracking-wide">
        {config.name}
      </span>
    </div>
  );
};

export default CategoryMarker;