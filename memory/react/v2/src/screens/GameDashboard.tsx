import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Profile } from './ProfileSelection';

interface GameDashboardProps {
  profile: Profile;
  onSelectGame: (gameId: string) => void;
}

interface Game {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function GameDashboard({ profile, onSelectGame }: GameDashboardProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const games: Game[] = [
    { id: 'memory', name: 'Memory', icon: '🎴', color: '#FF6B9D' },
    { id: 'puzzle', name: 'Puzzle', icon: '🧩', color: '#4FACFE' },
    { id: 'math', name: 'Matematyka', icon: '➕', color: '#43E97B' },
    { id: 'colors', name: 'Kolory', icon: '🎨', color: '#F093FB' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.greeting, isLandscape && styles.greetingLandscape]}>
          Cześć {profile.name}! 👋
        </Text>
        <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
          W co chcesz zagrać?
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.gamesContainer,
          isLandscape && styles.gamesContainerLandscape
        ]}
        showsVerticalScrollIndicator={false}
      >
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[
              styles.gameCard,
              { backgroundColor: game.color },
              isLandscape && styles.gameCardLandscape
            ]}
            onPress={() => onSelectGame(game.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.gameIcon}>{game.icon}</Text>
            <Text style={styles.gameName}>{game.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  greetingLandscape: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  subtitleLandscape: {
    fontSize: 20,
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 40,
  },
  gamesContainerLandscape: {
    gap: 20,
    paddingBottom: 25,
    alignItems: 'center',
  },
  gameCard: {
    width: 180,
    height: 180,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gameCardLandscape: {
    width: 160,
    height: 160,
    padding: 15,
  },
  gameIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  gameName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
