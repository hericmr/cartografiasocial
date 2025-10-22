// Script para inserir o Quilombo José Theodoro dos Santos Pereira (Garrafão)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

const newLocation = {
  titulo: "Quilombo José Theodoro dos Santos Pereira (Garrafão)",
  tipo: "historico",
  descricao_detalhada: "Quilombo José Theodoro dos Santos Pereira, conhecido como Santos Garrafão, foi um português que ajudou a manter o quilombo do Jabaquara e auxiliou abolicionistas. Ele deu nome ao quilombo do Garrafão, que ficava onde hoje é a Praça Antônio Teles, no Centro Histórico de Santos.",
  localizacao: "-23.9326167,-46.3242661",
  links: null,
  imagens: null,
  audio: null
};

async function insertNewLocation() {
  try {
    console.log('Iniciando inserção do Quilombo José Theodoro dos Santos Pereira (Garrafão)...');
    
    // Primeiro, verifica se já existe um local com o mesmo título
    const { data: existingData, error: selectError } = await supabase
      .from('locations3')
      .select('id, titulo, localizacao')
      .eq('titulo', newLocation.titulo)
      .limit(1);

    if (selectError) {
      throw selectError;
    }

    if (existingData && existingData.length > 0) {
      // Se existe, atualiza as coordenadas
      const { data, error } = await supabase
        .from('locations3')
        .update({ 
          localizacao: newLocation.localizacao,
          descricao_detalhada: newLocation.descricao_detalhada,
          tipo: newLocation.tipo,
          links: newLocation.links,
          imagens: newLocation.imagens,
          audio: newLocation.audio
        })
        .eq('titulo', newLocation.titulo)
        .select();

      if (error) {
        throw error;
      }

      console.log(`✓ Atualizado: ${newLocation.titulo}`);
      console.log(`Localização: ${newLocation.localizacao}`);
    } else {
      // Se não existe, insere novo
      const { data, error } = await supabase
        .from('locations3')
        .insert([newLocation])
        .select();

      if (error) {
        throw error;
      }

      console.log(`✓ Inserido: ${newLocation.titulo}`);
      console.log(`Localização: ${newLocation.localizacao}`);
    }

    console.log('\n=== INSERÇÃO CONCLUÍDA ===');
    console.log(`Título: ${newLocation.titulo}`);
    console.log(`Tipo: ${newLocation.tipo}`);
    console.log(`Coordenadas: ${newLocation.localizacao}`);
    console.log(`Descrição: ${newLocation.descricao_detalhada}`);
    
  } catch (err) {
    console.error('Erro ao inserir local:', err);
  }
}

// Executar a inserção
insertNewLocation();