import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import LoginScreen from '../pages/LoginScreen';
import SignUpScreen from '../pages/SignupScreen';
import SetPasswordScreen from '../pages/SetPasswordScreen';

const WelcomeScreen = ({ onNavigateToHome, onNavigateToLabReport, onNavigateToScanReport }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [previousScreen, setPreviousScreen] = useState('welcome');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Enhanced login handler that navigates based on role AND passes data
  const handleLoginSuccess = (doctorData = null) => {
    console.log('WelcomeScreen - handleLoginSuccess received:', doctorData);
    
    if (selectedRole?.id === 'doctor') {
      // Pass the doctor data to home screen
      onNavigateToHome(doctorData);
    } else if (selectedRole?.id === 'radiologist') {
      onNavigateToScanReport();
    } else if (selectedRole?.id === 'lab_technician') {
      onNavigateToLabReport();
    }
  };

  if (showLogin) {
    return <LoginScreen
      selectedRole={selectedRole}
      onBack={() => {
        setShowLogin(false);
        setPreviousScreen('welcome');
      }}
      onNavigateToSignUp={() => {
        setShowLogin(false);
        setShowSignUp(true);
        setPreviousScreen('login');
      }}
      onNavigateToSetPassword={() => {
        setShowLogin(false);
        setShowSetPassword(true);
        setPreviousScreen('login');
      }}
      onNavigateToHome={handleLoginSuccess} // Use the enhanced handler
    />;
  }

  if (showSignUp) {
    return <SignUpScreen
      selectedRole={selectedRole}
      onBack={() => {
        setShowSignUp(false);
        if (previousScreen === 'login') {
          setShowLogin(true);
        }
      }}
      onNavigateToLogin={() => {
        setShowSignUp(false);
        setShowLogin(true);
        setPreviousScreen('signup');
      }}
      onSignUpSuccess={() => {
        // After successful signup, go to login screen - NOT directly to home
        setShowSignUp(false);
        setShowLogin(true);
        setPreviousScreen('signup');
      }}
    />;
  }

  if (showSetPassword) {
    return <SetPasswordScreen
      onBack={() => {
        setShowSetPassword(false);
        if (previousScreen === 'login') {
          setShowLogin(true);
        }
      }}
      onLogin={() => {
        setShowSetPassword(false);
        setShowLogin(true);
      }}
    />;
  }

  const roles = [
    { id: 'doctor', label: 'Doctor' },
    { id: 'radiologist', label: 'Radiologist' },
    { id: 'lab_technician', label: 'Lab Technician' },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false);
  };

  const RoleButton = ({ role, onPress }) => (
    <TouchableOpacity
      style={[styles.roleButton, selectedRole?.id === role.id && styles.roleButtonSelected]}
      onPress={() => onPress(role)}
    >
      <Text style={[styles.roleButtonText, selectedRole?.id === role.id && styles.roleButtonTextSelected]}>
        {role.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      backgroundColor="#FFFFFF"
      statusBarStyle="dark-content"
      barStyle="dark-content"
      translucent={false}
    >
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
          Streamline patient care with secure access to medical records, diagnostics, and collaboration tools.
        </Text>

        {/* Role Selection Button */}
        <TouchableOpacity
          style={styles.roleSelector}
          onPress={() => setShowRoleModal(true)}
        >
          <Text style={selectedRole ? styles.roleSelectedText : styles.rolePlaceholder}>
            {selectedRole ? selectedRole.label : 'Select your role'}
          </Text>
        </TouchableOpacity>

        {/* Show auth buttons for ALL roles */}
        {selectedRole && (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                setShowLogin(true);
                setPreviousScreen('welcome');
              }}
            >
              <Text style={styles.loginButtonText}>LogIn as {selectedRole.label}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => {
                setShowSignUp(true);
                setPreviousScreen('welcome');
              }}
            >
              <Text style={styles.signupButtonText}>SignUp as {selectedRole.label}</Text>
            </TouchableOpacity>

            {/* Role-specific description */}
            <Text style={styles.roleDescription}>
              {selectedRole.id === 'doctor'
                ? 'Access patient records, diagnostics, and collaboration tools'
                : selectedRole.id === 'radiologist'
                  ? 'Access and manage scan reports and imaging data'
                  : 'Access and manage laboratory test results and reports'
              }
            </Text>
          </View>
        )}

        {/* Role Selection Modal */}
        <Modal
          visible={showRoleModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRoleModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Your Role</Text>

              <ScrollView style={styles.rolesContainer}>
                {roles.map((role) => (
                  <RoleButton
                    key={role.id}
                    role={role}
                    onPress={handleRoleSelect}
                  />
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowRoleModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
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
    fontWeight: '400',
    color: '#2260FF',
  },
  centricText: {
    fontSize: 38,
    fontWeight: '400',
    color: '#2260FF',
  },
  taglineText: {
    fontSize: 14,
    fontWeight: '400',
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
    marginTop: 80,
  },
  roleSelector: {
    borderWidth: 1,
    borderColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '60%',
    alignItems: 'center',
  },
  rolePlaceholder: {
    color: '#2260FF',
    fontSize: 16,
  },
  roleSelectedText: {
    color: '#2260FF',
    fontSize: 16,
    fontWeight: '600',
  },
  authButtonsContainer: {
    width: '60%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#CAD6FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButtonText: {
    color: '#2260FF',
    fontSize: 15,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2260FF',
  },
  rolesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  roleButton: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#2260FF',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#2260FF',
  },
  roleButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#CAD6FF',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#2260FF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreen;