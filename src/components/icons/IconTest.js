import React from 'react';
import { IconWrapper, getLocationIcon, getActionIcon, getStatusIcon } from './index';

/**
 * Componente de teste para verificar se os ícones estão funcionando
 * Este componente pode ser removido em produção
 */
const IconTest = () => {
  const locationTypes = [
    'saude', 'educação', 'cultura', 'lazer', 'assistencia', 
    'historico', 'comunidades', 'bairro', 'religiao'
  ];

  const actionTypes = [
    'close', 'menu', 'edit', 'delete', 'add', 'save', 
    'search', 'filter', 'settings', 'info'
  ];

  const statusTypes = [
    'loading', 'online', 'offline', 'pending', 'active', 'inactive'
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Teste de Ícones Phosphor</h1>
      
      {/* Teste de ícones de localização */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Ícones de Localização</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {locationTypes.map((type) => {
            const config = getLocationIcon(type);
            return (
              <div key={type} className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                <IconWrapper
                  name={config.name}
                  variant={config.variant}
                  color={config.color}
                  size={config.size}
                />
                <span className="mt-2 text-sm font-medium text-gray-700">{type}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Teste de ícones de ação */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Ícones de Ação</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {actionTypes.map((type) => {
            const config = getActionIcon(type);
            return (
              <div key={type} className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                <IconWrapper
                  name={config.name}
                  variant={config.variant}
                  color={config.color}
                  size={config.size}
                />
                <span className="mt-2 text-sm font-medium text-gray-700">{type}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Teste de ícones de status */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Ícones de Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {statusTypes.map((type) => {
            const config = getStatusIcon(type);
            return (
              <div key={type} className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
                <IconWrapper
                  name={config.name}
                  variant={config.variant}
                  color={config.color}
                  size={config.size}
                />
                <span className="mt-2 text-sm font-medium text-gray-700">{type}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Teste de diferentes tamanhos */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Diferentes Tamanhos</h2>
        <div className="flex items-center gap-8 p-4 bg-white rounded-lg shadow">
          {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((size) => (
            <div key={size} className="flex flex-col items-center">
              <IconWrapper
                name="MapPin"
                variant="fill"
                color="#3B82F6"
                size={size}
              />
              <span className="mt-2 text-sm font-medium text-gray-700">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Teste de diferentes variantes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Diferentes Variantes</h2>
        <div className="flex items-center gap-8 p-4 bg-white rounded-lg shadow">
          {['regular', 'bold', 'thin', 'light', 'duotone', 'fill'].map((variant) => (
            <div key={variant} className="flex flex-col items-center">
              <IconWrapper
                name="Heart"
                variant={variant}
                color="#EF4444"
                size="lg"
              />
              <span className="mt-2 text-sm font-medium text-gray-700">{variant}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default IconTest;