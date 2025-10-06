import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const HomeScreen = ({ onBack, onNavigateToQRScanner, onNavigateToReports, onNavigateToPrescriptions, onNavigateToAllergies, onNavigateToPrescriptionForm }) => {
    const [activePage, setActivePage] = useState('home'); // Track the active page

    const handleQRPress = () => {
        setActivePage('qr');
        // Navigate to QR scanning page using the prop
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
                        <View style={styles.profileSection}>
                            <Image
                                source={require('../assets/profile-pic.png')}
                                style={styles.profilePic}
                            />
                            <View style={styles.welcomeText}>
                                <Text style={styles.welcomeBack}>Welcome back!</Text>
                                <Text style={styles.doctorName}>Dr. John Wick</Text>
                            </View>
                        </View>

                        {/* Right Section: Notification and Settings Icons */}
                        <View style={styles.iconsSection}>
                            <TouchableOpacity style={styles.iconCircle}>
                                <Image
                                    source={require('../assets/notification-icon.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconCircle}>
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

// ... (styles remain exactly the same as your original)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        borderRadius: 30,
        marginRight: 15,
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
        paddingBottom: 5, // Reduced bottom padding to decrease gap
    },
    cardsContainer: {
        marginBottom: 0, // Removed margin bottom
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
        marginBottom: 6, // Reduced margin bottom to decrease gap
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
        paddingHorizontal: 60, // Increased width for prescriptions button only
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
        padding: 10, // Reduced padding to decrease gap
        alignItems: 'center',
        paddingTop: 10, // Reduced top padding
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