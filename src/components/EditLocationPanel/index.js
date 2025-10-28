import React from "react";
import PropTypes from "prop-types";
import { X } from 'lucide-react';
import { useEditLocationPanel } from '../../hooks/useEditLocationPanel';
import MapSection from "../AddLocationPanel/components/MapSection";
import InputField from "../AddLocationPanel/components/InputField";
import RichTextEditor from "../AddLocationPanel/components/RichTextEditor";
import AlertSection from "./components/AlertSection";
import BasicInfoSection from "./components/BasicInfoSection";
import CoordinateFields from "./components/CoordinateFields";
import MediaSection from "./components/MediaSection";
import PreviewSection from "./components/PreviewSection";
import ActionSection from "./components/ActionSection";

const EditLocationPanel = ({ location, onClose, onSave }) => {
  const {
    editedLocation,
    setEditedLocation,
    dropdownOpen,
    setDropdownOpen,
    showConfirmation,
    errors,
    isSaving,
    showPreview,
    setShowPreview,
    mediaState,
    audioState,
    handleImageSelect,
    handleUploadImages,
    removeImage,
    startRecording,
    stopRecording,
    handleAudioPlayback,
    handleUploadAudio,
    handleTipoChange,
    handleSubmit
  } = useEditLocationPanel(location);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Editar Local</h2>
          <p className="text-sm text-gray-600 mt-1">Personalize as informações do local selecionado</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <AlertSection errors={errors} showConfirmation={showConfirmation} />

        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, onSave)}>
          <BasicInfoSection
            editedLocation={editedLocation}
            setEditedLocation={setEditedLocation}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            handleTipoChange={handleTipoChange}
            errors={errors}
          />
          
          {/* Coordenadas */}
          <CoordinateFields
            editedLocation={editedLocation}
            setEditedLocation={setEditedLocation}
            errors={errors}
          />
          
          {/* Localização */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa</h3>
            <MapSection
              newLocation={editedLocation}
              setNewLocation={setEditedLocation}
              error={errors.localizacao}
              handleImageSelect={handleImageSelect}
              handleUploadImages={handleUploadImages}
              handleUploadAudio={handleUploadAudio}
              mediaState={mediaState}
              audioState={audioState}
            />
          </div>

          {/* Descrição */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Descrição Detalhada</h3>
            <RichTextEditor
              value={editedLocation.descricao_detalhada}
              onChange={(value) => setEditedLocation(prev => ({ ...prev, descricao_detalhada: value }))}
              error={errors.descricao_detalhada}
            />
          </div>

          {/* Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Links Relacionados</h3>
            <InputField
              label="URL do Link"
              id="links"
              type="url"
              value={editedLocation.links || ""}
              onChange={(e) => setEditedLocation(prev => ({...prev, links: e.target.value}))}
              placeholder="Cole um link aqui (http://...)"
            />
          </div>

          <MediaSection
            mediaState={mediaState}
            handleImageSelect={handleImageSelect}
            handleUploadImages={handleUploadImages}
            removeImage={removeImage}
          />

          <PreviewSection
            editedLocation={editedLocation}
            mediaState={mediaState}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
          />

          <ActionSection isSaving={isSaving} onClose={onClose} />
        </form>
      </div>
    </div>
  );
};

EditLocationPanel.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titulo: PropTypes.string,
    tipo: PropTypes.string,
    descricao_detalhada: PropTypes.string,
    localizacao: PropTypes.string,
    links: PropTypes.string,
    imagens: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditLocationPanel;