import React from 'react';
import { 
  SafeAreaView, 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrCodeScreen = ({ onBack }) => {
  // Sample patient data - you can replace this with actual data from props or context
  const patientData = {
    id: 'PAT123456',
    name: 'John Doe',
    emergencyContact: '+1-234-567-8900',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts']
  };

  // QR code value containing patient information
  const qrValue = JSON.stringify({
    patientId: patientData.id,
    name: patientData.name,
    emergencyContact: patientData.emergencyContact,
    bloodType: patientData.bloodType,
    timestamp: new Date().toISOString()
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Medical ID QR Code</Text>
          <Text style={styles.subtitle}>
            Scan this code for emergency medical information
          </Text>
        </View>

        {/* QR Code Container */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode 
              value={qrValue}
              size={250}
              backgroundColor="#FFFFFF"
              color="#000000"
              logo={require('../assets/profile-pic.png')} // Optional: add your app logo
              logoSize={50}
              logoBackgroundColor="transparent"
            />
          </View>
          
          <Text style={styles.qrDescription}>
            This QR contains essential medical information that can be scanned by healthcare providers in emergencies.
          </Text>
        </View>

        {/* Patient Information Summary */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Information Included:</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Patient ID:</Text>
            <Text style={styles.infoValue}>{patientData.id}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{patientData.name}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Blood Type:</Text>
            <Text style={styles.infoValue}>{patientData.bloodType}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Emergency Contact:</Text>
            <Text style={styles.infoValue}>{patientData.emergencyContact}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Use:</Text>
          <Text style={styles.instruction}>• Show this QR code to healthcare providers</Text>
          <Text style={styles.instruction}>• Keep it accessible in your wallet or phone</Text>
          <Text style={styles.instruction}>• Update your information regularly</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share QR Code</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Save to Photos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Back Button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      )}
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2260FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  qrDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#F8F9FF',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2260FF',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  instructionsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2260FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2260FF',
    fontWeight: '600',
  },
});

export default QrCodeScreen;