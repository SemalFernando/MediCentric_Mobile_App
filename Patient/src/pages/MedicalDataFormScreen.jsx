import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const MedicalDataViewScreen = ({ onBack, patientId, route }) => {
    const [medicalData, setMedicalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get patientId from props or route params
    const actualPatientId = patientId || route.params?.patientId;
    const ML_DATA_URL = 'http://172.16.102.245:8089';

    // Fetch existing medical data when component mounts
    useEffect(() => {
        if (actualPatientId) {
            fetchMedicalData();
        } else {
            setError('No patient ID available. Please log in.');
            setLoading(false);
        }
    }, [actualPatientId]);

    const fetchMedicalData = async () => {
        try {
            console.log('Fetching medical data for patient:', actualPatientId);
            const response = await fetch(`${ML_DATA_URL}/health/record/latest?userId=${actualPatientId}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Medical data loaded:', data);
                setMedicalData(data);
                setError(null);
            } else if (response.status === 404) {
                console.log('No medical data found for patient');
                setMedicalData(null);
                setError(null);
            } else {
                throw new Error(`Server returned ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching medical data:', error);
            setError('Could not load medical data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format value for display
    const formatValue = (value) => {
        if (value === null || value === undefined || value === '' || value === 'null') return 'Not provided';
        return value.toString();
    };

    // Get display label for categorical values
    const getDisplayLabel = (value, type) => {
        const stringValue = value?.toString();
        if (!stringValue || stringValue === 'null' || stringValue === '') return 'Not provided';
        
        switch (type) {
            case 'cp':
                const cpLabels = {
                    '1': 'Typical Angina',
                    '2': 'Atypical Angina',
                    '3': 'Non-Anginal Pain',
                    '4': 'Asymptomatic'
                };
                return cpLabels[stringValue] || `Unknown (${stringValue})`;
            
            case 'restecg':
                const restecgLabels = {
                    '0': 'Normal',
                    '1': 'ST-T Abnormality',
                    '2': 'Left Ventricular Hypertrophy'
                };
                return restecgLabels[stringValue] || `Unknown (${stringValue})`;
            
            case 'ca':
                return `${stringValue} vessel${stringValue !== '1' ? 's' : ''}`;
            
            case 'thal':
                const thalLabels = {
                    '3': 'Normal',
                    '6': 'Fixed Defect',
                    '7': 'Reversible Defect'
                };
                return thalLabels[stringValue] || `Unknown (${stringValue})`;
            
            default:
                return stringValue;
        }
    };

    // Show loading while fetching data
    if (loading) {
        return (
            <ScreenWrapper 
                backgroundColor="#FFFFFF"
                statusBarStyle="dark-content"
                barStyle="dark-content"
                translucent={false}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2260FF" />
                    <Text style={styles.loadingText}>Loading medical data...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper 
            backgroundColor="#FFFFFF"
            statusBarStyle="dark-content"
            barStyle="dark-content"
            translucent={false}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Medical Data</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Patient ID Display */}
                <Text style={styles.patientIdText}>
                    Patient: {actualPatientId ? `${actualPatientId.substring(0, 8)}...` : 'Not logged in'}
                </Text>

                {/* Error State */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={fetchMedicalData}
                        >
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* No Data State */}
                {!error && !medicalData && (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataTitle}>No Medical Data Found</Text>
                        <Text style={styles.noDataText}>
                            No medical records have been created for this patient yet.
                        </Text>
                        <Text style={styles.noDataSubText}>
                            Medical data will appear here once it has been recorded.
                        </Text>
                    </View>
                )}

                {/* Medical Data Display */}
                {!error && medicalData && (
                    <>
                        <Text style={styles.title}>Medical Information</Text>

                        {/* Numerical Data Display */}
                        <View style={styles.dataSection}>
                            <Text style={styles.sectionTitle}>Vital Signs & Measurements</Text>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Age</Text>
                                <Text style={styles.dataValue}>{formatValue(medicalData.age)} years</Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Max Heart Rate</Text>
                                <Text style={styles.dataValue}>{formatValue(medicalData.thalach)} bpm</Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>ST Depression</Text>
                                <Text style={styles.dataValue}>{formatValue(medicalData.oldpeak)}</Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Resting Blood Pressure</Text>
                                <Text style={styles.dataValue}>{formatValue(medicalData.trestbps)} mmHg</Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>BMI</Text>
                                <Text style={styles.dataValue}>{formatValue(medicalData.bmi)}</Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Cholesterol</Text>
                                <Text style={styles.dataValue}>{formatValue(medicalData.chol)} mg/dl</Text>
                            </View>
                        </View>

                        {/* Categorical Data Display */}
                        <View style={styles.dataSection}>
                            <Text style={styles.sectionTitle}>Diagnostic Information</Text>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Chest Pain Type</Text>
                                <Text style={styles.dataValue}>
                                    {getDisplayLabel(medicalData.cp, 'cp')}
                                </Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>ECG Results</Text>
                                <Text style={styles.dataValue}>
                                    {getDisplayLabel(medicalData.restecg, 'restecg')}
                                </Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Major Vessels</Text>
                                <Text style={styles.dataValue}>
                                    {getDisplayLabel(medicalData.ca, 'ca')}
                                </Text>
                            </View>
                            
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Thalassemia</Text>
                                <Text style={styles.dataValue}>
                                    {getDisplayLabel(medicalData.thal, 'thal')}
                                </Text>
                            </View>
                        </View>

                        {/* Last Updated Info */}
                        <View style={styles.lastUpdatedContainer}>
                            <Text style={styles.lastUpdatedText}>
                                Data loaded on: {new Date().toLocaleDateString()}
                            </Text>
                        </View>
                    </>
                )}

                {/* Back Button */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={styles.backButtonSecondary}
                        onPress={onBack}
                    >
                        <Text style={styles.backButtonText}>Back to Home</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10,
    },
    backButton: {
        padding: 5,
    },
    backText: {
        fontSize: 50,
        color: '#2260FF',
        fontWeight: 'regular',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    patientIdText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2260FF',
    },
    dataSection: {
        backgroundColor: '#ECF1FF',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 15,
        textAlign: 'center',
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#CAD6FF',
    },
    dataLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2260FF',
        flex: 1,
    },
    dataValue: {
        fontSize: 16,
        fontWeight: '400',
        color: '#333',
        textAlign: 'right',
        flex: 1,
    },
    lastUpdatedContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    lastUpdatedText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    backButtonSecondary: {
        backgroundColor: '#CAD6FF',
        borderRadius: 25,
        paddingVertical: 15,
        width: '80%',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#2260FF',
        fontSize: 18,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#2260FF',
        fontWeight: '500',
    },
    errorContainer: {
        backgroundColor: '#FFECEC',
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: '#2260FF',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    noDataContainer: {
        backgroundColor: '#ECF1FF',
        borderRadius: 10,
        padding: 30,
        marginVertical: 10,
        alignItems: 'center',
    },
    noDataTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 10,
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 20,
    },
    noDataSubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default MedicalDataViewScreen;