import React, { useState } from 'react';
import { Share2, Printer, Download, Copy, Check, Mail, Facebook, Twitter, MessageCircle } from 'lucide-react';

const ShareAndPrint = ({ content, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const currentUrl = window.location.href;
  const shareTitle = content?.titulo || 'Conteúdo da Cartografia Social';
  const shareText = content?.descricao_detalhada?.replace(/<[^>]*>/g, '').substring(0, 200) || '';

  // Compartilhar nativo
  const shareNative = async () => {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: currentUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para copiar URL
      copyToClipboard();
    }
  };

  // Copiar para área de transferência
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Compartilhar no Facebook
  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Compartilhar no Twitter
  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  // Compartilhar no WhatsApp
  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${currentUrl}`)}`;
    window.open(url, '_blank');
  };

  // Compartilhar por email
  const shareEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\nVeja mais em: ${currentUrl}`);
    const url = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = url;
  };

  // Imprimir
  const printContent = () => {
    setIsPrinting(true);
    
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${shareTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
            .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
            .content { margin-bottom: 20px; }
            .images { margin: 20px 0; }
            .images img { max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; }
            .footer { border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px; font-size: 12px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${shareTitle}</div>
            <div class="meta">
              <strong>Tipo:</strong> ${content?.tipo || 'Não especificado'} | 
              <strong>Completude:</strong> ${content?.pontuacaoPercentual || 0}%
            </div>
          </div>
          
          <div class="content">
            ${content?.descricao_detalhada || content?.descricao || 'Sem descrição disponível.'}
          </div>
          
          ${content?.imagens && content.imagens.length > 0 ? `
            <div class="images">
              <h3>Imagens:</h3>
              ${content.imagens.map(img => `<img src="${img}" alt="${shareTitle}" />`).join('')}
            </div>
          ` : ''}
          
          ${content?.links && content.links.length > 0 ? `
            <div class="links">
              <h3>Links Relacionados:</h3>
              <ul>
                ${content.links.map(link => `<li><a href="${link.url}">${link.texto}</a></li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>Fonte: Cartografia Social de Santos - ${new Date().toLocaleDateString('pt-BR')}</p>
            <p>URL: ${currentUrl}</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Aguardar o carregamento das imagens antes de imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setIsPrinting(false);
      }, 1000);
    };
  };

  // Baixar como PDF (usando browser print to PDF)
  const downloadPDF = () => {
    printContent();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Compartilhar e Imprimir</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Compartilhamento nativo */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Compartilhar</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={shareNative}
                  className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Compartilhar</span>
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                    copied ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">{copied ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            </div>

            {/* Redes sociais */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Redes Sociais</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareFacebook}
                  className="flex items-center justify-center space-x-1 p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                  title="Compartilhar no Facebook"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-xs">Facebook</span>
                </button>
                
                <button
                  onClick={shareTwitter}
                  className="flex items-center justify-center space-x-1 p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  title="Compartilhar no Twitter"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-xs">Twitter</span>
                </button>
                
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center space-x-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <button
                onClick={shareEmail}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Compartilhar por Email</span>
              </button>
            </div>

            {/* Impressão e PDF */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Imprimir e Baixar</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={printContent}
                  disabled={isPrinting}
                  className="flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm">{isPrinting ? 'Imprimindo...' : 'Imprimir'}</span>
                </button>
                
                <button
                  onClick={downloadPDF}
                  disabled={isPrinting}
                  className="flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Baixar PDF</span>
                </button>
              </div>
            </div>

            {/* URL para referência */}
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link para compartilhar:
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={currentUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-500 text-white rounded-r-lg hover:bg-gray-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareAndPrint;