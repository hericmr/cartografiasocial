/**
 * Provedor de busca para painéis de boas-vindas
 */

class WelcomeSearchProvider {
  constructor() {
    this.name = 'Painel de Boas-vindas';
    this.priority = 5; // Prioridade média
  }

  /**
   * Busca em painéis de boas-vindas
   * @param {string} query - Termo de busca
   * @param {Object} options - Opções de busca
   * @returns {Array} Resultados da busca
   */
  search(query, options = {}) {
    return new Promise((resolve) => {
      // Obtém dados do painel de boas-vindas do contexto global
      const welcomePanel = window.searchContext?.welcomePanel;
      
      if (!welcomePanel) {
        resolve([]);
        return;
      }

      const result = this.calculateRelevance(welcomePanel, query);
      
      if (result.score > 0) {
        resolve([result]);
      } else {
        resolve([]);
      }
    });
  }

  /**
   * Calcula relevância do painel para o termo de busca
   * @param {Object} panel - Dados do painel
   * @param {string} query - Termo de busca
   * @returns {Object} Resultado com score de relevância
   */
  calculateRelevance(panel, query) {
    const queryLower = query.toLowerCase();
    let score = 0;
    const matches = [];

    // Busca no título (peso alto)
    if (panel.title) {
      const titleLower = panel.title.toLowerCase();
      if (titleLower.includes(queryLower)) {
        score += titleLower.startsWith(queryLower) ? 40 : 25;
        matches.push({
          field: 'title',
          text: panel.title,
          type: 'exact'
        });
      }
    }

    // Busca no conteúdo (peso médio)
    if (panel.content) {
      const contentLower = panel.content.toLowerCase();
      if (contentLower.includes(queryLower)) {
        score += 20;
        matches.push({
          field: 'content',
          text: this.extractMatchContext(contentLower, queryLower),
          type: 'partial'
        });
      }
    }

    // Busca na descrição (peso baixo)
    if (panel.description) {
      const descLower = panel.description.toLowerCase();
      if (descLower.includes(queryLower)) {
        score += 15;
        matches.push({
          field: 'description',
          text: this.extractMatchContext(descLower, queryLower),
          type: 'partial'
        });
      }
    }

    return {
      id: `welcome-${panel.id || 'panel'}`,
      title: panel.title || 'Painel de Boas-vindas',
      description: panel.description || 'Informações iniciais do site',
      type: 'welcome',
      category: 'informações',
      score,
      matches,
      data: panel,
      url: '/',
      isActive: panel.is_active
    };
  }

  /**
   * Extrai contexto da correspondência para exibição
   * @param {string} text - Texto completo
   * @param {string} query - Termo de busca
   * @returns {string} Contexto da correspondência
   */
  extractMatchContext(text, query) {
    const index = text.indexOf(query);
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    
    let context = text.substring(start, end);
    
    // Adiciona reticências se necessário
    if (start > 0) context = '...' + context;
    if (end < text.length) context = context + '...';
    
    return context;
  }
}

export default WelcomeSearchProvider;