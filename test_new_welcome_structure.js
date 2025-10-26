// Script para testar a nova estrutura do painel de boas-vindas
// Execute este script no console do navegador

const testNewWelcomeStructure = async () => {
  console.log('🧪 Testando nova estrutura do painel de boas-vindas...');
  
  try {
    // Testar se a tabela existe e tem dados
    console.log('📊 Verificando tabela welcome_panels...');
    const { data: panels, error: panelsError } = await supabase
      .from('welcome_panels')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (panelsError) throw panelsError;
    
    console.log(`✅ Encontrados ${panels.length} painéis`);
    console.log('📋 Lista de painéis:', panels.map(p => ({
      id: p.id,
      title: p.title,
      is_active: p.is_active,
      version: p.version,
      created_at: p.created_at
    })));

    // Testar a view active_welcome_panel
    console.log('👁️ Testando view active_welcome_panel...');
    const { data: activePanel, error: activeError } = await supabase
      .from('active_welcome_panel')
      .select('*')
      .single();
    
    if (activeError) throw activeError;
    
    if (activePanel) {
      console.log('✅ Painel ativo encontrado:', {
        id: activePanel.id,
        title: activePanel.title,
        content_length: activePanel.content.length,
        theme: activePanel.theme,
        version: activePanel.version
      });
    } else {
      console.log('⚠️ Nenhum painel ativo encontrado');
    }

    // Testar função get_active_welcome_panel
    console.log('🔧 Testando função get_active_welcome_panel...');
    const { data: functionResult, error: functionError } = await supabase
      .rpc('get_active_welcome_panel');
    
    if (functionError) {
      console.log('⚠️ Função não disponível (normal se não foi criada):', functionError.message);
    } else {
      console.log('✅ Função funcionando:', functionResult);
    }

    // Testar criação de novo painel
    console.log('➕ Testando criação de novo painel...');
    const testPanel = {
      title: 'Painel de Teste',
      content: '<h1>Teste</h1><p>Este é um painel de teste criado automaticamente.</p>',
      theme: 'default',
      show_close_button: true,
      display_conditions: {
        first_visit_only: true,
        show_on_mobile: true,
        show_on_desktop: true
      },
      created_by: 'test_script'
    };

    const { data: newPanel, error: createError } = await supabase
      .from('welcome_panels')
      .insert([{
        ...testPanel,
        is_active: false // Não ativar para não interferir
      }])
      .select()
      .single();

    if (createError) throw createError;
    
    console.log('✅ Novo painel criado:', {
      id: newPanel.id,
      title: newPanel.title,
      version: newPanel.version
    });

    // Limpar painel de teste
    console.log('🧹 Limpando painel de teste...');
    const { error: deleteError } = await supabase
      .from('welcome_panels')
      .delete()
      .eq('id', newPanel.id);

    if (deleteError) throw deleteError;
    console.log('✅ Painel de teste removido');

    console.log('🎉 Todos os testes passaram! A nova estrutura está funcionando corretamente.');
    
    // Mostrar estatísticas finais
    const { data: finalStats } = await supabase
      .from('welcome_panels')
      .select('is_active, version')
      .order('created_at', { ascending: false });

    const stats = finalStats.reduce((acc, panel) => {
      acc.total++;
      if (panel.is_active) acc.active++;
      acc.versions.add(panel.version);
      return acc;
    }, { total: 0, active: 0, versions: new Set() });

    console.log('📈 Estatísticas finais:', {
      total_panels: stats.total,
      active_panels: stats.active,
      unique_versions: stats.versions.size
    });

  } catch (error) {
    console.error('❌ Erro no teste:', error);
    console.log('💡 Verifique se:');
    console.log('   - A tabela welcome_panels foi criada');
    console.log('   - As permissões do Supabase estão corretas');
    console.log('   - O script setup_welcome_panel_table.sql foi executado');
  }
};

// Executar teste se estiver no navegador
if (typeof window !== 'undefined' && typeof supabase !== 'undefined') {
  testNewWelcomeStructure();
} else {
  console.log('Execute este script no console do navegador após carregar a aplicação');
}