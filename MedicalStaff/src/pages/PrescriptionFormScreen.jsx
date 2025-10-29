import React, { useState, useCallback, memo } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Modal, Platform } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

// Memoized Custom Date Picker Component (keep the same as before)
const CustomDatePicker = memo(({ visible, selectedDate, onDateSelect, onCancel }) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);

  // Update local date when prop changes
  React.useEffect(() => {
    setLocalSelectedDate(selectedDate);
  }, [selectedDate]);

  // Helper function to get days in month - MOVED BEFORE ITS USAGE
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentYear = localSelectedDate.getFullYear();
  const currentMonth = localSelectedDate.getMonth();
  const currentDay = localSelectedDate.getDate();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const days = Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => i + 1);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(localSelectedDate);
    newDate.setMonth(monthIndex);
    
    // Adjust day if it exceeds days in new month
    const daysInNewMonth = getDaysInMonth(newDate.getFullYear(), monthIndex);
    if (newDate.getDate() > daysInNewMonth) {
      newDate.setDate(daysInNewMonth);
    }
    
    setLocalSelectedDate(newDate);
  };

  const handleDaySelect = (day) => {
    const newDate = new Date(localSelectedDate);
    newDate.setDate(day);
    setLocalSelectedDate(newDate);
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(localSelectedDate);
    newDate.setFullYear(year);
    
    // Adjust day if it exceeds days in February for leap years
    const daysInNewMonth = getDaysInMonth(year, newDate.getMonth());
    if (newDate.getDate() > daysInNewMonth) {
      newDate.setDate(daysInNewMonth);
    }
    
    setLocalSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onDateSelect(localSelectedDate);
  };

  const handleCancel = () => {
    // Reset to original selected date when canceling
    setLocalSelectedDate(selectedDate);
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerTitle}>Select Review Date</Text>
          
          <View style={styles.pickerRow}>
            {/* Month Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView 
                style={styles.pickerScroll} 
                showsVerticalScrollIndicator={false}
              >
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      currentMonth === index && styles.selectedPickerItem
                    ]}
                    onPress={() => handleMonthSelect(index)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      currentMonth === index && styles.selectedPickerItemText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Day Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Day</Text>
              <ScrollView 
                style={styles.pickerScroll} 
                showsVerticalScrollIndicator={false}
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.pickerItem,
                      currentDay === day && styles.selectedPickerItem
                    ]}
                    onPress={() => handleDaySelect(day)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      currentDay === day && styles.selectedPickerItemText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollView 
                style={styles.pickerScroll} 
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.pickerItem,
                      currentYear === year && styles.selectedPickerItem
                    ]}
                    onPress={() => handleYearSelect(year)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      currentYear === year && styles.selectedPickerItemText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <Text style={styles.selectedDateText}>
            Selected: {formatDate(localSelectedDate)}
          </Text>

          <View style={styles.datePickerButtons}>
            <TouchableOpacity
              style={[styles.datePickerButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Select Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const PrescriptionFormScreen = ({ 
    onBack, 
    onNavigateToHome, 
    onNavigateToQRScanner, 
    onNavigateToReports,
    patientData,
    doctorData 
}) => {
    const [issueDate] = useState(new Date());
    const [reviewDate, setReviewDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [medicationList, setMedicationList] = useState('');
    const [loading, setLoading] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(new Date());

    // UPDATED: Get patientId from scanned patient data
    const baseUrl = 'http://192.168.8.102:8090'; // Changed back to port 8080 for prescriptions
    const patientId = patientData?.patientId; // Get from scanned patient

    // Format date for display
    const formatDate = useCallback((date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
    }, []);

    // Parse date from MM/DD/YYYY format
    const parseDate = useCallback((dateString) => {
        if (!dateString || dateString.length !== 10) return null;
        const parts = dateString.split('/');
        if (parts.length !== 3) return null;
        
        const [month, day, year] = parts;
        // Validate month and day ranges
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10);
        
        if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900) {
            return null;
        }
        
        const parsedDate = new Date(yearNum, monthNum - 1, dayNum);
        // Check if date is valid
        if (isNaN(parsedDate.getTime()) || 
            parsedDate.getMonth() !== monthNum - 1 || 
            parsedDate.getDate() !== dayNum) {
            return null;
        }
        
        return parsedDate;
    }, []);

    // Convert date to timestamp for backend
    const dateToTimestamp = useCallback((date) => {
        return date.getTime();
    }, []);

    // Handle manual date input
    const handleDateInput = useCallback((text) => {
        const cleaned = text.replace(/[^0-9/]/g, '');
        
        let formatted = cleaned;
        if (cleaned.length >= 2 && cleaned.length <= 3 && !cleaned.includes('/')) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        } else if (cleaned.length >= 5 && cleaned.length <= 6) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4);
        }
        
        setTempDate(formatted);
        
        if (formatted.length === 10) {
            try {
                const parsedDate = parseDate(formatted);
                if (parsedDate && !isNaN(parsedDate.getTime())) {
                    setReviewDate(parsedDate);
                } else {
                    setReviewDate(null);
                }
            } catch (error) {
                console.log('Invalid date');
                setReviewDate(null);
            }
        } else {
            setReviewDate(null);
        }
    }, [parseDate]);

    // Show custom date picker
    const showCustomDatePicker = useCallback(() => {
        setSelectedDateForPicker(reviewDate || new Date());
        setShowDatePicker(true);
    }, [reviewDate]);

    // Handle date selection from custom picker
    const handleDateSelect = useCallback((date) => {
        setReviewDate(date);
        setTempDate(formatDate(date));
        setShowDatePicker(false);
    }, [formatDate]);

    // Handle cancel date picker
    const handleCancelDatePicker = useCallback(() => {
        setShowDatePicker(false);
    }, []);

    // Handle icon press for date picker
    const handleIconPress = useCallback(() => {
        showCustomDatePicker();
    }, [showCustomDatePicker]);

    // Handle adding prescription
    const handleAddPrescription = async () => {
        if (!medicationList.trim()) {
            Alert.alert('Error', 'Please enter medication list');
            return;
        }

        // Check if we have patient data
        if (!patientId) {
            Alert.alert('Error', 'No patient selected. Please scan a patient QR code first.');
            return;
        }

        let finalReviewDate = reviewDate;
        
        // If no review date but we have temp date, try to parse it
        if (!reviewDate && tempDate && tempDate.length === 10) {
            try {
                finalReviewDate = parseDate(tempDate);
                if (!finalReviewDate || isNaN(finalReviewDate.getTime())) {
                    Alert.alert('Error', 'Please enter a valid review date');
                    return;
                }
            } catch (error) {
                Alert.alert('Error', 'Please enter a valid review date');
                return;
            }
        }

        // If still no valid date
        if (!finalReviewDate || isNaN(finalReviewDate.getTime())) {
            Alert.alert('Error', 'Please select a valid review date');
            return;
        }

        // Clear time part for date comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const reviewDateCopy = new Date(finalReviewDate);
        reviewDateCopy.setHours(0, 0, 0, 0);

        if (reviewDateCopy < today) {
            Alert.alert('Error', 'Review date cannot be in the past');
            return;
        }

        try {
            setLoading(true);
            
            // UPDATED: Enhanced prescription data with medicationName
            const prescriptionData = {
                doctorId: doctorData?.doctorId || "dr_123", // Use actual doctor ID if available
                medicationName: medicationList.trim().split('\n')[0] || "Prescription", // Use first line as medication name
                nextReviewDate: dateToTimestamp(finalReviewDate), // Convert to timestamp
                category: "General", // Default category
                notes: medicationList.trim()
            };

            console.log('Sending prescription data:', prescriptionData);
            console.log('Patient ID:', patientId);
            console.log('URL:', `${baseUrl}/patients/${patientId}/prescriptions`);

            const response = await fetch(`${baseUrl}/patients/${patientId}/prescriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prescriptionData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log('Prescription added successfully:', result);
            
            // NEW: Show QR code information
            Alert.alert(
                'Success', 
                `Prescription added successfully!\n\nQR Code has been generated for this prescription.\n\nPrescription ID: ${result.prescriptionId}`,
                [
                    { 
                        text: 'OK', 
                        onPress: () => {
                            setMedicationList('');
                            setReviewDate(null);
                            setTempDate('');
                            if (onBack) onBack();
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Error adding prescription:', error);
            Alert.alert('Error', `Failed to add prescription: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper
            backgroundColor="#FFFFFF"
            statusBarStyle="dark-content"
            barStyle="dark-content"
            translucent={false}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>New Prescription</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Patient Info Display */}
                {patientData && (
                    <View style={styles.patientInfoCard}>
                        <Text style={styles.patientInfoTitle}>Patient Information</Text>
                        <Text style={styles.patientInfoText}>Name: {patientData.fullName}</Text>
                        <Text style={styles.patientInfoText}>ID: {patientData.patientId}</Text>
                        <Text style={styles.patientInfoText}>Blood Type: {patientData.bloodType || 'Not specified'}</Text>
                    </View>
                )}

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Issue Date Field - Read Only */}
                    <Text style={styles.inputLabel}>Issue Date</Text>
                    <View style={[styles.inputContainer, styles.disabledInput]}>
                        <Image
                            source={require('../assets/calendar-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={formatDate(issueDate)}
                            editable={false}
                            placeholderTextColor="#809CFF"
                        />
                    </View>

                    {/* Next Review Date Field */}
                    <Text style={styles.inputLabel}>Next Review Date</Text>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={handleIconPress} style={styles.iconButton}>
                            <Image
                                source={require('../assets/calendar-icon.png')}
                                style={styles.inputIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            value={tempDate}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#809CFF"
                            onChangeText={handleDateInput}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                        <TouchableOpacity onPress={handleIconPress} style={styles.iconButton}>
                            <Image
                                source={require('../assets/drop-down.png')}
                                style={styles.dropdownIcon}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Medication List Field */}
                    <Text style={styles.inputLabel}>Medication List</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter medications, dosage, and instructions..."
                            placeholderTextColor="#809CFF"
                            value={medicationList}
                            onChangeText={setMedicationList}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Add Prescription Button */}
                    <TouchableOpacity
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={handleAddPrescription}
                        disabled={loading}
                    >
                        <Text style={styles.addButtonText}>
                            {loading ? 'Adding...' : 'Add Prescription & Generate QR'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Custom Date Picker Modal */}
                <CustomDatePicker
                    visible={showDatePicker}
                    selectedDate={selectedDateForPicker}
                    onDateSelect={handleDateSelect}
                    onCancel={handleCancelDatePicker}
                />
            </ScrollView>
        </ScreenWrapper>
    );
};

// Updated styles - added patient info card styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 30,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
    },
    backText: {
        fontSize: 50,
        color: '#2260FF',
        fontWeight: 'normal',
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
    // NEW: Patient Info Card Styles
    patientInfoCard: {
        backgroundColor: '#F8F9FF',
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 15,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2260FF',
    },
    patientInfoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 8,
    },
    patientInfoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        flex: 1,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 8,
        alignSelf: 'flex-start',
        marginLeft: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ECF1FF',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#ECF1FF',
    },
    disabledInput: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
    },
    textAreaContainer: {
        height: 220,
        alignItems: 'flex-start',
    },
    inputIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: '#809CFF',
    },
    dropdownIcon: {
        width: 20,
        height: 20,
        tintColor: '#809CFF',
        marginLeft: 10,
    },
    iconButton: {
        padding: 5,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#809CFF',
    },
    textArea: {
        height: '100%',
        paddingTop: 15,
        paddingBottom: 15,
    },
    addButton: {
        backgroundColor: '#2260FF',
        borderRadius: 25,
        paddingVertical: 15,
        marginTop: 10,
        marginBottom: 25,
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    disabledButton: {
        backgroundColor: '#809CFF',
        opacity: 0.6,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    // Date Picker Styles (keep the same)
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    datePickerContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2260FF',
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 5,
        color: '#2260FF',
    },
    pickerScroll: {
        height: 150,
        borderWidth: 1,
        borderColor: '#ECF1FF',
        borderRadius: 8,
    },
    pickerItem: {
        paddingVertical: 8,
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    selectedPickerItem: {
        backgroundColor: '#2260FF',
        borderRadius: 5,
    },
    pickerItemText: {
        fontSize: 14,
        color: '#666',
    },
    selectedPickerItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
    selectedDateText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        color: '#2260FF',
    },
    datePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    datePickerButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    confirmButton: {
        backgroundColor: '#2260FF',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default PrescriptionFormScreen;