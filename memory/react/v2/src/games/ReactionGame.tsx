import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, Animated, Platform } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import RewardAnimal from '../components/RewardAnimal';

interface ReactionGameProps {
  profile: { id: string; name: string };
  onBack: () => void;
}

const LIGHT_COUNT = 5;

export default function ReactionGame({ profile, onBack }: ReactionGameProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Game state
  const [lights, setLights] = useState<boolean[]>(Array(LIGHT_COUNT).fill(false));
  const [gameState, setGameState] = useState<'waiting' | 'lighting' | 'ready' | 'go' | 'tooSoon' | 'result'>('waiting');
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [showReward, setShowReward] = useState(false);
  const [animalNumber, setAnimalNumber] = useState<1 | 2>(1);
  const startTimeRef = useRef<number>(0);
  const lightingIntervalRef = useRef<any>(null);
  const goTimeoutRef = useRef<any>(null);
  const currentLightRef = useRef<number>(0);

  // Animation for button pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when ready to click
  useEffect(() => {
    if (gameState === 'go') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [gameState]);

  const startSequence = useCallback(() => {
    // Reset
    setLights(Array(LIGHT_COUNT).fill(false));
    setGameState('lighting');
    setReactionTime(0);
    currentLightRef.current = 0;

    // Light up one by one from left to right
    const lightUpNext = () => {
      if (currentLightRef.current < LIGHT_COUNT) {
        const indexToLight = currentLightRef.current;
        setLights((prev) => {
          const newLights = [...prev];
          newLights[indexToLight] = true;
          console.log('Lighting up light', indexToLight, newLights);
          return newLights;
        });
        currentLightRef.current++;
        lightingIntervalRef.current = setTimeout(lightUpNext, 500); // 500ms between each light
      } else {
        // All lights are on
        console.log('All lights on, ready state');
        setGameState('ready');

        // Random delay before turning off (1-3 seconds)
        const randomDelay = 1000 + Math.random() * 2000;
        console.log('Will turn off lights in', randomDelay, 'ms');
        goTimeoutRef.current = setTimeout(() => {
          console.log('Turning off all lights - GO!');
          setLights(Array(LIGHT_COUNT).fill(false));
          setGameState('go');
          startTimeRef.current = Date.now();
        }, randomDelay);
      }
    };

    lightUpNext();
  }, []);

  const handleButtonPress = useCallback(() => {
    if (gameState === 'waiting') {
      startSequence();
    } else if (gameState === 'ready' || gameState === 'lighting') {
      // Too soon! Pressed before lights went out
      clearTimeout(lightingIntervalRef.current);
      clearTimeout(goTimeoutRef.current);
      setGameState('tooSoon');
      setLights(Array(LIGHT_COUNT).fill(false));

      // Show animal on mistake too (for encouragement)
      setAnimalNumber(Math.random() > 0.5 ? 1 : 2);
      setShowReward(true);
    } else if (gameState === 'go') {
      // Calculate reaction time
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setAttempts((prev) => prev + 1);

      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }

      setGameState('result');

      // Show animal on every result
      setAnimalNumber(Math.random() > 0.5 ? 1 : 2);
      setShowReward(true);
    } else if (gameState === 'tooSoon' || gameState === 'result') {
      // Start new attempt
      setGameState('waiting');
      setTimeout(() => startSequence(), 100);
    }
  }, [gameState, bestTime, startSequence]);

  // Gamepad support
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.getGamepads) return;

    let intervalId: NodeJS.Timeout;
    let lastPressed = false;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      if (!gamepad) return;

      // A button (button 0) - detect press (not hold)
      const currentPressed = gamepad.buttons[0]?.pressed || false;
      if (currentPressed && !lastPressed) {
        handleButtonPress();
      }
      lastPressed = currentPressed;
    };

    intervalId = setInterval(pollGamepad, 50);
    return () => clearInterval(intervalId);
  }, [handleButtonPress]);

  // Keyboard support (web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleButtonPress();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleButtonPress]);

  const resetGame = () => {
    clearTimeout(lightingIntervalRef.current);
    clearTimeout(goTimeoutRef.current);
    setLights(Array(LIGHT_COUNT).fill(false));
    setGameState('waiting');
    setReactionTime(0);
    setBestTime(null);
    setAttempts(0);
  };

  const getButtonIcon = () => {
    switch (gameState) {
      case 'waiting':
        return 'play';
      case 'lighting':
      case 'ready':
        return 'hourglass-half';
      case 'go':
        return 'hand-pointer-o';
      case 'tooSoon':
        return 'times';
      case 'result':
        return 'refresh';
      default:
        return 'play';
    }
  };

  const getButtonColor = () => {
    switch (gameState) {
      case 'waiting':
      case 'result':
        return '#4FACFE';
      case 'lighting':
      case 'ready':
        return '#FFA502';
      case 'go':
        return '#43E97B';
      case 'tooSoon':
        return '#FF6B6B';
      default:
        return '#4FACFE';
    }
  };

  return (
    <View style={styles.container}>
      {/* Reward Animal */}
      <RewardAnimal
        visible={showReward}
        animalNumber={animalNumber}
        onComplete={() => setShowReward(false)}
      />

      {/* Top bar */}
      <View style={[styles.topBar, isLandscape && styles.topBarLandscape]}>
        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]} onPress={onBack}>
          <FontAwesome name="arrow-left" size={isLandscape ? 20 : 28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          {bestTime !== null && (
            <View style={styles.statItem}>
              <FontAwesome name="trophy" size={isLandscape ? 18 : 24} color="#FFD700" />
              <Text style={[styles.statsText, isLandscape && styles.statsTextLandscape]}>
                {bestTime}ms
              </Text>
            </View>
          )}
          <View style={styles.statItem}>
            <FontAwesome name="star" size={isLandscape ? 18 : 24} color="#4FACFE" />
            <Text style={[styles.statsText, isLandscape && styles.statsTextLandscape]}>
              {attempts}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]} onPress={resetGame}>
          <FontAwesome name="refresh" size={isLandscape ? 20 : 28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Game area */}
      <View style={styles.gameArea}>

        {/* Lights */}
        <View style={[styles.lightsContainer, isLandscape && styles.lightsContainerLandscape]}>
          {lights.map((isOn, index) => (
            <View
              key={index}
              style={[
                styles.light,
                isLandscape && styles.lightLandscape,
                {
                  backgroundColor: isOn ? '#FF0000' : '#222',
                  borderColor: isOn ? '#FF0000' : '#555',
                  shadowColor: isOn ? '#FF0000' : 'transparent',
                  shadowOpacity: isOn ? 0.9 : 0,
                  shadowRadius: isOn ? 25 : 0,
                  elevation: isOn ? 15 : 0,
                },
              ]}
            />
          ))}
        </View>

        {/* Reaction button - visual only, no text */}
        <Animated.View
          style={{
            transform: [{ scale: gameState === 'go' ? pulseAnim : 1 }],
          }}
        >
          <TouchableOpacity
            style={[
              styles.reactionButton,
              isLandscape && styles.reactionButtonLandscape,
              { backgroundColor: getButtonColor() },
            ]}
            onPress={handleButtonPress}
            activeOpacity={0.8}
          >
            <FontAwesome
              name={getButtonIcon()}
              size={isLandscape ? 60 : 80}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
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
  topBarLandscape: {
    paddingVertical: 10,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLandscape: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsTextLandscape: {
    fontSize: 14,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  lightsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  lightsContainerLandscape: {
    gap: 15,
    marginBottom: 30,
  },
  light: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#555',
  },
  lightLandscape: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  reactionButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reactionButtonLandscape: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
});
