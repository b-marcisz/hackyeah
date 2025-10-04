<template>
  <div class="container">
    <h1>Memory Game</h1>
    <div class="board">
      <div
        v-for="(tile, idx) in tiles"
        :key="idx"
        class="tile"
        :class="{ flipped: tile.flipped || tile.matched }"
        @click="flipTile(idx)"
      >
        <span v-if="tile.flipped || tile.matched">{{ tile.letter }}</span>
        <span v-else>?</span>
      </div>
    </div>
    <div class="info">
      <button @click="resetGame">Restart</button>
      <p>Moves: {{ moves }}</p>
      <p v-if="matchedCount === tiles.length">🎉 You won! 🎉</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      letters: ["A", "B", "C", "D", "E", "F", "G", "H"],
      tiles: [],
      flippedIndices: [],
      moves: 0,
    };
  },
  computed: {
    matchedCount() {
      return this.tiles.filter((t) => t.matched).length;
    },
  },
  created() {
    this.resetGame();
  },
  methods: {
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    resetGame() {
      const pairs = [...this.letters, ...this.letters];
      const shuffled = this.shuffle(pairs).map((letter) => ({
        letter,
        flipped: false,
        matched: false,
      }));
      this.tiles = shuffled;
      this.flippedIndices = [];
      this.moves = 0;
    },
    flipTile(idx) {
      if (
        this.tiles[idx].flipped ||
        this.tiles[idx].matched ||
        this.flippedIndices.length === 2
      )
        return;

      this.tiles[idx].flipped = true;
      this.flippedIndices.push(idx);

      if (this.flippedIndices.length === 2) {
        this.moves++;
        const [first, second] = this.flippedIndices;
        if (this.tiles[first].letter === this.tiles[second].letter) {
          // Match!
          this.tiles[first].matched = true;
          this.tiles[second].matched = true;
          this.flippedIndices = [];
        } else {
          // Not a match
          setTimeout(() => {
            this.tiles[first].flipped = false;
            this.tiles[second].flipped = false;
            this.flippedIndices = [];
          }, 900);
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
  font-family: Arial, sans-serif;
}
.board {
  display: grid;
  grid-template-columns: repeat(4, 60px);
  grid-gap: 12px;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.tile {
  width: 60px;
  height: 80px;
  background: #eee;
  border: 2px solid #bbb;
  border-radius: 7px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: background 0.25s, border 0.25s;
}
.tile.flipped,
.tile.matched {
  background: #6cf;
  border-color: #269;
  color: #fff;
  cursor: default;
}
.info {
  margin-top: 1rem;
}
button {
  padding: 0.4rem 1rem;
  background: #269;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background: #37b;
}
</style>