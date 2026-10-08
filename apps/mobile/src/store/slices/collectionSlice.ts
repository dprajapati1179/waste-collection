import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Collection } from '@waste-collection/types';

import type { CameraPermission, CollectionStatus, SubmissionError } from '../../types/collection';

export interface CollectionState {
  permission: CameraPermission;
  status: CollectionStatus;
  qrId: string | null;
  weight: string;
  error: SubmissionError | null;
  result: Collection | null;
}

const initialState: CollectionState = {
  permission: 'undetermined',
  status: 'scanning',
  qrId: null,
  weight: '',
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
      if (state.status !== 'scanned') return;
      state.weight = action.payload;
    },
    collectionReset(state) {
      return { ...initialState, permission: state.permission };
    },
  },
});

export const { permissionChanged, qrScanned, weightChanged, collectionReset } =
  collectionSlice.actions;

export default collectionSlice.reducer;
