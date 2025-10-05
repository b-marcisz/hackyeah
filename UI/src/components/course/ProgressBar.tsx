import React from 'react';
import { CheckCircle, Circle, XCircle } from 'lucide-react';

interface ProgressBarProps {
  currentPool: number;
  completedNumbers: number[];
  failedAttempts: number[];
  totalNumbers: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentPool,
  completedNumbers,
  failedAttempts,
  totalNumbers = 3
}) => {
  const poolNumbers = Array.from({ length: totalNumbers }, (_, i) => currentPool + i);

  const getNumberStatus = (number: number) => {
    if (completedNumbers.includes(number)) {
      return 'completed';
    }
    if (failedAttempts.includes(number)) {
      return 'failed';
    }
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-400" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-orange-800 rounded-xl p-6 shadow-2xl border-2 border-orange-500">
      <h3 className="text-2xl font-bold text-orange-200 mb-4 text-center">
        🎯 Postęp w Puli {currentPool}-{currentPool + totalNumbers - 1}
      </h3>
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        {poolNumbers.map((number, index) => {
          const status = getNumberStatus(number);
          return (
            <div key={number} className="flex flex-col items-center space-y-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                status === 'completed' ? 'border-green-400 bg-green-500' :
                status === 'failed' ? 'border-red-400 bg-red-500' :
                'border-gray-400 bg-gray-500'
              } shadow-lg`}>
                <span className="text-white font-bold text-lg">
                  {number}
                </span>
              </div>
              <div className="text-sm text-orange-200 font-bold">
                {status === 'completed' ? '✅' : 
                 status === 'failed' ? '❌' : '⏳'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Line */}
      <div className="relative mb-4">
        <div className="w-full bg-black bg-opacity-50 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${(completedNumbers.length / totalNumbers) * 100}%` 
            }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-orange-200 font-bold">
            {completedNumbers.length} / {totalNumbers} ukończone
          </span>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-green-200">Ukończone</span>
        </div>
        <div className="flex items-center space-x-2">
          <XCircle className="h-4 w-4 text-red-400" />
          <span className="text-red-200">Błąd</span>
        </div>
        <div className="flex items-center space-x-2">
          <Circle className="h-4 w-4 text-gray-400" />
          <span className="text-gray-200">Oczekujące</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
