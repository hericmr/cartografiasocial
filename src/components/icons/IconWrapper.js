import React from 'react';
import {
  Buildings,
  Clock,
  FirstAid,
  GameController,
  GraduationCap,
  HandsClapping,
  List,
  MapPin,
  MapTrifold,
  Minus,
  Users,
} from 'phosphor-react';

// Importação explícita: `import *` colocava a biblioteca inteira no bundle
const ICONS = {
  Buildings,
  Clock,
  FirstAid,
  GameController,
  GraduationCap,
  HandsClapping,
  List,
  MapPin,
  MapTrifold,
  Minus,
  Users,
};

const SIZE_MAP = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, xxl: 48 };

/**
 * @param {string} name - Nome do ícone (precisa estar em ICONS)
 * @param {string} variant - 'regular', 'bold', 'thin', 'light', 'duotone' ou 'fill'
 * @param {string|number} size - 'xs'...'xxl' ou número
 */
const IconWrapper = ({ name, variant = 'regular', size = 'md', color, className = '', ...props }) => {
  const IconComponent = ICONS[name];
  if (!IconComponent) return null;

  const iconSize = typeof size === 'string' ? SIZE_MAP[size] || 20 : size;

  return (
    <IconComponent
      size={iconSize}
      color={color}
      weight={variant}
      className={`inline-block ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
};

export default IconWrapper;
