import { useState } from 'react';
import { View } from 'react-native';
import ProfileSelection, { Profile } from './src/screens/ProfileSelection';
import GameDashboard from './src/screens/GameDashboard';
import MemoryGame from './src/games/MemoryGame';
import PinEntry from './src/screens/PinEntry';
import AdminPanel from './src/screens/AdminPanel';
import TimeLimitReached from './src/screens/TimeLimitReached';

type Screen = 'profile-selection' | 'game-dashboard' | 'memory-game' | 'pin-entry' | 'admin-panel' | 'time-limit-reached';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('profile-selection');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [adminTab, setAdminTab] = useState<'settings' | 'add-profile'>('settings');

  // Mock profiles list for admin panel
  const profiles: Profile[] = [
    { id: '1', name: 'Kasia', type: 'child', color: '#F093FB' },
    { id: '2', name: 'Tomek', type: 'child', color: '#4FACFE' },
  ];

  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setCurrentScreen('game-dashboard');
  };

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'memory') {
      setCurrentScreen('memory-game');
    }
    // TODO: Add other games
  };

  const handleBackToProfiles = () => {
    setSelectedProfile(null);
    setCurrentScreen('profile-selection');
  };

  const handleOpenSettings = () => {
    setAdminTab('settings');
    setCurrentScreen('pin-entry');
  };

  const handleAddProfile = () => {
    setAdminTab('add-profile');
    setCurrentScreen('pin-entry');
  };

  const handlePinCorrect = () => {
    setCurrentScreen('admin-panel');
  };

  const handleBackFromPin = () => {
    setCurrentScreen('profile-selection');
  };

  const handleBackFromAdmin = () => {
    setCurrentScreen('profile-selection');
  };

  const handleTimeLimitReached = () => {
    setCurrentScreen('time-limit-reached');
  };

  const renderScreen = () => {
    switch (currentScreen) {
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
            onSelectGame={handleSelectGame}
            onBackToProfiles={handleBackToProfiles}
          />
        ) : (
          <ProfileSelection
            onSelectProfile={handleSelectProfile}
            onOpenSettings={handleOpenSettings}
            onAddProfile={handleAddProfile}
          />
        );
      case 'memory-game':
        return <MemoryGame />;
      case 'pin-entry':
        return (
          <PinEntry
            onPinCorrect={handlePinCorrect}
            onBack={handleBackFromPin}
          />
        );
      case 'admin-panel':
        return (
          <AdminPanel
            profiles={profiles}
            onBack={handleBackFromAdmin}
            initialTab={adminTab}
          />
        );
      case 'time-limit-reached':
        return selectedProfile ? (
          <TimeLimitReached
            profile={selectedProfile}
            onBackToProfiles={handleBackToProfiles}
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

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
}
