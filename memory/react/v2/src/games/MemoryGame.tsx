import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Dimensions, useWindowDimensions, Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';

interface Tile {
  iconIndex: number;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryGame() {
  const { width, height } = useWindowDimensions();
  const iconIndices = [0, 1, 2, 3, 4, 5, 6, 7];
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Responsive tile sizing
  const isPortrait = height > width;
  const isLandscape = !isPortrait;

  // Calculate optimal tile size based on available space
  const availableWidth = width - 40; // padding
  const availableHeight = height - 180; // title, info panel

  let TILE_SIZE: number;
  let TILE_SPACING: number;
  let COLUMNS: number;
  let ROWS: number;

  if (isLandscape) {
    // Landscape: 2 rows x 8 columns
    COLUMNS = 8;
    ROWS = 2;
    const maxTileWidth = (availableWidth - (COLUMNS + 1) * 12) / COLUMNS;
    const maxTileHeight = (availableHeight - (ROWS + 1) * 12) / ROWS;
    TILE_SIZE = Math.min(maxTileWidth, maxTileHeight, 140);
    TILE_SPACING = 12;
  } else {
    // Portrait: 4 rows x 4 columns
    COLUMNS = 4;
    ROWS = 4;
    const maxTileWidth = (availableWidth - (COLUMNS + 1) * 16) / COLUMNS;
    TILE_SIZE = Math.min(maxTileWidth, 120);
    TILE_SPACING = width > 600 ? 16 : 12;
  }

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const resetGame = () => {
    const pairs = [...iconIndices, ...iconIndices];
    const shuffled = shuffle(pairs).map((iconIndex) => ({
      iconIndex,
      flipped: false,
      matched: false,
    }));
    setTiles(shuffled);
    setFlippedIndices([]);
    setMoves(0);
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = flippedIndices;

      if (tiles[first]?.iconIndex === tiles[second]?.iconIndex) {
        // Match!
        setTiles(prevTiles => {
          const newTiles = [...prevTiles];
          newTiles[first]!.matched = true;
          newTiles[second]!.matched = true;
          return newTiles;
        });
        setFlippedIndices([]);
      } else {
        // Not a match - wait before flipping back
        setTimeout(() => {
          setTiles(prevTiles => {
            const newTiles = [...prevTiles];
            newTiles[first]!.flipped = false;
            newTiles[second]!.flipped = false;
            return newTiles;
          });
          setFlippedIndices([]);
        }, 900);
      }
    }
  }, [flippedIndices, tiles]);

  const flipTile = useCallback((idx: number) => {
    // Don't allow flipping if 2 tiles are already flipped
    if (flippedIndices.length >= 2) return;

    const tile = tiles[idx];
    if (!tile || tile.flipped || tile.matched) return;

    const newTiles = [...tiles];
    newTiles[idx]!.flipped = true;
    setTiles(newTiles);
    setFlippedIndices([...flippedIndices, idx]);
  }, [tiles, flippedIndices]);

  // Gamepad/Keyboard navigation
  const handleGamepadButton = useCallback((button: string) => {
    const totalTiles = 16;

    if (button === 'up') {
      setSelectedIndex(prev => {
        const newIndex = prev - COLUMNS;
        return newIndex >= 0 ? newIndex : prev;
      });
    } else if (button === 'down') {
      setSelectedIndex(prev => {
        const newIndex = prev + COLUMNS;
        return newIndex < totalTiles ? newIndex : prev;
      });
    } else if (button === 'left') {
      setSelectedIndex(prev => {
        const currentCol = prev % COLUMNS;
        return currentCol > 0 ? prev - 1 : prev;
      });
    } else if (button === 'right') {
      setSelectedIndex(prev => {
        const currentCol = prev % COLUMNS;
        return currentCol < COLUMNS - 1 ? prev + 1 : prev;
      });
    } else if (button === 'a') {
      flipTile(selectedIndex);
    } else if (button === 'start') {
      resetGame();
    }
  }, [selectedIndex, flipTile, COLUMNS]);

  // Use gamepad hook only on web platform
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    let intervalId: NodeJS.Timeout;

    const pollGamepad = () => {
      if (!navigator.getGamepads) return;
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      if (!gamepad) return;

      const axes = gamepad.axes;
      const horizontal = axes[0];
      const vertical = axes[1];

      // Simple navigation without debouncing for now
      if (horizontal < -0.5) handleGamepadButton('left');
      else if (horizontal > 0.5) handleGamepadButton('right');
      if (vertical < -0.5) handleGamepadButton('up');
      else if (vertical > 0.5) handleGamepadButton('down');

      // A button
      if (gamepad.buttons[0]?.pressed) handleGamepadButton('a');
      // Start button
      if (gamepad.buttons[9]?.pressed) handleGamepadButton('start');
    };

    intervalId = setInterval(pollGamepad, 150);
    return () => clearInterval(intervalId);
  }, [handleGamepadButton]);

  // Keyboard support
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'ArrowUp') handleGamepadButton('up');
      else if (e.key === 'ArrowDown') handleGamepadButton('down');
      else if (e.key === 'ArrowLeft') handleGamepadButton('left');
      else if (e.key === 'ArrowRight') handleGamepadButton('right');
      else if (e.key === 'Enter' || e.key === ' ') handleGamepadButton('a');
      else if (e.key === 'r' || e.key === 'R') resetGame();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleGamepadButton]);

  const matchedCount = tiles.filter((t) => t.matched).length;

  const getTilePosition = (iconIndex: number) => {
    // Sprite sheet ma 4 kolumny i 2 rzędy
    const col = iconIndex % 4;
    const row = Math.floor(iconIndex / 4);

    // Zakładamy, że sprite sheet ma wymiary 320x160 (4x2 tiles po 80px każdy)
    const spriteWidth = 320;
    const spriteHeight = 160;

    return {
      col,
      row,
      left: col * TILE_SIZE,
      top: row * TILE_SIZE,
    };
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <View style={styles.container}>
        <StatusBar style="light" />

      <View style={[styles.board, { width: (TILE_SIZE + TILE_SPACING) * COLUMNS }]}>
        {tiles.map((tile, idx) => {
          const position = getTilePosition(tile.iconIndex);
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.tile,
                {
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  margin: TILE_SPACING / 2,
                },
                selectedIndex === idx && styles.tileSelected
              ]}
              onPress={() => flipTile(idx)}
              activeOpacity={0.8}
            >
              {tile.flipped || tile.matched ? (
                <View style={[styles.tileImageContainer, { width: TILE_SIZE, height: TILE_SIZE }]}>
                  <Image
                    source={require('../../assets/memo-tiles.png')}
                    style={{
                      width: TILE_SIZE * 4,
                      height: TILE_SIZE * 2,
                      position: 'absolute',
                      left: -position.left,
                      top: -position.top,
                    }}
                    resizeMode="stretch"
                  />
                </View>
              ) : (
                <View style={styles.tileBack}>
                  <Text style={[styles.tileBackText, { fontSize: TILE_SIZE * 0.5 }]}>?</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.info}>
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={[styles.buttonText, { fontSize: isLandscape ? 14 : 18 }]}>Restart</Text>
        </TouchableOpacity>
        <Text style={[styles.movesText, { fontSize: isLandscape ? 16 : 20 }]}>Moves: {moves}</Text>
        {matchedCount === tiles.length && tiles.length > 0 && (
          <Text style={[styles.winText, { fontSize: isLandscape ? 18 : 24 }]}>🎉 You won! 🎉</Text>
        )}
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f0d4',
    borderWidth: 3,
    borderColor: '#e8ddb5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tileSelected: {
    borderColor: '#FFD700',
    borderWidth: 4,
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  tileImageContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  tileBack: {
    flex: 1,
    backgroundColor: '#ff6b35',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tileBackText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#ff6b35',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  movesText: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  winText: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#ff6b35',
  },
});
