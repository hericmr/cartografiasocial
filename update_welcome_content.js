const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://kbekziboncpvjqffmhlx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZWt6aWJvbmNwdmpxZmZtaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjc2OTYsImV4cCI6MjA1Njg0MzY5Nn0.FTtiCL3VKLdrcR9aKs3tF6AwgdoyKo604rMBdpWRLko';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateWelcomeContent() {
  console.log('🔄 Atualizando conteúdo do painel de boas-vindas...\n');

  const newContent = `# Sobre o site

Esta é uma **cartografia social** que busca mapear territorialidades, lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de comunidades e locais carregados de memória e história.

## Os pontos estão representados por:

- **🎯 Lazer**: equipamentos sociais, culturais e de lazer
- **🏥 Assistência**: unidades de assistência social e saúde  
- **🏛️ Históricos**: lugares históricos e de memória
- **🏘️ Comunidades**: territórios de comunidades
- **🎓 Educação**: escolas e unidades de ensino
- **⛪ Religião**: estabelecimentos religiosos

## Histórias mapeadas:

Entre os elementos mapeados, estão histórias relacionadas à **escravidão e lutas do povo negro**, à **opressão e resistência à ditadura empresarial-militar (1964-1984)**, e às **lutas que moldaram e continuam moldando a identidade da região**.

## Sobre os materiais:

Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelas(os) **estudantes de Serviço Social da UNIFESP** do vespertino e noturno durante a **Unidade Curricular de Política Social 2**, em **2024 e 2025**.

---

### Como navegar:

1. **Clique nos marcadores** no mapa para ver informações detalhadas
2. **Use o menu** para acessar diferentes seções
3. **Explore o conteúdo** na página de catálogo
4. **Ouça os áudios** disponíveis em cada local

*Este painel pode ser personalizado pelos administradores do sistema.*`;

  try {
    // Desativar painel atual
    console.log('1. Desativando painel atual...');
    const { error: deactivateError } = await supabase
      .from('welcome_panels')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      console.log('⚠️  Erro ao desativar painel atual:', deactivateError.message);
    } else {
      console.log('✅ Painel atual desativado');
    }

    // Criar novo painel com conteúdo atualizado
    console.log('\n2. Criando novo painel com conteúdo atualizado...');
    const { data: newPanel, error: insertError } = await supabase
      .from('welcome_panels')
      .insert([{
        title: 'Sobre o site',
        content: newContent,
        is_active: true,
        theme: 'default',
        show_close_button: true,
        auto_close_seconds: null,
        display_conditions: {
          first_visit_only: true,
          show_on_mobile: true,
          show_on_desktop: true
        },
        created_by: 'admin'
      }])
      .select();

    if (insertError) {
      console.log('❌ Erro ao criar novo painel:', insertError.message);
      return;
    }

    console.log('✅ Novo painel criado com sucesso');
    console.log(`   ID: ${newPanel[0].id}`);
    console.log(`   Título: ${newPanel[0].title}`);
    console.log(`   Ativo: ${newPanel[0].is_active}`);

    // Verificar se está funcionando
    console.log('\n3. Verificando painel ativo...');
    const { data: activePanel, error: checkError } = await supabase
      .from('welcome_panels')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (checkError) {
      console.log('❌ Erro ao verificar painel ativo:', checkError.message);
    } else {
      console.log('✅ Painel ativo verificado');
      console.log(`   Título: ${activePanel.title}`);
      console.log(`   Conteúdo (primeiros 100 chars): ${activePanel.content.substring(0, 100)}...`);
    }

    console.log('\n🎉 Conteúdo do painel de boas-vindas atualizado com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateWelcomeContent();
}

module.exports = { updateWelcomeContent };