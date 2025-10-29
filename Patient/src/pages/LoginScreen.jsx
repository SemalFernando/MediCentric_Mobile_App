import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const LoginScreen = ({ onBack, onNavigateToSignUp, onNavigateToSetPassword, onNavigateToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        email: email.trim().toLowerCase(),
        password: password
      };

      console.log('Sending login data:', loginData);

      const response = await fetch('http://192.168.8.102:8080/patients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const responseClone = response.clone();
      
      if (!response.ok) {
        let errorMessage = `Login failed with status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          try {
            const errorText = await responseClone.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            if (response.status === 401) {
              errorMessage = 'Invalid email or password';
            } else if (response.status === 404) {
              errorMessage = 'Account not found. Please sign up first.';
            } else if (response.status === 400) {
              errorMessage = 'Invalid request. Please check your input.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        responseData = {
          id: 'temp-id',
          email: email,
          message: textResponse,
          success: true
        };
      }

      console.log('Login successful - Full response:', responseData);
      
      // KEY CHANGE: Pass the FULL patient data to home screen
      if (!responseData) {
        throw new Error('No patient data received from server. Please contact support.');
      }

      console.log('Passing full patient data to home screen');
      
      Alert.alert('Success', 'Login successful!', [
        { 
          text: 'OK', 
          onPress: () => {
            // Pass FULL patient data to home screen - KEY CHANGE
            onNavigateToHome(responseData);
          }
        }
      ]);
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
        Alert.alert('Connection Error', 'Cannot connect to server. Please check your connection and try again.');
      } else if (error.message.includes('Invalid email or password') || error.message.includes('401')) {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      } else if (error.message.includes('Account not found') || error.message.includes('404')) {
        Alert.alert('Account Not Found', 'No account found with this email. Please sign up first.');
      } else if (error.message.includes('Invalid request') || error.message.includes('400')) {
        Alert.alert('Invalid Input', 'Please check your email and password format.');
      } else {
        Alert.alert('Login Error', error.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log In</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.subtitle}>
        Your health, just a tap away.{'\n'}
        Log in to access care and track your wellness with Medi Centric
      </Text>

      {/* Email Section */}
      <Text style={styles.inputLabel}>Email</Text>
      <View style={styles.inputContainer}>
        <Image
          source={require('../assets/email-icon.png')}
          style={styles.inputIcon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="john.doe@example.com"
          placeholderTextColor="#809CFF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={!isLoading}
        />
      </View>

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
          autoComplete="password"
          editable={!isLoading}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)} 
          style={styles.eyeIcon}
          disabled={isLoading}
        >
          <Image
            source={showPassword ? require('../assets/eye-open-icon.png') : require('../assets/eye-closed-icon.png')}
            style={styles.eyeIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={onNavigateToSetPassword}
        disabled={isLoading}
      >
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or login with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
          <Image source={require('../assets/google.png')} style={styles.socialIcon} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
          <Image source={require('../assets/facebook.png')} style={styles.socialIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={onNavigateToSignUp} disabled={isLoading}>
          <Text style={[styles.signupLink, isLoading && styles.disabledLink]}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 12,
    color: '#070707',
    marginBottom: 30,
    textAlign: 'left',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#2260FF',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 25,
    width: '60%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#809CFF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#2260FF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledLink: {
    color: '#809CFF',
  },
});

export default LoginScreen;