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
        <svg xmlns="http://www.w3.org/2000/svg" fill={config.color} viewBox="0 0 256 256" className="w-full h-full">
            <rect width="256" height="256" fill="none"></rect>
            <path d="M121.2,157.9a60,60,0,1,0-66.4,0A95.5,95.5,0,0,0,9.5,192.8a7.8,7.8,0,0,0-.6,8.3,8.1,8.1,0,0,0,7.1,4.3H160a8.1,8.1,0,0,0,7.1-4.3,7.8,7.8,0,0,0-.6-8.3A95.5,95.5,0,0,0,121.2,157.9Z"></path>
            <path d="M248.1,192.8a96.3,96.3,0,0,0-45.4-34.9A59.9,59.9,0,0,0,169.5,48a64,64,0,0,0-16.3,2.2,8.2,8.2,0,0,0-5.4,5.2,8,8,0,0,0,1.2,7.3,75.8,75.8,0,0,1,3.8,84.9,8.1,8.1,0,0,0,2.1,10.6q4.5,3.5,8.7,7.2l.5.5a112.6,112.6,0,0,1,25.5,34.9,7.9,7.9,0,0,0,7.2,4.6h44.7a8.1,8.1,0,0,0,7.1-4.3A8,8,0,0,0,248.1,192.8Z"></path>
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