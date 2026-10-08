import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  enabled: boolean;
  onScan: (value: string) => void;
}

export function QrScanner({ enabled, onScan }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const lockedRef = useRef(false);

  useEffect(() => {
    lockedRef.current = !enabled;
    const camera = cameraRef.current;
    if (!camera) return;
    // Preview calls fail if the camera is still initializing; scanning is already gated by the lock.
    const toggle = enabled ? camera.resumePreview() : camera.pausePreview();
    toggle.catch(() => undefined);
  }, [enabled]);

  const handleScan = ({ data }: BarcodeScanningResult) => {
    const value = data.trim();
    // The scanner fires several times per frame before a re-render, so lock synchronously.
    if (lockedRef.current || !value) return;
    lockedRef.current = true;
    onScan(value);
  };

  return (
    <View style={styles.frame}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={enabled ? handleScan : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
