import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCOUNT_NAME: '@brainio_account_name',
  ACCOUNT_PIN: '@brainio_account_pin',
};

export interface StoredAccount {
  name: string;
  pin: string;
}

/**
 * Save account information to storage
 */
export const saveAccount = async (accountName: string, pin: string): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCOUNT_NAME, accountName],
      [STORAGE_KEYS.ACCOUNT_PIN, pin],
    ]);
  } catch (error) {
    console.error('Error saving account:', error);
    throw error;
  }
};

/**
 * Get stored account information
 */
export const getStoredAccount = async (): Promise<StoredAccount | null> => {
  try {
    const values = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCOUNT_NAME,
      STORAGE_KEYS.ACCOUNT_PIN,
    ]);

    const accountName = values[0][1];
    const pin = values[1][1];

    if (accountName && pin) {
      return { name: accountName, pin };
    }

    return null;
  } catch (error) {
    console.error('Error getting stored account:', error);
    return null;
  }
};

/**
 * Clear account information from storage
 */
export const clearAccount = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCOUNT_NAME,
      STORAGE_KEYS.ACCOUNT_PIN,
    ]);
  } catch (error) {
    console.error('Error clearing account:', error);
    throw error;
  }
};
