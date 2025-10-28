import L from 'leaflet';
import { getLocationIcon } from './iconConfig';

/**
 * Factory para criar ícones Leaflet com Phosphor Icons
 * Converte ícones Phosphor em ícones compatíveis com Leaflet
 */
class LeafletIconFactory {
  constructor() {
    this.iconCache = new Map();
  }

  /**
   * Cria um ícone Leaflet com um ícone Phosphor
   * @param {string} iconName - Nome do ícone Phosphor
   * @param {string} variant - Variante do ícone (regular, bold, fill, etc.)
   * @param {string} color - Cor do ícone
   * @param {number} size - Tamanho do ícone
   * @param {string} backgroundColor - Cor de fundo do marcador
   * @param {string} borderColor - Cor da borda do marcador
   * @param {boolean} animated - Se o ícone deve ter animação
   * @returns {L.DivIcon} - Ícone Leaflet
   */
  createIcon({
    iconName,
    variant = 'regular',
    color = '#000000',
    size = 24,
    backgroundColor = '#ffffff',
    borderColor = '#000000',
    animated = true
  }) {
    const cacheKey = `${iconName}-${variant}-${color}-${size}-${backgroundColor}-${borderColor}-${animated}`;
    
    if (this.iconCache.has(cacheKey)) {
      return this.iconCache.get(cacheKey);
    }

    // Mapeamento de variantes para pesos do Phosphor
    const variantMap = {
      regular: 'regular',
      bold: 'bold',
      thin: 'thin',
      light: 'light',
      duotone: 'duotone',
      fill: 'fill'
    };

    const weight = variantMap[variant] || 'regular';

    // Cria o SVG do ícone Phosphor
    const iconSvg = this.createPhosphorIconSVG(iconName, weight, color, size);

    const icon = new L.DivIcon({
      className: `phosphor-marker-${iconName}`,
      html: `
        <div class="phosphor-marker-container">
          <div class="phosphor-marker-background" style="background-color: ${backgroundColor}; border: 2px solid ${borderColor};">
            ${iconSvg}
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

    this.iconCache.set(cacheKey, icon);
    return icon;
  }

  /**
   * Cria SVG do ícone Phosphor
   * @param {string} iconName - Nome do ícone
   * @param {string} weight - Peso do ícone
   * @param {string} color - Cor do ícone
   * @param {number} size - Tamanho do ícone
   * @returns {string} - SVG do ícone
   */
  createPhosphorIconSVG(iconName, weight, color, size) {
    // Mapeamento de ícones Phosphor para seus paths SVG
    // Este é um mapeamento simplificado - em produção, você pode usar uma biblioteca
    // que fornece os paths SVG dos ícones Phosphor
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
      return this.createPhosphorIconSVG('MapPin', weight, color, size);
    }

    const path = iconData[weight] || iconData.regular || iconData.fill;

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}">
        <path d="${path}"/>
      </svg>
    `;
  }

  /**
   * Cria ícone baseado na configuração de tipo de localização
   * @param {string} locationType - Tipo de localização
   * @param {object} options - Opções adicionais
   * @returns {L.DivIcon} - Ícone Leaflet
   */
  createLocationIcon(locationType, options = {}) {
    const iconConfig = getLocationIcon(locationType);
    
    return this.createIcon({
      iconName: iconConfig.name,
      variant: iconConfig.variant,
      color: iconConfig.color,
      size: iconConfig.size === 'lg' ? 28 : iconConfig.size === 'md' ? 24 : 20,
      backgroundColor: options.backgroundColor || '#ffffff',
      borderColor: options.borderColor || iconConfig.color,
      animated: options.animated !== false
    });
  }

  /**
   * Limpa o cache de ícones
   */
  clearCache() {
    this.iconCache.clear();
  }
}

// Instância singleton
const iconFactory = new LeafletIconFactory();

// Exportar tanto a classe quanto a instância
export { LeafletIconFactory };
export default iconFactory;