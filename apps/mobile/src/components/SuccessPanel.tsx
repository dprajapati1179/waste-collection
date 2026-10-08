import type { Collection } from '@waste-collection/types';
import { StyleSheet, Text, View } from 'react-native';

import { SUBMISSION_MESSAGES } from '../constants/messages';
import { Button } from './Button';

interface Props {
  collection: Collection;
  onNext: () => void;
}

export function SuccessPanel({ collection, onNext }: Props) {
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.title}>{SUBMISSION_MESSAGES.success}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Bag ID</Text>
        <Text style={styles.value}>{collection.qr_id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Weight</Text>
        <Text style={styles.value}>{collection.weight} kg</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Points</Text>
        <Text style={styles.value}>{collection.points}</Text>
      </View>
      <Button label="Scan next bag" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#4b5563',
  },
  value: {
    fontWeight: '600',
  },
});
