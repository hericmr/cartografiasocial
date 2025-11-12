import React from 'react';

export const Tabs = ({ children, defaultValue, onTabChange }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || 'info');

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // Pass activeTab and handleTabChange to children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
    }
    return child;
  });

  return <div className="w-full">{childrenWithProps}</div>;
};

export const TabsList = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <div className="flex min-w-full">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, onTabChange });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export const TabsTrigger = ({ value, children, activeTab, onTabChange, icon: Icon }) => {
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => onTabChange(value)}
      className={`
        flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
        border-b-2 whitespace-nowrap
        ${isActive 
          ? 'border-green-500 text-green-600 bg-green-50' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

