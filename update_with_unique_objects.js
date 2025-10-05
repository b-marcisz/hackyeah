// Скрипт для обновления number_associations уникальными объектами из unique-action.ts
const fs = require('fs');
const { exec } = require('child_process');

console.log('🔄 Начинаем обновление объектов из unique-action.ts...');

// Читаем файл unique-action.ts и извлекаем объекты
function getObjectsFromFile() {
  const content = fs.readFileSync('/Users/nikita/projects/hackyeah/BE/unique-action.ts', 'utf8');
  const objects = content.match(/"([^"]+)"/g).map(s => s.slice(1, -1));
  
  console.log(`📊 Найдено ${objects.length} объектов в файле`);
  
  // Проверяем на дубликаты
  const uniqueObjects = [...new Set(objects)];
  console.log(`📊 Уникальных объектов: ${uniqueObjects.length}`);
  
  if (objects.length !== uniqueObjects.length) {
    console.log('⚠️  Найдены дубликаты! Удаляем их...');
    return uniqueObjects;
  }
  
  return objects;
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
async function updateWithUniqueObjects() {
  try {
    const objects = getObjectsFromFile();
    
    console.log('🔍 Проверяем текущее состояние базы данных...');
    
    // Проверяем количество записей
    const countResult = await executeSQL("SELECT COUNT(*) FROM number_associations WHERE is_primary = true;");
    console.log('📈 Текущее количество записей:', countResult.trim());
    
    // Обновляем каждую запись
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i].replace(/'/g, "''"); // Экранируем одинарные кавычки
      const sql = `UPDATE number_associations SET object = '${object}' WHERE number = ${i} AND is_primary = true;`;
      
      try {
        await executeSQL(sql);
        console.log(`✅ Обновлен объект для номера ${i}: "${objects[i]}"`);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении номера ${i}:`, error.message);
      }
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('🎉 Обновление завершено!');
    
    // Проверяем результат
    console.log('🔍 Проверяем результат...');
    const uniqueResult = await executeSQL("SELECT COUNT(DISTINCT object) as unique_objects, COUNT(object) as total_objects FROM number_associations WHERE is_primary = true;");
    console.log('📊 Результат после обновления:');
    console.log(uniqueResult);
    
    // Проверяем на дубликаты
    const duplicatesResult = await executeSQL("SELECT object, COUNT(*) FROM number_associations WHERE is_primary = true GROUP BY object HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC;");
    console.log('📊 Дубликаты после обновления:');
    console.log(duplicatesResult);
    
    // Показываем первые 10 обновленных записей
    const sampleResult = await executeSQL("SELECT number, object FROM number_associations WHERE is_primary = true ORDER BY number LIMIT 10;");
    console.log('📋 Первые 10 обновленных записей:');
    console.log(sampleResult);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error);
  }
}

// Запускаем обновление
updateWithUniqueObjects();
