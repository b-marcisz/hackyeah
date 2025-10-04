import { StyleSheet, View, TouchableOpacity, Image, useWindowDimensions, Platform, Animated, StatusBar } from 'react-native';
import { useEffect, useCallback, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pulsing animation for the icon
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [fadeAnim]);

  // Gamepad support (web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    let intervalId: NodeJS.Timeout;

    const pollGamepad = () => {
      if (!navigator.getGamepads) return;
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      if (!gamepad) return;

      // Any button press
      if (gamepad.buttons.some(button => button.pressed)) {
        onContinue();
      }
    };

    intervalId = setInterval(pollGamepad, 150);
    return () => clearInterval(intervalId);
  }, [onContinue]);

  // Keyboard support
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Any key press continues
      onContinue();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onContinue]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onContinue}
      activeOpacity={1}
    >
      <StatusBar hidden={true} />
      <Image
        source={isLandscape
          ? require('../../assets/brainio.png')
          : require('../../assets/brainio-mobile.png')
        }
        style={[
          styles.splashImage,
          { width, height }
        ]}
        resizeMode={isLandscape ? "cover" : "contain"}
      />

      {/* Pulsing touch indicator */}
      <Animated.View style={[styles.touchIndicator, { opacity: fadeAnim }]}>
        <FontAwesome name="hand-pointer-o" size={48} color="#fff" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7951D',
  },
  splashImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  touchIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 20,
  },
});
