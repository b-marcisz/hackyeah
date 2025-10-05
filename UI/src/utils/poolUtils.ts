/**
 * Утилиты для работы с пулами в StudyMode
 */

export interface PoolProgress {
  currentPool: number;
  completedNumbers: number[];
  poolCompletionPercentage: number;
  isPoolComplete: boolean;
  nextPool: number;
}

export interface PoolValidationResult {
  isValid: boolean;
  canAdvance: boolean;
  completionPercentage: number;
  missingNumbers: number[];
  errors: string[];
  warnings: string[];
}

/**
 * Утилиты для работы с пулами
 */
export class PoolUtils {
  /**
   * Вычисляет прогресс пула
   */
  public static calculatePoolProgress(
    currentPool: number,
    poolSize: number,
    completedNumbers: number[]
  ): PoolProgress {
    const poolStart = currentPool;
    const poolEnd = currentPool + poolSize - 1;
    const poolNumbers = Array.from({ length: poolSize }, (_, i) => poolStart + i);
    
    const completedInPool = completedNumbers.filter(num => 
      num >= poolStart && num <= poolEnd
    );
    
    const completionPercentage = (completedInPool.length / poolSize) * 100;
    const isPoolComplete = completedInPool.length === poolSize;
    const nextPool = isPoolComplete ? currentPool + poolSize : currentPool;
    
    return {
      currentPool,
      completedNumbers: completedInPool,
      poolCompletionPercentage: Math.round(completionPercentage),
      isPoolComplete,
      nextPool
    };
  }
  
  /**
   * Валидирует завершение пула
   */
  public static validatePoolCompletion(
    currentPool: number,
    poolSize: number,
    completedNumbers: number[],
    threshold: number = 100
  ): PoolValidationResult {
    const result: PoolValidationResult = {
      isValid: true,
      canAdvance: false,
      completionPercentage: 0,
      missingNumbers: [],
      errors: [],
      warnings: []
    };
    
    const poolStart = currentPool;
    const poolEnd = currentPool + poolSize - 1;
    const poolNumbers = Array.from({ length: poolSize }, (_, i) => poolStart + i);
    
    const completedInPool = completedNumbers.filter(num => 
      num >= poolStart && num <= poolEnd
    );
    
    result.completionPercentage = Math.round((completedInPool.length / poolSize) * 100);
    result.missingNumbers = poolNumbers.filter(num => !completedInPool.includes(num));
    
    // Проверяем, можно ли перейти к следующему пулу
    if (result.completionPercentage >= threshold) {
      result.canAdvance = true;
    } else {
      result.canAdvance = false;
      result.warnings.push(`Pool completion is ${result.completionPercentage}%, but threshold is ${threshold}%`);
    }
    
    // Проверяем на ошибки
    if (result.completionPercentage < 0) {
      result.isValid = false;
      result.errors.push('Completion percentage cannot be negative');
    }
    
    if (result.completionPercentage > 100) {
      result.isValid = false;
      result.errors.push('Completion percentage cannot exceed 100%');
    }
    
    if (threshold < 0 || threshold > 100) {
      result.isValid = false;
      result.errors.push('Threshold must be between 0 and 100');
    }
    
    return result;
  }
  
  /**
   * Проверяет, можно ли перейти к следующему пулу
   */
  public static canAdvanceToNextPool(
    currentPool: number,
    poolSize: number,
    completedNumbers: number[],
    threshold: number = 100
  ): boolean {
    const validation = this.validatePoolCompletion(
      currentPool,
      poolSize,
      completedNumbers,
      threshold
    );
    
    return validation.isValid && validation.canAdvance;
  }
  
  /**
   * Получает следующий пул
   */
  public static getNextPool(currentPool: number, poolSize: number): number {
    return currentPool + poolSize;
  }
  
  /**
   * Проверяет, является ли число частью пула
   */
  public static isNumberInPool(
    number: number,
    poolStart: number,
    poolSize: number
  ): boolean {
    const poolEnd = poolStart + poolSize - 1;
    return number >= poolStart && number <= poolEnd;
  }
  
  /**
   * Получает все числа в пуле
   */
  public static getPoolNumbers(poolStart: number, poolSize: number): number[] {
    return Array.from({ length: poolSize }, (_, i) => poolStart + i);
  }
  
  /**
   * Проверяет, завершен ли пул
   */
  public static isPoolComplete(
    currentPool: number,
    poolSize: number,
    completedNumbers: number[],
    threshold: number = 100
  ): boolean {
    const validation = this.validatePoolCompletion(
      currentPool,
      poolSize,
      completedNumbers,
      threshold
    );
    
    return validation.isValid && validation.canAdvance;
  }
  
  /**
   * Получает статистику пула
   */
  public static getPoolStats(
    currentPool: number,
    poolSize: number,
    completedNumbers: number[]
  ): {
    totalNumbers: number;
    completedNumbers: number;
    remainingNumbers: number;
    completionPercentage: number;
    isComplete: boolean;
  } {
    const poolStart = currentPool;
    const poolEnd = currentPool + poolSize - 1;
    const poolNumbers = Array.from({ length: poolSize }, (_, i) => poolStart + i);
    
    const completedInPool = completedNumbers.filter(num => 
      num >= poolStart && num <= poolEnd
    );
    
    const completionPercentage = Math.round((completedInPool.length / poolSize) * 100);
    const isComplete = completedInPool.length === poolSize;
    
    return {
      totalNumbers: poolSize,
      completedNumbers: completedInPool.length,
      remainingNumbers: poolSize - completedInPool.length,
      completionPercentage,
      isComplete
    };
  }
}

/**
 * Хук для работы с пулами
 */
export const usePoolProgress = (
  currentPool: number,
  poolSize: number,
  completedNumbers: number[]
) => {
  const progress = PoolUtils.calculatePoolProgress(
    currentPool,
    poolSize,
    completedNumbers
  );
  
  const validation = PoolUtils.validatePoolCompletion(
    currentPool,
    poolSize,
    completedNumbers
  );
  
  const canAdvance = PoolUtils.canAdvanceToNextPool(
    currentPool,
    poolSize,
    completedNumbers
  );
  
  const nextPool = PoolUtils.getNextPool(currentPool, poolSize);
  
  const stats = PoolUtils.getPoolStats(
    currentPool,
    poolSize,
    completedNumbers
  );
  
  return {
    progress,
    validation,
    canAdvance,
    nextPool,
    stats
  };
};
