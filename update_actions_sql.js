// Скрипт для обновления всех действий в базе данных
const { newActions } = require('./actions_mapping.js');

console.log('Создаем SQL скрипт для обновления действий...');

let sql = '';
for (let i = 0; i < 100; i++) {
  sql += `UPDATE number_associations SET action = '${newActions[i]}' WHERE number = ${i} AND is_primary = true;\n`;
}

// Сохраняем SQL скрипт
const fs = require('fs');
fs.writeFileSync('/Users/nikita/projects/hackyeah/update_actions.sql', sql);

console.log('SQL скрипт создан: update_actions.sql');
console.log(`Будет обновлено ${newActions.length} записей`);
console.log('Первые 10 действий:');
console.log(newActions.slice(0, 10));
