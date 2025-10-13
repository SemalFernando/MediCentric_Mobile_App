import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// We'll use a simple implementation first to test permissions
const QRCodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    console.log('Checking camera permission...');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        console.log('Camera permission status:', granted);
        setHasPermission(granted);
        
        // If not granted, request it automatically
        if (!granted) {
          requestCameraPermission();
        }
      } else {
        // For iOS, we'll assume granted for now
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      setHasPermission(false);
    }
  };

  const requestCameraPermission = async () => {
    console.log('Requesting camera permission...');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'This app needs camera access to scan QR codes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        console.log('Permission request result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to use QR scanner. Please enable it in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
        }
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
      setHasPermission(false);
    }
  };

  const simulateQRScan = () => {
    const demoData = 'https://example.com/qr-demo-' + Date.now();
    setScannedData(demoData);
    Alert.alert(
      'QR Code Scanned!',
      `Data: ${demoData}`,
      [{ text: 'OK', onPress: () => setScannedData(null) }]
    );
  };

  // Debug info
  console.log('Current permission state:', hasPermission);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Checking camera permissions...</Text>
          <TouchableOpacity style={styles.debugButton} onPress={checkCameraPermission}>
            <Text style={styles.debugButtonText}>Check Permission Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.permissionDeniedText}>📷 Camera Access Required</Text>
          <Text style={styles.permissionHelpText}>
            This app needs camera permission to scan QR codes.
          </Text>
          
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.permissionButton, styles.settingsButton]} 
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.permissionButtonText}>Open App Settings</Text>
          </TouchableOpacity>

          <Text style={styles.debugText}>
            Current permission status: Denied{'\n'}
            Press "Grant Camera Permission" to request access
          </Text>
        </View>
      </View>
    );
  }

  // Permission granted - show scanner interface
  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderTitle}>🎥 Camera Active</Text>
        <Text style={styles.placeholderSubtitle}>QR Scanner Ready</Text>
        
        {/* Scanner Frame */}
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <Text style={styles.scanInstruction}>
          Point camera at QR code to scan
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={simulateQRScan}
        >
          <Text style={styles.scanButtonText}>
            {scannedData ? 'Scan Another QR Code' : 'Simulate QR Scan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.scanButton, styles.debugButton]}
          onPress={checkCameraPermission}
        >
          <Text style={styles.scanButtonText}>Debug: Check Permission</Text>
        </TouchableOpacity>

        <Text style={styles.debugText}>
          Permission status: Granted ✅{'\n'}
          Camera is ready for QR scanning
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
  },
  scannerFrame: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderWidth: 2,
    borderColor: '#2260FF',
    backgroundColor: 'transparent',
    position: 'relative',
    marginBottom: 30,
  },
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: '#2260FF',
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanInstruction: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bottomSection: {
    padding: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#2260FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  debugButton: {
    backgroundColor: '#666666',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionDeniedText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionHelpText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#2260FF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 250,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#666666',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  debugText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default QRCodeScannerScreen;