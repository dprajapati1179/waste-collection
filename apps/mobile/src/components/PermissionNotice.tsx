import { StyleSheet, Text, View } from 'react-native';

import type { CameraPermission } from '../types/collection';
import { Button } from './Button';

interface Props {
  permission: CameraPermission;
  canAskAgain: boolean;
  onRequest: () => void;
  onOpenSettings: () => void;
}

export function PermissionNotice({ permission, canAskAgain, onRequest, onOpenSettings }: Props) {
  if (permission === 'undetermined') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera access…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera access is needed</Text>
      <Text style={styles.message}>Allow camera access to scan the QR code on each waste bag.</Text>
      {canAskAgain ? (
        <Button label="Try again" onPress={onRequest} />
      ) : (
        <Button label="Open Settings" onPress={onOpenSettings} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    color: '#4b5563',
    lineHeight: 20,
  },
});
