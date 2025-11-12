import { useEffect } from "react";
import slugify from "slugify";

export const useDynamicURL = (painelInfo, gerarLinkCustomizado) => {
  useEffect(() => {
    if (painelInfo && gerarLinkCustomizado) {
      try {
        const url = gerarLinkCustomizado();
        const currentParams = new URLSearchParams(window.location.search);
        const currentPanel = currentParams.get('panel');
        
        // Criar slug do painel atual usando a mesma função do useShare
        const newPanelSlug = slugify(painelInfo.titulo, { lower: true, remove: /[*+~.()'"!:@]/g });
        
        // Se o painel na URL é diferente do atual, usar pushState para criar nova entrada no histórico
        if (!currentPanel || currentPanel !== newPanelSlug) {
          window.history.pushState({ panel: newPanelSlug }, "", url);
        } else {
          // Se já está na URL correta, apenas garantir que está sincronizado
          window.history.replaceState({ panel: newPanelSlug }, "", url);
        }
      } catch (error) {
        console.error('Erro ao atualizar URL:', error);
      }
    }
  }, [painelInfo, gerarLinkCustomizado]);
};