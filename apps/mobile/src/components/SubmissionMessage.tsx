import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { SUBMISSION_MESSAGES, type SubmissionError } from '../types/collection';

interface Props {
  submitting: boolean;
  error: SubmissionError | null;
}

export function SubmissionMessage({ submitting, error }: Props) {
  if (submitting) {
    return (
      <View style={[styles.box, styles.info]} accessibilityLiveRegion="polite">
        <ActivityIndicator color="#1d4ed8" />
        <Text style={styles.infoText}>{SUBMISSION_MESSAGES.submitting}</Text>
      </View>
    );
  }

  if (!error) return null;

  return (
    <View style={[styles.box, styles.error]} accessibilityLiveRegion="assertive">
      <Text style={styles.errorText}>{error.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  info: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  infoText: {
    color: '#1d4ed8',
  },
  error: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  errorText: {
    flex: 1,
    color: '#b91c1c',
  },
});
