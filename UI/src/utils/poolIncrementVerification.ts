/**
 * Утилиты для проверки инкрементации пула в базе данных
 */

import { StudyModeConfig } from '../config/studyModeConfig';

export interface PoolIncrementVerificationResult {
  success: boolean;
  currentPool: number;
  expectedPool: number;
  actualPool: number;
  incrementVerified: boolean;
  attempts: number;
  maxAttempts: number;
  timeout: number;
  errors: string[];
  warnings: string[];
  timestamp: string;
}

export interface PoolIncrementVerificationOptions {
  currentPool: number;
  expectedPool: number;
  config: StudyModeConfig;
  apiUrl?: string;
}

/**
 * Утилиты для проверки инкрементации пула в БД
 */
export class PoolIncrementVerificationUtils {
  /**
   * Проверяет инкрементацию пула в базе данных
   */
  public static async verifyPoolIncrement(
    options: PoolIncrementVerificationOptions
  ): Promise<PoolIncrementVerificationResult> {
    const { currentPool, expectedPool, config, apiUrl } = options;
    
    const result: PoolIncrementVerificationResult = {
      success: false,
      currentPool,
      expectedPool,
      actualPool: currentPool,
      incrementVerified: false,
      attempts: 0,
      maxAttempts: config.maxPoolIncrementRetries,
      timeout: config.poolIncrementTimeout,
      errors: [],
      warnings: [],
      timestamp: new Date().toISOString()
    };
    
    if (!config.verifyPoolIncrementInDB) {
      result.warnings.push('Pool increment verification is disabled');
      result.success = true;
      return result;
    }
    
    const baseUrl = apiUrl || process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
    
    for (let attempt = 1; attempt <= config.maxPoolIncrementRetries; attempt++) {
      result.attempts = attempt;
      
      if (config.logPoolIncrementStatus) {
        console.log(`🔍 Pool Increment Verification - Attempt ${attempt}/${config.maxPoolIncrementRetries}`);
        console.log(`Current pool: ${currentPool}, Expected pool: ${expectedPool}`);
      }
      
      try {
        // Проверяем текущий пул в БД
        const response = await fetch(`${baseUrl}/user-progress`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const actualPool = data.currentPool || data.pool || 0;
        result.actualPool = actualPool;
        
        if (config.logPoolIncrementStatus) {
          console.log(`📊 Pool Increment Check - Attempt ${attempt}:`);
          console.log(`  Current pool: ${currentPool}`);
          console.log(`  Expected pool: ${expectedPool}`);
          console.log(`  Actual pool in DB: ${actualPool}`);
        }
        
        // Проверяем, что пул был инкрементирован
        if (actualPool === expectedPool) {
          result.incrementVerified = true;
          result.success = true;
          
          if (config.logPoolIncrementStatus) {
            console.log(`✅ Pool Increment Verified - Pool successfully incremented to ${actualPool}`);
          }
          
          break;
        } else if (actualPool > expectedPool) {
          result.warnings.push(`Pool in DB (${actualPool}) is higher than expected (${expectedPool})`);
          result.success = true;
          result.incrementVerified = true;
          break;
        } else {
          result.errors.push(`Pool in DB (${actualPool}) is lower than expected (${expectedPool})`);
          
          if (attempt < config.maxPoolIncrementRetries) {
            if (config.logPoolIncrementStatus) {
              console.log(`⏳ Pool Increment Not Ready - Retrying in ${config.poolIncrementTimeout}ms...`);
            }
            
            await new Promise(resolve => setTimeout(resolve, config.poolIncrementTimeout));
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        result.errors.push(`Attempt ${attempt} failed: ${errorMessage}`);
        
        if (config.logPoolIncrementStatus) {
          console.error(`❌ Pool Increment Check Failed - Attempt ${attempt}:`, error);
        }
        
        if (attempt < config.maxPoolIncrementRetries && config.retryPoolIncrementCheck) {
          if (config.logPoolIncrementStatus) {
            console.log(`🔄 Retrying pool increment check in ${config.poolIncrementTimeout}ms...`);
          }
          
          await new Promise(resolve => setTimeout(resolve, config.poolIncrementTimeout));
        }
      }
    }
    
    if (!result.success && result.attempts >= config.maxPoolIncrementRetries) {
      result.errors.push(`Failed to verify pool increment after ${config.maxPoolIncrementRetries} attempts`);
    }
    
    if (config.logPoolIncrementStatus) {
      console.log(`📋 Pool Increment Verification Summary:`);
      console.log(`  Success: ${result.success}`);
      console.log(`  Increment Verified: ${result.incrementVerified}`);
      console.log(`  Attempts: ${result.attempts}/${config.maxPoolIncrementRetries}`);
      console.log(`  Current Pool: ${result.currentPool}`);
      console.log(`  Expected Pool: ${result.expectedPool}`);
      console.log(`  Actual Pool: ${result.actualPool}`);
      if (result.errors.length > 0) {
        console.log(`  Errors: ${result.errors.join(', ')}`);
      }
      if (result.warnings.length > 0) {
        console.log(`  Warnings: ${result.warnings.join(', ')}`);
      }
    }
    
    return result;
  }
  
  /**
   * Проверяет, нужно ли проверять инкрементацию пула
   */
  public static shouldVerifyPoolIncrement(config: StudyModeConfig): boolean {
    return config.verifyPoolIncrementInDB;
  }
  
  /**
   * Получает таймаут для проверки инкрементации
   */
  public static getIncrementTimeout(config: StudyModeConfig): number {
    return config.poolIncrementTimeout;
  }
  
  /**
   * Получает максимальное количество попыток
   */
  public static getMaxRetries(config: StudyModeConfig): number {
    return config.maxPoolIncrementRetries;
  }
  
  /**
   * Проверяет, нужно ли повторять проверку
   */
  public static shouldRetryOnFailure(config: StudyModeConfig): boolean {
    return config.retryPoolIncrementCheck;
  }
  
  /**
   * Проверяет, нужно ли логировать статус
   */
  public static shouldLogStatus(config: StudyModeConfig): boolean {
    return config.logPoolIncrementStatus;
  }
}

/**
 * Хук для работы с проверкой инкрементации пула
 */
export const usePoolIncrementVerification = (
  currentPool: number,
  expectedPool: number,
  config: StudyModeConfig,
  apiUrl?: string
) => {
  const shouldVerify = PoolIncrementVerificationUtils.shouldVerifyPoolIncrement(config);
  const timeout = PoolIncrementVerificationUtils.getIncrementTimeout(config);
  const maxRetries = PoolIncrementVerificationUtils.getMaxRetries(config);
  const shouldRetry = PoolIncrementVerificationUtils.shouldRetryOnFailure(config);
  const shouldLog = PoolIncrementVerificationUtils.shouldLogStatus(config);
  
  const verifyIncrement = async (): Promise<PoolIncrementVerificationResult> => {
    return await PoolIncrementVerificationUtils.verifyPoolIncrement({
      currentPool,
      expectedPool,
      config,
      apiUrl
    });
  };
  
  return {
    shouldVerify,
    timeout,
    maxRetries,
    shouldRetry,
    shouldLog,
    verifyIncrement
  };
};
