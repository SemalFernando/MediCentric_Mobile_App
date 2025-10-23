import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import DocumentPicker from 'react-native-document-picker';

const ScanReportFormScreen = ({ onBack }) => {
    const [scanStatus, setScanStatus] = useState('');
    const [scanResult, setScanResult] = useState('');
    const [scanType, setScanType] = useState('');
    const [scanDescription, setScanDescription] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [radiologistId, setRadiologistId] = useState('R001');
    const [category, setCategory] = useState('');
    const [comments, setComments] = useState('');

    const baseUrl = 'http://10.185.72.247:8080';
    const patientId = 'P123';

    // Handle document upload with DocumentPicker - WORKING VERSION
    const handleDocumentUpload = useCallback(async () => {
        try {
            console.log('🚀 Starting document picker...');

            // Use pickSingle for single file selection (returns string URI)
            const fileUri = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
            });

            console.log('✅ File selected:', fileUri);

            // Extract filename from URI
            const uriParts = fileUri.split('/');
            let fileName = uriParts[uriParts.length - 1];
            fileName = decodeURIComponent(fileName);

            const fileInfo = {
                uri: fileUri,
                name: fileName,
                type: 'application/octet-stream' // Default type
            };

            setUploadedFile(fileInfo);
            Alert.alert('Success', `File "${fileName}" selected successfully!`);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the upload");
            } else {
                console.log('Document picker error:', err);
                Alert.alert('Error', 'Failed to select document. Please try again.');
            }
        }
    }, []);

    // Handle adding scan report with proper file upload - WORKING VERSION
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
        if (!radiologistId.trim()) {
            Alert.alert('Error', 'Please enter radiologist ID');
            return;
        }

        try {
            setLoading(true);
            console.log('🚀 Starting scan report submission...');

            // Create the scan report JSON object as per your API
            const scanReportData = {
                radiologistId: radiologistId.trim(),
                scanType: scanType.trim(),
                scanDescription: scanDescription.trim(),
                category: category.trim() || 'GENERAL',
                scanResults: scanResult.trim(),
                comments: comments.trim(),
                status: scanStatus.trim().toUpperCase()
            };

            console.log('📄 Scan report data:', scanReportData);
            console.log('📁 Selected file:', uploadedFile);

            // Create form data for multipart/form-data
            const formData = new FormData();

            // Add the scan report as JSON string
            formData.append('scanReport', JSON.stringify(scanReportData));

            // Add file if uploaded - WORKING FILE HANDLING
            if (uploadedFile) {
                console.log('📤 Adding file to formData:', uploadedFile);

                // Determine MIME type based on file extension
                const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
                let mimeType = 'application/octet-stream';

                if (fileExtension === 'pdf') {
                    mimeType = 'application/pdf';
                } else if (['jpg', 'jpeg'].includes(fileExtension)) {
                    mimeType = 'image/jpeg';
                } else if (fileExtension === 'png') {
                    mimeType = 'image/png';
                } else if (fileExtension === 'gif') {
                    mimeType = 'image/gif';
                }

                const file = {
                    uri: uploadedFile.uri,
                    type: mimeType,
                    name: uploadedFile.name,
                };

                formData.append('file', file);
                console.log('✅ File added to formData with MIME type:', mimeType);
            } else {
                console.log('ℹ️ No file selected, uploading without file');
            }

            const url = `${baseUrl}/patients/${patientId}/scan-reports`;
            console.log('🌐 Making request to:', url);

            // Make API call
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    // Let React Native set Content-Type automatically for FormData
                },
                body: formData,
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            // Check if the request was successful
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Scan report submitted successfully:', result);

                Alert.alert(
                    'Scan Report Submitted',
                    `Your scan report has been successfully submitted.${result.fileUrl ? '\n\nThe attached file has been uploaded to Google Drive.' : ''
                    }`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Reset form
                                setScanStatus('');
                                setScanResult('');
                                setScanType('');
                                setScanDescription('');
                                setUploadedFile(null);
                                setRadiologistId('R001');
                                setCategory('');
                                setComments('');
                                if (onBack) onBack();
                            }
                        }
                    ]
                );
            } else {
                // Handle server errors (4xx, 5xx)
                let errorMessage = `Server error: ${response.status}`;
                try {
                    const errorText = await response.text();
                    if (errorText) {
                        errorMessage = errorText;
                    }
                } catch (e) {
                    console.log('❌ Could not read error response body');
                }
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error('🚨 Error adding scan report:', error);
            console.error('🚨 Error message:', error.message);

            // Check the specific error type
            if (error.message.includes('Network request failed') ||
                error.message.includes('Failed to connect to') ||
                error.message.includes('ECONNREFUSED')) {

                Alert.alert(
                    'Network Error',
                    `Cannot connect to the server at ${baseUrl}. Please check:\n\n• Your server is running\n• Your device and server are on the same network\n• No firewall is blocking the connection`
                );
            } else if (error.message.includes('timeout') || error.message.includes('TIMEDOUT')) {
                Alert.alert(
                    'Timeout',
                    'The request took too long. Please try again.'
                );
            } else {
                Alert.alert(
                    'Error',
                    `Failed to add scan report: ${error.message}`
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setUploadedFile(null);
        Alert.alert('File Removed', 'Selected file has been removed.');
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
                    {/* Radiologist ID Field */}
                    <Text style={styles.inputLabel}>Radiologist ID *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/radiologist-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={radiologistId}
                            placeholder="Enter radiologist ID (e.g., R001)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setRadiologistId}
                        />
                    </View>

                    {/* Scan Status Field */}
                    <Text style={styles.inputLabel}>Scan Status *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/status-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={scanStatus}
                            placeholder="Enter scan status (e.g., COMPLETED, PENDING)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setScanStatus}
                        />
                    </View>

                    {/* Scan Type Field */}
                    <Text style={styles.inputLabel}>Scan Type *</Text>
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
                            placeholder="Enter category (e.g., NEURO, CHEST, CARDIAC)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setCategory}
                        />
                    </View>

                    {/* Scan Result Field */}
                    <Text style={styles.inputLabel}>Scan Results *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/result-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={scanResult}
                            placeholder="Enter scan results"
                            placeholderTextColor="#809CFF"
                            onChangeText={setScanResult}
                        />
                    </View>

                    {/* Scan Description Field */}
                    <Text style={styles.inputLabel}>Scan Description</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter detailed scan description..."
                            placeholderTextColor="#809CFF"
                            value={scanDescription}
                            onChangeText={setScanDescription}
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
                            placeholder="Enter additional comments..."
                            placeholderTextColor="#809CFF"
                            value={comments}
                            onChangeText={setComments}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Upload Scan Document Field */}
                    <Text style={styles.inputLabel}>Upload Scan Document</Text>
                    <TouchableOpacity
                        style={styles.uploadContainer}
                        onPress={handleDocumentUpload}
                        disabled={loading}
                    >
                        <Image
                            source={require('../assets/upload-icon.png')}
                            style={styles.uploadIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.uploadText}>
                            {uploadedFile ? uploadedFile.name : 'Tap to upload scan document (PDF or Images)'}
                        </Text>
                    </TouchableOpacity>

                    {/* Remove file button if file is selected */}
                    {uploadedFile && (
                        <TouchableOpacity
                            style={styles.removeFileButton}
                            onPress={handleRemoveFile}
                            disabled={loading}
                        >
                            <Text style={styles.removeFileText}>Remove Selected File</Text>
                        </TouchableOpacity>
                    )}

                    {/* Add Scan Report Button */}
                    <TouchableOpacity
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={handleAddScanReport}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.addButtonText}>Add Scan Report</Text>
                        )}
                    </TouchableOpacity>

                    {/* Loading indicator */}
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#2260FF" />
                            <Text style={styles.loadingText}>Uploading scan report...</Text>
                        </View>
                    )}
                </View>
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
    removeFileButton: {
        backgroundColor: '#FFECF0',
        borderWidth: 1,
        borderColor: '#FF2260',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
    },
    removeFileText: {
        color: '#FF2260',
        fontSize: 16,
        fontWeight: '600',
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
    loadingOverlay: {
        alignItems: 'center',
        marginTop: 10,
    },
    loadingText: {
        marginTop: 10,
        color: '#2260FF',
        fontSize: 14,
    },
});

export default ScanReportFormScreen;