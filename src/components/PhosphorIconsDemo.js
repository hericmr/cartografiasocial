import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { IconWrapper, createLocationIcon } from './icons';

/**
 * Componente de demonstração dos ícones Phosphor no mapa
 * Este componente mostra como usar os novos ícones Phosphor
 */
const PhosphorIconsDemo = () => {
  const [selectedIcon, setSelectedIcon] = useState('MapPin');

  // Dados de exemplo para demonstração
  const demoLocations = [
    {
      id: 1,
      name: 'Hospital Central',
      position: [-23.9608, -46.3336],
      type: 'saude'
    },
    {
      id: 2,
      name: 'Universidade Federal',
      position: [-23.9508, -46.3336],
      type: 'educação'
    },
    {
      id: 3,
      name: 'Teatro Municipal',
      position: [-23.9408, -46.3336],
      type: 'cultura'
    },
    {
      id: 4,
      name: 'Centro de Assistência',
      position: [-23.9308, -46.3336],
      type: 'assistencia'
    },
    {
      id: 5,
      name: 'Igreja Matriz',
      position: [-23.9208, -46.3336],
      type: 'religiao'
    }
  ];

  const iconTypes = [
    { key: 'saude', label: 'Saúde', icon: 'FirstAid' },
    { key: 'educação', label: 'Educação', icon: 'GraduationCap' },
    { key: 'cultura', label: 'Cultura', icon: 'PaintBrush' },
    { key: 'assistencia', label: 'Assistência', icon: 'HandsClapping' },
    { key: 'religiao', label: 'Religião', icon: 'Church' },
    { key: 'historico', label: 'Histórico', icon: 'Clock' },
    { key: 'comunidades', label: 'Comunidades', icon: 'Users' },
    { key: 'bairro', label: 'Bairro', icon: 'MapPin' }
  ];

  return (
    <div className="w-full h-screen flex">
      {/* Painel lateral com controles */}
      <div className="w-80 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Demonstração de Ícones Phosphor</h2>
        
        {/* Seletor de ícones */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Tipos de Localização</h3>
          <div className="grid grid-cols-2 gap-2">
            {iconTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedIcon(type.key)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedIcon === type.key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center">
                  <IconWrapper
                    name={type.icon}
                    variant="fill"
                    size="md"
                    color={selectedIcon === type.key ? '#3B82F6' : '#6B7280'}
                  />
                  <span className="text-xs mt-1 text-center">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Informações sobre o ícone selecionado */}
        <div className="mb-6 p-4 bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ícone Selecionado</h3>
          <div className="flex items-center gap-3">
            <IconWrapper
              name={iconTypes.find(t => t.key === selectedIcon)?.icon || 'MapPin'}
              variant="fill"
              size="lg"
              color="#3B82F6"
            />
            <div>
              <p className="font-medium">
                {iconTypes.find(t => t.key === selectedIcon)?.label || 'MapPin'}
              </p>
              <p className="text-sm text-gray-600">
                Tipo: {selectedIcon}
              </p>
            </div>
          </div>
        </div>

        {/* Diferentes tamanhos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Diferentes Tamanhos</h3>
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
              <div key={size} className="flex flex-col items-center">
                <IconWrapper
                  name="MapPin"
                  variant="fill"
                  size={size}
                  color="#3B82F6"
                />
                <span className="text-xs mt-1">{size}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diferentes variantes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Diferentes Variantes</h3>
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            {['regular', 'bold', 'thin', 'light', 'fill'].map((variant) => (
              <div key={variant} className="flex flex-col items-center">
                <IconWrapper
                  name="Heart"
                  variant={variant}
                  size="md"
                  color="#EF4444"
                />
                <span className="text-xs mt-1">{variant}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1">
        <MapContainer
          center={[-23.9608, -46.3336]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Marcadores com ícones Phosphor */}
          {demoLocations.map((location) => {
            const icon = createLocationIcon(location.type, {
              backgroundColor: '#ffffff',
              borderColor: '#3B82F6',
              animated: true
            });

            return (
              <Marker
                key={location.id}
                position={location.position}
                icon={icon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{location.name}</h3>
                    <p className="text-gray-600">Tipo: {location.type}</p>
                    <div className="mt-2">
                      <IconWrapper
                        name={iconTypes.find(t => t.key === location.type)?.icon || 'MapPin'}
                        variant="fill"
                        size="sm"
                        color="#3B82F6"
                      />
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default PhosphorIconsDemo;