// Скрипт для обновления number_associations уникальными действиями из unique-action.ts
const fs = require('fs');
const { exec } = require('child_process');

console.log('🔄 Начинаем обновление действий из unique-action.ts...');

// Читаем файл unique-action.ts и извлекаем действия
function getActionsFromFile() {
  const content = fs.readFileSync('/Users/nikita/projects/hackyeah/BE/unique-action.ts', 'utf8');
  const actions = content.match(/'([^']+)'/g).map(s => s.slice(1, -1));
  
  console.log(`📊 Найдено ${actions.length} действий в файле`);
  
  // Проверяем на дубликаты
  const uniqueActions = [...new Set(actions)];
  console.log(`📊 Уникальных действий: ${uniqueActions.length}`);
  
  if (actions.length !== uniqueActions.length) {
    console.log('⚠️  Найдены дубликаты! Удаляем их...');
    return uniqueActions;
  }
  
  return actions;
}

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
async function updateWithUniqueActions() {
  try {
    const actions = getActionsFromFile();
    
    console.log('🔍 Проверяем текущее состояние базы данных...');
    
    // Проверяем количество записей
    const countResult = await executeSQL("SELECT COUNT(*) FROM number_associations WHERE is_primary = true;");
    console.log('📈 Текущее количество записей:', countResult.trim());
    
    // Обновляем каждую запись
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i].replace(/'/g, "''"); // Экранируем одинарные кавычки
      const sql = `UPDATE number_associations SET action = '${action}' WHERE number = ${i} AND is_primary = true;`;
      
      try {
        await executeSQL(sql);
        console.log(`✅ Обновлено действие для номера ${i}: "${actions[i]}"`);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении номера ${i}:`, error.message);
      }
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('🎉 Обновление завершено!');
    
    // Проверяем результат
    console.log('🔍 Проверяем результат...');
    const uniqueResult = await executeSQL("SELECT COUNT(DISTINCT action) as unique_actions, COUNT(action) as total_actions FROM number_associations WHERE is_primary = true;");
    console.log('📊 Результат после обновления:');
    console.log(uniqueResult);
    
    // Проверяем на дубликаты
    const duplicatesResult = await executeSQL("SELECT action, COUNT(*) FROM number_associations WHERE is_primary = true GROUP BY action HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC;");
    console.log('📊 Дубликаты после обновления:');
    console.log(duplicatesResult);
    
    // Показываем первые 10 обновленных записей
    const sampleResult = await executeSQL("SELECT number, action FROM number_associations WHERE is_primary = true ORDER BY number LIMIT 10;");
    console.log('📋 Первые 10 обновленных записей:');
    console.log(sampleResult);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error);
  }
}

// Запускаем обновление
updateWithUniqueActions();
