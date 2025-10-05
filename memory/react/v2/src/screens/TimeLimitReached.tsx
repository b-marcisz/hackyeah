import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Profile } from './ProfileSelection';
import { accountsService } from '../api';

interface TimeLimitReachedProps {
  profile: Profile;
  accountName: string;
  onBackToProfiles: () => void;
  onExtendTime: () => void;
}

export default function TimeLimitReached({ profile, accountName, onBackToProfiles, onExtendTime }: TimeLimitReachedProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [countdown, setCountdown] = useState(10);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto redirect after 10 seconds
  useEffect(() => {
    if (countdown === 0 && !showPinInput) {
      onBackToProfiles();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showPinInput, onBackToProfiles]);

  const handleExtendTime = () => {
    setShowPinInput(true);
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      Alert.alert('Błąd', 'PIN musi składać się z 4 cyfr');
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await accountsService.verifyPin(accountName, pin);

      if (isValid) {
        Alert.alert('Sukces', 'Czas przedłużony!', [
          { text: 'OK', onPress: onExtendTime }
        ]);
      } else {
        Alert.alert('Błąd', 'Nieprawidłowy PIN');
        setPin('');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      Alert.alert('Błąd', 'Nie udało się zweryfikować PIN');
    } finally {
      setIsVerifying(false);
    }
  };

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

        {!showPinInput ? (
          <>
            {/* Countdown */}
            <View style={styles.countdownContainer}>
              <Text style={[styles.countdownText, isLandscape && styles.countdownTextLandscape]}>
                Powrót za {countdown}...
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.extendButton, isLandscape && styles.buttonLandscape]}
                onPress={handleExtendTime}
                activeOpacity={0.7}
              >
                <FontAwesome name="clock-o" size={isLandscape ? 20 : 24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  Przedłuż czas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isLandscape && styles.buttonLandscape]}
                onPress={onBackToProfiles}
                activeOpacity={0.7}
              >
                <FontAwesome name="arrow-left" size={isLandscape ? 20 : 24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  Wyjdź
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* PIN Input */}
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>Wpisz PIN rodzica:</Text>
              <TextInput
                style={styles.pinInput}
                value={pin}
                onChangeText={setPin}
                placeholder="••••"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                editable={!isVerifying}
                autoFocus
              />
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, isLandscape && styles.buttonLandscape, isVerifying && styles.buttonDisabled]}
                onPress={handleVerifyPin}
                disabled={isVerifying || pin.length !== 4}
                activeOpacity={0.7}
              >
                <FontAwesome name="check" size={isLandscape ? 20 : 24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  {isVerifying ? 'Sprawdzam...' : 'Potwierdź'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isLandscape && styles.buttonLandscape]}
                onPress={() => { setShowPinInput(false); setPin(''); }}
                activeOpacity={0.7}
                disabled={isVerifying}
              >
                <FontAwesome name="times" size={isLandscape ? 20 : 24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  Anuluj
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    justifyContent: 'center',
  },
  extendButton: {
    backgroundColor: '#4FACFE',
  },
  confirmButton: {
    backgroundColor: '#43E97B',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  pinContainer: {
    width: '100%',
    marginBottom: 25,
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  pinInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 8,
    width: 150,
  },
});
