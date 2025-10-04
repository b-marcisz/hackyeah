import {ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {useState} from 'react';
import UserAvatar from 'react-native-user-avatar';
import { FontAwesome } from '@expo/vector-icons';

export interface Profile {
  id: string;
  name: string;
  type: 'parent' | 'child';
  color: string;
}

interface ProfileSelectionProps {
  onSelectProfile: (profile: Profile) => void;
  onOpenSettings?: () => void;
  onAddProfile?: () => void;
}

export default function ProfileSelection({ onSelectProfile, onOpenSettings, onAddProfile }: ProfileSelectionProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'Kasia', type: 'child', color: '#F093FB' },
    { id: '2', name: 'Tomek', type: 'child', color: '#4FACFE' },
  ]);

  const handleAddProfile = () => {
    if (onAddProfile) {
      onAddProfile();
    }
  };

  return (
    <View style={styles.container}>
      {/* Settings icon */}
      {onOpenSettings && (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onOpenSettings}
          activeOpacity={0.7}
        >
          <FontAwesome name="gear" size={32} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
      )}

      <Text style={[styles.title, isLandscape && styles.titleLandscape]}>Kto gra?</Text>

      <ScrollView
        contentContainerStyle={[
          styles.profilesContainer,
          isLandscape && styles.profilesContainerLandscape
        ]}
        showsVerticalScrollIndicator={false}
      >
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.profileCard,
              isLandscape && styles.profileCardLandscape
            ]}
            onPress={() => onSelectProfile(profile)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarWrapper}>
              <UserAvatar
                size={110}
                name={profile.name}
                bgColor={profile.color}
                textColor="#FFFFFF"
                textStyle={{ fontSize: 48, fontWeight: 'bold' }}
              />
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.addProfileCard,
            isLandscape && styles.profileCardLandscape
          ]}
          onPress={handleAddProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Dodaj profil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  titleLandscape: {
    fontSize: 32,
    marginBottom: 25,
  },
  profilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 40,
  },
  profilesContainerLandscape: {
    gap: 20,
    paddingBottom: 25,
    alignItems: 'center',
  },
  profileCard: {
    width: 180,
    height: 200,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileCardLandscape: {
    width: 160,
    height: 180,
    padding: 15,
  },
  avatarWrapper: {
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
    borderRadius: 55,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  addProfileCard: {
    width: 180,
    height: 200,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  addIcon: {
    fontSize: 60,
    color: '#fff',
    marginBottom: 10,
  },
  addText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
