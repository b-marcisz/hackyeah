/**
 * Компонент для отображения статуса переходов между пулами
 */

import React from 'react';
import { PoolAdvancementResult } from '../../utils/poolAdvancementUtils';

interface PoolAdvancementStatusProps {
  advancementResult: PoolAdvancementResult;
  className?: string;
  showDetails?: boolean;
}

export const PoolAdvancementStatus: React.FC<PoolAdvancementStatusProps> = ({
  advancementResult,
  className = '',
  showDetails = false
}) => {
  const getStatusIcon = (): string => {
    if (advancementResult.errors.length > 0) return '❌';
    if (advancementResult.warnings.length > 0) return '⚠️';
    if (advancementResult.canAdvance) return '✅';
    return '⏳';
  };
  
  const getStatusColor = (): string => {
    if (advancementResult.errors.length > 0) return 'text-red-400';
    if (advancementResult.warnings.length > 0) return 'text-yellow-400';
    if (advancementResult.canAdvance) return 'text-green-400';
    return 'text-blue-400';
  };
  
  const getStatusText = (): string => {
    if (advancementResult.errors.length > 0) return 'Cannot Advance';
    if (advancementResult.warnings.length > 0) return 'Can Advance (with warnings)';
    if (advancementResult.canAdvance) return 'Ready to Advance';
    return 'Checking...';
  };
  
  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 shadow-xl border-2 border-gray-600 ${className}`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🏊</span>
          <span>Pool Advancement Status</span>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getStatusIcon()}</span>
          <span className={`text-lg font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>
      
      {/* Основная информация */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Current Pool</div>
          <div className="text-lg font-bold text-white">
            {advancementResult.currentPool}
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Next Pool</div>
          <div className="text-lg font-bold text-blue-400">
            {advancementResult.nextPool}
          </div>
        </div>
      </div>
      
      {/* Настройки перехода */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Advancement Delay</div>
          <div className="text-lg font-bold text-orange-400">
            {advancementResult.delay}ms
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Pool Size</div>
          <div className="text-lg font-bold text-purple-400">
            {advancementResult.poolSize}
          </div>
        </div>
      </div>
      
      {/* Флаги */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={advancementResult.shouldReload ? 'text-green-400' : 'text-red-400'}>
              {advancementResult.shouldReload ? '✅' : '❌'}
            </span>
            <span className="text-sm text-gray-300">Reload Associations</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={advancementResult.shouldValidate ? 'text-green-400' : 'text-red-400'}>
              {advancementResult.shouldValidate ? '✅' : '❌'}
            </span>
            <span className="text-sm text-gray-300">Validate Advancement</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={advancementResult.shouldLog ? 'text-green-400' : 'text-red-400'}>
              {advancementResult.shouldLog ? '✅' : '❌'}
            </span>
            <span className="text-sm text-gray-300">Log Transitions</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={advancementResult.needsConfirmation ? 'text-yellow-400' : 'text-green-400'}>
              {advancementResult.needsConfirmation ? '⚠️' : '✅'}
            </span>
            <span className="text-sm text-gray-300">Auto Advance</span>
          </div>
        </div>
      </div>
      
      {/* Детали (если включены) */}
      {showDetails && (
        <div className="space-y-3">
          {/* Ошибки */}
          {advancementResult.errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-red-400 mb-2">Errors:</div>
              {advancementResult.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-300">• {error}</div>
              ))}
            </div>
          )}
          
          {/* Предупреждения */}
          {advancementResult.warnings.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-yellow-400 mb-2">Warnings:</div>
              {advancementResult.warnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-300">• {warning}</div>
              ))}
            </div>
          )}
          
          {/* Информация о переходе */}
          {advancementResult.canAdvance && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-green-400 mb-2">Ready to Advance:</div>
              <div className="text-sm text-green-300">
                • From pool {advancementResult.currentPool} to pool {advancementResult.nextPool}
              </div>
              <div className="text-sm text-green-300">
                • Delay: {advancementResult.delay}ms
              </div>
              <div className="text-sm text-green-300">
                • Reload associations: {advancementResult.shouldReload ? 'Yes' : 'No'}
              </div>
              <div className="text-sm text-green-300">
                • Validate advancement: {advancementResult.shouldValidate ? 'Yes' : 'No'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolAdvancementStatus;
