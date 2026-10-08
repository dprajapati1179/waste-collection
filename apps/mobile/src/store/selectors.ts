import { createSelector } from '@reduxjs/toolkit';

import { validateWeight } from '../utils/weight';
import type { RootState } from './createStore';

export const selectCollection = (state: RootState) => state.collection;

export const selectWeightValidation = createSelector(
  (state: RootState) => state.collection.weight,
  validateWeight,
);

export const selectSettings = (state: RootState) => state.settings;
