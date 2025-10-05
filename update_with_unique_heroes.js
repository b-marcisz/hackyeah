// Скрипт для обновления number_associations уникальными героями из unique-action.ts
const fs = require('fs');
const { exec } = require('child_process');

console.log('🔄 Начинаем обновление героев из unique-action.ts...');

// Читаем файл unique-action.ts и извлекаем объекты (которые станут героями)
function getHeroesFromFile() {
  const content = fs.readFileSync('/Users/nikita/projects/hackyeah/BE/unique-action.ts', 'utf8');
  const heroes = content.match(/"([^"]+)"/g).map(s => s.slice(1, -1));
  
  console.log(`📊 Найдено ${heroes.length} героев в файле`);
  
  // Проверяем на дубликаты
  const uniqueHeroes = [...new Set(heroes)];
  console.log(`📊 Уникальных героев: ${uniqueHeroes.length}`);
  
  if (heroes.length !== uniqueHeroes.length) {
    console.log('⚠️  Найдены дубликаты! Удаляем их...');
    return uniqueHeroes;
  }
  
  return heroes;
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
async function updateWithUniqueHeroes() {
  try {
    const heroes = getHeroesFromFile();
    
    console.log('🔍 Проверяем текущее состояние базы данных...');
    
    // Проверяем количество записей
    const countResult = await executeSQL("SELECT COUNT(*) FROM number_associations WHERE is_primary = true;");
    console.log('📈 Текущее количество записей:', countResult.trim());
    
    // Показываем текущие дубликаты героев
    console.log('🔍 Текущие дубликаты героев:');
    const duplicatesBefore = await executeSQL("SELECT hero, COUNT(*) FROM number_associations WHERE is_primary = true GROUP BY hero HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC;");
    console.log(duplicatesBefore);
    
    // Обновляем каждую запись
    for (let i = 0; i < heroes.length; i++) {
      const hero = heroes[i].replace(/'/g, "''"); // Экранируем одинарные кавычки
      const sql = `UPDATE number_associations SET hero = '${hero}' WHERE number = ${i} AND is_primary = true;`;
      
      try {
        await executeSQL(sql);
        console.log(`✅ Обновлен герой для номера ${i}: "${heroes[i]}"`);
      } catch (error) {
        console.error(`❌ Ошибка при обновлении номера ${i}:`, error.message);
      }
      
      // Небольшая пауза между запросами
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('🎉 Обновление завершено!');
    
    // Проверяем результат
    console.log('🔍 Проверяем результат...');
    const uniqueResult = await executeSQL("SELECT COUNT(DISTINCT hero) as unique_heroes, COUNT(hero) as total_heroes FROM number_associations WHERE is_primary = true;");
    console.log('📊 Результат после обновления:');
    console.log(uniqueResult);
    
    // Проверяем на дубликаты
    const duplicatesResult = await executeSQL("SELECT hero, COUNT(*) FROM number_associations WHERE is_primary = true GROUP BY hero HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC;");
    console.log('📊 Дубликаты после обновления:');
    console.log(duplicatesResult);
    
    // Показываем первые 10 обновленных записей
    const sampleResult = await executeSQL("SELECT number, hero FROM number_associations WHERE is_primary = true ORDER BY number LIMIT 10;");
    console.log('📋 Первые 10 обновленных записей:');
    console.log(sampleResult);
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении:', error);
  }
}

// Запускаем обновление
updateWithUniqueHeroes();
