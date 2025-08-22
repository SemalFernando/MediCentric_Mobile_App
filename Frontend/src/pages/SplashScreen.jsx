import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.mediText}>MEDI</Text>
      <Text style={styles.centricText}>CENTRIC</Text>
      <Text style={styles.taglineText}>Centralizing Your Health</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2260FF',
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  mediText: {
    fontSize: 38,
    fontWeight: 'Regular',
    color: 'white',
  },
  centricText: {
    fontSize: 38,
    fontWeight: 'Regular',
    color: 'white',
  },
  taglineText: {
    fontSize: 14,
    fontWeight: 'Regular',
    color: 'white',
    opacity: 0.9,
  },
});

export default SplashScreen;