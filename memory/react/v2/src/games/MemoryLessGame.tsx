import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface MemoryLessGameProps {
  onBack?: () => void;
}

export default function MemoryLessGame({ onBack }: MemoryLessGameProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Redirect to UI application
    handleRedirectToUI();
  }, []);

  const handleRedirectToUI = async () => {
    try {
      setIsRedirecting(true);
      const uiUrl = 'http://localhost:3002/course?mode=study';
      
      console.log('Attempting to open UI URL:', uiUrl);
      
      // For web version, use window.location.href instead of Linking
      if (typeof window !== 'undefined') {
        console.log('Using window.location.href for web version');
        window.location.href = uiUrl;
        console.log('URL opened with window.location.href');
        return;
      }
      
      // Check if we can open the URL
      const canOpen = await Linking.canOpenURL(uiUrl);
      console.log('Can open URL:', canOpen);
      
      if (canOpen) {
        console.log('Opening URL...');
        await Linking.openURL(uiUrl);
        console.log('URL opened successfully');
      } else {
        console.log('Cannot open URL, showing alert');
        Alert.alert(
          'Nie można otworzyć',
          `Nie można otworzyć aplikacji UI: ${uiUrl}. Sprawdź czy serwer działa na porcie 3002.`,
          [
            { text: 'OK', onPress: handleExit }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening UI app:', error);
      Alert.alert(
        'Błąd',
        `Nie można otworzyć aplikacji UI: ${error instanceof Error ? error.message : String(error)}`,
        [
          { text: 'OK', onPress: handleExit }
        ]
      );
    } finally {
      setIsRedirecting(false);
    }
  };

  const handleExit = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleExit}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Memory Less</Text>
        <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
          <FontAwesome name="times" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Simple exit button */}
      <View style={styles.simpleExitContainer}>
        <TouchableOpacity style={styles.simpleExitButton} onPress={handleExit}>
          <Text style={styles.simpleExitText}>← ВЫХОД</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.redirectContainer}>
        <Text style={styles.redirectTitle}>
          {isRedirecting ? 'Przekierowywanie...' : 'Otwieranie aplikacji UI'}
        </Text>
        <Text style={styles.redirectSubtitle}>
          Aplikacja Memory Less zostanie otwarta w UI
        </Text>
        
        {isRedirecting && (
          <ActivityIndicator size="large" color="#4FACFE" style={styles.loader} />
        )}
        
        {!isRedirecting && (
          <TouchableOpacity style={styles.retryButton} onPress={handleRedirectToUI}>
            <Text style={styles.retryButtonText}>Otwórz ponownie</Text>
          </TouchableOpacity>
        )}

        {/* Manual redirect button */}
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: '#00ff00', marginTop: 10 }]} 
          onPress={() => {
            const url = 'http://localhost:3002/course?mode=study';
            console.log('Manual redirect to UI:', url);
            if (typeof window !== 'undefined') {
              window.location.href = url;
            }
          }}
        >
          <Text style={styles.retryButtonText}>Manual Redirect to UI</Text>
        </TouchableOpacity>
        
        {/* Exit buttons - always visible */}
        <View style={styles.exitButtonsContainer}>
          <TouchableOpacity style={styles.exitButtonLarge} onPress={handleExit}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
            <Text style={styles.exitButtonText}>Wróć do listy gier</Text>
          </TouchableOpacity>

          {/* Additional debug button */}
          <TouchableOpacity style={styles.debugButton} onPress={handleExit}>
            <Text style={styles.debugButtonText}>ВЫХОД (DEBUG)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exit button in bottom right corner */}
      <TouchableOpacity style={styles.bottomRightExitButton} onPress={handleExit}>
        <FontAwesome name="home" size={20} color="#fff" />
        <Text style={styles.bottomRightExitText}>Exit</Text>
      </TouchableOpacity>

      {/* Additional test button for debugging */}
      <TouchableOpacity style={styles.testButton} onPress={handleExit}>
        <Text style={styles.testButtonText}>TEST EXIT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  exitButton: {
    padding: 10,
  },
  simpleExitContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  simpleExitButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  simpleExitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  redirectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  redirectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  redirectSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  loader: {
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: '#4FACFE',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  exitButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  debugButton: {
    backgroundColor: '#ff0000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomRightExitButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff0000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  bottomRightExitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  testButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: '#ff0000',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    zIndex: 1000,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
