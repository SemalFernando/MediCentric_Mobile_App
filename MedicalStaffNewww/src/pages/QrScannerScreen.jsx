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
} from 'react-native';
import { Camera } from 'react-native-camera-kit';

const QrScannerScreen = ({ 
  onBack, 
  onNavigateToHome, 
  onNavigateToPrescriptions, 
  onNavigateToReports 
}) => {
  const [frameHeight, setFrameHeight] = useState(0);
  const [activePage, setActivePage] = useState('qr');
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (frameHeight <= 0) return;

    // Animate laser from top to bottom within the frame boundaries
    const laserThickness = 2;
    const max = Math.max(0, frameHeight - laserThickness - 4); // Proper padding
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

  const handleReadCode = (event) => {
    const value = event?.nativeEvent?.codeStringValue ?? 'No data';
    Alert.alert('QR Code found', value);
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
          <Text style={styles.scanningText}>QR code scanning...</Text>
        </View>

        {/* Second Row - Camera Scanner */}
        <View style={styles.secondRow}>
          <View style={styles.cameraWrapper}>
            <Camera
              style={styles.camera}
              scanBarcode={true}
              onReadCode={handleReadCode}
              showFrame={false} // using custom frame
              laserColor="red"
              frameColor="white"
            />

            {/* Custom overlay */}
            <View pointerEvents="none" style={styles.overlay}>
              {/* Dimming outside area */}
              <View style={styles.dimBackground} />

              {/* Centered frame + corners - moved up slightly */}
              <View style={styles.frameContainer}>
                <View
                  style={styles.frame}
                  onLayout={(e) => setFrameHeight(e.nativeEvent.layout.height)}>
                  {/* Green corners with rounded edges */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />

                  {/* Animated red laser - properly contained inside frame */}
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
  // First Row Styles
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
  },
  // Second Row Styles
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
  // Container to position the frame slightly higher
  frameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Move the entire scanning area up
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
    overflow: 'hidden', // Ensure laser stays inside frame
  },
  // Green corners with rounded edges
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
  // Laser line - properly contained inside frame with exact boundaries
  laser: {
    position: 'absolute',
    left: 4, // Small padding from left edge
    right: 4, // Small padding from right edge
    height: 2,
    backgroundColor: '#ED4D38',
    borderRadius: 2,
    top: 0, // Start from the very top of the frame
  },
  // Third Row Styles
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