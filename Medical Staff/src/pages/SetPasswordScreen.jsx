import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const SetPasswordScreen = ({ onBack, onLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCreatePassword = () => {
    console.log('Create Password button pressed');
    
    // Add password validation logic here
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long');
      return;
    }

    // If validation passes, navigate to login
    console.log('Validation passed, calling onLogin');
    if (onLogin) {
      onLogin();
    } else {
      console.log('onLogin prop is not provided');
      Alert.alert('Success', 'Password created successfully!');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Set Password</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Description */}
        <Text style={styles.descriptionText}>
          Create a strong password to protect your health data.{'\n'}
          Your privacy and security come first.
        </Text>

        {/* Password Section */}
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/password-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="****************"
            placeholderTextColor="#809CFF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Image 
              source={showPassword ? require('../assets/eye-open-icon.png') : require('../assets/eye-closed-icon.png')} 
              style={styles.eyeIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Section */}
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/password-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="****************"
            placeholderTextColor="#809CFF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Image 
              source={showConfirmPassword ? require('../assets/eye-open-icon.png') : require('../assets/eye-closed-icon.png')} 
              style={styles.eyeIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Create Password Button */}
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreatePassword}
        >
          <Text style={styles.createButtonText}>Create New Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 30,
  },
  backButton: {
    padding: 5,
  },
  backText: {
    fontSize: 50,
    color: '#2260FF',
    fontWeight: 'regular',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2260FF',
    textAlign: 'center',
    flex: 1,
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 12,
    color: '#070707',
    textAlign: 'left',
    marginBottom: 30,
    alignSelf: 'flex-start',
    lineHeight: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECF1FF',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#ECF1FF',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#809CFF',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#809CFF',
  },
  eyeIcon: {
    padding: 5,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
    tintColor: '#809CFF',
  },
  createButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
    width: '70%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SetPasswordScreen;