import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Collection } from '@waste-collection/types';

import { submitCollection as postCollection } from '../../services/collectionsApi';
import { networkError, serverError, SubmissionFailure } from '../../services/submissionError';
import type { SubmissionError } from '../../types/collection';
import { delay } from '../../utils/delay';
import { validateWeight } from '../../utils/weight';
import type { RootState } from '../createStore';

export const SIMULATED_DELAY_MS = 3000;

export const submitCollection = createAsyncThunk<
  Collection,
  void,
  { state: RootState; rejectValue: SubmissionError; pendingMeta: { attemptedAt: string } }
>(
  'collection/submit',
  async (_, { getState, rejectWithValue }) => {
    const { collection, settings } = getState();
    const weight = validateWeight(collection.weight);

    if (!collection.qrId || !collection.capturedAt || !weight.valid) {
      return rejectWithValue({ kind: 'validation', message: 'Scan a bag and enter its weight.' });
    }

    if (settings.simulateDelay) await delay(SIMULATED_DELAY_MS);

    try {
      if (settings.simulateNetworkFailure) throw new SubmissionFailure(networkError());
      if (settings.simulateServerError) throw new SubmissionFailure(serverError());

      return await postCollection(settings.apiUrl, {
        qr_id: collection.qrId,
        weight: weight.value,
        timestamp: collection.capturedAt,
      });
    } catch (err) {
      return rejectWithValue(err instanceof SubmissionFailure ? err.error : serverError());
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().collection;
      return status === 'scanned' || status === 'error';
    },
    getPendingMeta: () => ({ attemptedAt: new Date().toISOString() }),
  },
);
