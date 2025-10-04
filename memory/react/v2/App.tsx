import { useState } from 'react';
import { View } from 'react-native';
import ProfileSelection, { Profile } from './src/screens/ProfileSelection';
import GameDashboard from './src/screens/GameDashboard';
import MemoryGame from './src/games/MemoryGame';

type Screen = 'profile-selection' | 'game-dashboard' | 'memory-game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('profile-selection');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile-selection':
        return <ProfileSelection onSelectProfile={handleSelectProfile} />;
      case 'game-dashboard':
        return selectedProfile ? (
          <GameDashboard profile={selectedProfile} onSelectGame={handleSelectGame} />
        ) : (
          <ProfileSelection onSelectProfile={handleSelectProfile} />
        );
      case 'memory-game':
        return <MemoryGame />;
      default:
        return <ProfileSelection onSelectProfile={handleSelectProfile} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
}
