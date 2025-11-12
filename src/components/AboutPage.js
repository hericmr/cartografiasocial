import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AboutPage = () => {
  const [welcomeConfig, setWelcomeConfig] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  const openImageModal = useCallback((imageSrc) => {
    const index = images.indexOf(imageSrc);
    if (index >= 0) {
      setSelectedImage(imageSrc);
      setSelectedImageIndex(index);
    }
  }, [images]);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
      return nextIndex;
    });
  }, [images]);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prevIndex) => {
      const prev = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      setSelectedImage(images[prev]);
      return prev;
    });
  }, [images]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            prevImage();
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            nextImage();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, images.length, prevImage, nextImage, closeImageModal]);

  return (
    <div className="flex-1 overflow-auto bg-white text-green-900">
      <section className="bg-green-950 text-white py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center text-sm text-green-200 gap-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span>Sobre</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {welcomeConfig?.title || 'Sobre a Cartografia Social de Santos'}
                </h1>
                <p className="mt-3 text-green-100 max-w-2xl">
                  Conheça em detalhes o projeto, suas metodologias e quem faz parte dessa cartografia colaborativa.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 hover:bg-white/10 transition"
                >
                  Voltar para Home
                </Link>
                <Link
                  to="/mapa"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-green-950 font-semibold hover:bg-green-400 transition"
                >
                  Explorar o mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="space-y-12">
            {/* Audio Section - Minimalist, before content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-8 border-b border-gray-200"
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

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-lg max-w-none prose-headings:text-green-900 prose-p:text-gray-700 prose-strong:text-green-900 prose-a:text-green-600 prose-a:hover:text-green-700 prose-a:underline prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl"
              dangerouslySetInnerHTML={{ __html: welcomeConfig?.content || `
                <p>Uma cartografia colaborativa que reúne os territórios, memórias e lutas dos movimentos sociais em Santos.</p>
                <p>Explore o mapa e descubra histórias contadas por quem vive a cidade todos os dias.</p>
              ` }}
            />

            {/* Gallery Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-t border-gray-200 pt-8"
            >
              <h2 className="text-2xl font-semibold text-green-900 mb-4">Galeria de imagens</h2>
              <p className="text-gray-600 mb-6">Clique nas imagens para ampliar</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <button
                    key={image}
                    className="relative group rounded-lg overflow-hidden shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white"
                    onClick={() => openImageModal(image)}
                    title={`Abrir imagem ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Registro visual ${index + 1}`}
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="border-t border-gray-200 pt-8"
            >
              <Link
                to="/mapa"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Explorar o mapa
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                title="Fechar (ESC)"
              >
                <X className="w-8 h-8" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                    title="Imagem anterior (←)"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
                    title="Próxima imagem (→)"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <img
                src={selectedImage}
                alt={`Imagem ${selectedImageIndex + 1} de ${images.length}`}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} de {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;

