// API Configuration
// Change to your server IP for physical devices
// Android emulator: 'http://10.0.2.2:4000'
// iOS simulator: 'http://localhost:4000'
// Physical device: 'http://YOUR_COMPUTER_IP:4000'

// Using localhost for React Native Expo
const API_BASE_URL = 'http://localhost:4002';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
