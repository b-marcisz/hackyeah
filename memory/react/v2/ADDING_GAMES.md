# Adding New Games to BrainIO

This guide explains how to add new games to the educational platform for children aged 4-6 years.

## Quick Overview

1. Create game component in `src/games/`
2. Add game icon PNG to `assets/`
3. Register game in GameDashboard
4. Add navigation handler in App.tsx

---

## Step 1: Create Game Component

Create a new game file in `src/games/YourGame.tsx`:

```typescript
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface YourGameProps {
  profile: { id: string; name: string };
  onBack: () => void;
}

export default function YourGame({ profile, onBack }: YourGameProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Game state
  const [score, setScore] = useState(0);

  return (
    <View style={styles.container}>
      {/* Top bar with back button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <FontAwesome name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.scoreText}>Score: {score}</Text>

        <TouchableOpacity style={styles.button} onPress={() => setScore(0)}>
          <FontAwesome name="refresh" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Game content */}
      <View style={styles.gameArea}>
        {/* Your game logic here */}
        <Text style={styles.title}>Your Game</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
});
```

### Design Guidelines for Children (4-6 years):

- ✅ **Large touch targets** - minimum 50x50px buttons
- ✅ **Bright colors** - use vibrant, playful colors
- ✅ **Icons over text** - children can't read yet
- ✅ **Simple navigation** - max 1 tap to go back
- ✅ **Visual feedback** - animations, sounds, colors
- ✅ **No complex UI** - avoid dropdowns, multi-step forms
- ❌ **No text instructions** - use images/icons only
- ❌ **No timers** (unless parents approve in settings)

### Responsive Layout:

Always support both orientations:
```typescript
const { width, height } = useWindowDimensions();
const isLandscape = width > height;

<View style={[styles.container, isLandscape && styles.containerLandscape]}>
```

---

## Step 2: Add Game Icon

1. Create a square PNG icon (recommended: 512x512px)
2. Save to `assets/games/your-game.png`
3. Use bright, recognizable imagery
4. No text on the icon (children can't read)

**Example icons:**
- Memory: Playing cards
- Puzzle: Puzzle piece
- Colors: Rainbow/palette
- Math: Numbers/counting objects

---

## Step 3: Register in GameDashboard

Edit `src/screens/GameDashboard.tsx`:

```typescript
const games: Game[] = [
  {
    id: 'memory',
    name: 'Memory',
    iconImage: require('../../assets/memory/memory.png'),
    color: '#FF6B9D'
  },
  {
    id: 'memory-less',
    name: 'Memory Less',
    iconImage: require('../../assets/memory/memory-loss.png'),
    color: '#4FACFE'
  },
  // Add your new game:
  {
    id: 'your-game',
    name: 'Your Game',
    iconImage: require('../../assets/games/your-game.png'),
    color: '#43E97B'  // Choose a unique color
  },
];
```

**Color palette suggestions:**
- `#FF6B9D` - Pink
- `#4FACFE` - Blue
- `#43E97B` - Green
- `#FFA502` - Orange
- `#A29BFE` - Purple
- `#F093FB` - Pink Purple

---

## Step 4: Add Navigation Handler

Edit `App.tsx`:

### 4.1. Import your game component:
```typescript
import MemoryGame from './src/games/MemoryGame';
import YourGame from './src/games/YourGame';
```

### 4.2. Add to Screen type:
```typescript
type Screen =
  | 'loading'
  | 'splash'
  | 'account-login'
  | 'account-setup'
  | 'profile-selection'
  | 'game-dashboard'
  | 'memory-game'
  | 'your-game'  // Add this
  | 'pin-entry'
  | 'admin-panel'
  | 'time-limit-reached';
```

### 4.3. Add navigation handler:
```typescript
const handleSelectGame = (gameId: string) => {
  if (gameId === 'memory') {
    setCurrentScreen('memory-game');
  } else if (gameId === 'your-game') {
    setCurrentScreen('your-game');
  }
};
```

### 4.4. Add render case:
```typescript
switch (currentScreen) {
  // ... other cases

  case 'your-game':
    return selectedProfile ? (
      <YourGame
        profile={selectedProfile}
        onBack={handleBackToGameDashboard}
      />
    ) : null;

  // ... other cases
}
```

---

## Optional: Gamepad/Keyboard Support

Add gamepad navigation for physical controllers:

```typescript
useEffect(() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  let intervalId: NodeJS.Timeout;

  const pollGamepad = () => {
    if (!navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];
    if (!gamepad) return;

    // D-pad / Joystick
    const axes = gamepad.axes;
    const horizontal = axes[0];
    const vertical = axes[1];

    if (horizontal < -0.5) handleMove('left');
    else if (horizontal > 0.5) handleMove('right');
    if (vertical < -0.5) handleMove('up');
    else if (vertical > 0.5) handleMove('down');

    // A button (confirm)
    if (gamepad.buttons[0]?.pressed) handleConfirm();

    // B button (back)
    if (gamepad.buttons[1]?.pressed) onBack();
  };

  intervalId = setInterval(pollGamepad, 150);
  return () => clearInterval(intervalId);
}, [/* dependencies */]);

// Keyboard support
useEffect(() => {
  if (Platform.OS !== 'web') return;

  const handleKeyPress = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === 'ArrowLeft') handleMove('left');
    else if (e.key === 'ArrowRight') handleMove('right');
    else if (e.key === 'ArrowUp') handleMove('up');
    else if (e.key === 'ArrowDown') handleMove('down');
    else if (e.key === 'Enter' || e.key === ' ') handleConfirm();
    else if (e.key === 'Escape') onBack();
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [/* dependencies */]);
```

---

## Optional: Time Tracking Integration

If you want to track play time for parental controls:

The app automatically tracks time per session via `useSession` hook in GameDashboard.
Individual games don't need to implement time tracking - it's handled at the dashboard level.

However, if you want game-specific analytics, you can use the backend API:

```typescript
import { gamesService } from '../api';

// Start game tracking
const startGame = async () => {
  const gameData = await gamesService.startGame({
    type: 'match_hao', // Your game type
    playerId: profile.id,
    difficulty: 1,
  });
  setGameId(gameData.id);
};

// Submit answer/result
const submitAnswer = async (answer: any) => {
  await gamesService.submitAnswer(gameId, {
    answer: answer,
    timeSpentMs: elapsedTime,
  });
};

// Get results
const getResults = async () => {
  const result = await gamesService.getResult(gameId);
  console.log('Game result:', result);
};
```

---

## Testing Checklist

Before submitting your game:

- [ ] Works in portrait mode
- [ ] Works in landscape mode
- [ ] Large buttons (min 50x50px)
- [ ] Back button always visible and working
- [ ] Icons only (no text for children who can't read)
- [ ] Bright, playful colors
- [ ] Touch/click works
- [ ] Gamepad works (optional)
- [ ] Keyboard works (optional)
- [ ] No crashes or console errors
- [ ] Responsive to different screen sizes

---

## Example: Complete Memory Game Structure

Reference implementation: `src/games/MemoryGame.tsx`

**Features:**
- Responsive grid (4x4 portrait, 2x8 landscape)
- Sprite sheet rendering for cards
- Move counter
- Restart button
- Win detection with celebration
- Back navigation
- Gamepad + Keyboard support

**File structure:**
```
src/games/MemoryGame.tsx          # Game component
assets/memory/memory.png           # Dashboard icon
assets/memo-tiles.png              # Game sprites
```

---

## Backend Integration (Optional)

If your game needs backend features:

### Available Endpoints:

**Start Game:**
```typescript
POST /api/games/start
Body: {
  type: GameType,
  playerId: string,
  difficulty: number (1-5),
  settings: object
}
```

**Submit Answer:**
```typescript
POST /api/games/{id}/answer
Body: {
  answer: object,
  timeSpentMs: number
}
```

**Get Result:**
```typescript
GET /api/games/{id}/result
```

**Submit Feedback:**
```typescript
POST /api/games/{id}/feedback
Body: {
  message: string,
  rating: number (1-5)
}
```

See `src/api/services/games.service.ts` for TypeScript implementations.

---

## Tips & Best Practices

1. **Keep it simple** - Children have short attention spans
2. **Instant feedback** - Use animations/sounds on interactions
3. **No failure states** - Make games rewarding, not punishing
4. **Progressive difficulty** - Start easy, get harder gradually
5. **Celebrate wins** - Use emojis, animations, colors
6. **Save state** - Remember progress if child leaves game
7. **Test with real kids** - 4-6 year olds think differently!

---

## Common Mistakes to Avoid

❌ **Using small buttons** - Children have less precise motor skills
❌ **Text-heavy UI** - Most can't read yet
❌ **Complex gestures** - Stick to tap/click
❌ **No feedback** - Always show something happened
❌ **Dark colors** - Use bright, happy colors
❌ **Timers** - Can cause stress for young children
❌ **Forgetting landscape** - Tablets are often used in landscape
❌ **No back button** - Always provide clear exit

---

## Questions?

Check existing games in `src/games/` for reference implementations.

Main game: `MemoryGame.tsx` - well-documented, responsive, gamepad support.

For architecture questions, see `CLAUDE.md` in the project root.
