import { useEditLocationForm } from './useEditLocationForm';
import { useMediaHandlers } from './useMediaHandlers';
import { useAudioHandlers } from './useAudioHandlers';
import { validateLocationForm, cleanLocationData } from '../components/EditLocationPanel/utils/validation';

export const useEditLocationPanel = (initialLocation) => {
  const formState = useEditLocationForm(initialLocation);
  const mediaHandlers = useMediaHandlers(
    formState.mediaState,
    formState.setMediaState,
    formState.audioState,
    formState.setAudioState,
    formState.editedLocation,
    formState.setEditedLocation
  );
  const audioHandlers = useAudioHandlers(
    formState.audioState,
    formState.setAudioState,
    formState.mediaRecorderRef,
    formState.audioChunksRef,
    formState.audioPlayerRef,
    formState.setMediaState,
    formState.editedLocation,
    formState.setEditedLocation
  );

  const handleSubmit = (e, onSave) => {
    e.preventDefault();
    const errors = validateLocationForm(formState.editedLocation);
    formState.setErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const cleanLocation = cleanLocationData(formState.editedLocation);
      onSave(cleanLocation);
      formState.setShowConfirmation(true);
      setTimeout(() => {
        formState.setShowConfirmation(false);
      }, 3000);
    }
  };

  return {
    ...formState,
    ...mediaHandlers,
    ...audioHandlers,
    handleSubmit
  };
};