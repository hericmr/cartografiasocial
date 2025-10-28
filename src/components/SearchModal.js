import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../contexts/SearchContext';

const SearchModal = () => {
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    isSearching,
    suggestions,
    searchHistory,
    closeSearch,
    handleSearch,
    clearSearch,
    clearHistory
  } = useSearch();

  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Foca no input quando abre
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Sincroniza input com query
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Atualiza sugestões quando query muda
  useEffect(() => {
    setShowSuggestions(inputValue.length > 0 || suggestions.length > 0);
  }, [inputValue, suggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleSearch(value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    const totalItems = searchResults.length + suggestions.length;
    
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < totalItems - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : totalItems - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleItemClick(getSelectedItem());
      } else if (searchResults.length > 0) {
        handleItemClick(searchResults[0]);
      }
    }
  };

  const getSelectedItem = () => {
    if (selectedIndex < searchResults.length) {
      return searchResults[selectedIndex];
    } else {
      const suggestionIndex = selectedIndex - searchResults.length;
      return { type: 'suggestion', text: suggestions[suggestionIndex] };
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'suggestion') {
      setInputValue(item.text);
      handleSearch(item.text);
    } else {
      // Navega para o resultado
      if (item.url) {
        navigate(item.url);
      }
      closeSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSearch(suggestion);
  };

  const handleClearClick = () => {
    clearSearch();
    setInputValue('');
    setSelectedIndex(-1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'lazer': 'bg-blue-100 text-blue-800',
      'assistencia': 'bg-green-100 text-green-800',
      'historico': 'bg-yellow-100 text-yellow-800',
      'comunidades': 'bg-red-100 text-red-800',
      'educação': 'bg-violet-100 text-violet-800',
      'religiao': 'bg-gray-100 text-gray-800',
      'bairro': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatScore = (score) => {
    if (score >= 50) return 'Muito relevante';
    if (score >= 30) return 'Relevante';
    if (score >= 15) return 'Parcialmente relevante';
    return 'Pouco relevante';
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={closeSearch}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Buscar locais, descrições, categorias..."
                className="flex-1 text-gray-900 placeholder-gray-500 outline-none text-lg"
              />
              {inputValue && (
                <button
                  onClick={handleClearClick}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <button
                onClick={closeSearch}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {/* Loading */}
              {isSearching && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-600">Buscando...</span>
                </div>
              )}

              {/* Results */}
              {!isSearching && searchResults.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Resultados ({searchResults.length})
                  </div>
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                        selectedIndex === index 
                          ? 'bg-green-50 border-green-500' 
                          : 'border-transparent'
                      }`}
                      onClick={() => handleItemClick(result)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {result.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(result.category)}`}>
                              {result.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {result.description.length > 100 
                              ? result.description.substring(0, 100) + '...' 
                              : result.description
                            }
                          </p>
                          {result.matches && result.matches.length > 0 && (
                            <div className="mt-2">
                              {result.matches.slice(0, 2).map((match, matchIndex) => (
                                <div key={matchIndex} className="text-xs text-gray-500">
                                  <span className="font-medium">{match.field}:</span>{' '}
                                  <span dangerouslySetInnerHTML={{ 
                                    __html: match.text.replace(
                                      new RegExp(`(${searchQuery})`, 'gi'), 
                                      '<mark class="bg-yellow-200">$1</mark>'
                                    )
                                  }} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {result.coordinates && (
                            <MapPin className="w-4 h-4 text-gray-400" />
                          )}
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {!isSearching && searchResults.length === 0 && suggestions.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Sugestões
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center ${
                        selectedIndex === searchResults.length + index 
                          ? 'bg-green-50' 
                          : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Clock className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* No results */}
              {!isSearching && searchResults.length === 0 && suggestions.length === 0 && inputValue && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Nenhum resultado encontrado para "{inputValue}"</p>
                  <p className="text-sm mt-1">Tente termos diferentes ou mais específicos</p>
                </div>
              )}

              {/* Empty state */}
              {!isSearching && searchResults.length === 0 && suggestions.length === 0 && !inputValue && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Digite para buscar locais, descrições ou categorias</p>
                  <p className="text-sm mt-1">Use palavras-chave relacionadas ao que procura</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {searchHistory.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {searchHistory.length} buscas recentes
                  </span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Limpar histórico
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;