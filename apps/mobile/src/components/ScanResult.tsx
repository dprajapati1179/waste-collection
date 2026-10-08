import { StyleSheet, Text, View } from 'react-native';

interface Props {
  qrId: string;
}

export function ScanResult({ qrId }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Bag ID</Text>
      <Text style={styles.value} selectable>
        {qrId}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  label: {
    fontSize: 12,
    color: '#166534',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  value: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '600',
  },
});
