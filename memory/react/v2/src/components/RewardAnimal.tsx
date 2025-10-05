import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface RewardAnimalProps {
  visible: boolean;
  animalNumber?: 1 | 2;
  onComplete?: () => void;
}

// Import SVGs as strings
const animal1 = require('../../assets/animals/1.svg');
const animal2 = require('../../assets/animals/2.svg');

export default function RewardAnimal({ visible, animalNumber = 1, onComplete }: RewardAnimalProps) {
  const { width, height } = useWindowDimensions();
  const translateXAnim = useRef(new Animated.Value(-300)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Random entry animation
      const randomSide = Math.random() > 0.5 ? 1 : -1;
      const randomY = (Math.random() - 0.5) * height * 0.6;

      translateXAnim.setValue(randomSide * -width);
      translateYAnim.setValue(randomY);
      scaleAnim.setValue(0);

      // Animate in, stay, then animate out
      Animated.sequence([
        // Enter with bounce
        Animated.parallel([
          Animated.spring(translateXAnim, {
            toValue: 0,
            tension: 30,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        // Stay and wiggle
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: -1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 2 }
          ),
        ]),
        // Exit by running away
        Animated.parallel([
          Animated.timing(translateXAnim, {
            toValue: randomSide * width * 1.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg'],
  });

  // SVG as Image (for web compatibility, we'll use emoji fallback)
  const animalEmoji = animalNumber === 1 ? '🐰' : '🐼';

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.animal,
          {
            transform: [
              { translateX: translateXAnim },
              { translateY: translateYAnim },
              { scale: scaleAnim },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <Image
          source={animalNumber === 1 ? animal1 : animal2}
          style={styles.animalImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  animal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  animalImage: {
    width: 200,
    height: 200,
  },
});
