import { useState, useEffect } from 'react';
import { View, StatusBar, ActivityIndicator, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import SplashScreen from './src/screens/SplashScreen';
import AccountSetup from './src/screens/AccountSetup';
import AccountLogin from './src/screens/AccountLogin';
import ProfileSelection, { Profile } from './src/screens/ProfileSelection';
import GameDashboard from './src/screens/GameDashboard';
import MemoryGame from './src/games/MemoryGame';
import MemoryLessGame from './src/games/MemoryLessGame';
import PinEntry from './src/screens/PinEntry';
import AdminPanel from './src/screens/AdminPanel';
import TimeLimitReached from './src/screens/TimeLimitReached';
import { useProfiles } from './src/hooks/useProfiles';
import { getStoredAccount, saveAccount } from './src/utils/storage';

type Screen = 'loading' | 'splash' | 'account-login' | 'account-setup' | 'profile-selection' | 'game-dashboard' | 'memory-game' | 'memory-less-game' | 'pin-entry' | 'admin-panel' | 'time-limit-reached';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [adminTab, setAdminTab] = useState<'settings' | 'add-profile'>('settings');
  const [verifiedPin, setVerifiedPin] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string>(''); // Will be loaded from storage or set during login/registration
  const [sessionId, setSessionId] = useState<string | null>(null); // Store session ID for extending time

  // Fetch profiles from API
  const { profiles, refreshProfiles } = useProfiles(accountName);

  // Hide navigation bar on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
      NavigationBar.setBackgroundColorAsync('#141414');
    }
  }, []);

  // Check if account exists in storage on app start
  useEffect(() => {
    checkStoredAccount();
  }, []);

  const checkStoredAccount = async () => {
    const storedAccount = await getStoredAccount();
    if (storedAccount) {
      // Account exists, set it and show splash
      setAccountName(storedAccount.name);
      setCurrentScreen('splash');
    } else {
      // No account, show login screen (user can choose to login or create new)
      setCurrentScreen('account-login');
    }
  };

  const handleAccountCreated = async (name: string, pin: string) => {
    await saveAccount(name, pin);
    setAccountName(name);
    setCurrentScreen('splash');
  };

  const handleLoginSuccess = async (name: string, pin: string) => {
    await saveAccount(name, pin);
    setAccountName(name);
    setCurrentScreen('splash');
  };

  const handleShowLogin = () => {
    setCurrentScreen('account-login');
  };

  const handleShowSetup = () => {
    setCurrentScreen('account-setup');
  };

  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setCurrentScreen('game-dashboard');
  };

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'memory') {
      setCurrentScreen('memory-game');
    } else if (gameId === 'memory-less') {
      setCurrentScreen('memory-less-game');
    }
    // TODO: Add other games
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
    setCurrentScreen('profile-selection');
  };

  const handleBackToGameDashboard = () => {
    setCurrentScreen('game-dashboard');
  };

  const handleOpenSettings = () => {
    setAdminTab('settings');
    setCurrentScreen('pin-entry');
  };

  const handleAddProfile = () => {
    setAdminTab('add-profile');
    setCurrentScreen('pin-entry');
  };

  const handlePinCorrect = (pin: string) => {
    setVerifiedPin(pin);
    setCurrentScreen('admin-panel');
  };

  const handleBackFromPin = () => {
    setCurrentScreen('profile-selection');
  };

  const handleBackFromAdmin = () => {
    setVerifiedPin(null);
    setCurrentScreen('profile-selection');
  };

  const handleTimeLimitReached = (currentSessionId: string) => {
    setSessionId(currentSessionId);
    setCurrentScreen('time-limit-reached');
  };

  const handleSplashContinue = () => {
    setCurrentScreen('profile-selection');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'loading':
        return (
          <View style={{ flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#4FACFE" />
          </View>
        );
      case 'account-login':
        return <AccountLogin onLoginSuccess={handleLoginSuccess} onCreateNew={handleShowSetup} />;
      case 'account-setup':
        return <AccountSetup onAccountCreated={handleAccountCreated} onHaveAccount={handleShowLogin} />;
      case 'splash':
        return <SplashScreen onContinue={handleSplashContinue} />;
      case 'profile-selection':
        return (
          <ProfileSelection
            onSelectProfile={handleSelectProfile}
            onOpenSettings={handleOpenSettings}
            onAddProfile={handleAddProfile}
          />
        );
      case 'game-dashboard':
        return selectedProfile ? (
          <GameDashboard
            profile={selectedProfile}
            accountName={accountName}
            onSelectGame={handleSelectGame}
            onBackToProfiles={handleBackToProfiles}
            onTimeExpired={handleTimeLimitReached}
          />
        ) : (
          <ProfileSelection
            onSelectProfile={handleSelectProfile}
            onOpenSettings={handleOpenSettings}
            onAddProfile={handleAddProfile}
          />
        );
      case 'memory-game':
        return <MemoryGame onBack={handleBackToGameDashboard} />;
      case 'memory-less-game':
        return <MemoryLessGame onBack={handleBackToGameDashboard} />;
      case 'pin-entry':
        return (
          <PinEntry
            onPinCorrect={handlePinCorrect}
            onBack={handleBackFromPin}
          />
        );
      case 'admin-panel':
        return verifiedPin ? (
          <AdminPanel
            profiles={profiles}
            onBack={handleBackFromAdmin}
            initialTab={adminTab}
            onProfileAdded={refreshProfiles}
            pin={verifiedPin}
            accountName={accountName}
          />
        ) : (
          <ProfileSelection
            onSelectProfile={handleSelectProfile}
            onOpenSettings={handleOpenSettings}
            onAddProfile={handleAddProfile}
          />
        );
      case 'time-limit-reached':
        return selectedProfile && sessionId ? (
          <TimeLimitReached
            profile={selectedProfile}
            accountName={accountName}
            sessionId={sessionId}
            onBackToProfiles={handleBackToProfiles}
            onExtendTime={(extendedMinutes) => {
              // Go back to game dashboard with refreshed session
              // The extended minutes info is passed but GameDashboard will refresh from backend
              setCurrentScreen('game-dashboard');
            }}
          />
        ) : (
          <ProfileSelection
            onSelectProfile={handleSelectProfile}
            onOpenSettings={handleOpenSettings}
            onAddProfile={handleAddProfile}
          />
        );
      default:
        return (
          <ProfileSelection
            onSelectProfile={handleSelectProfile}
            onOpenSettings={handleOpenSettings}
            onAddProfile={handleAddProfile}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      {renderScreen()}
    </View>
  );
}
