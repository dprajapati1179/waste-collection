import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  apiUrl: string;
  simulateDelay: boolean;
  simulateNetworkFailure: boolean;
  simulateServerError: boolean;
}

export const initialSettings: SettingsState = {
  apiUrl: 'http://localhost:4000',
  simulateDelay: true,
  simulateNetworkFailure: false,
  simulateServerError: false,
};

type Toggle = 'simulateDelay' | 'simulateNetworkFailure' | 'simulateServerError';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettings,
  reducers: {
    apiUrlChanged(state, action: PayloadAction<string>) {
      state.apiUrl = action.payload.trim().replace(/\/+$/, '');
    },
    settingToggled(state, action: PayloadAction<{ key: Toggle; value: boolean }>) {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const { apiUrlChanged, settingToggled } = settingsSlice.actions;

export default settingsSlice.reducer;
