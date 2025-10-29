import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const PrescriptionsScreen = ({ 
    onBack, 
    onNavigateToHome, 
    onNavigateToInitialHome,
    onNavigateToQRScanner, 
    onNavigateToReports,
    onNavigateToAllergies,
    patientData,
    route
}) => {
    const [activePage, setActivePage] = useState('prescription');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [patientPrescriptions, setPatientPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [groupedPrescriptions, setGroupedPrescriptions] = useState({});

    // Get patient data from props or route params
    const patientDataFromRoute = route?.params?.patientData;
    const actualPatientData = patientData || patientDataFromRoute;

    useEffect(() => {
        console.log('PrescriptionsScreen - Received patient data:', actualPatientData);

        if (actualPatientData?.patientId) {
            // Fetch prescriptions from prescription service (port 8089)
            fetchPatientPrescriptions(actualPatientData.patientId);
        } else {
            // No patient data, clear prescriptions
            setPatientPrescriptions([]);
            setGroupedPrescriptions({});
        }
    }, [actualPatientData]);

    // Function to fetch patient prescriptions from prescription service (port 8089)
    const fetchPatientPrescriptions = async (patientId) => {
        try {
            setIsLoading(true);
            console.log('Fetching prescriptions for patient:', patientId);

            const response = await fetch(`http://192.168.8.102:8090/patients/${patientId}/prescriptions`);

            if (response.ok) {
                const prescriptions = await response.json();
                console.log('Fetched prescriptions:', prescriptions);
                setPatientPrescriptions(prescriptions);
                groupPrescriptionsByDate(prescriptions);
            } else {
                console.log('No prescriptions found for patient');
                setPatientPrescriptions([]);
                setGroupedPrescriptions({});
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            setPatientPrescriptions([]);
            setGroupedPrescriptions({});
        } finally {
            setIsLoading(false);
        }
    };

    // Group prescriptions by date
    const groupPrescriptionsByDate = (prescriptions) => {
        const grouped = {};

        prescriptions.forEach(prescription => {
            // Use prescription date or createdAt field
            const prescriptionDate = prescription.prescriptionDate || prescription.date || prescription.createdAt || prescription.issueDate || new Date().toISOString().split('T')[0];
            const formattedDate = formatDateForDisplay(prescriptionDate);

            if (!grouped[formattedDate]) {
                grouped[formattedDate] = [];
            }
            grouped[formattedDate].push(prescription);
        });

        console.log('Grouped prescriptions:', grouped);
        setGroupedPrescriptions(grouped);
    };

    // Format date to "26th April" format
    const formatDateForDisplay = (dateString) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });

            // Add ordinal suffix to day
            const getOrdinalSuffix = (day) => {
                if (day > 3 && day < 21) return 'th';
                switch (day % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };

            return `${day}${getOrdinalSuffix(day)} ${month}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown Date';
        }
    };

    // Sort dates in descending order (newest first)
    const getSortedDates = () => {
        return Object.keys(groupedPrescriptions).sort((a, b) => {
            try {
                // Convert display dates back to proper dates for sorting
                const dateA = new Date(a.replace(/(\d+)(st|nd|rd|th)/, '$1'));
                const dateB = new Date(b.replace(/(\d+)(st|nd|rd|th)/, '$1'));
                return dateB - dateA;
            } catch (error) {
                return 0;
            }
        });
    };

    // Get prescription display name
    const getPrescriptionDisplay = (prescription) => {
        return prescription.medicationName || prescription.prescriptionName || prescription.diagnosis || 'Prescription';
    };

    // Get prescription description
    const getPrescriptionDescription = (prescription, date) => {
        if (prescription.dosage) return `Dosage: ${prescription.dosage}`;
        if (prescription.instructions) return `Instructions: ${prescription.instructions}`;
        if (prescription.description) return prescription.description;

        let description = `Prescription from ${date}`;
        if (prescription.status) description += ` - Status: ${prescription.status}`;

        return description;
    };

    const handleHomePress = () => {
        setActivePage('home');

        // Conditional navigation based on whether patient is scanned
        if (actualPatientData) {
            // If patient is scanned, go to patient homepage
            if (onNavigateToHome) {
                onNavigateToHome();
            }
        } else {
            // If no patient scanned, go to initial homepage
            if (onNavigateToInitialHome) {
                onNavigateToInitialHome();
            }
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
        console.log('Selected prescription:', prescriptionId);
    };

    // Render loading state
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
                    <Text style={styles.loadingText}>Loading prescriptions...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    // Render empty state when no patient is selected
    if (!actualPatientData) {
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

                    {/* Empty State */}
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../assets/prescription-icon2.png')}
                            style={styles.emptyIcon}
                        />
                        <Text style={styles.emptyTitle}>No Patient Selected</Text>
                        <Text style={styles.emptyDescription}>
                            Scan a patient's QR code to view their prescriptions
                        </Text>
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
    }

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
                    {/* Date Card - Show first date if available */}
                    {getSortedDates().length > 0 && (
                        <View style={styles.dateCard}>
                            <Text style={styles.dateText}>{getSortedDates()[0]}</Text>
                        </View>
                    )}

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
                    {getSortedDates().length > 0 ? (
                        getSortedDates().map((date, dateIndex) => (
                            <View key={date}>
                                {/* Date Card for each group */}
                                {dateIndex > 0 && (
                                    <View style={[styles.dateCard, styles.secondDateCard]}>
                                        <Text style={styles.dateText}>{date}</Text>
                                    </View>
                                )}

                                {/* Spacing under date card */}
                                {dateIndex > 0 && <View style={styles.dateCardSpacing} />}

                                {/* Prescriptions for this date */}
                                {groupedPrescriptions[date].map((prescription, prescriptionIndex) => (
                                    <TouchableOpacity
                                        key={prescription.id || prescription.prescriptionId || `prescription-${prescriptionIndex}`}
                                        style={[
                                            styles.prescriptionItem,
                                            selectedPrescription === (prescription.id || prescription.prescriptionId) && styles.selectedPrescriptionItem
                                        ]}
                                        onPress={() => handlePrescriptionPress(prescription.id || prescription.prescriptionId)}
                                    >
                                        <View style={styles.prescriptionIconContainer}>
                                            <Image
                                                source={require('../assets/prescription-icon2.png')}
                                                style={styles.prescriptionIcon}
                                            />
                                        </View>
                                        <View style={styles.prescriptionContent}>
                                            <Text style={styles.prescriptionName}>
                                                {getPrescriptionDisplay(prescription)}
                                            </Text>
                                            <Text style={styles.prescriptionDescription} numberOfLines={2}>
                                                {getPrescriptionDescription(prescription, date)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    ) : (
                        // Empty state when patient has no prescriptions
                        <View style={styles.emptyContainer}>
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={styles.emptyIcon}
                            />
                            <Text style={styles.emptyTitle}>No Prescriptions Available</Text>
                            <Text style={styles.emptyDescription}>
                                No prescriptions found for {actualPatientData.fullName || 'this patient'}
                            </Text>
                        </View>
                    )}
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 50,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        tintColor: '#CAD6FF',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
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