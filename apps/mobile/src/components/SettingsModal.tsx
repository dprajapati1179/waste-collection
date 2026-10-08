import { Modal, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSettings } from '../store/selectors';
import { apiUrlChanged, settingToggled } from '../store/slices/settingsSlice';
import { Button } from './Button';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const TOGGLES = [
  { key: 'simulateDelay', label: 'Simulate 3 second network delay' },
  { key: 'simulateNetworkFailure', label: 'Simulate network failure' },
  { key: 'simulateServerError', label: 'Simulate server error (500)' },
] as const;

export function SettingsModal({ visible, onClose }: Props) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.label}>API URL</Text>
        <TextInput
          defaultValue={settings.apiUrl}
          onEndEditing={(event) => dispatch(apiUrlChanged(event.nativeEvent.text))}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.input}
        />

        {TOGGLES.map(({ key, label }) => (
          <View key={key} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Switch
              value={settings[key]}
              onValueChange={(value) => {
                dispatch(settingToggled({ key, value }));
              }}
            />
          </View>
        ))}

        <Text style={styles.note}>Settings reset when the app restarts.</Text>
        <Button label="Done" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 24,
    paddingTop: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
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
    marginTop: -8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    flex: 1,
  },
  note: {
    color: '#6b7280',
    fontSize: 12,
  },
});
