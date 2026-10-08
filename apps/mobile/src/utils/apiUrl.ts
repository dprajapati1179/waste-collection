import Constants from 'expo-constants';

const API_PORT = 4000;

export function getDefaultApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const devServerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  return devServerHost ? `http://${devServerHost}:${API_PORT}` : `http://localhost:${API_PORT}`;
}
