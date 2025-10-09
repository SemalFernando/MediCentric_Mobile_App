import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCodeScannerScreen = ({ 
    onBack, 
    onNavigateToHome, 
    onNavigateToPrescriptions, 
    onNavigateToReports 
}) => {
    const [activePage, setActivePage] = useState('qr');
    const [scanned, setScanned] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "This app needs access to your camera to scan QR codes.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                
                console.log('Camera permission result:', granted);
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission granted');
                    setHasCameraPermission(true);
                } else {
                    console.log('Camera permission denied');
                    setHasCameraPermission(false);
                }
            } catch (err) {
                console.warn('Error requesting camera permission:', err);
                setHasCameraPermission(false);
            }
        } else {
            // For iOS, assume permission is granted
            setHasCameraPermission(true);
        }
    };

    const onSuccess = (e) => {
        setScanned(true);
        Alert.alert(
            "QR Code Scanned!",
            `Data: ${e.data}`,
            [
                {
                    text: "OK",
                    onPress: () => {
                        setScanned(false);
                        if (scannerRef.current) {
                            scannerRef.current.reactivate();
                        }
                    }
                }
            ]
        );
    };

    const handleCameraReady = () => {
        console.log('Camera is ready');
        setCameraReady(true);
    };

    const handleHomePress = () => {
        setActivePage('home');
        if (onNavigateToHome) {
            onNavigateToHome();
        } else if (onBack) {
            onBack();
        }
    };

    const handlePrescriptionsPress = () => {
        setActivePage('prescriptions');
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

    // Show loading state
    if (hasCameraPermission === null) {
        return (
            <View style={styles.container}>
                <View style={styles.firstRow}>
                    <View style={styles.scanningSection}>
                        <View style={styles.qrIconCircle}>
                            <Image
                                source={require('../assets/qr-code-scan.png')}
                                style={styles.qrIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.scanningText}>Requesting camera permission...</Text>
                    </View>
                </View>
                <View style={styles.secondRow}>
                    <View style={styles.notAuthorizedView}>
                        <Text style={styles.notAuthorizedText}>Waiting for permission...</Text>
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
                                source={require('../assets/home-icon2.png')}
                                style={[styles.navIconImage, styles.inactiveIcon]}
                            />
                        </TouchableOpacity>

                        {/* QR Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('qr')}
                        >
                            <Image
                                source={require('../assets/qr-icon1.png')}
                                style={[styles.navIconImage, styles.activeIcon]}
                            />
                        </TouchableOpacity>

                        {/* Prescription Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handlePrescriptionsPress}
                        >
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={[styles.navIconImage, styles.inactiveIcon]}
                            />
                        </TouchableOpacity>

                        {/* Documents Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handleReportsPress}
                        >
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={[styles.navIconImage, styles.inactiveIcon]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // Show permission denied state
    if (hasCameraPermission === false) {
        return (
            <View style={styles.container}>
                <View style={styles.firstRow}>
                    <View style={styles.scanningSection}>
                        <View style={styles.qrIconCircle}>
                            <Image
                                source={require('../assets/qr-code-scan.png')}
                                style={styles.qrIcon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.scanningText}>Camera Access Required</Text>
                        <Text style={styles.permissionHelpText}>
                            Please grant camera permission to use QR scanner
                        </Text>
                        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
                            <Text style={styles.permissionButtonText}>Request Permission Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.secondRow}>
                    <View style={styles.notAuthorizedView}>
                        <Text style={styles.notAuthorizedText}>Camera permission not granted</Text>
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
                                source={require('../assets/home-icon2.png')}
                                style={[styles.navIconImage, styles.inactiveIcon]}
                            />
                        </TouchableOpacity>

                        {/* QR Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('qr')}
                        >
                            <Image
                                source={require('../assets/qr-icon1.png')}
                                style={[styles.navIconImage, styles.activeIcon]}
                            />
                        </TouchableOpacity>

                        {/* Prescription Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handlePrescriptionsPress}
                        >
                            <Image
                                source={require('../assets/prescription-icon2.png')}
                                style={[styles.navIconImage, styles.inactiveIcon]}
                            />
                        </TouchableOpacity>

                        {/* Documents Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handleReportsPress}
                        >
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={[styles.navIconImage, styles.inactiveIcon]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* First Row - White Background */}
            <View style={styles.firstRow}>
                <View style={styles.scanningSection}>
                    <View style={styles.qrIconCircle}>
                        <Image
                            source={require('../assets/qr-code-scan.png')}
                            style={styles.qrIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.scanningText}>QR code scanning...</Text>
                </View>
            </View>

            {/* Second Row - QR Scanner */}
            <View style={styles.secondRow}>
                <QRCodeScanner
                    ref={scannerRef}
                    onRead={onSuccess}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    topContent={
                        <View style={styles.topContent}>
                            <Text style={styles.centerText}>
                                Scan any QR code
                            </Text>
                            {!cameraReady && (
                                <Text style={styles.debugText}>Initializing camera...</Text>
                            )}
                        </View>
                    }
                    bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable}>
                            <Text style={styles.buttonText}>Point camera at QR code</Text>
                        </TouchableOpacity>
                    }
                    cameraStyle={styles.camera}
                    showMarker={true}
                    markerStyle={styles.marker}
                    cameraProps={{
                        onCameraReady: handleCameraReady,
                    }}
                />
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
                            source={require('../assets/home-icon2.png')}
                            style={[styles.navIconImage, styles.inactiveIcon]}
                        />
                    </TouchableOpacity>

                    {/* QR Icon */}
                    <TouchableOpacity
                        style={styles.navIcon}
                        onPress={() => setActivePage('qr')}
                    >
                        <Image
                            source={require('../assets/qr-icon1.png')}
                            style={[styles.navIconImage, styles.activeIcon]}
                        />
                    </TouchableOpacity>

                    {/* Prescription Icon */}
                    <TouchableOpacity
                        style={styles.navIcon}
                        onPress={handlePrescriptionsPress}
                    >
                        <Image
                            source={require('../assets/prescription-icon2.png')}
                            style={[styles.navIconImage, styles.inactiveIcon]}
                        />
                    </TouchableOpacity>

                    {/* Documents Icon */}
                    <TouchableOpacity
                        style={styles.navIcon}
                        onPress={handleReportsPress}
                    >
                        <Image
                            source={require('../assets/docs-icon2.png')}
                            style={[styles.navIconImage, styles.inactiveIcon]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    scanningSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    qrIcon: {
        width: 40,
        height: 40,
        tintColor: '#2260FF',
    },
    scanningText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 5,
    },
    permissionHelpText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    secondRow: {
        flex: 1,
        backgroundColor: '#000000',
    },
    camera: {
        height: '100%',
    },
    marker: {
        borderColor: '#2260FF',
        borderRadius: 20,
    },
    topContent: {
        alignItems: 'center',
    },
    centerText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    debugText: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonTouchable: {
        padding: 16,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    notAuthorizedView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    notAuthorizedText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
    permissionButton: {
        backgroundColor: '#2260FF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
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

export default QRCodeScannerScreen;