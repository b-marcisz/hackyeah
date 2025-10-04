import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  onClose 
}) => {
  return (
    <div className="card">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Произошла ошибка
        </h2>
        
        <p className="text-gray-600 mb-6 text-lg">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-primary"
            >
              <RefreshCw className="h-4 w-4" />
              Попробовать снова
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              <X className="h-4 w-4" />
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
