/**
 * Компонент для отображения статуса конфигурации StudyMode
 */

import React from 'react';
import { ValidationResult, ValidationCheck } from '../../config/studyModeConfig';
import { useStudyModeValidationStatus } from '../../hooks/useStudyModeConfig';

interface StudyModeConfigStatusProps {
  validationResult: ValidationResult | null;
  showDetails?: boolean;
  className?: string;
}

export const StudyModeConfigStatus: React.FC<StudyModeConfigStatusProps> = ({
  validationResult,
  showDetails = false,
  className = ''
}) => {
  const { getStatusIcon, getStatusColor, getOverallStatus } = useStudyModeValidationStatus(validationResult);
  
  if (!validationResult) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">❓</span>
          <span className="text-gray-400">Configuration not validated</span>
        </div>
      </div>
    );
  }
  
  const overallStatus = getOverallStatus();
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      {/* Общий статус */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{overallStatus.icon}</span>
          <span className={`text-lg font-semibold ${overallStatus.color}`}>
            {overallStatus.text}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          {validationResult.checks.length} checks
        </div>
      </div>
      
      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {validationResult.checks.filter(c => c.status === 'pass').length}
          </div>
          <div className="text-xs text-gray-400">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {validationResult.checks.filter(c => c.status === 'warn').length}
          </div>
          <div className="text-xs text-gray-400">Warnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {validationResult.checks.filter(c => c.status === 'fail').length}
          </div>
          <div className="text-xs text-gray-400">Failed</div>
        </div>
      </div>
      
      {/* Детали (если включены) */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-300 mb-2">Configuration Details:</div>
          {validationResult.checks.map((check, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <span className="text-lg">{getStatusIcon(check.status)}</span>
              <span className="flex-1">
                <span className="font-medium">{check.name}:</span>
                <span className={`ml-2 ${getStatusColor(check.status)}`}>
                  {check.message}
                </span>
              </span>
            </div>
          ))}
          
          {/* Ошибки */}
          {validationResult.errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="text-sm font-semibold text-red-400 mb-2">Errors:</div>
              {validationResult.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-300">• {error}</div>
              ))}
            </div>
          )}
          
          {/* Предупреждения */}
          {validationResult.warnings.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="text-sm font-semibold text-yellow-400 mb-2">Warnings:</div>
              {validationResult.warnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-300">• {warning}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyModeConfigStatus;
