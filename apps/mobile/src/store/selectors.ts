import { createSelector } from '@reduxjs/toolkit';

import { validateWeight } from '../utils/weight';
import type { RootState } from './index';

export const selectCollection = (state: RootState) => state.collection;

export const selectWeightValidation = createSelector(
  (state: RootState) => state.collection.weight,
  validateWeight,
);

export const selectIsReadyToSubmit = (state: RootState) =>
  state.collection.status === 'scanned' && selectWeightValidation(state).valid;
