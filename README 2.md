
## Description

/*
  🧠 Проект: Assential — Система тренировки памяти через ассоциации

  Цель проекта — помочь пользователям быстро и надолго запоминать числа от 0 до 99 с помощью визуальной ассоциативной системы «Герой — Действие — Предмет» (Hero–Action–Object, или HAO).
  Каждый номер (0–99) будет иметь одну или несколько HAO-ассоциаций, основанных на известных образах, логике и культурных шаблонах.

  ▶️ Основные компоненты:
  - Backend на NestJS с PostgreSQL для хранения, обработки и оценки ассоциаций.
  - Telegram-бот для ежедневного обучения и оценки качества запоминания.
  - Мобильное приложение (iOS/Android) — тренажёр с карточками, прогрессом и геймификацией.
  - Исследование: подбор наилучших ассоциаций через AI (ChatGPT), основанное на множественных итерациях генерации и пользовательском фидбэке.

  📦 Структура таблицы number_associations:
  - number: целое число (0–99)
  - hero, action, object: компоненты ассоциации
  - explanation: пояснение логики связи
  - is_primary: булев флаг — является ли эта ассоциация основной для числа
  - rating, total_votes: агрегированные оценки пользователей

  Ограничения:
  - Для одного числа может быть только одна ассоциация с is_primary = true.
    Это реализуется через частичный уникальный индекс:
      CREATE UNIQUE INDEX unique_primary_number
      ON number_associations (number)
      WHERE is_primary = TRUE;

  📊 Задачи:
  - Сгенерировать несколько вариантов ассоциаций на каждое число с помощью GPT.
  - Собирать фидбэк пользователей через Telegram-бота и мобильное приложение.
  - Постепенно выявлять «оптимальные» ассоциации, используя голосование и аналитику.

  🧪 Вдохновением послужила книга «Ньютон гуляет по Луне» — мы хотим создать не просто базу, а запустить осознанное исследование по выбору ассоциаций, как будто «вселенная сама выбирает идеальные связи».
*/

/*
  🧠 Project: Assential — A memory training system based on associations

  The goal of the project is to help users quickly and reliably memorize numbers from 0 to 99 using a visual associative system called “Hero – Action – Object” (HAO).
  Each number (0–99) will have one or more HAO associations based on well-known imagery, logic, or cultural patterns.

  ▶️ Core components:
  - Backend in NestJS with PostgreSQL to store, manage, and evaluate associations.
  - Telegram bot for daily training and user feedback collection.
  - Mobile app (iOS/Android) — flashcard-based training with progress tracking and gamification.
  - Research module: generate optimal associations using AI (ChatGPT) through multiple iterations and collect user feedback.

  📦 Table: number_associations
  - number: integer between 0 and 99
  - hero, action, object: components of the association
  - explanation: rationale behind the chosen association
  - is_primary: boolean flag indicating if this is the main association for the number
  - rating, total_votes: aggregated user feedback scores

  Constraints:
  - Only one association per number can be marked as is_primary = true.
    This is enforced using a partial unique index:
      CREATE UNIQUE INDEX unique_primary_number
      ON number_associations (number)
      WHERE is_primary = TRUE;

  📊 Tasks:
  - Generate multiple association options per number using GPT.
  - Collect user feedback via Telegram bot and mobile app.
  - Gradually identify the "best" associations using voting and analytics.

  🧪 Inspiration: the book “Newton on the Moon” — our goal is not just to build a database, but to conduct a mindful exploration of associative memory, as if “the universe itself selected the ideal links.”
*/


- Author - [Andronov Mykyta](https://www.linkedin.com/home/?originalSubdomain=pl)
- Junior Software Engineer [ Андрей ](тут ссылку приклеешь)
## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment


- Author - [Andronov Mykyta](https://www.linkedin.com/home/?originalSubdomain=pl)
- Author - [Andrii](https://www.linkedin.com/home/?originalSubdomain=pl)


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
