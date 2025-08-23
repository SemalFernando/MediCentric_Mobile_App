import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import LoginScreen from './LoginScreen';

const WelcomeScreen = () => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginScreen onBack={() => setShowLogin(false)} />;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.mediText}>MEDI</Text>
      <Text style={styles.centricText}>CENTRIC</Text>
      <Text style={styles.taglineText}>Centralizing Your Health</Text>

      <Text style={styles.descriptionText}>
        Access your medical records, appointments, and self-care, all in one place.
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => setShowLogin(true)}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  mediText: {
    fontSize: 38,
    fontWeight: 'Regular',
    color: '#2260FF',
  },
  centricText: {
    fontSize: 38,
    fontWeight: 'Regular',
    color: '#2260FF',
  },
  taglineText: {
    fontSize: 14,
    fontWeight: 'Regular',
    color: '#2260FF',
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 13,
    color: '#070707',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginTop: 80, // Added this to push down the description and buttons
  },
  loginButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginBottom: 15,
    width: '60%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#CAD6FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    width: '60%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#2260FF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;