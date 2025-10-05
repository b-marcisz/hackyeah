# Строгая проверка переходов пулов

## Обзор

Система строгой проверки переходов пулов обеспечивает надежный переход между пулами в StudyMode с полной проверкой успешности перехода и записи в базу данных.

## Настройки конфигурации

### Основные настройки

```typescript
// Строго требовать переход к следующему пулу
enforcePoolTransition: true

// Валидировать API переходов пулов
validatePoolTransitionAPI: true

// Мониторить успешность переходов пулов
monitorPoolTransitionSuccess: true

// Предупреждать о неудачных переходах пулов
alertOnPoolTransitionFailure: true

// Требовать подтверждение перехода пула
requirePoolTransitionConfirmation: false

// Таймаут для подтверждения успешного перехода пула (мс)
poolTransitionSuccessTimeout: 10000
```

## Как работает строгая проверка

### 1. Принудительный переход пула

Когда пул завершен, система:
- Вызывает API `/user-progress/advance-pool`
- Проверяет успешность API вызова
- Валидирует переход в базе данных
- При неудаче - повторяет попытку

### 2. Проверка в базе данных

После API вызова система:
- Запрашивает текущий пул из БД
- Сравнивает с ожидаемым пулом
- Логирует результат проверки
- При несоответствии - повторяет переход

### 3. Мониторинг и предупреждения

Система отслеживает:
- Успешность API вызовов
- Корректность данных в БД
- Время выполнения переходов
- Количество попыток

## Использование

### В StudyMode

```typescript
// Строгая проверка автоматически интегрирована
// При завершении пула выполняется:
// 1. API вызов перехода
// 2. Проверка в БД
// 3. Повтор при неудаче
// 4. Логирование результата
```

### Ручная проверка

```typescript
import { StrictPoolTransitionUtils } from '../utils/strictPoolTransitionUtils';

const result = await StrictPoolTransitionUtils.enforcePoolTransition({
  currentPool: 0,
  nextPool: 3,
  config: studyModeConfig,
  apiUrl: 'http://localhost:4000'
});

if (result.success) {
  console.log('Pool transition successful');
} else {
  console.error('Pool transition failed:', result.errors);
}
```

## Отображение статуса

### Компонент статуса

```typescript
import { StrictPoolTransitionStatus } from '../components/course/StrictPoolTransitionStatus';

<StrictPoolTransitionStatus 
  result={transitionResult} 
  showDetails={true} 
/>
```

### Отладочная информация

В консоли браузера отображается:
- 🔒 ENFORCING POOL TRANSITION
- 📊 Pool Increment Verification
- ✅ Pool transition successful
- ❌ POOL TRANSITION FAILURE

## Валидация конфигурации

### Проверки конфигурации

Система проверяет:
- Включена ли принудительная проверка
- Настроена ли валидация API
- Включен ли мониторинг успешности
- Настроены ли предупреждения о неудачах

### Критерии валидации

```typescript
// Все критерии должны быть выполнены:
enforcePoolTransition: true
validatePoolTransitionAPI: true
monitorPoolTransitionSuccess: true
alertOnPoolTransitionFailure: true
poolTransitionSuccessTimeout: 10000
```

## Устранение неполадок

### Проблема: Переход пула не выполняется

**Причины:**
- API недоступен
- Неправильные параметры запроса
- Проблемы с базой данных

**Решение:**
1. Проверить доступность API
2. Проверить логи в консоли
3. Использовать ручную проверку
4. Проверить настройки конфигурации

### Проблема: Переход выполняется, но не сохраняется в БД

**Причины:**
- Проблемы с записью в БД
- Неправильная валидация
- Таймаут проверки

**Решение:**
1. Увеличить `poolTransitionSuccessTimeout`
2. Включить `retryPoolIncrementCheck`
3. Проверить логи БД
4. Использовать повторные попытки

### Проблема: Ложные срабатывания предупреждений

**Причины:**
- Слишком короткий таймаут
- Проблемы с сетью
- Медленная БД

**Решение:**
1. Увеличить `poolTransitionSuccessTimeout`
2. Настроить `maxPoolIncrementRetries`
3. Проверить производительность БД

## Лучшие практики

### 1. Настройка таймаутов

```typescript
// Рекомендуемые значения:
poolTransitionSuccessTimeout: 10000  // 10 секунд
poolIncrementTimeout: 5000          // 5 секунд
maxPoolIncrementRetries: 3          // 3 попытки
```

### 2. Мониторинг

```typescript
// Включить все мониторинги:
monitorPoolTransitionSuccess: true
logPoolTransitions: true
logPoolIncrementStatus: true
alertOnPoolTransitionFailure: true
```

### 3. Отладка

```typescript
// Для отладки включить:
logPoolTransitions: true
logPoolIncrementStatus: true
showDetails: true
```

## API Endpoints

### Переход к следующему пулу

```http
POST /user-progress/advance-pool
Content-Type: application/json

{
  "currentPool": 3,
  "poolSize": 3,
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### Проверка текущего пула

```http
GET /user-progress
```

**Ответ:**
```json
{
  "currentPool": 3,
  "completedNumbers": [0, 1, 2],
  "pool": 3
}
```

## Логирование

### Уровни логирования

- **INFO**: Успешные переходы
- **WARN**: Предупреждения о настройках
- **ERROR**: Неудачные переходы
- **DEBUG**: Детальная отладочная информация

### Примеры логов

```
🔒 ENFORCING POOL TRANSITION:
  Current pool: 0
  Next pool: 3

📊 Pool Increment Verification:
  Expected pool: 3
  Actual pool in DB: 3

✅ Pool increment verified in database
🎉 POOL TRANSITION SUCCESSFUL!
```

## Заключение

Система строгой проверки переходов пулов обеспечивает надежность и отслеживаемость переходов между пулами в StudyMode. Все переходы проверяются и логируются, что позволяет быстро выявлять и устранять проблемы.
