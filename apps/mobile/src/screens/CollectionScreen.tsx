import { StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '../store/hooks';

export function CollectionScreen() {
  const status = useAppSelector((state) => state.collection.status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Collection</Text>
      <Text style={styles.status}>Status: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  status: {
    marginTop: 8,
    color: '#6b7280',
  },
});
