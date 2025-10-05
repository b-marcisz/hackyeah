// Массив существующих действий в базе данных
const existingActions = [
  'bawi',
  'biega', 
  'buduje',
  'czyta',
  'gra',
  'je',
  'łapie',
  'lata',
  'liczy',
  'maluje',
  'pływa',
  'rzuca',
  'skacze',
  'śpi',
  'śpiewa',
  'strzela',
  'tańczy',
  'wspina'
];

// Функция для генерации уникальных действий
function generateUniqueActions() {
  // Список новых уникальных действий для детей (простые польские варианты, 1-2 слова)
  const possibleActions = [
    'klaszcze',
    'kręci się',
    'podskakuje',
    'macha',
    'uśmiecha się',
    'kopie',
    'rzuca piłkę',
    'chwyta piłkę',
    'zjeżdża',
    'skacze przez skakankę',
    'rysuje gwiazdę',
    'stawia wieżę',
    'czyta książkę',
    'pisze notatkę',
    'układa puzzle',
    'liczy koraliki',
    'sadzi nasionko',
    'podlewa roślinę',
    'karmi rybki',
    'głaszcze kota',
    'spaceruje z psem',
    'turla kostkę',
    'dmucha bańki',
    'przebija balon',
    'piecze ciasto',
    'miesza zupę',
    'próbuje zupę',
    'pije sok',
    'obiera owoc',
    'dzieli przekąskę',
    'pakuje plecak',
    'wiąże but',
    'zamyka kurtkę',
    'zapina koszulę',
    'macha flagą',
    'śpiewa głośno',
    'nuci melodię',
    'gwiżdże piosenkę',
    'kołysze się',
    'kręci wstążką',
    'maszeruje naprzód',
    'udaje pilota',
    'udaje lekarza',
    'udaje kucharza',
    'udaje nauczyciela',
    'udaje pirata',
    'udaje robota',
    'naśladuje zwierzę',
    'ryczy głośno',
    'miauczy delikatnie',
    'szczeka radośnie',
    'kwacze wesoło',
    'macha skrzydłami',
    'rozkłada ramiona',
    'balansuje na belce',
    'chodzi na palcach',
    'pochyla się',
    'siedzi po turecku',
    'klęka lekko',
    'sięga wysoko',
    'dotyka palców',
    'kręci bączkiem',
    'składa papier',
    'drze papier',
    'klei kształty',
    'koloruje obrazek',
    'wycina kształty',
    'rzuca woreczek',
    'raczkuje szybko',
    'przeskakuje skakankę',
    'skacze do tyłu',
    'skacze do przodu',
    'robi krok w bok',
    'kopie lekko',
    'podaje piłkę',
    'blokuje rzut',
    'pilnuje bramki',
    'jedzie na hulajnodze',
    'pedałuje na trójkołowcu',
    'płynie kajakiem',
    'wiosłuje łodzią',
    'puszcza latawiec',
    'odpala rakietę',
    'stawia most',
    'naprawia robota',
    'programuje grę',
    'testuje kod',
    'sortuje klocki',
    'układa kubki',
    'ustawia zabawki',
    'liczy monety',
    'dodaje liczby',
    'odejmuje liczby',
    'opowiada historię',
    'opowiada żart',
    'odgrywa scenkę',
    'rysuje mapę',
    'maluje tęczę',
    'miesza kolory',
    'myje ręce',
    'szczotkuje zęby',
    'czesze włosy',
    'nakleja naklejki',
    'podpisuje słoiki',
    'pakuje prezent',
    'otwiera prezent',
    'pisze list',
    'wysyła list',
    'odpowiada na zagadkę',
    'zadaje pytanie',
    'podąża za mapą',
    'znajduje skarb',
    'sadzi kwiaty',
    'podlewa ogród',
    'zbiera marchewki',
    'karmi ptaki',
    'śledzi gwiazdy',
    'dostrzega tęczę',
    'mierzy wzrost',
    'sprawdza puls',
    'liczy kroki',
    'wspina się po drabinie',
    'zsuwa się w dół',
    'celuje z łuku',
    'zbiera muszelki',
    'kolekcjonuje liście',
    'sortuje guziki',
    'potrząsa marakasami',
    'uderza w bęben',
    'gra na pianinie',
    'szarpie gitarę',
    'dmucha w trąbkę',
    'dzwoni dzwonkiem',
    'puszcza bączka',
    'zapala lampion',
    'składa serwetkę',
    'nakrywa do stołu',
    'podaje herbatę',
    'zamiata podłogę',
    'myje podłogę',
    'ściera kurz',
    'podlewa trawnik',
    'grabi liście',
    'buduje zamek z piasku',
    'kopie dół',
    'przesiewa piasek',
    'zbiera kamyki',
    'maluje twarz',
    'rysuje portret',
    'czyta wiersz',
  ];

  const availableActions = possibleActions.filter(action => !existingActions.includes(action));
  const uniqueAvailableActions = [...new Set(availableActions)];

  if (uniqueAvailableActions.length < 100) {
    throw new Error('Недостаточно уникальных действий для генерации 100 вариантов.');
  }

  for (let i = uniqueAvailableActions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueAvailableActions[i], uniqueAvailableActions[j]] = [uniqueAvailableActions[j], uniqueAvailableActions[i]];
  }

  return uniqueAvailableActions.slice(0, 100);
}

// Генерируем новые уникальные действия
const newActions = generateUniqueActions();

// Проверка на уникальность
function checkUniqueness() {
  const uniqueActions = [...new Set(newActions)];
  console.log(`Всего действий: ${newActions.length}`);
  console.log(`Уникальных действий: ${uniqueActions.length}`);
  console.log(`Дубликатов: ${newActions.length - uniqueActions.length}`);

  // Проверяем пересечения с существующими действиями
  const intersections = newActions.filter(action => existingActions.includes(action));
  console.log(`Пересечений с существующими: ${intersections.length}`);

  if (intersections.length > 0) {
    console.log('Найдены пересечения с существующими действиями:');
    console.log([...new Set(intersections)]);
  }

  if (newActions.length !== uniqueActions.length) {
    console.log('Найдены дубликаты:');
    const duplicates = newActions.filter((item, index) => newActions.indexOf(item) !== index);
    console.log([...new Set(duplicates)]);
  }

  // Выводим первые 10 действий для проверки
  console.log('Первые 10 новых действий:');
  console.log(newActions.slice(0, 10));
}

// Экспорт массивов
module.exports = {
  existingActions,
  newActions,
  checkUniqueness
};

// Проверка при запуске
checkUniqueness();
