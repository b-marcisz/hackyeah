import {ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, ActivityIndicator} from 'react-native';
import {useState} from 'react';
import UserAvatar from 'react-native-user-avatar';
import { FontAwesome } from '@expo/vector-icons';
import { useProfiles } from '../hooks/useProfiles';

export interface Profile {
  id: string;
  name: string;
  type: 'parent' | 'child';
  color: string;
  role?: 'admin' | 'user'; // From backend
  age?: number; // From backend
  accountId?: string; // From backend
}

interface ProfileSelectionProps {
  onSelectProfile: (profile: Profile) => void;
  onOpenSettings?: () => void;
  onAddProfile?: () => void;
}

export default function ProfileSelection({ onSelectProfile, onOpenSettings, onAddProfile }: ProfileSelectionProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Fetch profiles from API
  const { profiles, loading, error, refreshProfiles } = useProfiles();

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

      <Text style={[styles.title, isLandscape && styles.titleLandscape]}>Who's playing?</Text>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4FACFE" />
          <Text style={styles.loadingText}>Loading profiles...</Text>
        </View>
      )}

      {/* Error message */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={48} color="#FF6B9D" />
          <Text style={styles.errorText}>Could not load profiles</Text>
          <Text style={styles.errorSubtext}>Using offline data</Text>
        </View>
      )}

      {/* Profiles list */}
      {!loading && (
        <ScrollView
          horizontal={isLandscape && profiles.length > 3}
          contentContainerStyle={[
            styles.profilesContainer,
            isLandscape && styles.profilesContainerLandscape,
            isLandscape && profiles.length > 3 && styles.profilesContainerHorizontal
          ]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
          <Text style={styles.addText}>Add profile</Text>
        </TouchableOpacity>
        </ScrollView>
      )}
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
  profilesContainerHorizontal: {
    flexWrap: 'nowrap',
    paddingHorizontal: 20,
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
