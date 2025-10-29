import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const DoctorProfileScreen = ({ route, onBack, onLogout }) => {
  const [doctorData, setDoctorData] = useState({
    fullName: '',
    email: '',
    contactInfo: '',
    licenseNo: '',
    specialization: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get doctorId from navigation params
  const doctorId = route.params?.doctorId;
  const BASE_URL = 'http://192.168.8.102:8085';

  // Fetch doctor data from backend
  const fetchDoctorData = async () => {
    if (!doctorId) {
      Alert.alert('Error', 'No doctor ID provided');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw doctor data:', data);
      
      setDoctorData({
        fullName: data.fullName || 'Doctor',
        email: data.email || '',
        contactInfo: data.contactInfo || '',
        licenseNo: data.licenseNo || '',
        specialization: data.specialization || ''
      });
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update doctor data
  const updateDoctorData = async () => {
    if (!doctorId) {
      Alert.alert('Error', 'No doctor ID provided');
      return;
    }

    try {
      const updateData = {
        email: doctorData.email,
        contactInfo: doctorData.contactInfo,
        licenseNo: doctorData.licenseNo,
        specialization: doctorData.specialization
      };

      const response = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
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
      
      setDoctorData(prev => ({
        ...prev,
        fullName: updatedData.fullName || prev.fullName,
        email: updatedData.email || prev.email,
        contactInfo: updatedData.contactInfo || prev.contactInfo,
        licenseNo: updatedData.licenseNo || prev.licenseNo,
        specialization: updatedData.specialization || prev.specialization
      }));

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating doctor data:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleUpdateProfile = () => {
    if (isEditing) {
      if (!doctorData.email) {
        Alert.alert('Error', 'Email is a required field.');
        return;
      }
      updateDoctorData();
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

  // Fetch doctor data when component mounts
  useEffect(() => {
    if (doctorId) {
      fetchDoctorData();
    }
  }, [doctorId]);

  if (isLoading) {
    return (
      <ScreenWrapper 
        backgroundColor="#FFFFFF"
        statusBarStyle="dark-content"
        barStyle="dark-content"
        translucent={false}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2260FF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!doctorId) {
    return (
      <ScreenWrapper 
        backgroundColor="#FFFFFF"
        statusBarStyle="dark-content"
        barStyle="dark-content"
        translucent={false}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No doctor ID provided</Text>
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
          <Text style={styles.headerTitle}>Doctor Profile</Text>
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
          <Text style={styles.userName}>{doctorData.fullName}</Text>
          {/* REMOVED: Specialization display under the name */}
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
              value={doctorData.email}
              onChangeText={(text) => setDoctorData(prev => ({ ...prev, email: text }))}
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
              value={doctorData.contactInfo}
              onChangeText={(text) => setDoctorData(prev => ({ ...prev, contactInfo: text }))}
              keyboardType="phone-pad"
              editable={isEditing}
            />
          </View>

          {/* License Number Section */}
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
              value={doctorData.licenseNo}
              onChangeText={(text) => setDoctorData(prev => ({ ...prev, licenseNo: text }))}
              editable={isEditing}
            />
          </View>

          {/* Specialization Section - Still keeping the field for editing */}
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
              value={doctorData.specialization}
              onChangeText={(text) => setDoctorData(prev => ({ ...prev, specialization: text }))}
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
  // REMOVED: specialization style since we're not displaying it under the name
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

export default DoctorProfileScreen;