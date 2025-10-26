import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useEditLocationForm = (initialLocation) => {
  const [editedLocation, setEditedLocation] = useState({
    ...initialLocation,
    latitude: initialLocation.localizacao ? initialLocation.localizacao.split(',')[0] : '',
    longitude: initialLocation.localizacao ? initialLocation.localizacao.split(',')[1] : '',
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
    if (initialLocation.imagens) {
      const existingImages = initialLocation.imagens.split(',').filter(url => url);
      setMediaState(prev => ({
        ...prev,
        imageUrls: existingImages
      }));
    }
  }, [initialLocation.imagens]);

  const validateForm = () => {
    const newErrors = {};
    if (!editedLocation.titulo) newErrors.titulo = "Título é obrigatório.";
    if (!editedLocation.latitude || !editedLocation.longitude) newErrors.localizacao = "Localização é obrigatória.";
    if (!editedLocation.descricao_detalhada) newErrors.descricao_detalhada = "Descrição detalhada é obrigatória.";
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
      tipo: tipo,
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