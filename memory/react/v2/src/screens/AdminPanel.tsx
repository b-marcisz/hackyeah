import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions, Switch, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Profile } from './ProfileSelection';
import { accountsService, UserRole, ProfileColor } from '../api';

interface AdminPanelProps {
  profiles: Profile[];
  onBack: () => void;
  initialTab?: 'settings' | 'add-profile';
  onProfileAdded?: () => void; // Callback to refresh profiles
  pin: string; // Verified PIN for API calls
  accountName: string; // Account name for API calls
}

interface TimeLimit {
  profileId: string;
  enabled: boolean;
  maxMinutesPerDay: number;
}

export default function AdminPanel({ profiles, onBack, initialTab = 'settings', onProfileAdded, pin, accountName }: AdminPanelProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [activeTab, setActiveTab] = useState<'settings' | 'add-profile'>(initialTab);

  // Initialize time limits from profile settings
  const [timeLimits, setTimeLimits] = useState<TimeLimit[]>(
    profiles.map(p => ({
      profileId: p.id,
      enabled: false,
      maxMinutesPerDay: p.settings?.timeLimit || 30,
    }))
  );

  // Track expanded profile cards
  const [expandedProfiles, setExpandedProfiles] = useState<Set<string>>(new Set());

  // New profile form state
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#F093FB');
  const [isAddingProfile, setIsAddingProfile] = useState(false);

  // Update time limits when profiles change
  useEffect(() => {
    console.log('Profiles changed, updating timeLimits:', profiles.map(p => ({ id: p.id, name: p.name, timeLimit: p.settings?.timeLimit })));
    setTimeLimits(
      profiles.map(p => ({
        profileId: p.id,
        enabled: false,
        maxMinutesPerDay: p.settings?.timeLimit || 30,
      }))
    );
  }, [profiles]);

  const toggleProfileExpanded = (profileId: string) => {
    setExpandedProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  const updateTimeLimit = async (profileId: string, minutes: number) => {
    // Update local state immediately
    setTimeLimits(prev => prev.map(limit =>
      limit.profileId === profileId
        ? { ...limit, maxMinutesPerDay: minutes }
        : limit
    ));

    // Update in backend
    try {
      await accountsService.updateUser(accountName, profileId, {
        settings: {
          timeLimit: minutes,
        },
      }, pin);

      console.log(`Successfully updated timeLimit to ${minutes} for profile ${profileId}`);

      // Don't refresh immediately - the local state is already updated
      // Profile data will be refreshed when user navigates away and back
    } catch (error) {
      console.error('Error updating time limit:', error);
      Alert.alert('Error', 'Failed to update time limit');

      // Revert local state on error
      setTimeLimits(prev => prev.map(limit =>
        limit.profileId === profileId
          ? { ...limit, maxMinutesPerDay: limit.maxMinutesPerDay }
          : limit
      ));
    }
  };

  const handleDeleteProfile = async (profileId: string, profileName: string) => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete "${profileName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await accountsService.deleteUser(accountName, profileId);
              Alert.alert('Success', `Profile "${profileName}" deleted successfully!`);

              // Refresh profiles list
              if (onProfileAdded) {
                onProfileAdded();
              }
            } catch (error: any) {
              console.error('Error deleting profile:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete profile');
            }
          },
        },
      ]
    );
  };

  const timeLimitOptions = [15, 30, 45, 60, 90, 120];
  const profileColors = ['#F093FB', '#4FACFE', '#43E97B', '#FF6B9D', '#FFA502', '#A29BFE'];

  // Map hex colors to ProfileColor enum
  const colorHexToEnum: Record<string, ProfileColor> = {
    '#F093FB': ProfileColor.PINK_PURPLE,
    '#4FACFE': ProfileColor.BLUE,
    '#43E97B': ProfileColor.GREEN,
    '#FF6B9D': ProfileColor.PINK,
    '#FFA502': ProfileColor.ORANGE,
    '#A29BFE': ProfileColor.LAVENDER,
  };

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    setIsAddingProfile(true);
    try {
      // Add user to account
      const result = await accountsService.addUser(accountName, {
        name: newProfileName.trim(),
        role: UserRole.USER,
        color: colorHexToEnum[selectedColor],
        settings: {
          timeLimit: 30, // Default 30 minutes
        },
      }, pin);

      console.log('Profile added, API response:', result);

      Alert.alert('Success', `Profile "${newProfileName}" added successfully!`);

      // Clear form
      setNewProfileName('');
      setSelectedColor('#F093FB');

      // Refresh profiles list
      if (onProfileAdded) {
        onProfileAdded();
      }

      // Switch to settings tab
      setActiveTab('settings');
    } catch (error: any) {
      console.error('Error adding profile:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add profile. Please try again.');
    } finally {
      setIsAddingProfile(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs with back button */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <FontAwesome name="arrow-left" size={24} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="cog"
            size={20}
            color={activeTab === 'settings' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'add-profile' && styles.tabActive]}
          onPress={() => setActiveTab('add-profile')}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="user-plus"
            size={20}
            color={activeTab === 'add-profile' ? '#fff' : 'rgba(255, 255, 255, 0.5)'}
          />
          <Text style={[styles.tabText, activeTab === 'add-profile' && styles.tabTextActive]}>
            Add Profile
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'settings' && profiles.map((profile) => {
          const limit = timeLimits.find(l => l.profileId === profile.id);
          if (!limit) return null;

          return (
            <View key={profile.id} style={styles.profileCard}>
              {/* Profile header - clickable to expand/collapse */}
              <TouchableOpacity
                style={styles.profileHeader}
                onPress={() => toggleProfileExpanded(profile.id)}
                activeOpacity={0.7}
              >
                <View style={styles.profileInfo}>
                  <View
                    style={[
                      styles.profileAvatar,
                      { backgroundColor: profile.color }
                    ]}
                  >
                    <Text style={styles.profileInitial}>
                      {profile.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.profileName}>{profile.name}</Text>
                </View>
                <FontAwesome
                  name={expandedProfiles.has(profile.id) ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="rgba(255, 255, 255, 0.5)"
                />
              </TouchableOpacity>

              {/* Collapsed settings */}
              {expandedProfiles.has(profile.id) && (
                <View style={styles.timeLimitSettings}>
                  <Text style={styles.settingLabel}>
                    Czas gry dziennie:
                  </Text>
                  <View style={styles.timeOptions}>
                    {timeLimitOptions.map((minutes) => (
                      <TouchableOpacity
                        key={minutes}
                        style={[
                          styles.timeOption,
                          limit.maxMinutesPerDay === minutes && styles.timeOptionActive,
                          isLandscape && styles.timeOptionLandscape,
                        ]}
                        onPress={() => updateTimeLimit(profile.id, minutes)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.timeOptionText,
                            limit.maxMinutesPerDay === minutes && styles.timeOptionTextActive,
                          ]}
                        >
                          {minutes} min
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.infoBox}>
                    <FontAwesome name="info-circle" size={16} color="#4FACFE" />
                    <Text style={styles.infoText}>
                      Child will be able to play maximum {limit.maxMinutesPerDay} minutes daily
                    </Text>
                  </View>

                  {/* Delete button */}
                  <TouchableOpacity
                    style={styles.deleteProfileButton}
                    onPress={() => handleDeleteProfile(profile.id, profile.name)}
                    activeOpacity={0.7}
                  >
                    <FontAwesome name="trash" size={18} color="#FF6B6B" />
                    <Text style={styles.deleteProfileText}>Delete Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {activeTab === 'settings' && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Settings are saved automatically
            </Text>
          </View>
        )}

        {/* Add Profile Tab */}
        {activeTab === 'add-profile' && (
          <View style={styles.addProfileContainer}>
            <Text style={styles.sectionTitle}>New Child Profile</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Child's Name</Text>
              <TextInput
                style={styles.input}
                value={newProfileName}
                onChangeText={setNewProfileName}
                placeholder="Enter name..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                maxLength={20}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Choose Color</Text>
              <View style={styles.colorPicker}>
                {profileColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    activeOpacity={0.7}
                  >
                    {selectedColor === color && (
                      <FontAwesome name="check" size={24} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.label}>Preview</Text>
              <View style={styles.previewCard}>
                <View
                  style={[
                    styles.previewAvatar,
                    { backgroundColor: selectedColor }
                  ]}
                >
                  <Text style={styles.previewInitial}>
                    {newProfileName ? newProfileName.charAt(0).toUpperCase() : '?'}
                  </Text>
                </View>
                <Text style={styles.previewName}>
                  {newProfileName || 'No name'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                !newProfileName.trim() && styles.addButtonDisabled
              ]}
              onPress={handleAddProfile}
              disabled={!newProfileName.trim() || isAddingProfile}
              activeOpacity={0.7}
            >
              <FontAwesome name="plus-circle" size={24} color="#fff" />
              <Text style={styles.addButtonText}>
                {isAddingProfile ? 'Adding...' : 'Add Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeLimitSettings: {
    paddingTop: 20,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  timeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeOptionLandscape: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  timeOptionActive: {
    backgroundColor: '#4FACFE',
    borderColor: '#4FACFE',
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeOptionTextActive: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    padding: 12,
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
  deleteProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  deleteProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 50,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#4FACFE',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabTextActive: {
    color: '#fff',
  },
  addProfileContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  formGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#fff',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#fff',
  },
  previewSection: {
    marginBottom: 30,
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  previewInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#4FACFE',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#4FACFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#6C757D',
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
