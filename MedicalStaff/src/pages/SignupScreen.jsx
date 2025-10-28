import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { authAPI } from '../services/api';

const SignUpScreen = ({ selectedRole, onBack, onNavigateToLogin, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    licenseNo: '',
    specialization: '',
    contactInfo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleSpecificFields = () => {
    switch (selectedRole?.id) {
      case 'doctor':
        return (
          <>
            <Text style={styles.inputLabel}>License Number</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/license-icon.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="MD-2025-481"
                placeholderTextColor="#809CFF"
                value={formData.licenseNo}
                onChangeText={(value) => handleInputChange('licenseNo', value)}
              />
            </View>

            <Text style={styles.inputLabel}>Specialization</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/specialization-icon.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="Cardiology"
                placeholderTextColor="#809CFF"
                value={formData.specialization}
                onChangeText={(value) => handleInputChange('specialization', value)}
              />
            </View>
          </>
        );

      case 'radiologist':
        return (
          <>
            <Text style={styles.inputLabel}>License Number</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/license-icon.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="RAD-2026-111"
                placeholderTextColor="#809CFF"
                value={formData.licenseNo}
                onChangeText={(value) => handleInputChange('licenseNo', value)}
              />
            </View>

            <Text style={styles.inputLabel}>Contact Info</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/phone-icon.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="+1-555-6543"
                placeholderTextColor="#809CFF"
                value={formData.contactInfo}
                onChangeText={(value) => handleInputChange('contactInfo', value)}
              />
            </View>
          </>
        );

      case 'lab_technician':
        return (
          <>
            <Text style={styles.inputLabel}>Contact Info</Text>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/phone-icon.png')}
                style={styles.inputIcon}
                resizeMode="contain"
              />
              <TextInput
                style={styles.input}
                placeholder="+1-555-2468"
                placeholderTextColor="#809CFF"
                value={formData.contactInfo}
                onChangeText={(value) => handleInputChange('contactInfo', value)}
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    // Role-specific validations
    if (selectedRole?.id === 'doctor' && (!formData.licenseNo || !formData.specialization)) {
      Alert.alert('Error', 'Please fill in license number and specialization');
      return false;
    }

    if (selectedRole?.id === 'radiologist' && (!formData.licenseNo || !formData.contactInfo)) {
      Alert.alert('Error', 'Please fill in license number and contact info');
      return false;
    }

    if (selectedRole?.id === 'lab_technician' && !formData.contactInfo) {
      Alert.alert('Error', 'Please fill in contact info');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare data based on role
      let userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      // Add role-specific fields
      if (selectedRole?.id === 'doctor') {
        userData.licenseNo = formData.licenseNo;
        userData.specialization = formData.specialization;
      } else if (selectedRole?.id === 'radiologist') {
        userData.licenseNo = formData.licenseNo;
        userData.contactInfo = formData.contactInfo;
      } else if (selectedRole?.id === 'lab_technician') {
        userData.contactInfo = formData.contactInfo;
      }

      const response = await authAPI.signup(selectedRole.id, userData);

      Alert.alert('Success', 'Account created successfully! Please login to continue.', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to login screen instead of directly to home
            onSignUpSuccess();
          }
        }
      ]);

    } catch (error) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = () => {
    switch (selectedRole?.id) {
      case 'doctor': return 'Doctor';
      case 'radiologist': return 'Radiologist';
      case 'lab_technician': return 'Lab Technician';
      default: return 'User';
    }
  };

  return (
    <ScreenWrapper
      backgroundColor="#FFFFFF"
      statusBarStyle="dark-content"
      barStyle="dark-content"
      translucent={false}
    >
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
            <Text style={styles.headerTitle}>New {getRoleDisplayName()} Account</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Full Name Section */}
          <Text style={styles.inputLabel}>Full name</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('../assets/user-icon.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#809CFF"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              autoCapitalize="words"
            />
          </View>

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
              placeholder="john.doe@gmail.com"
              placeholderTextColor="#809CFF"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Role-specific fields */}
          {getRoleSpecificFields()}

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
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
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
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Terms and Privacy */}
          <Text style={styles.termsText}>
            By continuing, you agree to Terms of Use and Privacy Policy.
          </Text>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../assets/google.png')} style={styles.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Image source={require('../assets/facebook.png')} style={styles.socialIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
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
    marginBottom: 15,
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
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  signupButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 25,
    width: '60%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  signupButtonDisabled: {
    backgroundColor: '#CAD6FF',
  },
  signupButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#2260FF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;