/**
 * Хук для работы с конфигурацией StudyMode
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  StudyModeConfig, 
  StudyModeValidator, 
  StudyModeUtils, 
  ValidationResult,
  DEFAULT_STUDY_MODE_CONFIG 
} from '../config/studyModeConfig';

export interface UseStudyModeConfigReturn {
  config: StudyModeConfig;
  validator: StudyModeValidator;
  validationResult: ValidationResult | null;
  updateConfig: (newConfig: Partial<StudyModeConfig>) => void;
  validateConfig: () => ValidationResult;
  resetToDefaults: () => void;
  isConfigValid: boolean;
}

/**
 * Хук для управления конфигурацией StudyMode
 */
export const useStudyModeConfig = (initialConfig?: Partial<StudyModeConfig>): UseStudyModeConfigReturn => {
  const [config, setConfig] = useState<StudyModeConfig>(() => ({
    ...DEFAULT_STUDY_MODE_CONFIG,
    ...initialConfig
  }));
  
  const [validator] = useState(() => new StudyModeValidator(config));
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  // Обновляем валидатор при изменении конфигурации
  useEffect(() => {
    validator.updateConfig(config);
  }, [config, validator]);
  
  // Валидируем конфигурацию при изменении
  useEffect(() => {
    const result = validator.validateBeforeStart();
    setValidationResult(result);
  }, [config, validator]);
  
  /**
   * Обновляет конфигурацию
   */
  const updateConfig = useCallback((newConfig: Partial<StudyModeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  /**
   * Валидирует текущую конфигурацию
   */
  const validateConfig = useCallback((): ValidationResult => {
    const result = validator.validateBeforeStart();
    setValidationResult(result);
    return result;
  }, [validator]);
  
  /**
   * Сбрасывает конфигурацию к настройкам по умолчанию
   */
  const resetToDefaults = useCallback(() => {
    setConfig({ ...DEFAULT_STUDY_MODE_CONFIG });
  }, []);
  
  const isConfigValid = validationResult?.isValid ?? false;
  
  return {
    config,
    validator,
    validationResult,
    updateConfig,
    validateConfig,
    resetToDefaults,
    isConfigValid
  };
};

/**
 * Хук для отображения статуса валидации
 */
export const useStudyModeValidationStatus = (validationResult: ValidationResult | null) => {
  const getStatusIcon = (status: 'pass' | 'warn' | 'fail'): string => {
    switch (status) {
      case 'pass': return '✅';
      case 'warn': return '⚠️';
      case 'fail': return '❌';
      default: return '❓';
    }
  };
  
  const getStatusColor = (status: 'pass' | 'warn' | 'fail'): string => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'warn': return 'text-yellow-400';
      case 'fail': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  const getOverallStatus = (): { icon: string; color: string; text: string } => {
    if (!validationResult) {
      return { icon: '❓', color: 'text-gray-400', text: 'Not validated' };
    }
    
    if (validationResult.isValid) {
      return { icon: '✅', color: 'text-green-400', text: 'Valid' };
    } else {
      return { icon: '❌', color: 'text-red-400', text: 'Invalid' };
    }
  };
  
  return {
    getStatusIcon,
    getStatusColor,
    getOverallStatus
  };
};
