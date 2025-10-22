// Script para atualizar a descrição do Quilombo José Theodoro dos Santos Pereira (Garrafão)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

const updatedDescription = "Quilombo José Theodoro dos Santos Pereira, conhecido como Santos Garrafão, foi um português que ajudou a manter o quilombo do Jabaquara e auxiliou abolicionistas. Santos Pereira ajudou a manter o quilombo do Jabaquara e comunicava aos abolicionistas a descida de escravos fugidos pela Serra do Mar. O quilombo do Garrafão ficava onde hoje está a Praça Antônio Teles, no Centro Histórico.";

async function updateLocationDescription() {
  try {
    console.log('Atualizando descrição do Quilombo José Theodoro dos Santos Pereira (Garrafão)...');
    
    const { data, error } = await supabase
      .from('locations3')
      .update({ 
        descricao_detalhada: updatedDescription
      })
      .eq('titulo', 'Quilombo José Theodoro dos Santos Pereira (Garrafão)')
      .select();

    if (error) {
      throw error;
    }

    console.log(`✓ Descrição atualizada com sucesso!`);
    console.log(`Nova descrição: ${updatedDescription}`);
    
  } catch (err) {
    console.error('Erro ao atualizar descrição:', err);
  }
}

// Executar a atualização
updateLocationDescription();