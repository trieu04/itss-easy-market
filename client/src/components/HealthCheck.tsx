import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setStatus('checking');
      const response = await apiService.healthCheck();
      setStatus('connected');
      setMessage('Backend đã kết nối thành công!');
      console.log('Health check response:', response);
    } catch (error: any) {
      setStatus('error');
      setMessage(`Lỗi kết nối: ${error.message}`);
      console.error('Health check failed:', error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return '⏳';
      case 'connected': return '✅';
      case 'error': return '❌';
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getStatusColor()}`}>
      <div className="flex items-center">
        <span className="text-lg mr-2">{getStatusIcon()}</span>
        <div>
          <h3 className="font-medium">Trạng thái Backend</h3>
          <p className="text-sm">{message}</p>
          {status === 'error' && (
            <button
              onClick={checkHealth}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheck; 