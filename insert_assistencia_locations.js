// Script para inserir os locais de assistência social no Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

// Coordenadas genéricas por região para locais sem coordenadas específicas
const santosCoords = {
  centro: [-23.9608, -46.3331],
  zonaNoroeste: [-23.9500, -46.3500],
  centroHistorico: [-23.9600, -46.3300],
  morros: [-23.9700, -46.3400],
  dique: [-23.9400, -46.3600],
  orla: [-23.9700, -46.3200],
  continental: [-23.9200, -46.3800],
  pontaDaPraia: [-23.9800, -46.3100],
  vilaMathias: [-23.9600, -46.3400],
  bomRetiro: [-23.9400, -46.3800],
  campoGrande: [-23.9550, -46.3500],
  marape: [-23.9650, -46.3450],
  santos: [-23.9600, -46.3300]
};

// Função para determinar região baseada no endereço
function getRegionFromAddress(endereco) {
  if (!endereco) return 'santos';
  
  const enderecoLower = endereco.toLowerCase();
  
  if (enderecoLower.includes('macuco')) return 'centro';
  if (enderecoLower.includes('jardim são manuel') || enderecoLower.includes('são manuel') || enderecoLower.includes('são manoel')) return 'zonaNoroeste';
  if (enderecoLower.includes('andrade soares')) return 'continental';
  if (enderecoLower.includes('conselheiro nébias')) return 'centro';
  if (enderecoLower.includes('cananeia')) return 'zonaNoroeste';
  if (enderecoLower.includes('evaristo da veiga')) return 'centro';
  if (enderecoLower.includes('francisco manuel') || enderecoLower.includes('francisco manoel')) return 'centro';
  if (enderecoLower.includes('pedro américo')) return 'continental';
  if (enderecoLower.includes('conselheiro rodrigues alves')) return 'centro';
  if (enderecoLower.includes('carlos caldeira')) return 'zonaNoroeste';
  if (enderecoLower.includes('joão francoli')) return 'zonaNoroeste';
  if (enderecoLower.includes('júlio de mesquita')) return 'centro';
  if (enderecoLower.includes('pinheiro machado')) return 'centro';
  if (enderecoLower.includes('miguel presgrave')) return 'centro';
  if (enderecoLower.includes('senador dantas')) return 'centro';
  if (enderecoLower.includes('joão guerra')) return 'centro';
  if (enderecoLower.includes('prudente de moraes')) return 'centro';
  if (enderecoLower.includes('nabuco de araújo')) return 'zonaNoroeste';
  if (enderecoLower.includes('amador bueno')) return 'centro';
  if (enderecoLower.includes('bittencourt')) return 'centro';
  if (enderecoLower.includes('gal câmara') || enderecoLower.includes('gal. câmara')) return 'centro';
  if (enderecoLower.includes('cons. saraiva') || enderecoLower.includes('conselheiro saraiva')) return 'centro';
  if (enderecoLower.includes('bras cubas')) return 'centro';
  if (enderecoLower.includes('manoel tourinho')) return 'centro';
  if (enderecoLower.includes('paraná')) return 'centro';
  
  return 'santos'; // padrão
}

// Função para carregar dados de assistência social
function loadAssistenciaData() {
  try {
    const filePath = './coordenadas_assistencia_social.json';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log(`✓ Dados de assistência social carregados: ${data.length} locais`);
    return data;
  } catch (error) {
    console.error('✗ Erro ao carregar dados de assistência social:', error.message);
    return [];
  }
}

// Função para converter local para formato do Supabase
function convertToSupabaseFormat(location) {
  let localizacao;
  
  if (location.latitude && location.longitude && location.status === 'encontrado') {
    // Usar coordenadas reais
    localizacao = `${location.latitude},${location.longitude}`;
  } else {
    // Usar coordenadas genéricas baseadas no endereço
    const region = getRegionFromAddress(location.endereco);
    localizacao = `${santosCoords[region][0]},${santosCoords[region][1]}`;
  }

  // Criar descrição detalhada
  let descricao = '';
  if (location.endereco) {
    descricao += location.endereco;
  }
  if (location.telefone) {
    descricao += `. Tel: ${location.telefone}`;
  }
  if (location.email) {
    descricao += `. E-mail: ${location.email}`;
  }
  
  // Adicionar informações específicas baseadas no tipo de serviço
  if (location.nome.includes('CRAS')) {
    descricao += '. Centro de Referência da Assistência Social - Atendimento socioassistencial às famílias e indivíduos em situação de vulnerabilidade social.';
  } else if (location.nome.includes('CREAS')) {
    descricao += '. Centro de Referência Especializado da Assistência Social - Atendimento especializado a famílias e indivíduos com direitos violados.';
  } else if (location.nome.includes('NIAS')) {
    descricao += '. Núcleo de Integração em Assistência Social - Serviços de proteção social básica.';
  } else if (location.nome.includes('CASA DIA')) {
    descricao += '. Casa Dia - Serviço de acolhimento diurno.';
  } else if (location.nome.includes('NAI')) {
    descricao += '. Núcleo de Acolhimento Institucional.';
  } else if (location.nome.includes('ACOLHIMENTO')) {
    descricao += '. Serviço de Acolhimento Institucional.';
  } else if (location.nome.includes('FAMÍLIA ACOLHEDORA')) {
    descricao += '. Programa Família Acolhedora e Apadrinhamento Afetivo.';
  } else if (location.nome.includes('CASA DE PASSAGEM')) {
    descricao += '. Casa de Passagem - Acolhimento temporário.';
  } else if (location.nome.includes('REPÚBLICA')) {
    descricao += '. República - Acolhimento institucional para jovens.';
  } else if (location.nome.includes('CASA DO PARAPLÉGICO')) {
    descricao += '. Casa do Paraplégico - Acolhimento para pessoas com deficiência.';
  } else if (location.nome.includes('CENTRO POP')) {
    descricao += '. Centro de Referência Especializado para População em Situação de Rua.';
  } else if (location.nome.includes('ABRIGO')) {
    descricao += '. Abrigo - Acolhimento institucional.';
  } else if (location.nome.includes('ALBERGUE')) {
    descricao += '. Albergue Noturno - Acolhimento noturno.';
  } else {
    descricao += '. Serviço de Assistência Social.';
  }

  return {
    titulo: location.nome,
    tipo: "assistencia",
    descricao_detalhada: descricao,
    localizacao: localizacao,
    links: null,
    imagens: null,
    audio: null
  };
}

async function insertAssistenciaLocations() {
  try {
    console.log('Carregando dados de assistência social...');
    const assistenciaData = loadAssistenciaData();
    
    if (assistenciaData.length === 0) {
      console.log('Nenhum dado de assistência social encontrado.');
      return;
    }
    
    console.log(`\nTotal de locais de assistência social: ${assistenciaData.length}`);
    
    const locationsWithCoords = assistenciaData.filter(loc => 
      loc.latitude && loc.longitude && loc.status === 'encontrado'
    );
    const locationsWithoutCoords = assistenciaData.filter(loc => 
      !loc.latitude || !loc.longitude || loc.status !== 'encontrado'
    );
    
    console.log(`Locais com coordenadas reais: ${locationsWithCoords.length}`);
    console.log(`Locais com coordenadas genéricas: ${locationsWithoutCoords.length}`);
    
    console.log('\nIniciando inserção/atualização no Supabase...');
    
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < assistenciaData.length; i++) {
      const location = assistenciaData[i];
      console.log(`Processando ${i + 1}/${assistenciaData.length}: ${location.nome}`);

      try {
        const supabaseLocation = convertToSupabaseFormat(location);
        
        // Verificar se já existe
        const { data: existingData, error: selectError } = await supabase
          .from('locations3')
          .select('id, titulo, localizacao')
          .eq('titulo', location.nome)
          .limit(1);

        if (selectError) {
          throw selectError;
        }

        if (existingData && existingData.length > 0) {
          // Atualizar
          const { data, error } = await supabase
            .from('locations3')
            .update({ 
              localizacao: supabaseLocation.localizacao,
              descricao_detalhada: supabaseLocation.descricao_detalhada,
              tipo: supabaseLocation.tipo,
              links: supabaseLocation.links,
              imagens: supabaseLocation.imagens,
              audio: supabaseLocation.audio
            })
            .eq('titulo', location.nome)
            .select();

          if (error) {
            throw error;
          }

          console.log(`✓ Atualizado: ${location.nome}`);
          updatedCount++;
        } else {
          // Inserir novo
          const { data, error } = await supabase
            .from('locations3')
            .insert([supabaseLocation])
            .select();

          if (error) {
            throw error;
          }

          console.log(`✓ Inserido: ${location.nome}`);
          insertedCount++;
        }

      } catch (error) {
        console.error(`✗ Erro ao processar ${location.nome}:`, error.message);
        errorCount++;
      }

      // Pequena pausa entre operações
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n=== RESUMO FINAL ===');
    console.log(`Total processados: ${assistenciaData.length}`);
    console.log(`Inseridos: ${insertedCount}`);
    console.log(`Atualizados: ${updatedCount}`);
    console.log(`Erros: ${errorCount}`);
    console.log(`Locais com coordenadas reais: ${locationsWithCoords.length}`);
    console.log(`Locais com coordenadas genéricas: ${locationsWithoutCoords.length}`);
    
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

// Executar a inserção
insertAssistenciaLocations();