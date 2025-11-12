import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

const AddressSearch = ({ onAddressSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar endereços no Nominatim
  const searchAddress = useCallback(async (query) => {
    if (!query || query.trim().length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: 'br', // Focar em resultados do Brasil
        'accept-language': 'pt-BR'
      });

      const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
        headers: {
          'User-Agent': 'CartografiaSocial/1.0' // Nominatim requer User-Agent
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar endereço');
      }

      const data = await response.json();
      setResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce da busca
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.trim().length >= 3) {
      debounceTimer.current = setTimeout(() => {
        searchAddress(value);
      }, 500);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [searchAddress]);

  // Selecionar endereço
  const handleSelectAddress = useCallback((result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    if (!isNaN(lat) && !isNaN(lon)) {
      onAddressSelect({
        latitude: lat,
        longitude: lon,
        displayName: result.display_name,
        address: result.address
      });
      setSearchQuery(result.display_name);
      setShowResults(false);
    }
  }, [onAddressSelect]);

  // Formatar endereço para exibição
  const formatAddress = (result) => {
    if (result.address) {
      const addr = result.address;
      const parts = [];
      
      if (addr.house_number) parts.push(addr.house_number);
      if (addr.road) parts.push(addr.road);
      if (addr.neighbourhood || addr.suburb) parts.push(addr.neighbourhood || addr.suburb);
      if (addr.city || addr.town) parts.push(addr.city || addr.town);
      if (addr.state) parts.push(addr.state);
      
      return parts.length > 0 ? parts.join(', ') : result.display_name;
    }
    return result.display_name;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder="Buscar endereço (ex: Rua XV de Novembro, 123, Santos)"
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Resultados da busca */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.place_id || index}
              type="button"
              onClick={() => handleSelectAddress(result)}
              className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {formatAddress(result)}
                  </p>
                  {result.address && (
                    <p className="text-xs text-gray-500 mt-1">
                      {result.address.city || result.address.town || ''}
                      {result.address.postcode && ` - ${result.address.postcode}`}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && searchQuery.length >= 3 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">
            Nenhum endereço encontrado. Tente uma busca mais específica.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;

