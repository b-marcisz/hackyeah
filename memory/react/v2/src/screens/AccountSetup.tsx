import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, useWindowDimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { accountsService } from '../api';

interface AccountSetupProps {
  onAccountCreated: (accountName: string, pin: string) => void;
  onHaveAccount: () => void;
}

export default function AccountSetup({ onAccountCreated, onHaveAccount }: AccountSetupProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [accountName, setAccountName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAccount = async () => {
    // Validation
    if (!accountName.trim()) {
      Alert.alert('Error', 'Please enter account name');
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    setIsCreating(true);
    try {
      // Create account via API
      await accountsService.createAccount({
        name: accountName.trim(),
        code: pin,
      });

      Alert.alert('Success', 'Account created!', [
        {
          text: 'OK',
          onPress: () => onAccountCreated(accountName.trim(), pin),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create account. Try again.');
    } finally {
      setIsCreating(false);
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
            Welcome!
          </Text>
          <Text style={[styles.subtitle, isLandscape && styles.subtitleLandscape]}>
            Create account to get started
          </Text>

          <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Account name</Text>
            <TextInput
              style={styles.input}
              value={accountName}
              onChangeText={setAccountName}
              placeholder="e.g. Smith Family"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              autoCapitalize="words"
              editable={!isCreating}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PIN (4 digits)</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={setPin}
              placeholder="••••"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              editable={!isCreating}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm PIN</Text>
            <TextInput
              style={styles.input}
              value={confirmPin}
              onChangeText={setConfirmPin}
              placeholder="••••"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              editable={!isCreating}
            />
          </View>

          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.createButtonDisabled]}
            onPress={handleCreateAccount}
            activeOpacity={0.7}
            disabled={isCreating}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? 'Creating...' : 'Create account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.haveAccountButton}
            onPress={onHaveAccount}
            activeOpacity={0.7}
            disabled={isCreating}
          >
            <Text style={styles.haveAccountText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>

          <View style={styles.infoBox}>
            <FontAwesome name="info-circle" size={16} color="#4FACFE" />
            <Text style={styles.infoText}>
              PIN will be needed to manage children's profiles
            </Text>
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
  createButton: {
    backgroundColor: '#4FACFE',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  haveAccountButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  haveAccountText: {
    fontSize: 16,
    color: '#4FACFE',
    textDecorationLine: 'underline',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4FACFE',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
});
