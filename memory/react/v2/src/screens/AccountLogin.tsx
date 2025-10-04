import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, useWindowDimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { accountsService } from '../api';

interface AccountLoginProps {
  onLoginSuccess: (accountName: string, pin: string) => void;
  onCreateNew: () => void;
}

export default function AccountLogin({ onLoginSuccess, onCreateNew }: AccountLoginProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [accountName, setAccountName] = useState('');
  const [pin, setPin] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!accountName.trim()) {
      Alert.alert('Błąd', 'Podaj nazwę konta');
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      Alert.alert('Błąd', 'PIN musi składać się z 4 cyfr');
      return;
    }

    setIsLoggingIn(true);
    try {
      const isValid = await accountsService.verifyPin(accountName.trim(), pin);

      if (isValid) {
        onLoginSuccess(accountName.trim(), pin);
      } else {
        Alert.alert('Błąd', 'Nieprawidłowa nazwa konta lub PIN');
      }
    } catch (error: any) {
      console.error('Error logging in:', error);
      Alert.alert('Błąd', 'Nie udało się zalogować. Sprawdź nazwę konta i PIN.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
            Witaj ponownie!
          </Text>
          <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
            Zaloguj się do swojego konta
          </Text>

          <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nazwa konta</Text>
            <TextInput
              style={styles.input}
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Wpisz nazwę konta"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              autoCapitalize="words"
              editable={!isLoggingIn}
              autoFocus
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PIN (4 cyfry)</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder="••••"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              editable={!isLoggingIn}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.7}
            disabled={isLoggingIn}
          >
            <Text style={styles.loginButtonText}>
              {isLoggingIn ? 'Logowanie...' : 'Zaloguj się'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createNewButton}
            onPress={onCreateNew}
            activeOpacity={0.7}
            disabled={isLoggingIn}
          >
            <Text style={styles.createNewText}>
              Nie masz konta? Utwórz nowe
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  titleLandscape: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitleLandscape: {
    fontSize: 14,
    marginBottom: 20,
  },
  form: {
    gap: 15,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pinInput: {
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  loginButton: {
    backgroundColor: '#4FACFE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  createNewButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  createNewText: {
    fontSize: 16,
    color: '#4FACFE',
    textDecorationLine: 'underline',
  },
});
