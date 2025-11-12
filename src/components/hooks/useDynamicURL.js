import { useEffect } from "react";

export const useDynamicURL = (painelInfo, gerarLinkCustomizado) => {
  useEffect(() => {
    if (painelInfo) {
      const url = gerarLinkCustomizado();
      // Usar replaceState para não criar uma nova entrada no histórico quando o painel já está aberto
      // Isso evita problemas com o botão voltar do navegador
      const currentUrl = window.location.href;
      if (!currentUrl.includes('?panel=')) {
        window.history.pushState({}, "", url);
      } else {
        window.history.replaceState({}, "", url);
      }
    }
  }, [painelInfo, gerarLinkCustomizado]);
};