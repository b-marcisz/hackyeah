import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions, Switch, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Profile } from './ProfileSelection';
import { accountsService, UserRole, ProfileColor } from '../api';

interface AdminPanelProps {
  profiles: Profile[];
  onBack: () => void;
  initialTab?: 'settings' | 'add-profile';
  onProfileAdded?: () => void; // Callback to refresh profiles
}

interface TimeLimit {
  profileId: string;
  enabled: boolean;
  maxMinutesPerDay: number;
}

export default function AdminPanel({ profiles, onBack, initialTab = 'settings', onProfileAdded }: AdminPanelProps) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [activeTab, setActiveTab] = useState<'settings' | 'add-profile'>(initialTab);

  // Mock data - w przyszłości można to przechowywać w AsyncStorage
  const [timeLimits, setTimeLimits] = useState<TimeLimit[]>(
    profiles.map(p => ({
      profileId: p.id,
      enabled: false,
      maxMinutesPerDay: 30,
    }))
  );

  // New profile form state
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#F093FB');
  const [isAddingProfile, setIsAddingProfile] = useState(false);

  const toggleTimeLimit = (profileId: string) => {
    setTimeLimits(prev => prev.map(limit =>
      limit.profileId === profileId
        ? { ...limit, enabled: !limit.enabled }
        : limit
    ));
  };

  const updateTimeLimit = (profileId: string, minutes: number) => {
    setTimeLimits(prev => prev.map(limit =>
      limit.profileId === profileId
        ? { ...limit, maxMinutesPerDay: minutes }
        : limit
    ));
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
      // Add user to account "Jan"
      await accountsService.addUser('Jan', {
        name: newProfileName.trim(),
        role: UserRole.USER,
        color: colorHexToEnum[selectedColor],
        settings: {
          timeLimit: 30, // Default 30 minutes
        },
      });

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
      Alert.alert('Error', error.response?.data?.message || 'Failed to add profile. Please try again.');
    } finally {
      setIsAddingProfile(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
          Panel Administratora
        </Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
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
            Ustawienia
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
            Dodaj profil
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
              {/* Profile header */}
              <View style={styles.profileHeader}>
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
                <Switch
                  value={limit.enabled}
                  onValueChange={() => toggleTimeLimit(profile.id)}
                  trackColor={{ false: '#767577', true: '#4FACFE' }}
                  thumbColor={limit.enabled ? '#fff' : '#f4f3f4'}
                />
              </View>

              {/* Time limit settings */}
              {limit.enabled && (
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
                      Dziecko będzie mogło grać maksymalnie {limit.maxMinutesPerDay} minut dziennie
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {activeTab === 'settings' && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 Ustawienia są zapisywane automatycznie
            </Text>
          </View>
        )}

        {/* Add Profile Tab */}
        {activeTab === 'add-profile' && (
          <View style={styles.addProfileContainer}>
            <Text style={styles.sectionTitle}>Nowy profil dziecka</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Imię dziecka</Text>
              <TextInput
                style={styles.input}
                value={newProfileName}
                onChangeText={setNewProfileName}
                placeholder="Wpisz imię..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                maxLength={20}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Wybierz kolor</Text>
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
              <Text style={styles.label}>Podgląd</Text>
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
                  {newProfileName || 'Brak imienia'}
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
                {isAddingProfile ? 'Dodawanie...' : 'Dodaj profil'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  titleLandscape: {
    fontSize: 20,
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
    marginBottom: 15,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
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
    paddingTop: 15,
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
