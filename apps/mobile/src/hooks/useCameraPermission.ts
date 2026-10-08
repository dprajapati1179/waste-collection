import { useCameraPermissions } from 'expo-camera';
import { useEffect } from 'react';
import { AppState, Linking } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { permissionChanged } from '../store/slices/collectionSlice';

export function useCameraPermission() {
  const dispatch = useAppDispatch();
  const permission = useAppSelector((state) => state.collection.permission);
  const [response, requestPermission, getPermission] = useCameraPermissions();

  useEffect(() => {
    if (!response) return;
    dispatch(permissionChanged(response.status));
    if (response.status === 'undetermined' && response.canAskAgain) {
      requestPermission();
    }
  }, [response, dispatch, requestPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') getPermission();
    });
    return () => subscription.remove();
  }, [getPermission]);

  return {
    permission,
    canAskAgain: response?.canAskAgain ?? true,
    requestPermission,
    openSettings: Linking.openSettings,
  };
}
