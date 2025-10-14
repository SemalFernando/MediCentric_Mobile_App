import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ConsentScreen = ({ onCancel, onAgree }) => {
  const [isChecked, setIsChecked] = useState(false);

  // Function to render text with bold PDPA part
  const renderFirstParagraph = () => {
    const fullText = "We value your privacy and are committed to protecting your personal information in line with Sri Lanka's Personal Data Protection Act (PDPA), No. 9 of 2022. By continuing, you agree to the collection and use of your medical data as described below.";
    
    const parts = fullText.split("Sri Lanka's Personal Data Protection Act (PDPA), No. 9 of 2022");
    
    return (
      <Text style={styles.paragraph}>
        {parts[0]}
        <Text style={styles.boldText}>Sri Lanka's Personal Data Protection Act (PDPA), No. 9 of 2022</Text>
        {parts[1]}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Data Collection Consent</Text>
        </View>

        {/* Divider Line - Moved up */}
        <View style={styles.divider} />

        {/* Privacy Paragraphs */}
        <View style={styles.paragraphsContainer}>
          {renderFirstParagraph()}
          
          <Text style={styles.paragraph}>
            We may collect your personal details such as name, NIC, and contact information, along with your health history, prescriptions, current medications, laboratory reports, and billing records.
          </Text>
          
          <Text style={styles.paragraph}>
            Your information is collected to ensure proper treatment and follow-up care, to process billing and insurance claims, and to share medical results with you. It also allows doctors, nurses, and laboratory staff to coordinate effectively and provide the highest standard of care.
          </Text>
        </View>

        {/* Terms & Conditions Section - Moved up */}
        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <Text style={styles.acknowledgmentText}>
          By giving consent, you acknowledge that:
        </Text>

        {/* Bullet Points - Aligned more to the right */}
        <View style={styles.bulletPointsContainer}>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              You have the right to request access to your records at any time.
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              You may ask us to correct any inaccuracies in your data.
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              You may withdraw your consent for data processing at any time. However, certain medical and legal requirements may still require us to retain some information.
            </Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              We will not share your information with unauthorized third parties without your explicit permission, except where required by law.
            </Text>
          </View>
        </View>

        {/* Consent Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={[styles.checkbox, isChecked && styles.checkboxChecked]}
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            I have read and understood the above and consent to the collection and processing of my personal and medical data.
          </Text>
        </View>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Buttons - Improved design */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.agreeButton, !isChecked && styles.agreeButtonDisabled]}
            onPress={onAgree}
            disabled={!isChecked}
          >
            <Text style={styles.agreeButtonText}>Agree</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 5, // Reduced margin to bring divider up
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2260FF',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15, // Reduced vertical margin
    marginBottom: 20,
  },
  paragraphsContainer: {
    marginBottom: 5, // Reduced margin to bring next section up
  },
  paragraph: {
    fontSize: 14,
    color: '#070707',
    textAlign: 'left',
    marginBottom: 15,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
    color: '#2260FF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2260FF',
    marginBottom: 10,
    textAlign: 'left',
    marginTop: 10, // Added to bring section up
  },
  acknowledgmentText: {
    fontSize: 14,
    color: '#070707',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  bulletPointsContainer: {
    marginBottom: 25,
    marginLeft: 5, // Added to shift bullet points to the right
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#2260FF',
    marginRight: 10, // Increased margin to shift text right
    marginTop: 2,
  },
  bulletText: {
    fontSize: 14,
    color: '#070707',
    flex: 1,
    lineHeight: 20,
    marginLeft: 2, // Added to shift text right
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#2260FF',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2260FF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#070707',
    flex: 1,
    lineHeight: 20,
    fontWeight: '500', // Increased font weight
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15, // Added gap between buttons
  },
  cancelButton: {
    flex: 1, // Equal width
    paddingVertical: 15,
    backgroundColor: '#CAD6FF', // Background color as requested
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#2260FF', // Text color as requested
    fontSize: 18,
    fontWeight: '600',
  },
  agreeButton: {
    flex: 1, // Equal width
    paddingVertical: 15,
    backgroundColor: '#2260FF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agreeButtonDisabled: {
    backgroundColor: '#809CFF',
    opacity: 0.6,
  },
  agreeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ConsentScreen;