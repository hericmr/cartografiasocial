import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleSection = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-600" />}
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;

