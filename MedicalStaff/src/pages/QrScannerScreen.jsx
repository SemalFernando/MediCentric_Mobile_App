// src/pages/QrScannerScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Camera } from 'react-native-camera-kit';

const QrScannerScreen = ({ 
  onBack, 
  onNavigateToHome, 
  onNavigateToPrescriptions, 
  onNavigateToReports,
  onPatientScanned
}) => {
  const [frameHeight, setFrameHeight] = useState(0);
  const [activePage, setActivePage] = useState('qr');
  const [isLoading, setIsLoading] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null); // Track last scanned code
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple simultaneous scans
  const laserAnim = useRef(new Animated.Value(0)).current;
  const PATIENT_BASE_URL = 'http://192.168.8.102:8080'; // Patient service port 8080
  const DOCTOR_BASE_URL = 'http://192.168.8.102:8085'; // Doctor service port 8085

  useEffect(() => {
    if (frameHeight <= 0) return;

    const laserThickness = 2;
    const max = Math.max(0, frameHeight - laserThickness - 4);
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: max,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();

    return () => anim.stop();
  }, [frameHeight, laserAnim]);

  // Function to fetch patient data by QR code using POST
  const fetchPatientByQRCode = async (qrCodeData) => {
    try {
      setIsLoading(true);
      console.log('Fetching patient data for QR code:', qrCodeData);
      
      // Use POST method with request body to PATIENT service (port 8080)
      const response = await fetch(`${PATIENT_BASE_URL}/patients/qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData: qrCodeData })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const patientData = await response.json();
      console.log('Patient data fetched:', patientData);
      
      return patientData;
    } catch (error) {
      console.error('Error fetching patient data via QR endpoint:', error);
      
      // Try the minimal endpoint as fallback
      try {
        console.log('Trying minimal endpoint...');
        const minimalResponse = await fetch(`${PATIENT_BASE_URL}/patients/qr-minimal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrCodeData: qrCodeData })
        });
        
        if (minimalResponse.ok) {
          const minimalData = await minimalResponse.json();
          console.log('Minimal patient data fetched:', minimalData);
          return minimalData;
        }
      } catch (minimalError) {
        console.error('Error fetching minimal patient data:', minimalError);
      }
      
      Alert.alert('Error', `Failed to fetch patient data: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Alternative: If you want to extract patientId and use the regular GET endpoint
  const fetchPatientById = async (patientId) => {
    try {
      console.log('Fetching patient by ID:', patientId);
      const response = await fetch(`${PATIENT_BASE_URL}/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const patientData = await response.json();
      console.log('Patient data fetched by ID:', patientData);
      return patientData;
    } catch (error) {
      console.error('Error fetching patient by ID:', error);
      return null;
    }
  };

  const handleReadCode = async (event) => {
    const qrDataString = event?.nativeEvent?.codeStringValue;
    
    if (!qrDataString) {
      return;
    }

    // Prevent multiple scans of the same code
    if (lastScannedCode === qrDataString || isProcessing) {
      console.log('Skipping duplicate scan or already processing...');
      return;
    }

    console.log('QR Code scanned, Raw data:', qrDataString);
    
    // Set flags to prevent duplicate processing
    setLastScannedCode(qrDataString);
    setIsProcessing(true);
    
    try {
      // Parse the JSON data from QR code
      const qrData = JSON.parse(qrDataString);
      console.log('Parsed QR data:', qrData);
      
      // Extract the patientId from the QR code data
      const patientId = qrData.patientId;
      
      if (!patientId) {
        Alert.alert('Error', 'No patient ID found in QR code data');
        return;
      }

      console.log('Extracted Patient ID:', patientId);
      
      // Show loading
      setIsLoading(true);
      
      // Option 1: Use the QR code POST endpoint (recommended)
      console.log('Using QR code POST endpoint with full QR data...');
      const patientData = await fetchPatientByQRCode(qrDataString);
      
      // Option 2: If QR endpoint fails, try using patient ID directly with GET
      if (!patientData) {
        console.log('QR endpoint failed, trying patient ID GET endpoint...');
        const patientDataById = await fetchPatientById(patientId);
        
        if (patientDataById) {
          // Pass patient data to parent component
          if (onPatientScanned) {
            onPatientScanned(patientDataById);
          }
          
          Alert.alert(
            'Success', 
            `Patient data loaded: ${patientDataById.fullName || 'Unknown Patient'}`,
            [{ text: 'OK', onPress: () => {
              // Reset scan flags after user acknowledges
              setTimeout(() => {
                setLastScannedCode(null);
                setIsProcessing(false);
              }, 1000);
            }}]
          );
          return;
        }
      } else {
        // QR endpoint succeeded
        if (onPatientScanned) {
          onPatientScanned(patientData);
        }
        
        Alert.alert(
          'Success', 
          `Patient data loaded: ${patientData.fullName || 'Unknown Patient'}`,
          [{ text: 'OK', onPress: () => {
            // Reset scan flags after user acknowledges
            setTimeout(() => {
              setLastScannedCode(null);
              setIsProcessing(false);
            }, 1000);
          }}]
        );
        return;
      }
      
      // If both methods failed
      Alert.alert('Error', 'Failed to load patient data from both endpoints', [{
        text: 'OK',
        onPress: () => {
          // Reset scan flags after user acknowledges error
          setTimeout(() => {
            setLastScannedCode(null);
            setIsProcessing(false);
          }, 1000);
        }
      }]);
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      
      // If JSON parsing fails, try to use the raw string directly with QR POST endpoint
      console.log('JSON parsing failed, trying raw string with QR POST endpoint...');
      setIsLoading(true);
      const patientData = await fetchPatientByQRCode(qrDataString);
      
      if (patientData) {
        if (onPatientScanned) {
          onPatientScanned(patientData);
        }
        
        Alert.alert(
          'Success', 
          `Patient data loaded: ${patientData.fullName || 'Unknown Patient'}`,
          [{ text: 'OK', onPress: () => {
            // Reset scan flags after user acknowledges
            setTimeout(() => {
              setLastScannedCode(null);
              setIsProcessing(false);
            }, 1000);
          }}]
        );
      } else {
        Alert.alert('Error', 'Failed to process QR code data', [{
          text: 'OK',
          onPress: () => {
            // Reset scan flags after user acknowledges error
            setTimeout(() => {
              setLastScannedCode(null);
              setIsProcessing(false);
            }, 1000);
          }
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomePress = () => {
    setActivePage('home');
    if (onNavigateToHome) {
      onNavigateToHome();
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

  // Reset scan flags when leaving the screen
  const handleBackPress = () => {
    setLastScannedCode(null);
    setIsProcessing(false);
    if (onBack) {
      onBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* First Row - QR Icon and Text */}
        <View style={styles.firstRow}>
          <View style={styles.qrIconCircle}>
            <Image
              source={require('../assets/qr-code-scan.png')}
              style={styles.qrIcon}
            />
          </View>
          <Text style={styles.scanningText}>
            {isLoading ? 'Loading patient data...' : 'QR code scanning...'}
          </Text>
          {isLoading && <ActivityIndicator size="small" color="#2260FF" style={styles.loadingIndicator} />}
        </View>

        {/* Second Row - Camera Scanner */}
        <View style={styles.secondRow}>
          <View style={styles.cameraWrapper}>
            <Camera
              style={styles.camera}
              scanBarcode={true}
              onReadCode={handleReadCode}
              showFrame={false}
              laserColor="red"
              frameColor="white"
            />

            {/* Custom overlay */}
            <View pointerEvents="none" style={styles.overlay}>
              <View style={styles.dimBackground} />
              <View style={styles.frameContainer}>
                <View
                  style={styles.frame}
                  onLayout={(e) => setFrameHeight(e.nativeEvent.layout.height)}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />

                  {frameHeight > 0 && (
                    <Animated.View
                      style={[
                        styles.laser,
                        {
                          transform: [{ translateY: laserAnim }],
                        },
                      ]}
                    />
                  )}
                </View>
              </View>
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
              onPress={() => setActivePage('qr')}
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  firstRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: 'center',
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
    width: 42,
    height: 42,
    tintColor: '#000000',
  },
  scanningText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingIndicator: {
    marginTop: 5,
  },
  secondRow: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  frameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  frame: {
    width: '75%',
    aspectRatio: 1,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
  },
  topLeft: {
    top: 6,
    left: 6,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#00FF00',
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 6,
    right: 6,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#00FF00',
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 6,
    left: 6,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#00FF00',
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 6,
    right: 6,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#00FF00',
    borderBottomRightRadius: 8,
  },
  laser: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#ED4D38',
    borderRadius: 2,
    top: 0,
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

export default QrScannerScreen;