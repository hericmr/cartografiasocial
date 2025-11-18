// Exportações principais do sistema de ícones
export { default as IconWrapper } from './IconWrapper';
export {
  LOCATION_TYPE_ICONS,
  ACTION_ICONS,
  STATUS_ICONS,
  getIconConfig,
  getLocationIcon,
  getActionIcon,
  getStatusIcon
} from './iconConfig';

// Re-exportação de ícones específicos do Phosphor para uso direto (opcional)
export * as PhosphorIcons from 'phosphor-react';