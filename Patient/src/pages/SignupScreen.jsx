import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';

const SignUpScreen = ({ onBack, onNavigateToLogin, onNavigateToQrCode }) => { // NEW: Added onNavigateToQrCode prop
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

  const formatDateToISO = (dateString) => {
    if (!dateString) return '';
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return '';
    
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    
    return `${year}-${month}-${day}`;
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !mobileNumber || !dateOfBirth || !gender || !bloodType || !address || !patientNic) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!dateRegex.test(dateOfBirth)) {
      Alert.alert('Error', 'Please enter date in MM/DD/YYYY format');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (patientNic.length < 5) {
      Alert.alert('Error', 'Please enter a valid NIC number');
      return;
    }

    setIsLoading(true);

    try {
      const patientData = {
        fullName: fullName.trim(),
        gender: gender.trim(),
        dob: formatDateToISO(dateOfBirth),
        contactInfo: mobileNumber.trim(),
        bloodType: bloodType.trim(),
        address: address.trim(),
        patientNic: patientNic.trim(),
        email: email.trim().toLowerCase(),
        password: password
      };

      console.log('Sending patient data:', patientData);

      const response = await fetch('http://10.185.72.247:8080/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(responseData.message || 'Invalid data provided');
        } else if (response.status === 409) {
          throw new Error(responseData.message || 'Patient with this email or NIC already exists');
        } else {
          throw new Error(responseData.message || `Registration failed with status: ${response.status}`);
        }
      }

      console.log('Registration successful:', responseData);
      
      // NEW: Navigate to QR code screen instead of login
      if (onNavigateToQrCode) {
        onNavigateToQrCode(responseData); // Pass the patient data to QR screen
      } else {
        // Fallback: if QR navigation not available, go to login
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => onNavigateToLogin() }
        ]);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message.includes('Network request failed')) {
        Alert.alert('Connection Error', 'Cannot connect to server. Please check your connection and try again.');
      } else if (error.message.includes('Failed to fetch')) {
        Alert.alert('Server Error', 'Cannot reach the server. Please make sure the backend is running on localhost:8080');
      } else {
        Alert.alert('Registration Error', error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (text) => {
    let cleaned = text.replace(/[^\d]/g, '');
    
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }
    
    if (cleaned.length <= 2) {
      setDateOfBirth(cleaned);
    } else if (cleaned.length <= 4) {
      setDateOfBirth(cleaned.substring(0, 2) + '/' + cleaned.substring(2));
    } else {
      setDateOfBirth(
        cleaned.substring(0, 2) + 
        '/' + cleaned.substring(2, 4) + 
        '/' + cleaned.substring(4, 8)
      );
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
            placeholder="john.doe@example.com"
            placeholderTextColor="#809CFF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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
            autoComplete="new-password"
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
            placeholder="+1-555-1234"
            placeholderTextColor="#809CFF"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
            autoComplete="tel"
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
            onChangeText={handleDateChange}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
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
            placeholder="Male, Female, Other"
            placeholderTextColor="#809CFF"
            value={gender}
            onChangeText={setGender}
            autoCapitalize="words"
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
            placeholder="O+, A-, B+, AB-, etc."
            placeholderTextColor="#809CFF"
            value={bloodType}
            onChangeText={setBloodType}
            autoCapitalize="characters"
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
            placeholder="123 Main St, Springfield"
            placeholderTextColor="#809CFF"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="words"
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
            placeholder="900515123V"
            placeholderTextColor="#809CFF"
            value={patientNic}
            onChangeText={setPatientNic}
            autoCapitalize="characters"
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
            <Text style={styles.signupButtonText}>Create Account</Text> // UPDATED: Button text
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

// ... (styles remain the same)
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