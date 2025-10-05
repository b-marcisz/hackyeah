import { StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, TextInput, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Profile } from './ProfileSelection';
import { accountsService } from '../api';

interface TimeLimitReachedProps {
  profile: Profile;
  accountName: string;
  sessionId: string;
  onBackToProfiles: () => void;
  onExtendTime: (extendedMinutes: number) => void;
}

export default function TimeLimitReached({ profile, accountName, sessionId, onBackToProfiles, onExtendTime }: TimeLimitReachedProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [countdown, setCountdown] = useState(10);
  const [showPinInput, setShowPinInput] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Auto redirect after 10 seconds
  useEffect(() => {
    if (countdown === 0 && !showPinInput) {
      onBackToProfiles();
      return;
    }

    if (showPinInput) {
      return; // Don't countdown when PIN input is shown
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showPinInput, onBackToProfiles]);

  const handleExtendTime = () => {
    setShowPinInput(true);
    setCountdown(10); // Reset countdown when showing PIN input
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (!selectedMinutes) {
      Alert.alert('Error', 'Please select time duration');
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await accountsService.verifyPin(accountName, pin);

      if (isValid) {
        // Extend the session time by calling the backend
        await accountsService.extendSessionTime(sessionId, selectedMinutes);

        Alert.alert('Success', `Time extended by ${selectedMinutes} minutes!`, [
          { text: 'OK', onPress: () => onExtendTime(selectedMinutes) }
        ]);
      } else {
        Alert.alert('Error', 'Invalid PIN');
        setPin('');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      Alert.alert('Error', 'Failed to extend time');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, isLandscape && styles.contentLandscape]}>
        {!showPinInput ? (
          <>
            <View style={styles.mainContent}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <FontAwesome name="clock-o" size={isLandscape ? 80 : 100} color="#FF6B9D" />
              </View>

              {/* Message */}
              <View style={[styles.messageBox, isLandscape && styles.messageBoxLandscape]}>
                <Text style={[styles.message, isLandscape && styles.messageLandscape]}>
                  {profile.name}, you've used all your time for today.
                </Text>
                <Text style={[styles.message, isLandscape && styles.messageLandscape]}>
                  Come back tomorrow! 😊
                </Text>
              </View>

              <View style={styles.countdownContainer}>
                <Text style={[styles.countdownText, isLandscape && styles.countdownTextLandscape]}>
                  Returning in {countdown}...
                </Text>
              </View>
            </View>

            {/* Buttons - vertical on landscape */}
            <View style={[styles.buttonsContainer, isLandscape && styles.buttonsContainerLandscape]}>
              <TouchableOpacity
                style={[styles.button, styles.extendButton, isLandscape && styles.buttonLandscape]}
                onPress={handleExtendTime}
                activeOpacity={0.7}
              >
                <FontAwesome name="clock-o" size={isLandscape ? 18 : 24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  {isLandscape ? 'Expand' : 'Extend'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isLandscape && styles.buttonLandscape]}
                onPress={onBackToProfiles}
                activeOpacity={0.7}
              >
                <FontAwesome name="arrow-left" size={isLandscape ? 18 : 24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  Exit
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* PIN Input */}
            <View style={[styles.pinMainContent, isLandscape && styles.pinMainContentLandscape]}>
              <View style={styles.pinContainer}>
                {/* Time selection buttons */}
                <View style={styles.timeSelectionContainer}>
                  {[5, 10, 15].map((minutes) => (
                    <TouchableOpacity
                      key={minutes}
                      style={[
                        styles.timeButton,
                        selectedMinutes === minutes && styles.timeButtonSelected
                      ]}
                      onPress={() => setSelectedMinutes(minutes)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        selectedMinutes === minutes && styles.timeButtonTextSelected
                      ]}>
                        {minutes} min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={[styles.pinInput, isLandscape && styles.pinInputLandscape]}
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
            </View>

            <View style={[styles.buttonsContainer, isLandscape && styles.buttonsContainerLandscape]}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton, isLandscape && styles.buttonLandscape, (isVerifying || pin.length !== 4 || !selectedMinutes) && styles.buttonDisabled]}
                onPress={handleVerifyPin}
                disabled={isVerifying || pin.length !== 4 || !selectedMinutes}
                activeOpacity={0.7}
              >
                <FontAwesome name="check" size={24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  {isVerifying ? 'Checking...' : 'Confirm'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, isLandscape && styles.buttonLandscape]}
                onPress={() => { setShowPinInput(false); setPin(''); setSelectedMinutes(null); }}
                activeOpacity={0.7}
                disabled={isVerifying}
              >
                <FontAwesome name="times" size={24} color="#fff" />
                <Text style={[styles.buttonText, isLandscape && styles.buttonTextLandscape]}>
                  Cancel
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
  contentLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
    maxWidth: 800,
  },
  mainContent: {
    alignItems: 'center',
    flex: 1,
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
    fontSize: 24,
    marginBottom: 15,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageBoxLandscape: {
    padding: 15,
    marginBottom: 20,
  },
  message: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
  },
  messageLandscape: {
    fontSize: 14,
    lineHeight: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonTextLandscape: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    justifyContent: 'center',
  },
  buttonsContainerLandscape: {
    flexDirection: 'column',
    gap: 15,
    width: 'auto',
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
  pinMainContent: {
    alignItems: 'center',
    flex: 1,
  },
  pinMainContentLandscape: {
    flex: 1,
    justifyContent: 'center',
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  pinLabelLandscape: {
    fontSize: 14,
    marginBottom: 8,
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
  pinInputLandscape: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 20,
    width: 130,
  },
  timeSelectionContainer: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 30,
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
    minWidth: 120,
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: '#4FACFE',
    borderColor: '#4FACFE',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeButtonTextSelected: {
    color: '#fff',
  },
});
