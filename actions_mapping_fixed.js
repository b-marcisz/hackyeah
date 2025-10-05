// Массив существующих действий в базе данных
const existingActions = [
  'bawi',
  'biega', 
  'buduje',
  'czyta',
  'gra',
  'je',
  'łapie',
  'lata',
  'liczy',
  'maluje',
  'pływa',
  'rzuca',
  'skacze',
  'śpi',
  'śpiewa',
  'strzela',
  'tańczy',
  'wspina'
];

// Функция для генерации уникальных действий
function generateUniqueActions() {
  const newActions = [];
  const usedActions = new Set();
  
  // Список новых уникальных действий для детей (простые, 1-2 слова)
  const possibleActions = [
    'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy',
    'bawi', 'śpi', 'pływa', 'lata', 'wspina', 'rzuca', 'łapie', 'strzela', 'biega', 'tańczy',
    'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy', 'bawi', 'śpi',
    'pływa', 'lata', 'wspina', 'rzuca', 'łapie', 'strzela', 'biega', 'tańczy', 'je', 'skacze',
    'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy', 'bawi', 'śpi', 'pływa', 'lata',
    'wspina', 'rzuca', 'łapie', 'strzela', 'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra',
    'maluje', 'czyta', 'buduje', 'liczy', 'bawi', 'śpi', 'pływa', 'lata', 'wspina', 'rzuca',
    'łapie', 'strzela', 'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta',
    'buduje', 'liczy', 'bawi', 'śpi', 'pływa', 'lata', 'wspina', 'rzuca', 'łapie', 'strzela',
    'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy',
    'bawi', 'śpi', 'pływa', 'lata', 'wspina', 'rzuca', 'łapie', 'strzela', 'biega', 'tańczy',
    'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy', 'bawi', 'śpi',
    'pływa', 'lata', 'wspina', 'rzuca', 'łapie', 'strzela', 'biega', 'tańczy', 'je', 'skacze',
    'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy', 'bawi', 'śpi', 'pływa', 'lata',
    'wspina', 'rzuca', 'łapie', 'strzela', 'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra',
    'maluje', 'czyta', 'buduje', 'liczy', 'bawi', 'śpi', 'pływa', 'lata', 'wspina', 'rzuca',
    'łapie', 'strzela', 'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta',
    'buduje', 'liczy', 'bawi', 'śpi', 'pływa', 'lata', 'wspina', 'rzuca', 'łapie', 'strzela',
    'biega', 'tańczy', 'je', 'skacze', 'śpiewa', 'gra', 'maluje', 'czyta', 'buduje', 'liczy'
  ];
  
  // Исключаем существующие действия
  const availableActions = possibleActions.filter(action => !existingActions.includes(action));
  
  console.log(`Доступных действий: ${availableActions.length}`);
  console.log(`Существующих действий: ${existingActions.length}`);
  
  // Генерируем 100 уникальных действий
  for (let i = 0; i < 100; i++) {
    let action;
    let attempts = 0;
    
    do {
      // Выбираем случайное действие из доступных
      action = availableActions[Math.floor(Math.random() * availableActions.length)];
      attempts++;
      
      // Если не можем найти уникальное действие, добавляем суффикс
      if (attempts > 10) {
        action = `action${i}`;
        break;
      }
    } while (usedActions.has(action));
    
    newActions.push(action);
    usedActions.add(action);
  }
  
  return newActions;
}

// Генерируем новые уникальные действия
const newActions = generateUniqueActions();

// Проверка на уникальность
function checkUniqueness() {
  const uniqueActions = [...new Set(newActions)];
  console.log(`Всего действий: ${newActions.length}`);
  console.log(`Уникальных действий: ${uniqueActions.length}`);
  console.log(`Дубликатов: ${newActions.length - uniqueActions.length}`);
  
  // Проверяем пересечения с существующими действиями
  const intersections = newActions.filter(action => existingActions.includes(action));
  console.log(`Пересечений с существующими: ${intersections.length}`);
  
  if (intersections.length > 0) {
    console.log('Найдены пересечения с существующими действиями:');
    console.log([...new Set(intersections)]);
  }
  
  if (newActions.length !== uniqueActions.length) {
    console.log('Найдены дубликаты:');
    const duplicates = newActions.filter((item, index) => newActions.indexOf(item) !== index);
    console.log([...new Set(duplicates)]);
  }
  
  // Выводим первые 10 действий для проверки
  console.log('Первые 10 новых действий:');
  console.log(newActions.slice(0, 10));
}

// Экспорт массивов
module.exports = {
  existingActions,
  newActions,
  checkUniqueness
};

// Проверка при запуске
checkUniqueness();
