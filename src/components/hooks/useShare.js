import slugify from "slugify";

export const useShare = (painelInfo) => {
  const gerarLinkCustomizado = () => {
    return (
      window.location.origin +
      window.location.pathname +
      "?panel=" +
      slugify(painelInfo.titulo, { lower: true, remove: /[*+~.()'"!:@]/g })
    );
  };

  const copiarLink = async () => {
    const url = gerarLinkCustomizado();
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
  };

  const compartilhar = () => {
    const url = gerarLinkCustomizado();
    const texto = `${painelInfo.titulo} — Cartografia Social de Santos`;
    
    if (navigator.share) {
      navigator.share({
        title: painelInfo.titulo,
        text: texto,
        url: url,
      }).catch(() => {});
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  return { gerarLinkCustomizado, copiarLink, compartilhar };
};