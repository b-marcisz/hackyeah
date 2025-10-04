import { StyleSheet, Text, View, TouchableOpacity, TextInput, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

interface PinEntryProps {
  onPinCorrect: () => void;
  onBack: () => void;
}

export default function PinEntry({ onPinCorrect, onBack }: PinEntryProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const CORRECT_PIN = '1234'; // PIN for account "Jan"

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      // Auto-check when 4 digits entered
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === CORRECT_PIN) {
            onPinCorrect();
          } else {
            setError(true);
            setTimeout(() => {
              setPin('');
              setError(false);
            }, 1000);
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <FontAwesome name="arrow-left" size={28} color="rgba(255, 255, 255, 0.7)" />
      </TouchableOpacity>

      <View style={[styles.content, isLandscape && styles.contentLandscape]}>
        <View style={styles.leftSection}>
          <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
            Wprowadź PIN
          </Text>

          {/* PIN dots display */}
          <View style={styles.pinDisplay}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.pinDot,
                  pin.length > i && styles.pinDotFilled,
                  error && styles.pinDotError,
                  isLandscape && styles.pinDotLandscape,
                ]}
              />
            ))}
          </View>

          {error && (
            <Text style={[styles.errorText, isLandscape && styles.errorTextLandscape]}>
              Nieprawidłowy PIN
            </Text>
          )}
        </View>

        {/* Number pad */}
        <View style={[styles.numberPad, isLandscape && styles.numberPadLandscape]}>
          <View style={[styles.numbersGrid, isLandscape && styles.numbersGridLandscape]}>
            {numbers.map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.numberButton, isLandscape && styles.numberButtonLandscape]}
                onPress={() => handleNumberPress(num)}
                activeOpacity={0.7}
              >
                <Text style={[styles.numberText, isLandscape && styles.numberTextLandscape]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Delete button */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, isLandscape && styles.actionButtonLandscape]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <FontAwesome name="arrow-left" size={isLandscape ? 24 : 32} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contentLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 40,
  },
  leftSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  titleLandscape: {
    fontSize: 24,
    marginBottom: 20,
  },
  pinDisplay: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent',
  },
  pinDotLandscape: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  pinDotFilled: {
    backgroundColor: '#4FACFE',
    borderColor: '#4FACFE',
  },
  pinDotError: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  errorText: {
    color: '#FF6B9D',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  errorTextLandscape: {
    fontSize: 14,
    marginBottom: 0,
  },
  numberPad: {
    alignItems: 'center',
  },
  numberPadLandscape: {
    alignItems: 'center',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    gap: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },
  numbersGridLandscape: {
    width: 240,
    gap: 10,
    marginBottom: 15,
  },
  numberButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonLandscape: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  numberText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  numberTextLandscape: {
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C757D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonLandscape: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionTextLandscape: {
    fontSize: 20,
  },
});
