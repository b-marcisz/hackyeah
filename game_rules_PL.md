# Zasady mini-gier i kontrakt BE ↔ UI

Dokument opisuje obecne API, strukturę encji i zasady interakcji frontendu z backendem dla trybów gier. Wszystkie przykłady podane są w formacie JSON; wartości `uuid` i znaczniki czasowe przedstawione są jako placeholdery.

## 1. Ogólny model `Game`

```json
{
  "id": "uuid",
  "type": "match_hao | memory_flash | speed_recall | number_story | association_duel",
  "number": 42,
  "status": "pending | in_progress | completed | failed",
  "difficulty": 1,
  "points": 0,
  "xp": 0,
  "state": {},
  "result": {},
  "feedback": [
    {
      "message": "string",
      "rating": 4,
      "createdAt": "ISO-8601"
    }
  ],
  "playerId": "uuid | null",
  "startedAt": "ISO-8601 | null",
  "completedAt": "ISO-8601 | null",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Podstawowe endpointy

| Działanie | Metoda | Ścieżka | Opis |
| --- | --- | --- | --- |
| Start gry | `POST` | `/api/games/start` | Inicjalizacja gry, zwraca utworzony obiekt `Game` |
| Odczyt stanu | `GET` | `/api/games/{id}` | Zwraca aktualny stan gry |
| Wysłanie odpowiedzi | `POST` | `/api/games/{id}/answer` | Waliduje odpowiedź, aktualizuje `result`, `status`, `points`, `xp` |
| Wynik końcowy | `GET` | `/api/games/{id}/result` | Zwraca wynik gry (analog `GET /api/games/{id}`) |
| Opinia zwrotna | `POST` | `/api/games/{id}/feedback` | Dodaje wpis do tablicy `feedback` |

### Ogólny kontrakt uruchomienia

```json
POST /api/games/start
{
  "type": "match_hao",
  "number": 42,          // opcjonalnie, jeśli podano — będzie użyta konkretna asocjacja
  "playerId": "uuid",   // opcjonalnie
  "difficulty": 2,       // 1-5, domyślnie 1
  "settings": {          // dowolne ustawienia, whitelisted przez DTO
    "memorizationTime": 6
  }
}
```

W odpowiedzi backend zwraca `Game`, w polu `state` znajduje się snapshot asocjacji (`association`) i dodatkowe dane specyficzne dla trybu.

Wysłanie odpowiedzi:

```json
POST /api/games/{id}/answer
{
  "answer": { ... },
  "timeSpentMs": 1400    // opcjonalnie, wpływa na bonus za szybkość
}
```

## 2. Match HAO (Hero / Action / Object)

### Zasady
- Gracz otrzymuje liczbę i powiązaną trójkę HAO.
- UI pokazuje karty kategorii (bohater, akcja, przedmiot); w MVP — po jednej karcie na kategorię.
- Zadaniem gracza jest dopasowanie elementów poprawnie. Odpowiedź uważana jest za prawidłową przy dokładnym dopasowaniu (bez uwzględniania wielkości liter i dodatkowych spacji).
- Przy pierwszej odpowiedzi gra kończy się (`completed` przy sukcesie, `failed` przy błędzie). Planowane jest rozszerzenie na kilka prób.

### BE ↔ UI
- `state` przy starcie zawiera:
  - `association`: `{ id, number, hero, action, object, explanation }`
  - `prompt`: string z podpowiedzią.
  - `categories`: obiekt z tablicami dostępnych kart; każda kategoria zawiera prawidłową odpowiedź i 0–3 losowych "dekoi", wybranych z innych asocjacji.
- `answer` od UI:

```json
{
  "hero": "Hero",
  "action": "Action",
  "object": "Object"
}
```

- `result.summary` zwraca flagi `isCorrect`, naliczone `points`, `xp`.
- UI powinien obsłużyć HTTP 400, jeśli odpowiedź zostanie wysłana po zakończeniu gry.

## 3. Memory Flash (Zapamiętaj i Odgadnij)

### Zasady
- Faza 1 (`memorizing`): gracz zapamiętuje scenę (bohater, akcja, przedmiot) w ograniczonym czasie (`memorizationTime`, domyślnie 5 sekund).
- Faza 2 (`comparing`): UI pokazuje zmienioną scenę i proponuje odgadnięcie, który element się różni.
- Odpowiedź jest poprawna tylko jeśli wskazany zostanie zmieniony element (`hero`, `action` lub `object`).
- Planowana jest logika generowania podobnych, ale różniących się elementów po stronie BE.

### BE ↔ UI
- `state` przy starcie:
  - `association`: podstawowa scena HAO.
  - `phase`: `memorizing`.
  - `memorizationTime`: liczba w sekundach.
  - `changedElement`: `'hero' | 'action' | 'object'` — który element zostanie zmieniony.
  - `originalScene` i `modifiedScene` — obiekty z polami `hero`, `action`, `object` (w `modifiedScene` wybrany element zastąpiony losowym dekoiem).
- UI musi uruchamiać timer i po upływie czasu przełączać fazę wyświetlania.
- Przy przejściu do fazy porównania UI albo żąda zmienionej sceny od BE (zostanie dodane), albo stosuje lokalne zmiany.
- `answer`:

```json
{
  "changedElement": "action"
}
```

- `result.summary.isCorrect` sygnalizuje, czy gracz odgadł.
- Po wysłaniu odpowiedzi backend przełącza `state.phase` na `completed` i zwraca `state.reveal` z `changedElement` i `modifiedScene` do podświetlenia różnic.
- W przyszłości odpowiedź może zawierać dodatkowe informacje (np. jakie działanie gracz uważa za prawidłowe).

## 4. Speed Recall (Szybkie przypomnienie)

### Zasady
- Graczowi wyświetlana jest liczba i asocjacja; cel — jak najszybciej odtworzyć elementy pamięci.
- Dozwolone są swobodne odpowiedzi (język naturalny). Odpowiedź uważana jest za prawidłową, jeśli zawiera przynajmniej jeden z elementów HAO.
- Planowane jest uwzględnienie liczby prób i progresji trudności.

### BE ↔ UI
- `state` przy starcie:
  - `association`
  - `prompt`: tekst typu "Przypomnij asocjację dla liczby 42"
  - `attempts`: liczba prób (domyślnie 0), przy każdej odpowiedzi zwiększana przez backend
- `answer`:

```json
{
  "recall": "Na 42 u mnie Bohater skacze przez Przedmiot"
}
```

- Backend wykonuje proste porównanie tekstowe (case-insensitive). W przyszłości planowane jest podłączenie NLP/AI do oceny jakości.
- UI może używać `timeSpentMs` do wyświetlania bonusów za szybkość.

## 5. Number Story (Stwórz historię dla liczby) — design

> Tryb gry w rozwoju; logika oceny AI jeszcze nie zaimplementowana.

### Zasady (plan)
- Gracz wybiera elementy HAO i tworzy historię, używając tych elementów.
- Backend zapisuje wybrane elementy i tekst historii, następnie inicjuje ocenę AI.
- Wynik zawiera punkty za logikę, zapamiętywalność i kreatywność, a także tekstową opinię zwrotną.

### Planowany kontrakt
- `POST /api/games/start` z `type = number_story` zwraca `state` z podstawową asocjacją i listą rekomendacji.
- `POST /api/games/{id}/elements` — zapisanie niestandardowego wyboru H/A/O.
- `POST /api/games/{id}/story` — wysłanie historii do oceny (wywołanie OpenAI).
- `GET /api/games/{id}/evaluation` — pobranie wyników AI (będzie rozszerzenie obecnego `/result`).

## 6. Association Duel (Solo Challenge) — design

> Tryb jeszcze nie zaimplementowany, opisane zasady służą jako orientacja. Wszystkie tryby gier przeznaczone są dla jednego gracza.

### Planowane zasady
- Gracz rywalizuje sam ze sobą albo z timerem, starając się jak najszybciej dopasować kombinacje HAO dla sekwencji liczb.
- Na końcu sesji pokazywane są sumaryczne punkty, czas i statystyka błędów.

### Planowany kontrakt
- `state` zawiera aktualną rundę, cel czasowy i historię poprzednich prób.
- Dodatkowe endpointy nie są wymagane; główny scenariusz realizowany przez istniejące `/start`, `/answer`, `/result`.
- `answer` zapisuje wybraną kombinację HAO gracza i czas reakcji.

## 7. Wysyłanie opinii zwrotnej

Ogólny kontrakt dla wszystkich trybów:

```json
POST /api/games/{id}/feedback
{
  "message": "Zrób podpowiedzi dla trudnych liczb",
  "rating": 5
}
```

- `message` obowiązkowy (minimalna długość — 1 znak).
- `rating` opcjonalny, 1–5.
- UI po udanym żądaniu pokazuje potwierdzenie i aktualizuje lokalną listę opinii z odpowiedzi backendu.

## 8. Błędy i obsługa statusów

- `404 Not Found` — gra lub asocjacja nie istnieją. UI powinien pokazać komunikat i zaproponować uruchomienie gry od nowa.
- `400 Bad Request` — naruszone zasady (powtórne wysłanie odpowiedzi, nieprawidłowy format `answer`, zbyt krótki `message`).
- `422` może zostać dodany później dla rozszerzonych scenariuszy walidacji.
- Wszystkie udane odpowiedzi zwracają zaktualizowany obiekt `Game`; UI powinien synchronizować lokalny stan z serwerowym.

## 9. Plan rozwoju

- Dodać obsługę kilku prób dla Match HAO i Memory Flash.
- Rozszerzyć `state` dla Memory Flash, żeby backend przesyłał zmienioną scenę.
- Wprowadzić streaks, codzienne bonusy i mnożniki trudności w `result.summary`.
- Przygotować testy e2e dla głównych happy-path scenariuszy w miarę stabilizacji API.
