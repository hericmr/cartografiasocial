-- Script de migração: site_configurations -> welcome_panels
-- Execute este script no Supabase SQL Editor APÓS criar a nova tabela

-- Verificar se existem dados na tabela antiga
SELECT 
  'Dados na tabela antiga:' as info,
  COUNT(*) as total_configs
FROM site_configurations 
WHERE key IN ('welcome_panel_content', 'welcome_panel_title', 'welcome_panel_enabled');

-- Migrar dados da tabela antiga para a nova (se existirem)
INSERT INTO welcome_panels (
  title,
  content,
  is_active,
  theme,
  show_close_button,
  display_conditions,
  created_by,
  version
)
SELECT 
  COALESCE(
    (SELECT value FROM site_configurations WHERE key = 'welcome_panel_title' LIMIT 1),
    'Bem-vindo à Cartografia Social'
  ) as title,
  COALESCE(
    (SELECT value FROM site_configurations WHERE key = 'welcome_panel_content' LIMIT 1),
    '# Bem-vindo à Cartografia Social

Este é o **painel de boas-vindas** customizável da nossa plataforma.

## O que você pode encontrar aqui:

- 🗺️ **Mapa interativo** com locais de interesse
- 📍 **Informações detalhadas** sobre cada local
- 🎵 **Conteúdo multimídia** (áudio, vídeo, imagens)
- 🔗 **Links úteis** e recursos adicionais

## Como navegar:

1. **Clique nos marcadores** no mapa para ver informações
2. **Use o menu** para acessar diferentes seções
3. **Explore o conteúdo** na página de catálogo

---

*Este painel pode ser personalizado pelos administradores do sistema.*'
  ) as content,
  COALESCE(
    (SELECT value = 'true' FROM site_configurations WHERE key = 'welcome_panel_enabled' LIMIT 1),
    true
  ) as is_active,
  'default' as theme,
  true as show_close_button,
  '{"first_visit_only": true, "show_on_mobile": true, "show_on_desktop": true}'::jsonb as display_conditions,
  'migration' as created_by,
  1 as version
WHERE EXISTS (
  SELECT 1 FROM site_configurations 
  WHERE key IN ('welcome_panel_content', 'welcome_panel_title', 'welcome_panel_enabled')
);

-- Verificar se a migração foi bem-sucedida
SELECT 
  'Migração concluída!' as status,
  COUNT(*) as total_panels,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_panels
FROM welcome_panels;

-- Mostrar o painel ativo após migração
SELECT 
  id,
  title,
  LEFT(content, 100) || '...' as content_preview,
  is_active,
  created_at,
  version
FROM welcome_panels 
WHERE is_active = true;

-- Opcional: Remover dados antigos (descomente se quiser limpar a tabela antiga)
-- DELETE FROM site_configurations 
-- WHERE key IN ('welcome_panel_content', 'welcome_panel_title', 'welcome_panel_enabled');

-- Verificar se a view está funcionando
SELECT * FROM active_welcome_panel;