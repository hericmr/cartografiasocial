import React from 'react';
import { MapPin, Info } from 'lucide-react';
import AddressSearch from '../../AddressSearch';
import InputField from '../../AddLocationPanel/components/InputField';
import MapSection from '../../AddLocationPanel/components/MapSection';

const LocationSection = ({ 
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

  // Parse location string to get coordinates
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

  // Show coordinates badge if available
  const hasCoordinates = currentCoords.latitude && currentCoords.longitude;

  return (
    <div className="space-y-4">
      {/* Coordenadas atuais - Badge */}
      {hasCoordinates && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            <strong>Coordenadas:</strong> {parseFloat(currentCoords.latitude).toFixed(6)}, {parseFloat(currentCoords.longitude).toFixed(6)}
          </span>
        </div>
      )}

      {/* Busca de endereço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar endereço
        </label>
        <AddressSearch onAddressSelect={handleAddressSelect} />
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

      {/* Dica com ícone */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          Clique no mapa ou busque um endereço para definir a localização
        </p>
      </div>
    </div>
  );
};

export default LocationSection;

