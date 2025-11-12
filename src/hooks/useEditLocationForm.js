import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useEditLocationForm = (initialLocation) => {
  // Se initialLocation for null ou undefined, criar objeto vazio
  const emptyLocation = {
    titulo: '',
    tipo: '',
    descricao_detalhada: '',
    localizacao: '',
    latitude: '',
    longitude: '',
    links: '',
    imagens: '',
    audio: '',
  };

  const location = initialLocation || emptyLocation;

  const [editedLocation, setEditedLocation] = useState({
    ...location,
    latitude: location.localizacao ? location.localizacao.split(',')[0] : '',
    longitude: location.localizacao ? location.localizacao.split(',')[1] : '',
    tipo: typeof location.tipo === 'string' ? location.tipo : '',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [mediaState, setMediaState] = useState({
    selectedImages: [],
    imageUrls: [],
    uploadingImages: false,
    uploadError: "",
  });

  const [audioState, setAudioState] = useState({
    isRecording: false,
    audioBlob: null,
    isPlaying: false,
    uploadingAudio: false
  });

  // Refs para áudio
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayerRef = useRef(null);

  // Inicializa as imagens existentes
  useEffect(() => {
    if (location && location.imagens) {
      const existingImages = location.imagens.split(',').filter(url => url);
      setMediaState(prev => ({
        ...prev,
        imageUrls: existingImages
      }));
    }
  }, [location?.imagens]);

  const validateForm = () => {
    const newErrors = {};
    if (!editedLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!editedLocation.latitude || !editedLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!editedLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
    if (!editedLocation.tipo || typeof editedLocation.tipo !== 'string') newErrors.tipo = "Tipo de marcador é obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, onSave) => {
    e.preventDefault();
    if (validateForm()) {
      // Limpa e valida as URLs das imagens
      const cleanLocation = {
        ...editedLocation,
        imagens: editedLocation.imagens
          ? editedLocation.imagens
              .split(',')
              .map(url => url.trim())
              .filter(url => {
                try {
                  new URL(url);
                  return true;
                } catch {
                  return false;
                }
              })
              .join(',')
          : ''
      };
      onSave(cleanLocation);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  const handleTipoChange = (tipo) => {
    setEditedLocation((prev) => ({
      ...prev,
      tipo: typeof tipo === 'string' ? tipo : String(tipo),
    }));
    setDropdownOpen(false);
  };

  return {
    editedLocation,
    setEditedLocation,
    dropdownOpen,
    setDropdownOpen,
    showConfirmation,
    setShowConfirmation,
    errors,
    setErrors,
    isSaving,
    setIsSaving,
    showPreview,
    setShowPreview,
    mediaState,
    setMediaState,
    audioState,
    setAudioState,
    mediaRecorderRef,
    audioChunksRef,
    audioPlayerRef,
    validateForm,
    handleSubmit,
    handleTipoChange
  };
};