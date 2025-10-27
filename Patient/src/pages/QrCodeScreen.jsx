import React from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrCodeScreen = ({ 
  onBack, 
  patientData, 
  route, 
  onNavigateToHome, 
  onNavigateToReports, 
  onNavigateToPrescriptions
}) => {
  // Use patient data from props or route params
  const actualPatientData = patientData || route.params?.patientData;
  
  console.log('QR Screen - Patient Data:', actualPatientData);

  // If no patient data, show error
  if (!actualPatientData || !actualPatientData.patientId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No patient data found</Text>
          <Text style={styles.errorSubtext}>Please login again</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onBack}>
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Handle QR code value - parse the JSON string from backend
  let qrValue;
  if (actualPatientData.qrCode) {
    try {
      // If it's a JSON string, parse it and use as QR content
      const qrData = JSON.parse(actualPatientData.qrCode);
      qrValue = JSON.stringify(qrData);
    } catch (error) {
      // If not JSON, use as is
      qrValue = actualPatientData.qrCode;
    }
  } else {
    // Fallback: create QR code data
    qrValue = JSON.stringify({
      patientId: actualPatientData.patientId,
      accessKey: actualPatientData.accessKey || 'DEFAULT_KEY',
      type: 'medical_id',
      timestamp: new Date().getTime().toString()
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Ash Circle with QR Icon */}
        <View style={styles.circleContainer}>
          <View style={styles.ashCircle}>
            <Image 
              source={require('../assets/qr-code-scan.png')}
              style={styles.qrIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Instruction Text */}
        <View style={styles.textContainer}>
          <Text style={styles.instructionTitle}>This is your QR code.</Text>
          <Text style={styles.instructionSubtitle}>
            Ask your doctor to scan this for your medical information
          </Text>
        </View>

        {/* QR Code Container - Big and Clean */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode 
              value={qrValue}
              size={280}
              backgroundColor="#FFFFFF"
              color="#000000"
            />
          </View>
        </View>
      </ScrollView>

      {/* Third Row Navigation - FIXED VERSION */}
      <View style={styles.thirdRow}>
        <View style={styles.navigationCard}>
          {/* Home Icon */}
          <TouchableOpacity
            style={styles.navIcon}
            onPress={onNavigateToHome}
          >
            <Image
              source={require('../assets/home-icon2.png')}
              style={styles.navIconImage}
            />
          </TouchableOpacity>

          {/* QR Icon - Active (no onPress since we're already here) */}
          <TouchableOpacity style={styles.navIcon}>
            <Image
              source={require('../assets/qr-icon1.png')}
              style={[styles.navIconImage, styles.activeIcon]}
            />
          </TouchableOpacity>

          {/* Prescription Icon */}
          <TouchableOpacity
            style={styles.navIcon}
            onPress={onNavigateToPrescriptions}
          >
            <Image
              source={require('../assets/prescription-icon2.png')}
              style={styles.navIconImage}
            />
          </TouchableOpacity>

          {/* Documents Icon */}
          <TouchableOpacity
            style={styles.navIcon}
            onPress={onNavigateToReports}
          >
            <Image
              source={require('../assets/docs-icon2.png')}
              style={styles.navIconImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    paddingBottom: 100,
  },
  circleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  ashCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrIcon: {
    width: 40,
    height: 40,
    tintColor: '#000000',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 5,
    textAlign: 'center',
  },
  instructionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  thirdRow: {
    backgroundColor: '#FFFFFF',
    padding: 10,
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
    tintColor: '#FFFFFF',
  },
  activeIcon: {
    tintColor: 'black',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#2260FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QrCodeScreen;