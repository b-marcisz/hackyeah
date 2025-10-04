import { useState, useEffect } from 'react';
import { accountsService } from '../api';
import { UserDto } from '../api/types';
import { Profile } from '../screens/ProfileSelection';

// Account name - must match existing account in backend
const DEFAULT_ACCOUNT_NAME = 'Jan';

// Color palette for profiles
const PROFILE_COLORS = ['#F093FB', '#4FACFE', '#43E97B', '#FF6B9D', '#FFA502', '#A29BFE'];

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
    return {
      id: user.id || `temp-${index}`,
      name: user.name,
      type: user.role === 'admin' ? 'parent' : 'child',
      color: PROFILE_COLORS[index % PROFILE_COLORS.length],
      role: user.role,
      age: user.age,
      accountId: accountId,
    };
  };

  /**
   * Fetch profiles from backend
   */
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const account = await accountsService.getAccount(accountName);

      // Filter only child profiles (role: 'user')
      const childUsers = account.users.filter(user => user.role === 'user');

      // Convert to Profile format
      const profilesList = childUsers.map((user, index) =>
        userToProfile(user, index, account.id)
      );

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
