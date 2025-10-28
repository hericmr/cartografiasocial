// Script para inserir dados do CSV na tabela locations3 do Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para ler e processar o CSV
async function readCSVData() {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream('novos_dados_para_inserção.csv')
      .pipe(csv())
      .on('data', (data) => {
        // Mapear os campos do CSV para a estrutura da tabela locations3
        const location = {
          titulo: data.name,
          descricao_detalhada: data.description,
          localizacao: `${data.latitude},${data.longitude}`,
          tipo: data.category,
          imagens: data.image_url || null,
          links: null,
          audio: null
        };
        
        results.push(location);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Função para verificar se um local já existe
async function checkLocationExists(titulo) {
  const { data, error } = await supabase
    .from('locations3')
    .select('id, titulo')
    .eq('titulo', titulo)
    .limit(1);

  if (error) {
    throw error;
  }

  return data && data.length > 0;
}

// Função para inserir um local
async function insertLocation(location) {
  const { data, error } = await supabase
    .from('locations3')
    .insert([location])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// Função principal
async function insertCSVData() {
  try {
    console.log('Iniciando leitura do CSV...');
    
    // Ler dados do CSV
    const csvData = await readCSVData();
    console.log(`CSV lido com sucesso. Total de registros: ${csvData.length}`);
    
    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    console.log('\nIniciando inserção dos dados...');

    for (let i = 0; i < csvData.length; i++) {
      const location = csvData[i];
      console.log(`Processando ${i + 1}/${csvData.length}: ${location.titulo}`);

      try {
        // Verificar se o local já existe
        const exists = await checkLocationExists(location.titulo);
        
        if (exists) {
          console.log(`⏭️  Pulando: ${location.titulo} (já existe)`);
          skippedCount++;
        } else {
          // Inserir o local
          await insertLocation(location);
          console.log(`✅ Inserido: ${location.titulo}`);
          insertedCount++;
        }

      } catch (error) {
        console.error(`❌ Erro ao processar ${location.titulo}:`, error.message);
        errorCount++;
      }

      // Pequena pausa entre operações para não sobrecarregar o Supabase
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n=== RESUMO ===');
    console.log(`Total de registros no CSV: ${csvData.length}`);
    console.log(`Inseridos: ${insertedCount}`);
    console.log(`Pulados (já existiam): ${skippedCount}`);
    console.log(`Erros: ${errorCount}`);
    console.log(`Total processados: ${insertedCount + skippedCount + errorCount}`);
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar a inserção
insertCSVData();
