export const validateLocationForm = (editedLocation) => {
  const errors = {};
  
  if (!editedLocation.titulo) {
    errors.titulo = "Título é obrigatório.";
  }
  
  if (!editedLocation.latitude || !editedLocation.longitude) {
    errors.localizacao = "Localização é obrigatória.";
  }
  
  if (!editedLocation.descricao_detalhada) {
    errors.descricao_detalhada = "Descrição detalhada é obrigatória.";
  }
  
  // Validação de URL para links
  if (editedLocation.links) {
    try {
      new URL(editedLocation.links);
    } catch {
      errors.links = "URL inválida.";
    }
  }
  
  // Validação de coordenadas
  if (editedLocation.latitude) {
    const lat = parseFloat(editedLocation.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = "Latitude deve estar entre -90 e 90.";
    }
  }
  
  if (editedLocation.longitude) {
    const lng = parseFloat(editedLocation.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = "Longitude deve estar entre -180 e 180.";
    }
  }
  
  return errors;
};

export const cleanLocationData = (editedLocation) => {
  return {
    ...editedLocation,
    imagens: editedLocation.imagens
      ? editedLocation.imagens
          .split(',')
          .map(url => url.trim())
          .filter(url => {
            try {
              new URL(url);
              return true;
            } catch {
              return false;
            }
          })
          .join(',')
      : ''
  };
};