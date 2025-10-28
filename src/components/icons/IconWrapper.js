import React from 'react';
import * as PhosphorIcons from 'phosphor-react';

/**
 * Componente modular para Phosphor Icons
 * Permite usar qualquer ícone do Phosphor de forma consistente
 * 
 * @param {string} name - Nome do ícone (ex: 'MapPin', 'House', 'Car')
 * @param {string} variant - Variante do ícone ('regular', 'bold', 'thin', 'light', 'duotone', 'fill')
 * @param {string} size - Tamanho do ícone ('xs', 'sm', 'md', 'lg', 'xl', 'xxl' ou número)
 * @param {string} color - Cor do ícone
 * @param {string} className - Classes CSS adicionais
 * @param {object} style - Estilos inline
 * @param {function} onClick - Função de clique
 * @param {boolean} disabled - Se o ícone está desabilitado
 * @param {string} weight - Peso do ícone (para compatibilidade)
 * @param {object} ...props - Outras props passadas para o ícone
 */
const IconWrapper = ({
  name,
  variant = 'regular',
  size = 'md',
  color,
  className = '',
  style = {},
  onClick,
  disabled = false,
  weight,
  ...props
}) => {
  // Mapeamento de tamanhos para valores numéricos do Phosphor
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48
  };

  // Converte tamanho string para número se necessário
  const iconSize = typeof size === 'string' ? sizeMap[size] || 20 : size;

  // Mapeamento de variantes para pesos do Phosphor
  const variantMap = {
    regular: 'regular',
    bold: 'bold',
    thin: 'thin',
    light: 'light',
    duotone: 'duotone',
    fill: 'fill'
  };

  const iconWeight = weight || variantMap[variant] || 'regular';

  // Verifica se o ícone existe
  const IconComponent = PhosphorIcons[name];
  
  if (!IconComponent) {
    console.warn(`Ícone "${name}" não encontrado no Phosphor Icons`);
    return null;
  }

  // Classes CSS base
  const baseClasses = 'inline-block';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const clickableClasses = onClick ? 'hover:opacity-80 transition-opacity' : '';

  const combinedClassName = [
    baseClasses,
    disabledClasses,
    clickableClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <IconComponent
      size={iconSize}
      color={color}
      weight={iconWeight}
      className={combinedClassName}
      style={style}
      onClick={disabled ? undefined : onClick}
      {...props}
    />
  );
};

export default IconWrapper;