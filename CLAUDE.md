# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a HackYeah project repository containing educational games for children aged 4-6 years.

```
hackyeah/
├── memory/
│   ├── vue/
│   │   └── v1/          # Vue 2.7 memory game (legacy)
│   └── react/
│       └── v2/          # React Native (Expo) - MAIN APPLICATION
│           ├── App.tsx                    # Main app navigation
│           ├── src/
│           │   ├── screens/
│           │   │   ├── ProfileSelection.tsx    # Profile selection screen
│           │   │   ├── GameDashboard.tsx       # Game selection dashboard
│           │   │   ├── PinEntry.tsx            # PIN entry (1111)
│           │   │   ├── AdminPanel.tsx          # Admin settings & add profile
│           │   │   └── TimeLimitReached.tsx    # Time limit notification
│           │   ├── games/
│           │   │   └── MemoryGame.tsx          # Memory card game
│           │   └── hooks/
│           │       └── useGamepad.ts           # Gamepad controller hook
│           ├── assets/
│           │   ├── bg.png                      # Background image
│           │   ├── memo-tiles.png              # Memory game sprite sheet
│           │   └── memory/
│           │       ├── memory.png              # Memory game icon
│           │       └── memory-loss.png         # Memory Less game icon
│           ├── babel.config.js
│           ├── app.json
│           └── package.json
└── README.md
```

## Development Commands

All commands should be run from the `memory/react/v2/` directory:

- **Start web**: `npm run web`
- **Start Android**: `npm run android`
- **Start iOS**: `npm run ios`
- **Start Expo**: `npx expo start`

## Architecture

### React Native Educational App (TypeScript + Expo)

**Target Audience**: Children aged 4-6 years
**Platform**: Tablets (landscape/portrait responsive)
**Controllers**: GameSir gamepad support + keyboard navigation

#### Screen Flow
```
ProfileSelection
  ├─> [Select Profile] ─> GameDashboard ─> Games (Memory, Memory Less)
  ├─> [⚙️ Settings] ─> PinEntry (1111) ─> AdminPanel (Settings tab)
  └─> [➕ Add Profile] ─> PinEntry (1111) ─> AdminPanel (Add Profile tab)

Games ─> [Time Limit] ─> TimeLimitReached ─> ProfileSelection
```

#### Key Components

**ProfileSelection** (`src/screens/ProfileSelection.tsx`)
- Display child profiles with user avatars
- Settings icon (⚙️) - top left
- Add profile button
- Mock profiles: Kasia, Tomek

**GameDashboard** (`src/screens/GameDashboard.tsx`)
- Game tiles with PNG icons (no text for children who can't read)
- Horizontal scroll in landscape
- Back button with FontAwesome arrow-left
- Current games: Memory, Memory Less

**PinEntry** (`src/screens/PinEntry.tsx`)
- PIN: **1111**
- Number pad (0-9)
- Visual dots showing entered digits
- Auto-validate on 4 digits
- Backspace button (arrow-left icon)
- Responsive landscape layout (left: title/dots, right: keypad)

**AdminPanel** (`src/screens/AdminPanel.tsx`)
- **Tabs**: Settings | Add Profile
- **Settings Tab**:
  - Toggle time limits per profile
  - Time options: 15, 30, 45, 60, 90, 120 minutes/day
  - Visual switches and buttons
- **Add Profile Tab**:
  - Name input (max 20 chars)
  - Color picker (6 colors with checkmark selection)
  - Live preview
  - Add button (disabled if no name)

**MemoryGame** (`src/games/MemoryGame.tsx`)
- 8 pairs (16 tiles)
- Responsive: Portrait 4x4, Landscape 2x8
- Sprite sheet rendering (`assets/memo-tiles.png`)
- Top bar: moves counter + restart button (refresh icon)
- Gamepad/keyboard navigation
- Halloween theme background
- Status bar hidden

**TimeLimitReached** (`src/screens/TimeLimitReached.tsx`)
- Clock icon with message
- 5-second countdown auto-redirect
- Manual "Return now" button
- Shows profile name

#### Design Guidelines

**For Children (4-6 years)**:
- ✅ Minimal text - use icons and images
- ✅ Large, colorful buttons and tiles
- ✅ Simple, clear navigation
- ✅ Visual feedback (colors, animations)
- ❌ No complex forms or long text

**Responsive**:
- Portrait: vertical layouts, larger tiles
- Landscape: horizontal layouts, compact spacing
- Dynamic sizing based on `useWindowDimensions()`

**Controllers**:
- GameSir gamepad via Web Gamepad API
- Keyboard arrow keys + Enter/Space
- Touch/click support
- Polling interval: 150ms

## Implementation Status

### ✅ Completed Features

**Phase 1: Profile Selection**
- ✅ Netflix-style profile selection
- ✅ Child profiles with user avatars
- ✅ Settings icon (gear) - access to admin panel
- ✅ Add profile functionality

**Phase 2: Game Dashboard**
- ✅ Game selection tiles (PNG icons, no text)
- ✅ Horizontal scroll in landscape
- ✅ Back to profiles navigation
- ✅ 2 games: Memory, Memory Less

**Phase 3: Admin Panel**
- ✅ PIN authentication (1111)
- ✅ Time limit settings per profile
- ✅ Add new profile interface
- ✅ Tab navigation (Settings | Add Profile)

**Phase 4: Games**
- ✅ Memory game (sprite sheet based)
- ✅ Responsive layouts (portrait/landscape)
- ✅ Gamepad/keyboard support
- ✅ Time limit notification screen

### 🚧 To Do

- [ ] Implement Memory Less game
- [ ] Persist profiles to AsyncStorage
- [ ] Track actual play time per profile
- [ ] Enforce time limits in games
- [ ] Add more games (Puzzle, Math, Colors)
- [ ] Parent profile with extended permissions

### Tech Stack
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: State-based (no react-navigation)
- **Styling**: StyleSheet (no CSS frameworks)
- **Icons**: @expo/vector-icons (FontAwesome)
- **Storage**: AsyncStorage (planned)
- **Controllers**: Web Gamepad API + Keyboard

### Important Notes
- **Target age**: 4-6 years old children
- **Minimal text**: Use icons and images instead
- **Responsive**: Both portrait and landscape
- **PIN**: 1111 for all admin access

## Backend API Integration

### API Base URL
- Development: `http://localhost:4000`
- Swagger Docs: `http://localhost:4000/api/docs`

### Available Endpoints

#### **Accounts** (`/accounts`)
- `GET /accounts/{accountName}` - Get account by name with users
  - Response: `AccountDto { id: string, users: UserDto[] }`
- `POST /accounts` - Create new account
  - Body: `CreateAccountDto { name: string, code: string }`
  - Response: `AccountDto`
- `POST /accounts/{accountName}/users` - Add user to account
  - Headers: `Authorization: Bearer {token}` (required)
  - Body: `CreateUserDto { name: string, role: 'admin' | 'user', age?: number, color?: 'pinkPurple' | 'blue' | 'green' | 'pink' | 'orange' | 'lavender', settings: { timeLimit: number } }`
  - Response: `CreateUserDto`
  - Security: Bearer token required
  - Errors: `403 Unauthorized`

#### **Games** (`/api/games`)
- `POST /api/games/start` - Start a new game
  - Body: `StartGameDto { type: GameType, number?: number, playerId?: string, difficulty?: number (1-5), settings?: object }`
  - GameType: `'match_hao' | 'memory_flash' | 'number_story' | 'speed_recall' | 'association_duel'`
  - Response: `201 Created` - Game started successfully
  - Errors: `400 Bad request`
- `GET /api/games/{id}` - Get game by UUID
  - Parameters: `id` (Game UUID)
  - Response: `200 OK` - Game retrieved successfully
  - Errors: `404 Game not found`
- `POST /api/games/{id}/answer` - Submit answer for a game
  - Parameters: `id` (Game UUID)
  - Body: `SubmitAnswerDto { answer: object, timeSpentMs?: number }`
  - Response: `200 OK` - Answer submitted successfully
  - Errors: `400 Bad request`, `404 Game not found`
- `GET /api/games/{id}/result` - Get game result
  - Parameters: `id` (Game UUID)
  - Response: `200 OK` - Game result retrieved successfully
  - Errors: `404 Game not found`
- `POST /api/games/{id}/feedback` - Submit feedback for a game
  - Parameters: `id` (Game UUID)
  - Body: `SubmitFeedbackDto { message: string (min 1 char), rating?: number (1-5) }`
  - Response: `200 OK` - Feedback submitted successfully
  - Errors: `400 Bad request`, `404 Game not found`

#### **Cards** (`/cards`)
- `GET /cards` - Get all cards
  - Response: `200 OK` - Array of Card objects
  - Card: `{ id: string (UUID), title: string, description: string, createdAt: string (ISO 8601), updatedAt: string (ISO 8601) }`
- `GET /cards/{id}` - Get card by ID
  - Parameters: `id` (Card ID)
  - Response: `200 OK` - Card retrieved successfully
  - Errors: `404 Card not found`
- `POST /cards` - Create a new card
  - Body: `CreateCardDto { title: string, description: string }`
  - Response: `201 Created` - Card created successfully
  - Errors: `400 Bad request`
- `PATCH /cards/{id}` - Update a card
  - Parameters: `id` (Card ID)
  - Body: `UpdateCardDto { title?: string, description?: string }`
  - Response: `200 OK` - Card updated successfully
  - Errors: `400 Bad request`, `404 Card not found`
- `DELETE /cards/{id}` - Delete a card
  - Parameters: `id` (Card ID)
  - Response: `200 OK` - Card deleted successfully
  - Errors: `404 Card not found`

#### **Number Associations** (`/number-associations`)
- `POST /number-associations/{number}/generate` - Generate association for number
  - Parameters: `number` (number)
  - Response: `201 Created`
- `GET /number-associations/{number}` - Get association by number
  - Parameters: `number` (number)
  - Response: `200 OK`
- `POST /number-associations/{id}/rate` - Rate association
  - Parameters: `id` (number)
  - Response: `201 Created`
- `POST /number-associations/generate-all` - Generate next 10 associations
  - Response: `201 Created`
- `GET /number-associations/all/primary` - Get all primary associations
  - Response: `200 OK`
- `POST /number-associations/check-duplicates` - Check and regenerate duplicates
  - Response: `201 Created`

#### **Open API** (`/open-api`)
- `GET /open-api` - Get data from external API
  - Headers: `Authorization: Bearer {token}` (optional)
  - Response: `200 OK` - Data retrieved successfully
  - Errors: `401 Unauthorized`, `500 External API error`
- `POST /open-api` - Post data to external API
  - Headers: `Authorization: Bearer {token}` (optional)
  - Response: `200 OK` - Data posted successfully
  - Errors: `401 Unauthorized`, `500 External API error`

### Current Integration

**Account Configuration:**
- Account name: `Jan`
- PIN code: `1234`
- Create via Swagger: `POST /accounts` with `{ name: "Jan", code: "1234" }`

**ProfileSelection** uses `useProfiles` hook:
- Fetches account: `GET /accounts/Jan`
- Filters users with `role: 'user'` (children only)
- Maps to Profile format with colors
- Fallback to mock data if API fails

**Adding Profiles:**
- AdminPanel "Add Profile" tab creates user via `POST /accounts/Jan/users`
- Requires Bearer token (authentication with PIN: `1234`)
- Body: `CreateUserDto { name: string, role: 'user', settings: { timeLimit: number } }`
- Optional fields: `age?: number`, `color?: 'pinkPurple' | 'blue' | 'green' | 'pink' | 'orange' | 'lavender'`
- **Note**: Currently the endpoint works without Bearer token (no authentication enforced)

**API Client** (`src/api/`):
- Axios with interceptors
- Error handling (401, 403, 404, 500)
- TypeScript types for all DTOs
- Services: `accountsService`, `gamesService`

### Environment Variables

Backend `.env`:
```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=assential_db
PORT=4000
OPENAI_API_KEY=your_openai_api_key_here
```

Frontend `src/api/config.ts`:
```typescript
const API_BASE_URL = 'http://localhost:4000';
// For Android emulator: 'http://10.0.2.2:4000'
// For physical device: 'http://YOUR_COMPUTER_IP:4000'
```
