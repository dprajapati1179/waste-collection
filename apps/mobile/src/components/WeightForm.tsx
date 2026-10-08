import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from './Button';

interface Props {
  weight: string;
  error: string | null;
  submitting: boolean;
  submitLabel: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function WeightForm({ weight, error, submitting, submitLabel, onChange, onSubmit }: Props) {
  const [touched, setTouched] = useState(false);
  const visibleError = touched ? error : null;

  const handleSubmit = () => {
    setTouched(true);
    if (!error) onSubmit();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Waste Weight (kg)</Text>
      <TextInput
        value={weight}
        onChangeText={onChange}
        onBlur={() => setTouched(true)}
        onSubmitEditing={handleSubmit}
        editable={!submitting}
        placeholder="0.00"
        keyboardType="decimal-pad"
        inputMode="decimal"
        returnKeyType="done"
        maxLength={8}
        style={[styles.input, visibleError && styles.inputError]}
        accessibilityLabel="Waste weight in kilograms"
      />
      {visibleError && <Text style={styles.error}>{visibleError}</Text>}
      <Button label={submitLabel} onPress={handleSubmit} loading={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  error: {
    color: '#dc2626',
  },
});
