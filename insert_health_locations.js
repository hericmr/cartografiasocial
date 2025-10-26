// Script para inserir os locais de saúde no Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

// Coordenadas reais encontradas nos arquivos de progresso
const realCoordinates = {
  "Policlínica da Alemoa e Chico de Paula": [-23.9309176, -46.3689825],
  "Policlínica Aparecida": [-23.9713854, -46.318503],
  "Policlínica Areia Branca": [-23.9455469, -46.3836439],
  "Policlínica Bom Retiro": [-23.9360414, -46.3808663],
  "Policlínica Campo Grande": [-23.9551514, -46.353748],
  "Policlínica Caneleira": [-23.9404095, -46.3145073],
  "Hospital e Maternidade Municipal Dr. Silvério Fontes": [-23.9433185, -46.3877873]
};

// Coordenadas genéricas para locais sem coordenadas específicas
const santosCoords = {
  centro: [-23.9608, -46.3331],
  zonaNoroeste: [-23.9500, -46.3500],
  centroHistorico: [-23.9600, -46.3300],
  morros: [-23.9700, -46.3400],
  dique: [-23.9400, -46.3600],
  orla: [-23.9700, -46.3200],
  continental: [-23.9200, -46.3800]
};

const healthLocations = [
  // POLICLÍNICAS
  {
    titulo: "Policlínica da Alemoa e Chico de Paula",
    tipo: "saude",
    descricao_detalhada: "R. Afonsina Proost de Souza s/nº, Alemoa. Tel: (13) 3299-7855. E-mail: usf-alemoa@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${realCoordinates["Policlínica da Alemoa e Chico de Paula"][0]},${realCoordinates["Policlínica da Alemoa e Chico de Paula"][1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Aparecida",
    tipo: "saude",
    descricao_detalhada: "Av. Pedro Lessa, 1728. Tel: (13) 3231-6548. E-mail: ubs-aparecida@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${realCoordinates["Policlínica Aparecida"][0]},${realCoordinates["Policlínica Aparecida"][1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Areia Branca",
    tipo: "saude",
    descricao_detalhada: "Rua Francisco Lourenço Gomes, 118. Tel: (13) 3291-5816. E-mail: usf-areiabranca@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${realCoordinates["Policlínica Areia Branca"][0]},${realCoordinates["Policlínica Areia Branca"][1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Bom Retiro",
    tipo: "saude",
    descricao_detalhada: "Rua João Fraccaroli, s/nº. Tel: (13) 3299-7669. E-mail: usf-bomretiro@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${realCoordinates["Policlínica Bom Retiro"][0]},${realCoordinates["Policlínica Bom Retiro"][1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Campo Grande",
    tipo: "saude",
    descricao_detalhada: "Rua Carvalho de Mendonça, 607. Tel: (13) 3239-3039. E-mail: ubs-campogrande@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${realCoordinates["Policlínica Campo Grande"][0]},${realCoordinates["Policlínica Campo Grande"][1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Caneleira",
    tipo: "saude",
    descricao_detalhada: "Rua Adriano de Campos Tourinho, 705 - Santa Maria. E-mail: usf-caneleira@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${realCoordinates["Policlínica Caneleira"][0]},${realCoordinates["Policlínica Caneleira"][1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Caruara",
    tipo: "saude",
    descricao_detalhada: "Rua Andrade Soares s/nº – Área Continental. Tel: (13) 3268-1358. E-mail: usf-caruara@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7h às 19h e sábado das 9h às 15h30",
    localizacao: `${santosCoords.continental[0]},${santosCoords.continental[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Castelo",
    tipo: "saude",
    descricao_detalhada: "Rua Francisco de Barros Melo, 184. Tel: (13) 3299-5985. E-mail: usf-castelo@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Conselheiro Nébias",
    tipo: "saude",
    descricao_detalhada: "Av. Conselheiro Nébias, 457. Tel: (13) 3222-3512. E-mail: ubs-conselheironebias@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Embaré",
    tipo: "saude",
    descricao_detalhada: "Praça Coronel Fernando Prestes, s/nº. Tel: (13) 3228-3632. E-mail: ubs-embare@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.orla[0]},${santosCoords.orla[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Estuário",
    tipo: "saude",
    descricao_detalhada: "Avenida Afonso Pena, 541. Tel: (13) 3228-3671. E-mail: usf-estuario@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 19 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Gonzaga",
    tipo: "saude",
    descricao_detalhada: "Rua Assis Correia, 17. Tel: (13) 3284-0605. E-mail: ubs-gonzaga@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.orla[0]},${santosCoords.orla[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Ilha Diana",
    tipo: "saude",
    descricao_detalhada: "Avenida Principal s/nº. Tel: (13) 3223-3620. E-mail: usf-ilhadiana@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 8:30 às 16:30 horas",
    localizacao: `${santosCoords.continental[0]},${santosCoords.continental[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Jabaquara",
    tipo: "saude",
    descricao_detalhada: "Rua Vasco da Gama, 32. Tel: (13) 3228-3652. E-mail: usf-jabaquara@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Pompeia / José Menino",
    tipo: "saude",
    descricao_detalhada: "Rua Ceará, 11, Pompeia. Tel: (13) 3239-5270. E-mail: ubs-pompeiajm@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 19 horas",
    localizacao: `${santosCoords.orla[0]},${santosCoords.orla[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Marapé",
    tipo: "saude",
    descricao_detalhada: "Rua São Judas Tadeu, s/nº. Tel: (13) 3237-1758. E-mail: ubs-marape@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 18 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Martins Fontes",
    tipo: "saude",
    descricao_detalhada: "Rua Luiza Macuco, 40, Vila Mathias. Tel: (13) 3232-2300. E-mail: usf-martinsfontes@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Monte Cabrão",
    tipo: "saude",
    descricao_detalhada: "Av. Principal s/nº – Área Continental. Tel: (13) 3352-2001. E-mail: usf-montecabrao@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.continental[0]},${santosCoords.continental[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Monte Serrat",
    tipo: "saude",
    descricao_detalhada: "Praça Correa de Melo s/nº. Tel: (13) 3221-8316. E-mail: usf-monteserrat@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Morro José Menino",
    tipo: "saude",
    descricao_detalhada: "Rua Doutor Carlos Alberto Curado, 77 A. Tel: (13) 3251-9424. E-mail: usf-josemenino@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.morros[0]},${santosCoords.morros[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica e Pronto Atendimento Nova Cintra",
    tipo: "saude",
    descricao_detalhada: "Rua José Ozéas Barbosa s/n.º. Tel: (13) 3258-6902. E-mail: usf-novacintra@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 19 horas como policlínica. Das 19 às 7 horas, de segunda a sexta-feira, como pronto-atendimento, e 24h aos sábados, domingos e feriados",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Penha",
    tipo: "saude",
    descricao_detalhada: "Rua Três, 150. Tel: (13) 3296-2679. E-mail: usf-penha@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Ponta da Praia",
    tipo: "saude",
    descricao_detalhada: "Praça 1º de Maio s/nº. Tel: (13) 3261–2762. E-mail: ubs-pontadapraia@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 19 horas",
    localizacao: `${santosCoords.orla[0]},${santosCoords.orla[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Unidade de Cuidado do Porto",
    tipo: "saude",
    descricao_detalhada: "Rua General Câmara, 507, Paquetá. Tel: (13) 3233-3228. E-mail: ubs-porto@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 19 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Rádio Clube",
    tipo: "saude",
    descricao_detalhada: "Avenida Hugo Maia s/nº. Tel: (13) 3299-8988. E-mail: usf-radioclube@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica São Bento",
    tipo: "saude",
    descricao_detalhada: "Rua das Pedras s/nº. Tel: (13) 3222-3913. E-mail: usf-saobento@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Santa Maria / São Jorge",
    tipo: "saude",
    descricao_detalhada: "Rua Maestro Antônio Garofalo, 682 - Santa Maria. E-mail: usf-saojorge@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica São Manoel",
    tipo: "saude",
    descricao_detalhada: "Praça Nicolau Geraigire s/nº. Tel: (13) 3299-5063. E-mail: usf-saomanoel@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Piratininga",
    tipo: "saude",
    descricao_detalhada: "Praça João de Moraes Chaves s/nº. Tel: (13) 3223-4318. E-mail: usf-piratininga@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Santa Maria",
    tipo: "saude",
    descricao_detalhada: "Rua 10 s/nº – Morro Santa Maria. Tel: (13) 3221-9510. E-mail: usf-santamaria@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.morros[0]},${santosCoords.morros[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Valongo",
    tipo: "saude",
    descricao_detalhada: "Rua Prof. Maria Neusa Cunha s/nº, Saboó. Tel: (13) 3219-3110. E-mail: usf-valongo@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Vila Gilda",
    tipo: "saude",
    descricao_detalhada: "Avenida Brigadeiro Faria Lima, 1281. Email: usf-vilagilda@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Vila Mathias",
    tipo: "saude",
    descricao_detalhada: "Rua Xavier Pinheiro, 284, Encruzilhada. Tel: (13) 3222-4290. E-mail: ubs-vilamathias@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Vila Nova",
    tipo: "saude",
    descricao_detalhada: "Praça Iguatemi Martins nº 29/36. Tel: (13) 3222-3998. E-mail: usf-vilanova@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Policlínica Vila Progresso",
    tipo: "saude",
    descricao_detalhada: "Rua Três, casas 1 e 2 - Vila Telma – Morro Vila Progresso. Tel: (13) 3258-7301. E-mail: usf-vilaprogresso@santos.sp.gov.br. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas",
    localizacao: `${santosCoords.morros[0]},${santosCoords.morros[1]}`,
    links: null,
    imagens: null,
    audio: null
  },

  // ESPECIALIDADES
  {
    titulo: "Ambulatório de Especialidades Nelson Teixeira – AMBESP",
    tipo: "saude",
    descricao_detalhada: "Av. Manoel Tourinho, nº 395 – Macuco. Tel: (13) 3228-3690",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Ambulatório de Especialidades Zona Noroeste - SEAMBESP - ZNO",
    tipo: "saude",
    descricao_detalhada: "Av. Aprovada, 927 - Castelo, Santos - SP, 11087-180. Tel: (13) 3203-2907",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Ambulatório de Tuberculose",
    tipo: "saude",
    descricao_detalhada: "Rua Nabuco de Araújo, 36 - Boqueirão. Tel: (13) 3222-1229",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Ambulatório do Programa Municipal de Atendimento Integral às Vítimas de Violência Sexual - PAIVAS",
    tipo: "saude",
    descricao_detalhada: "Avenida Conselheiro Nébias, 267 - 1° andar. Tel: (13) 99743-7928 e (13) 3235-6466. Email: paivas@santos.sp.gov.br. Horário de funcionamento: De segunda a sexta-feira, das 8 às 17 horas",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Especialidades Odontológicas da Zona da Orla e Intermediária",
    tipo: "saude",
    descricao_detalhada: "Avenida Conselheiro Nébias n.º 267 – Vila Mathias. Tel: (13) 3228-3650, (13) 3228-3660 e (13) 3228-3661",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Especialidades Odontológicas da Zona Noroeste",
    tipo: "saude",
    descricao_detalhada: "Rua Ângelo Martins Melero, 436 – Caneleira. Tel: (13) 3203-6124 e (13) 3291-4083",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Referência em Saúde Auditiva",
    tipo: "saude",
    descricao_detalhada: "Av. Bernardino de Campos, 617 – Campo Grande. Tel: (13) 3221-5295",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Reabilitação e Estimulação do Neurodesenvolvimento (CREN) – Clínica do Autista",
    tipo: "saude",
    descricao_detalhada: "Rua Heitor Penteado, 80 – Marapé. Tel: (13) 3349-7971",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Controle de Doenças Infectocontagiosas (HIV/Aids, sífilis e hepatites)",
    tipo: "saude",
    descricao_detalhada: "Rua da Constituição 556 – Vila Mathias. Tel: (13) 3229-8796",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro Especializado em Reabilitação Física e Intelectual – CER-II",
    tipo: "saude",
    descricao_detalhada: "Rua Bulcão Viana, 855 – Bom Retiro. Tel: (13) 3225-1728",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Instituto da Mulher e Gestante",
    tipo: "saude",
    descricao_detalhada: "Av. Conselheiro Nébias nº 453 - Encruzilhada. Tel: (13) 3222-1359 e (13) 3223-1133",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Seção de Atendimento à Rede e Prevenção em Saúde Bucal",
    tipo: "saude",
    descricao_detalhada: "Avenida Conselheiro Nébias, 267 - Primeiro Andar. Tel: (13) 3228-3658",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Seção Casa de Apoio e Solidariedade ao Paciente de Aids - Secasa",
    tipo: "saude",
    descricao_detalhada: "Rua Luís de Camões, 192 - Vila Mathias. Tel: (13) 3232-3192",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Seção de Recuperação e Fisioterapia da Zona da Orla/ Intermediária – SERFIS",
    tipo: "saude",
    descricao_detalhada: "Av. Conselheiro Nébias n.º 267 – Vila Nova. Tel: (13) 3223-5984 e (13) 3224-1221",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },

  // SAÚDE MENTAL
  {
    titulo: "Centro de Atenção Psicossocial Álcool e outras Drogas",
    tipo: "saude",
    descricao_detalhada: "Rua Monsenhor de Paula Rodrigues, nº 170 - Vila Belmiro. Tel: (13) 3237-2681",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial Álcool e outras Drogas Infanto Juvenil Tô Ligado",
    tipo: "saude",
    descricao_detalhada: "Av. Conselheiro Nébias, 349 - Paquetá. Tel: (13) 3221-8367",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial Infantojuvenil da Zona Noroeste Entre Mentes",
    tipo: "saude",
    descricao_detalhada: "Av. Praça Maria Coelho Lopes, nº395 - Santa Maria. Tel: (13) 3299-7901",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial Infantojuvenil #tamojunto (reúne os antigos Caps Orla e Central)",
    tipo: "saude",
    descricao_detalhada: "Av. Pinheiro Machado, 769 - Campo Grande. Tel: (13) 3271-8235 e (13) 3221-4944",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial Centro",
    tipo: "saude",
    descricao_detalhada: "Avenida Conselheiro Rodrigues Alves, 236 – Macuco. Tel: (13) 3222-1217",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial Orquidário",
    tipo: "saude",
    descricao_detalhada: "Avenida Francisco Glicério, 661. Tel: (13) 3251-2094",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial Praia",
    tipo: "saude",
    descricao_detalhada: "Av. Cel. Joaquim Montenegro, 329, Ponta da Praia. Tel: (13) 3225-8137",
    localizacao: `${santosCoords.orla[0]},${santosCoords.orla[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial da Vila",
    tipo: "saude",
    descricao_detalhada: "Av. Pinheiro Machado n.º 718 – Marapé. Tel: (13) 3225-5796",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Centro de Atenção Psicossocial da Zona Noroeste",
    tipo: "saude",
    descricao_detalhada: "Rua Bulcão Viana, 853 – Bom Retiro. Tel: (13) 3299-4368",
    localizacao: `${santosCoords.zonaNoroeste[0]},${santosCoords.zonaNoroeste[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Seção de Reabilitação Psicossocial",
    tipo: "saude",
    descricao_detalhada: "Centro de reabilitação psicossocial para atendimento de pessoas com transtornos mentais",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Hospital e Maternidade Municipal Dr. Silvério Fontes",
    tipo: "saude",
    descricao_detalhada: "Rua Agamenon Magalhães s/nº - Castelo. Tel: (13) 3209-8000. Hospital municipal de referência para atendimento de emergência e maternidade",
    localizacao: `${realCoordinates["Hospital e Maternidade Municipal Dr. Silvério Fontes"][0]},${realCoordinates["Hospital e Maternidade Municipal Dr. Silvério Fontes"][1]}`,
    links: null,
    imagens: null,
    audio: null
  }
];

async function insertHealthLocations() {
  try {
    console.log('Iniciando inserção/atualização dos locais de saúde no Supabase...');
    
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < healthLocations.length; i++) {
      const location = healthLocations[i];
      console.log(`Processando ${i + 1}/${healthLocations.length}: ${location.titulo}`);

      try {
        // Primeiro, verifica se já existe um local com o mesmo título
        const { data: existingData, error: selectError } = await supabase
          .from('locations3')
          .select('id, titulo, localizacao')
          .eq('titulo', location.titulo)
          .limit(1);

        if (selectError) {
          throw selectError;
        }

        if (existingData && existingData.length > 0) {
          // Se existe, atualiza as coordenadas
          const { data, error } = await supabase
            .from('locations3')
            .update({ 
              localizacao: location.localizacao,
              descricao_detalhada: location.descricao_detalhada,
              tipo: location.tipo,
              links: location.links,
              imagens: location.imagens,
              audio: location.audio
            })
            .eq('titulo', location.titulo)
            .select();

          if (error) {
            throw error;
          }

          console.log(`✓ Atualizado: ${location.titulo}`);
          updatedCount++;
        } else {
          // Se não existe, insere novo
          const { data, error } = await supabase
            .from('locations3')
            .insert([location])
            .select();

          if (error) {
            throw error;
          }

          console.log(`✓ Inserido: ${location.titulo}`);
          insertedCount++;
        }

      } catch (error) {
        console.error(`✗ Erro ao processar ${location.titulo}:`, error.message);
        errorCount++;
      }

      // Pequena pausa entre operações
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n=== RESUMO ===');
    console.log(`Inseridos: ${insertedCount}`);
    console.log(`Atualizados: ${updatedCount}`);
    console.log(`Erros: ${errorCount}`);
    console.log(`Total processados: ${healthLocations.length}`);
    
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

// Executar a inserção
insertHealthLocations();