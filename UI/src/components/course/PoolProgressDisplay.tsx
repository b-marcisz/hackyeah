/**
 * Компонент для отображения прогресса пула
 */

import React from 'react';
import { usePoolProgress } from '../../utils/poolUtils';

interface PoolProgressDisplayProps {
  currentPool: number;
  poolSize: number;
  completedNumbers: number[];
  className?: string;
  showDetails?: boolean;
}

export const PoolProgressDisplay: React.FC<PoolProgressDisplayProps> = ({
  currentPool,
  poolSize,
  completedNumbers,
  className = '',
  showDetails = false
}) => {
  const { progress, validation, canAdvance, nextPool, stats } = usePoolProgress(
    currentPool,
    poolSize,
    completedNumbers
  );
  
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'text-green-400';
    if (percentage >= 75) return 'text-yellow-400';
    if (percentage >= 50) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 shadow-xl border-2 border-gray-600 ${className}`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🏊</span>
          <span>Pool Progress</span>
        </h3>
        <div className="text-sm text-gray-400">
          Pool {currentPool}-{currentPool + poolSize - 1}
        </div>
      </div>
      
      {/* Основной прогресс */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-white">
            Progress: {stats.completedNumbers}/{stats.totalNumbers}
          </span>
          <span className={`text-lg font-bold ${getProgressColor(stats.completionPercentage)}`}>
            {stats.completionPercentage}%
          </span>
        </div>
        
        {/* Прогресс-бар */}
        <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(stats.completionPercentage)}`}
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
        
        {/* Статус */}
        <div className="flex items-center space-x-2">
          {stats.isComplete ? (
            <div className="flex items-center space-x-2 text-green-400">
              <span>✅</span>
              <span className="font-semibold">Pool Complete!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-400">
              <span>⏳</span>
              <span className="font-semibold">In Progress</span>
            </div>
          )}
          
          {canAdvance && (
            <div className="flex items-center space-x-2 text-blue-400">
              <span>🚀</span>
              <span className="font-semibold">Ready to Advance</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Детали (если включены) */}
      {showDetails && (
        <div className="space-y-3">
          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Completed</div>
              <div className="text-lg font-bold text-green-400">
                {stats.completedNumbers}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400">Remaining</div>
              <div className="text-lg font-bold text-orange-400">
                {stats.remainingNumbers}
              </div>
            </div>
          </div>
          
          {/* Завершенные числа */}
          {progress.completedNumbers.length > 0 && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Completed Numbers:</div>
              <div className="flex flex-wrap gap-2">
                {progress.completedNumbers.map((num, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-green-600 text-white rounded-full text-sm font-semibold"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Оставшиеся числа */}
          {validation.missingNumbers && validation.missingNumbers.length > 0 && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Remaining Numbers:</div>
              <div className="flex flex-wrap gap-2">
                {validation.missingNumbers.map((num, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-sm font-semibold"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Следующий пул */}
          {canAdvance && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <div className="text-sm text-blue-400 mb-2">Next Pool:</div>
              <div className="text-lg font-bold text-blue-300">
                Pool {nextPool}-{nextPool + poolSize - 1}
              </div>
            </div>
          )}
          
          {/* Ошибки и предупреждения */}
          {validation.errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-sm text-red-400 mb-2">Errors:</div>
              {validation.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-300">• {error}</div>
              ))}
            </div>
          )}
          
          {validation.warnings.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-sm text-yellow-400 mb-2">Warnings:</div>
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-300">• {warning}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolProgressDisplay;
