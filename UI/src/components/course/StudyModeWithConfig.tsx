/**
 * StudyMode компонент с интеграцией конфигурации
 */

import React, { useEffect } from 'react';
import { useStudyModeConfig } from '../../hooks/useStudyModeConfig';
import { StudyModeConfigStatus } from './StudyModeConfigStatus';
import { runStudyModeValidation } from '../../scripts/validateStudyModeConfig';

interface StudyModeWithConfigProps {
  // Пропсы для StudyMode (если нужны)
  onComplete?: () => void;
  onError?: (error: any) => void;
}

export const StudyModeWithConfig: React.FC<StudyModeWithConfigProps> = ({
  onComplete,
  onError
}) => {
  const {
    config,
    validationResult,
    isConfigValid,
    validateConfig
  } = useStudyModeConfig();
  
  // Проверяем конфигурацию при монтировании
  useEffect(() => {
    console.log('🔍 StudyModeWithConfig: Checking configuration...');
    
    // Запускаем валидацию
    const isValid = runStudyModeValidation();
    
    if (!isValid) {
      console.warn('⚠️ StudyModeWithConfig: Configuration validation failed!');
      if (onError) {
        onError(new Error('StudyMode configuration validation failed'));
      }
    } else {
      console.log('✅ StudyModeWithConfig: Configuration validation passed!');
    }
  }, [onError]);
  
  // Периодически проверяем конфигурацию
  useEffect(() => {
    const interval = setInterval(() => {
      validateConfig();
    }, 5000); // Проверяем каждые 5 секунд
    
    return () => clearInterval(interval);
  }, [validateConfig]);
  
  return (
    <div className="space-y-6">
      {/* Статус конфигурации */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-2xl border-2 border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <span>⚙️</span>
          <span>StudyMode Configuration Status</span>
        </h3>
        
        <StudyModeConfigStatus 
          validationResult={validationResult}
          showDetails={true}
        />
        
        {/* Дополнительная информация о конфигурации */}
        <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
          <div className="text-sm text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Timer Duration:</span> {config.timerDuration}s
              </div>
              <div>
                <span className="font-semibold">Pool Size:</span> {config.poolSize}
              </div>
              <div>
                <span className="font-semibold">Auto Transition:</span> {config.autoTransition ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold">Shuffle Associations:</span> {config.shuffleAssociations ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold">Save on Pool Complete:</span> {config.saveProgressOnPoolComplete ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-semibold">Debug Logs:</span> {config.enableDebugLogs ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Основной StudyMode компонент */}
      <div className="bg-gradient-to-r from-orange-900 to-purple-900 rounded-xl p-6 shadow-2xl border-2 border-orange-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <span>📚</span>
          <span>Study Mode</span>
        </h3>
        
        {isConfigValid ? (
          <div className="text-center">
            <div className="text-green-400 text-lg font-semibold mb-4">
              ✅ Configuration is valid - StudyMode is ready!
            </div>
            <div className="text-gray-300">
              All configuration checks have passed. You can now start learning.
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-red-400 text-lg font-semibold mb-4">
              ❌ Configuration issues detected
            </div>
            <div className="text-gray-300">
              Please check the configuration status above and fix any issues.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModeWithConfig;
