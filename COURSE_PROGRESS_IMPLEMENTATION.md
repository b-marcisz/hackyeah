# 🎯 Реализация системы прогресса курса ассоциаций

## 📋 Обзор системы

**Цель курса:** Изучить и запомнить все ассоциации к каждой цифре (0-99)

**Механика тренажера:**
- Начальный прогресс пользователя: 0%
- Пользователь изучает ассоциации по пулам (0-2, 3-5, 6-8, и т.д.)
- Каждый пул содержит 3 цифры
- Прогресс увеличивается на 3% за каждый успешно пройденный пул

## 🎮 Игровой процесс

### Этап 1: Изучение (Memorization)
1. Пользователь видит 3 цифры (например: 0, 1, 2)
2. К каждой цифре показываются 3 картинки: герой, действие, объект
3. Пользователь изучает ассоциации в течение заданного времени
4. Таймер показывает оставшееся время

### Этап 2: Проверка (Testing)
1. Появляется первая цифра из пула (например: 0)
2. Показываются 9 ассоциаций из пула (0-2) в перемешанном порядке
3. Пользователь должен правильно выбрать героя, действие и объект для цифры 0
4. Если ответ неверный - показывается подсказка и раунд начинается заново
5. Если ответ верный - переходим к следующей цифре (1, затем 2)
6. После успешного прохождения всего пула - прогресс увеличивается на 3%

## 🗄️ Backend изменения

### 1. Создать модель UserProgress
```typescript
// BE/src/entities/user-progress.entity.ts
@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  currentProgress: number; // 0-100%

  @Column({ default: 0 })
  currentPool: number; // Текущий пул (0, 3, 6, 9, ...)

  @Column({ default: 0 })
  currentNumber: number; // Текущая цифра в пуле

  @Column({ type: 'json', default: '[]' })
  completedNumbers: number[]; // Пройденные цифры

  @Column({ type: 'json', default: '[]' })
  failedAttempts: number[]; // Неудачные попытки

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. Создать сервис для управления прогрессом
```typescript
// BE/src/AI/open-api/user-progress.service.ts
@Injectable()
export class UserProgressService {
  // Получить текущий прогресс пользователя
  async getCurrentProgress(): Promise<UserProgress>

  // Обновить прогресс после успешного прохождения
  async updateProgress(success: boolean, number: number): Promise<UserProgress>

  // Получить ассоциации для текущего пула
  async getAssociationsForCurrentPool(): Promise<NumberAssociation[]>

  // Получить ассоциации для изучения (3 цифры)
  async getAssociationsForStudy(): Promise<NumberAssociation[]>

  // Получить ассоциации для тестирования (9 ассоциаций из пула)
  async getAssociationsForTest(): Promise<NumberAssociation[]>

  // Проверить правильность ответа
  async checkAnswer(number: number, hero: string, action: string, object: string): Promise<boolean>
}
```

### 3. Создать контроллер для API
```typescript
// BE/src/AI/open-api/user-progress.controller.ts
@Controller('user-progress')
export class UserProgressController {
  // GET /user-progress - получить текущий прогресс
  // GET /user-progress/study - получить ассоциации для изучения
  // GET /user-progress/test - получить ассоциации для тестирования
  // POST /user-progress/answer - проверить ответ
  // POST /user-progress/complete - завершить пул
}
```

## 🎨 Frontend изменения

### 1. Создать компонент Dashboard
```typescript
// UI/src/pages/Dashboard.tsx
- Показать текущий прогресс (0-100%)
- Показать текущий пул (0-2, 3-5, и т.д.)
- Показать статистику (пройдено цифр, ошибок)
- Кнопка "Начать обучение"
```

### 2. Создать компонент StudyMode
```typescript
// UI/src/components/course/StudyMode.tsx
- Показать 3 цифры с их ассоциациями
- Таймер обратного отсчета
- Кнопка "Готов к тесту"
```

### 3. Создать компонент TestMode
```typescript
// UI/src/components/course/TestMode.tsx
- Показать текущую цифру
- Показать 9 ассоциаций в перемешанном порядке
- Позволить выбрать правильные ассоциации
- Обработка правильных/неправильных ответов
```

### 4. Создать компонент HintModal
```typescript
// UI/src/components/course/HintModal.tsx
- Показать правильный ответ
- Объяснение ассоциации
- Кнопка "Попробовать снова"
```

### 5. Создать компонент ProgressBar
```typescript
// UI/src/components/course/ProgressBar.tsx
- Визуальный прогресс-бар
- Показать текущий пул
- Показать пройденные цифры
```

## 🔄 API Endpoints

### User Progress API
```
GET /user-progress
- Получить текущий прогресс пользователя

GET /user-progress/study
- Получить ассоциации для изучения (3 цифры из текущего пула)

GET /user-progress/test
- Получить ассоциации для тестирования (9 ассоциаций из пула)

POST /user-progress/answer
Body: { number: number, hero: string, action: string, object: string }
- Проверить правильность ответа

POST /user-progress/complete
Body: { pool: number }
- Завершить пул и увеличить прогресс
```

## 📊 Логика прогресса

### Пул 0-2 (Прогресс 0-3%)
- Изучение: цифры 0, 1, 2
- Тестирование: 9 ассоциаций из пула 0-2
- После успешного прохождения: прогресс = 3%

### Пул 3-5 (Прогресс 3-6%)
- Изучение: цифры 3, 4, 5
- Тестирование: 9 ассоциаций из пула 3-5
- После успешного прохождения: прогресс = 6%

### И так далее...

## 🎯 Последовательность реализации

### Этап 1: Backend
1. ✅ Создать UserProgress entity
2. ✅ Создать UserProgressService
3. ✅ Создать UserProgressController
4. ✅ Добавить роуты в app.module.ts
5. ✅ Протестировать API endpoints

### Этап 2: Frontend - Dashboard
1. ✅ Создать Dashboard компонент
2. ✅ Добавить ProgressBar компонент
3. ✅ Интегрировать с API
4. ✅ Добавить навигацию

### Этап 3: Frontend - Study Mode
1. ✅ Создать StudyMode компонент
2. ✅ Добавить таймер
3. ✅ Показать ассоциации
4. ✅ Переход к тестированию

### Этап 4: Frontend - Test Mode
1. ✅ Создать TestMode компонент
2. ✅ Логика выбора ассоциаций
3. ✅ Проверка ответов
4. ✅ Обработка ошибок

### Этап 5: Frontend - Hint System
1. ✅ Создать HintModal компонент
2. ✅ Показать правильные ответы
3. ✅ Логика повторных попыток

### Этап 6: Интеграция и тестирование
1. ✅ Полная интеграция всех компонентов
2. ✅ Тестирование пользовательского сценария
3. ✅ Исправление багов
4. ✅ Финальная полировка

## 🎨 Дизайн в тематике Хэллоуина

- 🎃 Цветовая схема: фиолетовый, оранжевый, черный
- 👻 Анимации: pulse, bounce, scale
- ⚡ Эмодзи для визуального оформления
- 🎯 Градиенты и тени для глубины
- 🔥 Эффекты при правильных/неправильных ответах

## 📱 Адаптивность

- Мобильные устройства: упрощенный интерфейс
- Планшеты: оптимальное использование пространства
- Десктоп: полный функционал с дополнительными элементами

## 🧪 Тестирование

### Unit тесты
- UserProgressService методы
- Компоненты React
- API endpoints

### Integration тесты
- Полный пользовательский сценарий
- Переходы между этапами
- Сохранение прогресса

### E2E тесты
- Завершение полного курса
- Обработка ошибок
- Восстановление сессии
