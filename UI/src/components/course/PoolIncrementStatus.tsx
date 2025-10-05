/**
 * Компонент для отображения статуса проверки инкрементации пула в БД
 */

import React from 'react';
import { PoolIncrementVerificationResult } from '../../utils/poolIncrementVerification';

interface PoolIncrementStatusProps {
  verificationResult: PoolIncrementVerificationResult;
  className?: string;
  showDetails?: boolean;
}

export const PoolIncrementStatus: React.FC<PoolIncrementStatusProps> = ({
  verificationResult,
  className = '',
  showDetails = false
}) => {
  const getStatusIcon = (): string => {
    if (verificationResult.errors.length > 0) return '❌';
    if (verificationResult.warnings.length > 0) return '⚠️';
    if (verificationResult.success && verificationResult.incrementVerified) return '✅';
    if (verificationResult.success) return '✅';
    return '⏳';
  };
  
  const getStatusColor = (): string => {
    if (verificationResult.errors.length > 0) return 'text-red-400';
    if (verificationResult.warnings.length > 0) return 'text-yellow-400';
    if (verificationResult.success && verificationResult.incrementVerified) return 'text-green-400';
    if (verificationResult.success) return 'text-blue-400';
    return 'text-gray-400';
  };
  
  const getStatusText = (): string => {
    if (verificationResult.errors.length > 0) return 'Verification Failed';
    if (verificationResult.warnings.length > 0) return 'Verified with Warnings';
    if (verificationResult.success && verificationResult.incrementVerified) return 'Increment Verified';
    if (verificationResult.success) return 'Verified';
    return 'Verifying...';
  };
  
  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 shadow-xl border-2 border-gray-600 ${className}`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🗄️</span>
          <span>Pool Increment Verification</span>
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
            {verificationResult.currentPool}
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Expected Pool</div>
          <div className="text-lg font-bold text-blue-400">
            {verificationResult.expectedPool}
          </div>
        </div>
      </div>
      
      {/* Статус проверки */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Actual Pool in DB</div>
          <div className="text-lg font-bold text-purple-400">
            {verificationResult.actualPool}
          </div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Attempts</div>
          <div className="text-lg font-bold text-orange-400">
            {verificationResult.attempts}/{verificationResult.maxAttempts}
          </div>
        </div>
      </div>
      
      {/* Флаги */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={verificationResult.success ? 'text-green-400' : 'text-red-400'}>
              {verificationResult.success ? '✅' : '❌'}
            </span>
            <span className="text-sm text-gray-300">Verification Success</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={verificationResult.incrementVerified ? 'text-green-400' : 'text-red-400'}>
              {verificationResult.incrementVerified ? '✅' : '❌'}
            </span>
            <span className="text-sm text-gray-300">Increment Verified</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">⏱️</span>
            <span className="text-sm text-gray-300">Timeout: {verificationResult.timeout}ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-400">🕐</span>
            <span className="text-sm text-gray-300">
              {new Date(verificationResult.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Детали (если включены) */}
      {showDetails && (
        <div className="space-y-3">
          {/* Ошибки */}
          {verificationResult.errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-red-400 mb-2">Errors:</div>
              {verificationResult.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-300">• {error}</div>
              ))}
            </div>
          )}
          
          {/* Предупреждения */}
          {verificationResult.warnings.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-yellow-400 mb-2">Warnings:</div>
              {verificationResult.warnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-300">• {warning}</div>
              ))}
            </div>
          )}
          
          {/* Информация о проверке */}
          {verificationResult.success && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-green-400 mb-2">Verification Details:</div>
              <div className="text-sm text-green-300">
                • Pool successfully incremented from {verificationResult.currentPool} to {verificationResult.actualPool}
              </div>
              <div className="text-sm text-green-300">
                • Verification completed in {verificationResult.attempts} attempt(s)
              </div>
              <div className="text-sm text-green-300">
                • Database update confirmed
              </div>
            </div>
          )}
          
          {/* Информация о неудаче */}
          {!verificationResult.success && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="text-sm font-semibold text-red-400 mb-2">Verification Failed:</div>
              <div className="text-sm text-red-300">
                • Pool increment verification failed after {verificationResult.attempts} attempts
              </div>
              <div className="text-sm text-red-300">
                • Expected pool: {verificationResult.expectedPool}, Actual pool: {verificationResult.actualPool}
              </div>
              <div className="text-sm text-red-300">
                • Check database connection and pool advancement logic
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolIncrementStatus;
