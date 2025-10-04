import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Profile } from './ProfileSelection';

interface TimeLimitReachedProps {
  profile: Profile;
  onBackToProfiles: () => void;
}

export default function TimeLimitReached({ profile, onBackToProfiles }: TimeLimitReachedProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [countdown, setCountdown] = useState(5);

  // Auto redirect after 5 seconds
  useEffect(() => {
    if (countdown === 0) {
      onBackToProfiles();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onBackToProfiles]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <FontAwesome name="clock-o" size={isLandscape ? 80 : 100} color="#FF6B9D" />
        </View>

        {/* Message */}
        <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
          Czas gry się skończył!
        </Text>

        <View style={styles.messageBox}>
          <Text style={[styles.message, isLandscape && styles.messageLandscape]}>
            {profile.name}, wykorzystałeś cały czas na dzisiaj.
          </Text>
          <Text style={[styles.message, isLandscape && styles.messageLandscape]}>
            Wróć jutro! 😊
          </Text>
        </View>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Text style={[styles.countdownText, isLandscape && styles.countdownTextLandscape]}>
            Powrót za {countdown}...
          </Text>
        </View>

        {/* Manual back button */}
        <TouchableOpacity
          style={[styles.button, isLandscape && styles.buttonLandscape]}
          onPress={onBackToProfiles}
          activeOpacity={0.7}
        >
          <FontAwesome name="arrow-left" size={isLandscape ? 20 : 24} color="#fff" />
          <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
            Wróć teraz
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 500,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 107, 157, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  titleLandscape: {
    fontSize: 28,
    marginBottom: 20,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  message: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
  },
  messageLandscape: {
    fontSize: 16,
    lineHeight: 22,
  },
  countdownContainer: {
    marginBottom: 25,
  },
  countdownText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  countdownTextLandscape: {
    fontSize: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#6C757D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonLandscape: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonTextLandscape: {
    fontSize: 16,
  },
});
