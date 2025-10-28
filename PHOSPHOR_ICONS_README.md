# Sistema de Ícones Phosphor - Cartografia Social

Este documento descreve a implementação do sistema de ícones Phosphor Icons no projeto de cartografia social.

## 📦 Instalação

O Phosphor Icons foi instalado via npm:

```bash
npm install phosphor-react
```

## 🏗️ Arquitetura

O sistema de ícones foi implementado de forma modular e expansível:

```
src/components/icons/
├── IconWrapper.js          # Componente wrapper principal
├── SimpleLeafletIcon.js    # Funções simples para ícones Leaflet
├── LeafletIconFactory.js   # Factory avançado para ícones Leaflet
├── iconConfig.js           # Configuração centralizada
├── IconTest.js            # Componente de teste
├── PhosphorIconsDemo.js   # Demonstração completa
└── index.js               # Exportações principais
```

## 🎯 Componentes Principais

### 1. IconWrapper

Componente React modular para usar qualquer ícone Phosphor:

```jsx
import { IconWrapper } from './icons';

<IconWrapper
  name="MapPin"
  variant="fill"
  size="lg"
  color="#3B82F6"
  onClick={() => console.log('Clicked!')}
/>
```

**Props:**
- `name`: Nome do ícone Phosphor
- `variant`: Variante ('regular', 'bold', 'thin', 'light', 'duotone', 'fill')
- `size`: Tamanho ('xs', 'sm', 'md', 'lg', 'xl', 'xxl' ou número)
- `color`: Cor do ícone
- `className`: Classes CSS adicionais
- `onClick`: Função de clique
- `disabled`: Estado desabilitado

### 2. Funções Simples para Leaflet

Funções simplificadas para criar ícones Leaflet com Phosphor Icons:

```jsx
import { createPhosphorLeafletIcon, createLocationIcon } from './icons';

// Criar ícone personalizado
const customIcon = createPhosphorLeafletIcon('FirstAid', {
  variant: 'fill',
  color: '#00BCD4',
  size: 24,
  backgroundColor: '#ffffff',
  borderColor: '#00BCD4',
  animated: true
});

// Criar ícone baseado em tipo de localização
const locationIcon = createLocationIcon('saude', {
  backgroundColor: '#ffffff',
  borderColor: '#00BCD4'
});
```

### 3. LeafletIconFactory (Avançado)

Factory completo para criar ícones Leaflet compatíveis com Phosphor Icons:

```jsx
import { LeafletIconFactory } from './icons';

const iconFactory = new LeafletIconFactory();

// Criar ícone personalizado
const customIcon = iconFactory.createIcon({
  iconName: 'FirstAid',
  variant: 'fill',
  color: '#00BCD4',
  size: 24,
  backgroundColor: '#ffffff',
  borderColor: '#00BCD4',
  animated: true
});

// Criar ícone baseado em tipo de localização
const locationIcon = iconFactory.createLocationIcon('saude', {
  backgroundColor: '#ffffff',
  borderColor: '#00BCD4'
});
```

### 4. Configuração Centralizada

Sistema de configuração em `iconConfig.js` com:

- **LOCATION_TYPE_ICONS**: Ícones para tipos de localização
- **ACTION_ICONS**: Ícones para ações da interface
- **STATUS_ICONS**: Ícones para status
- **Funções helper**: `getLocationIcon()`, `getActionIcon()`, `getStatusIcon()`

## 🗺️ Implementação no Mapa

### Menu de Camadas

O `MenuCamadas.js` foi atualizado para usar ícones Phosphor:

```jsx
import { IconWrapper, getLocationIcon } from "./icons";

// Mapeamento de ícones para camadas
const getLayerIcon = (label) => {
  const iconMap = {
    "Saúde": { name: "FirstAid", variant: "fill", color: "#00BCD4" },
    "Educação": { name: "GraduationCap", variant: "fill", color: "#8B5CF6" },
    // ... outros mapeamentos
  };
  return iconMap[label] || { name: "MapPin", variant: "regular", color: "#6B7280" };
};
```

### Marcadores do Mapa

O `Marcadores.js` foi atualizado para usar o LeafletIconFactory:

```jsx
import { LeafletIconFactory, getLocationIcon } from "./icons";

const iconFactory = new LeafletIconFactory();

const DataPointType = Object.freeze({
  SAUDE: { 
    icon: iconFactory.createLocationIcon('saude', { 
      backgroundColor: '#ffffff', 
      borderColor: '#00BCD4' 
    }), 
    enabled: visibility.saude 
  },
  // ... outros tipos
});
```

## 🎨 Tipos de Localização Suportados

### Saúde
- `saude`, `saúde`, `hospital`, `posto_saude`, `farmacia`

### Educação
- `educacao`, `educação`, `escola`, `universidade`, `creche`

### Cultura e Lazer
- `cultura`, `lazer`, `teatro`, `museu`, `biblioteca`, `parque`, `turismo`, `monumento`, `memorial`, `esporte`

### Assistência Social
- `assistencia`, `assistência`

### Histórico
- `historico`, `histórico`, `patrimônio histórico`, `marco histórico`, `fortificação`, `engenharia`

### Comunidades
- `comunidades`

### Bairros
- `bairro`, `bairros`

### Religião
- `religiao`, `religioso`, `igreja`

## 🚀 Como Usar

### 1. Usar ícones em componentes React

```jsx
import { IconWrapper } from './components/icons';

function MyComponent() {
  return (
    <div>
      <IconWrapper name="MapPin" variant="fill" size="lg" color="#3B82F6" />
      <IconWrapper name="Heart" variant="regular" size="md" color="#EF4444" />
    </div>
  );
}
```

### 2. Usar ícones em marcadores Leaflet

#### Opção 1: Funções Simples (Recomendado)

```jsx
import { createPhosphorLeafletIcon, createLocationIcon } from './components/icons';

// Criar ícone personalizado
const customIcon = createPhosphorLeafletIcon('FirstAid', {
  variant: 'fill',
  color: '#00BCD4',
  size: 24,
  backgroundColor: '#ffffff',
  borderColor: '#00BCD4'
});

// Criar ícone baseado em tipo de localização
const locationIcon = createLocationIcon('saude', {
  backgroundColor: '#ffffff',
  borderColor: '#00BCD4'
});

// Usar em Marker
<Marker position={[lat, lng]} icon={locationIcon} />
```

#### Opção 2: Factory Avançado

```jsx
import { LeafletIconFactory } from './components/icons';

const iconFactory = new LeafletIconFactory();

// Criar ícone personalizado
const customIcon = iconFactory.createIcon({
  iconName: 'FirstAid',
  variant: 'fill',
  color: '#00BCD4',
  size: 24
});

// Usar em Marker
<Marker position={[lat, lng]} icon={customIcon} />
```

### 3. Usar configuração pré-definida

```jsx
import { getLocationIcon, getActionIcon } from './components/icons';

// Obter configuração de ícone de localização
const iconConfig = getLocationIcon('saude');
// { name: 'FirstAid', variant: 'fill', color: '#00BCD4', size: 'lg' }

// Obter configuração de ícone de ação
const actionConfig = getActionIcon('edit');
// { name: 'Pencil', variant: 'regular', size: 'md' }
```

## 🧪 Teste

### Teste Básico

Para testar a implementação, use o componente `IconTest`:

```jsx
import IconTest from './components/icons/IconTest';

// Adicione temporariamente ao seu App.js para testar
<IconTest />
```

### Demonstração Completa

Para ver uma demonstração completa com mapa interativo, use o componente `PhosphorIconsDemo`:

```jsx
import PhosphorIconsDemo from './components/PhosphorIconsDemo';

// Demonstração completa com mapa e controles
<PhosphorIconsDemo />
```

Este componente inclui:
- Mapa interativo com marcadores Phosphor
- Painel lateral com controles
- Diferentes tipos de localização
- Diferentes tamanhos e variantes
- Seleção interativa de ícones

## 🔧 Personalização

### Adicionar novos tipos de localização

1. Adicione a configuração em `iconConfig.js`:

```javascript
export const LOCATION_TYPE_ICONS = {
  // ... configurações existentes
  'novo_tipo': {
    name: 'NovoIcone',
    variant: 'fill',
    color: '#COR_HEX',
    size: 'lg'
  }
};
```

2. Use o novo tipo:

```jsx
const iconConfig = getLocationIcon('novo_tipo');
```

### Adicionar novos ícones de ação

```javascript
export const ACTION_ICONS = {
  // ... configurações existentes
  'nova_acao': { 
    name: 'NovoIcone', 
    variant: 'regular', 
    size: 'md' 
  }
};
```

## 📱 Responsividade

O sistema de ícones é totalmente responsivo e funciona em:

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Diferentes densidades de tela

## 🎯 Benefícios

1. **Modularidade**: Sistema expansível e fácil de manter
2. **Consistência**: Ícones padronizados em todo o projeto
3. **Performance**: Cache de ícones e otimizações
4. **Acessibilidade**: Suporte a aria-labels e estados
5. **Flexibilidade**: Fácil personalização e extensão
6. **Compatibilidade**: Funciona com React e Leaflet

## 🔄 Próximos Passos

1. **Testes**: Implementar testes unitários para os componentes
2. **Documentação**: Adicionar Storybook para documentação visual
3. **Otimização**: Implementar lazy loading para ícones
4. **Temas**: Suporte a temas claro/escuro
5. **Animações**: Mais opções de animação para ícones

## 🐛 Troubleshooting

### Ícone não aparece
- Verifique se o nome do ícone está correto
- Confirme se o Phosphor Icons está instalado
- Verifique o console para warnings

### Ícone com tamanho errado
- Use os tamanhos pré-definidos: 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'
- Ou use números para tamanhos customizados

### Cores não aplicadas
- Verifique se a cor está no formato hexadecimal (#RRGGBB)
- Confirme se a variante suporta cores (algumas variantes têm cores fixas)

## 📄 Licença

Este sistema de ícones utiliza o Phosphor Icons, que é licenciado sob a MIT License.