/**
 * Конфигурация для функциональности StudyMode
 * Проверяет все критерии работы перед запуском
 */

export interface StudyModeConfig {
  // Основные настройки
  timerDuration: number; // Длительность таймера в секундах
  poolSize: number; // Размер пула (количество чисел)
  
  // Настройки переходов
  autoTransition: boolean; // Автоматический переход к следующему числу
  transitionDelay: number; // Задержка перехода в миллисекундах
  
  // Настройки перемешивания
  shuffleAssociations: boolean; // Перемешивать ли ассоциации
  shuffleOnRestart: boolean; // Перемешивать при перезапуске
  
  // Настройки сохранения прогресса
  saveProgressOnPoolComplete: boolean; // Сохранять прогресс только после завершения пула
  saveProgressOnEachAnswer: boolean; // Сохранять прогресс после каждого ответа
  
  // Настройки отладки
  enableDebugLogs: boolean; // Включить отладочные логи
  showDebugInfo: boolean; // Показывать отладочную информацию в UI
  
  // Настройки валидации
  requireAllSelections: boolean; // Требовать выбор всех элементов
  validateSelections: boolean; // Валидировать выбранные элементы
  
  // Настройки пулов
  enablePoolProgression: boolean; // Включить переход между пулами
  savePoolProgress: boolean; // Сохранять прогресс пулов в базе данных
  validatePoolCompletion: boolean; // Валидировать завершение пула
  autoAdvancePool: boolean; // Автоматически переходить к следующему пулу
  poolCompletionThreshold: number; // Порог завершения пула (в процентах)
  
  // Настройки перехода между пулами
  poolAdvancementDelay: number; // Задержка перед переходом к следующему пулу (в миллисекундах)
  reloadAssociationsOnPoolAdvance: boolean; // Перезагружать ассоциации при переходе к следующему пулу
  validatePoolAdvancement: boolean; // Валидировать переход к следующему пулу
  logPoolTransitions: boolean; // Логировать переходы между пулами
  confirmPoolAdvancement: boolean; // Подтверждать переход к следующему пулу
  
  // Настройки проверки инкрементации пула в БД
  verifyPoolIncrementInDB: boolean; // Проверять инкрементацию пула в базе данных
  poolIncrementTimeout: number; // Таймаут для проверки инкрементации пула (в миллисекундах)
  retryPoolIncrementCheck: boolean; // Повторять проверку инкрементации пула при неудаче
  maxPoolIncrementRetries: number; // Максимальное количество попыток проверки инкрементации
  logPoolIncrementStatus: boolean; // Логировать статус инкрементации пула
  
  // Настройки строгой проверки переходов пулов
  enforcePoolTransition: boolean; // Строго требовать переход к следующему пулу
  validatePoolTransitionAPI: boolean; // Валидировать API переходов пулов
  monitorPoolTransitionSuccess: boolean; // Мониторить успешность переходов пулов
  alertOnPoolTransitionFailure: boolean; // Предупреждать о неудачных переходах пулов
  requirePoolTransitionConfirmation: boolean; // Требовать подтверждение перехода пула
  poolTransitionSuccessTimeout: number; // Таймаут для подтверждения успешного перехода пула
}

export const DEFAULT_STUDY_MODE_CONFIG: StudyModeConfig = {
  // Основные настройки
  timerDuration: 30,
  poolSize: 3,
  
  // Настройки переходов
  autoTransition: true,
  transitionDelay: 0, // Немедленный переход
  
  // Настройки перемешивания
  shuffleAssociations: true,
  shuffleOnRestart: true,
  
  // Настройки сохранения прогресса
  saveProgressOnPoolComplete: true,
  saveProgressOnEachAnswer: false,
  
  // Настройки отладки
  enableDebugLogs: true,
  showDebugInfo: true,
  
  // Настройки валидации
  requireAllSelections: true,
  validateSelections: true,
  
  // Настройки пулов
  enablePoolProgression: true,
  savePoolProgress: true,
  validatePoolCompletion: true,
  autoAdvancePool: true,
  poolCompletionThreshold: 100, // 100% - все числа в пуле должны быть завершены
  
  // Настройки перехода между пулами
  poolAdvancementDelay: 2000, // 2 секунды задержки перед переходом
  reloadAssociationsOnPoolAdvance: true, // Перезагружать ассоциации
  validatePoolAdvancement: true, // Валидировать переход
  logPoolTransitions: true, // Логировать переходы
  confirmPoolAdvancement: false, // Не требовать подтверждения (автоматический переход)
  
  // Настройки проверки инкрементации пула в БД
  verifyPoolIncrementInDB: true, // Проверять инкрементацию пула в базе данных
  poolIncrementTimeout: 5000, // 5 секунд таймаут для проверки
  retryPoolIncrementCheck: true, // Повторять проверку при неудаче
  maxPoolIncrementRetries: 3, // Максимум 3 попытки
  logPoolIncrementStatus: true, // Логировать статус инкрементации
  
  // Настройки строгой проверки переходов пулов
  enforcePoolTransition: true, // Строго требовать переход к следующему пулу
  validatePoolTransitionAPI: true, // Валидировать API переходов пулов
  monitorPoolTransitionSuccess: true, // Мониторить успешность переходов пулов
  alertOnPoolTransitionFailure: true, // Предупреждать о неудачных переходах пулов
  requirePoolTransitionConfirmation: false, // Не требовать подтверждение (автоматический переход)
  poolTransitionSuccessTimeout: 10000, // 10 секунд таймаут для подтверждения успешного перехода
};

/**
 * Проверяет все критерии функциональности StudyMode
 */
export class StudyModeValidator {
  private config: StudyModeConfig;
  
  constructor(config: StudyModeConfig = DEFAULT_STUDY_MODE_CONFIG) {
    this.config = config;
  }
  
  /**
   * Проверяет все критерии перед запуском
   */
  public validateBeforeStart(): ValidationResult {
    const results: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      checks: []
    };
    
    // Проверка 1: Таймер
    this.checkTimer(results);
    
    // Проверка 2: Переходы
    this.checkTransitions(results);
    
    // Проверка 3: Перемешивание
    this.checkShuffling(results);
    
    // Проверка 4: Сохранение прогресса
    this.checkProgressSaving(results);
    
    // Проверка 5: Валидация
    this.checkValidation(results);
    
    // Проверка 6: Отладка
    this.checkDebugging(results);
    
    // Проверка 7: Пулы
    this.checkPoolProgression(results);
    
    // Проверка 8: Переходы между пулами
    this.checkPoolAdvancement(results);
    
    // Проверка 9: Инкрементация пула в БД
    this.checkPoolIncrementVerification(results);
    
    // Проверка 10: Строгие переходы пулов
    this.checkStrictPoolTransitions(results);
    
    return results;
  }
  
  /**
   * Проверяет настройки таймера
   */
  private checkTimer(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Timer Configuration',
      status: 'pass',
      message: `Timer duration: ${this.config.timerDuration}s`
    };
    
    if (this.config.timerDuration <= 0) {
      check.status = 'fail';
      check.message = 'Timer duration must be greater than 0';
      results.errors.push('Timer duration is invalid');
    }
    
    if (this.config.timerDuration > 300) {
      check.status = 'warn';
      check.message = 'Timer duration is very long (>5 minutes)';
      results.warnings.push('Timer duration is very long');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки переходов
   */
  private checkTransitions(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Transition Configuration',
      status: 'pass',
      message: `Auto transition: ${this.config.autoTransition}, Delay: ${this.config.transitionDelay}ms`
    };
    
    if (this.config.autoTransition && this.config.transitionDelay < 0) {
      check.status = 'fail';
      check.message = 'Transition delay cannot be negative';
      results.errors.push('Transition delay is invalid');
    }
    
    if (!this.config.autoTransition) {
      check.status = 'warn';
      check.message = 'Auto transition is disabled - manual progression required';
      results.warnings.push('Auto transition is disabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки перемешивания
   */
  private checkShuffling(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Shuffling Configuration',
      status: 'pass',
      message: `Shuffle associations: ${this.config.shuffleAssociations}, Shuffle on restart: ${this.config.shuffleOnRestart}`
    };
    
    if (!this.config.shuffleAssociations) {
      check.status = 'warn';
      check.message = 'Association shuffling is disabled - order will be predictable';
      results.warnings.push('Association shuffling is disabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки сохранения прогресса
   */
  private checkProgressSaving(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Progress Saving Configuration',
      status: 'pass',
      message: `Save on pool complete: ${this.config.saveProgressOnPoolComplete}, Save on each answer: ${this.config.saveProgressOnEachAnswer}`
    };
    
    if (this.config.saveProgressOnPoolComplete && this.config.saveProgressOnEachAnswer) {
      check.status = 'warn';
      check.message = 'Both save modes are enabled - may cause duplicate saves';
      results.warnings.push('Both save modes are enabled');
    }
    
    if (!this.config.saveProgressOnPoolComplete && !this.config.saveProgressOnEachAnswer) {
      check.status = 'fail';
      check.message = 'No progress saving is enabled';
      results.errors.push('No progress saving is enabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки валидации
   */
  private checkValidation(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Validation Configuration',
      status: 'pass',
      message: `Require all selections: ${this.config.requireAllSelections}, Validate selections: ${this.config.validateSelections}`
    };
    
    if (!this.config.requireAllSelections) {
      check.status = 'warn';
      check.message = 'Not all selections are required - may allow incomplete answers';
      results.warnings.push('Not all selections are required');
    }
    
    if (!this.config.validateSelections) {
      check.status = 'warn';
      check.message = 'Selection validation is disabled';
      results.warnings.push('Selection validation is disabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки отладки
   */
  private checkDebugging(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Debug Configuration',
      status: 'pass',
      message: `Debug logs: ${this.config.enableDebugLogs}, Debug info: ${this.config.showDebugInfo}`
    };
    
    if (!this.config.enableDebugLogs && !this.config.showDebugInfo) {
      check.status = 'warn';
      check.message = 'All debugging is disabled - may be hard to troubleshoot';
      results.warnings.push('All debugging is disabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки пулов
   */
  private checkPoolProgression(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Pool Progression Configuration',
      status: 'pass',
      message: `Pool progression: ${this.config.enablePoolProgression}, Save pool progress: ${this.config.savePoolProgress}, Auto advance: ${this.config.autoAdvancePool}`
    };
    
    if (!this.config.enablePoolProgression) {
      check.status = 'warn';
      check.message = 'Pool progression is disabled - users will stay in the same pool';
      results.warnings.push('Pool progression is disabled');
    }
    
    if (this.config.enablePoolProgression && !this.config.savePoolProgress) {
      check.status = 'fail';
      check.message = 'Pool progression enabled but pool progress saving is disabled - progress will be lost';
      results.errors.push('Pool progression without saving will lose progress');
    }
    
    if (this.config.enablePoolProgression && !this.config.validatePoolCompletion) {
      check.status = 'warn';
      check.message = 'Pool progression enabled but pool completion validation is disabled - may advance prematurely';
      results.warnings.push('Pool completion validation is disabled');
    }
    
    if (this.config.poolCompletionThreshold < 0 || this.config.poolCompletionThreshold > 100) {
      check.status = 'fail';
      check.message = 'Pool completion threshold must be between 0 and 100';
      results.errors.push('Invalid pool completion threshold');
    }
    
    if (this.config.poolCompletionThreshold < 100) {
      check.status = 'warn';
      check.message = `Pool completion threshold is ${this.config.poolCompletionThreshold}% - pools may advance before completion`;
      results.warnings.push('Pool completion threshold is less than 100%');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки переходов между пулами
   */
  private checkPoolAdvancement(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Pool Advancement Configuration',
      status: 'pass',
      message: `Pool advancement delay: ${this.config.poolAdvancementDelay}ms, Reload associations: ${this.config.reloadAssociationsOnPoolAdvance}, Validate advancement: ${this.config.validatePoolAdvancement}`
    };
    
    if (this.config.poolAdvancementDelay < 0) {
      check.status = 'fail';
      check.message = 'Pool advancement delay cannot be negative';
      results.errors.push('Invalid pool advancement delay');
    }
    
    if (this.config.poolAdvancementDelay > 10000) {
      check.status = 'warn';
      check.message = 'Pool advancement delay is very long (>10 seconds)';
      results.warnings.push('Pool advancement delay is very long');
    }
    
    if (this.config.enablePoolProgression && !this.config.reloadAssociationsOnPoolAdvance) {
      check.status = 'warn';
      check.message = 'Pool progression enabled but associations will not be reloaded - may show old data';
      results.warnings.push('Associations will not be reloaded on pool advancement');
    }
    
    if (this.config.enablePoolProgression && !this.config.validatePoolAdvancement) {
      check.status = 'warn';
      check.message = 'Pool progression enabled but advancement validation is disabled - may advance incorrectly';
      results.warnings.push('Pool advancement validation is disabled');
    }
    
    if (!this.config.logPoolTransitions) {
      check.status = 'warn';
      check.message = 'Pool transition logging is disabled - may be hard to debug pool changes';
      results.warnings.push('Pool transition logging is disabled');
    }
    
    if (this.config.confirmPoolAdvancement) {
      check.status = 'warn';
      check.message = 'Pool advancement confirmation is enabled - users will need to confirm pool changes';
      results.warnings.push('Pool advancement confirmation is enabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки инкрементации пула в БД
   */
  private checkPoolIncrementVerification(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Pool Increment Verification Configuration',
      status: 'pass',
      message: `Verify pool increment: ${this.config.verifyPoolIncrementInDB}, Timeout: ${this.config.poolIncrementTimeout}ms, Retry: ${this.config.retryPoolIncrementCheck}, Max retries: ${this.config.maxPoolIncrementRetries}`
    };
    
    if (!this.config.verifyPoolIncrementInDB) {
      check.status = 'warn';
      check.message = 'Pool increment verification is disabled - may not detect DB update failures';
      results.warnings.push('Pool increment verification is disabled');
    }
    
    if (this.config.poolIncrementTimeout < 1000) {
      check.status = 'warn';
      check.message = 'Pool increment timeout is very short (<1 second) - may cause false failures';
      results.warnings.push('Pool increment timeout is very short');
    }
    
    if (this.config.poolIncrementTimeout > 30000) {
      check.status = 'warn';
      check.message = 'Pool increment timeout is very long (>30 seconds) - may cause slow responses';
      results.warnings.push('Pool increment timeout is very long');
    }
    
    if (!this.config.retryPoolIncrementCheck) {
      check.status = 'warn';
      check.message = 'Pool increment retry is disabled - may fail on temporary network issues';
      results.warnings.push('Pool increment retry is disabled');
    }
    
    if (this.config.maxPoolIncrementRetries < 1) {
      check.status = 'fail';
      check.message = 'Maximum pool increment retries must be at least 1';
      results.errors.push('Invalid maximum pool increment retries');
    }
    
    if (this.config.maxPoolIncrementRetries > 10) {
      check.status = 'warn';
      check.message = 'Maximum pool increment retries is very high (>10) - may cause long delays';
      results.warnings.push('Maximum pool increment retries is very high');
    }
    
    if (!this.config.logPoolIncrementStatus) {
      check.status = 'warn';
      check.message = 'Pool increment status logging is disabled - may be hard to debug DB issues';
      results.warnings.push('Pool increment status logging is disabled');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Проверяет настройки строгих переходов пулов
   */
  private checkStrictPoolTransitions(results: ValidationResult): void {
    const check: ValidationCheck = {
      name: 'Strict Pool Transitions Configuration',
      status: 'pass',
      message: `Enforce pool transition: ${this.config.enforcePoolTransition}, Monitor success: ${this.config.monitorPoolTransitionSuccess}, Alert on failure: ${this.config.alertOnPoolTransitionFailure}`
    };
    
    if (!this.config.enforcePoolTransition) {
      check.status = 'fail';
      check.message = 'Pool transition enforcement is disabled - transitions may not be required';
      results.errors.push('Pool transition enforcement is disabled');
    }
    
    if (!this.config.validatePoolTransitionAPI) {
      check.status = 'warn';
      check.message = 'Pool transition API validation is disabled - may not detect API failures';
      results.warnings.push('Pool transition API validation is disabled');
    }
    
    if (!this.config.monitorPoolTransitionSuccess) {
      check.status = 'warn';
      check.message = 'Pool transition success monitoring is disabled - may not detect failed transitions';
      results.warnings.push('Pool transition success monitoring is disabled');
    }
    
    if (!this.config.alertOnPoolTransitionFailure) {
      check.status = 'warn';
      check.message = 'Pool transition failure alerts are disabled - failures may go unnoticed';
      results.warnings.push('Pool transition failure alerts are disabled');
    }
    
    if (this.config.requirePoolTransitionConfirmation) {
      check.status = 'warn';
      check.message = 'Pool transition confirmation is required - may slow down transitions';
      results.warnings.push('Pool transition confirmation is required');
    }
    
    if (this.config.poolTransitionSuccessTimeout < 1000) {
      check.status = 'warn';
      check.message = 'Pool transition success timeout is very short (<1 second) - may cause false failures';
      results.warnings.push('Pool transition success timeout is very short');
    }
    
    if (this.config.poolTransitionSuccessTimeout > 30000) {
      check.status = 'warn';
      check.message = 'Pool transition success timeout is very long (>30 seconds) - may cause slow responses';
      results.warnings.push('Pool transition success timeout is very long');
    }
    
    results.checks.push(check);
  }
  
  /**
   * Получает текущую конфигурацию
   */
  public getConfig(): StudyModeConfig {
    return { ...this.config };
  }
  
  /**
   * Обновляет конфигурацию
   */
  public updateConfig(newConfig: Partial<StudyModeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

/**
 * Результат валидации
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checks: ValidationCheck[];
}

/**
 * Результат отдельной проверки
 */
export interface ValidationCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

/**
 * Утилиты для работы с конфигурацией
 */
export class StudyModeUtils {
  /**
   * Создает валидатор с настройками по умолчанию
   */
  public static createValidator(): StudyModeValidator {
    return new StudyModeValidator();
  }
  
  /**
   * Создает валидатор с пользовательскими настройками
   */
  public static createValidatorWithConfig(config: Partial<StudyModeConfig>): StudyModeValidator {
    const fullConfig = { ...DEFAULT_STUDY_MODE_CONFIG, ...config };
    return new StudyModeValidator(fullConfig);
  }
  
  /**
   * Проверяет конфигурацию и выводит результаты
   */
  public static validateAndLog(config: StudyModeConfig = DEFAULT_STUDY_MODE_CONFIG): ValidationResult {
    const validator = new StudyModeValidator(config);
    const result = validator.validateBeforeStart();
    
    console.log('🔍 StudyMode Configuration Validation:');
    console.log('=====================================');
    
    result.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name}: ${check.message}`);
    });
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      result.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    console.log(`\n${result.isValid ? '✅' : '❌'} Overall status: ${result.isValid ? 'VALID' : 'INVALID'}`);
    
    return result;
  }
}
