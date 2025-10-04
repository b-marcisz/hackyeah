import { useState, useEffect } from 'react';
import { accountsService } from '../api';
import { UserDto } from '../api/types';
import { Profile } from '../screens/ProfileSelection';

// Account name - must match existing account in backend
const DEFAULT_ACCOUNT_NAME = 'Jan';

// Color palette for profiles
const PROFILE_COLORS = ['#F093FB', '#4FACFE', '#43E97B', '#FF6B9D', '#FFA502', '#A29BFE'];

// Map backend ProfileColor enum to hex colors
const PROFILE_COLOR_MAP: Record<string, string> = {
  'pinkPurple': '#F093FB',
  'blue': '#4FACFE',
  'green': '#43E97B',
  'pink': '#FF6B9D',
  'orange': '#FFA502',
  'lavender': '#A29BFE',
};

/**
 * Hook to fetch and manage user profiles from the backend
 */
export const useProfiles = (accountName: string = DEFAULT_ACCOUNT_NAME) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert backend UserDto to frontend Profile
   */
  const userToProfile = (user: UserDto, index: number, accountId: string): Profile => {
    // Get color from user or fallback to default palette
    const color = user.color
      ? PROFILE_COLOR_MAP[user.color] || PROFILE_COLORS[index % PROFILE_COLORS.length]
      : PROFILE_COLORS[index % PROFILE_COLORS.length];

    return {
      id: user.id || `temp-${index}`,
      name: user.name,
      type: user.role === 'admin' ? 'parent' : 'child',
      color: color,
      role: user.role,
      age: user.age,
      accountId: accountId,
      settings: user.settings,
    };
  };

  /**
   * Fetch profiles from backend
   */
  const fetchProfiles = async () => {
    // Don't fetch if accountName is empty (not loaded from storage yet)
    if (!accountName || accountName.trim() === '') {
      setLoading(false);
      setProfiles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const account = await accountsService.getAccount(accountName);
      console.log('Fetched account:', account);

      // Filter only child profiles (role: 'user')
      const childUsers = account.users.filter(user => user.role === 'user');
      console.log('Child users:', childUsers);

      // Convert to Profile format
      const profilesList = childUsers.map((user, index) =>
        userToProfile(user, index, account.id)
      );
      console.log('Profiles list:', profilesList);

      setProfiles(profilesList);
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      setError(err.message || 'Failed to load profiles');

      // Fallback to mock data if API fails
      setProfiles([
        { id: '1', name: 'Kasia', type: 'child', color: '#F093FB' },
        { id: '2', name: 'Tomek', type: 'child', color: '#4FACFE' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh profiles
   */
  const refreshProfiles = () => {
    fetchProfiles();
  };

  // Fetch on mount
  useEffect(() => {
    fetchProfiles();
  }, [accountName]);

  return {
    profiles,
    loading,
    error,
    refreshProfiles,
  };
};
