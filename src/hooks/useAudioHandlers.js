import { supabase } from '../supabaseClient';

export const useAudioHandlers = (audioState, setAudioState, mediaRecorderRef, audioChunksRef, audioPlayerRef, setMediaState, editedLocation, setEditedLocation) => {
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioState(prev => ({ ...prev, audioBlob }));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setAudioState(prev => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setMediaState(prev => ({
        ...prev,
        uploadError: "Erro ao acessar o microfone. Verifique as permissões."
      }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && audioState.isRecording) {
      mediaRecorderRef.current.stop();
      setAudioState(prev => ({ ...prev, isRecording: false }));
    }
  };

  const handleAudioPlayback = () => {
    if (!audioState.audioBlob) return;

    if (audioState.isPlaying) {
      audioPlayerRef.current?.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    } else {
      const audioUrl = URL.createObjectURL(audioState.audioBlob);
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const handleUploadAudio = async () => {
    if (!audioState.audioBlob) return;

    setAudioState(prev => ({ ...prev, uploadingAudio: true }));
    setMediaState(prev => ({ ...prev, uploadError: "" }));

    try {
      const fileName = `audio_${Math.random().toString(36).substring(2)}.wav`;
      const filePath = `audios/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, audioState.audioBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setEditedLocation(prev => ({
        ...prev,
        audio: publicUrl
      }));

      setAudioState(prev => ({
        ...prev,
        audioBlob: null,
        isPlaying: false,
        uploadingAudio: false
      }));
    } catch (error) {
      console.error('Erro no upload do áudio:', error);
      setMediaState(prev => ({
        ...prev,
        uploadError: "Erro ao fazer upload do áudio. Tente novamente."
      }));
      setAudioState(prev => ({ ...prev, uploadingAudio: false }));
    }
  };

  return {
    startRecording,
    stopRecording,
    handleAudioPlayback,
    handleUploadAudio
  };
};