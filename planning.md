# Plano de Melhorias do Painel de Edição - Cartografia Social

## Análise Atual

### Problemas Identificados

1. **Segurança**
   - Senha administrativa armazenada em variável de ambiente (vulnerável)
   - Ausência de autenticação robusta
   - Falta de validação de permissões no backend
   - Dados sensíveis expostos no frontend

2. **Formulários**
   - Validação básica e inconsistente
   - Falta de feedback visual adequado
   - Ausência de validação em tempo real
   - Campos obrigatórios não claramente identificados
   - Falta de sanitização de dados

3. **Experiência do Usuário**
   - Interface não responsiva em alguns componentes
   - Falta de loading states consistentes
   - Mensagens de erro genéricas
   - Ausência de confirmações para ações destrutivas

4. **Arquitetura**
   - Componentes com responsabilidades misturadas
   - Falta de separação entre lógica de negócio e apresentação
   - Ausência de gerenciamento de estado centralizado
   - Código duplicado entre componentes

## Plano de Implementação

### Fase 1: Segurança e Autenticação (Prioridade Alta)

#### 1.1 Implementar Sistema de Criptografia
- **Biblioteca**: `crypto-js` ou `node-forge`
- **Implementações**:
  - Criptografia de senhas com bcrypt
  - Hash de dados sensíveis
  - Criptografia de dados em trânsito
  - Geração de tokens JWT seguros

#### 1.2 Sistema de Autenticação Robusto
```javascript
// Estrutura proposta
const authService = {
  login: async (credentials) => {
    // Validação de credenciais
    // Geração de JWT
    // Armazenamento seguro de sessão
  },
  logout: () => {
    // Limpeza de tokens
    // Invalidação de sessão
  },
  validateToken: (token) => {
    // Verificação de JWT
    // Validação de expiração
  }
}
```

#### 1.3 Middleware de Autorização
- Verificação de permissões por rota
- Validação de tokens em cada requisição
- Rate limiting para prevenir ataques

### Fase 2: Melhorias nos Formulários (Prioridade Alta)

#### 2.1 Biblioteca de Validação
- **Implementar**: `react-hook-form` + `yup` ou `zod`
- **Benefícios**:
  - Validação em tempo real
  - Performance otimizada
  - Validação server-side e client-side
  - Mensagens de erro personalizadas

#### 2.2 Componentes de Formulário Reutilizáveis
```javascript
// Estrutura proposta
const FormField = {
  TextInput: ({ name, label, validation, ...props }) => {},
  SelectInput: ({ name, label, options, validation, ...props }) => {},
  RichTextEditor: ({ name, label, validation, ...props }) => {},
  FileUpload: ({ name, label, accept, validation, ...props }) => {},
  MapPicker: ({ name, label, validation, ...props }) => {}
}
```

#### 2.3 Validação Avançada
- Validação de coordenadas geográficas
- Sanitização de HTML no RichTextEditor
- Validação de URLs
- Validação de arquivos (tipo, tamanho)
- Validação de formatos de áudio/vídeo

### Fase 3: Melhorias na Interface (Prioridade Média)

#### 3.1 Design System
- **Implementar**: `@headlessui/react` + `@tailwindcss/forms`
- **Componentes**:
  - Botões com estados (loading, disabled, success, error)
  - Modais acessíveis
  - Tooltips informativos
  - Notificações toast
  - Skeleton loaders

#### 3.2 Responsividade
- Layout adaptativo para mobile/tablet/desktop
- Navegação otimizada para touch
- Formulários em steps para mobile

#### 3.3 Acessibilidade
- Navegação por teclado
- Screen reader support
- Contraste adequado
- Foco visível
- ARIA labels

### Fase 4: Arquitetura e Performance (Prioridade Média)

#### 4.1 Gerenciamento de Estado
- **Implementar**: `zustand` ou `redux-toolkit`
- **Estrutura**:
```javascript
const useLocationStore = create((set, get) => ({
  locations: [],
  loading: false,
  error: null,
  fetchLocations: async () => {},
  addLocation: async (location) => {},
  updateLocation: async (id, updates) => {},
  deleteLocation: async (id) => {}
}))
```

#### 4.2 Separação de Responsabilidades
- **Services**: Lógica de negócio e comunicação com API
- **Hooks**: Lógica de estado e side effects
- **Components**: Apenas apresentação
- **Utils**: Funções auxiliares e validações

#### 4.3 Otimizações
- Lazy loading de componentes
- Memoização de componentes pesados
- Debounce em campos de busca
- Paginação de listas grandes
- Cache de dados

### Fase 5: Funcionalidades Avançadas (Prioridade Baixa)

#### 5.1 Upload de Mídia
- Upload de imagens com preview
- Compressão automática de imagens
- Upload de áudio com waveform
- Integração com CDN

#### 5.2 Editor Avançado
- **Implementar**: `@tiptap/react` ou `quill`
- **Funcionalidades**:
  - Formatação de texto rica
  - Inserção de links
  - Upload de imagens inline
  - Modo de visualização

#### 5.3 Auditoria e Logs
- Log de todas as ações administrativas
- Versionamento de edições
- Histórico de mudanças
- Backup automático

## Estrutura de Arquivos Proposta

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminPanel.js
│   │   ├── LocationTable.js
│   │   ├── LocationForm.js
│   │   └── DeleteConfirmation.js
│   ├── forms/
│   │   ├── FormField.js
│   │   ├── TextInput.js
│   │   ├── SelectInput.js
│   │   ├── RichTextEditor.js
│   │   ├── MapPicker.js
│   │   └── FileUpload.js
│   ├── ui/
│   │   ├── Button.js
│   │   ├── Modal.js
│   │   ├── Toast.js
│   │   └── LoadingSpinner.js
│   └── auth/
│       ├── LoginForm.js
│       ├── ProtectedRoute.js
│       └── AuthProvider.js
├── hooks/
│   ├── useAuth.js
│   ├── useLocations.js
│   ├── useForm.js
│   └── useValidation.js
├── services/
│   ├── authService.js
│   ├── locationService.js
│   ├── fileService.js
│   └── validationService.js
├── utils/
│   ├── validation.js
│   ├── encryption.js
│   ├── formatters.js
│   └── constants.js
├── store/
│   ├── authStore.js
│   ├── locationStore.js
│   └── uiStore.js
└── types/
    ├── auth.js
    ├── location.js
    └── form.js
```

## Cronograma de Implementação

### Semana 1-2: Segurança
- [ ] Implementar criptografia de senhas
- [ ] Sistema de autenticação JWT
- [ ] Middleware de autorização
- [ ] Proteção de rotas

### Semana 3-4: Formulários
- [ ] Integrar react-hook-form
- [ ] Implementar validação com yup/zod
- [ ] Criar componentes de formulário reutilizáveis
- [ ] Melhorar validação de dados

### Semana 5-6: Interface
- [ ] Implementar design system
- [ ] Melhorar responsividade
- [ ] Adicionar acessibilidade
- [ ] Implementar notificações

### Semana 7-8: Arquitetura
- [ ] Implementar gerenciamento de estado
- [ ] Refatorar componentes
- [ ] Otimizar performance
- [ ] Implementar testes

## Métricas de Sucesso

### Segurança
- [ ] 100% das senhas criptografadas
- [ ] Zero vulnerabilidades de autenticação
- [ ] Todas as rotas protegidas
- [ ] Logs de auditoria completos

### Usabilidade
- [ ] Tempo de carregamento < 2s
- [ ] Taxa de erro de formulário < 5%
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Responsividade em todos os dispositivos

### Performance
- [ ] Bundle size < 500KB
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90

## Dependências Necessárias

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "yup": "^1.4.0",
    "crypto-js": "^4.2.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "zustand": "^4.4.0",
    "@headlessui/react": "^1.7.0",
    "@tiptap/react": "^2.1.0",
    "react-dropzone": "^14.2.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.0",
    "jest": "^29.0.0",
    "cypress": "^13.0.0"
  }
}
```

## Considerações de Segurança

1. **Criptografia de Dados**
   - Usar AES-256 para dados sensíveis
   - Implementar salt único para cada senha
   - Rotacionar chaves de criptografia periodicamente

2. **Autenticação**
   - JWT com expiração curta (15-30 min)
   - Refresh tokens para renovação
   - Rate limiting para tentativas de login
   - 2FA para administradores

3. **Validação**
   - Sanitização de todos os inputs
   - Validação server-side obrigatória
   - Escape de HTML em outputs
   - Validação de tipos de arquivo

4. **Auditoria**
   - Log de todas as ações administrativas
   - Monitoramento de tentativas de acesso
   - Alertas para atividades suspeitas
   - Backup regular dos logs

Este plano garante que o painel de edição siga as melhores práticas de segurança, usabilidade e performance, proporcionando uma experiência robusta e segura para os administradores do sistema.

---

# Plano de Implementação: Painel de Boas-vindas Customizável com Wikitext

## Objetivo
Implementar um painel de boas-vindas customizável que pode ser editado pelo administrador usando wikitext, permitindo formatação rica e conteúdo dinâmico.

## Análise da Estrutura Atual

### Componentes Identificados
1. **App.js** - Roteamento principal com LoadingScreen
2. **ConteudoCartografia.js** - Página de conteúdo com lista de locais
3. **AdminPanel.js** - Painel administrativo existente
4. **PainelInformacoes.js** - Painel lateral de informações dos locais

### Oportunidades de Integração
- O LoadingScreen atual pode ser substituído por um painel de boas-vindas mais rico
- O AdminPanel pode ser expandido para incluir edição do painel de boas-vindas
- A página inicial pode exibir o painel de boas-vindas antes de mostrar o mapa

## Fase 1: Pesquisa e Seleção de Biblioteca Wikitext (Prioridade Alta)

### 1.1 Opções de Biblioteca
- **react-markdown** (já instalado) - Para Markdown básico
- **@uiw/react-markdown-editor** - Editor visual de Markdown
- **react-quill** (já instalado) - Editor WYSIWYG
- **@tiptap/react** - Editor moderno e extensível
- **wikitext-parser** - Parser específico para Wikitext

### 1.2 Recomendação
Usar **@tiptap/react** + **react-markdown** para:
- Editor visual rico no painel administrativo
- Renderização de Markdown no frontend
- Suporte a formatação avançada
- Extensões para wikitext específico

## Fase 2: Estrutura de Banco de Dados (Prioridade Alta)

### 2.1 Tabela de Configurações
```sql
CREATE TABLE site_configurations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text', -- text, html, markdown, json
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir configuração inicial
INSERT INTO site_configurations (key, value, type) 
VALUES ('welcome_panel_content', '# Bem-vindo à Cartografia Social\n\nEste é o painel de boas-vindas customizável.', 'markdown');
```

### 2.2 Campos de Configuração
- `welcome_panel_content` - Conteúdo principal do painel
- `welcome_panel_title` - Título do painel
- `welcome_panel_enabled` - Se o painel está ativo
- `welcome_panel_style` - Estilos customizados (JSON)

## Fase 3: Componentes Frontend (Prioridade Alta)

### 3.1 WelcomePanel Component
```javascript
// src/components/WelcomePanel.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../supabaseClient';

const WelcomePanel = ({ isVisible, onClose }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWelcomeContent();
  }, []);

  const fetchWelcomeContent = async () => {
    const { data } = await supabase
      .from('site_configurations')
      .select('*')
      .eq('key', 'welcome_panel_content');
    
    if (data?.[0]) {
      setContent(data[0].value);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3.2 WelcomePanelEditor Component
```javascript
// src/components/admin/WelcomePanelEditor.js
import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '../../supabaseClient';

const WelcomePanelEditor = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const editor = new Editor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const saveContent = async () => {
    setSaving(true);
    try {
      await supabase
        .from('site_configurations')
        .upsert([
          { key: 'welcome_panel_content', value: content, type: 'markdown' },
          { key: 'welcome_panel_title', value: title, type: 'text' }
        ]);
      alert('Conteúdo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar conteúdo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título do Painel
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg"
          placeholder="Digite o título do painel de boas-vindas"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conteúdo do Painel
        </label>
        <div className="border rounded-lg min-h-[400px]">
          {/* Editor Tiptap será renderizado aqui */}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={saveContent}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Conteúdo'}
        </button>
      </div>
    </div>
  );
};
```

## Fase 4: Integração com AdminPanel (Prioridade Média)

### 4.1 Adicionar Aba de Configurações
```javascript
// Modificar AdminPanel.js
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('locations');
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Painel de Administração
        </h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('locations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'locations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Locais
              </button>
              <button
                onClick={() => setActiveTab('welcome')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'welcome'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Painel de Boas-vindas
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'locations' && (
          // Conteúdo atual do AdminPanel
        )}
        
        {activeTab === 'welcome' && (
          <WelcomePanelEditor />
        )}
      </div>
    </div>
  );
};
```

## Fase 5: Integração com App Principal (Prioridade Média)

### 5.1 Modificar App.js
```javascript
// Adicionar estado para controlar exibição do painel de boas-vindas
const AppContent = () => {
  const [showWelcomePanel, setShowWelcomePanel] = useState(false);
  const [welcomePanelConfig, setWelcomePanelConfig] = useState(null);

  useEffect(() => {
    // Verificar se deve mostrar o painel de boas-vindas
    const shouldShowWelcome = localStorage.getItem('welcomePanelShown') !== 'true';
    if (shouldShowWelcome) {
      fetchWelcomeConfig();
    }
  }, []);

  const fetchWelcomeConfig = async () => {
    const { data } = await supabase
      .from('site_configurations')
      .select('*')
      .in('key', ['welcome_panel_content', 'welcome_panel_title', 'welcome_panel_enabled']);
    
    const config = data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    if (config.welcome_panel_enabled === 'true') {
      setWelcomePanelConfig(config);
      setShowWelcomePanel(true);
    }
  };

  const closeWelcomePanel = () => {
    setShowWelcomePanel(false);
    localStorage.setItem('welcomePanelShown', 'true');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onConteudoClick={() => navigate('/conteudo')} />
      
      {/* Welcome Panel */}
      {showWelcomePanel && welcomePanelConfig && (
        <WelcomePanel 
          content={welcomePanelConfig.welcome_panel_content}
          title={welcomePanelConfig.welcome_panel_title}
          onClose={closeWelcomePanel}
        />
      )}
      
      <Routes>
        {/* Rotas existentes */}
      </Routes>
    </div>
  );
};
```

## Fase 6: Dependências e Instalação (Prioridade Alta)

### 6.1 Novas Dependências
```json
{
  "dependencies": {
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "@tiptap/extension-link": "^2.1.0",
    "@tiptap/extension-image": "^2.1.0",
    "react-markdown": "^9.0.3" // já instalado
  }
}
```

### 6.2 Scripts de Instalação
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image
```

## Fase 7: Funcionalidades Avançadas (Prioridade Baixa)

### 7.1 Personalização Visual
- Seletor de temas para o painel
- Configuração de cores e fontes
- Layout responsivo customizável

### 7.2 Funcionalidades de Wikitext
- Suporte a links internos
- Tabelas formatadas
- Listas numeradas e com marcadores
- Citações e blocos de código
- Imagens com legendas

### 7.3 Analytics e Controle
- Contador de visualizações do painel
- Controle de frequência de exibição
- A/B testing de diferentes versões

## Cronograma de Implementação

### Semana 1: Base e Dependências
- [ ] Instalar dependências do Tiptap
- [ ] Criar tabela de configurações no Supabase
- [ ] Implementar WelcomePanel básico

### Semana 2: Editor Administrativo
- [ ] Implementar WelcomePanelEditor
- [ ] Integrar com AdminPanel existente
- [ ] Testar funcionalidades de edição

### Semana 3: Integração Frontend
- [ ] Modificar App.js para exibir painel
- [ ] Implementar controle de exibição
- [ ] Testar fluxo completo

### Semana 4: Refinamentos
- [ ] Melhorar estilos e responsividade
- [ ] Adicionar validações
- [ ] Testes de integração

## Métricas de Sucesso

### Funcionalidade
- [ ] Administrador pode editar conteúdo do painel
- [ ] Painel é exibido na primeira visita
- [ ] Conteúdo é salvo e carregado corretamente
- [ ] Editor suporta formatação rica

### Usabilidade
- [ ] Interface intuitiva para edição
- [ ] Preview em tempo real
- [ ] Responsividade em dispositivos móveis
- [ ] Performance adequada

### Segurança
- [ ] Validação de conteúdo HTML
- [ ] Sanitização de inputs
- [ ] Controle de acesso administrativo
- [ ] Backup de configurações

Este plano garante uma implementação gradual e robusta do painel de boas-vindas customizável, mantendo a compatibilidade com o sistema existente e proporcionando uma experiência rica para administradores e usuários.