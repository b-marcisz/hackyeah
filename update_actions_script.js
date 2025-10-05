// Скрипт для обновления действий в базе данных
// Каждый элемент массива newActions применяется к соответствующему номеру (0-99)

const { newActions } = require('./actions_mapping.js');
const { exec } = require('child_process');

console.log('🔄 Начинаем обновление действий в базе данных...');
console.log(`📊 Будет обновлено ${newActions.length} записей`);

// Функция для выполнения SQL команды
function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const command = `docker exec postgres-cards psql -U postgres -d postgres -c "${sql}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Основная функция обновления
async function updateActions() {
  try {
    console.log('🔍 Проверяем текущее состояние базы данных...');
    
    // Проверяем количество записей
    const countResult = await executeSQL("SELECT COUNT(*) FROM number_associations WHERE is_primary = true;");
    console.log('📈 Текущее количество записей:', countResult.trim());
    
    // Обновляем каждую запись
    for (let i = 0; i < newActions.length; i++) {
      const action = newActions[i].replace(/'/g, "''"); // Экранируем одинарные кавычки
      const sql = `UPDATE number_associations SET action = '${action}' WHERE number = ${i} AND is_primary = true;`;
      
      try {
        await executeSQL(sql);
        console.log(`✅ Обновлено действие для номера ${i}: "${newActions[i]}"`);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении номера ${i}:`, error.message);
      }
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🎉 Обновление завершено!');
    
    // Проверяем результат
    console.log('🔍 Проверяем результат...');
    const result = await executeSQL("SELECT action, COUNT(*) FROM number_associations WHERE is_primary = true GROUP BY action HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC;");
    console.log('📊 Дубликаты после обновления:');
    console.log(result);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error);
  }
}

// Запускаем обновление
updateActions();
