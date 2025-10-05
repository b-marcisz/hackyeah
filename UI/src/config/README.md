# StudyMode Configuration System

Система конфигурации и валидации для функциональности StudyMode.

## 📁 Структура файлов

```
src/
├── config/
│   ├── studyModeConfig.ts          # Основная конфигурация
│   └── README.md                   # Этот файл
├── hooks/
│   └── useStudyModeConfig.ts       # Хук для работы с конфигурацией
├── components/course/
│   ├── StudyModeConfigStatus.tsx   # Компонент статуса
│   └── StudyModeWithConfig.tsx     # StudyMode с конфигурацией
└── scripts/
    ├── validateStudyModeConfig.ts  # Скрипт валидации
    └── preStartCheck.ts            # Проверка перед запуском
```

## 🚀 Быстрый старт

### 1. Базовое использование

```typescript
import { useStudyModeConfig } from '../hooks/useStudyModeConfig';

const MyComponent = () => {
  const { config, isConfigValid, validateConfig } = useStudyModeConfig();
  
  // Используйте config для настройки StudyMode
  // Проверяйте isConfigValid перед запуском
};
```

### 2. Проверка перед запуском

```typescript
import { runStudyModeValidation } from '../scripts/validateStudyModeConfig';

// Проверяем конфигурацию
const isValid = runStudyModeValidation();
if (!isValid) {
  console.error('Configuration is invalid!');
}
```

### 3. Использование компонента статуса

```typescript
import { StudyModeConfigStatus } from '../components/course/StudyModeConfigStatus';

<StudyModeConfigStatus 
  validationResult={validationResult}
  showDetails={true}
/>
```

## ⚙️ Конфигурация

### Основные настройки

```typescript
const config = {
  timerDuration: 30,           // Длительность таймера
  poolSize: 3,                 // Размер пула
  autoTransition: true,        // Автоматический переход
  transitionDelay: 0,         // Задержка перехода
  shuffleAssociations: true,   // Перемешивание
  saveProgressOnPoolComplete: true, // Сохранение после пула
  enableDebugLogs: true,      // Отладочные логи
  requireAllSelections: true   // Требовать все выборы
};
```

### Критерии валидации

Система проверяет следующие критерии:

1. **Timer Reset After Correct Answer** ✅
   - Таймер сбрасывается на 30 секунд после правильного ответа

2. **Immediate Transition to Next Number** ✅
   - Немедленный переход к следующему числу после правильного ответа

3. **Association Shuffling** ✅
   - Ассоциации перемешиваются для случайного порядка

4. **Progress Saving on Pool Complete** ✅
   - Прогресс сохраняется только после завершения всего пула

5. **Start from Pool Beginning** ✅
   - Всегда начинается с первого числа текущего пула

6. **Debug Logging Enabled** ✅
   - Включены отладочные логи для диагностики

7. **All Selections Required** ✅
   - Требуются все три выбора (герой, действие, предмет)

## 🔍 Отладка

### Включение отладочных логов

```typescript
const config = {
  enableDebugLogs: true,
  showDebugInfo: true
};
```

### Проверка статуса в консоли

```typescript
import { StudyModeUtils } from '../config/studyModeConfig';

// Валидируем и выводим результаты
StudyModeUtils.validateAndLog();
```

### Ручная проверка конфигурации

```typescript
import { useStudyModeConfig } from '../hooks/useStudyModeConfig';

const { validateConfig, validationResult } = useStudyModeConfig();

// Проверяем конфигурацию
const result = validateConfig();
console.log('Validation result:', result);
```

## 🛠️ Расширение

### Добавление новых критериев

1. Добавьте новый критерий в `studyModeConfig.ts`:

```typescript
export interface StudyModeConfig {
  // ... существующие поля
  newCriterion: boolean;
}
```

2. Обновите валидатор:

```typescript
private checkNewCriterion(results: ValidationResult): void {
  const check = {
    name: 'New Criterion',
    status: 'pass' as const,
    message: `New criterion: ${this.config.newCriterion}`
  };
  
  if (!this.config.newCriterion) {
    check.status = 'fail';
    check.message = 'New criterion is required';
    results.errors.push('New criterion is missing');
  }
  
  results.checks.push(check);
}
```

3. Добавьте проверку в `validateBeforeStart()`:

```typescript
this.checkNewCriterion(results);
```

### Добавление новых проверок

1. Создайте новую функцию проверки в `validateStudyModeConfig.ts`:

```typescript
export function validateNewFeature(): boolean {
  // Ваша логика проверки
  return true;
}
```

2. Добавьте в `runStudyModeValidation()`:

```typescript
const newFeatureValid = validateNewFeature();
const overallValid = configValid && criteriaValid && newFeatureValid;
```

## 📊 Мониторинг

### Статус в реальном времени

```typescript
const { validationResult, isConfigValid } = useStudyModeConfig();

// Проверяем статус
if (!isConfigValid) {
  console.warn('Configuration is invalid!');
}
```

### Логирование

```typescript
// Включите логирование в консоль
console.log('StudyMode configuration:', config);
console.log('Validation result:', validationResult);
```

## 🚨 Устранение проблем

### Частые проблемы

1. **Configuration is invalid**
   - Проверьте все критерии в консоли
   - Убедитесь, что все настройки корректны

2. **Timer not resetting**
   - Проверьте `timerDuration` в конфигурации
   - Убедитесь, что `autoTransition` включен

3. **Not transitioning to next number**
   - Проверьте `autoTransition` и `transitionDelay`
   - Убедитесь, что логика перехода работает

4. **Associations not shuffling**
   - Проверьте `shuffleAssociations` в конфигурации
   - Убедитесь, что перемешивание применяется

### Отладочные команды

```typescript
// Проверка конфигурации
import { runStudyModeValidation } from '../scripts/validateStudyModeConfig';
runStudyModeValidation();

// Проверка перед запуском
import { runPreStartCheck } from '../scripts/preStartCheck';
runPreStartCheck();
```

## 📝 Примеры использования

### Полный пример компонента

```typescript
import React from 'react';
import { useStudyModeConfig } from '../hooks/useStudyModeConfig';
import { StudyModeConfigStatus } from '../components/course/StudyModeConfigStatus';

const MyStudyMode = () => {
  const { 
    config, 
    validationResult, 
    isConfigValid, 
    updateConfig 
  } = useStudyModeConfig();
  
  return (
    <div>
      <StudyModeConfigStatus 
        validationResult={validationResult}
        showDetails={true}
      />
      
      {isConfigValid ? (
        <div>StudyMode is ready!</div>
      ) : (
        <div>Please fix configuration issues</div>
      )}
    </div>
  );
};
```

### Пример с пользовательской конфигурацией

```typescript
const customConfig = {
  timerDuration: 45,
  poolSize: 5,
  enableDebugLogs: false
};

const { config, isConfigValid } = useStudyModeConfig(customConfig);
```

## 🎯 Заключение

Эта система конфигурации обеспечивает:

- ✅ Автоматическую проверку всех критериев
- ✅ Подробную диагностику проблем
- ✅ Гибкую настройку параметров
- ✅ Мониторинг в реальном времени
- ✅ Простое расширение функциональности

Используйте эту систему для обеспечения стабильной работы StudyMode! 🚀
