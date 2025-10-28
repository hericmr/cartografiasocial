// Script para verificar os tipos dos novos locais inseridos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNewLocationsTypes() {
  try {
    console.log('Verificando tipos dos novos locais inseridos...\n');
    
    // Buscar os últimos 30 registros (que incluem os novos)
    const { data, error } = await supabase
      .from('locations3')
      .select('id, titulo, localizacao, tipo')
      .order('id', { ascending: false })
      .limit(30);

    if (error) {
      throw error;
    }

    console.log(`Verificando ${data.length} registros mais recentes:\n`);
    
    // Agrupar por tipo
    const typesCount = {};
    const locationsByType = {};
    
    data.forEach(location => {
      const tipo = location.tipo || 'N/A';
      typesCount[tipo] = (typesCount[tipo] || 0) + 1;
      
      if (!locationsByType[tipo]) {
        locationsByType[tipo] = [];
      }
      locationsByType[tipo].push(location.titulo);
    });

    console.log('Contagem por tipo:');
    console.log('==================');
    Object.entries(typesCount).forEach(([tipo, count]) => {
      console.log(`${tipo}: ${count} locais`);
    });

    console.log('\nLocais por tipo:');
    console.log('================');
    Object.entries(locationsByType).forEach(([tipo, locais]) => {
      console.log(`\n${tipo}:`);
      locais.forEach(local => {
        console.log(`  - ${local}`);
      });
    });

    // Verificar mapeamento de tipos no componente Marcadores
    console.log('\nVerificação de mapeamento de tipos:');
    console.log('===================================');
    
    const tipoMapping = {
      'assistencia': 'ASSISTENCIA',
      'historico': 'HISTORICO', 
      'lazer': 'LAZER',
      'cultura': 'LAZER',
      'comunidades': 'COMUNIDADES',
      'educação': 'EDUCACAO',
      'religiao': 'RELIGIAO',
      'saude': 'SAUDE',
      'bairro': 'BAIRRO'
    };

    data.forEach(location => {
      const tipo = location.tipo ? location.tipo.toLowerCase() : 'N/A';
      const mappedType = tipoMapping[tipo];
      
      if (mappedType) {
        console.log(`✅ ${location.titulo} (${tipo}) -> ${mappedType}`);
      } else {
        console.log(`❌ ${location.titulo} (${tipo}) -> TIPO NÃO MAPEADO`);
      }
    });

  } catch (error) {
    console.error('Erro ao verificar tipos:', error);
  }
}

checkNewLocationsTypes();