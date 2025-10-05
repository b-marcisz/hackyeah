/**
 * API утилиты для работы с пулами
 */

export interface PoolApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface PoolProgressData {
  currentPool: number;
  completedNumbers: number[];
  poolSize: number;
  lastUpdated: string;
}

export class PoolApiService {
  private baseUrl: string;
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4002`;
  }
  
  /**
   * Получает текущий прогресс пула
   */
  public async getPoolProgress(): Promise<PoolProgressData> {
    try {
      const response = await fetch(`${this.baseUrl}/user-progress`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        currentPool: data.currentPool || 0,
        completedNumbers: data.completedNumbers || [],
        poolSize: data.poolSize || 3,
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch pool progress:', error);
      throw error;
    }
  }
  
  /**
   * Обновляет прогресс пула
   */
  public async updatePoolProgress(
    currentPool: number,
    completedNumbers: number[],
    poolSize: number = 3
  ): Promise<PoolApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/user-progress/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPool,
          completedNumbers,
          poolSize,
          lastUpdated: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: 'Pool progress updated successfully',
        data
      };
    } catch (error) {
      console.error('Failed to update pool progress:', error);
      return {
        success: false,
        message: 'Failed to update pool progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Переходит к следующему пулу
   */
  public async advanceToNextPool(
    currentPool: number,
    poolSize: number = 3
  ): Promise<PoolApiResponse> {
    try {
      const nextPool = currentPool + poolSize;
      
      const response = await fetch(`${this.baseUrl}/user-progress/advance-pool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPool: nextPool,
          poolSize,
          lastUpdated: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: `Advanced to pool ${nextPool}`,
        data
      };
    } catch (error) {
      console.error('Failed to advance to next pool:', error);
      return {
        success: false,
        message: 'Failed to advance to next pool',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Сбрасывает прогресс пула
   */
  public async resetPoolProgress(): Promise<PoolApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/user-progress/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        message: 'Pool progress reset successfully',
        data
      };
    } catch (error) {
      console.error('Failed to reset pool progress:', error);
      return {
        success: false,
        message: 'Failed to reset pool progress',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Проверяет, можно ли перейти к следующему пулу
   */
  public async canAdvancePool(
    currentPool: number,
    poolSize: number,
    completedNumbers: number[],
    threshold: number = 100
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user-progress/can-advance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPool,
          poolSize,
          completedNumbers,
          threshold
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.canAdvance || false;
    } catch (error) {
      console.error('Failed to check if can advance pool:', error);
      return false;
    }
  }
  
  /**
   * Получает статистику пулов
   */
  public async getPoolStats(): Promise<{
    totalPools: number;
    completedPools: number;
    currentPool: number;
    overallProgress: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/user-progress/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        totalPools: data.totalPools || 0,
        completedPools: data.completedPools || 0,
        currentPool: data.currentPool || 0,
        overallProgress: data.overallProgress || 0
      };
    } catch (error) {
      console.error('Failed to fetch pool stats:', error);
      throw error;
    }
  }
}

// Экспортируем экземпляр по умолчанию
export const poolApiService = new PoolApiService();
