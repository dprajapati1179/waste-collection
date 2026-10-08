import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CollectionEntry } from '../components/CollectionEntry';
import { CollectionProgress } from '../components/CollectionProgress';
import { PermissionNotice } from '../components/PermissionNotice';
import { QrScanner } from '../components/QrScanner';
import { SettingsModal } from '../components/SettingsModal';
import { SuccessPanel } from '../components/SuccessPanel';
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCollection, selectWeightValidation } from '../store/selectors';
import { collectionReset, qrScanned } from '../store/slices/collectionSlice';

export function CollectionScreen() {
  const dispatch = useAppDispatch();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { status, qrId, result } = useAppSelector(selectCollection);
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
        <View style={styles.header}>
          <Text style={styles.title}>Waste Collection</Text>
          <Pressable accessibilityRole="button" onPress={() => setSettingsOpen(true)} hitSlop={8}>
            <Text style={styles.link}>Settings</Text>
          </Pressable>
        </View>

        {permission !== 'granted' ? (
          <PermissionNotice
            permission={permission}
            canAskAgain={canAskAgain}
            onRequest={requestPermission}
            onOpenSettings={openSettings}
          />
        ) : status === 'success' && result ? (
          <SuccessPanel collection={result} onNext={() => dispatch(collectionReset())} />
        ) : (
          <View style={styles.content}>
            <CollectionProgress step={step} />
            <QrScanner enabled={isScanning} onScan={(value) => dispatch(qrScanned(value))} />
            {isScanning ? (
              <Text style={styles.hint}>Point the camera at the QR code on the bag.</Text>
            ) : (
              <CollectionEntry qrId={qrId} />
            )}
          </View>
        )}
      </ScrollView>
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  link: {
    color: '#166534',
    fontWeight: '600',
  },
  content: {
    gap: 16,
  },
  hint: {
    color: '#4b5563',
    textAlign: 'center',
  },
});
