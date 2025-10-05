// Скрипт для обновления героев правильными детскими персонажами
const fs = require('fs');
const { exec } = require('child_process');

console.log('🔄 Обновляем героев правильными детскими персонажами...');

// Список детских персонажей
const bohaterowieDlaDzieci = [
  "Myszka Miki",
  "Kubuś Puchatek", 
  "Prosiaczek",
  "Tygrysek",
  "Kłapouchy",
  "Król Lew Simba",
  "Nala z Króla Lwa",
  "Rafiki z Króla Lwa",
  "Timon",
  "Pumba",
  "Elsa z Krainy Lodu",
  "Anna z Krainy Lodu",
  "Olaf",
  "Kristoff",
  "Sven",
  "Ariel z Małej Syrenki",
  "Sebastian z Małej Syrenki",
  "Florek (rybka z Małej Syrenki)",
  "Złotowłosa",
  "Kopciuszek",
  "Śpiąca Królewna",
  "Królewna Śnieżka",
  "Książę z Bajki",
  "Bella z Pięknej i Bestii",
  "Bestia",
  "Alicja z Krainy Czarów",
  "Cheshire Kot",
  "Biała Królowa",
  "Królowa Kier",
  "Pinokio",
  "Geppetto",
  "Dżepetto",
  "Jiminy Świerszcz",
  "Bambi",
  "Thumper (Kłapouchy królik z Bambi)",
  "Dumbo",
  "Myszka Minnie",
  "Kaczor Donald",
  "Kaczka Daisy",
  "Goofy",
  "Pluto",
  "Zygzak McQueen",
  "Złomek z Aut",
  "Buzz Astral z Toy Story",
  "Woody z Toy Story",
  "Jessie z Toy Story",
  "Rex z Toy Story",
  "Mr. Potato Head",
  "Barbie z Toy Story",
  "Forky",
  "SpongeBob Kanciastoporty",
  "Patryk Rozgwiazda",
  "Pan Krab",
  "Skalmarek",
  "Sandy Pysia",
  "Dora poznaje świat",
  "Butek (małpka Dory)",
  "Diego (kuzyn Dory)",
  "Świnka Peppa",
  "George (brat Peppy)",
  "Mama Świnka",
  "Tata Świnka",
  "Rebeka Królik",
  "Suzy Owca",
  "Marta z Marta mówi",
  "Franklin żółw",
  "Mała Mi z Muminków",
  "Muminek",
  "Panna Migotka",
  "Ryjek",
  "Włóczykij",
  "Pocahontas",
  "Mulan",
  "Vaiana (Moana)",
  "Maui z Moany",
  "Baloo z Księgi Dżungli",
  "Bagheera",
  "Mowgli",
  "Shere Khan",
  "Kung Fu Panda Po",
  "Tigress",
  "Shifu",
  "Pingwiny z Madagaskaru",
  "Król Julian",
  "Maurice",
  "Mort",
  "Minionek Bob",
  "Minionek Kevin",
  "Minionek Stuart",
  "Gru",
  "Shrek",
  "Fiona",
  "Osioł",
  "Kot w Butach",
  "Czerwony Kapturek",
  "Wilk",
  "Trzy Świnki",
  "Kłapouchy (z Kubusia Puchatka)",
  "Nemo z Gdzie jest Nemo",
  "Dory z Gdzie jest Nemo",
  "Marlin (tata Nemo)",
  "Pikachu",
  "Ash Ketchum"
];

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
async function updateHeroesWithChildrenCharacters() {
  try {
    console.log(`📊 Найдено ${bohaterowieDlaDzieci.length} детских персонажей`);
    
    // Проверяем уникальность
    const uniqueHeroes = [...new Set(bohaterowieDlaDzieci)];
    console.log(`📊 Уникальных персонажей: ${uniqueHeroes.length}`);
    
    if (bohaterowieDlaDzieci.length !== uniqueHeroes.length) {
      console.log('⚠️  Найдены дубликаты в списке персонажей!');
    }
    
    console.log('🔍 Проверяем текущее состояние базы данных...');
    
    // Проверяем количество записей
    const countResult = await executeSQL("SELECT COUNT(*) FROM number_associations WHERE is_primary = true;");
    console.log('📈 Текущее количество записей:', countResult.trim());
    
    // Показываем текущие дубликаты героев
    console.log('🔍 Текущие дубликаты героев:');
    const duplicatesBefore = await executeSQL("SELECT hero, COUNT(*) FROM number_associations WHERE is_primary = true GROUP BY hero HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC;");
    console.log(duplicatesBefore);
    
    // Обновляем каждую запись
    for (let i = 0; i < Math.min(bohaterowieDlaDzieci.length, 100); i++) {
      const hero = bohaterowieDlaDzieci[i].replace(/'/g, "''"); // Экранируем одинарные кавычки
      const sql = `UPDATE number_associations SET hero = '${hero}' WHERE number = ${i} AND is_primary = true;`;
      
      try {
        await executeSQL(sql);
        console.log(`✅ Обновлен герой для номера ${i}: "${bohaterowieDlaDzieci[i]}"`);
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
updateHeroesWithChildrenCharacters();
