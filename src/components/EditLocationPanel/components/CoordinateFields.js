import React from 'react';
import InputField from '../../AddLocationPanel/components/InputField';

const CoordinateFields = ({ 
  editedLocation, 
  setEditedLocation, 
  errors 
}) => {
  // Função para validar e formatar coordenadas
  const validateCoordinate = (value, type) => {
    if (!value) return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    if (type === 'latitude') {
      // Latitude deve estar entre -90 e 90
      return Math.max(-90, Math.min(90, numValue));
    } else if (type === 'longitude') {
      // Longitude deve estar entre -180 e 180
      return Math.max(-180, Math.min(180, numValue));
    }
    
    return numValue;
  };

  // Função para atualizar coordenadas
  const handleCoordinateChange = (type, value) => {
    const validatedValue = validateCoordinate(value, type);
    
    setEditedLocation(prev => {
      const newLocation = { ...prev };
      
      if (type === 'latitude') {
        newLocation.latitude = validatedValue;
      } else if (type === 'longitude') {
        newLocation.longitude = validatedValue;
      }
      
      // Atualizar o campo localizacao no formato "lat,lng"
      if (newLocation.latitude !== undefined && newLocation.longitude !== undefined) {
        newLocation.localizacao = `${newLocation.latitude},${newLocation.longitude}`;
      }
      
      return newLocation;
    });
  };

  // Função para extrair latitude e longitude do campo localizacao
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

  // Obter valores atuais das coordenadas
  const currentCoords = parseLocation(editedLocation.localizacao);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Coordenadas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InputField
            label="Latitude"
            id="latitude"
            type="number"
            step="any"
            value={currentCoords.latitude}
            onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
            placeholder="Ex: -23.9608"
            error={errors.latitude}
            helpText="Valor entre -90 e 90"
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
            helpText="Valor entre -180 e 180"
          />
        </div>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Você pode inserir as coordenadas manualmente nos campos acima ou clicar no mapa para selecionar a localização automaticamente.
        </p>
      </div>
    </div>
  );
};

export default CoordinateFields;