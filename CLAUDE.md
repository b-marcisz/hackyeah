# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a HackYeah project repository containing memory card game implementations in multiple frameworks.

```
hackyeah/
├── memory/
│   ├── vue/
│   │   └── v1/          # Vue 2.7 memory game application
│   │       ├── src/
│   │       │   ├── App.vue    # Main game component (game logic & UI)
│   │       │   └── main.js    # Vue app entry point
│   │       ├── public/
│   │       │   └── index.html
│   │       └── package.json
│   └── react/
│       └── v2/          # React Native (Expo) memory game application
│           ├── App.js         # Main game component (game logic & UI)
│           ├── app.json
│           └── package.json
└── README.md
```

## Development Commands

### Vue Version (memory/vue/v1/)

- **Start development server**: `npm run serve`
- **Build for production**: `npm run build`

### React Native Version (memory/react/v2/)

- **Start web**: `npm run web`
- **Start Android**: `npm run android`
- **Start iOS**: `npm run ios`

## Architecture

### Memory Game (Vue 2.7)

The application is a single-component Vue 2.7 app located at `memory/vue/v1/src/App.vue`:

- **Game State**: Managed in component data with 8 letter pairs (16 tiles total)
- **Core Logic**:
  - `flipTile(idx)` handles tile clicks and match checking
  - Two flipped tiles are compared; matches stay revealed, non-matches flip back after 900ms
  - Move counter increments when two tiles are flipped
- **Layout**: 4x4 grid of tiles, restart button, move counter, and win message
- **No router, no Vuex**: Single component with local state management

When modifying the game, note that tile state uses three properties: `letter`, `flipped`, and `matched`.

### Memory Game (React Native with Expo)

The application is a single-component React Native app located at `memory/react/v2/App.js`:

- **Game State**: Managed with React hooks (useState) with 8 letter pairs (16 tiles total)
- **Core Logic**:
  - `flipTile(idx)` handles tile presses and match checking
  - Two flipped tiles are compared; matches stay revealed, non-matches flip back after 900ms
  - Move counter increments when two tiles are flipped
  - Uses useEffect hooks for game initialization and match checking
- **Layout**: 4x4 grid of TouchableOpacity tiles, restart button, move counter, and win message
- **Styling**: React Native StyleSheet with similar visual design to Vue version

When modifying the game, note that tile state uses three properties: `letter`, `flipped`, and `matched`.
