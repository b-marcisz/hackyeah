import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, Animated, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';

interface BalanceGameProps {
  profile: { id: string; name: string };
  onBack: () => void;
}

const BALL_SIZE = 60;
const TARGET_SIZE = 120;
const SENSITIVITY = 25; // Ball movement sensitivity
const WIN_TIME = 3000; // 3 seconds to win
const GAME_TIME = 30000; // 30 seconds total

export default function BalanceGame({ profile, onBack }: BalanceGameProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME / 1000);
  const [isInTarget, setIsInTarget] = useState(false);
  const [timeInTarget, setTimeInTarget] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [level, setLevel] = useState(1);

  // Ball position (0-1 range, then scaled to screen)
  const ballX = useRef(new Animated.Value(0.5)).current;
  const ballY = useRef(new Animated.Value(0.5)).current;
  const ballPosX = useRef(0.5);
  const ballPosY = useRef(0.5);

  // Target position (changes each level)
  const [targetX, setTargetX] = useState(0.5);
  const [targetY, setTargetY] = useState(0.5);

  // Accelerometer subscription
  useEffect(() => {
    let subscription: any;

    if (Platform.OS !== 'web') {
      Accelerometer.setUpdateInterval(16); // ~60fps

      subscription = Accelerometer.addListener(({ x, y }) => {
        // Update ball position based on device tilt
        // x: left/right, y: forward/backward
        const newX = Math.max(0, Math.min(1, ballPosX.current - x / SENSITIVITY)); // Inverted
        const newY = Math.max(0, Math.min(1, ballPosY.current + y / SENSITIVITY)); // Inverted

        ballPosX.current = newX;
        ballPosY.current = newY;
        ballX.setValue(newX);
        ballY.setValue(newY);
      });
    } else {
      // Web fallback: Use mouse/keyboard
      const handleKeyPress = (e: KeyboardEvent) => {
        const step = 0.02;
        let newX = ballPosX.current;
        let newY = ballPosY.current;

        if (e.key === 'ArrowLeft') newX = Math.max(0, ballPosX.current - step);
        if (e.key === 'ArrowRight') newX = Math.min(1, ballPosX.current + step);
        if (e.key === 'ArrowUp') newY = Math.max(0, ballPosY.current - step);
        if (e.key === 'ArrowDown') newY = Math.min(1, ballPosY.current + step);

        ballPosX.current = newX;
        ballPosY.current = newY;
        ballX.setValue(newX);
        ballY.setValue(newY);
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }

    return () => subscription && subscription.remove();
  }, []);

  // Check if ball is in target
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const currentX = ballPosX.current;
      const currentY = ballPosY.current;

      const gameWidth = width - 40; // Account for padding
      const gameHeight = height - 200; // Account for header/footer

      const ballX = currentX * gameWidth;
      const ballY = currentY * gameHeight;
      const targetPosX = targetX * gameWidth;
      const targetPosY = targetY * gameHeight;

      const distance = Math.sqrt(
        Math.pow(ballX - targetPosX, 2) + Math.pow(ballY - targetPosY, 2)
      );

      const isIn = distance < TARGET_SIZE / 2;
      setIsInTarget(isIn);

      if (isIn && !gameWon) {
        setTimeInTarget((prev) => {
          const newTime = prev + 100;
          if (newTime >= WIN_TIME) {
            handleLevelComplete();
          }
          return newTime;
        });
      } else {
        setTimeInTarget(0);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [width, height, targetX, targetY, gameWon]);

  // Game timer
  useEffect(() => {
    if (gameWon) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameWon]);

  const handleLevelComplete = () => {
    setScore((prev) => prev + level * 100);
    setLevel((prev) => prev + 1);
    setTimeInTarget(0);

    // Move target to random position
    setTargetX(0.2 + Math.random() * 0.6);
    setTargetY(0.2 + Math.random() * 0.6);

    if (level >= 5) {
      setGameWon(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(GAME_TIME / 1000);
    setTimeInTarget(0);
    setGameWon(false);
    setTargetX(0.5);
    setTargetY(0.5);
    ballPosX.current = 0.5;
    ballPosY.current = 0.5;
    ballX.setValue(0.5);
    ballY.setValue(0.5);
  };

  // Bigger game area on Android
  const gameWidth = Platform.OS === 'android' ? width - 20 : width - 40;
  const gameHeight = Platform.OS === 'android' ? height - 140 : height - 200;

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={[styles.topBar, isLandscape && styles.topBarLandscape]}>
        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]} onPress={onBack}>
          <FontAwesome name="arrow-left" size={isLandscape ? 20 : 28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <Text style={[styles.statsText, isLandscape && styles.statsTextLandscape]}>
            Level: {level}
          </Text>
          <Text style={[styles.statsText, isLandscape && styles.statsTextLandscape]}>
            Score: {score}
          </Text>
          <Text style={[styles.statsText, isLandscape && styles.statsTextLandscape]}>
            ⏱️ {timeLeft}s
          </Text>
        </View>

        <TouchableOpacity style={[styles.button, isLandscape && styles.buttonLandscape]} onPress={resetGame}>
          <FontAwesome name="refresh" size={isLandscape ? 20 : 28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Instructions for web */}
      {Platform.OS === 'web' && (
        <View style={styles.webInstructions}>
          <Text style={styles.instructionsText}>
            Use Arrow Keys to move the ball
          </Text>
        </View>
      )}

      {/* Game area */}
      <View style={[styles.gameArea, { width: gameWidth, height: gameHeight }]}>
        {/* Target zone */}
        <Animated.View
          style={[
            styles.target,
            {
              width: TARGET_SIZE,
              height: TARGET_SIZE,
              left: targetX * gameWidth - TARGET_SIZE / 2,
              top: targetY * gameHeight - TARGET_SIZE / 2,
              backgroundColor: isInTarget ? 'rgba(67, 233, 123, 0.4)' : 'rgba(79, 172, 254, 0.3)',
              borderColor: isInTarget ? '#43E97B' : '#4FACFE',
            },
          ]}
        >
          {/* Progress circle */}
          {isInTarget && (
            <View
              style={[
                styles.progressCircle,
                {
                  width: (timeInTarget / WIN_TIME) * TARGET_SIZE,
                  height: (timeInTarget / WIN_TIME) * TARGET_SIZE,
                },
              ]}
            />
          )}
        </Animated.View>

        {/* Ball */}
        <Animated.View
          style={[
            styles.ball,
            {
              width: BALL_SIZE,
              height: BALL_SIZE,
              transform: [
                {
                  translateX: ballX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-BALL_SIZE / 2, gameWidth - BALL_SIZE / 2],
                  }),
                },
                {
                  translateY: ballY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-BALL_SIZE / 2, gameHeight - BALL_SIZE / 2],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Win message */}
      {gameWon && (
        <View style={styles.winBanner}>
          <Text style={[styles.winText, { fontSize: isLandscape ? 24 : 32 }]}>
            🎉 You Won! 🎉
          </Text>
          <Text style={[styles.winSubtext, { fontSize: isLandscape ? 16 : 20 }]}>
            Final Score: {score}
          </Text>
        </View>
      )}

      {/* Time's up message */}
      {timeLeft === 0 && !gameWon && (
        <View style={styles.winBanner}>
          <Text style={[styles.winText, { fontSize: isLandscape ? 24 : 32 }]}>
            ⏰ Time's Up!
          </Text>
          <Text style={[styles.winSubtext, { fontSize: isLandscape ? 16 : 20 }]}>
            Final Score: {score}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsTextLandscape: {
    fontSize: 14,
  },
  webInstructions: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(79, 172, 254, 0.2)',
    borderRadius: 12,
    marginVertical: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#4FACFE',
    fontWeight: '600',
  },
  gameArea: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  target: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    backgroundColor: 'rgba(67, 233, 123, 0.6)',
    borderRadius: 1000,
  },
  ball: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  winBanner: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(67, 233, 123, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#43E97B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  winText: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  winSubtext: {
    fontWeight: '600',
    color: '#fff',
  },
});
