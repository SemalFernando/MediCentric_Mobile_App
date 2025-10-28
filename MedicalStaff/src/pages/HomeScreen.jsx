import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
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
  doctorData: propDoctorData // Receive doctor data as direct prop
}) => {
    const [activePage, setActivePage] = useState('home');
    const [doctorData, setDoctorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get doctor data from props or route params
    const doctorDataFromRoute = route?.params?.doctorData;
    const BASE_URL = 'http://192.168.1.4:8085';

    // Use doctor data from props first, then from route
    const actualDoctorData = propDoctorData || doctorDataFromRoute;

    useEffect(() => {
        console.log('HomeScreen - Received doctor data:', actualDoctorData);
        console.log('Route params:', route?.params);
        
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
                specialization: 'Cardiology', // Keep the field but don't display it
                licenseNo: 'MD-2025-481'
            });
        }
    }, [actualDoctorData]);

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
                                {/* REMOVED: Specialization display under the name */}
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
                            <Text style={styles.patientTitle}>Patient: Mr. Ryan Ravinathan</Text>
                        </View>

                        {/* Add New Prescription Button */}
                        <TouchableOpacity
                            style={styles.addPrescriptionButton}
                            onPress={handleAddPrescriptionPress}
                        >
                            <Text style={styles.addPrescriptionText}>+ Add new prescription</Text>
                        </TouchableOpacity>

                        {/* Two Column Layout */}
                        <View style={styles.twoColumnContainer}>
                            {/* Left Column */}
                            <View style={styles.leftColumn}>
                                {/* Blood Type Card */}
                                <View style={styles.smallCard}>
                                    <Text style={styles.bloodTypeText}>Blood Type: O+</Text>
                                </View>

                                {/* Allergies Card */}
                                <View style={styles.allergiesCard}>
                                    <Text style={styles.cardTitle}>Allergies</Text>
                                    <View style={styles.cardDivider} />
                                    <View style={styles.allergiesList}>
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
                            <Text style={styles.lastPrescription}>• Last Prescription: July 10, 2025</Text>
                            <View style={styles.cardDivider} />
                            <View style={styles.medicationList}>
                                <Text style={styles.medicationItem}>• Ibuprofen</Text>
                                <Text style={styles.medicationItem}>• Amoxicillin</Text>
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
        </ScreenWrapper>
    );
};

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
    // REMOVED: specialization style since we're not displaying it anymore
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
    addPrescriptionButton: {
        width: '100%',
        backgroundColor: '#2260FF',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    addPrescriptionText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
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
});

export default HomeScreen;