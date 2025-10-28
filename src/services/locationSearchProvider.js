/**
 * Provedor de busca para locais da cartografia
 */

import { supabase } from '../supabaseClient';

console.log('🔍 Supabase importado:', supabase);
console.log('🔍 Supabase é objeto?', typeof supabase);

class LocationSearchProvider {
  constructor() {
    console.log('🔍 LocationSearchProvider constructor chamado');
    this.name = 'Locais';
    this.priority = 10; // Alta prioridade
    console.log('🔍 LocationSearchProvider inicializado:', this);
    console.log('🔍 LocationSearchProvider.search existe?', !!this.search);
    console.log('🔍 LocationSearchProvider.search é função?', typeof this.search);
  }

  // Garantir que o método search seja uma função arrow para manter o contexto
  search = async (query, options = {}) => {
    console.log('🔍 LocationSearchProvider.search chamado com:', { query, options });
    try {
      // Busca no Supabase usando texto completo
      const { data, error } = await supabase
        .from('locations3')
        .select('*')
        .or(`titulo.ilike.%${query}%,descricao.ilike.%${query}%,descricao_detalhada.ilike.%${query}%,tipo.ilike.%${query}%`)
        .limit(options.limit || 20)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro na busca no Supabase:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Formata os dados e calcula relevância
      const results = data
        .map(location => this.formatLocationData(location))
        .map(location => this.calculateRelevance(location, query))
        .filter(result => result.score > 0)
        .sort((a, b) => b.score - a.score);

      return results;
    } catch (error) {
      console.error('Erro na busca de locais:', error);
      return [];
    }
  }


  /**
   * Formata dados do local para busca
   * @param {Object} location - Dados brutos do Supabase
   * @returns {Object} Dados formatados
   */
  formatLocationData(location) {
    // Links
    location.links = (location.links && typeof location.links === 'string')
      ? location.links.split(";").map((l) => {
          let [texto, url] = l.split(':');
          return { texto: texto || "Sem título", url: url || "#" };
        })
      : [];

    // Imagens
    location.imagens = (location.imagens && typeof location.imagens === 'string')
      ? location.imagens.split(",")
      : [];

    // Áudio
    location.audioUrl = location.audio || "";

    // Título e Descrição
    location.titulo = location.titulo || "Título não disponível";
    location.descricao = location.descricao || "Sem descrição";

    // Coordenadas
    if (location.localizacao && typeof location.localizacao === 'string') {
      const [lat, lng] = location.localizacao.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        location.latitude = lat;
        location.longitude = lng;
      } else {
        location.latitude = null;
        location.longitude = null;
      }
    } else {
      location.latitude = null;
      location.longitude = null;
    }

    // Descrição detalhada
    if (location.descricao_detalhada) {
      location.descricao_detalhada = location.descricao_detalhada
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>");
    }

    return location;
  }

  /**
   * Calcula relevância de um local para o termo de busca
   * @param {Object} location - Dados do local
   * @param {string} query - Termo de busca
   * @returns {Object} Resultado com score de relevância
   */
  calculateRelevance(location, query) {
    const queryLower = query.toLowerCase();
    let score = 0;
    const matches = [];

    // Busca no título (peso alto)
    if (location.titulo) {
      const titleLower = location.titulo.toLowerCase();
      if (titleLower.includes(queryLower)) {
        score += titleLower.startsWith(queryLower) ? 50 : 30;
        matches.push({
          field: 'titulo',
          text: location.titulo,
          type: 'exact'
        });
      }
    }

    // Busca na descrição (peso médio)
    if (location.descricao) {
      const descLower = location.descricao.toLowerCase();
      if (descLower.includes(queryLower)) {
        score += 20;
        matches.push({
          field: 'descricao',
          text: this.extractMatchContext(descLower, queryLower),
          type: 'partial'
        });
      }
    }

    // Busca na descrição detalhada (peso médio)
    if (location.descricao_detalhada) {
      const descDetalhadaLower = location.descricao_detalhada.toLowerCase();
      if (descDetalhadaLower.includes(queryLower)) {
        score += 25;
        matches.push({
          field: 'descricao_detalhada',
          text: this.extractMatchContext(descDetalhadaLower, queryLower),
          type: 'partial'
        });
      }
    }

    // Busca no tipo/categoria (peso baixo)
    if (location.tipo) {
      const tipoLower = location.tipo.toLowerCase();
      if (tipoLower.includes(queryLower)) {
        score += 15;
        matches.push({
          field: 'tipo',
          text: location.tipo,
          type: 'exact'
        });
      }
    }

    // Busca nos links (peso baixo)
    if (location.links && Array.isArray(location.links)) {
      location.links.forEach(link => {
        if (link.texto && link.texto.toLowerCase().includes(queryLower)) {
          score += 10;
          matches.push({
            field: 'links',
            text: link.texto,
            type: 'exact'
          });
        }
      });
    }

    // Bonus por localização (se tem coordenadas válidas)
    if (location.latitude && location.longitude) {
      score += 5;
    }

    // Bonus por conteúdo rico
    if (location.imagens && location.imagens.length > 0) {
      score += 3;
    }
    if (location.audioUrl) {
      score += 3;
    }
    if (location.video) {
      score += 3;
    }

    return {
      id: location.id || `location-${Math.random()}`,
      title: location.titulo || 'Sem título',
      description: location.descricao || 'Sem descrição',
      type: 'location',
      category: location.tipo || 'outros',
      score,
      matches,
      data: location,
      url: `/conteudo#${this.createSlug(location.titulo)}`,
      coordinates: location.latitude && location.longitude 
        ? { lat: location.latitude, lng: location.longitude }
        : null
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

  /**
   * Cria slug para URL
   * @param {string} text - Texto para converter
   * @returns {string} Slug
   */
  createSlug(text) {
    if (!text) return 'sem-titulo';
    
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
      .replace(/^-+|-+$/g, '')         // Remove hífens do início e fim
      .trim();
  }
}

export default LocationSearchProvider;