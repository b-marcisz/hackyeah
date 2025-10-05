import { Modal, View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface TimeWarningModalProps {
  visible: boolean;
  remainingMinutes: number;
  onClose: () => void;
}

export default function TimeWarningModal({ visible, remainingMinutes, onClose }: TimeWarningModalProps) {
  const { width } = useWindowDimensions();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Pulse animation for clock
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0);
      pulseAnim.setValue(1);
    }
  }, [visible, onClose]);

  const getWarningColor = () => {
    if (remainingMinutes <= 1) return '#FF6B6B';
    if (remainingMinutes <= 5) return '#FFA500';
    return '#4FACFE';
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: getWarningColor(),
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <FontAwesome name="clock-o" size={80} color="#fff" />
          </Animated.View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeNumber}>{remainingMinutes}</Text>
            <Text style={styles.timeLabel}>min</Text>
          </View>

          {/* Visual dots for auto-close countdown */}
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    minHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 30,
    gap: 8,
  },
  timeNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeLabel: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});
