import L from 'leaflet';

/**
 * Função simples para criar ícones Leaflet com ícones Phosphor
 * Versão simplificada que funciona sem problemas de importação
 */
export const createPhosphorLeafletIcon = (iconName, options = {}) => {
  const {
    variant = 'regular',
    color = '#000000',
    size = 24,
    backgroundColor = '#ffffff',
    borderColor = '#000000',
    animated = true
  } = options;

  // Mapeamento de ícones Phosphor para seus paths SVG
  const iconPaths = {
    'MapPin': {
      regular: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fill: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
    },
    'FirstAid': {
      regular: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm6 8h-2v-6h2v6zm0-8h-2V7h2v2z',
      fill: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm6 8h-2v-6h2v6zm0-8h-2V7h2v2z'
    },
    'GraduationCap': {
      regular: 'M12 3L1 9l11 6 9-4.91V17h2V9l-11-6zM5.13 10.12L12 14l6.87-3.88L12 8.5 5.13 10.12z',
      fill: 'M12 3L1 9l11 6 9-4.91V17h2V9l-11-6zM5.13 10.12L12 14l6.87-3.88L12 8.5 5.13 10.12z'
    },
    'Church': {
      regular: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      fill: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    },
    'Users': {
      regular: 'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10h-2l-.99-1.01A2.5 2.5 0 0 0 9 8H7.46c-.8 0-1.54.37-2.01.99L3 10.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z',
      fill: 'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10h-2l-.99-1.01A2.5 2.5 0 0 0 9 8H7.46c-.8 0-1.54.37-2.01.99L3 10.5V22h2v-6h2v6h2v-6h2v6h2v-6h2v6h2z'
    },
    'Clock': {
      regular: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
      fill: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z'
    },
    'GameController': {
      regular: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      fill: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    },
    'HandsClapping': {
      regular: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      fill: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
    },
    'Map': {
      regular: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fill: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
    }
  };

  const iconData = iconPaths[iconName];
  if (!iconData) {
    console.warn(`Ícone "${iconName}" não encontrado, usando MapPin como fallback`);
    return createPhosphorLeafletIcon('MapPin', options);
  }

  const path = iconData[variant] || iconData.regular || iconData.fill;

  return new L.DivIcon({
    className: `phosphor-marker-${iconName}`,
    html: `
      <div class="phosphor-marker-container">
        <div class="phosphor-marker-background" style="background-color: ${backgroundColor}; border: 2px solid ${borderColor};">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}">
            <path d="${path}"/>
          </svg>
        </div>
        ${animated ? '<div class="phosphor-marker-pulse"></div>' : ''}
      </div>
      <style>
        .phosphor-marker-${iconName} {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          background: transparent;
          border: none;
        }
        .phosphor-marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${size + 16}px;
          height: ${size + 16}px;
        }
        .phosphor-marker-background {
          width: ${size + 8}px;
          height: ${size + 8}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          ${animated ? 'animation: phosphorBounce 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;' : ''}
        }
        .phosphor-marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${size + 16}px;
          height: ${size + 16}px;
          border: 2px solid ${color};
          border-radius: 50%;
          opacity: 0.6;
          animation: phosphorPulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes phosphorBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes phosphorPulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [size + 16, size + 16],
    iconAnchor: [(size + 16) / 2, size + 16],
    popupAnchor: [0, -(size + 16)],
  });
};

// Função helper para criar ícones baseados em tipo de localização
export const createLocationIcon = (locationType, options = {}) => {
  const iconMap = {
    'saude': { name: 'FirstAid', variant: 'fill', color: '#00BCD4' },
    'saúde': { name: 'FirstAid', variant: 'fill', color: '#00BCD4' },
    'educacao': { name: 'GraduationCap', variant: 'fill', color: '#8B5CF6' },
    'educação': { name: 'GraduationCap', variant: 'fill', color: '#8B5CF6' },
    'cultura': { name: 'PaintBrush', variant: 'fill', color: '#3B82F6' },
    'lazer': { name: 'GameController', variant: 'fill', color: '#3B82F6' },
    'assistencia': { name: 'HandsClapping', variant: 'fill', color: '#10B981' },
    'assistência': { name: 'HandsClapping', variant: 'fill', color: '#10B981' },
    'historico': { name: 'Clock', variant: 'fill', color: '#FBBF24' },
    'histórico': { name: 'Clock', variant: 'fill', color: '#FBBF24' },
    'comunidades': { name: 'Users', variant: 'fill', color: '#EF4444' },
    'bairro': { name: 'MapPin', variant: 'fill', color: '#FF9800' },
    'bairros': { name: 'MapPin', variant: 'fill', color: '#FF9800' },
    'religiao': { name: 'Church', variant: 'fill', color: '#4B5563' },
    'religioso': { name: 'Church', variant: 'fill', color: '#4B5563' },
    'igreja': { name: 'Church', variant: 'fill', color: '#4B5563' }
  };

  const iconConfig = iconMap[locationType] || { name: 'MapPin', variant: 'regular', color: '#6B7280' };
  
  return createPhosphorLeafletIcon(iconConfig.name, {
    variant: iconConfig.variant,
    color: iconConfig.color,
    size: 24,
    backgroundColor: '#ffffff',
    borderColor: iconConfig.color,
    animated: true,
    ...options
  });
};