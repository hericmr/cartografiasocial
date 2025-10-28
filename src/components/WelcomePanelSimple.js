import React from 'react';

const WelcomePanelSimple = ({ isVisible, onClose }) => {
  console.log('🎭 [WELCOME_SIMPLE] Componente renderizado - isVisible:', isVisible);
  
  if (!isVisible) {
    console.log('🚫 [WELCOME_SIMPLE] Painel não está visível, não renderizando');
    return null;
  }
  
  console.log('✅ [WELCOME_SIMPLE] Painel está visível, renderizando...');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Sobre o site</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Fechar painel"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Áudio */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full">
                ▶️
              </div>
              <p className="text-sm text-gray-600">Ouça a apresentação completa do projeto</p>
              <div className="text-blue-600 ml-auto">🔊</div>
            </div>
            <audio
              className="w-full"
              controls
            >
              <source src="/cartografiasocial/audio/intro.mp3" type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>

          {/* Conteúdo */}
          <div className="prose prose-lg max-w-none">
            <h1>Sobre o site</h1>
            
            <p>Esta é uma <strong>cartografia social</strong> que busca mapear territorialidades, lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de comunidades e locais carregados de memória e história.</p>

            <h2>Os pontos estão representados por:</h2>
            <ul>
              <li><strong>🎯 Lazer</strong>: equipamentos sociais, culturais e de lazer</li>
              <li><strong>🏥 Assistência</strong>: unidades de assistência social e saúde</li>
              <li><strong>🏛️ Históricos</strong>: lugares históricos e de memória</li>
              <li><strong>🏘️ Comunidades</strong>: territórios de comunidades</li>
              <li><strong>🎓 Educação</strong>: escolas e unidades de ensino</li>
              <li><strong>⛪ Religião</strong>: estabelecimentos religiosos</li>
            </ul>

            <h2>Histórias mapeadas:</h2>
            <p>Entre os elementos mapeados, estão histórias relacionadas à <strong>escravidão e lutas do povo negro</strong>, à <strong>opressão e resistência à ditadura empresarial-militar (1964-1984)</strong>, e às <strong>lutas que moldaram e continuam moldando a identidade da região</strong>.</p>

            <h2>Sobre os materiais:</h2>
            <p>Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelas(os) <strong>estudantes de Serviço Social da UNIFESP</strong> do vespertino e noturno durante a <strong>Unidade Curricular de Política Social 2</strong>, em <strong>2024 e 2025</strong>.</p>

            <hr />

            <h3>Como navegar:</h3>
            <ol>
              <li><strong>Clique nos marcadores</strong> no mapa para ver informações detalhadas</li>
              <li><strong>Use o menu</strong> para acessar diferentes seções</li>
              <li><strong>Explore o conteúdo</strong> na página de catálogo</li>
              <li><strong>Ouça os áudios</strong> disponíveis em cada local</li>
            </ol>

            <p><em>Este painel pode ser personalizado pelos administradores do sistema.</em></p>
          </div>

          {/* Galeria de Imagens */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Galeria de Imagens</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "/cartografiasocial/fotos/turma.png",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_162955.jpg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_163006.jpg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_163037.jpg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG_20251021_163051.jpg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0081.jpeg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0083.jpeg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0085.jpeg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0087.jpeg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0089.jpeg",
                "/cartografiasocial/fotos/cartografiasocial-1-001/cartografiasocial/IMG-20251021-WA0091.jpeg"
              ].map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <img
                    src={image}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">👁️</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end items-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Começar a explorar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanelSimple;