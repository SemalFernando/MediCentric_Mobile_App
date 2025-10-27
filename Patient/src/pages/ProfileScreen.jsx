import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const ProfileScreen = ({ route, onBack, onLogout }) => {
  const [patientData, setPatientData] = useState({
    fullName: '',
    email: '',
    contactInfo: '',
    dob: '',
    address: '',
    patientNic: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get patientId from navigation params
  const patientId = route.params?.patientId;
  const BASE_URL = 'http://192.168.1.4:8080';

  // Format date from "1990-05-15T00:00:00.000+00:00" to "05/15/1990"
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // Extract just the date part before the 'T'
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    
    return `${month}/${day}/${year}`;
  };

  // Format date from "05/15/1990" to "1990-05-15"
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const [month, day, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Fetch patient data from backend
  const fetchPatientData = async () => {
    if (!patientId) {
      Alert.alert('Error', 'No patient ID provided');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/patients/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw patient data:', data); // For debugging
      
      // Format the date properly
      const formattedDob = data.dob ? formatDateForDisplay(data.dob) : '';
      console.log('Formatted DOB:', formattedDob); // For debugging
      
      setPatientData({
        fullName: data.fullName || 'Patient',
        email: data.email || '',
        contactInfo: data.contactInfo || '',
        dob: formattedDob,
        address: data.address || '',
        patientNic: data.patientNic || ''
      });
    } catch (error) {
      console.error('Error fetching patient data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update patient data
  const updatePatientData = async () => {
    if (!patientId) {
      Alert.alert('Error', 'No patient ID provided');
      return;
    }

    try {
      // Format date back to "1990-05-15" format for backend
      const formattedDob = formatDateForBackend(patientData.dob);

      const updateData = {
        email: patientData.email,
        contactInfo: patientData.contactInfo,
        dob: formattedDob,
        address: patientData.address,
        patientNic: patientData.patientNic
      };

      const response = await fetch(`${BASE_URL}/patients/${patientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      
      // Update local state with the response data
      const formattedDobDisplay = updatedData.dob ? formatDateForDisplay(updatedData.dob) : '';
      
      setPatientData(prev => ({
        ...prev,
        fullName: updatedData.fullName || prev.fullName,
        email: updatedData.email || prev.email,
        contactInfo: updatedData.contactInfo || prev.contactInfo,
        dob: formattedDobDisplay,
        address: updatedData.address || prev.address,
        patientNic: updatedData.patientNic || prev.patientNic
      }));

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating patient data:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleUpdateProfile = () => {
    if (isEditing) {
      // Validate required fields before saving
      if (!patientData.email) {
        Alert.alert('Error', 'Email is a required field.');
        return;
      }
      updatePatientData();
    } else {
      setIsEditing(true);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutPopup(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutPopup(false);
  };

  // Fetch patient data when component mounts
  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (isLoading) {
    return (
      <ScreenWrapper 
        backgroundColor="#FFFFFF"
        statusBarStyle="dark-content"
        barStyle="dark-content"
        translucent={false}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!patientId) {
    return (
      <ScreenWrapper 
        backgroundColor="#FFFFFF"
        statusBarStyle="dark-content"
        barStyle="dark-content"
        translucent={false}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No patient ID provided</Text>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper 
      backgroundColor="#FFFFFF"
      statusBarStyle="dark-content"
      barStyle="dark-content"
      translucent={false}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Image 
              source={require('../assets/settings-icon.png')} 
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../assets/profile-pic.png')} 
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Image 
                source={require('../assets/edit-icon.png')} 
                style={styles.editIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{patientData.fullName}</Text>
        </View>

        {/* Profile Form Section */}
        <View style={styles.formSection}>
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
              value={patientData.email}
              onChangeText={(text) => setPatientData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isEditing}
            />
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
              value={patientData.contactInfo}
              onChangeText={(text) => setPatientData(prev => ({ ...prev, contactInfo: text }))}
              keyboardType="phone-pad"
              editable={isEditing}
            />
          </View>

          {/* Date of Birth Section */}
          <Text style={styles.inputLabel}>Date of birth</Text>
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
              value={patientData.dob}
              onChangeText={(text) => setPatientData(prev => ({ ...prev, dob: text }))}
              keyboardType="numbers-and-punctuation"
              editable={isEditing}
            />
          </View>

          {/* Address Section */}
          <Text style={styles.inputLabel}>Address</Text>
          <View style={styles.inputContainer}>
            <Image 
              source={require('../assets/location-icon.png')} 
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.input}
              placeholder="123 Main St, Springfield"
              placeholderTextColor="#809CFF"
              value={patientData.address}
              onChangeText={(text) => setPatientData(prev => ({ ...prev, address: text }))}
              editable={isEditing}
            />
          </View>

          {/* NIC Number Section */}
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
              value={patientData.patientNic}
              onChangeText={(text) => setPatientData(prev => ({ ...prev, patientNic: text }))}
              editable={isEditing}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.updateButton, isEditing && styles.saveButton]} 
            onPress={handleUpdateProfile}
          >
            <Text style={styles.updateButtonText}>
              {isEditing ? 'Save Changes' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => setShowLogoutPopup(true)}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Popup */}
      <Modal
        visible={showLogoutPopup}
        transparent={true}
        animationType="slide"
        onRequestClose={handleLogoutCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Logout</Text>
            <Text style={styles.popupDescription}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleLogoutCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.confirmButtonText}>Yes, logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

// ... keep the same styles as before ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#2260FF',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#DC3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#2260FF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: 10,
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
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: '#2260FF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2260FF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#2260FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2260FF',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 5,
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
  buttonsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  updateButton: {
    backgroundColor: '#2260FF',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    borderRadius: 25,
    paddingVertical: 15,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Popup Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: '#2260FF8A',
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 30,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2260FF',
    textAlign: 'center',
    marginBottom: 12,
  },
  popupDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#CAD6FF',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2260FF',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#DC3545',
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;