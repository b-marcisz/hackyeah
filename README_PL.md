# 🧠 Projekt Assential — System treningu pamięci przez asocjacje

## Opis

Projekt ma na celu pomoc użytkownikom w szybkim i trwałym zapamiętywaniu liczb od 0 do 99 za pomocą wizualnego systemu asocjacyjnego "Bohater — Akcja — Przedmiot" (Hero–Action–Object, lub HAO).
Każda liczba (0–99) będzie miała jedną lub więcej asocjacji HAO, opartych na znanych obrazach, logice i wzorcach kulturowych.

### ▶️ Główne komponenty:
- **Backend** w NestJS z PostgreSQL do przechowywania, przetwarzania i oceny asocjacji
- **Telegram-bot** do codziennego treningu i oceny jakości zapamiętywania
- **Aplikacja mobilna** (iOS/Android) — trener z kartami, postępem i gamifikacją
- **Badania**: wybór najlepszych asocjacji przez AI (ChatGPT), oparty na wielokrotnych iteracjach generacji i opiniach użytkowników

### 📦 Struktura tabeli number_associations:
- `number`: liczba całkowita (0–99)
- `hero`, `action`, `object`: komponenty asocjacji
- `explanation`: wyjaśnienie logiki powiązania
- `is_primary`: flaga boolowska — czy ta asocjacja jest główna dla liczby
- `rating`, `total_votes`: zagregowane oceny użytkowników

### Ograniczenia:
- Dla jednej liczby może być tylko jedna asocjacja z `is_primary = true`.
  Jest to realizowane przez częściowy unikalny indeks:
  ```sql
  CREATE UNIQUE INDEX unique_primary_number
  ON number_associations (number)
  WHERE is_primary = TRUE;
  ```

### 📊 Zadania:
- Generowanie kilku wariantów asocjacji na każdą liczbę za pomocą GPT
- Zbieranie opinii użytkowników przez Telegram-bota i aplikację mobilną
- Stopniowe wykrywanie "optymalnych" asocjacji, używając głosowania i analityki

### 🧪 Inspiracją była książka "Newton chodzi po Księżycu" — chcemy stworzyć nie tylko bazę, ale uruchomić świadome badanie wyboru asocjacji, jakby "wszechświat sam wybierał idealne powiązania".

---

## Autorzy
- **Andronov Mykyta** - [LinkedIn](https://www.linkedin.com/home/?originalSubdomain=pl)
- **Andrii** - [LinkedIn](https://www.linkedin.com/home/?originalSubdomain=pl)

## Konfiguracja projektu

```bash
$ npm install
```

## Kompilacja i uruchomienie projektu

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Uruchamianie testów

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Wdrożenie

Projekt jest gotowy do demonstracji i wymaga drobnych poprawek przed wdrożeniem produkcyjnym.

## Licencja

Nest jest licencjonowany na [MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
