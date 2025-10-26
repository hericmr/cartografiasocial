// Script para atualizar as coordenadas dos locais de saúde com as coordenadas reais encontradas
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para ler e processar os arquivos de coordenadas
function loadCoordinatesFromFiles() {
  const coordinatesMap = new Map();
  const insercoesDir = './inserções';
  
  // Lista dos arquivos de progresso
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
          if (location.latitude && location.longitude && location.status === 'encontrado') {
            // Usar o nome como chave para mapear as coordenadas
            coordinatesMap.set(location.nome, {
              latitude: location.latitude,
              longitude: location.longitude,
              endereco: location.endereco,
              telefone: location.telefone,
              email: location.email
            });
          }
        });
        
        console.log(`✓ Processado: ${fileName} - ${data.length} locais`);
      }
    } catch (error) {
      console.error(`✗ Erro ao processar ${fileName}:`, error.message);
    }
  });

  return coordinatesMap;
}

// Mapeamento de nomes entre os arquivos JSON e o script atual
const nameMapping = {
  "Policlínica da Alemoa e Chico de Paula": "Policlínica da Alemoa e Chico de Paula",
  "Policlínica Aparecida": "Policlínica Aparecida",
  "Policlínica Areia Branca": "Policlínica Areia Branca",
  "Policlínica Bom Retiro": "Policlínica Bom Retiro",
  "Policlínica Campo Grande": "Policlínica Campo Grande",
  "Policlínica Caneleira": "Policlínica Caneleira",
  "Policlínica Caruara": "Policlínica Caruara",
  "Policlínica Castelo": "Policlínica Castelo",
  "Policlínica Conselheiro Nébias": "Policlínica Conselheiro Nébias",
  "Policlínica Embaré": "Policlínica Embaré",
  "Policlínica Estuário": "Policlínica Estuário",
  "Policlínica Gonzaga": "Policlínica Gonzaga",
  "Policlínica Ilha Diana": "Policlínica Ilha Diana",
  "Policlínica Jabaquara": "Policlínica Jabaquara",
  "Policlínica Pompeia / José Menino": "Policlínica Pompeia / José Menino",
  "Policlínica Marapé": "Policlínica Marapé",
  "Policlínica Martins Fontes": "Policlínica Martins Fontes",
  "Policlínica Monte Cabrão": "Policlínica Monte Cabrão",
  "Policlínica Monte Serrat": "Policlínica Monte Serrat",
  "Policlínica Morro José Menino": "Policlínica Morro José Menino",
  "Policlínica e Pronto Atendimento Nova Cintra": "Policlínica e Pronto Atendimento Nova Cintra",
  "Policlínica Penha": "Policlínica Penha",
  "Policlínica Ponta da Praia": "Policlínica Ponta da Praia",
  "Unidade de Cuidado do Porto": "Unidade de Cuidado do Porto",
  "Policlínica Rádio Clube": "Policlínica Rádio Clube",
  "Policlínica São Bento": "Policlínica São Bento",
  "Policlínica Santa Maria / São Jorge": "Policlínica Santa Maria / São Jorge",
  "Policlínica São Manoel": "Policlínica São Manoel",
  "Policlínica Piratininga": "Policlínica Piratininga",
  "Policlínica Santa Maria": "Policlínica Santa Maria",
  "Policlínica Valongo": "Policlínica Valongo",
  "Policlínica Vila Gilda": "Policlínica Vila Gilda",
  "Policlínica Vila Mathias": "Policlínica Vila Mathias",
  "Policlínica Vila Nova": "Policlínica Vila Nova",
  "Policlínica Vila Progresso": "Policlínica Vila Progresso",
  "Hospital e Maternidade Municipal Dr. Silvério Fontes": "Hospital e Maternidade Municipal Dr. Silvério Fontes"
};

async function updateHealthLocationsWithRealCoordinates() {
  try {
    console.log('Carregando coordenadas dos arquivos de progresso...');
    const coordinatesMap = loadCoordinatesFromFiles();
    
    console.log(`\nCoordenadas encontradas: ${coordinatesMap.size} locais`);
    console.log('Locais com coordenadas reais:');
    coordinatesMap.forEach((coords, name) => {
      console.log(`  - ${name}: ${coords.latitude}, ${coords.longitude}`);
    });

    console.log('\nIniciando atualização no Supabase...');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    // Atualizar cada local com coordenadas reais
    for (const [jsonName, coords] of coordinatesMap) {
      const mappedName = nameMapping[jsonName];
      
      if (!mappedName) {
        console.log(`⚠️  Nome não mapeado: ${jsonName}`);
        notFoundCount++;
        continue;
      }

      try {
        console.log(`Atualizando: ${mappedName}`);
        
        // Buscar o local no Supabase
        const { data: existingData, error: selectError } = await supabase
          .from('locations3')
          .select('id, titulo, localizacao')
          .eq('titulo', mappedName)
          .limit(1);

        if (selectError) {
          throw selectError;
        }

        if (existingData && existingData.length > 0) {
          // Atualizar com as coordenadas reais
          const newLocation = `${coords.latitude},${coords.longitude}`;
          
          const { data, error } = await supabase
            .from('locations3')
            .update({ 
              localizacao: newLocation
            })
            .eq('titulo', mappedName)
            .select();

          if (error) {
            throw error;
          }

          console.log(`✓ Atualizado: ${mappedName} -> ${newLocation}`);
          updatedCount++;
        } else {
          console.log(`⚠️  Local não encontrado no Supabase: ${mappedName}`);
          notFoundCount++;
        }

      } catch (error) {
        console.error(`✗ Erro ao atualizar ${mappedName}:`, error.message);
        errorCount++;
      }

      // Pequena pausa entre operações
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n=== RESUMO DA ATUALIZAÇÃO ===');
    console.log(`Atualizados: ${updatedCount}`);
    console.log(`Não encontrados: ${notFoundCount}`);
    console.log(`Erros: ${errorCount}`);
    console.log(`Total de coordenadas disponíveis: ${coordinatesMap.size}`);
    
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

// Executar a atualização
updateHealthLocationsWithRealCoordinates();