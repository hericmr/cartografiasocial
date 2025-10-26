// Script para inserir TODOS os locais de saúde dos arquivos de progresso no Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

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
  const enderecoLower = endereco.toLowerCase();
  
  if (enderecoLower.includes('alemoa') || enderecoLower.includes('chico de paula')) return 'zonaNoroeste';
  if (enderecoLower.includes('aparecida')) return 'centro';
  if (enderecoLower.includes('areia branca')) return 'zonaNoroeste';
  if (enderecoLower.includes('bom retiro')) return 'bomRetiro';
  if (enderecoLower.includes('campo grande')) return 'campoGrande';
  if (enderecoLower.includes('caneleira') || enderecoLower.includes('santa maria')) return 'zonaNoroeste';
  if (enderecoLower.includes('caruara') || enderecoLower.includes('continental')) return 'continental';
  if (enderecoLower.includes('castelo')) return 'centro';
  if (enderecoLower.includes('conselheiro nébias')) return 'centro';
  if (enderecoLower.includes('embaré')) return 'orla';
  if (enderecoLower.includes('estuário')) return 'centro';
  if (enderecoLower.includes('gonzaga')) return 'orla';
  if (enderecoLower.includes('ilha diana')) return 'continental';
  if (enderecoLower.includes('jabaquara')) return 'orla';
  if (enderecoLower.includes('pompeia') || enderecoLower.includes('josé menino')) return 'orla';
  if (enderecoLower.includes('marapé')) return 'marape';
  if (enderecoLower.includes('martins fontes') || enderecoLower.includes('vila mathias')) return 'vilaMathias';
  if (enderecoLower.includes('monte cabrão')) return 'continental';
  if (enderecoLower.includes('monte serrat')) return 'morros';
  if (enderecoLower.includes('nova cintra')) return 'zonaNoroeste';
  if (enderecoLower.includes('penha')) return 'zonaNoroeste';
  if (enderecoLower.includes('ponta da praia')) return 'pontaDaPraia';
  if (enderecoLower.includes('porto') || enderecoLower.includes('paquetá')) return 'orla';
  if (enderecoLower.includes('rádio clube')) return 'zonaNoroeste';
  if (enderecoLower.includes('são bento')) return 'centroHistorico';
  if (enderecoLower.includes('são manuel') || enderecoLower.includes('são manoel')) return 'zonaNoroeste';
  if (enderecoLower.includes('piratininga')) return 'zonaNoroeste';
  if (enderecoLower.includes('valongo') || enderecoLower.includes('saboó')) return 'zonaNoroeste';
  if (enderecoLower.includes('vila gilda')) return 'zonaNoroeste';
  if (enderecoLower.includes('vila nova')) return 'zonaNoroeste';
  if (enderecoLower.includes('vila progresso')) return 'zonaNoroeste';
  if (enderecoLower.includes('macuco')) return 'centro';
  if (enderecoLower.includes('boqueirão')) return 'orla';
  if (enderecoLower.includes('encruzilhada')) return 'centro';
  if (enderecoLower.includes('vila belmiro')) return 'zonaNoroeste';
  if (enderecoLower.includes('orquidário')) return 'orla';
  if (enderecoLower.includes('dique')) return 'dique';
  
  return 'santos'; // padrão
}

// Função para carregar todos os locais dos arquivos de progresso
function loadAllHealthLocations() {
  const allLocations = new Map();
  const insercoesDir = './inserções';
  
  const progressFiles = [
    'coordenadas_saude_progresso_10.json',
    'coordenadas_saude_progresso_20.json',
    'coordenadas_saude_progresso_30.json',
    'coordenadas_saude_progresso_40.json',
    'coordenadas_saude_progresso_50.json',
    'coordenadas_saude_progresso_60.json',
    'coordenadas_saude_progresso_70.json'
  ];

  progressFiles.forEach(fileName => {
    const filePath = path.join(insercoesDir, fileName);
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        
        data.forEach(location => {
          // Usar o nome como chave única
          if (!allLocations.has(location.nome)) {
            allLocations.set(location.nome, {
              nome: location.nome,
              endereco: location.endereco,
              telefone: location.telefone || '',
              email: location.email || '',
              latitude: location.latitude,
              longitude: location.longitude,
              status: location.status
            });
          }
        });
        
        console.log(`✓ Processado: ${fileName} - ${data.length} locais`);
      }
    } catch (error) {
      console.error(`✗ Erro ao processar ${fileName}:`, error.message);
    }
  });

  return allLocations;
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

  return {
    titulo: location.nome,
    tipo: "saude",
    descricao_detalhada: `${location.endereco}. ${location.telefone ? `Tel: ${location.telefone}.` : ''} ${location.email ? `E-mail: ${location.email}.` : ''} Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas`,
    localizacao: localizacao,
    links: null,
    imagens: null,
    audio: null
  };
}

async function insertAllHealthLocations() {
  try {
    console.log('Carregando todos os locais de saúde dos arquivos de progresso...');
    const allLocations = loadAllHealthLocations();
    
    console.log(`\nTotal de locais únicos encontrados: ${allLocations.size}`);
    
    const locationsWithCoords = Array.from(allLocations.values()).filter(loc => 
      loc.latitude && loc.longitude && loc.status === 'encontrado'
    );
    const locationsWithoutCoords = Array.from(allLocations.values()).filter(loc => 
      !loc.latitude || !loc.longitude || loc.status !== 'encontrado'
    );
    
    console.log(`Locais com coordenadas reais: ${locationsWithCoords.length}`);
    console.log(`Locais com coordenadas genéricas: ${locationsWithoutCoords.length}`);
    
    console.log('\nIniciando inserção/atualização no Supabase...');
    
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    let totalProcessed = 0;

    for (const [nome, location] of allLocations) {
      totalProcessed++;
      console.log(`Processando ${totalProcessed}/${allLocations.size}: ${nome}`);
      
      try {
        const supabaseLocation = convertToSupabaseFormat(location);
        
        // Verificar se já existe
        const { data: existingData, error: selectError } = await supabase
          .from('locations3')
          .select('id, titulo, localizacao')
          .eq('titulo', nome)
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
              descricao_detalhada: supabaseLocation.descricao_detalhada
            })
            .eq('titulo', nome)
            .select();

          if (error) {
            throw error;
          }

          console.log(`✓ Atualizado: ${nome}`);
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

          console.log(`✓ Inserido: ${nome}`);
          insertedCount++;
        }

      } catch (error) {
        console.error(`✗ Erro ao processar ${nome}:`, error.message);
        errorCount++;
      }

      // Pequena pausa entre operações
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n=== RESUMO FINAL ===');
    console.log(`Total processados: ${totalProcessed}`);
    console.log(`Inseridos: ${insertedCount}`);
    console.log(`Atualizados: ${updatedCount}`);
    console.log(`Erros: ${errorCount}`);
    console.log(`Locais com coordenadas reais: ${locationsWithCoords.length}`);
    console.log(`Locais com coordenadas genéricas: ${locationsWithoutCoords.length}`);
    
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

// Executar a inserção completa
insertAllHealthLocations();