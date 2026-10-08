import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { PermissionNotice } from '../components/PermissionNotice';
import { QrScanner } from '../components/QrScanner';
import { ScanResult } from '../components/ScanResult';
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { collectionReset, qrScanned } from '../store/slices/collectionSlice';

export function CollectionScreen() {
  const dispatch = useAppDispatch();
  const { status, qrId } = useAppSelector((state) => state.collection);
  const { permission, canAskAgain, requestPermission, openSettings } = useCameraPermission();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Collection</Text>

      {permission !== 'granted' ? (
        <PermissionNotice
          permission={permission}
          canAskAgain={canAskAgain}
          onRequest={requestPermission}
          onOpenSettings={openSettings}
        />
      ) : (
        <View style={styles.content}>
          <QrScanner
            enabled={status === 'scanning'}
            onScan={(value) => dispatch(qrScanned(value))}
          />
          {status === 'scanning' || !qrId ? (
            <Text style={styles.hint}>Point the camera at the QR code on the bag.</Text>
          ) : (
            <>
              <ScanResult qrId={qrId} />
              <Button
                label="Scan again"
                variant="secondary"
                onPress={() => dispatch(collectionReset())}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  content: {
    gap: 16,
  },
  hint: {
    color: '#4b5563',
    textAlign: 'center',
  },
});
