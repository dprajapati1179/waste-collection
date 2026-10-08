import { createStore } from '../src/store/createStore';
import { qrScanned, weightChanged } from '../src/store/slices/collectionSlice';
import { initialSettings, settingToggled } from '../src/store/slices/settingsSlice';
import { SIMULATED_DELAY_MS, submitCollection } from '../src/store/thunks/submitCollection';

const createdCollection = {
  id: 'c1',
  qr_id: 'BAG-1001',
  weight: 12.5,
  points: 188,
  timestamp: '2026-10-08T10:30:00.000Z',
  created_at: '2026-10-08T10:30:01.000Z',
};

const jsonResponse = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));

const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

function setupStore() {
  const store = createStore({ settings: { ...initialSettings, simulateDelay: false } });
  store.dispatch(qrScanned('BAG-1001'));
  store.dispatch(weightChanged('12.5'));
  return store;
}

function sentBody(call: number) {
  return JSON.parse(String(fetchMock.mock.calls[call]?.[1]?.body));
}

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe('submitCollection', () => {
  it('posts the payload and stores the result on 201', async () => {
    fetchMock.mockReturnValueOnce(jsonResponse(201, { data: createdCollection }));
    const store = setupStore();

    await store.dispatch(submitCollection());

    expect(fetchMock.mock.calls[0]?.[0]).toBe('http://localhost:4000/collections');
    expect(sentBody(0)).toEqual({
      qr_id: 'BAG-1001',
      weight: 12.5,
      timestamp: expect.any(String),
    });
    expect(store.getState().collection).toMatchObject({
      status: 'success',
      result: createdCollection,
    });
  });

  it('keeps the scan and weight after a network failure and retries with the same timestamp', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    const store = setupStore();

    await store.dispatch(submitCollection());

    expect(store.getState().collection).toMatchObject({
      status: 'error',
      qrId: 'BAG-1001',
      weight: '12.5',
      error: { kind: 'network', message: 'Unable to reach the server. Please try again.' },
    });

    fetchMock.mockReturnValueOnce(jsonResponse(201, { data: createdCollection }));
    await store.dispatch(submitCollection());

    expect(store.getState().collection.status).toBe('success');
    expect(sentBody(1).timestamp).toBe(sentBody(0).timestamp);
  });

  it.each([
    [
      409,
      { error: { code: 'DUPLICATE_COLLECTION', message: 'x' } },
      'duplicate',
      'This bag has already been collected.',
    ],
    [
      400,
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'x',
          details: [{ field: 'weight', message: 'weight must be greater than 0' }],
        },
      },
      'validation',
      'weight must be greater than 0',
    ],
    [
      500,
      { error: { code: 'INTERNAL_ERROR', message: 'x' } },
      'server',
      'Something went wrong. Please try again.',
    ],
    [502, 'not json', 'server', 'Something went wrong. Please try again.'],
  ])('maps HTTP %d to a %s error', async (status, body, kind, message) => {
    fetchMock.mockReturnValueOnce(jsonResponse(status, body));
    const store = setupStore();

    await store.dispatch(submitCollection());

    expect(store.getState().collection).toMatchObject({
      status: 'error',
      qrId: 'BAG-1001',
      weight: '12.5',
      error: { kind, message },
    });
  });

  it('ignores repeated submits while a request is in flight', async () => {
    fetchMock.mockReturnValue(jsonResponse(201, { data: createdCollection }));
    const store = setupStore();

    await Promise.all([
      store.dispatch(submitCollection()),
      store.dispatch(submitCollection()),
      store.dispatch(submitCollection()),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('waits for the simulated delay before sending', async () => {
    jest.useFakeTimers();
    fetchMock.mockReturnValueOnce(jsonResponse(201, { data: createdCollection }));
    const store = setupStore();
    store.dispatch(settingToggled({ key: 'simulateDelay', value: true }));

    const pending = store.dispatch(submitCollection());
    expect(store.getState().collection.status).toBe('submitting');

    await jest.advanceTimersByTimeAsync(SIMULATED_DELAY_MS - 1);
    expect(fetchMock).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it.each([
    ['simulateNetworkFailure', 'network'],
    ['simulateServerError', 'server'],
  ] as const)('fails without calling the API when %s is on', async (key, kind) => {
    const store = setupStore();
    store.dispatch(settingToggled({ key, value: true }));

    await store.dispatch(submitCollection());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.getState().collection).toMatchObject({ status: 'error', error: { kind } });
  });

  it('does not submit before a bag is scanned', async () => {
    const store = createStore();

    await store.dispatch(submitCollection());

    expect(fetchMock).not.toHaveBeenCalled();
    expect(store.getState().collection.status).toBe('scanning');
  });
});
