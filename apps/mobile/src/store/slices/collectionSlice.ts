import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Collection } from '@waste-collection/types';

import { SUBMISSION_MESSAGES } from '../../constants/messages';
import type { CameraPermission, CollectionStatus, SubmissionError } from '../../types/collection';
import { submitCollection } from '../thunks/submitCollection';

export interface CollectionState {
  permission: CameraPermission;
  status: CollectionStatus;
  qrId: string | null;
  weight: string;
  capturedAt: string | null;
  error: SubmissionError | null;
  result: Collection | null;
}

const initialState: CollectionState = {
  permission: 'undetermined',
  status: 'scanning',
  qrId: null,
  weight: '',
  capturedAt: null,
  error: null,
  result: null,
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    permissionChanged(state, action: PayloadAction<CameraPermission>) {
      state.permission = action.payload;
    },
    qrScanned(state, action: PayloadAction<string>) {
      if (state.status !== 'scanning') return;
      state.qrId = action.payload;
      state.status = 'scanned';
    },
    weightChanged(state, action: PayloadAction<string>) {
      if (state.status !== 'scanned' && state.status !== 'error') return;
      state.weight = action.payload;
      state.status = 'scanned';
      state.error = null;
    },
    collectionReset(state) {
      return { ...initialState, permission: state.permission };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCollection.pending, (state, action) => {
        state.status = 'submitting';
        state.error = null;
        // Keep the first attempt's time so retries record when the bag was actually collected.
        state.capturedAt ??= action.meta.attemptedAt;
      })
      .addCase(submitCollection.fulfilled, (state, action) => {
        state.status = 'success';
        state.result = action.payload;
      })
      .addCase(submitCollection.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? { kind: 'server', message: SUBMISSION_MESSAGES.server };
      });
  },
});

export const { permissionChanged, qrScanned, weightChanged, collectionReset } =
  collectionSlice.actions;

export default collectionSlice.reducer;
