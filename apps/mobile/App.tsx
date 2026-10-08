import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { CollectionScreen } from './src/screens/CollectionScreen';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <CollectionScreen />
      <StatusBar style="dark" />
    </Provider>
  );
}
