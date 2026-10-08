import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { CollectionProgress } from '../components/CollectionProgress';
import { PermissionNotice } from '../components/PermissionNotice';
import { QrScanner } from '../components/QrScanner';
import { ScanResult } from '../components/ScanResult';
import { WeightForm } from '../components/WeightForm';
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCollection, selectWeightValidation } from '../store/selectors';
import { collectionReset, qrScanned, weightChanged } from '../store/slices/collectionSlice';

export function CollectionScreen() {
  const dispatch = useAppDispatch();
  const { status, qrId, weight } = useAppSelector(selectCollection);
  const weightValidation = useAppSelector(selectWeightValidation);
  const { permission, canAskAgain, requestPermission, openSettings } = useCameraPermission();

  const isScanning = status === 'scanning' || !qrId;
  const step = isScanning ? 0 : weightValidation.valid ? 2 : 1;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
            <CollectionProgress step={step} />
            <QrScanner enabled={isScanning} onScan={(value) => dispatch(qrScanned(value))} />

            {isScanning ? (
              <Text style={styles.hint}>Point the camera at the QR code on the bag.</Text>
            ) : (
              <>
                <ScanResult qrId={qrId} />
                <WeightForm
                  weight={weight}
                  error={weightValidation.valid ? null : weightValidation.error}
                  onChange={(value) => dispatch(weightChanged(value))}
                />
                <Button
                  label="Scan again"
                  variant="secondary"
                  onPress={() => dispatch(collectionReset())}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 64,
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
