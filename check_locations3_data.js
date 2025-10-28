// Script para verificar os dados na tabela locations3
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLocations3Data() {
  try {
    console.log('Verificando dados na tabela locations3...\n');
    
    // Buscar todos os registros
    const { data, error } = await supabase
      .from('locations3')
      .select('id, titulo, localizacao, tipo')
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`Total de registros na tabela: ${data.length}\n`);
    
    // Verificar registros com coordenadas válidas
    const validCoordinates = data.filter(location => {
      if (!location.localizacao) return false;
      const [lat, lng] = location.localizacao.split(',').map(coord => parseFloat(coord.trim()));
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });

    console.log(`Registros com coordenadas válidas: ${validCoordinates.length}`);
    console.log(`Registros sem coordenadas ou inválidas: ${data.length - validCoordinates.length}\n`);

    // Mostrar os últimos 10 registros inseridos
    console.log('Últimos 10 registros inseridos:');
    console.log('=====================================');
    
    data.slice(0, 10).forEach((location, index) => {
      console.log(`${index + 1}. ${location.titulo}`);
      console.log(`   Coordenadas: ${location.localizacao || 'N/A'}`);
      console.log(`   Tipo: ${location.tipo || 'N/A'}`);
      console.log(`   ID: ${location.id}`);
      console.log('');
    });

    // Verificar registros problemáticos
    const problematicRecords = data.filter(location => {
      if (!location.localizacao) return true;
      const [lat, lng] = location.localizacao.split(',').map(coord => parseFloat(coord.trim()));
      return isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0;
    });

    if (problematicRecords.length > 0) {
      console.log('Registros com problemas de coordenadas:');
      console.log('=======================================');
      problematicRecords.forEach((location, index) => {
        console.log(`${index + 1}. ${location.titulo} - Coordenadas: ${location.localizacao || 'N/A'}`);
      });
    }

  } catch (error) {
    console.error('Erro ao verificar dados:', error);
  }
}

checkLocations3Data();