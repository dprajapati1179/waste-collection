import { combineReducers, configureStore } from '@reduxjs/toolkit';

import collectionReducer from './slices/collectionSlice';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  collection: collectionReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
