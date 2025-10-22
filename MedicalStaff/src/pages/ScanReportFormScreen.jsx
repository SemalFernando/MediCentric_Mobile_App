import React, { useState, useCallback, memo } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Modal, Platform } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

// Memoized Custom Date Picker Component (same as previous screens)
const CustomDatePicker = memo(({ visible, selectedDate, onDateSelect, onCancel }) => {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);

  React.useEffect(() => {
    setLocalSelectedDate(selectedDate);
  }, [selectedDate]);

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
          <Text style={styles.datePickerTitle}>Select Scan Date</Text>
          
          <View style={styles.pickerRow}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
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

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Day</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
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

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Year</Text>
              <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
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

const ScanReportFormScreen = ({ onBack }) => {
    const [scanDate, setScanDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [scanStatus, setScanStatus] = useState('');
    const [scanResult, setScanResult] = useState('');
    const [scanType, setScanType] = useState('');
    const [scanDescription, setScanDescription] = useState('');
    const [uploadedDoc, setUploadedDoc] = useState('');
    const [loading, setLoading] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(new Date());

    const baseUrl = 'http://10.87.143.247:8080';
    const patientId = 'P123';

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
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10);
        
        if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900) {
            return null;
        }
        
        const parsedDate = new Date(yearNum, monthNum - 1, dayNum);
        if (isNaN(parsedDate.getTime()) || 
            parsedDate.getMonth() !== monthNum - 1 || 
            parsedDate.getDate() !== dayNum) {
            return null;
        }
        
        return parsedDate;
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
                    setScanDate(parsedDate);
                } else {
                    setScanDate(null);
                }
            } catch (error) {
                console.log('Invalid date');
                setScanDate(null);
            }
        } else {
            setScanDate(null);
        }
    }, [parseDate]);

    // Show custom date picker
    const showCustomDatePicker = useCallback(() => {
        setSelectedDateForPicker(scanDate || new Date());
        setShowDatePicker(true);
    }, [scanDate]);

    // Handle date selection from custom picker
    const handleDateSelect = useCallback((date) => {
        setScanDate(date);
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

    // Handle document upload (simulated)
    const handleDocumentUpload = useCallback(() => {
        // In a real app, this would open document picker
        Alert.alert('Upload Scan Document', 'Scan document upload functionality would be implemented here');
        setUploadedDoc('scan_report.pdf'); // Simulate uploaded document
    }, []);

    // Handle adding scan report
    const handleAddScanReport = async () => {
        if (!scanStatus.trim()) {
            Alert.alert('Error', 'Please enter scan status');
            return;
        }
        if (!scanResult.trim()) {
            Alert.alert('Error', 'Please enter scan result');
            return;
        }
        if (!scanType.trim()) {
            Alert.alert('Error', 'Please enter scan type');
            return;
        }

        let finalScanDate = scanDate;
        
        if (!scanDate && tempDate && tempDate.length === 10) {
            try {
                finalScanDate = parseDate(tempDate);
                if (!finalScanDate || isNaN(finalScanDate.getTime())) {
                    Alert.alert('Error', 'Please enter a valid scan date');
                    return;
                }
            } catch (error) {
                Alert.alert('Error', 'Please enter a valid scan date');
                return;
            }
        }

        if (!finalScanDate || isNaN(finalScanDate.getTime())) {
            Alert.alert('Error', 'Please select a valid scan date');
            return;
        }

        try {
            setLoading(true);
            
            const scanReportData = {
                patientId: patientId,
                scanDate: finalScanDate.toISOString().split('T')[0],
                status: scanStatus.trim(),
                result: scanResult.trim(),
                type: scanType.trim(),
                description: scanDescription.trim(),
                document: uploadedDoc || null
            };

            console.log('Sending scan report data:', scanReportData);

            // Simulate API call
            // const response = await fetch(`${baseUrl}/patients/${patientId}/scan-reports`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(scanReportData),
            // });

            // Simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            Alert.alert('Success', 'Scan report added successfully!', [
                { text: 'OK', onPress: () => {
                    setScanStatus('');
                    setScanResult('');
                    setScanType('');
                    setScanDescription('');
                    setUploadedDoc('');
                    setScanDate(new Date());
                    setTempDate('');
                    if (onBack) onBack();
                }}
            ]);

        } catch (error) {
            console.error('Error adding scan report:', error);
            Alert.alert('Error', `Failed to add scan report: ${error.message}`);
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
                    <Text style={styles.title}>New Scan Report</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Scan Status Field */}
                    <Text style={styles.inputLabel}>Scan Status</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/status-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={scanStatus}
                            placeholder="Enter scan status (e.g., Completed, Pending)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setScanStatus}
                        />
                    </View>

                    {/* Scan Date Field */}
                    <Text style={styles.inputLabel}>Scan Date</Text>
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

                    {/* Scan Result Field */}
                    <Text style={styles.inputLabel}>Scan Result</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/result-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={scanResult}
                            placeholder="Enter scan result"
                            placeholderTextColor="#809CFF"
                            onChangeText={setScanResult}
                        />
                    </View>

                    {/* Scan Type Field */}
                    <Text style={styles.inputLabel}>Scan Type</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/scan-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={scanType}
                            placeholder="Enter scan type (e.g., MRI, CT Scan, X-Ray)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setScanType}
                        />
                    </View>

                    {/* Scan Description Field */}
                    <Text style={styles.inputLabel}>Scan Description</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter detailed scan description and findings..."
                            placeholderTextColor="#809CFF"
                            value={scanDescription}
                            onChangeText={setScanDescription}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Upload Scan Document Field */}
                    <Text style={styles.inputLabel}>Upload Scan Document</Text>
                    <TouchableOpacity style={styles.uploadContainer} onPress={handleDocumentUpload}>
                        <Image
                            source={require('../assets/upload-icon.png')}
                            style={styles.uploadIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.uploadText}>
                            {uploadedDoc ? uploadedDoc : 'Tap to upload scan document'}
                        </Text>
                    </TouchableOpacity>

                    {/* Add Scan Report Button */}
                    <TouchableOpacity
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={handleAddScanReport}
                        disabled={loading}
                    >
                        <Text style={styles.addButtonText}>
                            {loading ? 'Adding...' : 'Add Scan Report'}
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
    textAreaContainer: {
        height: 120,
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
    uploadContainer: {
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
    uploadIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: '#809CFF',
    },
    uploadText: {
        flex: 1,
        fontSize: 16,
        color: '#809CFF',
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
    // Date Picker Styles
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

export default ScanReportFormScreen;