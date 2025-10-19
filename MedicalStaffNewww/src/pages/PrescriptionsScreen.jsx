import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const PrescriptionsScreen = ({ 
    onBack, 
    onNavigateToHome, 
    onNavigateToQRScanner, 
    onNavigateToReports,
    onNavigateToAllergies 
}) => {
    const [activePage, setActivePage] = useState('prescription');
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const handleHomePress = () => {
        setActivePage('home');
        if (onNavigateToHome) {
            onNavigateToHome();
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

    const handleAllergiesPress = () => {
        setActivePage('allergies');
        if (onNavigateToAllergies) {
            onNavigateToAllergies();
        }
    };

    const handlePrescriptionPress = (prescriptionId) => {
        setSelectedPrescription(prescriptionId);
        // Here you can add navigation to detailed prescription view
    };

    return (
        <ScreenWrapper
            backgroundColor="#FFFFFF"
            statusBarStyle="dark-content"
            barStyle="dark-content"
            translucent={false}
        >
            <ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Prescriptions</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Date and Filter Row */}
                <View style={styles.filterRow}>
                    {/* Date Card */}
                    <View style={styles.dateCard}>
                        <Text style={styles.dateText}>26th April</Text>
                    </View>

                    {/* Filter Card */}
                    <View style={styles.filterCard}>
                        <Text style={styles.filterPlaceholder}>filter prescriptions...</Text>
                        <Image
                            source={require('../assets/drop-down.png')}
                            style={styles.dropdownIcon}
                        />
                    </View>
                </View>

                {/* Prescriptions List */}
                <View style={styles.prescriptionsList}>
                    {/* Prescription Item 1 */}
                    <TouchableOpacity 
                        style={[
                            styles.prescriptionItem,
                            selectedPrescription === 1 && styles.selectedPrescriptionItem
                        ]}
                        onPress={() => handlePrescriptionPress(1)}
                    >
                        <View style={styles.prescriptionIconContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.prescriptionIcon}
                            />
                        </View>
                        <View style={styles.prescriptionContent}>
                            <Text style={styles.prescriptionName}>Diabetes Checkup</Text>
                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                Type: Metabolic
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Prescription Item 2 */}
                    <TouchableOpacity 
                        style={[
                            styles.prescriptionItem,
                            selectedPrescription === 2 && styles.selectedPrescriptionItem
                        ]}
                        onPress={() => handlePrescriptionPress(2)}
                    >
                        <View style={styles.prescriptionIconContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.prescriptionIcon}
                            />
                        </View>
                        <View style={styles.prescriptionContent}>
                            <Text style={styles.prescriptionName}>Back Pain Treatment</Text>
                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                Type: Musculoskeletal
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Prescription Item 3 */}
                    <TouchableOpacity 
                        style={[
                            styles.prescriptionItem,
                            selectedPrescription === 3 && styles.selectedPrescriptionItem
                        ]}
                        onPress={() => handlePrescriptionPress(3)}
                    >
                        <View style={styles.prescriptionIconContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.prescriptionIcon}
                            />
                        </View>
                        <View style={styles.prescriptionContent}>
                            <Text style={styles.prescriptionName}>Hypertension Management</Text>
                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                Type: Cardiovascular
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* NEW Prescription Item 4 - Added under first date card */}
                    <TouchableOpacity 
                        style={[
                            styles.prescriptionItem,
                            selectedPrescription === 4 && styles.selectedPrescriptionItem
                        ]}
                        onPress={() => handlePrescriptionPress(4)}
                    >
                        <View style={styles.prescriptionIconContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.prescriptionIcon}
                            />
                        </View>
                        <View style={styles.prescriptionContent}>
                            <Text style={styles.prescriptionName}>Common Cold Treatment</Text>
                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                Type: Respiratory
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Second Date Card */}
                    <View style={[styles.dateCard, styles.secondDateCard]}>
                        <Text style={styles.dateText}>19th April</Text>
                    </View>

                    {/* Spacing under second date card */}
                    <View style={styles.dateCardSpacing} />

                    {/* Prescription Item 5 */}
                    <TouchableOpacity 
                        style={[
                            styles.prescriptionItem,
                            selectedPrescription === 5 && styles.selectedPrescriptionItem
                        ]}
                        onPress={() => handlePrescriptionPress(5)}
                    >
                        <View style={styles.prescriptionIconContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.prescriptionIcon}
                            />
                        </View>
                        <View style={styles.prescriptionContent}>
                            <Text style={styles.prescriptionName}>Allergy Relief</Text>
                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                Type: Immunological
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Prescription Item 6 */}
                    <TouchableOpacity 
                        style={[
                            styles.prescriptionItem,
                            selectedPrescription === 6 && styles.selectedPrescriptionItem
                        ]}
                        onPress={() => handlePrescriptionPress(6)}
                    >
                        <View style={styles.prescriptionIconContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.prescriptionIcon}
                            />
                        </View>
                        <View style={styles.prescriptionContent}>
                            <Text style={styles.prescriptionName}>Anxiety Treatment</Text>
                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                Type: Neurological
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Navigation Bar */}
                <View style={styles.thirdRow}>
                    <View style={styles.navigationCard}>
                        {/* Home Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handleHomePress}
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
                            onPress={() => setActivePage('prescription')}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 30,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
    },
    backText: {
        fontSize: 50,
        color: '#2260FF',
        fontWeight: 'regular',
        marginTop: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 24,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -10,
        marginBottom: 15,
        gap: 10,
    },
    dateCard: {
        backgroundColor: '#CAD6FF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondDateCard: {
        marginTop: 5,
        width: 120,
        alignSelf: 'flex-start',
    },
    dateCardSpacing: {
        height: 15,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
    },
    filterCard: {
        backgroundColor: '#CAD6FF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 180,
    },
    filterPlaceholder: {
        fontSize: 16,
        color: '#2261ff74',
        fontWeight: '500',
    },
    dropdownIcon: {
        width: 24,
        height: 24,
        tintColor: '#2260FF',
    },
    prescriptionsList: {
        paddingHorizontal: 20,
        marginBottom: -2,
    },
    prescriptionItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        alignItems: 'center',
    },
    selectedPrescriptionItem: {
        backgroundColor: '#CAD6FF',
        borderColor: '#2260FF',
    },
    prescriptionIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#2260FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    prescriptionIcon: {
        width: 22,
        height: 22,
        tintColor: '#FFFFFF',
    },
    prescriptionContent: {
        flex: 1,
    },
    prescriptionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    prescriptionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    thirdRow: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        alignItems: 'center',
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

export default PrescriptionsScreen;