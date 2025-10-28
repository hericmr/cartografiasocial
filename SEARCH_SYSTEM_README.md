# Sistema de Busca Modular e Expansível

Este sistema de busca foi implementado de forma modular e expansível, permitindo buscar em diferentes tipos de conteúdo do site de forma unificada.

## Arquitetura

### Componentes Principais

1. **SearchService** (`src/services/searchService.js`)
   - Serviço central que gerencia todos os provedores de busca
   - Implementa busca paralela e ordenação por relevância
   - Gerencia história de busca e sugestões

2. **SearchContext** (`src/contexts/SearchContext.js`)
   - Contexto React para compartilhar estado de busca
   - Integra com o SearchService
   - Fornece hooks para componentes

3. **SearchModal** (`src/components/SearchModal.js`)
   - Interface de usuário para busca
   - Suporte a navegação por teclado
   - Exibição de resultados e sugestões

4. **Provedores de Busca**
   - `LocationSearchProvider`: Busca em locais da cartografia
   - `WelcomeSearchProvider`: Busca em painéis de boas-vindas
   - Fácil adição de novos provedores

## Como Usar

### Busca Básica
```jsx
import { useSearch } from '../contexts/SearchContext';

const MyComponent = () => {
  const { openSearch, searchResults, isSearching } = useSearch();
  
  return (
    <button onClick={openSearch}>
      Buscar
    </button>
  );
};
```

### Busca Programática
```jsx
import searchService from '../services/searchService';

// Busca em todos os provedores
const results = await searchService.search('termo de busca');

// Busca rápida (primeiros 5 resultados)
const quickResults = await searchService.quickSearch('termo');

// Busca por tipo específico
const locationResults = await searchService.searchByType('termo', 'locations');
```

## Como Adicionar Novos Provedores de Busca

### 1. Criar o Provedor

```javascript
// src/services/myContentSearchProvider.js
class MyContentSearchProvider {
  constructor() {
    this.name = 'Meu Conteúdo';
    this.priority = 5; // 0-10, maior = mais prioridade
  }

  async search(query, options = {}) {
    // Implementar lógica de busca
    const results = this.searchInMyContent(query);
    
    return results.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: 'my-content',
      category: item.category,
      score: this.calculateScore(item, query),
      data: item,
      url: `/my-content/${item.id}`
    }));
  }

  calculateScore(item, query) {
    // Implementar cálculo de relevância
    let score = 0;
    if (item.title.toLowerCase().includes(query.toLowerCase())) {
      score += 30;
    }
    return score;
  }
}

export default MyContentSearchProvider;
```

### 2. Registrar o Provedor

```javascript
// No SearchContext.js
import MyContentSearchProvider from '../services/myContentSearchProvider';

useEffect(() => {
  const myProvider = new MyContentSearchProvider();
  searchService.registerProvider('my-content', myProvider);
}, []);
```

### 3. Adicionar Dados ao Contexto

```javascript
// No App.js
<SearchProvider 
  locations={dataPoints} 
  welcomePanel={welcomePanelConfig}
  myContent={myContentData}  // Novos dados
>
```

## Funcionalidades

### Busca Inteligente
- Busca em múltiplos campos (título, descrição, categoria)
- Cálculo de relevância baseado em correspondências
- Destaque de termos encontrados nos resultados

### Sugestões
- História de busca local
- Sugestões baseadas em títulos de conteúdo
- Navegação por teclado

### Interface Responsiva
- Modal adaptável para desktop e mobile
- Animações suaves com Framer Motion
- Estados de carregamento e erro

### Expansibilidade
- Fácil adição de novos tipos de conteúdo
- Sistema de prioridades para ordenação
- Busca paralela em todos os provedores

## Personalização

### Estilos
Os estilos podem ser personalizados modificando as classes Tailwind no `SearchModal.js`:

```jsx
// Cores de categoria
const getCategoryColor = (category) => {
  const colors = {
    'lazer': 'bg-blue-100 text-blue-800',
    'assistencia': 'bg-green-100 text-green-800',
    // Adicionar novas categorias
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};
```

### Configurações
Modifique o `SearchService` para ajustar:
- Número máximo de itens no histórico
- Limite de resultados por busca
- Timeout para debounce

## Exemplos de Uso

### Busca em Tempo Real
```jsx
const { searchQuery, searchResults } = useSearch();

useEffect(() => {
  if (searchQuery.length > 2) {
    // Busca automática já implementada
    console.log('Resultados:', searchResults);
  }
}, [searchQuery, searchResults]);
```

### Filtros Personalizados
```jsx
// Busca apenas em locais
const locationResults = await searchService.searchByType('termo', 'locations');

// Busca com limite personalizado
const limitedResults = await searchService.search('termo', { limit: 10 });
```

### Integração com Navegação
```jsx
const handleResultClick = (result) => {
  if (result.url) {
    navigate(result.url);
  }
  closeSearch();
};
```

## Performance

- Busca paralela em todos os provedores
- Debounce de 300ms para evitar buscas excessivas
- Cache de história no localStorage
- Lazy loading de resultados

## Acessibilidade

- Navegação completa por teclado
- Suporte a leitores de tela
- Foco gerenciado adequadamente
- Indicadores visuais de estado

Este sistema foi projetado para ser facilmente expansível e manter boa performance mesmo com muitos provedores de busca registrados.