import { useState } from 'react';
import { View } from 'react-native';
import ProfileSelection, { Profile } from './src/screens/ProfileSelection';
import MemoryGame from './src/games/MemoryGame';

type Screen = 'profile-selection' | 'memory-game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('profile-selection');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    // For now, go directly to memory game
    setCurrentScreen('memory-game');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile-selection':
        return <ProfileSelection onSelectProfile={handleSelectProfile} />;
      case 'memory-game':
        return <MemoryGame />;
      default:
        return <ProfileSelection onSelectProfile={handleSelectProfile} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
}
