import { StyleSheet, Text, View } from 'react-native';

const STEPS = ['Scan bag', 'Enter weight', 'Ready to submit'] as const;

interface Props {
  step: 0 | 1 | 2;
}

export function CollectionProgress({ step }: Props) {
  return (
    <View style={styles.row}>
      {STEPS.map((label, index) => (
        <View key={label} style={[styles.step, index <= step && styles.stepDone]}>
          <Text style={[styles.label, index === step && styles.labelCurrent]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  step: {
    flex: 1,
    paddingTop: 6,
    borderTopWidth: 3,
    borderTopColor: '#e5e7eb',
  },
  stepDone: {
    borderTopColor: '#16a34a',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
  },
  labelCurrent: {
    color: '#111827',
    fontWeight: '600',
  },
});
