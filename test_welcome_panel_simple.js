const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWelcomePanel() {
  console.log('🧪 Testando painel de boas-vindas...\n');

  try {
    // 1. Verificar se há painéis ativos
    console.log('1. Verificando painéis ativos...');
    const { data: activePanels, error: activeError } = await supabase
      .from('welcome_panels')
      .select('*')
      .eq('is_active', true);

    if (activeError) {
      console.log('❌ Erro ao buscar painéis ativos:', activeError.message);
      return;
    }

    console.log(`✅ Painéis ativos encontrados: ${activePanels.length}`);
    
    if (activePanels.length > 0) {
      const panel = activePanels[0];
      console.log('📋 Painel ativo:');
      console.log(`   ID: ${panel.id}`);
      console.log(`   Título: ${panel.title}`);
      console.log(`   Ativo: ${panel.is_active}`);
      console.log(`   Conteúdo (primeiros 200 chars): ${panel.content.substring(0, 200)}...`);
    }

    // 2. Testar a consulta que o App.js usa
    console.log('\n2. Testando consulta do App.js...');
    const { data: appData, error: appError } = await supabase
      .from('welcome_panels')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (appError) {
      console.log('❌ Erro na consulta do App.js:', appError.message);
    } else {
      console.log('✅ Consulta do App.js funcionando');
      console.log(`   Painel encontrado: ${appData.title}`);
    }

    // 3. Verificar localStorage
    console.log('\n3. Simulando verificação do localStorage...');
    console.log('   localStorage.getItem("welcomePanelShown"):', 'true' || 'false');
    console.log('   Se for "true", o painel NÃO será mostrado');
    console.log('   Se for "false" ou null, o painel SERÁ mostrado');

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testWelcomePanel();
}

module.exports = { testWelcomePanel };