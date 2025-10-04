# Number Association API - Lista endpointów

## 🔢 **Number Association API**

### **1. Generowanie asocjacji**

#### POST `/number-associations/:number/generate`
- **Opis**: Generuje nową asocjację dla konkretnej liczby
- **Parametry**: 
  - `number` (w URL) - liczba od 0 do 99
- **Odpowiedź**: `NumberAssociation`
- **Przykład**: `POST /number-associations/42/generate`

#### POST `/number-associations/generate-all`
- **Opis**: Generuje asocjacje dla wszystkich liczb 0-99 (tylko brakujące)
- **Odpowiedź**: `{message: string, count: number}`
- **Przykład**: `POST /number-associations/generate-all`

### **2. Pobieranie asocjacji**

#### GET `/number-associations/:number`
- **Opis**: Pobiera główną asocjację dla konkretnej liczby
- **Parametry**: 
  - `number` (w URL) - liczba od 0 do 99
- **Odpowiedź**: `NumberAssociation` lub 404
- **Przykład**: `GET /number-associations/42`

#### GET `/number-associations/all/primary`
- **Opis**: Pobiera wszystkie główne asocjacje (0-99)
- **Odpowiedź**: `NumberAssociation[]`
- **Przykład**: `GET /number-associations/all/primary`

### **3. Ocena asocjacji**

#### POST `/number-associations/:id/rate`
- **Opis**: Ocenia istniejącą asocjację
- **Parametry**: 
  - `id` (w URL) - ID asocjacji
- **Ciało żądania**: `{"rating": 5}`
- **Odpowiedź**: `NumberAssociation`
- **Przykład**: `POST /number-associations/1/rate`

### **4. Zarządzanie duplikatami**

#### POST `/number-associations/check-duplicates`
- **Opis**: Sprawdza i usuwa duplikaty według hero/action/object
- **Odpowiedź**: 
  ```json
  {
    "duplicates": [
      {
        "number": 5,
        "hero": "Superman",
        "action": "flies",
        "object": "sky"
      }
    ],
    "regenerated": [15, 23, 45],
    "message": "Found 1 duplicate patterns, regenerated 3 associations"
  }
  ```
- **Przykład**: `POST /number-associations/check-duplicates`

---

## 📊 **Struktura danych**

### NumberAssociation
```typescript
{
  id: number;                    // Unikalny ID
  number: number;                // Liczba (0-99)
  hero: string;                  // Bohater
  action: string;                // Akcja
  object: string;                // Przedmiot
  explanation: string;           // Wyjaśnienie
  is_primary: boolean;           // Główna asocjacja
  rating: number;                // Średnia ocena
  total_votes: number;           // Liczba ocen
  created_at: Date;              // Data utworzenia
}
```

---

## 🎯 **Przykłady użycia**

### Komendy cURL

#### Generowanie asocjacji dla liczby 42:
```bash
curl -X POST http://localhost:3000/number-associations/42/generate
```

#### Pobieranie wszystkich asocjacji:
```bash
curl http://localhost:3000/number-associations/all/primary
```

#### Ocena asocjacji:
```bash
curl -X POST http://localhost:3000/number-associations/1/rate \
  -H "Content-Type: application/json" \
  -d '{"rating": 5}'
```

#### Generowanie wszystkich brakujących asocjacji:
```bash
curl -X POST http://localhost:3000/number-associations/generate-all
```

#### Usuwanie duplikatów:
```bash
curl -X POST http://localhost:3000/number-associations/check-duplicates
```

---

## 🔧 **Konfiguracja**

### Zmienne środowiskowe
- `baseUrl`: http://localhost:3000
- `OPEN_API_BASE_URL`: URL dla OpenAI API
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: Ustawienia bazy danych

### Nagłówki
- `Content-Type: application/json` (dla żądań POST)

---

## 📝 **Uwagi**

- Wszystkie asocjacje są generowane w języku polskim
- Duplikaty są wyszukiwane według każdej części osobno (hero, action, object)
- Ocena powinna być od 1 do 5
- API automatycznie ustawia `is_primary = true` dla nowych asocjacji
