import React from 'react';

const AlertSection = ({ errors, showConfirmation }) => {
  return (
    <>
      {/* Alerts */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Corrija os seguintes erros:</h3>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {showConfirmation && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="text-green-500 mr-2">✓</div>
            <span className="font-semibold">Local atualizado com sucesso!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertSection;