import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';

const SignUpScreen = ({ onBack, onNavigateToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [address, setAddress] = useState('');
  const [patientNic, setPatientNic] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to format date to ISO string (as expected by your API)
  const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    
    // Assuming date format is MM/DD/YYYY
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    
    // Create ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  const handleSignUp = async () => {
    // Basic validation
    if (!fullName || !email || !password || !mobileNumber || !dateOfBirth || !gender || !bloodType || !address || !patientNic) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare patient data according to your API schema
      const patientData = {
        fullName,
        gender,
        dob: formatDateToISO(dateOfBirth),
        contactInfo: mobileNumber,
        bloodType,
        address,
        patientNic,
        email,
        password
      };

      // Make API call to register patient
      const response = await fetch('http://10.81.232.247:8080/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const patient = await response.json();
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => onNavigateToLogin() }
      ]);
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
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
          <Text style={styles.headerTitle}>New Account</Text>
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
            value={fullName}
            onChangeText={setFullName}
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Image 
              source={showPassword ? require('../assets/eye-open-icon.png') : require('../assets/eye-closed-icon.png')} 
              style={styles.eyeIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Mobile Number Section */}
        <Text style={styles.inputLabel}>Mobile number</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/phone-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="+1 234 567 8900"
            placeholderTextColor="#809CFF"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Date of Birth Section */}
        <Text style={styles.inputLabel}>Date of birth (MM/DD/YYYY)</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/dob-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#809CFF"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        {/* Gender Section */}
        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/gender-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Male/Female/Other"
            placeholderTextColor="#809CFF"
            value={gender}
            onChangeText={setGender}
          />
        </View>

        {/* Blood Type Section */}
        <Text style={styles.inputLabel}>Blood Type</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/blood-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="O+, A-, etc."
            placeholderTextColor="#809CFF"
            value={bloodType}
            onChangeText={setBloodType}
          />
        </View>

        {/* Address Section */}
        <Text style={styles.inputLabel}>Address</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/address-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="123 Main St, City"
            placeholderTextColor="#809CFF"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* NIC Section */}
        <Text style={styles.inputLabel}>NIC Number</Text>
        <View style={styles.inputContainer}>
          <Image 
            source={require('../assets/id-icon.png')} 
            style={styles.inputIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="123456789V"
            placeholderTextColor="#809CFF"
            value={patientNic}
            onChangeText={setPatientNic}
          />
        </View>

        {/* Terms and Privacy */}
        <Text style={styles.termsText}>
          By continuing, you agree to Terms of Use and Privacy Policy.
        </Text>

        {/* Sign Up Button */}
        <TouchableOpacity 
          style={[styles.signupButton, isLoading && styles.disabledButton]} 
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
  disabledButton: {
    backgroundColor: '#809CFF',
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