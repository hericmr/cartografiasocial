-- Script para criar a tabela de configurações do site
-- Execute este script no Supabase SQL Editor

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS site_configurations (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'text', -- text, html, markdown, json
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações iniciais do painel de boas-vindas
INSERT INTO site_configurations (key, value, type) VALUES 
('welcome_panel_content', '# Bem-vindo à Cartografia Social

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

*Este painel pode ser personalizado pelos administradores do sistema.*', 'markdown'),
('welcome_panel_title', 'Bem-vindo à Cartografia Social', 'text'),
('welcome_panel_enabled', 'true', 'text'),
('welcome_panel_style', '{"theme": "default", "showCloseButton": true, "autoClose": false}', 'json')
ON CONFLICT (key) DO NOTHING;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_site_configurations_updated_at ON site_configurations;
CREATE TRIGGER update_site_configurations_updated_at
    BEFORE UPDATE ON site_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se as configurações foram inseridas
SELECT * FROM site_configurations ORDER BY key;