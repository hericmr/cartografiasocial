const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para ler todos os arquivos JSON da pasta inserções
async function readAllCoordinateFiles() {
  const insercoesDir = path.join(__dirname, 'inserções');
  const files = fs.readdirSync(insercoesDir).filter(file => file.endsWith('.json'));
  
  console.log(`Encontrados ${files.length} arquivos na pasta inserções:`, files);
  
  let allCoordinates = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(insercoesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      console.log(`\nProcessando arquivo: ${file}`);
      console.log(`Total de registros no arquivo: ${data.length}`);
      
      // Filtrar apenas coordenadas válidas (não nulas)
      const validCoordinates = data.filter(item => 
        item.latitude !== null && 
        item.longitude !== null && 
        item.status === 'encontrado'
      );
      
      console.log(`Coordenadas válidas encontradas: ${validCoordinates.length}`);
      
      allCoordinates = allCoordinates.concat(validCoordinates);
      
    } catch (error) {
      console.error(`Erro ao processar arquivo ${file}:`, error.message);
    }
  }
  
  // Remover duplicatas baseado no nome
  const uniqueCoordinates = allCoordinates.filter((item, index, self) => 
    index === self.findIndex(t => t.nome === item.nome)
  );
  
  console.log(`\nTotal de coordenadas únicas válidas: ${uniqueCoordinates.length}`);
  
  return uniqueCoordinates;
}

// Função para inserir coordenadas no Supabase
async function insertCoordinatesToSupabase(coordinates) {
  console.log('\nIniciando inserção no Supabase...');
  
  try {
    // Primeiro, limpar dados existentes de saúde (opcional)
    console.log('Limpando dados existentes de saúde...');
    const { error: deleteError } = await supabase
      .from('locations3')
      .delete()
      .eq('tipo', 'saude'); // Deleta apenas registros de saúde
    
    if (deleteError) {
      console.error('Erro ao limpar dados existentes:', deleteError);
    } else {
      console.log('Dados existentes de saúde removidos com sucesso');
    }
    
    // Preparar dados para inserção no formato da tabela locations3
    const dataToInsert = coordinates.map(item => ({
      titulo: item.nome,
      tipo: 'saude',
      descricao_detalhada: `${item.endereco}${item.telefone ? '. Tel: ' + item.telefone : ''}${item.email ? '. ' + item.email : ''}. Horário de Funcionamento: De segunda a sexta-feira, das 7 às 17 horas`,
      localizacao: `${item.latitude},${item.longitude}`,
      links: null,
      imagens: null,
      audio: null
    }));
    
    console.log(`Preparando para inserir ${dataToInsert.length} registros...`);
    
    // Inserir em lotes para evitar problemas de tamanho
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < dataToInsert.length; i += batchSize) {
      const batch = dataToInsert.slice(i, i + batchSize);
      
      console.log(`Inserindo lote ${Math.floor(i/batchSize) + 1} (${batch.length} registros)...`);
      
      const { data, error } = await supabase
        .from('locations3')
        .insert(batch);
      
      if (error) {
        console.error(`Erro ao inserir lote ${Math.floor(i/batchSize) + 1}:`, error);
      } else {
        insertedCount += batch.length;
        console.log(`Lote ${Math.floor(i/batchSize) + 1} inserido com sucesso`);
      }
    }
    
    console.log(`\n✅ Inserção concluída! Total de registros inseridos: ${insertedCount}`);
    
  } catch (error) {
    console.error('Erro geral na inserção:', error);
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando processo de inserção de coordenadas reais...\n');
    
    // Ler todos os arquivos de coordenadas
    const coordinates = await readAllCoordinateFiles();
    
    if (coordinates.length === 0) {
      console.log('❌ Nenhuma coordenada válida encontrada!');
      return;
    }
    
    // Mostrar algumas coordenadas como exemplo
    console.log('\n📋 Exemplos de coordenadas encontradas:');
    coordinates.slice(0, 3).forEach((coord, index) => {
      console.log(`${index + 1}. ${coord.nome}`);
      console.log(`   Endereço: ${coord.endereco}`);
      console.log(`   Coordenadas: ${coord.latitude}, ${coord.longitude}`);
      console.log('');
    });
    
    // Inserir no Supabase
    await insertCoordinatesToSupabase(coordinates);
    
    console.log('\n🎉 Processo concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no processo principal:', error);
  }
}

// Executar o script
if (require.main === module) {
  main();
}

module.exports = { readAllCoordinateFiles, insertCoordinatesToSupabase };