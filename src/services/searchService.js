/**
 * Serviço de busca modular e expansível
 * Permite buscar em diferentes tipos de conteúdo do site
 */

class SearchService {
  constructor() {
    this.searchProviders = new Map();
    this.searchHistory = this.loadSearchHistory();
    this.maxHistoryItems = 10;
  }

  /**
   * Registra um provedor de busca para um tipo específico de conteúdo
   * @param {string} type - Tipo de conteúdo (ex: 'locations', 'welcome', 'gallery')
   * @param {Object} provider - Objeto com métodos de busca
   */
  registerProvider(type, provider) {
    console.log('🔍 Registrando provedor:', type, provider);
    console.log('🔍 Provider.search existe?', !!provider.search);
    console.log('🔍 Provider.search é função?', typeof provider.search);
    console.log('🔍 Provider completo:', JSON.stringify(provider, null, 2));
    
    if (!provider.search || typeof provider.search !== 'function') {
      console.error('❌ Erro: Provider não tem método search válido');
      throw new Error('Provider must have a search method');
    }
    
    this.searchProviders.set(type, {
      ...provider,
      priority: provider.priority || 0
    });
    
    console.log('✅ Provedor registrado com sucesso:', type);
    console.log('🔍 Provedores registrados:', Array.from(this.searchProviders.keys()));
  }

  /**
   * Realiza busca em todos os provedores registrados
   * @param {string} query - Termo de busca
   * @param {Object} options - Opções de busca
   * @returns {Promise<Array>} Resultados da busca
   */
  async search(query, options = {}) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];
    const { limit = 20, types = null } = options;

    // Ordena provedores por prioridade (maior prioridade primeiro)
    const sortedProviders = Array.from(this.searchProviders.entries())
      .sort(([,a], [,b]) => b.priority - a.priority);

    // Filtra por tipos se especificado
    const providersToSearch = types 
      ? sortedProviders.filter(([type]) => types.includes(type))
      : sortedProviders;

    // Executa busca em paralelo em todos os provedores
    const searchPromises = providersToSearch.map(async ([type, provider]) => {
      try {
        console.log(`🔍 Buscando no provedor ${type}:`, provider);
        console.log(`🔍 Provider.search existe?`, !!provider.search);
        console.log(`🔍 Provider.search é função?`, typeof provider.search);
        
        if (!provider.search || typeof provider.search !== 'function') {
          console.error(`❌ Provedor ${type} não tem método search válido:`, provider);
          return [];
        }
        
        const providerResults = await provider.search(searchTerm, options);
        console.log(`✅ Resultados do provedor ${type}:`, providerResults);
        
        return providerResults.map(result => ({
          ...result,
          type,
          provider: provider.name || type
        }));
      } catch (error) {
        console.error(`❌ Erro na busca do provedor ${type}:`, error);
        console.error(`❌ Stack trace:`, error.stack);
        return [];
      }
    });

    const allResults = await Promise.all(searchPromises);
    
    // Flatten e ordena resultados
    allResults.flat().forEach(result => results.push(result));
    
    // Ordena por relevância (score mais alto primeiro)
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Adiciona à história de busca
    this.addToHistory(searchTerm);

    return limit ? results.slice(0, limit) : results;
  }

  /**
   * Busca rápida (primeiros resultados)
   * @param {string} query - Termo de busca
   * @returns {Promise<Array>} Primeiros 5 resultados
   */
  async quickSearch(query) {
    return this.search(query, { limit: 5 });
  }

  /**
   * Busca por tipo específico
   * @param {string} query - Termo de busca
   * @param {string} type - Tipo de conteúdo
   * @returns {Promise<Array>} Resultados do tipo especificado
   */
  async searchByType(query, type) {
    return this.search(query, { types: [type] });
  }

  /**
   * Adiciona termo à história de busca
   * @param {string} term - Termo de busca
   */
  addToHistory(term) {
    if (!term || term.length < 2) return;

    // Remove duplicatas
    this.searchHistory = this.searchHistory.filter(item => item !== term);
    
    // Adiciona no início
    this.searchHistory.unshift(term);
    
    // Mantém apenas os últimos N itens
    this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    
    this.saveSearchHistory();
  }

  /**
   * Obtém história de busca
   * @returns {Array} Lista de termos buscados
   */
  getSearchHistory() {
    return [...this.searchHistory];
  }

  /**
   * Limpa história de busca
   */
  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  /**
   * Carrega história do localStorage
   * @returns {Array} História carregada
   */
  loadSearchHistory() {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar história de busca:', error);
      return [];
    }
  }

  /**
   * Salva história no localStorage
   */
  saveSearchHistory() {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Erro ao salvar história de busca:', error);
    }
  }

  /**
   * Obtém sugestões baseadas na história e nos dados
   * @param {string} query - Termo parcial
   * @returns {Array} Sugestões
   */
  async getSuggestions(query) {
    if (!query || query.length < 1) {
      return this.getSearchHistory().slice(0, 5);
    }

    const suggestions = new Set();
    const queryLower = query.toLowerCase();

    // Adiciona da história
    this.searchHistory.forEach(term => {
      if (term.toLowerCase().includes(queryLower)) {
        suggestions.add(term);
      }
    });

    // Adiciona títulos de locais que começam com o termo
    try {
      const quickResults = await this.quickSearch(query);
      quickResults.forEach(result => {
        if (result.title && result.title.toLowerCase().startsWith(queryLower)) {
          suggestions.add(result.title);
        }
      });
    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
    }

    return Array.from(suggestions).slice(0, 8);
  }
}

// Instância singleton
const searchService = new SearchService();

export default searchService;