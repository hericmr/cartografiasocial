import React from "react";
import PropTypes from "prop-types";
import { X, Tag, MapPin, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useEditLocationPanel } from '../../hooks/useEditLocationPanel';
import AlertSection from "./components/AlertSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs";
import InfoTab from "./components/InfoTab";
import LocationTab from "./components/LocationTab";
import MediaTab from "./components/MediaTab";
import LinksTab from "./components/LinksTab";

const EditLocationPanel = ({ location, onClose, onSave }) => {
  const isCreateMode = !location || !location.id;
  
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
          <h2 className="text-lg font-bold text-gray-800">
            {isCreateMode ? 'Novo Local' : 'Editar Local'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Fechar painel"
          aria-label="Fechar painel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex-1 overflow-y-auto p-6">
          <AlertSection errors={errors} showConfirmation={showConfirmation} />

          {/* Campos obrigatórios - Aviso no topo */}
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              <strong>* Campos obrigatórios</strong>
            </p>
          </div>

          <form id="edit-location-form" onSubmit={(e) => handleSubmit(e, onSave)}>
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info" icon={Tag}>
                  Informações Básicas
                </TabsTrigger>
                <TabsTrigger value="location" icon={MapPin}>
                  Localização
                </TabsTrigger>
                <TabsTrigger value="media" icon={ImageIcon}>
                  Mídia
                </TabsTrigger>
                <TabsTrigger value="links" icon={LinkIcon}>
                  Links
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <InfoTab
                  editedLocation={editedLocation}
                  setEditedLocation={setEditedLocation}
                  dropdownOpen={dropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  handleTipoChange={handleTipoChange}
                  errors={errors}
                />
              </TabsContent>

              <TabsContent value="location">
                <LocationTab
                  editedLocation={editedLocation}
                  setEditedLocation={setEditedLocation}
                  errors={errors}
                />
              </TabsContent>

              <TabsContent value="media">
                <MediaTab
                  mediaState={mediaState}
                  audioState={audioState}
                  handleImageSelect={handleImageSelect}
                  handleUploadImages={handleUploadImages}
                  removeImage={removeImage}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  handleAudioPlayback={handleAudioPlayback}
                  handleUploadAudio={handleUploadAudio}
                />
              </TabsContent>

              <TabsContent value="links">
                <LinksTab
                  editedLocation={editedLocation}
                  setEditedLocation={setEditedLocation}
                />
              </TabsContent>
            </Tabs>
          </form>
        </div>

        {/* Barra de ações fixa no rodapé */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Todas as alterações serão salvas no banco de dados.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="edit-location-form"
                disabled={isSaving}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
              >
                {isSaving ? "Salvando..." : isCreateMode ? "Criar Local" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
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