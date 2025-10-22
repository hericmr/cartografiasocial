import React, { useState, useEffect } from 'react';
import { supabase, testSupabaseConnection } from '../supabaseClient';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus('testing');
        setError(null);
        
        // Teste básico de conectividade
        const isConnected = await testSupabaseConnection();
        
        if (isConnected) {
          setConnectionStatus('connected');
          
          // Tentar buscar dados
          const { data: locations, error: fetchError } = await supabase
            .from('locations3')
            .select('*')
            .limit(5);
            
          if (fetchError) {
            setError(`Erro ao buscar dados: ${fetchError.message}`);
          } else {
            setData(locations);
          }
        } else {
          setConnectionStatus('failed');
          setError('Falha na conexão com o Supabase');
        }
      } catch (err) {
        setConnectionStatus('failed');
        setError(`Erro: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Teste de Conectividade Supabase</h2>
      
      <div className="mb-4">
        <strong>Status:</strong> 
        <span className={`ml-2 px-2 py-1 rounded text-sm ${
          connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
          connectionStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {connectionStatus === 'connected' ? 'Conectado' :
           connectionStatus === 'testing' ? 'Testando...' :
           'Falha na Conexão'}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {data && (
        <div className="mb-4">
          <strong>Dados encontrados:</strong> {data.length} registros
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p><strong>URL:</strong> {process.env.REACT_APP_SUPABASE_URL}</p>
        <p><strong>Chave:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida'}</p>
        <p><strong>Ambiente:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Hostname:</strong> {window.location.hostname}</p>
        <p><strong>Protocolo:</strong> {window.location.protocol}</p>
      </div>
    </div>
  );
};

export default SupabaseTest;