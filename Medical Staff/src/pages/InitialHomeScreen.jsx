import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const InitialHomeScreen = ({ onBack, onNavigateToQRScanner }) => {
    const [activePage, setActivePage] = useState('home'); // Track the active page

    const handleQRPress = () => {
        setActivePage('qr');
        // Navigate to QR scanning page using the prop
        if (onNavigateToQRScanner) {
            onNavigateToQRScanner();
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
                        {/* Single Card for QR Scanning */}
                        <View style={styles.qrCard}>
                            <Text style={styles.qrTitle}>Scan Patient QR</Text>
                            <View style={styles.cardDivider} />
                            <Image
                                source={require('../assets/qr-code-placeholder.png')} // Replace with your QR code image
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
                            onPress={() => setActivePage('documents')}
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
        borderWidth: 1, // Add border
        borderColor: 'black', // Black border color
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
        minHeight: 540, // Increased height from 400 to 450
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
        width: 250, // Increased from 200 to 250
        height: 250, // Increased from 200 to 250
        marginVertical: 50,
    },
    scanButton: {
        backgroundColor: '#2260FF',
        borderRadius: 15, // Decreased from 25 to 15
        paddingVertical: 10,
        paddingHorizontal: 60, // Increased width by increasing horizontal padding
        marginTop: 10,
        width: '80%', // Added width percentage for consistent sizing
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