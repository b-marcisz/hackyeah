/**
 * Скрипт для проверки всех критериев перед запуском приложения
 */

import { runStudyModeValidation } from './validateStudyModeConfig';

/**
 * Проверяет все критерии функциональности перед запуском
 */
export async function preStartCheck(): Promise<boolean> {
  console.log('🚀 Starting Pre-Start Check...');
  console.log('==============================');
  
  try {
    // Проверяем конфигурацию StudyMode
    const studyModeValid = await runStudyModeValidation();
    
    // Дополнительные проверки (можно добавить больше)
    const additionalChecks = [
      {
        name: 'Environment Variables',
        check: () => {
          const requiredEnvVars = ['REACT_APP_API_URL'];
          const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
          return missing.length === 0;
        }
      },
      {
        name: 'API Connectivity',
        check: async () => {
          try {
            const apiUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:4000`;
            const response = await fetch(`${apiUrl}/user-progress`);
            return response.ok;
          } catch {
            return false;
          }
        }
      }
    ];
    
    // Выполняем дополнительные проверки
    let allChecksPassed = studyModeValid;
    
    console.log('\n🔍 Additional Checks:');
    console.log('=====================');
    
    for (const check of additionalChecks) {
      try {
        const result = await check.check();
        const icon = result ? '✅' : '❌';
        console.log(`${icon} ${check.name}: ${result ? 'PASSED' : 'FAILED'}`);
        if (!result) allChecksPassed = false;
      } catch (error) {
        console.log(`❌ ${check.name}: ERROR - ${error}`);
        allChecksPassed = false;
      }
    }
    
    // Итоговый результат
    console.log('\n🎯 Pre-Start Check Results:');
    console.log('===========================');
    console.log(`StudyMode Configuration: ${studyModeValid ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`Additional Checks: ${allChecksPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Overall Status: ${allChecksPassed ? '✅ READY TO START' : '❌ NEEDS ATTENTION'}`);
    
    if (allChecksPassed) {
      console.log('\n🎉 All checks passed! Application is ready to start.');
    } else {
      console.log('\n⚠️ Some checks failed! Please fix the issues above.');
    }
    
    return allChecksPassed;
    
  } catch (error) {
    console.error('❌ Error during pre-start check:', error);
    return false;
  }
}

/**
 * Запускает проверку и возвращает результат
 */
export async function runPreStartCheck(): Promise<boolean> {
  return await preStartCheck();
}

// Экспортируем для использования
export default {
  preStartCheck,
  runPreStartCheck
};
