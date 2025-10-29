import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const HomeScreen = ({
    onBack,
    onNavigateToQRScanner,
    onNavigateToReports,
    onNavigateToPrescriptions,
    onNavigateToAllergies,
    onNavigateToPrescriptionForm,
    onNavigateToProfile,
    route,
    doctorData: propDoctorData,
    patientData // This contains the scanned patient data
}) => {
    const [activePage, setActivePage] = useState('home');
    const [doctorData, setDoctorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditMedicalDataModal, setShowEditMedicalDataModal] = useState(false);
    const [medicalFormData, setMedicalFormData] = useState({
        age: '',
        thalach: '',
        oldpeak: '',
        trestbps: '',
        bmi: '',
        chol: '',
        ca: '0',
        thal: '3',
        restecg: '0',
        cp: '1',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetchingMedicalData, setFetchingMedicalData] = useState(false);

    // Get doctor data from props or route params
    const doctorDataFromRoute = route?.params?.doctorData;
    const BASE_URL = 'http://192.168.8.102:8085';
    const ML_DATA_URL = 'http://192.168.8.102:8089';

    // Use doctor data from props first, then from route
    const actualDoctorData = propDoctorData || doctorDataFromRoute;

    useEffect(() => {
        console.log('HomeScreen - Received doctor data:', actualDoctorData);
        console.log('HomeScreen - Received patient data:', patientData);

        if (actualDoctorData) {
            console.log('Setting doctor data in state:', actualDoctorData);
            setDoctorData(actualDoctorData);
            setIsLoading(false);
        } else {
            console.log('No doctor data received, using fallback');
            setIsLoading(false);
            // Fallback data for demo
            setDoctorData({
                fullName: 'Dr. John Wick',
                specialization: 'Cardiology',
                licenseNo: 'MD-2025-481'
            });
        }
    }, [actualDoctorData, patientData]);

    const fetchMedicalData = async () => {
        if (!patientData?.patientId) return;
        
        setFetchingMedicalData(true);
        try {
            console.log('Fetching medical data for patient:', patientData.patientId);
            const response = await fetch(`${ML_DATA_URL}/health/record/latest?userId=${patientData.patientId}`);
            
            if (response.ok) {
                const existingData = await response.json();
                console.log('Existing medical data:', existingData);
                
                // Update form with existing data
                setMedicalFormData({
                    age: existingData.age?.toString() || '',
                    thalach: existingData.thalach?.toString() || '',
                    oldpeak: existingData.oldpeak?.toString() || '',
                    trestbps: existingData.trestbps?.toString() || '',
                    bmi: existingData.bmi?.toString() || '',
                    chol: existingData.chol?.toString() || '',
                    ca: existingData.ca?.toString() || '0',
                    thal: existingData.thal?.toString() || '3',
                    restecg: existingData.restecg?.toString() || '0',
                    cp: existingData.cp?.toString() || '1',
                });
            } else if (response.status === 404) {
                console.log('No existing medical data found for patient');
                // Reset to default values if no data exists
                setMedicalFormData({
                    age: '',
                    thalach: '',
                    oldpeak: '',
                    trestbps: '',
                    bmi: '',
                    chol: '',
                    ca: '0',
                    thal: '3',
                    restecg: '0',
                    cp: '1',
                });
            } else {
                throw new Error(`Failed to fetch medical data: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching medical data:', error);
            if (!error.message.includes('404')) {
                Alert.alert('Load Error', 'Could not load existing medical data. You can still enter new data.');
            }
        } finally {
            setFetchingMedicalData(false);
        }
    };

    const handleQRPress = () => {
        setActivePage('qr');
        if (onNavigateToQRScanner) {
            onNavigateToQRScanner();
        }
    };

    const handleReportsPress = () => {
        setActivePage('documents');
        if (onNavigateToReports) {
            onNavigateToReports();
        }
    };

    const handlePrescriptionsPress = () => {
        setActivePage('prescriptions');
        if (onNavigateToPrescriptions) {
            onNavigateToPrescriptions();
        }
    };

    const handleAllergiesPress = () => {
        if (onNavigateToAllergies) {
            onNavigateToAllergies();
        }
    };

    const handleAddPrescriptionPress = () => {
        if (onNavigateToPrescriptionForm) {
            onNavigateToPrescriptionForm();
        }
    };

    const handleProfilePress = () => {
        if (onNavigateToProfile && doctorData?.doctorId) {
            console.log('Navigating to profile with doctorId:', doctorData.doctorId);
            onNavigateToProfile(doctorData.doctorId);
        } else if (onNavigateToProfile) {
            console.log('Navigating to profile without doctorId');
            onNavigateToProfile();
        }
    };

    const handleEditMedicalDataPress = async () => {
        if (!patientData?.patientId) {
            Alert.alert('No Patient', 'Please scan a patient QR code first to edit medical data.');
            return;
        }
        
        setShowEditMedicalDataModal(true);
        // Fetch existing medical data when opening the modal
        await fetchMedicalData();
    };

    const updateMedicalFormField = (key, value) => {
        setMedicalFormData({ ...medicalFormData, [key]: value });
    };

    const handleSaveMedicalData = async () => {
        if (!patientData?.patientId) {
            Alert.alert('Error', 'No patient ID available. Please scan a patient QR code first.');
            return;
        }
        
        if (!medicalFormData.age) {
            Alert.alert('Error', 'Age is required.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            console.log('Saving medical data for patient:', patientData.patientId);
            const response = await fetch(`${ML_DATA_URL}/health/record?userId=${patientData.patientId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...medicalFormData,
                    age: parseInt(medicalFormData.age),
                    thalach: medicalFormData.thalach ? parseInt(medicalFormData.thalach) : null,
                    oldpeak: medicalFormData.oldpeak ? parseFloat(medicalFormData.oldpeak) : null,
                    trestbps: medicalFormData.trestbps ? parseInt(medicalFormData.trestbps) : null,
                    bmi: medicalFormData.bmi ? parseFloat(medicalFormData.bmi) : null,
                    chol: medicalFormData.chol ? parseInt(medicalFormData.chol) : null,
                    ca: parseInt(medicalFormData.ca),
                    thal: parseInt(medicalFormData.thal),
                    restecg: parseInt(medicalFormData.restecg),
                    cp: parseInt(medicalFormData.cp),
                }),
            });
            
            if (!response.ok) {
                throw new Error(`Save failed with status: ${response.status}`);
            }
            
            Alert.alert('Success', 'Medical data saved successfully!');
            setShowEditMedicalDataModal(false);
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Save Error', error.message || 'Failed to save medical data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowEditMedicalDataModal(false);
    };

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
                    <Text style={styles.loadingText}>Loading...</Text>
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
            <ScrollView style={styles.container}>
                {/* First Row - White Background */}
                <View style={styles.firstRow}>
                    {/* First Horizontal Row: Profile + Icons */}
                    <View style={styles.firstHorizontalRow}>
                        {/* Left Section: Profile and Welcome */}
                        <TouchableOpacity
                            style={styles.profileSection}
                            onPress={handleProfilePress}
                        >
                            <Image
                                source={require('../assets/profile-pic.png')}
                                style={styles.profilePic}
                            />
                            <View style={styles.welcomeText}>
                                <Text style={styles.welcomeBack}>Welcome back!</Text>
                                <Text style={styles.doctorName}>
                                    {doctorData ? doctorData.fullName : 'Doctor'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Right Section: Notification and Settings Icons */}
                        <View style={styles.iconsSection}>
                            <TouchableOpacity style={styles.iconCircle}>
                                <Image
                                    source={require('../assets/notification-icon.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconCircle}
                                onPress={handleProfilePress}
                            >
                                <Image
                                    source={require('../assets/settings-icon.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider Line */}
                    <View style={styles.divider} />
                </View>

                {/* Second Row - CAD6FF Background */}
                <View style={styles.secondRow}>
                    <View style={styles.cardsContainer}>
                        {/* Patient Name Card */}
                        <View style={styles.patientCard}>
                            <Text style={styles.patientTitle}>
                                Patient: {patientData ? `${patientData.fullName || 'Unknown Patient'}` : 'No Patient Selected'}
                            </Text>
                            {patientData?.patientId && (
                                <Text style={styles.patientId}>
                                    ID: {patientData.patientId.substring(0, 8)}...
                                </Text>
                            )}
                        </View>

                        {/* Split Buttons Container */}
                        <View style={styles.splitButtonsContainer}>
                            {/* Left Button - Add Prescription */}
                            <TouchableOpacity
                                style={[styles.splitButton, styles.leftButton]}
                                onPress={handleAddPrescriptionPress}
                            >
                                <Text style={styles.splitButtonText}>+ Add New Prescription</Text>
                            </TouchableOpacity>

                            {/* Right Button - Edit Medical Data */}
                            <TouchableOpacity
                                style={[styles.splitButton, styles.rightButton]}
                                onPress={handleEditMedicalDataPress}
                            >
                                <Text style={styles.splitButtonText}>✏️ Edit Medical Data</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Two Column Layout */}
                        <View style={styles.twoColumnContainer}>
                            {/* Left Column */}
                            <View style={styles.leftColumn}>
                                {/* Blood Type Card */}
                                <View style={styles.smallCard}>
                                    <Text style={styles.bloodTypeText}>
                                        Blood Type: {patientData?.bloodType || 'O+'}
                                    </Text>
                                </View>

                                {/* Allergies Card */}
                                <View style={styles.allergiesCard}>
                                    <Text style={styles.cardTitle}>Allergies</Text>
                                    <View style={styles.cardDivider} />
                                    <View style={styles.allergiesList}>
                                        {patientData?.allergies && patientData.allergies.length > 0 ? (
                                            patientData.allergies.map((allergy, index) => (
                                                <View style={styles.allergyItem} key={index}>
                                                    <Text style={styles.allergyName}>• {allergy.name}</Text>
                                                    <Text style={styles.allergySeverity}>Severity: {allergy.severity}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <>
                                                <View style={styles.allergyItem}>
                                                    <Text style={styles.allergyName}>• Penicillin</Text>
                                                    <Text style={styles.allergySeverity}>Severity: Moderate</Text>
                                                </View>
                                                <View style={styles.allergyItem}>
                                                    <Text style={styles.allergyName}>• Peanuts</Text>
                                                    <Text style={styles.allergySeverity}>Severity: Severe</Text>
                                                </View>
                                                <View style={styles.allergyItem}>
                                                    <Text style={styles.allergyName}>• Aspirin</Text>
                                                    <Text style={styles.allergySeverity}>Severity: Moderate</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={handleAllergiesPress}
                                    >
                                        <Text style={styles.viewButtonText}>View Allergies</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Right Column */}
                            <View style={styles.rightColumn}>
                                {/* Recent Lab Reports Card */}
                                <View style={styles.labReportsCard}>
                                    <Text style={styles.cardTitle}>Recent Lab Reports</Text>
                                    <View style={styles.cardDivider} />
                                    <View style={styles.reportsList}>
                                        {patientData?.labReports && patientData.labReports.length > 0 ? (
                                            patientData.labReports.map((report, index) => (
                                                <View style={styles.reportItem} key={index}>
                                                    <Text style={styles.reportName}>• {report.testName}</Text>
                                                    <Text style={styles.reportDetail}>Date: {report.date}</Text>
                                                    <Text style={styles.reportDetail}>Status: {report.status}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <>
                                                <View style={styles.reportItem}>
                                                    <Text style={styles.reportName}>• Blood Count (FBC)</Text>
                                                    <Text style={styles.reportDetail}>Date: July 10, 2025</Text>
                                                    <Text style={styles.reportDetail}>Status: Normal</Text>
                                                </View>
                                                <View style={styles.reportItem}>
                                                    <Text style={styles.reportName}>• Lipid Panel</Text>
                                                    <Text style={styles.reportDetail}>Date: June 28, 2025</Text>
                                                    <Text style={styles.reportDetail}>Status: Elevated</Text>
                                                </View>
                                                <View style={styles.reportItem}>
                                                    <Text style={styles.reportName}>• Liver Function Test</Text>
                                                    <Text style={styles.reportDetail}>Date: June 15, 2025</Text>
                                                    <Text style={styles.reportDetail}>Status: Normal</Text>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        style={styles.viewButton}
                                        onPress={handleReportsPress}
                                    >
                                        <Text style={styles.viewButtonText}>View Reports</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Current Medication Card - Full Width */}
                        <View style={styles.medicationCard}>
                            <Text style={styles.lastPrescription}>
                                • Last Prescription: {patientData?.lastPrescriptionDate || 'July 10, 2025'}
                            </Text>
                            <View style={styles.cardDivider} />
                            <View style={styles.medicationList}>
                                {patientData?.currentMedications && patientData.currentMedications.length > 0 ? (
                                    patientData.currentMedications.map((med, index) => (
                                        <Text style={styles.medicationItem} key={index}>• {med}</Text>
                                    ))
                                ) : (
                                    <>
                                        <Text style={styles.medicationItem}>• Ibuprofen</Text>
                                        <Text style={styles.medicationItem}>• Amoxicillin</Text>
                                    </>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.viewPrescriptionsButton}
                                onPress={handlePrescriptionsPress}
                            >
                                <Text style={styles.viewButtonText}>View Prescriptions</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Third Row - Navigation */}
                <View style={styles.thirdRow}>
                    <View style={styles.navigationCard}>
                        {/* Home Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('home')}
                        >
                            <Image
                                source={
                                    activePage === 'home'
                                        ? require('../assets/home-icon1.png')
                                        : require('../assets/home-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'home' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>

                        {/* QR Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handleQRPress}
                        >
                            <Image
                                source={
                                    activePage === 'qr'
                                        ? require('../assets/qr-icon1.png')
                                        : require('../assets/qr-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'qr' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>

                        {/* Prescription Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handlePrescriptionsPress}
                        >
                            <Image
                                source={
                                    activePage === 'prescription'
                                        ? require('../assets/prescription-icon1.png')
                                        : require('../assets/prescription-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'prescription' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>

                        {/* Documents Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handleReportsPress}
                        >
                            <Image
                                source={
                                    activePage === 'documents'
                                        ? require('../assets/docs-icon1.png')
                                        : require('../assets/docs-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'documents' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Medical Data Modal */}
            <Modal
                visible={showEditMedicalDataModal}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Medical Data</Text>
                            
                            {fetchingMedicalData ? (
                                <View style={styles.loadingSection}>
                                    <ActivityIndicator size="large" color="#2260FF" />
                                    <Text style={styles.loadingText}>Loading medical data...</Text>
                                </View>
                            ) : (
                                <>
                                    {/* Numerical Inputs */}
                                    <Text style={styles.inputLabel}>Age (29-77 years) *</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={medicalFormData.age}
                                        onChangeText={(text) => updateMedicalFormField('age', text)}
                                        keyboardType="numeric"
                                        placeholder="Enter age"
                                    />

                                    <Text style={styles.inputLabel}>Max Heart Rate (71-202 bpm)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={medicalFormData.thalach}
                                        onChangeText={(text) => updateMedicalFormField('thalach', text)}
                                        keyboardType="numeric"
                                        placeholder="Enter max heart rate"
                                    />

                                    <Text style={styles.inputLabel}>ST Depression (0-6.2)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={medicalFormData.oldpeak}
                                        onChangeText={(text) => updateMedicalFormField('oldpeak', text)}
                                        keyboardType="numeric"
                                        placeholder="Enter ST depression"
                                    />

                                    <Text style={styles.inputLabel}>Resting BP (90-200 mmHg)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={medicalFormData.trestbps}
                                        onChangeText={(text) => updateMedicalFormField('trestbps', text)}
                                        keyboardType="numeric"
                                        placeholder="Enter resting BP"
                                    />

                                    <Text style={styles.inputLabel}>BMI (15-41)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={medicalFormData.bmi}
                                        onChangeText={(text) => updateMedicalFormField('bmi', text)}
                                        keyboardType="numeric"
                                        placeholder="Enter BMI"
                                    />

                                    <Text style={styles.inputLabel}>Cholesterol (120-400 mg/dl)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={medicalFormData.chol}
                                        onChangeText={(text) => updateMedicalFormField('chol', text)}
                                        keyboardType="numeric"
                                        placeholder="Enter cholesterol"
                                    />

                                    {/* Categorical Pickers */}
                                    <Text style={styles.inputLabel}>Chest Pain Type</Text>
                                    <View style={styles.pickerContainer}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.pickerOptions}>
                                                {[
                                                    { label: 'Typical Angina', value: '1' },
                                                    { label: 'Atypical Angina', value: '2' },
                                                    { label: 'Non-Anginal Pain', value: '3' },
                                                    { label: 'Asymptomatic', value: '4' }
                                                ].map((option) => (
                                                    <TouchableOpacity
                                                        key={option.value}
                                                        style={[
                                                            styles.pickerOption,
                                                            medicalFormData.cp === option.value && styles.pickerOptionSelected
                                                        ]}
                                                        onPress={() => updateMedicalFormField('cp', option.value)}
                                                    >
                                                        <Text style={[
                                                            styles.pickerOptionText,
                                                            medicalFormData.cp === option.value && styles.pickerOptionTextSelected
                                                        ]}>
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <Text style={styles.inputLabel}>ECG Results</Text>
                                    <View style={styles.pickerContainer}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.pickerOptions}>
                                                {[
                                                    { label: 'Normal', value: '0' },
                                                    { label: 'ST-T Abnormality', value: '1' },
                                                    { label: 'Left Ventricular Hypertrophy', value: '2' }
                                                ].map((option) => (
                                                    <TouchableOpacity
                                                        key={option.value}
                                                        style={[
                                                            styles.pickerOption,
                                                            medicalFormData.restecg === option.value && styles.pickerOptionSelected
                                                        ]}
                                                        onPress={() => updateMedicalFormField('restecg', option.value)}
                                                    >
                                                        <Text style={[
                                                            styles.pickerOptionText,
                                                            medicalFormData.restecg === option.value && styles.pickerOptionTextSelected
                                                        ]}>
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <Text style={styles.inputLabel}>Major Vessels</Text>
                                    <View style={styles.pickerContainer}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.pickerOptions}>
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <TouchableOpacity
                                                        key={i}
                                                        style={[
                                                            styles.pickerOption,
                                                            medicalFormData.ca === i.toString() && styles.pickerOptionSelected
                                                        ]}
                                                        onPress={() => updateMedicalFormField('ca', i.toString())}
                                                    >
                                                        <Text style={[
                                                            styles.pickerOptionText,
                                                            medicalFormData.ca === i.toString() && styles.pickerOptionTextSelected
                                                        ]}>
                                                            {i} vessels
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <Text style={styles.inputLabel}>Thalassemia</Text>
                                    <View style={styles.pickerContainer}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.pickerOptions}>
                                                {[
                                                    { label: 'Normal', value: '3' },
                                                    { label: 'Fixed Defect', value: '6' },
                                                    { label: 'Reversible Defect', value: '7' }
                                                ].map((option) => (
                                                    <TouchableOpacity
                                                        key={option.value}
                                                        style={[
                                                            styles.pickerOption,
                                                            medicalFormData.thal === option.value && styles.pickerOptionSelected
                                                        ]}
                                                        onPress={() => updateMedicalFormField('thal', option.value)}
                                                    >
                                                        <Text style={[
                                                            styles.pickerOptionText,
                                                            medicalFormData.thal === option.value && styles.pickerOptionTextSelected
                                                        ]}>
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>

                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.cancelButton]}
                                            onPress={handleCloseModal}
                                            disabled={isSubmitting}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.saveButton, isSubmitting && styles.buttonDisabled]}
                                            onPress={handleSaveMedicalData}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator size="small" color="#FFFFFF" />
                                            ) : (
                                                <Text style={styles.saveButtonText}>Save Medical Data</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
};

// ... (keep all your existing styles and add these new modal styles)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        marginTop: 10,
    },
    firstRow: {
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    firstHorizontalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profilePic: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#2260FF',
    },
    welcomeText: {
        flex: 1,
    },
    welcomeBack: {
        fontSize: 22,
        fontWeight: '400',
        color: '#2260FF',
        marginBottom: 2,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    iconsSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CAD6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: 'black',
    },
    divider: {
        height: 1,
        backgroundColor: '#2261ff72',
        marginBottom: 1,
    },
    secondRow: {
        backgroundColor: '#CAD6FF',
        padding: 20,
        flex: 1,
        paddingBottom: 5,
    },
    cardsContainer: {
        marginBottom: 0,
        alignItems: 'center',
    },
    patientCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 13,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    patientTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
    },
    patientId: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    // Split Buttons Styles
    splitButtonsContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 15,
        gap: 10,
    },
    splitButton: {
        flex: 1,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftButton: {
        backgroundColor: '#2260FF',
    },
    rightButton: {
        backgroundColor: '#2260FF',
    },
    splitButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
    twoColumnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    leftColumn: {
        flex: 1,
        marginRight: 4,
    },
    rightColumn: {
        flex: 1,
        marginLeft: 4,
    },
    smallCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 6,
        minHeight: 40,
        justifyContent: 'center',
    },
    bloodTypeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
    },
    allergiesCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        flex: 1,
    },
    labReportsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        flex: 1,
    },
    medicationCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 10,
        textAlign: 'center',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#DDD',
        width: '100%',
        marginBottom: 15,
    },
    allergiesList: {
        marginBottom: 5,
        flex: 1,
    },
    allergyItem: {
        marginBottom: 10,
    },
    allergyName: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
    },
    allergySeverity: {
        fontSize: 12,
        color: '#666',
        marginLeft: 10,
    },
    reportsList: {
        marginBottom: 5,
        flex: 1,
    },
    reportItem: {
        marginBottom: 10,
    },
    reportName: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
    },
    reportDetail: {
        fontSize: 12,
        color: '#666',
        marginLeft: 10,
    },
    lastPrescription: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000ff',
        marginBottom: 10,
    },
    medicationList: {
        marginLeft: 10,
        marginTop: -5,
        marginBottom: 10,
    },
    medicationItem: {
        fontSize: 14,
        color: '#666',
        marginBottom: 1,
        fontWeight: '500',
    },
    viewButton: {
        backgroundColor: '#2260FF',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 22,
        alignSelf: 'center',
        marginTop: 1,
    },
    viewPrescriptionsButton: {
        backgroundColor: '#2260FF',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 60,
        alignSelf: 'center',
        marginTop: 1,
    },
    viewButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    thirdRow: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        alignItems: 'center',
        paddingTop: 10,
    },
    navigationCard: {
        width: 298,
        height: 48,
        backgroundColor: '#2260FF',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navIcon: {
        padding: 10,
    },
    navIconImage: {
        width: 24,
        height: 24,
    },
    activeIcon: {
        tintColor: 'black',
    },
    inactiveIcon: {
        tintColor: '#FFFFFF',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalContent: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 20,
    },
    loadingSection: {
        alignItems: 'center',
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2260FF',
        marginBottom: 5,
        marginTop: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#CAD6FF',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#F8FAFF',
        marginBottom: 5,
    },
    pickerContainer: {
        marginBottom: 15,
    },
    pickerOptions: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 5,
    },
    pickerOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#ECF1FF',
        borderWidth: 1,
        borderColor: '#CAD6FF',
    },
    pickerOptionSelected: {
        backgroundColor: '#2260FF',
        borderColor: '#2260FF',
    },
    pickerOptionText: {
        fontSize: 14,
        color: '#2260FF',
        fontWeight: '500',
    },
    pickerOptionTextSelected: {
        color: '#FFFFFF',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    modalButton: {
        flex: 1,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    saveButton: {
        backgroundColor: '#2260FF',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HomeScreen;