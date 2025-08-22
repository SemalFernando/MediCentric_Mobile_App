import React from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {startNetworkLogging} from 'react-native-network-logger';
import {Text, View,} from 'react-native';

const App = () => {
  React.useEffect(() => {
    startNetworkLogging();
  }, []);

  return (
    <SafeAreaProvider>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>Hello  :)</Text>
    </View>
    </SafeAreaProvider>
  );
};

export default App;