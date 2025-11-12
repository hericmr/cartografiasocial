import React, { useState } from 'react';
import { Link as LinkIcon, Plus, X } from 'lucide-react';
import InputField from '../../AddLocationPanel/components/InputField';

const LinksTab = ({ editedLocation, setEditedLocation }) => {
  // Parse links string to array
  const parseLinks = (linksString) => {
    if (!linksString) return [];
    if (typeof linksString === 'string') {
      // Support both comma and semicolon separated
      return linksString.split(/[;,]/).map(link => link.trim()).filter(Boolean);
    }
    return [];
  };

  const [links, setLinks] = useState(() => parseLinks(editedLocation.links || ''));

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
    updateLocationLinks(newLinks);
  };

  const updateLink = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
    updateLocationLinks(newLinks);
  };

  const updateLocationLinks = (linksArray) => {
    setEditedLocation(prev => ({
      ...prev,
      links: linksArray.join(';')
    }));
  };

  return (
    <div className="space-y-4">
      {links.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <LinkIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Nenhum link adicionado</p>
        </div>
      )}

      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1">
            <InputField
              label={`Link ${index + 1}`}
              id={`link-${index}`}
              type="url"
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              placeholder="https://exemplo.com"
            />
          </div>
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="mt-6 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Remover link ${index + 1}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLink}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors w-full"
      >
        <Plus className="w-4 h-4" />
        <span>Adicionar link</span>
      </button>
    </div>
  );
};

export default LinksTab;

