# Number Association API - Список эндпоинтов

## 🔢 **Number Association API**

### **1. Генерация ассоциаций**

#### POST `/number-associations/:number/generate`
- **Описание**: Генерирует новую ассоциацию для конкретного числа
- **Параметры**: 
  - `number` (в URL) - число от 0 до 99
- **Ответ**: `NumberAssociation`
- **Пример**: `POST /number-associations/42/generate`

#### POST `/number-associations/generate-all`
- **Описание**: Генерирует ассоциации для всех чисел 0-99 (только недостающие)
- **Ответ**: `{message: string, count: number}`
- **Пример**: `POST /number-associations/generate-all`

### **2. Получение ассоциаций**

#### GET `/number-associations/:number`
- **Описание**: Получает primary ассоциацию для конкретного числа
- **Параметры**: 
  - `number` (в URL) - число от 0 до 99
- **Ответ**: `NumberAssociation` или 404
- **Пример**: `GET /number-associations/42`

#### GET `/number-associations/all/primary`
- **Описание**: Получает все primary ассоциации (0-99)
- **Ответ**: `NumberAssociation[]`
- **Пример**: `GET /number-associations/all/primary`

### **3. Оценка ассоциаций**

#### POST `/number-associations/:id/rate`
- **Описание**: Оценивает существующую ассоциацию
- **Параметры**: 
  - `id` (в URL) - ID ассоциации
- **Тело запроса**: `{"rating": 5}`
- **Ответ**: `NumberAssociation`
- **Пример**: `POST /number-associations/1/rate`

### **4. Управление дубликатами**

#### POST `/number-associations/check-duplicates`
- **Описание**: Проверяет и устраняет дубликаты по hero/action/object
- **Ответ**: 
  ```json
  {
    "duplicates": [
      {
        "number": 5,
        "hero": "Superman",
        "action": "flies",
        "object": "sky"
      }
    ],
    "regenerated": [15, 23, 45],
    "message": "Found 1 duplicate patterns, regenerated 3 associations"
  }
  ```
- **Пример**: `POST /number-associations/check-duplicates`

---

## 📊 **Структура данных**

### NumberAssociation
```typescript
{
  id: number;                    // Уникальный ID
  number: number;                // Число (0-99)
  hero: string;                  // Герой
  action: string;                // Действие
  object: string;                // Предмет
  explanation: string;           // Объяснение
  is_primary: boolean;           // Первичная ассоциация
  rating: number;                // Средняя оценка
  total_votes: number;           // Количество оценок
  created_at: Date;              // Дата создания
}
```

---

## 🎯 **Примеры использования**

### cURL команды

#### Генерация ассоциации для числа 42:
```bash
curl -X POST http://localhost:3000/number-associations/42/generate
```

#### Получение всех ассоциаций:
```bash
curl http://localhost:3000/number-associations/all/primary
```

#### Оценка ассоциации:
```bash
curl -X POST http://localhost:3000/number-associations/1/rate \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'
```

#### Генерация всех недостающих ассоциаций:
```bash
curl -X POST http://localhost:3000/number-associations/generate-all
```

#### Устранение дубликатов:
```bash
curl -X POST http://localhost:3000/number-associations/check-duplicates
```

---

## 🔧 **Настройка**

### Переменные окружения
- `baseUrl`: http://localhost:3000
- `OPEN_API_BASE_URL`: URL для OpenAI API
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: Настройки базы данных

### Заголовки
- `Content-Type: application/json` (для POST запросов)

---

## 📝 **Примечания**

- Все ассоциации генерируются на польском языке
- Дубликаты ищутся по каждой части отдельно (hero, action, object)
- Рейтинг должен быть от 1 до 5
- API автоматически устанавливает `is_primary = true` для новых ассоциаций
