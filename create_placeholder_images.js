// Скрипт для создания заглушек изображений локально
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🔄 Создаем заглушки изображений локально...');

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

// Создание структуры папок
function createDirectories() {
  const dirs = ['images/heroes', 'images/actions', 'images/objects'];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Создана папка: ${dir}`);
    }
  });
}

// Создание SVG изображения
function createSVGImage(text, type, number) {
  const colors = {
    hero: '#FF6B6B',
    action: '#4ECDC4', 
    object: '#45B7D1'
  };
  
  const bgColor = colors[type] || '#95A5A6';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="${bgColor}" rx="10"/>
  <text x="150" y="120" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">
    ${text}
  </text>
  <text x="150" y="150" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">
    ${type.toUpperCase()}
  </text>
  <text x="150" y="180" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="white">
    #${number}
  </text>
</svg>`;
}

// Основная функция
async function createPlaceholderImages() {
  try {
    console.log('🔍 Получаем данные из базы данных...');
    
    // Получаем все записи
    const dataResult = await executeSQL(`
      SELECT number, hero, action, object 
      FROM number_associations 
      WHERE is_primary = true 
      ORDER BY number;
    `);
    
    // Парсим результат
    const lines = dataResult.split('\n');
    const dataLines = lines.filter(line => line.includes('|') && !line.includes('number'));
    
    console.log(`📊 Найдено ${dataLines.length} записей для обработки`);
    
    // Создаем папки
    createDirectories();
    
    let processed = 0;
    
    for (const line of dataLines) {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 4) {
        const number = parts[0];
        const hero = parts[1];
        const action = parts[2];
        const object = parts[3];
        
        console.log(`\n🎯 Создаем изображения для номера ${number}:`);
        console.log(`   Hero: ${hero}`);
        console.log(`   Action: ${action}`);
        console.log(`   Object: ${object}`);
        
        try {
          // Создание SVG для героя
          const heroSVG = createSVGImage(hero, 'hero', number);
          const heroPath = `images/heroes/${number}_${hero.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
          fs.writeFileSync(heroPath, heroSVG);
          console.log(`   ✅ Hero SVG создан: ${heroPath}`);
          
          // Создание SVG для действия
          const actionSVG = createSVGImage(action, 'action', number);
          const actionPath = `images/actions/${number}_${action.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
          fs.writeFileSync(actionPath, actionSVG);
          console.log(`   ✅ Action SVG создан: ${actionPath}`);
          
          // Создание SVG для объекта
          const objectSVG = createSVGImage(object, 'object', number);
          const objectPath = `images/objects/${number}_${object.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
          fs.writeFileSync(objectPath, objectSVG);
          console.log(`   ✅ Object SVG создан: ${objectPath}`);
          
          processed++;
          
        } catch (error) {
          console.error(`   ❌ Ошибка при создании изображений для номера ${number}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Создание завершено! Обработано ${processed} записей`);
    
    // Показываем статистику
    const heroFiles = fs.readdirSync('images/heroes').length;
    const actionFiles = fs.readdirSync('images/actions').length;
    const objectFiles = fs.readdirSync('images/objects').length;
    
    console.log(`\n📊 Статистика созданных файлов:`);
    console.log(`   Heroes: ${heroFiles} файлов`);
    console.log(`   Actions: ${actionFiles} файлов`);
    console.log(`   Objects: ${objectFiles} файлов`);
    
    // Показываем примеры созданных файлов
    console.log(`\n📋 Примеры созданных файлов:`);
    console.log(`   Heroes: ${fs.readdirSync('images/heroes').slice(0, 3).join(', ')}`);
    console.log(`   Actions: ${fs.readdirSync('images/actions').slice(0, 3).join(', ')}`);
    console.log(`   Objects: ${fs.readdirSync('images/objects').slice(0, 3).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Ошибка при создании изображений:', error);
  }
}

// Запускаем создание
createPlaceholderImages();
