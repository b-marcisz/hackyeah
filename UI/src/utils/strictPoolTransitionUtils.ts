/**
 * Утилиты для строгой проверки переходов пулов
 */

import { StudyModeConfig } from '../config/studyModeConfig';

export interface PoolTransitionResult {
  success: boolean;
  transitionCompleted: boolean;
  apiResponse: boolean;
  dbVerification: boolean;
  timeoutReached: boolean;
  attempts: number;
  maxAttempts: number;
  errors: string[];
  warnings: string[];
  timestamp: string;
}

export interface PoolTransitionOptions {
  currentPool: number;
  nextPool: number;
  config: StudyModeConfig;
  apiUrl?: string;
}

/**
 * Утилиты для строгой проверки переходов пулов
 */
export class StrictPoolTransitionUtils {
  /**
   * Строго проверяет переход к следующему пулу
   */
  public static async enforcePoolTransition(
    options: PoolTransitionOptions
  ): Promise<PoolTransitionResult> {
    const { currentPool, nextPool, config, apiUrl } = options;
    
    const result: PoolTransitionResult = {
      success: false,
      transitionCompleted: false,
      apiResponse: false,
      dbVerification: false,
      timeoutReached: false,
      attempts: 0,
      maxAttempts: 3,
      errors: [],
      warnings: [],
      timestamp: new Date().toISOString()
    };
    
    if (!config.enforcePoolTransition) {
      result.warnings.push('Pool transition enforcement is disabled');
      result.success = true;
      return result;
    }
    
    const baseUrl = apiUrl || process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
    
    console.log('🔒 Enforcing Pool Transition:');
    console.log(`  Current pool: ${currentPool}`);
    console.log(`  Next pool: ${nextPool}`);
    console.log(`  API URL: ${baseUrl}`);
    
    // Попытка 1: Вызов API перехода
    try {
      result.attempts++;
      console.log(`🔄 Pool Transition Attempt ${result.attempts}:`);
      
      const response = await fetch(`${baseUrl}/user-progress/advance-pool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPool: nextPool,
          poolSize: 3,
          lastUpdated: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        result.apiResponse = true;
        console.log('✅ API call successful');
        
        // Попытка 2: Проверка в БД
        if (config.validatePoolTransitionAPI) {
          console.log('🔍 Validating pool transition in database...');
          
          const verificationResponse = await fetch(`${baseUrl}/user-progress`);
          if (verificationResponse.ok) {
            const verificationData = await verificationResponse.json();
            const actualPool = verificationData.currentPool || verificationData.pool || 0;
            
            console.log(`📊 Pool Transition Verification:`);
            console.log(`  Expected pool: ${nextPool}`);
            console.log(`  Actual pool in DB: ${actualPool}`);
            
            if (actualPool === nextPool) {
              result.dbVerification = true;
              result.transitionCompleted = true;
              result.success = true;
              console.log('✅ Pool transition verified in database');
            } else {
              result.errors.push(`Pool in DB (${actualPool}) does not match expected (${nextPool})`);
              console.error('❌ Pool transition verification failed');
            }
          } else {
            result.errors.push('Failed to verify pool transition in database');
            console.error('❌ Failed to verify pool transition in database');
          }
        } else {
          result.success = true;
          result.transitionCompleted = true;
          console.log('⚠️ Pool transition API validation is disabled');
        }
      } else {
        result.errors.push(`API call failed with status: ${response.status}`);
        console.error('❌ API call failed:', response.status);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(`API call error: ${errorMessage}`);
      console.error('❌ Pool transition API error:', error);
    }
    
    // Мониторинг успешности
    if (config.monitorPoolTransitionSuccess) {
      console.log('📊 Pool Transition Monitoring:');
      console.log(`  Success: ${result.success}`);
      console.log(`  Transition Completed: ${result.transitionCompleted}`);
      console.log(`  API Response: ${result.apiResponse}`);
      console.log(`  DB Verification: ${result.dbVerification}`);
      console.log(`  Attempts: ${result.attempts}`);
    }
    
    // Предупреждения о неудачах
    if (config.alertOnPoolTransitionFailure && !result.success) {
      console.error('🚨 POOL TRANSITION FAILURE ALERT:');
      console.error(`  Current pool: ${currentPool}`);
      console.error(`  Expected next pool: ${nextPool}`);
      console.error(`  Errors: ${result.errors.join(', ')}`);
      console.error(`  Warnings: ${result.warnings.join(', ')}`);
    }
    
    return result;
  }
  
  /**
   * Проверяет, нужно ли принуждать к переходу пула
   */
  public static shouldEnforcePoolTransition(config: StudyModeConfig): boolean {
    return config.enforcePoolTransition;
  }
  
  /**
   * Проверяет, нужно ли валидировать API переходов
   */
  public static shouldValidatePoolTransitionAPI(config: StudyModeConfig): boolean {
    return config.validatePoolTransitionAPI;
  }
  
  /**
   * Проверяет, нужно ли мониторить успешность переходов
   */
  public static shouldMonitorPoolTransitionSuccess(config: StudyModeConfig): boolean {
    return config.monitorPoolTransitionSuccess;
  }
  
  /**
   * Проверяет, нужно ли предупреждать о неудачах
   */
  public static shouldAlertOnPoolTransitionFailure(config: StudyModeConfig): boolean {
    return config.alertOnPoolTransitionFailure;
  }
  
  /**
   * Получает таймаут для подтверждения успешного перехода
   */
  public static getPoolTransitionSuccessTimeout(config: StudyModeConfig): number {
    return config.poolTransitionSuccessTimeout;
  }
  
  /**
   * Проверяет, нужно ли подтверждение перехода
   */
  public static requiresPoolTransitionConfirmation(config: StudyModeConfig): boolean {
    return config.requirePoolTransitionConfirmation;
  }
}

/**
 * Хук для работы со строгими переходами пулов
 */
export const useStrictPoolTransition = (
  currentPool: number,
  nextPool: number,
  config: StudyModeConfig,
  apiUrl?: string
) => {
  const shouldEnforce = StrictPoolTransitionUtils.shouldEnforcePoolTransition(config);
  const shouldValidateAPI = StrictPoolTransitionUtils.shouldValidatePoolTransitionAPI(config);
  const shouldMonitor = StrictPoolTransitionUtils.shouldMonitorPoolTransitionSuccess(config);
  const shouldAlert = StrictPoolTransitionUtils.shouldAlertOnPoolTransitionFailure(config);
  const timeout = StrictPoolTransitionUtils.getPoolTransitionSuccessTimeout(config);
  const requiresConfirmation = StrictPoolTransitionUtils.requiresPoolTransitionConfirmation(config);
  
  const enforceTransition = async (): Promise<PoolTransitionResult> => {
    return await StrictPoolTransitionUtils.enforcePoolTransition({
      currentPool,
      nextPool,
      config,
      apiUrl
    });
  };
  
  return {
    shouldEnforce,
    shouldValidateAPI,
    shouldMonitor,
    shouldAlert,
    timeout,
    requiresConfirmation,
    enforceTransition
  };
};
