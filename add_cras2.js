const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    envVars[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = envVars['REACT_APP_SUPABASE_URL'];
const supabaseAnonKey = envVars['REACT_APP_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addLocation() {
  try {
    const filePath = 'crasalemoa.jpg';
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `cras-alemoa-${Date.now()}.jpg`;
    const storagePath = `${fileName}`;

    console.log(`Uploading to bucket 'images' at ${storagePath}...`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg'
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    console.log('Public URL:', publicUrl);

    const descricao = `CRAS Chico de Paula é um Centro de Referência de Assistência Social localizado em Santos, São Paulo, atendendo à população da região com serviços voltados à proteção social, apoio familiar, inclusão social e programas governamentais. O CRAS atua como ponto de referência para políticas públicas de assistência social, oferecendo suporte a famílias em situação de vulnerabilidade, programas de renda, acompanhamento socioeducativo e encaminhamentos para outros serviços. Localizado próximo ao centro da cidade, o CRAS Chico de Paula é uma unidade estratégica da Prefeitura de Santos, integrada ao sistema de proteção social do município. É recomendado chegar com antecedência, especialmente em dias de grande demanda, para garantir o atendimento.

**Localização e Contato:**

- **Endereço:** Av. Marginal da V. Anchieta, 218 – Chico de Paula, Santos - SP, 11095-000
- **Horário de funcionamento:** Segunda a sexta-feira, das 08:00 às 17:00
- **Telefone:** (13) 3203-5258
- **Agendamento:** agendamentocras.com.br`;

    const linksString = "Site de Agendamento: https://agendamentocras.com.br";

    const locationData = {
      titulo: 'CRAS Chico de Paula – Centro de Referência de Assistência Social',
      tipo: 'assistencia',
      localizacao: '-23.9298774, -46.3657521',
      descricao_detalhada: descricao,
      imagens: publicUrl,
      links: linksString,
      video: null,
      audio: null
    };

    console.log('Inserting location in locations3 table...');
    const { data, error } = await supabase
      .from('locations3')
      .insert([locationData])
      .select();

    if (error) {
      console.error('Error inserting location:', error);
    } else {
      console.log('Successfully inserted location:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

addLocation();
