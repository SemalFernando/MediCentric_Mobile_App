import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import MedBot from '../components/MedBot';
import QRCode from 'react-native-qrcode-svg';

const PrescriptionsScreen = ({
    onBack,
    onNavigateToHome,
    onNavigateToQRScanner,
    onNavigateToReports,
    onNavigateToAllergies,
    onNavigateToDiagnose,
    patientData
}) => {
    const [activePage, setActivePage] = useState('prescription');
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Use the exact same URL that worked in your logs
    const baseUrl = 'http://172.16.102.245:8090';
    const patientId = patientData?.patientId;

    console.log('PrescriptionsScreen - Patient Data:', patientData);
    console.log('Patient ID:', patientId);
    console.log('Fetch URL:', `${baseUrl}/patients/${patientId}/prescriptions`);

    // Fetch prescriptions when component mounts
    useEffect(() => {
        if (patientId) {
            fetchPrescriptions();
        } else {
            console.log('No patient ID available');
            setLoading(false);
        }
    }, [patientId]);

    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            console.log('Fetching prescriptions for patient:', patientId);

            const response = await fetch(`${baseUrl}/patients/${patientId}/prescriptions`);

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched prescriptions data:', data);
            setPrescriptions(data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            Alert.alert('Error', `Failed to load prescriptions: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            console.log('Date formatting error:', error);
            return 'Invalid date';
        }
    };

    // Sort prescriptions by date (latest first) and group by date
    const getSortedAndGroupedPrescriptions = () => {
        // First, sort prescriptions by issueDate (newest first)
        const sortedPrescriptions = [...prescriptions].sort((a, b) => {
            const dateA = new Date(a.issueDate);
            const dateB = new Date(b.issueDate);
            return dateB - dateA; // Descending order (newest first)
        });

        // Then group by date
        const grouped = {};
        sortedPrescriptions.forEach(prescription => {
            try {
                const date = new Date(prescription.issueDate);
                const dateKey = date.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(prescription);
            } catch (error) {
                console.log('Error grouping prescription:', error);
            }
        });

        console.log('Sorted and grouped prescriptions:', grouped);
        return grouped;
    };

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

    const handleDiagnosePress = () => {
        if (onNavigateToDiagnose) {
            onNavigateToDiagnose();
        }
    };

    const handleViewMore = (prescription) => {
        setSelectedPrescription(prescription);
        setShowDetailsModal(true);
    };

    const handleQRCodePress = (prescription) => {
        console.log('QR Code data:', prescription.qrCode);
        if (prescription.qrCode) {
            setSelectedQRCode(prescription.qrCode);
            setShowQRModal(true);
        } else {
            Alert.alert('No QR Code', 'This prescription does not have a QR code generated yet.');
        }
    };

    const closeQRModal = () => {
        setShowQRModal(false);
        setSelectedQRCode('');
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedPrescription(null);
    };

    const groupedPrescriptions = getSortedAndGroupedPrescriptions();

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
                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Text style={styles.backText}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Prescriptions</Text>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Search and Filter Row */}
                    <View style={styles.filterRow}>
                        {/* Search Card */}
                        <View style={styles.searchCard}>
                            <Image
                                source={require('../assets/search-icon.png')}
                                style={styles.searchIcon}
                            />
                            <Text style={styles.searchPlaceholder}>search presc...</Text>
                        </View>

                        {/* Filter Card */}
                        <View style={styles.filterCard}>
                            <Text style={styles.filterPlaceholder}>filter presc...</Text>
                            <Image
                                source={require('../assets/drop-down.png')}
                                style={styles.dropdownIcon}
                            />
                        </View>
                    </View>
                </View>

                {/* Second Row - Prescription Cards */}
                <View style={styles.secondRow}>
                    <View style={styles.cardsContainer}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Loading prescriptions...</Text>
                            </View>
                        ) : prescriptions.length === 0 ? (
                            <View style={styles.noPrescriptionsContainer}>
                                <Text style={styles.noPrescriptionsText}>No prescriptions found</Text>
                                <Text style={styles.noPrescriptionsSubtext}>
                                    {patientId
                                        ? 'No prescriptions found for this patient.'
                                        : 'No patient data available. Please scan a patient QR code first.'
                                    }
                                </Text>
                            </View>
                        ) : (
                            Object.entries(groupedPrescriptions).map(([date, datePrescriptions]) => (
                                <View key={date}>
                                    <Text style={styles.dateHeader}>{date}</Text>
                                    {datePrescriptions.map((prescription, index) => (
                                        <View key={prescription.prescriptionId || index} style={styles.prescriptionCard}>
                                            {/* Card Title - Hardcoded */}
                                            <Text style={styles.cardTitle}>Prescription</Text>
                                            
                                            {/* Divider Line */}
                                            <View style={styles.cardDivider} />
                                            
                                            {/* Date and QR Code Row */}
                                            <View style={styles.contentRow}>
                                                <Text style={styles.issueDate}>
                                                    Issued: {formatDate(prescription.issueDate)}
                                                </Text>
                                                
                                                <TouchableOpacity
                                                    onPress={() => handleQRCodePress(prescription)}
                                                    style={styles.qrButton}
                                                >
                                                    <Image
                                                        source={require('../assets/qr-code-icon.png')}
                                                        style={styles.qrCodeIcon}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            {/* View Details Button */}
                                            <TouchableOpacity
                                                style={styles.viewMoreButton}
                                                onPress={() => handleViewMore(prescription)}
                                            >
                                                <Text style={styles.viewMoreText}>View Details</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}
                    </View>
                </View>

                {/* Third Row - Navigation */}
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

            {/* QR Code Modal */}
            <Modal
                visible={showQRModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeQRModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.qrModalContent}>
                        <Text style={styles.qrModalTitle}>Prescription QR Code</Text>

                        <View style={styles.qrCodeContainer}>
                            <QRCode
                                value={selectedQRCode}
                                size={200}
                                backgroundColor="#FFFFFF"
                                color="#000000"
                            />
                        </View>

                        <Text style={styles.qrDescription}>
                            Scan this QR code to view prescription details
                        </Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeQRModal}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Prescription Details Modal */}
            <Modal
                visible={showDetailsModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeDetailsModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.detailsModalContent}>
                        <Text style={styles.detailsModalTitle}>Prescription Details</Text>

                        {selectedPrescription && (
                            <View style={styles.detailsContent}>
                                <View style={styles.detailRowModal}>
                                    <Text style={styles.detailLabelModal}>Medication:</Text>
                                    <Text style={styles.detailValueModal}>{selectedPrescription.medicationName || 'Not specified'}</Text>
                                </View>

                                <View style={styles.detailRowModal}>
                                    <Text style={styles.detailLabelModal}>Category:</Text>
                                    <Text style={styles.detailValueModal}>{selectedPrescription.category || 'General'}</Text>
                                </View>

                                <View style={styles.detailRowModal}>
                                    <Text style={styles.detailLabelModal}>Issue Date:</Text>
                                    <Text style={styles.detailValueModal}>{formatDate(selectedPrescription.issueDate)}</Text>
                                </View>

                                {selectedPrescription.nextReviewDate && (
                                    <View style={styles.detailRowModal}>
                                        <Text style={styles.detailLabelModal}>Review Date:</Text>
                                        <Text style={styles.detailValueModal}>{formatDate(new Date(selectedPrescription.nextReviewDate))}</Text>
                                    </View>
                                )}

                                {/* QR Code Section */}
                                <View style={styles.qrSection}>
                                    <View style={styles.qrCodeContainerModal}>
                                        {selectedPrescription.qrCode ? (
                                            <QRCode
                                                value={selectedPrescription.qrCode}
                                                size={150}
                                                backgroundColor="#FFFFFF"
                                                color="#000000"
                                            />
                                        ) : (
                                            <Text style={styles.noQRText}>No QR code available</Text>
                                        )}
                                    </View>

                                    {/* Close Button inside the card */}
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={closeDetailsModal}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

            {/* MedBot Floating Button */}
            <MedBot onDiagnosePress={handleDiagnosePress} />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    firstRow: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
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
        gap: 12,
    },
    searchCard: {
        backgroundColor: '#CAD6FF',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#2260FF',
        marginRight: 8,
    },
    searchPlaceholder: {
        fontSize: 16,
        color: '#2261ff74',
        fontWeight: '500',
    },
    filterCard: {
        backgroundColor: '#CAD6FF',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 12,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 0,
    },
    filterPlaceholder: {
        fontSize: 16,
        color: '#2261ff74',
        fontWeight: '500',
    },
    dropdownIcon: {
        width: 20,
        height: 20,
        tintColor: '#2260FF',
    },
    secondRow: {
        backgroundColor: '#CAD6FF',
        padding: 20,
        flex: 1,
        paddingBottom: 50,
    },
    cardsContainer: {
        marginBottom: -5,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    noPrescriptionsContainer: {
        alignItems: 'center',
        padding: 40,
    },
    noPrescriptionsText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
    },
    noPrescriptionsSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 12,
        marginTop: 8,
        paddingLeft: 5,
    },
    prescriptionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 150,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'left',
        marginBottom: 8,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginBottom: 12,
        width: '100%',
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        flex: 1,
    },
    issueDate: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    qrButton: {
        padding: 8,
        marginLeft: 10,
    },
    qrCodeIcon: {
        width: 32,
        height: 32,
        tintColor: '#000000',
    },
    viewMoreButton: {
        backgroundColor: '#2260FF',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        width: '100%',
    },
    viewMoreText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
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
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    qrModalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        width: '80%',
    },
    qrModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2260FF',
        marginBottom: 20,
        textAlign: 'center',
    },
    qrCodeContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    qrDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    // Details Modal Styles
    detailsModalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25,
        width: '90%',
        maxHeight: '80%',
    },
    detailsModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2260FF',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailsContent: {
        marginBottom: 0,
    },
    detailRowModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabelModal: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
        flex: 1,
    },
    detailValueModal: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '400',
        flex: 2,
        textAlign: 'right',
    },
    qrSection: {
        alignItems: 'center',
    },
    qrCodeContainerModal: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginTop: 10,
        marginBottom: 20,
    },
    noQRText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },
    closeButton: {
        backgroundColor: '#2260FF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PrescriptionsScreen;