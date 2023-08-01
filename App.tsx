import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BusinessApp from './src/BusinessApp';

const App = () => {
  return (
    <SafeAreaProvider>
      <BusinessApp />
    </SafeAreaProvider>
  );
};

export default App;
