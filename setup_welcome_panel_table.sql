-- Script para criar tabela específica do painel de boas-vindas
-- Execute este script no Supabase SQL Editor

-- Criar tabela específica para o painel de boas-vindas
CREATE TABLE IF NOT EXISTS welcome_panels (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Bem-vindo',
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  theme VARCHAR(50) DEFAULT 'default', -- default, dark, light, custom
  custom_styles JSONB, -- Para estilos customizados
  show_close_button BOOLEAN DEFAULT true,
  auto_close_seconds INTEGER DEFAULT NULL, -- NULL = não fecha automaticamente
  display_conditions JSONB, -- Condições para exibição
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255), -- ID do usuário que criou
  version INTEGER DEFAULT 1 -- Para versionamento
);

-- Inserir painel padrão
INSERT INTO welcome_panels (
  title, 
  content, 
  is_active, 
  theme, 
  show_close_button,
  display_conditions,
  created_by
) VALUES (
  'Bem-vindo à Cartografia Social',
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

*Este painel pode ser personalizado pelos administradores do sistema.*',
  true,
  'default',
  true,
  '{"first_visit_only": true, "show_on_mobile": true, "show_on_desktop": true}',
  'system'
);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_welcome_panels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at e version
DROP TRIGGER IF EXISTS update_welcome_panels_updated_at ON welcome_panels;
CREATE TRIGGER update_welcome_panels_updated_at
    BEFORE UPDATE ON welcome_panels
    FOR EACH ROW
    EXECUTE FUNCTION update_welcome_panels_updated_at();

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_welcome_panels_active ON welcome_panels(is_active);
CREATE INDEX IF NOT EXISTS idx_welcome_panels_created_at ON welcome_panels(created_at);
CREATE INDEX IF NOT EXISTS idx_welcome_panels_theme ON welcome_panels(theme);

-- Criar view para painel ativo (facilita consultas)
CREATE OR REPLACE VIEW active_welcome_panel AS
SELECT 
  id,
  title,
  content,
  theme,
  custom_styles,
  show_close_button,
  auto_close_seconds,
  display_conditions,
  created_at,
  updated_at,
  version
FROM welcome_panels 
WHERE is_active = true 
ORDER BY updated_at DESC 
LIMIT 1;

-- Função para obter o painel ativo
CREATE OR REPLACE FUNCTION get_active_welcome_panel()
RETURNS TABLE (
  id INTEGER,
  title VARCHAR,
  content TEXT,
  theme VARCHAR,
  custom_styles JSONB,
  show_close_button BOOLEAN,
  auto_close_seconds INTEGER,
  display_conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  version INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM active_welcome_panel;
END;
$$ LANGUAGE plpgsql;

-- Função para criar nova versão do painel
CREATE OR REPLACE FUNCTION create_welcome_panel_version(
  p_title VARCHAR,
  p_content TEXT,
  p_theme VARCHAR DEFAULT 'default',
  p_custom_styles JSONB DEFAULT NULL,
  p_show_close_button BOOLEAN DEFAULT true,
  p_auto_close_seconds INTEGER DEFAULT NULL,
  p_display_conditions JSONB DEFAULT NULL,
  p_created_by VARCHAR DEFAULT 'admin'
)
RETURNS INTEGER AS $$
DECLARE
  new_id INTEGER;
BEGIN
  -- Desativar painel atual
  UPDATE welcome_panels SET is_active = false WHERE is_active = true;
  
  -- Criar novo painel
  INSERT INTO welcome_panels (
    title, content, theme, custom_styles, show_close_button, 
    auto_close_seconds, display_conditions, created_by, is_active
  ) VALUES (
    p_title, p_content, p_theme, p_custom_styles, p_show_close_button,
    p_auto_close_seconds, p_display_conditions, p_created_by, true
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Verificar se a tabela foi criada corretamente
SELECT 
  'Tabela welcome_panels criada com sucesso!' as status,
  COUNT(*) as total_panels,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_panels
FROM welcome_panels;

-- Mostrar painel ativo
SELECT * FROM active_welcome_panel;