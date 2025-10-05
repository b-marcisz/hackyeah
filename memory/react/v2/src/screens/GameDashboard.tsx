import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions, Platform, Image, Alert } from 'react-native';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Profile } from './ProfileSelection';
import { useSession } from '../hooks/useSession';

interface GameDashboardProps {
  profile: Profile;
  accountName: string;
  onSelectGame: (gameId: string) => void;
  onBackToProfiles: () => void;
  onTimeExpired: (sessionId: string) => void;
}

interface Game {
  id: string;
  name: string;
  iconImage?: any;
  color: string;
}

export default function GameDashboard({ profile, accountName, onSelectGame, onBackToProfiles, onTimeExpired }: GameDashboardProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Session management callbacks (memoized to prevent re-renders)
  const handleTimeWarning = useCallback(() => {
    Alert.alert(
      'Warning!',
      'Only 5 minutes remaining!',
      [{ text: 'OK' }]
    );
  }, []);

  // Use a ref to store the latest session for the callback
  const sessionRef = useRef<any>(null);

  const handleTimeExpired = useCallback(() => {
    if (sessionRef.current?.id) {
      onTimeExpired(sessionRef.current.id);
    } else {
      console.error('Time expired but session ID not available');
      // Fallback: navigate back to profiles
      onBackToProfiles();
    }
  }, [onTimeExpired, onBackToProfiles]);

  const { session, loading, elapsedMinutes, remainingMinutes, isExpired, refreshSession } = useSession({
    accountName,
    userId: profile.id,
    timeLimit: profile.settings?.timeLimit || 30,
    onTimeWarning: handleTimeWarning,
    onTimeExpired: handleTimeExpired,
  });

  // Update sessionRef whenever session changes
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Refresh session when component mounts/returns to view
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const games: Game[] = [
    { id: 'memory', name: 'Memory', iconImage: require('../../assets/memory/memory.png'), color: '#FF6B9D' },
    { id: 'memory-less', name: 'Memory Less', iconImage: require('../../assets/memory/memory-loss.png'), color: '#4FACFE' },
  ];

  const handleSelectGame = useCallback((gameId: string) => {
    if (gameId === 'back') {
      onBackToProfiles();
    } else {
      onSelectGame(gameId);
    }
  }, [onBackToProfiles, onSelectGame]);

  // Gamepad/Keyboard navigation
  const handleNavigationButton = useCallback((button: string) => {
    const totalGames = games.length;

    if (button === 'left') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (button === 'right') {
      setSelectedIndex(prev => (prev < totalGames - 1 ? prev + 1 : prev));
    } else if (button === 'up' && !isLandscape) {
      // Portrait: 2 columns
      setSelectedIndex(prev => (prev >= 2 ? prev - 2 : prev));
    } else if (button === 'down' && !isLandscape) {
      // Portrait: 2 columns
      setSelectedIndex(prev => (prev + 2 < totalGames ? prev + 2 : prev));
    } else if (button === 'a') {
      handleSelectGame(games[selectedIndex]?.id || '');
    }
  }, [selectedIndex, games, isLandscape, handleSelectGame]);

  // Gamepad support (web only)
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

      if (horizontal < -0.5) handleNavigationButton('left');
      else if (horizontal > 0.5) handleNavigationButton('right');
      if (vertical < -0.5) handleNavigationButton('up');
      else if (vertical > 0.5) handleNavigationButton('down');

      if (gamepad.buttons[0]?.pressed) handleNavigationButton('a');
    };

    intervalId = setInterval(pollGamepad, 150);
    return () => clearInterval(intervalId);
  }, [handleNavigationButton]);

  // Keyboard support
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'ArrowLeft') handleNavigationButton('left');
      else if (e.key === 'ArrowRight') handleNavigationButton('right');
      else if (e.key === 'ArrowUp') handleNavigationButton('up');
      else if (e.key === 'ArrowDown') handleNavigationButton('down');
      else if (e.key === 'Enter' || e.key === ' ') handleNavigationButton('a');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNavigationButton]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.greeting, isLandscape && styles.greetingLandscape]}>
            Hi {profile.name}! 👋
          </Text>
          <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
            What do you want to play?
          </Text>
        </View>

        {!loading && (
          <View style={styles.timeContainer}>
            <FontAwesome name="clock-o" size={isLandscape ? 18 : 24} color={remainingMinutes <= 5 ? '#FF6B6B' : '#4FACFE'} />
            <Text style={[
              styles.timeText,
              isLandscape && styles.timeTextLandscape,
              remainingMinutes <= 5 && styles.timeTextWarning
            ]}>
              {remainingMinutes} min
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.gamesContainer,
          isLandscape && styles.gamesContainerLandscape
        ]}
      >
        {games.map((game, index) => (
          <TouchableOpacity
            key={game.id}
            style={[
              styles.gameCard,
              { backgroundColor: game.color },
              isLandscape && styles.gameCardLandscape,
            ]}
            onPress={() => handleSelectGame(game.id)}
            activeOpacity={0.8}
          >
            {game.iconImage && (
              <Image
                source={game.iconImage}
                style={[styles.gameIcon, isLandscape && styles.gameIconLandscape]}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        ))}

        {/* Back button with icon */}
        <TouchableOpacity
          style={[
            styles.gameCard,
            styles.backCard,
            isLandscape && styles.gameCardLandscape,
          ]}
          onPress={onBackToProfiles}
          activeOpacity={0.8}
        >
          <FontAwesome name="arrow-left" size={isLandscape ? 50 : 60} color="#fff" />
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4FACFE',
  },
  timeTextLandscape: {
    fontSize: 16,
  },
  timeTextWarning: {
    color: '#FF6B6B',
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
    alignItems: 'center',
    gap: 20,
    paddingBottom: 40,
  },
  gamesContainerLandscape: {
    flexDirection: 'row',
    gap: 20,
    paddingBottom: 25,
    justifyContent: 'center',
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
    width: 120,
    height: 120,
  },
  gameIconLandscape: {
    width: 100,
    height: 100,
  },
  gameName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  backCard: {
    backgroundColor: '#6C757D',
  },
});
