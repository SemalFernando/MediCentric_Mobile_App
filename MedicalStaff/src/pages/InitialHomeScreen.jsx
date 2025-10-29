import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const InitialHomeScreen = ({ 
    onBack, 
    onNavigateToQRScanner, 
    onNavigateToPrescriptions, 
    onNavigateToReports, 
    onNavigateToProfile,
    route,
    doctorData: propDoctorData 
}) => {
    const [activePage, setActivePage] = useState('home');
    const [doctorData, setDoctorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get doctor data from props or route params
    const doctorDataFromRoute = route?.params?.doctorData;
    const BASE_URL = 'http://192.168.8.102:8085';

    // Use doctor data from props first, then from route
    const actualDoctorData = propDoctorData || doctorDataFromRoute;

    useEffect(() => {
        console.log('InitialHomeScreen - Received doctor data:', actualDoctorData);

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
    }, [actualDoctorData]);

    const handleQRPress = () => {
        setActivePage('qr');
        if (onNavigateToQRScanner) {
            onNavigateToQRScanner();
        }
    };

    const handlePrescriptionsPress = () => {
        setActivePage('prescription');
        if (onNavigateToPrescriptions) {
            onNavigateToPrescriptions();
        }
    };

    const handleReportsPress = () => {
        setActivePage('documents');
        if (onNavigateToReports) {
            onNavigateToReports();
        }
    };

    const handleHomePress = () => {
        setActivePage('home');
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
                        {/* Single Card for QR Scanning */}
                        <View style={styles.qrCard}>
                            <Text style={styles.qrTitle}>Scan Patient QR</Text>
                            <View style={styles.cardDivider} />
                            <Image
                                source={require('../assets/qr-code-placeholder.png')}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />
                            <TouchableOpacity style={styles.scanButton} onPress={handleQRPress}>
                                <Text style={styles.scanButtonText}>Scan</Text>
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
        borderRadius: 30,
        marginRight: 15,
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
        marginBottom: 15,
    },
    secondRow: {
        backgroundColor: '#CAD6FF',
        padding: 20,
        flex: 1,
    },
    cardsContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    qrCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        minHeight: 540,
        justifyContent: 'space-between',
    },
    qrTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 10,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#DDD',
        width: '100%',
        marginBottom: 15,
    },
    qrImage: {
        width: 250,
        height: 250,
        marginVertical: 50,
    },
    scanButton: {
        backgroundColor: '#2260FF',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 60,
        marginTop: 10,
        width: '80%',
    },
    scanButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
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

export default InitialHomeScreen;