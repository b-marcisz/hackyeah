// Скрипт для поиска и скачивания изображений для hero, action, object
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

console.log('🔄 Начинаем поиск и скачивание изображений...');

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

// Функция для поиска изображений через Google Custom Search API
async function searchImages(query, type) {
  const searchQuery = encodeURIComponent(query);
  const url = `https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_SEARCH_ENGINE_ID&q=${searchQuery}&searchType=image&num=1&safe=active`;
  
  // Пока используем заглушку - в реальности нужен Google Custom Search API
  console.log(`🔍 Поиск изображения для "${query}" (${type})`);
  
  // Возвращаем заглушку URL
  return `https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=${encodeURIComponent(query)}`;
}

// Функция для скачивания изображения
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Удаляем файл при ошибке
      reject(err);
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

// Основная функция
async function downloadAllImages() {
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
        
        console.log(`\n🎯 Обрабатываем номер ${number}:`);
        console.log(`   Hero: ${hero}`);
        console.log(`   Action: ${action}`);
        console.log(`   Object: ${object}`);
        
        try {
          // Поиск и скачивание изображения для героя
          const heroUrl = await searchImages(`${hero} Disney character`, 'hero');
          const heroPath = `images/heroes/${number}_${hero.toLowerCase().replace(/\s+/g, '_')}.jpg`;
          await downloadImage(heroUrl, heroPath);
          console.log(`   ✅ Hero изображение сохранено: ${heroPath}`);
          
          // Поиск и скачивание изображения для действия
          const actionUrl = await searchImages(`${action} action icon`, 'action');
          const actionPath = `images/actions/${number}_${action.toLowerCase().replace(/\s+/g, '_')}.jpg`;
          await downloadImage(actionUrl, actionPath);
          console.log(`   ✅ Action изображение сохранено: ${actionPath}`);
          
          // Поиск и скачивание изображения для объекта
          const objectUrl = await searchImages(`${object} toy object`, 'object');
          const objectPath = `images/objects/${number}_${object.toLowerCase().replace(/\s+/g, '_')}.jpg`;
          await downloadImage(objectUrl, objectPath);
          console.log(`   ✅ Object изображение сохранено: ${objectPath}`);
          
          processed++;
          
          // Пауза между запросами
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          console.error(`   ❌ Ошибка при обработке номера ${number}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Обработка завершена! Обработано ${processed} записей`);
    
    // Показываем статистику
    const heroFiles = fs.readdirSync('images/heroes').length;
    const actionFiles = fs.readdirSync('images/actions').length;
    const objectFiles = fs.readdirSync('images/objects').length;
    
    console.log(`\n📊 Статистика скачанных файлов:`);
    console.log(`   Heroes: ${heroFiles} файлов`);
    console.log(`   Actions: ${actionFiles} файлов`);
    console.log(`   Objects: ${objectFiles} файлов`);
    
  } catch (error) {
    console.error('❌ Ошибка при скачивании изображений:', error);
  }
}

// Запускаем скачивание
downloadAllImages();
