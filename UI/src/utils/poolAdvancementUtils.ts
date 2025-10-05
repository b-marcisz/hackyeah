/**
 * Утилиты для проверки переходов между пулами
 */

import { StudyModeConfig } from '../config/studyModeConfig';

export interface PoolAdvancementResult {
  canAdvance: boolean;
  nextPool: number;
  currentPool: number;
  poolSize: number;
  delay: number;
  shouldReload: boolean;
  shouldValidate: boolean;
  shouldLog: boolean;
  needsConfirmation: boolean;
  errors: string[];
  warnings: string[];
}

export interface PoolAdvancementOptions {
  currentPool: number;
  poolSize: number;
  completedNumbers: number[];
  config: StudyModeConfig;
}

/**
 * Утилиты для проверки переходов между пулами
 */
export class PoolAdvancementUtils {
  /**
   * Проверяет, можно ли перейти к следующему пулу
   */
  public static checkPoolAdvancement(options: PoolAdvancementOptions): PoolAdvancementResult {
    const { currentPool, poolSize, completedNumbers, config } = options;
    
    const result: PoolAdvancementResult = {
      canAdvance: false,
      nextPool: currentPool,
      currentPool,
      poolSize,
      delay: config.poolAdvancementDelay,
      shouldReload: config.reloadAssociationsOnPoolAdvance,
      shouldValidate: config.validatePoolAdvancement,
      shouldLog: config.logPoolTransitions,
      needsConfirmation: config.confirmPoolAdvancement,
      errors: [],
      warnings: []
    };
    
    // Проверяем, включен ли переход между пулами
    if (!config.enablePoolProgression) {
      result.errors.push('Pool progression is disabled');
      return result;
    }
    
    // Проверяем, включено ли автоматическое продвижение
    if (!config.autoAdvancePool) {
      result.warnings.push('Auto pool advancement is disabled');
      return result;
    }
    
    // Проверяем завершение пула
    const poolStart = currentPool;
    const poolEnd = currentPool + poolSize - 1;
    const poolNumbers = Array.from({ length: poolSize }, (_, i) => poolStart + i);
    const completedInPool = completedNumbers.filter(num => 
      num >= poolStart && num <= poolEnd
    );
    
    const completionPercentage = (completedInPool.length / poolSize) * 100;
    
    if (completionPercentage < config.poolCompletionThreshold) {
      result.errors.push(`Pool completion is ${completionPercentage}%, but threshold is ${config.poolCompletionThreshold}%`);
      return result;
    }
    
    // Проверяем задержку
    if (config.poolAdvancementDelay < 0) {
      result.errors.push('Pool advancement delay cannot be negative');
      return result;
    }
    
    if (config.poolAdvancementDelay > 10000) {
      result.warnings.push('Pool advancement delay is very long (>10 seconds)');
    }
    
    // Проверяем настройки перезагрузки
    if (!config.reloadAssociationsOnPoolAdvance) {
      result.warnings.push('Associations will not be reloaded on pool advancement');
    }
    
    // Проверяем валидацию
    if (!config.validatePoolAdvancement) {
      result.warnings.push('Pool advancement validation is disabled');
    }
    
    // Проверяем логирование
    if (!config.logPoolTransitions) {
      result.warnings.push('Pool transition logging is disabled');
    }
    
    // Проверяем подтверждение
    if (config.confirmPoolAdvancement) {
      result.warnings.push('Pool advancement confirmation is enabled');
    }
    
    // Если все проверки пройдены, можно переходить
    if (result.errors.length === 0) {
      result.canAdvance = true;
      result.nextPool = currentPool + poolSize;
    }
    
    return result;
  }
  
  /**
   * Логирует переход между пулами
   */
  public static logPoolTransition(
    fromPool: number,
    toPool: number,
    config: StudyModeConfig
  ): void {
    if (!config.logPoolTransitions) {
      return;
    }
    
    console.log('🏊 Pool Transition:');
    console.log('==================');
    console.log(`From pool: ${fromPool}`);
    console.log(`To pool: ${toPool}`);
    console.log(`Delay: ${config.poolAdvancementDelay}ms`);
    console.log(`Reload associations: ${config.reloadAssociationsOnPoolAdvance}`);
    console.log(`Validate advancement: ${config.validatePoolAdvancement}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
  }
  
  /**
   * Валидирует переход к следующему пулу
   */
  public static validatePoolAdvancement(
    currentPool: number,
    nextPool: number,
    poolSize: number,
    config: StudyModeConfig
  ): boolean {
    if (!config.validatePoolAdvancement) {
      return true;
    }
    
    // Проверяем, что следующий пул больше текущего
    if (nextPool <= currentPool) {
      console.error('Invalid pool advancement: next pool must be greater than current pool');
      return false;
    }
    
    // Проверяем, что следующий пул кратен размеру пула
    if (nextPool % poolSize !== 0) {
      console.error('Invalid pool advancement: next pool must be a multiple of pool size');
      return false;
    }
    
    // Проверяем, что переход не слишком большой
    const poolDifference = nextPool - currentPool;
    if (poolDifference !== poolSize) {
      console.error('Invalid pool advancement: pool difference must equal pool size');
      return false;
    }
    
    return true;
  }
  
  /**
   * Получает следующий пул
   */
  public static getNextPool(currentPool: number, poolSize: number): number {
    return currentPool + poolSize;
  }
  
  /**
   * Проверяет, нужно ли подтверждение перехода
   */
  public static needsConfirmation(config: StudyModeConfig): boolean {
    return config.confirmPoolAdvancement;
  }
  
  /**
   * Получает задержку перед переходом
   */
  public static getAdvancementDelay(config: StudyModeConfig): number {
    return config.poolAdvancementDelay;
  }
  
  /**
   * Проверяет, нужно ли перезагружать ассоциации
   */
  public static shouldReloadAssociations(config: StudyModeConfig): boolean {
    return config.reloadAssociationsOnPoolAdvance;
  }
}

/**
 * Хук для работы с переходами между пулами
 */
export const usePoolAdvancement = (
  currentPool: number,
  poolSize: number,
  completedNumbers: number[],
  config: StudyModeConfig
) => {
  const advancementResult = PoolAdvancementUtils.checkPoolAdvancement({
    currentPool,
    poolSize,
    completedNumbers,
    config
  });
  
  const nextPool = PoolAdvancementUtils.getNextPool(currentPool, poolSize);
  const needsConfirmation = PoolAdvancementUtils.needsConfirmation(config);
  const delay = PoolAdvancementUtils.getAdvancementDelay(config);
  const shouldReload = PoolAdvancementUtils.shouldReloadAssociations(config);
  
  const logTransition = (fromPool: number, toPool: number) => {
    PoolAdvancementUtils.logPoolTransition(fromPool, toPool, config);
  };
  
  const validateAdvancement = (fromPool: number, toPool: number) => {
    return PoolAdvancementUtils.validatePoolAdvancement(
      fromPool,
      toPool,
      poolSize,
      config
    );
  };
  
  return {
    advancementResult,
    nextPool,
    needsConfirmation,
    delay,
    shouldReload,
    logTransition,
    validateAdvancement
  };
};
