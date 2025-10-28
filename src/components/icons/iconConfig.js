/**
 * Configuração centralizada de ícones para o projeto
 * Facilita a manutenção e consistência dos ícones
 */

// Ícones para tipos de localização
export const LOCATION_TYPE_ICONS = {
  // Saúde
  'saude': {
    name: 'FirstAid',
    variant: 'fill',
    color: '#00BCD4', // cyan-500
    size: 'lg'
  },
  'saúde': {
    name: 'FirstAid',
    variant: 'fill',
    color: '#00BCD4',
    size: 'lg'
  },
  'hospital': {
    name: 'Hospital',
    variant: 'fill',
    color: '#ef4444', // red-500
    size: 'lg'
  },
  'posto_saude': {
    name: 'FirstAid',
    variant: 'regular',
    color: '#f87171', // red-400
    size: 'md'
  },
  'farmacia': {
    name: 'Pill',
    variant: 'fill',
    color: '#dc2626', // red-600
    size: 'md'
  },

  // Educação
  'educacao': {
    name: 'GraduationCap',
    variant: 'fill',
    color: '#8B5CF6', // purple-500
    size: 'lg'
  },
  'educação': {
    name: 'GraduationCap',
    variant: 'fill',
    color: '#8B5CF6',
    size: 'lg'
  },
  'escola': {
    name: 'Student',
    variant: 'fill',
    color: '#8B5CF6',
    size: 'lg'
  },
  'universidade': {
    name: 'GraduationCap',
    variant: 'fill',
    color: '#7c3aed', // purple-600
    size: 'lg'
  },
  'creche': {
    name: 'Baby',
    variant: 'fill',
    color: '#a855f7', // purple-400
    size: 'md'
  },

  // Cultura e Lazer
  'cultura': {
    name: 'PaintBrush',
    variant: 'fill',
    color: '#3B82F6', // blue-500
    size: 'lg'
  },
  'lazer': {
    name: 'GameController',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'teatro': {
    name: 'TheaterMasks',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'museu': {
    name: 'Museum',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'biblioteca': {
    name: 'Books',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'parque': {
    name: 'Tree',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'turismo': {
    name: 'Camera',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'monumento': {
    name: 'Monument',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },
  'memorial': {
    name: 'Monument',
    variant: 'regular',
    color: '#3B82F6',
    size: 'lg'
  },
  'esporte': {
    name: 'SoccerBall',
    variant: 'fill',
    color: '#3B82F6',
    size: 'lg'
  },

  // Assistência Social
  'assistencia': {
    name: 'HandsClapping',
    variant: 'fill',
    color: '#10B981', // emerald-500
    size: 'lg'
  },
  'assistência': {
    name: 'HandsClapping',
    variant: 'fill',
    color: '#10B981',
    size: 'lg'
  },

  // Histórico
  'historico': {
    name: 'Clock',
    variant: 'fill',
    color: '#FBBF24', // amber-400
    size: 'lg'
  },
  'histórico': {
    name: 'Clock',
    variant: 'fill',
    color: '#FBBF24',
    size: 'lg'
  },
  'patrimônio histórico': {
    name: 'Clock',
    variant: 'fill',
    color: '#FBBF24',
    size: 'lg'
  },
  'marco histórico': {
    name: 'Clock',
    variant: 'fill',
    color: '#FBBF24',
    size: 'lg'
  },
  'fortificação': {
    name: 'Shield',
    variant: 'fill',
    color: '#FBBF24',
    size: 'lg'
  },
  'engenharia': {
    name: 'Gear',
    variant: 'fill',
    color: '#FBBF24',
    size: 'lg'
  },

  // Comunidades
  'comunidades': {
    name: 'Users',
    variant: 'fill',
    color: '#EF4444', // red-500
    size: 'lg'
  },

  // Bairros
  'bairro': {
    name: 'MapPin',
    variant: 'fill',
    color: '#FF9800', // orange-500
    size: 'lg'
  },
  'bairros': {
    name: 'MapPin',
    variant: 'fill',
    color: '#FF9800',
    size: 'lg'
  },

  // Esporte (seção separada)
  'quadra': {
    name: 'Basketball',
    variant: 'fill',
    color: '#f59e0b', // amber-500
    size: 'md'
  },
  'piscina': {
    name: 'SwimmingPool',
    variant: 'fill',
    color: '#06b6d4', // cyan-500
    size: 'md'
  },

  // Transporte
  'transporte': {
    name: 'Bus',
    variant: 'fill',
    color: '#6b7280', // gray-500
    size: 'lg'
  },
  'onibus': {
    name: 'Bus',
    variant: 'fill',
    color: '#6b7280',
    size: 'md'
  },
  'metro': {
    name: 'Train',
    variant: 'fill',
    color: '#374151', // gray-700
    size: 'md'
  },
  'estacao': {
    name: 'TrainStation',
    variant: 'fill',
    color: '#374151',
    size: 'md'
  },

  // Comércio e Serviços
  'comercio': {
    name: 'Storefront',
    variant: 'fill',
    color: '#f97316', // orange-500
    size: 'lg'
  },
  'mercado': {
    name: 'ShoppingCart',
    variant: 'fill',
    color: '#f97316',
    size: 'md'
  },
  'banco': {
    name: 'Bank',
    variant: 'fill',
    color: '#059669', // emerald-600
    size: 'md'
  },
  'correios': {
    name: 'Envelope',
    variant: 'fill',
    color: '#dc2626', // red-600
    size: 'md'
  },

  // Religião
  'religiao': {
    name: 'Church',
    variant: 'fill',
    color: '#6366f1', // indigo-500
    size: 'lg'
  },
  'igreja': {
    name: 'Church',
    variant: 'fill',
    color: '#6366f1',
    size: 'md'
  },
  'templo': {
    name: 'Church',
    variant: 'regular',
    color: '#8b5cf6', // violet-500
    size: 'md'
  },

  // Segurança
  'seguranca': {
    name: 'Shield',
    variant: 'fill',
    color: '#1f2937', // gray-800
    size: 'lg'
  },
  'policia': {
    name: 'Shield',
    variant: 'fill',
    color: '#1f2937',
    size: 'md'
  },
  'bombeiros': {
    name: 'Fire',
    variant: 'fill',
    color: '#dc2626', // red-600
    size: 'md'
  },

  // Padrão para tipos não mapeados
  'default': {
    name: 'MapPin',
    variant: 'fill',
    color: '#6b7280', // gray-500
    size: 'md'
  }
};

// Ícones para ações da interface
export const ACTION_ICONS = {
  // Navegação
  close: { name: 'X', variant: 'regular', size: 'md' },
  menu: { name: 'List', variant: 'regular', size: 'md' },
  back: { name: 'ArrowLeft', variant: 'regular', size: 'md' },
  forward: { name: 'ArrowRight', variant: 'regular', size: 'md' },
  up: { name: 'ArrowUp', variant: 'regular', size: 'md' },
  down: { name: 'ArrowDown', variant: 'regular', size: 'md' },

  // Ações gerais
  edit: { name: 'Pencil', variant: 'regular', size: 'md' },
  delete: { name: 'Trash', variant: 'regular', size: 'md' },
  add: { name: 'Plus', variant: 'regular', size: 'md' },
  save: { name: 'FloppyDisk', variant: 'regular', size: 'md' },
  search: { name: 'MagnifyingGlass', variant: 'regular', size: 'md' },
  filter: { name: 'Funnel', variant: 'regular', size: 'md' },
  settings: { name: 'Gear', variant: 'regular', size: 'md' },
  info: { name: 'Info', variant: 'regular', size: 'md' },
  warning: { name: 'Warning', variant: 'fill', size: 'md', color: '#f59e0b' },
  error: { name: 'XCircle', variant: 'fill', size: 'md', color: '#ef4444' },
  success: { name: 'CheckCircle', variant: 'fill', size: 'md', color: '#10b981' },

  // Mídia
  play: { name: 'Play', variant: 'fill', size: 'md' },
  pause: { name: 'Pause', variant: 'fill', size: 'md' },
  volume: { name: 'SpeakerHigh', variant: 'regular', size: 'md' },
  mute: { name: 'SpeakerSlash', variant: 'regular', size: 'md' },
  image: { name: 'Image', variant: 'regular', size: 'md' },
  video: { name: 'Video', variant: 'regular', size: 'md' },
  audio: { name: 'Microphone', variant: 'regular', size: 'md' },

  // Compartilhamento
  share: { name: 'Share', variant: 'regular', size: 'md' },
  print: { name: 'Printer', variant: 'regular', size: 'md' },
  download: { name: 'Download', variant: 'regular', size: 'md' },
  upload: { name: 'Upload', variant: 'regular', size: 'md' },

  // Mapa
  map: { name: 'Map', variant: 'regular', size: 'md' },
  location: { name: 'MapPin', variant: 'regular', size: 'md' },
  layers: { name: 'Stack', variant: 'regular', size: 'md' },
  zoomIn: { name: 'ZoomIn', variant: 'regular', size: 'md' },
  zoomOut: { name: 'ZoomOut', variant: 'regular', size: 'md' },
  fullscreen: { name: 'ArrowsOut', variant: 'regular', size: 'md' }
};

// Ícones para status
export const STATUS_ICONS = {
  loading: { name: 'Spinner', variant: 'regular', size: 'md' },
  online: { name: 'WifiHigh', variant: 'regular', size: 'md', color: '#10b981' },
  offline: { name: 'WifiSlash', variant: 'regular', size: 'md', color: '#ef4444' },
  pending: { name: 'Clock', variant: 'regular', size: 'md', color: '#f59e0b' },
  active: { name: 'Circle', variant: 'fill', size: 'sm', color: '#10b981' },
  inactive: { name: 'Circle', variant: 'regular', size: 'sm', color: '#6b7280' }
};

// Função helper para obter configuração de ícone
export const getIconConfig = (type, category = 'location') => {
  switch (category) {
    case 'location':
      return LOCATION_TYPE_ICONS[type] || LOCATION_TYPE_ICONS.default;
    case 'action':
      return ACTION_ICONS[type] || ACTION_ICONS.info;
    case 'status':
      return STATUS_ICONS[type] || STATUS_ICONS.inactive;
    default:
      return LOCATION_TYPE_ICONS.default;
  }
};

// Função helper para obter ícone por tipo de localização
export const getLocationIcon = (locationType) => {
  return getIconConfig(locationType, 'location');
};

// Função helper para obter ícone de ação
export const getActionIcon = (actionType) => {
  return getIconConfig(actionType, 'action');
};

// Função helper para obter ícone de status
export const getStatusIcon = (statusType) => {
  return getIconConfig(statusType, 'status');
};