import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useState, useEffect } from 'react';

interface Tile {
  iconIndex: number;
  flipped: boolean;
  matched: boolean;
}

const TILE_SIZE = 120;
const TILE_SPACING = 16;

export default function App() {
  const iconIndices = [0, 1, 2, 3, 4, 5, 6, 7];
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);

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
      setMoves(moves + 1);
      const [first, second] = flippedIndices;

      if (tiles[first]?.iconIndex === tiles[second]?.iconIndex) {
        // Match!
        const newTiles = [...tiles];
        newTiles[first]!.matched = true;
        newTiles[second]!.matched = true;
        setTiles(newTiles);
        setFlippedIndices([]);
      } else {
        // Not a match
        setTimeout(() => {
          const newTiles = [...tiles];
          newTiles[first]!.flipped = false;
          newTiles[second]!.flipped = false;
          setTiles(newTiles);
          setFlippedIndices([]);
        }, 900);
      }
    }
  }, [flippedIndices]);

  const flipTile = (idx: number) => {
    const tile = tiles[idx];
    if (!tile || tile.flipped || tile.matched || flippedIndices.length === 2) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[idx]!.flipped = true;
    setTiles(newTiles);
    setFlippedIndices([...flippedIndices, idx]);
  };

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
        source={require('./assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <View style={styles.container}>
        <StatusBar style="light" />
      <Text style={styles.title}>Memory Game</Text>

      <View style={styles.board}>
        {tiles.map((tile, idx) => {
          const position = getTilePosition(tile.iconIndex);
          return (
            <TouchableOpacity
              key={idx}
              style={styles.tile}
              onPress={() => flipTile(idx)}
              activeOpacity={0.8}
            >
              {tile.flipped || tile.matched ? (
                <View style={styles.tileImageContainer}>
                  <Image
                    source={require('./assets/memo-tiles.png')}
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
                  <Text style={styles.tileBackText}>?</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.info}>
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <Text style={styles.movesText}>Moves: {moves}</Text>
        {matchedCount === tiles.length && tiles.length > 0 && (
          <Text style={styles.winText}>🎉 You won! 🎉</Text>
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
    width: (TILE_SIZE + TILE_SPACING) * 4,
    justifyContent: 'center',
    marginBottom: 30,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: TILE_SPACING / 2,
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
  tileImageContainer: {
    width: TILE_SIZE,
    height: TILE_SIZE,
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
    fontSize: 64,
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  movesText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: '#333',
  },
  winText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#ff6b35',
  },
});
