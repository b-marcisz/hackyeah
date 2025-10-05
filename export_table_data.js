// Скрипт для экспорта текущего состояния таблицы number_associations
const fs = require('fs');
const { exec } = require('child_process');

console.log('🔄 Экспортируем текущее состояние таблицы...');

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

// Основная функция экспорта
async function exportTableData() {
  try {
    console.log('🔍 Получаем данные из таблицы...');
    
    // Получаем все записи с is_primary = true
    const dataResult = await executeSQL(`
      SELECT number, hero, action, object, explanation, is_primary, rating, total_votes, created_at 
      FROM number_associations 
      WHERE is_primary = true 
      ORDER BY number;
    `);
    
    console.log('📊 Данные получены, обрабатываем...');
    
    // Парсим результат
    const lines = dataResult.split('\n');
    const dataLines = lines.filter(line => line.includes('|') && !line.includes('number'));
    
    let sqlContent = `-- Экспорт таблицы number_associations
-- Дата создания: ${new Date().toISOString()}
-- Все записи с is_primary = true

-- Создание таблицы (если не существует)
CREATE TABLE IF NOT EXISTS number_associations (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    hero VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    object VARCHAR(255) NOT NULL,
    explanation TEXT,
    is_primary BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление уникальных ограничений
ALTER TABLE number_associations ADD CONSTRAINT IF NOT EXISTS unique_hero UNIQUE (hero);
ALTER TABLE number_associations ADD CONSTRAINT IF NOT EXISTS unique_action UNIQUE (action);
ALTER TABLE number_associations ADD CONSTRAINT IF NOT EXISTS unique_object UNIQUE (object);

-- Вставка всех текущих записей
INSERT INTO number_associations (number, hero, action, object, explanation, is_primary, rating, total_votes, created_at) VALUES
`;

    const values = [];
    
    dataLines.forEach(line => {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 9) {
        const number = parts[0];
        const hero = parts[1].replace(/'/g, "''");
        const action = parts[2].replace(/'/g, "''");
        const object = parts[3].replace(/'/g, "''");
        const explanation = parts[4] ? parts[4].replace(/'/g, "''") : '';
        const is_primary = parts[5] === 't';
        const rating = parts[6] || '0.00';
        const total_votes = parts[7] || '0';
        const created_at = parts[8] || 'CURRENT_TIMESTAMP';
        
        values.push(`(${number}, '${hero}', '${action}', '${object}', '${explanation}', ${is_primary}, ${rating}, ${total_votes}, '${created_at}')`);
      }
    });
    
    sqlContent += values.join(',\n') + ';\n';
    
    // Сохраняем в файл
    fs.writeFileSync('/Users/nikita/projects/hackyeah/export_current_table.sql', sqlContent);
    
    console.log('✅ SQL файл создан: export_current_table.sql');
    console.log(`📊 Экспортировано ${values.length} записей`);
    
    // Показываем статистику
    const statsResult = await executeSQL(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT hero) as unique_heroes,
        COUNT(DISTINCT action) as unique_actions,
        COUNT(DISTINCT object) as unique_objects
      FROM number_associations 
      WHERE is_primary = true;
    `);
    
    console.log('📈 Статистика таблицы:');
    console.log(statsResult);
    
  } catch (error) {
    console.error('❌ Ошибка при экспорте:', error);
  }
}

// Запускаем экспорт
exportTableData();
