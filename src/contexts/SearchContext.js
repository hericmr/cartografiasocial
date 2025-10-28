import React, { createContext, useContext, useState, useEffect } from 'react';
import searchService from '../services/searchService';
import LocationSearchProvider from '../services/locationSearchProvider';

console.log('🔍 LocationSearchProvider importado:', LocationSearchProvider);
console.log('🔍 LocationSearchProvider é função?', typeof LocationSearchProvider);
console.log('🔍 LocationSearchProvider.prototype:', LocationSearchProvider.prototype);

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Inicializa o serviço de busca
  useEffect(() => {
    console.log('🚀 Inicializando SearchContext...');
    
    // Registra o provedor de locais
    console.log('🔍 Criando LocationSearchProvider...');
    const locationProvider = new LocationSearchProvider();
    console.log('🔍 LocationSearchProvider criado:', locationProvider);
    console.log('🔍 LocationSearchProvider.search existe?', !!locationProvider.search);
    console.log('🔍 LocationSearchProvider.search é função?', typeof locationProvider.search);
    
    try {
      searchService.registerProvider('locations', locationProvider);
      console.log('✅ LocationSearchProvider registrado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao registrar LocationSearchProvider:', error);
    }

    // Carrega história de busca
    setSearchHistory(searchService.getSearchHistory());

    // Cleanup
    return () => {
      // Limpa provedores se necessário
    };
  }, []);

  // Busca em tempo real
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      
      try {
        // Busca resultados
        const results = await searchService.search(searchQuery, { limit: 20 });
        setSearchResults(results);

        // Busca sugestões
        const newSuggestions = await searchService.getSuggestions(searchQuery);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Erro na busca:', error);
        setSearchResults([]);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Atualiza sugestões quando abre o modal
  useEffect(() => {
    if (isSearchOpen && !searchQuery) {
      setSuggestions(searchService.getSearchHistory().slice(0, 5));
    }
  }, [isSearchOpen, searchQuery]);

  const openSearch = () => {
    setIsSearchOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions(searchService.getSearchHistory().slice(0, 5));
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions(searchService.getSearchHistory().slice(0, 5));
  };

  const clearHistory = () => {
    searchService.clearSearchHistory();
    setSearchHistory([]);
    setSuggestions([]);
  };

  const value = {
    // Estado
    isSearchOpen,
    searchQuery,
    searchResults,
    isSearching,
    suggestions,
    searchHistory,
    
    // Ações
    openSearch,
    closeSearch,
    handleSearch,
    clearSearch,
    clearHistory,
    
    // Dados (removido - busca direta no banco)
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;