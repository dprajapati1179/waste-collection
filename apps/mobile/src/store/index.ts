import { getDefaultApiUrl } from '../utils/apiUrl';
import { createStore } from './createStore';
import { initialSettings } from './slices/settingsSlice';

export const store = createStore({
  settings: { ...initialSettings, apiUrl: getDefaultApiUrl() },
});

export type { AppDispatch, RootState } from './createStore';
