const fs = require('fs');
const path = require('path');

// Função para listar todos os locais com coordenadas nulas
async function listNullCoordinates() {
  const insercoesDir = path.join(__dirname, 'inserções');
  const files = fs.readdirSync(insercoesDir).filter(file => file.endsWith('.json'));
  
  console.log(`🔍 Analisando ${files.length} arquivos na pasta inserções...\n`);
  
  let allNullCoordinates = [];
  let totalRecords = 0;
  let validRecords = 0;
  
  for (const file of files) {
    try {
      const filePath = path.join(insercoesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      console.log(`📄 Processando: ${file}`);
      console.log(`   Total de registros: ${data.length}`);
      
      // Filtrar registros com coordenadas nulas
      const nullCoordinates = data.filter(item => 
        item.latitude === null || 
        item.longitude === null || 
        item.status === 'não encontrado'
      );
      
      const validCoordinates = data.filter(item => 
        item.latitude !== null && 
        item.longitude !== null && 
        item.status === 'encontrado'
      );
      
      console.log(`   ✅ Coordenadas válidas: ${validCoordinates.length}`);
      console.log(`   ❌ Coordenadas nulas: ${nullCoordinates.length}`);
      
      allNullCoordinates = allNullCoordinates.concat(nullCoordinates);
      totalRecords += data.length;
      validRecords += validCoordinates.length;
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Erro ao processar arquivo ${file}:`, error.message);
    }
  }
  
  // Remover duplicatas baseado no nome
  const uniqueNullCoordinates = allNullCoordinates.filter((item, index, self) => 
    index === self.findIndex(t => t.nome === item.nome)
  );
  
  console.log('='.repeat(80));
  console.log('📊 RESUMO GERAL');
  console.log('='.repeat(80));
  console.log(`Total de registros analisados: ${totalRecords}`);
  console.log(`Registros com coordenadas válidas: ${validRecords}`);
  console.log(`Registros com coordenadas nulas: ${allNullCoordinates.length}`);
  console.log(`Registros únicos com coordenadas nulas: ${uniqueNullCoordinates.length}`);
  console.log('');
  
  console.log('='.repeat(80));
  console.log('📍 LOCAIS QUE PRECISAM DE COORDENADAS MANUAIS');
  console.log('='.repeat(80));
  
  uniqueNullCoordinates.forEach((item, index) => {
    console.log(`${index + 1}. ${item.nome}`);
    console.log(`   📍 Endereço: ${item.endereco}`);
    console.log(`   📞 Telefone: ${item.telefone || 'Não informado'}`);
    console.log(`   📧 Email: ${item.email || 'Não informado'}`);
    console.log(`   🔍 Status: ${item.status}`);
    console.log(`   📊 Coordenadas atuais: ${item.latitude}, ${item.longitude}`);
    console.log('');
  });
  
  // Salvar lista em arquivo para referência
  const outputFile = path.join(__dirname, 'locais_sem_coordenadas.json');
  fs.writeFileSync(outputFile, JSON.stringify(uniqueNullCoordinates, null, 2));
  console.log(`💾 Lista salva em: ${outputFile}`);
  
  return uniqueNullCoordinates;
}

// Executar o script
if (require.main === module) {
  listNullCoordinates()
    .then(() => {
      console.log('\n✅ Análise concluída!');
    })
    .catch(error => {
      console.error('❌ Erro na análise:', error);
    });
}

module.exports = { listNullCoordinates };