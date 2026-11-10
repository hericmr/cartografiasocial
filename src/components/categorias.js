// Fonte única de categorias: cor do marcador, nome exibido e camada do menu que a controla
export const CATEGORIAS = {
  assistencia: { nome: "Assistência", cor: "#16a34a", camada: "assistencia" },
  saude: { nome: "Saúde", cor: "#0891b2", camada: "saude" },
  historico: { nome: "Histórico", cor: "#ca8a04", camada: "historicos" },
  lazer: { nome: "Lazer e cultura", cor: "#2563eb", camada: "culturais" },
  comunidades: { nome: "Comunidades", cor: "#dc2626", camada: "comunidades" },
  educacao: { nome: "Educação", cor: "#7c3aed", camada: "educação" },
  religiao: { nome: "Religião", cor: "#475569", camada: "religiao" },
  bairro: { nome: "Bairro", cor: "#ea580c", camada: "bairrosLaranja" },
};

// Os tipos no banco eram texto livre; normaliza as variações para uma categoria
const TIPO_PARA_CATEGORIA = {
  assistencia: "assistencia",
  saude: "saude",
  historico: "historico",
  "patrimonio historico": "historico",
  "marco historico": "historico",
  "historico / fonte": "historico",
  fortificacao: "historico",
  engenharia: "historico",
  comunidades: "comunidades",
  ilha: "comunidades",
  educacao: "educacao",
  religiao: "religiao",
  religioso: "religiao",
  igreja: "religiao",
  bairro: "bairro",
};

export const normalizar = (texto) =>
  (texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export const getCategoria = (tipo) => {
  const chave = TIPO_PARA_CATEGORIA[normalizar(tipo)] || "lazer";
  return { chave, ...CATEGORIAS[chave] };
};
