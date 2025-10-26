import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import DocumentPicker from 'react-native-document-picker';

const LabReportFormScreen = ({ onBack }) => {
    const [status, setStatus] = useState('');
    const [labReportResults, setLabReportResults] = useState('');
    const [labReportType, setLabReportType] = useState('');
    const [labReportDescription, setLabReportDescription] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nurseId, setNurseId] = useState('N001');
    const [category, setCategory] = useState('');
    const [comments, setComments] = useState('');

    const baseUrl = 'http://10.185.72.247:8083';
    const patientId = 'P1234';

    // Handle document upload with DocumentPicker - FIXED VERSION FOR OLDER API
    const handleDocumentUpload = useCallback(async () => {
        try {
            console.log('🚀 Starting document picker...');

            // Use pickSingle - older versions return just the URI string
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
            });

            console.log('✅ Raw file result:', JSON.stringify(result, null, 2));
            console.log('✅ Result type:', typeof result);

            // Handle different return types (older vs newer API)
            let fileUri, fileName, fileType, fileSize;

            if (typeof result === 'string') {
                // Older API - returns just URI string
                fileUri = result;
                
                // Extract filename from URI
                const uriParts = fileUri.split('/');
                const lastPart = decodeURIComponent(uriParts[uriParts.length - 1]);
                
                // Try to extract actual filename or generate one
                if (lastPart.includes(':')) {
                    // Content URI format like "image:1000056278"
                    const contentId = lastPart.split(':')[1];
                    
                    // Check if it's an image from media store
                    if (fileUri.includes('image')) {
                        fileName = `image_${contentId}.jpg`;
                        fileType = 'image/jpeg';
                    } else if (fileUri.includes('document')) {
                        fileName = `document_${contentId}.pdf`;
                        fileType = 'application/pdf';
                    } else {
                        fileName = `file_${contentId}`;
                        fileType = 'application/octet-stream';
                    }
                } else {
                    fileName = lastPart;
                    // Try to detect type from filename
                    const ext = fileName.split('.').pop()?.toLowerCase();
                    if (ext === 'pdf') {
                        fileType = 'application/pdf';
                    } else if (['jpg', 'jpeg'].includes(ext)) {
                        fileType = 'image/jpeg';
                    } else if (ext === 'png') {
                        fileType = 'image/png';
                    } else {
                        fileType = 'image/jpeg'; // Default to image
                    }
                }
            } else {
                // Newer API - returns object
                fileUri = result.fileCopyUri || result.uri;
                fileName = result.name || 'unknown_file';
                fileType = result.type || 'application/octet-stream';
                fileSize = result.size;
            }

            const fileInfo = {
                uri: fileUri,
                name: fileName,
                type: fileType,
                size: fileSize
            };

            console.log('📁 File info prepared:', fileInfo);
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

    // Handle adding lab report with proper file upload - FIXED VERSION
    const handleAddLabReport = async () => {
        if (!status.trim()) {
            Alert.alert('Error', 'Please enter lab report status');
            return;
        }
        if (!labReportResults.trim()) {
            Alert.alert('Error', 'Please enter lab report results');
            return;
        }
        if (!labReportType.trim()) {
            Alert.alert('Error', 'Please enter lab report type');
            return;
        }
        if (!nurseId.trim()) {
            Alert.alert('Error', 'Please enter nurse ID');
            return;
        }

        try {
            setLoading(true);
            console.log('🚀 Starting lab report submission...');

            // Create the lab report JSON object as per your API
            const labReportData = {
                nurseId: nurseId.trim(),
                labReportType: labReportType.trim(),
                labReportDescription: labReportDescription.trim(),
                category: category.trim() || 'ROUTINE',
                labReportResults: labReportResults.trim(),
                comments: comments.trim(),
                status: status.trim().toUpperCase()
            };

            console.log('📄 Lab report data:', labReportData);
            console.log('📁 Selected file:', uploadedFile);

            // Create form data for multipart/form-data
            const formData = new FormData();

            // Add the lab report as JSON string
            formData.append('scanReport', JSON.stringify(labReportData));

            // Add file if uploaded - FIXED FILE HANDLING
            if (uploadedFile && uploadedFile.name && uploadedFile.uri) {
                console.log('📤 Adding file to formData:', uploadedFile);

                // Determine MIME type based on file type or extension
                let mimeType = uploadedFile.type;
                
                // If type is generic or missing, infer from file extension
                if (!mimeType || mimeType === 'application/octet-stream') {
                    const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase();
                    
                    if (fileExtension === 'pdf') {
                        mimeType = 'application/pdf';
                    } else if (['jpg', 'jpeg'].includes(fileExtension)) {
                        mimeType = 'image/jpeg';
                    } else if (fileExtension === 'png') {
                        mimeType = 'image/png';
                    } else if (fileExtension === 'gif') {
                        mimeType = 'image/gif';
                    } else {
                        // Default to image/jpeg for unknown image types
                        mimeType = 'image/jpeg';
                    }
                }

                console.log('📝 Determined MIME type:', mimeType);

                // Create proper file object for FormData
                const file = {
                    uri: uploadedFile.uri,
                    type: mimeType,
                    name: uploadedFile.name,
                };

                formData.append('file', file);
                console.log('✅ File added to formData:', file);
            } else {
                console.log('ℹ️ No valid file selected, uploading without file');
                if (uploadedFile) {
                    console.log('⚠️ File is missing required properties:', uploadedFile);
                }
            }

            const url = `${baseUrl}/patients/${patientId}/lab-reports`;
            console.log('🌐 Making request to:', url);

            // Make API call with proper headers
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    // Let FormData set Content-Type with boundary automatically
                    'Accept': 'application/json',
                },
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            // Check if the request was successful
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Lab report submitted successfully:', result);

                Alert.alert(
                    'Lab Report Submitted',
                    'Your lab report has been successfully submitted.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Reset form
                                setStatus('');
                                setLabReportResults('');
                                setLabReportType('');
                                setLabReportDescription('');
                                setUploadedFile(null);
                                setNurseId('N001');
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
                    console.log('❌ Error response:', errorText);
                    if (errorText) {
                        try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.message || errorJson.error || errorMessage;
                        } catch (e) {
                            errorMessage = errorText || errorMessage;
                        }
                    }
                } catch (e) {
                    console.log('❌ Could not read error response body');
                }
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error('🚨 Error adding lab report:', error);
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
            } else if (error.message.includes('415') || error.message.includes('Unsupported Media Type')) {
                Alert.alert(
                    'Server Configuration Error',
                    'The server rejected the file format. Please check:\n\n• Backend accepts multipart/form-data\n• File field name is "file"\n• Accepted file types match (PDF, JPEG, PNG)\n\nError details: ' + error.message
                );
            } else {
                Alert.alert(
                    'Error',
                    `Failed to add lab report: ${error.message}`
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
                            placeholder="Enter nurse ID (e.g., N001)"
                            placeholderTextColor="#809CFF"
                            onChangeText={setNurseId}
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

                    {/* Lab Report Type Field */}
                    <Text style={styles.inputLabel}>Lab Report Type *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/lab-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={labReportType}
                            placeholder="Enter lab report type (e.g., Blood Test, Urinalysis)"
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

                    {/* Lab Report Results Field */}
                    <Text style={styles.inputLabel}>Lab Results *</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/result-icon.png')}
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            value={labReportResults}
                            placeholder="Enter lab results"
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
                            placeholder="Enter additional comments..."
                            placeholderTextColor="#809CFF"
                            value={comments}
                            onChangeText={setComments}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Upload Lab Document Field */}
                    <Text style={styles.inputLabel}>Upload Lab Document</Text>
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
                            {uploadedFile ? uploadedFile.name : 'Tap to upload lab document (PDF or Images)'}
                        </Text>
                    </TouchableOpacity>

                    {/* Show file details if selected */}
                    {uploadedFile && (
                        <View style={styles.fileInfoContainer}>
                            <Text style={styles.fileInfoText}>File: {uploadedFile.name}</Text>
                            <Text style={styles.fileInfoText}>Type: {uploadedFile.type}</Text>
                            {uploadedFile.size && (
                                <Text style={styles.fileInfoText}>
                                    Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                                </Text>
                            )}
                        </View>
                    )}

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

                    {/* Add Lab Report Button */}
                    <TouchableOpacity
                        style={[styles.addButton, loading && styles.disabledButton]}
                        onPress={handleAddLabReport}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.addButtonText}>Add Lab Report</Text>
                        )}
                    </TouchableOpacity>

                    {/* Loading indicator */}
                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#2260FF" />
                            <Text style={styles.loadingText}>Uploading lab report...</Text>
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
    fileInfoContainer: {
        backgroundColor: '#F0F4FF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    fileInfoText: {
        fontSize: 14,
        color: '#2260FF',
        marginBottom: 4,
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
        marginBottom: 10,
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

export default LabReportFormScreen;