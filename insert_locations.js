// Script para inserir os locais no Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

// Coordenadas aproximadas para Santos, SP
const santosCoords = {
  centro: [-23.9608, -46.3331],
  zonaNoroeste: [-23.9500, -46.3500],
  centroHistorico: [-23.9600, -46.3300],
  morros: [-23.9700, -46.3400],
  dique: [-23.9400, -46.3600]
};

const locations = [
  {
    titulo: "Escola de Samba Brasil",
    tipo: "cultura",
    descricao_detalhada: "Foi a primeira escola de samba na Baixada Santista e uma das pioneiras no Brasil. Foi efetivamente fundada em 10 de maio de 1949, mas sua origem remonta aos carnavais de 1939 e 1941. Representa um marco histórico importante na cultura negra e no samba de Santos.",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Coletivo de Capoeira e Cultura Popular",
    tipo: "cultura",
    descricao_detalhada: "Aulas de capoeira, musicalidade e rodas de samba para crianças. Espaço dedicado à preservação e transmissão da cultura afro-brasileira através de atividades educativas e culturais para jovens e crianças da comunidade.",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Quilombo do Pai Felipe",
    tipo: "historico",
    descricao_detalhada: "O Quilombo do Pai Felipe era um lugar frequentado por políticos e lideranças abolicionistas, que nos finais de semana se deslocavam até lá para ouvir batuques e dançar samba. Representa um importante espaço de resistência e cultura negra durante o período da escravidão.",
    localizacao: `${santosCoords.centroHistorico[0]},${santosCoords.centroHistorico[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Batalha da Conselheira",
    tipo: "cultura",
    descricao_detalhada: "Realizada pela juventude negra por oito anos na Baixada Santista, uniu música, rima, MCs, performances e muita rua. Evento cultural que fortaleceu a identidade e expressão artística da juventude negra local através do hip-hop e outras manifestações culturais urbanas.",
    localizacao: "-23.9729439,-46.3243237",
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Igreja Santa Josefina Bakhita",
    tipo: "religiao",
    descricao_detalhada: "Igreja dedicada à Santa Josefina Bakhita, santa africana canonizada pela Igreja Católica. Representa a presença e valorização da religiosidade afro-cristã na comunidade santista, servindo como espaço de fé e resistência cultural.",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Escola de Samba X-9 / Irmandade Nossa Senhora do Rosário dos Homens Pretos",
    tipo: "cultura",
    descricao_detalhada: "Fundada em 26 de janeiro de 1985, cujo objetivo não é só ser uma escola de samba, mas também promover atividades culturais, sociais e esportivas. A Irmandade promove a religiosidade e o cuidado à população negra escravizada de Santos, sendo fundada em 1652 e localizada no centro da cidade. Representa a união entre tradição religiosa e cultural afro-brasileira.",
    localizacao: "-23.9575511,-46.310904",
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Clube do Choro / José Theodoro dos Santos Pereira",
    tipo: "cultura",
    descricao_detalhada: "Fundado em 23 de abril de 2002, tem como patrono Aníbal Augusto Sardinha (Garoto). Realiza ações buscando salvaguardar e fomentar o gênero musical do choro. José Theodoro dos Santos Pereira foi um português que ajudou a manter o Quilombo do Jabaquara e comunicava aos abolicionistas a descida de escravos fugidos pela Serra do Mar, representando a solidariedade na luta abolicionista.",
    localizacao: "-23.9328353,-46.3305138",
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Terreiro de Matriz Africana",
    tipo: "religiao",
    descricao_detalhada: "Território de mocumbas brasileiras e culto tradicional iorubá. É a casa de orixá do Pai Thiago e Mãe Rayma. Espaço sagrado dedicado à preservação e prática das tradições religiosas de matriz africana, servindo como centro de resistência cultural e espiritual para a comunidade afro-descendente de Santos.",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Casa da Frontaria Azulejada (Afroculturas)",
    tipo: "historico",
    descricao_detalhada: "Apontada como exemplo de grande riqueza que vem da conexão com o passado, por meio da mão de obra afrodescendente. Representa a contribuição fundamental da população negra na construção do patrimônio arquitetônico e cultural de Santos, evidenciando a presença e importância dos afrodescendentes na história da cidade.",
    localizacao: `${santosCoords.centroHistorico[0]},${santosCoords.centroHistorico[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Antigo Engenho dos Erasmos",
    tipo: "historico",
    descricao_detalhada: "Antigo engenho que hoje em dia funciona como um monumento histórico de Santos. Representa um importante marco da história colonial brasileira e da escravidão, servindo como testemunho da exploração do trabalho escravo na produção açucareira e como espaço de memória e reflexão sobre esse período histórico.",
    localizacao: `${santosCoords.centroHistorico[0]},${santosCoords.centroHistorico[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Escola de Samba de Santos (Carminda de Jesus)",
    tipo: "cultura",
    descricao_detalhada: "Fundada por Carminda de Jesus em 1949. Representa mais uma importante contribuição feminina para a cultura do samba em Santos, destacando o papel fundamental das mulheres negras na preservação e transmissão das tradições culturais afro-brasileiras na cidade.",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Augusto França – Afroturismo",
    tipo: "cultura",
    descricao_detalhada: "Proposta de valorização do turismo negro em Santos, com foco em memória, cultura e ancestralidade. Iniciativa que busca promover o turismo cultural afro-brasileiro, destacando a rica herança cultural negra da cidade e criando oportunidades de geração de renda para a comunidade através do turismo étnico.",
    localizacao: `${santosCoords.centro[0]},${santosCoords.centro[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Escola de Samba Unidos dos Morros",
    tipo: "cultura",
    descricao_detalhada: "Escola tradicional da cidade, símbolo da resistência cultural e da presença negra no samba santista. Representa a força e a tradição do samba nas comunidades dos morros de Santos, sendo um importante espaço de organização comunitária e preservação cultural.",
    localizacao: `${santosCoords.morros[0]},${santosCoords.morros[1]}`,
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Arte no Dique / Espaço Marielle Franco",
    tipo: "cultura",
    descricao_detalhada: "Projeto social e cultural na Zona Noroeste que promove oficinas, arte e cidadania, valorizando a cultura periférica. Espaço dedicado à memória de Marielle Franco e ao fortalecimento da cultura das periferias, oferecendo atividades educativas e culturais que empoderam a comunidade local.",
    localizacao: "-23.9380795,-46.3871576",
    links: null,
    imagens: null,
    audio: null
  },
  {
    titulo: "Sociedade Espírita do Anjo da Guarda",
    tipo: "religiao",
    descricao_detalhada: "Criada por Maria Patrícia Fagundes em 1883. Maria era parteira e também conhecida como Mãe Preta, considerada a 'mãe de todos os santistas'. Representa a importante contribuição das mulheres negras na assistência social e espiritual da comunidade, destacando o papel fundamental das parteiras e cuidadoras negras na história de Santos.",
    localizacao: "-23.9537362,-46.322623",
    links: null,
    imagens: null,
    audio: null
  }
];

async function insertLocations() {
  try {
    console.log('Iniciando inserção/atualização dos locais no Supabase...');
    
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i];
      console.log(`Processando ${i + 1}/${locations.length}: ${location.titulo}`);

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
    console.log(`Total processados: ${locations.length}`);
    
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

// Executar a inserção
insertLocations();