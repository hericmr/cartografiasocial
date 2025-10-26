# Painel de Boas-vindas Customizável

## Visão Geral

O painel de boas-vindas é um componente customizável que permite aos administradores criar e editar uma mensagem de boas-vindas rica em formatação para os usuários da plataforma.

## Funcionalidades

### ✨ Para Usuários
- **Exibição automática** na primeira visita
- **Conteúdo rico** com formatação Markdown
- **Interface responsiva** para todos os dispositivos
- **Botão de fechamento** para não exibir novamente

### 🛠️ Para Administradores
- **Editor visual** com toolbar completa
- **Preview em tempo real** do conteúdo
- **Controle de ativação/desativação**
- **Salvamento automático** no banco de dados

## Estrutura Técnica

### Componentes

1. **WelcomePanel.js** - Componente de exibição
2. **WelcomePanelEditor.js** - Editor administrativo
3. **AdminPanel.js** - Integração com painel admin

### Banco de Dados

Tabela principal: `welcome_panels`

```sql
CREATE TABLE welcome_panels (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Bem-vindo',
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  theme VARCHAR(50) DEFAULT 'default',
  custom_styles JSONB,
  show_close_button BOOLEAN DEFAULT true,
  auto_close_seconds INTEGER DEFAULT NULL,
  display_conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  version INTEGER DEFAULT 1
);
```

### Recursos Avançados

- **Versionamento**: Cada edição cria uma nova versão
- **Histórico**: Acesso a todas as versões anteriores
- **Temas**: Suporte a diferentes temas visuais
- **Condições de Exibição**: Controle quando o painel aparece
- **Estilos Customizados**: JSONB para estilos personalizados
- **Auto-close**: Fechamento automático opcional

## Como Usar

### 1. Configuração Inicial

Execute os scripts SQL no Supabase:

```bash
# 1. Criar nova tabela (execute primeiro)
# Execute o arquivo setup_welcome_panel_table.sql no Supabase SQL Editor

# 2. Migrar dados existentes (se houver)
# Execute o arquivo migrate_welcome_panel_data.sql no Supabase SQL Editor
```

### 2. Acesso ao Editor

1. Acesse `/admin` no painel administrativo
2. Clique na aba "Painel de Boas-vindas" para editar
3. Clique na aba "Histórico" para gerenciar versões
4. Use o editor visual para criar o conteúdo

### 3. Funcionalidades do Editor

#### Formatação de Texto
- **Negrito** e *itálico*
- Títulos (H1, H2, H3)
- Listas numeradas e com marcadores
- Citações e blocos de código

#### Elementos Especiais
- Links externos
- Imagens
- Separadores horizontais

#### Controles
- Preview em tempo real
- Salvar alterações (cria nova versão)
- Ativar/desativar painel
- Gerenciar histórico de versões
- Ativar versões anteriores
- Excluir versões antigas

## Personalização

### Estilos CSS

O painel usa classes Tailwind CSS que podem ser customizadas:

```css
/* Cores do painel */
.welcome-panel {
  @apply bg-white rounded-lg shadow-xl;
}

/* Títulos */
.welcome-panel h1 {
  @apply text-3xl font-bold text-gray-800;
}

/* Conteúdo */
.welcome-panel p {
  @apply text-gray-700 mb-4 leading-relaxed;
}
```

### Conteúdo Padrão

O painel vem com conteúdo de exemplo que pode ser editado:

```markdown
# Bem-vindo à Cartografia Social

Este é o **painel de boas-vindas** customizável da nossa plataforma.

## O que você pode encontrar aqui:

- 🗺️ **Mapa interativo** com locais de interesse
- 📍 **Informações detalhadas** sobre cada local
- 🎵 **Conteúdo multimídia** (áudio, vídeo, imagens)
- 🔗 **Links úteis** e recursos adicionais
```

## Dependências

### Bibliotecas Utilizadas

```json
{
  "@tiptap/react": "^2.1.0",
  "@tiptap/starter-kit": "^2.1.0",
  "@tiptap/extension-link": "^2.1.0",
  "@tiptap/extension-image": "^2.1.0",
  "react-markdown": "^9.0.3"
}
```

### Instalação

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

## Troubleshooting

### Problemas Comuns

1. **Painel não aparece**
   - Verifique se `welcome_panel_enabled` está como 'true'
   - Limpe o localStorage: `localStorage.removeItem('welcomePanelShown')`

2. **Editor não carrega**
   - Verifique se as dependências do Tiptap estão instaladas
   - Confirme se o Supabase está configurado corretamente

3. **Conteúdo não salva**
   - Verifique as permissões do Supabase
   - Confirme se a tabela `site_configurations` existe

### Logs de Debug

```javascript
// Verificar configurações atuais
const checkConfig = async () => {
  const { data } = await supabase
    .from('site_configurations')
    .select('*')
    .in('key', ['welcome_panel_content', 'welcome_panel_title', 'welcome_panel_enabled']);
  console.log('Configurações:', data);
};

// Limpar cache do painel
localStorage.removeItem('welcomePanelShown');
```

## Roadmap

### Próximas Funcionalidades

- [ ] Temas visuais customizáveis
- [ ] A/B testing de versões
- [ ] Analytics de visualizações
- [ ] Suporte a vídeos inline
- [ ] Templates pré-definidos

### Melhorias Planejadas

- [ ] Editor de arrastar e soltar
- [ ] Suporte a widgets interativos
- [ ] Integração com CMS externo
- [ ] Versionamento de conteúdo

## Suporte

Para dúvidas ou problemas:

1. Verifique este README
2. Consulte os logs do console
3. Teste com o script `test_welcome_panel.js`
4. Verifique a configuração do Supabase

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024