import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

export default function App() {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const [tiles, setTiles] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [moves, setMoves] = useState(0);

  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const resetGame = () => {
    const pairs = [...letters, ...letters];
    const shuffled = shuffle(pairs).map((letter) => ({
      letter,
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

      if (tiles[first].letter === tiles[second].letter) {
        // Match!
        const newTiles = [...tiles];
        newTiles[first].matched = true;
        newTiles[second].matched = true;
        setTiles(newTiles);
        setFlippedIndices([]);
      } else {
        // Not a match
        setTimeout(() => {
          const newTiles = [...tiles];
          newTiles[first].flipped = false;
          newTiles[second].flipped = false;
          setTiles(newTiles);
          setFlippedIndices([]);
        }, 900);
      }
    }
  }, [flippedIndices]);

  const flipTile = (idx) => {
    if (tiles[idx].flipped || tiles[idx].matched || flippedIndices.length === 2) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[idx].flipped = true;
    setTiles(newTiles);
    setFlippedIndices([...flippedIndices, idx]);
  };

  const matchedCount = tiles.filter((t) => t.matched).length;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Memory Game</Text>

      <View style={styles.board}>
        {tiles.map((tile, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.tile,
              (tile.flipped || tile.matched) && styles.tileFlipped
            ]}
            onPress={() => flipTile(idx)}
            activeOpacity={0.7}
          >
            <Text style={styles.tileText}>
              {tile.flipped || tile.matched ? tile.letter : '?'}
            </Text>
          </TouchableOpacity>
        ))}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 320,
    justifyContent: 'center',
    marginBottom: 30,
  },
  tile: {
    width: 60,
    height: 80,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#bbb',
    borderRadius: 7,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileFlipped: {
    backgroundColor: '#6cf',
    borderColor: '#269',
  },
  tileText: {
    fontSize: 32,
    color: '#000',
  },
  info: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#269',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  movesText: {
    fontSize: 18,
    marginBottom: 10,
  },
  winText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
