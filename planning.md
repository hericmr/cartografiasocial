# Plano de Migração: Leaflet → MapLibre GL JS

## 📋 Visão Geral

Este documento detalha o plano de migração do projeto Cartografia Social de Santos de **Leaflet** para **MapLibre GL JS**, dividido em passos pequenos e gerenciáveis.

**Objetivo:** Migrar completamente a biblioteca de mapas mantendo todas as funcionalidades existentes.

**Por que MapLibre?**
- ✅ Open-source e gratuito (fork do Mapbox GL JS)
- ✅ Não requer token de API
- ✅ Mesma API do Mapbox (fácil migração)
- ✅ Performance excelente
- ✅ Totalmente compatível com react-map-gl

---

## 🎯 Pré-requisitos

- [x] MapLibre GL JS instalado (`maplibre-gl`)
- [x] React Map GL instalado (`react-map-gl`)
- [x] ~~Token de acesso~~ **NÃO NECESSÁRIO** (MapLibre é gratuito!)
- [x] Backup do código atual

---

## 📦 Dependências Necessárias

```bash
npm install maplibre-gl react-map-gl
npm install --save-dev @types/maplibre-gl  # Se usar TypeScript
```

**Nota:** `react-map-gl` funciona tanto com Mapbox quanto MapLibre. Usaremos MapLibre.

**Remover após migração:**
```bash
npm uninstall leaflet react-leaflet react-leaflet-cluster
```

---

## 🗺️ Estrutura de Componentes a Migrar

1. **MapaBase.js** - Componente base do mapa
2. **MarcadoresClusterizados.js** - Marcadores com clustering
3. **Bairros.js** - Camada GeoJSON de bairros
4. **MapControls.js** - Controles do mapa (zoom, etc.)
5. **CustomIcon.js** - Ícones personalizados dos marcadores
6. **MapClickHandler.js** - Handlers de eventos do mapa
7. **AddLocationPanel/components/MapSection.js** - Mapa no painel de adicionar local

---

## 📝 Passos Detalhados da Migração

### **FASE 1: Preparação e Configuração**

#### Passo 1.1: Instalar dependências
- [x] Executar `npm install maplibre-gl react-map-gl`
- [x] Verificar instalação com `npm list maplibre-gl react-map-gl`
- [x] ~~Criar arquivo `.env`~~ **NÃO NECESSÁRIO** (MapLibre não precisa de token)

#### Passo 1.2: ~~Configurar token~~ ✅ PULAR ESTE PASSO
- [x] ~~Criar conta no Mapbox~~ **NÃO NECESSÁRIO**
- [x] ~~Obter token de acesso~~ **NÃO NECESSÁRIO**
- [x] **MapLibre é totalmente gratuito e open-source!**
- [x] Documentar que não é necessário token

#### Passo 1.3: Atualizar imports CSS
- [x] Remover imports do Leaflet CSS em `src/index.css`
- [x] Adicionar import do MapLibre CSS (`@import 'maplibre-gl/dist/maplibre-gl.css';`)

---

### **FASE 2: Migração do Componente Base (MapaBase.js)**

#### Passo 2.1: Criar novo MapaBase com MapLibre
- [x] Criar backup de `src/components/MapaBase.js` como `MapaBase.leaflet.backup.js`
- [x] Substituir imports para MapLibre

#### Passo 2.2: Migrar estado do mapa
- [x] Substituir `MapContainer` por `Map` do react-map-gl
- [x] Converter coordenadas: Leaflet usa `[lat, lng]`, MapLibre usa `[lng, lat]`
- [x] Migrar props (longitude, latitude, zoom)

#### Passo 2.3: Configurar estilo do mapa
- [x] Configurar tile layer customizado (ArcGIS)
- [x] Configurar `mapStyle` prop com estilo customizado

#### Passo 2.4: Implementar callback de "map ready"
- [x] Implementar `onLoad` callback do Map
- [x] Manter funcionalidade de `onReady` callback
- [x] **Importante:** Não precisa passar `mapboxAccessToken` prop (MapLibre não requer)

#### Passo 2.5: Configurar controles padrão
- [x] Configurar `attributionControl`
- [x] Configurar `navigationControl` (zoom, compass)
- [x] Usar `maplibregl` ao invés de `mapboxgl` nas referências

---

### **FASE 3: Migração de Marcadores (MarcadoresClusterizados.js)**

#### Passo 3.1: Entender clustering no MapLibre
- [x] Pesquisar como funciona clustering no MapLibre GL
- [x] MapLibre usa clustering nativo via GeoJSON Source com `cluster: true`
- [x] Não precisa de biblioteca externa como `react-leaflet-cluster`
- [x] **Vantagem:** Clustering nativo é mais performático que plugins

#### Passo 3.2: Criar componente de marcador customizado
- [x] Criar componente `CustomMarker.js` para substituir ícones do Leaflet
- [x] Usar `Marker` do react-map-gl com HTML customizado
- [x] Manter cores e estilos dos marcadores existentes

#### Passo 3.3: Converter estrutura de dados
- [x] Converter `dataPoints` para formato GeoJSON FeatureCollection
- [x] Cada ponto vira uma Feature com geometry Point
- [x] Adicionar propriedades (tipo, cor, etc.) em `properties`

#### Passo 3.4: Implementar clustering
- [x] ~~Criar Source com `type: 'geojson'` e `cluster: true`~~ **NOTA:** Implementação final usa componentes Marker individuais
- [x] ~~Configurar `clusterRadius`, `clusterMaxZoom`~~ **NOTA:** Não aplicável com abordagem atual
- [x] ~~Criar Layers para clusters, contagem e marcadores individuais~~ **NOTA:** Usando componentes Marker do react-map-gl (mais simples e confiável)
- [x] **DECISÃO:** Usar componentes Marker individuais ao invés de clustering nativo para melhor compatibilidade e simplicidade

#### Passo 3.5: Implementar cores por tipo
- [x] Criar função para determinar cor baseada no tipo
- [x] Aplicar cores nos clusters e marcadores
- [x] Manter mesma lógica de visibilidade por tipo

#### Passo 3.6: Implementar eventos de clique
- [x] Substituir `eventHandlers` do Leaflet por eventos do MapLibre
- [x] ~~Implementar clique em cluster (zoom in)~~ **NOTA:** Não aplicável - marcadores individuais
- [x] Implementar clique em marcador (abrir painel) - usando `onClick` prop do Marker
- [x] Manter callback `onClick` existente

#### Passo 3.7: Implementar tooltips
- [x] Usar `Popup` do react-map-gl para tooltips
- [x] Mostrar título e tipo ao hover
- [x] Manter estilo similar ao atual

---

### **FASE 4: Migração de GeoJSON (Bairros.js)**

#### Passo 4.1: Entender renderização de GeoJSON no MapLibre
- [x] MapLibre renderiza GeoJSON via `Source` e `Layer` (mesma API do Mapbox)
- [x] Usar `fill`, `line`, `symbol` layers conforme necessário
- [x] **Compatibilidade:** MapLibre é 100% compatível com especificação do Mapbox

#### Passo 4.2: Criar Source para bairros
- [x] Criar componente que usa `Source` com `type: 'geojson'`
- [x] Passar dados GeoJSON dos bairros
- [x] Configurar `data` prop

#### Passo 4.3: Criar Layers de estilo
- [x] Criar Layer tipo `fill` para preenchimento
- [x] Criar Layer tipo `line` para bordas
- [x] Aplicar cores baseadas em `DENSITY` property
- [x] Usar `paint` prop para estilos

#### Passo 4.4: Implementar interatividade
- [x] Substituir `onEachFeature` por eventos do MapLibre
- [x] Implementar hover (mudar cor ao passar mouse)
- [x] Implementar click (zoom para bairro)
- [x] Usar `setFeatureState` para estados de hover e seleção

#### Passo 4.5: Implementar popup de bairro
- [x] Usar eventos do mapa para interatividade
- [x] Mostrar nome do bairro via tooltip/hover
- [x] Posicionar corretamente

---

### **FASE 5: Migração de Controles (MapControls.js)**

#### Passo 5.1: Verificar hooks necessários
- [x] Substituir `useMap()` do Leaflet
- [x] Usar `useMap()` do react-map-gl (retorna instância do MapLibre)
- [x] Usar refs e callbacks do componente Map

#### Passo 5.2: Migrar controles de zoom
- [x] Implementar botões de zoom in/out
- [x] Usar `map.zoomTo()` com delta
- [x] Usar `NavigationControl` do MapLibre

#### Passo 5.3: Manter outros controles
- [x] Controle de tamanho de texto (não relacionado ao mapa)
- [x] Botão de camadas (menu)
- [x] Botão de welcome modal

---

### **FASE 6: Migração de Ícones Customizados (CustomIcon.js)**

#### Passo 6.1: Entender sistema de ícones no MapLibre
- [x] MapLibre não usa DivIcon como Leaflet
- [x] Opções: HTML markers, símbolos SVG, ou imagens

#### Passo 6.2: Criar componente de marcador HTML
- [x] Criar componente `CustomMarker.js` que renderiza HTML
- [x] Usar `Marker` do react-map-gl com `anchor="bottom"`
- [x] Manter SVG e estilos CSS existentes

#### Passo 6.3: Migrar estilos CSS
- [x] Manter animações (bounce, pulse)
- [x] Adaptar estilos para funcionar com MapLibre
- [x] Testar que animações funcionam corretamente

#### Passo 6.4: Criar factory de ícones
- [x] Criar `CustomMarker.js` com função `getColorByType`
- [x] Manter mesma API (cores, tipos)
- [x] Facilitar uso nos marcadores

---

### **FASE 7: Componentes Auxiliares**

#### Passo 7.1: Migrar MapClickHandler.js
- [x] Substituir `useMapEvents` do Leaflet
- [x] Usar eventos do Map via `useMap()` hook
- [x] Manter mesma funcionalidade

#### Passo 7.2: Migrar AddLocationPanel MapSection
- [x] Aplicar mesma migração do MapaBase
- [x] Manter funcionalidade de seleção de localização
- [x] Testar que coordenadas são capturadas corretamente

---

### **FASE 8: Ajustes e Otimizações**

#### Passo 8.1: Otimizar performance
- [x] Verificar uso de `useMemo` e `useCallback` (implementado em MarcadoresClusterizados)
- [ ] Otimizar re-renders desnecessários
- [ ] Testar com muitos marcadores

#### Passo 8.2: Ajustar estilos responsivos
- [x] Verificar comportamento em mobile
- [x] Ajustar zoom inicial para mobile/desktop (11 para mobile, 13 para desktop)
- [ ] Testar em diferentes tamanhos de tela

#### Passo 8.3: Corrigir bugs de coordenadas
- [x] Verificar que todas coordenadas estão [lng, lat]
- [x] Testar que marcadores aparecem nos lugares corretos
- [ ] Verificar bounds e fitBounds

#### Passo 8.4: Melhorias de UX implementadas
- [x] Implementar marcadores SVG estilizados (formato de pino com animações)
- [x] Criar sistema de acesso admin via atalho de teclado (Ctrl+Shift+A)
- [x] Otimizar URL com códigos curtos para layers (ex: `bl,a,h` ao invés de nomes completos)
- [x] Refatorar marcadores para usar componentes Marker do react-map-gl (mais simples e confiável)

---

### **FASE 9: Limpeza e Remoção**

#### Passo 9.1: Remover dependências antigas
- [x] Remover `leaflet` do package.json
- [x] Remover `react-leaflet` do package.json
- [x] Remover `react-leaflet-cluster` do package.json
- [x] Remover `leaflet-gpx` do package.json
- [x] Executar `npm uninstall` para cada

#### Passo 9.2: Remover imports não usados
- [x] Buscar por todos imports do Leaflet
- [x] Remover imports não utilizados
- [x] Limpar código comentado
- [x] Remover dependência de `CustomIcon.js` de `constants.js`

#### Passo 9.3: Remover arquivos de backup e obsoletos
- [x] Remover `MapaBase.leaflet.backup.js`
- [x] Remover `Marcadores.js` (não usado)
- [x] Remover `MarcadoresSimples.js` (não usado)
- [x] Remover `PhosphorIconsDemo.js` (não usado)
- [x] Remover `ConteudoCartografia.js` (não usado)
- [x] Remover `CustomIcon.js` (não usado)
- [x] Remover `SimpleLeafletIcon.js` (não usado)
- [x] Remover `LeafletIconFactory.js` (não usado)
- [x] Remover estilos CSS do Leaflet (`MapaSantos.css` e `index.css`)

---

### **FASE 10: Testes e Validação**

#### Passo 10.1: Testes funcionais
- [x] Mapa carrega corretamente
- [x] Marcadores aparecem nas posições corretas
- [ ] ~~Clustering funciona~~ **NOTA:** Marcadores agora usam componentes Marker individuais (não clustering nativo)
- [x] Clique em marcador abre painel
- [ ] ~~Clique em cluster faz zoom~~ **NOTA:** Não aplicável - marcadores individuais sem clustering
- [x] GeoJSON de bairros renderiza
- [x] Interatividade de bairros funciona
- [x] Controles de zoom funcionam
- [x] Menu de camadas funciona
- [x] Filtros de visibilidade funcionam
- [x] Atalho de teclado admin funciona (Ctrl+Shift+A)
- [x] URL com códigos curtos funciona corretamente

#### Passo 10.2: Testes de performance
- [ ] Mapa carrega rápido
- [ ] Sem lag ao interagir
- [ ] Zoom suave
- [ ] Muitos marcadores não quebram performance

#### Passo 10.3: Testes de compatibilidade
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (iOS/Android)

#### Passo 10.4: Testes de regressão
- [ ] Todas funcionalidades antigas ainda funcionam
- [ ] Nenhuma feature foi quebrada
- [ ] UX mantida ou melhorada

---

## 🔧 Recursos e Referências

### Documentação Oficial
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js-docs/)
- [React Map GL Docs](https://visgl.github.io/react-map-gl/) (funciona com MapLibre)
- [MapLibre Style Specification](https://maplibre.org/maplibre-style-spec/) (compatível com Mapbox)
- [MapLibre GitHub](https://github.com/maplibre/maplibre-gl-js)

### Por que MapLibre?
- ✅ **100% Gratuito** - Sem limites de uso
- ✅ **Open Source** - Código aberto e comunidade ativa
- ✅ **Compatível** - Mesma API do Mapbox GL JS
- ✅ **Performance** - Mesma performance do Mapbox
- ✅ **Sem Token** - Não precisa de autenticação

### Conceitos Importantes
- **Coordenadas:** MapLibre usa `[longitude, latitude]` (inverso do Leaflet)
- **Clustering:** Nativo via GeoJSON Source com `cluster: true`
- **Styling:** Via `paint` e `layout` properties nos Layers
- **Interatividade:** Via eventos do Map e `setFeatureState`
- **Token:** **NÃO NECESSÁRIO** com MapLibre (diferente do Mapbox)

### Exemplos de Código

#### Mapa Básico com MapLibre
```javascript
import Map from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

<Map
  mapLib={maplibregl}  // Importante: passar maplibregl
  initialViewState={{
    longitude: -46.35,
    latitude: -23.955,
    zoom: 14
  }}
  style={{ width: '100%', height: '100%' }}
  mapStyle="https://demotiles.maplibre.org/style.json"  // Estilo gratuito
  // OU usar estilo customizado com tiles do ArcGIS
/>
```

#### Clustering
```javascript
<Source
  id="markers"
  type="geojson"
  data={geojsonData}
  cluster={true}
  clusterRadius={50}
>
  <Layer
    id="clusters"
    type="circle"
    paint={{
      'circle-color': '#22c55e',
      'circle-radius': 20
    }}
  />
</Source>
```

---

## ⚠️ Pontos de Atenção

1. **Token:** ✅ **NÃO NECESSÁRIO** com MapLibre (vantagem sobre Mapbox!)
2. **Coordenadas:** Sempre verificar ordem [lng, lat] vs [lat, lng]
3. **Performance:** MapLibre tem mesma performance do Mapbox, clustering precisa ser bem configurado
4. **Estilos:** MapLibre usa sistema de estilos compatível com Mapbox, pode precisar ajustar cores/visual
5. **Eventos:** Sistema de eventos diferente do Leaflet, precisa adaptar handlers
6. **mapLib prop:** Importante passar `mapLib={maplibregl}` no componente Map
7. **Estilos gratuitos:** Usar estilos do MapLibre ou criar customizado (não precisa de token)

---

## 📊 Checklist de Progresso

- [x] Fase 1: Preparação (100%)
- [x] Fase 2: MapaBase (100%)
- [x] Fase 3: Marcadores (100%)
- [x] Fase 4: GeoJSON (100%)
- [x] Fase 5: Controles (100%)
- [x] Fase 6: Ícones (100%)
- [x] Fase 7: Auxiliares (100%)
- [x] Fase 8: Otimizações (75% - faltam testes de performance e responsividade)
- [x] Fase 9: Limpeza (100%)
- [ ] Fase 10: Testes (30% - testes funcionais básicos feitos)

**Progresso Total: 85%**

---

## 🎯 Próximos Passos Imediatos

1. ✅ Criar este documento de planejamento
2. ✅ Instalar dependências do MapLibre (`maplibre-gl`)
3. ✅ ~~Obter/configurar token~~ **NÃO NECESSÁRIO** (MapLibre é gratuito!)
4. ✅ Migração completa dos componentes principais
5. ✅ Implementar melhorias de UX (marcadores SVG, acesso admin, URL otimizada)
6. ⏭️ Testar funcionalidades em diferentes dispositivos e navegadores
7. ⏭️ Remover dependências antigas do Leaflet
8. ⏭️ Otimizar performance com muitos marcadores
9. ⏭️ Testes de regressão completos

---

## 📝 Notas Adicionais

- Este plano pode ser ajustado conforme necessário durante a migração
- Cada fase deve ser testada antes de prosseguir para a próxima
- Fazer commits frequentes para facilitar rollback se necessário
- Considerar criar branch separada para a migração

---

**Última atualização:** 2024
**Versão:** 1.1

---

## ✅ Componentes Migrados

### Componentes Principais
- ✅ **MapaBase.js** - Componente base do mapa migrado para MapLibre
- ✅ **MarcadoresClusterizados.js** - Marcadores usando componentes Marker do react-map-gl (simplificado e confiável)
- ✅ **Bairros.js** - Camada GeoJSON de bairros migrada
- ✅ **MapControls.js** - Controles do mapa migrados
- ✅ **MapClickHandler.js** - Handlers de eventos migrados
- ✅ **AddLocationPanel/MapSection.js** - Mapa no painel de adicionar local migrado

### Componentes Auxiliares
- ✅ **CustomMarker.js** - Novo componente de marcador customizado para MapLibre
- ✅ **AdminAccessButton.js** - Componente para acesso admin via atalho de teclado (Ctrl+Shift+A)
- ✅ **index.css** - CSS atualizado para MapLibre

### Melhorias Implementadas
- ✅ **Marcadores SVG estilizados** - Marcadores em formato de pino com animações bounce e pulse
- ✅ **Sistema de acesso admin** - Atalho de teclado para acessar painel administrativo
- ✅ **Otimização de URL** - Códigos curtos para layers (ex: `bl,a,h` ao invés de nomes completos)
- ✅ **Zoom inicial ajustado** - Zoom 11 (mobile) e 13 (desktop) para melhor visualização inicial

### Componentes que ainda usam Leaflet (não críticos)
- ⚠️ **Marcadores.js** - Componente antigo (não usado)
- ⚠️ **MarcadoresSimples.js** - Componente antigo (não usado)
- ⚠️ **PhosphorIconsDemo.js** - Componente de demonstração
- ⚠️ **CustomIcon.js** - Mantido para compatibilidade (não usado nos componentes principais)

