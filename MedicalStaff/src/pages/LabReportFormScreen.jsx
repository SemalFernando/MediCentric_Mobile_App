import React, { useState, useCallback, memo, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Modal, Platform } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import DocumentPicker from 'react-native-document-picker';

// Memoized Custom Date Picker Component
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
          <Text style={styles.datePickerTitle}>Select Report Date</Text>
          
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

const LabReportFormScreen = ({ onBack }) => {
    const [reportDate, setReportDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [status, setStatus] = useState('COMPLETED');
    const [labReportResults, setLabReportResults] = useState('');
    const [labReportType, setLabReportType] = useState('');
    const [labReportDescription, setLabReportDescription] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [selectedDateForPicker, setSelectedDateForPicker] = useState(new Date());
    const [category, setCategory] = useState('ROUTINE');
    const [nurseId, setNurseId] = useState('N001');
    const [comments, setComments] = useState('');

    const baseUrl = 'http://10.185.72.247:8082';
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

    // Set current date when component loads
    useEffect(() => {
        const currentDate = new Date();
        setReportDate(currentDate);
        setTempDate(formatDate(currentDate));
        setSelectedDateForPicker(currentDate);
    }, [formatDate]);

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
                    setReportDate(parsedDate);
                } else {
                    setReportDate(null);
                }
            } catch (error) {
                console.log('Invalid date');
                setReportDate(null);
            }
        } else {
            setReportDate(null);
        }
    }, [parseDate]);

    // Show custom date picker
    const showCustomDatePicker = useCallback(() => {
        setSelectedDateForPicker(reportDate || new Date());
        setShowDatePicker(true);
    }, [reportDate]);

    // Handle date selection from custom picker
    const handleDateSelect = useCallback((date) => {
        setReportDate(date);
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

    // Handle real document upload
    const handleDocumentUpload = useCallback(async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
                allowMultiSelection: false,
            });
            
            const file = res[0];
            setUploadedFile({
                uri: file.uri,
                name: file.name,
                type: file.type,
                size: file.size
            });
            
            Alert.alert('Success', `File "${file.name}" selected successfully`);
            
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled document picker');
            } else {
                console.log('Document picker error:', err);
                Alert.alert('Error', 'Failed to pick document. Please try again.');
            }
        }
    }, []);

    // Remove uploaded file
    const handleRemoveFile = useCallback(() => {
        setUploadedFile(null);
    }, []);

    // Create form data for API call - EXACTLY matching Postman
    const createFormData = () => {
        const formData = new FormData();
        
        // Add scan report data as JSON - EXACT field names from Postman
        const scanReportData = {
            nurseId: nurseId,
            labReportType: labReportType.trim(),
            labReportDescription: labReportDescription.trim(),
            category: category,
            labReportResults: labReportResults.trim(),
            comments: comments.trim(),
            status: status
        };
        
        console.log('Sending JSON data:', scanReportData);
        
        formData.append('scanReport', JSON.stringify(scanReportData));
        
        // Add file if exists - EXACT field name 'file' from Postman
        if (uploadedFile) {
            formData.append('file', {
                uri: uploadedFile.uri,
                type: uploadedFile.type || 'application/pdf',
                name: uploadedFile.name
            });
            console.log('Attaching file:', uploadedFile.name);
        }
        
        return formData;
    };

    // Handle adding lab report
    const handleAddLabReport = async () => {
        if (!status.trim()) {
            Alert.alert('Error', 'Please enter report status');
            return;
        }
        if (!labReportResults.trim()) {
            Alert.alert('Error', 'Please enter report results');
            return;
        }
        if (!labReportType.trim()) {
            Alert.alert('Error', 'Please enter report type');
            return;
        }
        if (!nurseId.trim()) {
            Alert.alert('Error', 'Please enter nurse ID');
            return;
        }

        let finalReportDate = reportDate;
        
        if (!reportDate && tempDate && tempDate.length === 10) {
            try {
                finalReportDate = parseDate(tempDate);
                if (!finalReportDate || isNaN(finalReportDate.getTime())) {
                    Alert.alert('Error', 'Please enter a valid report date');
                    return;
                }
            } catch (error) {
                Alert.alert('Error', 'Please enter a valid report date');
                return;
            }
        }

        if (!finalReportDate || isNaN(finalReportDate.getTime())) {
            Alert.alert('Error', 'Please select a valid report date');
            return;
        }

        try {
            setLoading(true);
            
            const formData = createFormData();

            console.log('Sending request to:', `${baseUrl}/patients/${patientId}/lab-reports`);

            const response = await fetch(`${baseUrl}/patients/${patientId}/lab-reports`, {
                method: 'POST',
                // Let React Native set the Content-Type automatically with boundary
                headers: {
                    // No Content-Type header for FormData
                },
                body: formData,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                let errorText;
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = 'Could not read error response';
                }
                console.error('Server response error:', errorText);
                
                // Try to parse as JSON for better error message
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorJson)}`);
                } catch (parseError) {
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
            }

            const result = await response.json();
            console.log('Lab report added successfully:', result);

            Alert.alert('Success', 'Lab report added successfully!', [
                { 
                    text: 'OK', 
                    onPress: () => {
                        // Reset form but keep current date
                        const newCurrentDate = new Date();
                        setStatus('COMPLETED');
                        setLabReportResults('');
                        setLabReportType('');
                        setLabReportDescription('');
                        setComments('');
                        setUploadedFile(null);
                        setReportDate(newCurrentDate);
                        setTempDate(formatDate(newCurrentDate));
                        setCategory('ROUTINE');
                        setNurseId('N001');
                        if (onBack) onBack();
                    }
                }
            ]);

        } catch (error) {
            console.error('Error adding lab report:', error);
            Alert.alert('Error', `Failed to add lab report: ${error.message}`);
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
                    <Text style={styles.title}>New Lab Report</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Nurse ID Field */}
                    <Text style={styles.inputLabel}>Nurse ID *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/nurse-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={nurseId}
                            placeholder="Enter nurse ID"
                            placeholderTextColor="#809CFF"
                            onChangeText={setNurseId}
                        />
                    </View>

                    {/* Lab Report Type Field */}
                    <Text style={styles.inputLabel}>Lab Report Type *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/type-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={labReportType}
                            placeholder="Enter lab report type (e.g., Blood Test, Urine Analysis)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setLabReportType}
                        />
                    </View>

                    {/* Category Field */}
                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/category-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={category}
                            placeholder="Enter category (e.g., ROUTINE, SCREENING)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setCategory}
                        />
                    </View>

                    {/* Status Field */}
                    <Text style={styles.inputLabel}>Status *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/status-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={status}
                            placeholder="Enter status (e.g., COMPLETED, PENDING)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setStatus}
                        />
                    </View>

                    {/* Lab Report Results Field */}
                    <Text style={styles.inputLabel}>Lab Report Results *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/result-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={labReportResults}
                            placeholder="Enter lab report results"
                            placeholderTextColor="#809CFF"
                            onChangeText={setLabReportResults}
                        />
                    </View>

                    {/* Lab Report Description Field */}
                    <Text style={styles.inputLabel}>Lab Report Description</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter detailed lab report description..."
                            placeholderTextColor="#809CFF"
                            value={labReportDescription}
                            onChangeText={setLabReportDescription}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Comments Field */}
                    <Text style={styles.inputLabel}>Comments</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter comments..."
                            placeholderTextColor="#809CFF"
                            value={comments}
                            onChangeText={setComments}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Upload Report Document Field */}
                    <Text style={styles.inputLabel}>Upload Report Document (Optional)</Text>
                    <TouchableOpacity style={styles.uploadContainer} onPress={handleDocumentUpload}>
                        <Image
                            source={require('../assets/upload-icon.png')}
                            style={styles.uploadIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.uploadText}>
                            {uploadedFile ? uploadedFile.name : 'Tap to upload document (PDF/Image)'}
                        </Text>
                    </TouchableOpacity>

                    {/* Show selected file with remove option */}
                    {uploadedFile && (
                        <View style={styles.fileInfoContainer}>
                            <Text style={styles.fileName}>{uploadedFile.name}</Text>
                            <Text style={styles.fileSize}>
                                {Math.round(uploadedFile.size / 1024)} KB
                            </Text>
                            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveFile}>
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Add Lab Report Button */}
                    <TouchableOpacity
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={handleAddLabReport}
                        disabled={loading}
                    >
                        <Text style={styles.addButtonText}>
                            {loading ? 'Adding...' : 'Add Lab Report'}
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
        marginBottom: 10,
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
    fileInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#2260FF',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#F0F5FF',
    },
    fileName: {
        flex: 1,
        fontSize: 14,
        color: '#2260FF',
        fontWeight: '500',
    },
    fileSize: {
        fontSize: 12,
        color: '#809CFF',
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
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

export default LabReportFormScreen;