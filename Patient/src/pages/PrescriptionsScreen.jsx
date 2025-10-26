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

    const handleViewMore = (prescriptionId) => {
        // Handle view more action for specific prescription
        console.log('View more for prescription:', prescriptionId);
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
                        {/* Prescription Card 1 - Viral Fever */}
                        <View style={styles.prescriptionCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.prescriptionTitle}>Viral Fever</Text>
                            </View>
                            
                            <View style={styles.cardDivider} />
                            
                            <View style={styles.prescriptionDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.lastPrescription}>• Last prescription: Sep 10th, 2025</Text>
                                    <Image
                                        source={require('../assets/qr-code-icon.png')}
                                        style={styles.qrCodeIcon}
                                    />
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.viewMoreButton}
                                onPress={() => handleViewMore(1)}
                            >
                                <Text style={styles.viewMoreText}>View More</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Prescription Card 2 - Cold and Cough */}
                        <View style={styles.prescriptionCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.prescriptionTitle}>Cold and Cough</Text>
                            </View>
                            
                            <View style={styles.cardDivider} />
                            
                            <View style={styles.prescriptionDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.lastPrescription}>• Last prescription: Aug 28th, 2025</Text>
                                    <Image
                                        source={require('../assets/qr-code-icon.png')}
                                        style={styles.qrCodeIcon}
                                    />
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.viewMoreButton}
                                onPress={() => handleViewMore(2)}
                            >
                                <Text style={styles.viewMoreText}>View More</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Prescription Card 3 - Diabetes */}
                        <View style={styles.prescriptionCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.prescriptionTitle}>Diabetes</Text>
                            </View>
                            
                            <View style={styles.cardDivider} />
                            
                            <View style={styles.prescriptionDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.lastPrescription}>• Last prescription: Aug 15th, 2025</Text>
                                    <Image
                                        source={require('../assets/qr-code-icon.png')}
                                        style={styles.qrCodeIcon}
                                    />
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                style={styles.viewMoreButton}
                                onPress={() => handleViewMore(3)}
                            >
                                <Text style={styles.viewMoreText}>View More</Text>
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
        marginBottom: 0,
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
        minWidth: 0, // Allow flex to work properly
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
        minWidth: 0, // Allow flex to work properly
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
    prescriptionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    cardHeader: {
        marginBottom: 10,
    },
    prescriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#DDD',
        width: '100%',
        marginBottom: 12,
    },
    prescriptionDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastPrescription: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
        flex: 1,
    },
    qrCodeIcon: {
        width: 50,
        height: 50,
        tintColor: '#000000ff',
        marginLeft: 10,
    },
    viewMoreButton: {
        backgroundColor: '#2260FF',
        borderRadius: 8,
        paddingVertical: 8,
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
});

export default PrescriptionsScreen;