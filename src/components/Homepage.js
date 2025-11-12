import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, MapPin, ChevronDown, Camera, Music, ArrowRight, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const HomepageSearch = ({ dataPoints, onResultClick }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Fechar resultados quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar dados quando o termo mudar (busca em tempo real)
  useEffect(() => {
    if (localSearchTerm.length < 2) {
      setShowResults(false);
      return;
    }

    // Simple search in dataPoints
    const searchData = () => {
      const term = localSearchTerm.toLowerCase();
      const results = dataPoints
        .filter(point => 
          point.titulo?.toLowerCase().includes(term) ||
          point.descricao?.toLowerCase().includes(term) ||
          point.descricao_detalhada?.toLowerCase().includes(term)
        )
        .slice(0, 8)
        .map(point => ({
          id: point.id || point.titulo,
          title: point.titulo,
          subtitle: point.descricao || '',
          coordinates: point.latitude && point.longitude ? [point.longitude, point.latitude] : null,
          data: point
        }));
      
      setShowResults(results.length > 0);
      return results;
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [localSearchTerm, dataPoints]);

  const handleSearch = (e) => {
    e.preventDefault();
    const termToSearch = localSearchTerm.trim();
    if (termToSearch) {
      navigate(`/mapa?search=${encodeURIComponent(termToSearch)}`);
    }
  };

  const handleResultClick = (result) => {
    if (result.coordinates && onResultClick) {
      onResultClick(result);
    }
    setShowResults(false);
    setLocalSearchTerm('');
    navigate('/mapa');
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setLocalSearchTerm('');
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  // Get search results
  const searchResults = localSearchTerm.length >= 2
    ? dataPoints
        .filter(point => 
          point.titulo?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
          point.descricao?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
          point.descricao_detalhada?.toLowerCase().includes(localSearchTerm.toLowerCase())
        )
        .slice(0, 8)
        .map(point => ({
          id: point.id || point.titulo,
          title: point.titulo,
          subtitle: point.descricao || '',
          coordinates: point.latitude && point.longitude ? [point.longitude, point.latitude] : null,
          data: point
        }))
    : [];

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="rounded-full bg-white/90 border border-green-200 px-4 py-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-green-700 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar locais, territórios..."
            value={localSearchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (localSearchTerm.length >= 2 && searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            className="w-full bg-transparent outline-none text-green-900 placeholder:text-green-800/60"
          />
          {localSearchTerm && (
            <button
              type="button"
              onClick={() => {
                setLocalSearchTerm('');
                setShowResults(false);
              }}
              className="text-green-700 hover:text-green-900 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Resultados da busca */}
      <AnimatePresence>
        {showResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-green-200 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="space-y-1">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full p-3 text-left hover:bg-green-50 rounded-lg transition-colors flex items-center gap-3 group"
                  >
                    <div className="text-green-600 group-hover:text-green-700 transition-colors flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-green-900 text-sm truncate">
                        {highlightText(result.title, localSearchTerm)}
                      </p>
                      <p className="text-xs text-green-700 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Component for full-width image separator
const ImageSeparator = ({ src, alt, index }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="w-full"
  >
    <img
      src={src}
      alt={alt || `Imagem ${index + 1}`}
      className="w-full h-[300px] md:h-[400px] object-cover"
    />
  </motion.div>
);

export default function Homepage({ dataPoints = [] }) {
  const navigate = useNavigate();
  const [welcomeConfig, setWelcomeConfig] = useState(null);
  const logoCartografiaUrl = useMemo(
    () => `${process.env.PUBLIC_URL || ''}/logo_cartografia_2.png`,
    []
  );
  const heroBackgroundUrl = useMemo(
    () => `${process.env.PUBLIC_URL || ''}/mapa48g.jpg`,
    []
  );
  // Get full HTML content from welcome config
  const heroContent = useMemo(() => {
    if (welcomeConfig?.content) {
      return welcomeConfig.content;
    }
    return '<p>Uma cartografia colaborativa que reúne territórios, memórias e lutas dos movimentos sociais em Santos.</p>';
  }, [welcomeConfig]);

  const images = useMemo(
    () => [
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
    ],
    []
  );

  // Fetch welcome config
  useEffect(() => {
    const fetchWelcomeConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('welcome_panels')
          .select('*')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!error && data) {
          setWelcomeConfig(data);
        }
      } catch (err) {
        console.error('Erro ao carregar configurações do painel de boas-vindas:', err);
      }
    };

    fetchWelcomeConfig();
  }, []);

  // Calcular estatísticas
  const stats = {
    totalLocais: dataPoints.filter(p => p.id !== 'welcome-location').length,
    comImagens: dataPoints.filter(p => p.imagens && p.imagens.length > 0 && p.id !== 'welcome-location').length,
    comAudio: dataPoints.filter(p => p.audioUrl && p.id !== 'welcome-location').length,
    categorias: [...new Set(dataPoints.filter(p => p.tipo && p.id !== 'welcome-location').map(p => p.tipo))].length
  };

  // Locais em destaque (melhor pontuação)
  const featuredLocations = dataPoints
    .filter(p => p.id !== 'welcome-location' && p.pontuacaoPercentual && p.pontuacaoPercentual >= 50)
    .sort((a, b) => (b.pontuacaoPercentual || 0) - (a.pontuacaoPercentual || 0))
    .slice(0, 6);

  return (
    <div className="flex-1 overflow-auto bg-white text-green-900">
      {/* Hero section com carrossel */}
      <section
        className="relative overflow-hidden py-24 md:py-32 bg-cover bg-center min-h-[80vh] md:min-h-[85vh] flex items-center"
        style={{ backgroundImage: `url('${heroBackgroundUrl}')` }}
      >

        <div className="relative container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-white space-y-6 bg-black/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10">
              {/* Audio Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="pb-6 border-b border-white/20"
              >
                <audio
                  className="w-full"
                  controls
                  preload="none"
                >
                  <source src="/cartografiasocial/audio/intro.mp3" type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-green-100/90 prose-strong:text-white prose-a:text-green-300 prose-a:hover:text-green-200 prose-a:underline prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: heroContent }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
              >
                <div className="col-span-1">
                  <HomepageSearch dataPoints={dataPoints} />
                </div>
                <div className="col-span-1 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/mapa"
                    className="flex-1 rounded-full bg-green-500 text-green-950 font-semibold px-4 py-2.5 text-center hover:bg-green-400 transition transform hover:scale-105"
                  >
                    Explorar o mapa
                  </Link>
                  <Link
                    to="/sobre"
                    className="flex-1 rounded-full border border-white/40 text-white font-semibold px-4 py-2.5 text-center hover:bg-white/10 transition transform hover:scale-105"
                  >
                    Sobre o projeto
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </div>
      </section>

      {/* Image Separator 1 */}
      {images.length > 0 && (
        <ImageSeparator src={images[0]} alt="Registro visual 1" index={0} />
      )}

      {/* Image Separator 2 */}
      {images.length > 1 && (
        <ImageSeparator src={images[1]} alt="Registro visual 2" index={1} />
      )}

      {/* Locais em Destaque */}
      {featuredLocations.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/mapa?location=${location.id}`)}
                >
                  {location.imagens && location.imagens.length > 0 && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={location.imagens[0]} 
                        alt={location.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-lg line-clamp-2">{location.titulo}</h3>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    {(!location.imagens || location.imagens.length === 0) && (
                      <h3 className="text-green-900 font-bold text-lg mb-2 line-clamp-2">{location.titulo}</h3>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {location.descricao || location.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, 100) || 'Sem descrição'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500">
                        {location.imagens && location.imagens.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Camera className="w-4 h-4" /> {location.imagens.length}
                          </span>
                        )}
                        {location.audioUrl && (
                          <span className="flex items-center gap-1">
                            <Music className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <span className="text-green-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver mais <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Separator 3 */}
      {images.length > 2 && (
        <ImageSeparator src={images[2]} alt="Registro visual 3" index={2} />
      )}

      {/* Image Separator 4 */}
      {images.length > 3 && (
        <ImageSeparator src={images[3]} alt="Registro visual 4" index={3} />
      )}

      {/* Additional Image Separators - distribute remaining images */}
      {images.length > 4 && images.slice(4).map((img, idx) => (
        <ImageSeparator 
          key={idx + 4} 
          src={img} 
          alt={`Registro visual ${idx + 5}`} 
          index={idx + 4} 
        />
      ))}

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <img
                src={logoCartografiaUrl}
                alt="Cartografia Social de Santos"
                className="h-12 w-auto mb-4 drop-shadow-lg"
              />
              <p className="text-blue-100">
                Uma plataforma interativa que mapeia territorialidades, lutas e conquistas dos movimentos sociais na cidade de Santos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-blue-100">
                <li>
                  <Link to="/" className="hover:text-white transition">Home</Link>
                </li>
                <li>
                  <Link to="/mapa" className="hover:text-white transition">Mapa</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{stats.totalLocais} locais mapeados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>{stats.comImagens} com imagens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>{stats.comAudio} com áudio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

