import React from 'react';
import { MapPin, Info as InfoIcon, Navigation } from 'lucide-react';
import AddressSearch from '../../AddressSearch';
import InputField from '../../AddLocationPanel/components/InputField';
import MapSection from '../../AddLocationPanel/components/MapSection';

const LocationTab = ({ 
  editedLocation, 
  setEditedLocation, 
  errors
}) => {
  const handleAddressSelect = (addressData) => {
    setEditedLocation(prev => ({
      ...prev,
      latitude: addressData.latitude,
      longitude: addressData.longitude,
      localizacao: `${addressData.latitude},${addressData.longitude}`
    }));
  };

  const parseLocation = (localizacao) => {
    if (!localizacao) return { latitude: '', longitude: '' };
    const parts = localizacao.split(',');
    if (parts.length === 2) {
      return {
        latitude: parts[0].trim(),
        longitude: parts[1].trim()
      };
    }
    return { latitude: '', longitude: '' };
  };

  const currentCoords = parseLocation(editedLocation.localizacao);

  const validateCoordinate = (value, type) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    if (type === 'latitude') {
      return Math.max(-90, Math.min(90, numValue));
    } else if (type === 'longitude') {
      return Math.max(-180, Math.min(180, numValue));
    }
    return numValue;
  };

  const handleCoordinateChange = (type, value) => {
    const validatedValue = validateCoordinate(value, type);
    setEditedLocation(prev => {
      const newLocation = { ...prev };
      if (type === 'latitude') {
        newLocation.latitude = validatedValue;
      } else if (type === 'longitude') {
        newLocation.longitude = validatedValue;
      }
      if (newLocation.latitude !== undefined && newLocation.longitude !== undefined) {
        newLocation.localizacao = `${newLocation.latitude},${newLocation.longitude}`;
      }
      return newLocation;
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setEditedLocation(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          localizacao: `${position.coords.latitude},${position.coords.longitude}`
        }));
      },
      (error) => {
        alert("Erro ao obter localização. Verifique as permissões do navegador.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const hasCoordinates = currentCoords.latitude && currentCoords.longitude;

  return (
    <div className="space-y-6">
      {/* Coordenadas atuais - Badge */}
      {hasCoordinates && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            <strong>Coordenadas atuais:</strong> {parseFloat(currentCoords.latitude).toFixed(6)}, {parseFloat(currentCoords.longitude).toFixed(6)}
          </span>
        </div>
      )}

      {/* Buscar endereço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar endereço
        </label>
        <AddressSearch onAddressSelect={handleAddressSelect} />
      </div>

      {/* Botão Usar minha localização */}
      <div>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>Usar minha localização</span>
        </button>
      </div>

      {/* Campos de coordenadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputField
            label="Latitude"
            id="latitude"
            type="number"
            step="any"
            value={currentCoords.latitude}
            onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
            placeholder="Ex: -23.9655"
            error={errors.latitude}
          />
        </div>
        <div>
          <InputField
            label="Longitude"
            id="longitude"
            type="number"
            step="any"
            value={currentCoords.longitude}
            onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
            placeholder="Ex: -46.3331"
            error={errors.longitude}
          />
        </div>
      </div>

      {/* Mapa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mapa
        </label>
        <MapSection
          newLocation={editedLocation}
          setNewLocation={setEditedLocation}
          error={errors.localizacao}
        />
      </div>

      {/* Dica */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <InfoIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Clique no mapa, busque um endereço ou use sua localização atual
        </p>
      </div>
    </div>
  );
};

export default LocationTab;

