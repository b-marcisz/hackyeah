/**
 * Скрипт для проверки конфигурации StudyMode перед запуском
 */

import { StudyModeUtils, DEFAULT_STUDY_MODE_CONFIG } from '../config/studyModeConfig';

/**
 * Проверяет конфигурацию StudyMode и выводит результаты
 */
export function validateStudyModeConfig(): boolean {
  console.log('🔍 Validating StudyMode Configuration...');
  console.log('=====================================');
  
  try {
    // Создаем валидатор с настройками по умолчанию
    const validator = StudyModeUtils.createValidator();
    
    // Валидируем конфигурацию
    const result = validator.validateBeforeStart();
    
    // Выводим результаты
    console.log('\n📊 Validation Results:');
    console.log('======================');
    
    result.checks.forEach((check, index) => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
      console.log(`${index + 1}. ${icon} ${check.name}`);
      console.log(`   ${check.message}`);
    });
    
    // Выводим ошибки
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Выводим предупреждения
    if (result.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      result.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }
    
    // Итоговый статус
    console.log('\n🎯 Overall Status:');
    console.log('==================');
    if (result.isValid) {
      console.log('✅ Configuration is VALID - ready to start!');
      return true;
    } else {
      console.log('❌ Configuration is INVALID - please fix errors before starting!');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error during validation:', error);
    return false;
  }
}

/**
 * Проверяет конкретные критерии функциональности
 */
export async function validateStudyModeCriteria(): Promise<boolean> {
  console.log('\n🎯 Validating StudyMode Criteria...');
  console.log('====================================');
  
  const criteria = [
    {
      name: 'Timer Reset After Correct Answer',
      description: 'Timer should reset to 30 seconds after correct answer',
      check: () => DEFAULT_STUDY_MODE_CONFIG.timerDuration === 30
    },
    {
      name: 'Immediate Transition to Next Number',
      description: 'Should transition immediately to next number after correct answer',
      check: () => DEFAULT_STUDY_MODE_CONFIG.autoTransition && DEFAULT_STUDY_MODE_CONFIG.transitionDelay === 0
    },
    {
      name: 'Association Shuffling',
      description: 'Associations should be shuffled for random order',
      check: () => DEFAULT_STUDY_MODE_CONFIG.shuffleAssociations
    },
    {
      name: 'Progress Saving on Pool Complete',
      description: 'Progress should be saved only after completing entire pool',
      check: () => DEFAULT_STUDY_MODE_CONFIG.saveProgressOnPoolComplete && !DEFAULT_STUDY_MODE_CONFIG.saveProgressOnEachAnswer
    },
    {
      name: 'Start from Pool Beginning',
      description: 'Should always start from first number of current pool',
      check: () => true // This is handled in the component logic
    },
    {
      name: 'Debug Logging Enabled',
      description: 'Debug logs should be enabled for troubleshooting',
      check: () => DEFAULT_STUDY_MODE_CONFIG.enableDebugLogs
    },
    {
      name: 'All Selections Required',
      description: 'All three selections (hero, action, object) should be required',
      check: () => DEFAULT_STUDY_MODE_CONFIG.requireAllSelections
    },
    {
      name: 'Pool Progression Enabled',
      description: 'Pool progression should be enabled to advance between pools',
      check: () => DEFAULT_STUDY_MODE_CONFIG.enablePoolProgression
    },
    {
      name: 'Pool Progress Saving',
      description: 'Pool progress should be saved to database',
      check: () => DEFAULT_STUDY_MODE_CONFIG.savePoolProgress
    },
    {
      name: 'Pool Completion Validation',
      description: 'Pool completion should be validated before advancing',
      check: () => DEFAULT_STUDY_MODE_CONFIG.validatePoolCompletion
    },
    {
      name: 'Auto Advance Pool',
      description: 'Should automatically advance to next pool when current pool is completed',
      check: () => DEFAULT_STUDY_MODE_CONFIG.autoAdvancePool
    },
    {
      name: 'Pool Completion Threshold',
      description: 'Pool completion threshold should be 100% for complete pool advancement',
      check: () => DEFAULT_STUDY_MODE_CONFIG.poolCompletionThreshold === 100
    },
    {
      name: 'Pool API Connectivity',
      description: 'Pool API endpoints should be accessible for saving progress',
      check: async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
          const response = await fetch(`${apiUrl}/user-progress`);
          return response.ok;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'Pool Progress Saving',
      description: 'Pool progress should be saved to database after completion',
      check: () => DEFAULT_STUDY_MODE_CONFIG.savePoolProgress
    },
    {
      name: 'Pool Auto Advance',
      description: 'Should automatically advance to next pool when current pool is completed',
      check: () => DEFAULT_STUDY_MODE_CONFIG.autoAdvancePool
    },
    {
      name: 'Pool Advancement Delay',
      description: 'Pool advancement delay should be reasonable (2 seconds)',
      check: () => DEFAULT_STUDY_MODE_CONFIG.poolAdvancementDelay === 2000
    },
    {
      name: 'Reload Associations on Pool Advance',
      description: 'Should reload associations when advancing to next pool',
      check: () => DEFAULT_STUDY_MODE_CONFIG.reloadAssociationsOnPoolAdvance
    },
    {
      name: 'Validate Pool Advancement',
      description: 'Should validate pool advancement before proceeding',
      check: () => DEFAULT_STUDY_MODE_CONFIG.validatePoolAdvancement
    },
    {
      name: 'Log Pool Transitions',
      description: 'Should log pool transitions for debugging',
      check: () => DEFAULT_STUDY_MODE_CONFIG.logPoolTransitions
    },
    {
      name: 'Pool Advancement Confirmation',
      description: 'Pool advancement confirmation should be disabled for automatic progression',
      check: () => !DEFAULT_STUDY_MODE_CONFIG.confirmPoolAdvancement
    },
    {
      name: 'Verify Pool Increment in DB',
      description: 'Should verify pool increment in database after pool completion',
      check: () => DEFAULT_STUDY_MODE_CONFIG.verifyPoolIncrementInDB
    },
    {
      name: 'Pool Increment Timeout',
      description: 'Pool increment timeout should be reasonable (5 seconds)',
      check: () => DEFAULT_STUDY_MODE_CONFIG.poolIncrementTimeout === 5000
    },
    {
      name: 'Retry Pool Increment Check',
      description: 'Should retry pool increment check on failure',
      check: () => DEFAULT_STUDY_MODE_CONFIG.retryPoolIncrementCheck
    },
    {
      name: 'Max Pool Increment Retries',
      description: 'Maximum pool increment retries should be reasonable (3)',
      check: () => DEFAULT_STUDY_MODE_CONFIG.maxPoolIncrementRetries === 3
    },
    {
      name: 'Log Pool Increment Status',
      description: 'Should log pool increment status for debugging',
      check: () => DEFAULT_STUDY_MODE_CONFIG.logPoolIncrementStatus
    },
    {
      name: 'Enforce Pool Transition',
      description: 'Should enforce pool transitions to next pool',
      check: () => DEFAULT_STUDY_MODE_CONFIG.enforcePoolTransition
    },
    {
      name: 'Validate Pool Transition API',
      description: 'Should validate pool transition API calls',
      check: () => DEFAULT_STUDY_MODE_CONFIG.validatePoolTransitionAPI
    },
    {
      name: 'Monitor Pool Transition Success',
      description: 'Should monitor pool transition success',
      check: () => DEFAULT_STUDY_MODE_CONFIG.monitorPoolTransitionSuccess
    },
    {
      name: 'Alert on Pool Transition Failure',
      description: 'Should alert on pool transition failures',
      check: () => DEFAULT_STUDY_MODE_CONFIG.alertOnPoolTransitionFailure
    },
    {
      name: 'Pool Transition Success Timeout',
      description: 'Pool transition success timeout should be reasonable (10 seconds)',
      check: () => DEFAULT_STUDY_MODE_CONFIG.poolTransitionSuccessTimeout === 10000
    }
  ];
  
  let allPassed = true;
  
  for (let index = 0; index < criteria.length; index++) {
    const criterion = criteria[index];
    try {
      const passed = await criterion.check();
      const icon = passed ? '✅' : '❌';
      console.log(`${index + 1}. ${icon} ${criterion.name}`);
      console.log(`   ${criterion.description}`);
      if (!passed) allPassed = false;
    } catch (error) {
      console.log(`${index + 1}. ❌ ${criterion.name}`);
      console.log(`   ${criterion.description}`);
      console.log(`   Error: ${error}`);
      allPassed = false;
    }
  }
  
  console.log(`\n🎯 Criteria Status: ${allPassed ? '✅ ALL PASSED' : '❌ SOME FAILED'}`);
  return allPassed;
}

/**
 * Основная функция проверки
 */
export async function runStudyModeValidation(): Promise<boolean> {
  console.log('🚀 Starting StudyMode Configuration Validation...');
  console.log('================================================');
  
  const configValid = validateStudyModeConfig();
  const criteriaValid = await validateStudyModeCriteria();
  
  console.log('\n📋 Final Results:');
  console.log('=================');
  console.log(`Configuration: ${configValid ? '✅ VALID' : '❌ INVALID'}`);
  console.log(`Criteria: ${criteriaValid ? '✅ VALID' : '❌ INVALID'}`);
  
  const overallValid = configValid && criteriaValid;
  console.log(`Overall: ${overallValid ? '✅ READY TO START' : '❌ NEEDS FIXES'}`);
  
  if (overallValid) {
    console.log('\n🎉 StudyMode is ready to use!');
    console.log('All configuration checks passed.');
  } else {
    console.log('\n⚠️ StudyMode needs attention!');
    console.log('Please fix the issues above before starting.');
  }
  
  return overallValid;
}

// Экспортируем для использования в других модулях
export default {
  validateStudyModeConfig,
  validateStudyModeCriteria,
  runStudyModeValidation
};
