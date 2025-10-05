// Скрипт для поиска и удаления дубликатов в actions_mapping.js

const fs = require('fs');

// Читаем файл
const fileContent = fs.readFileSync('/Users/nikita/projects/hackyeah/actions_mapping.js', 'utf8');

// Извлекаем массив possibleActions
const actionsMatch = fileContent.match(/const possibleActions = \[([\s\S]*?)\];/);
if (!actionsMatch) {
  console.log('Не найден массив possibleActions');
  process.exit(1);
}

const actionsString = actionsMatch[1];
const actions = actionsString
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && line.startsWith("'") && line.endsWith("',"))
  .map(line => line.slice(1, -2)); // убираем кавычки и запятую

console.log(`Всего действий: ${actions.length}`);

// Находим дубликаты
const duplicates = [];
const seen = new Set();
const uniqueActions = [];

actions.forEach((action, index) => {
  if (seen.has(action)) {
    duplicates.push({ action, index });
  } else {
    seen.add(action);
    uniqueActions.push(action);
  }
});

console.log(`Уникальных действий: ${uniqueActions.length}`);
console.log(`Дубликатов: ${duplicates.length}`);

if (duplicates.length > 0) {
  console.log('\nНайденные дубликаты:');
  duplicates.forEach(dup => {
    console.log(`- "${dup.action}" (позиция ${dup.index})`);
  });
}

// Создаем новый файл без дубликатов
const newActionsString = uniqueActions.map(action => `    '${action}',`).join('\n');
const newFileContent = fileContent.replace(
  /const possibleActions = \[[\s\S]*?\];/,
  `const possibleActions = [\n${newActionsString}\n  ];`
);

fs.writeFileSync('/Users/nikita/projects/hackyeah/actions_mapping_clean.js', newFileContent);
console.log('\nСоздан файл actions_mapping_clean.js без дубликатов');
