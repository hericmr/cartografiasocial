-- Script para criar as tabelas da galeria de imagens no Supabase

-- 1. Tabela principal de galerias
CREATE TABLE IF NOT EXISTS image_galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  main_text TEXT, -- Texto principal da galeria
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. Tabela de imagens da galeria
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES image_galleries(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- URL do Supabase Storage
  image_path TEXT NOT NULL, -- Caminho no storage
  caption TEXT, -- Legenda da imagem
  alt_text TEXT, -- Texto alternativo para acessibilidade
  display_order INTEGER DEFAULT 0, -- Ordem de exibição
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de configurações da galeria
CREATE TABLE IF NOT EXISTS gallery_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES image_galleries(id) ON DELETE CASCADE,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_id, setting_key)
);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery_id ON gallery_images(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_image_galleries_active ON image_galleries(is_active);

-- 5. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Triggers para updated_at
CREATE TRIGGER update_image_galleries_updated_at 
    BEFORE UPDATE ON image_galleries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON gallery_images 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_settings_updated_at 
    BEFORE UPDATE ON gallery_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Inserir dados de exemplo
INSERT INTO image_galleries (title, description, main_text, is_active) VALUES 
('Galeria de Exemplo', 'Esta é uma galeria de exemplo para demonstrar o sistema', '<h2>Bem-vindo à nossa galeria de imagens!</h2><p>Esta galeria demonstra as funcionalidades do sistema de galerias interativas.</p>', true);

-- 8. Políticas de acesso (RLS)
ALTER TABLE image_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para image_galleries
CREATE POLICY "Public read access for active galleries" ON image_galleries
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage galleries" ON image_galleries
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para gallery_images
CREATE POLICY "Public read access for active images" ON gallery_images
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage images" ON gallery_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para gallery_settings
CREATE POLICY "Public read access for gallery settings" ON gallery_settings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage settings" ON gallery_settings
    FOR ALL USING (auth.role() = 'authenticated');