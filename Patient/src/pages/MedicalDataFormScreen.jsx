import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const MedicalDataFormScreen = ({ onBack, patientId, route }) => {
    const [formData, setFormData] = useState({
        age: '',
        thalach: '',
        oldpeak: '',
        trestbps: '',
        bmi: '',
        chol: '',
        ca: '0',
        thal: '3',
        restecg: '0',
        cp: '1',
    });
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    // Get patientId from props or route params
    const actualPatientId = patientId || route.params?.patientId;
    const ML_DATA_URL = 'http://10.185.72.247:8089';

    // Fetch existing medical data when component mounts
    useEffect(() => {
        if (actualPatientId) {
            fetchMedicalData();
        } else {
            setFetchingData(false);
            Alert.alert('Error', 'No patient ID available. Please log in.');
        }
    }, [actualPatientId]);

    const fetchMedicalData = async () => {
        try {
            console.log('Fetching medical data for patient:', actualPatientId);
            const response = await fetch(`${ML_DATA_URL}/health/record/latest?userId=${actualPatientId}`);
            
            if (response.ok) {
                const existingData = await response.json();
                console.log('Existing medical data:', existingData);
                
                // Update form with existing data
                setFormData({
                    age: existingData.age?.toString() || '',
                    thalach: existingData.thalach?.toString() || '',
                    oldpeak: existingData.oldpeak?.toString() || '',
                    trestbps: existingData.trestbps?.toString() || '',
                    bmi: existingData.bmi?.toString() || '',
                    chol: existingData.chol?.toString() || '',
                    ca: existingData.ca?.toString() || '0',
                    thal: existingData.thal?.toString() || '3',
                    restecg: existingData.restecg?.toString() || '0',
                    cp: existingData.cp?.toString() || '1',
                });
            } else if (response.status === 404) {
                console.log('No existing medical data found for patient');
                // This is normal - no data exists yet
            } else {
                throw new Error(`Failed to fetch medical data: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching medical data:', error);
            // Don't show alert for 404 - it's normal for new patients
            if (!error.message.includes('404')) {
                Alert.alert('Load Error', 'Could not load existing medical data. You can still enter new data.');
            }
        } finally {
            setFetchingData(false);
        }
    };

    const updateFormField = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSave = async () => {
        if (!actualPatientId) {
            Alert.alert('Error', 'No patient ID available. Please log in.');
            return;
        }
        if (!formData.age) {
            Alert.alert('Error', 'Age is required.');
            return;
        }
        setLoading(true);
        try {
            console.log('Saving medical data for patient:', actualPatientId);
            const response = await fetch(`${ML_DATA_URL}/health/record?userId=${actualPatientId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age),
                    thalach: formData.thalach ? parseInt(formData.thalach) : null,
                    oldpeak: formData.oldpeak ? parseFloat(formData.oldpeak) : null,
                    trestbps: formData.trestbps ? parseInt(formData.trestbps) : null,
                    bmi: formData.bmi ? parseFloat(formData.bmi) : null,
                    chol: formData.chol ? parseInt(formData.chol) : null,
                    ca: parseInt(formData.ca),
                    thal: parseInt(formData.thal),
                    restecg: parseInt(formData.restecg),
                    cp: parseInt(formData.cp),
                }),
            });
            if (!response.ok) {
                throw new Error(`Save failed with status: ${response.status}`);
            }
            Alert.alert('Success', 'Medical data saved successfully!');
            onBack();
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Save Error', error.message || 'Failed to save medical data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading while fetching data
    if (fetchingData) {
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

                {/* Patient ID Display (for debugging) */}
                <Text style={styles.patientIdText}>
                    Patient: {actualPatientId ? `${actualPatientId.substring(0, 8)}...` : 'Not logged in'}
                </Text>

                <Text style={styles.title}>Medical Information</Text>

                {/* Numerical Inputs */}
                <Text style={styles.inputLabel}>Age (29-77 years) *</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.age}
                        onChangeText={(text) => updateFormField('age', text)}
                        keyboardType="numeric"
                        placeholder="Enter age"
                        placeholderTextColor="#809CFF"
                    />
                </View>
                <Text style={styles.helperText}>A key risk factor.</Text>

                <Text style={styles.inputLabel}>Max Heart Rate (71-202 bpm)</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.thalach}
                        onChangeText={(text) => updateFormField('thalach', text)}
                        keyboardType="numeric"
                        placeholder="Enter max heart rate"
                        placeholderTextColor="#809CFF"
                    />
                </View>
                <Text style={styles.helperText}>Higher is better for fitness.</Text>

                <Text style={styles.inputLabel}>ST Depression (0-6.2)</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.oldpeak}
                        onChangeText={(text) => updateFormField('oldpeak', text)}
                        keyboardType="numeric"
                        placeholder="Enter ST depression"
                        placeholderTextColor="#809CFF"
                    />
                </View>
                <Text style={styles.helperText}>From exercise test; higher indicates stress.</Text>

                <Text style={styles.inputLabel}>Resting BP (90-200 mmHg)</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.trestbps}
                        onChangeText={(text) => updateFormField('trestbps', text)}
                        keyboardType="numeric"
                        placeholder="Enter resting BP"
                        placeholderTextColor="#809CFF"
                    />
                </View>

                <Text style={styles.inputLabel}>BMI (15-41)</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.bmi}
                        onChangeText={(text) => updateFormField('bmi', text)}
                        keyboardType="numeric"
                        placeholder="Enter BMI"
                        placeholderTextColor="#809CFF"
                    />
                </View>

                <Text style={styles.inputLabel}>Cholesterol (120-400 mg/dl)</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.chol}
                        onChangeText={(text) => updateFormField('chol', text)}
                        keyboardType="numeric"
                        placeholder="Enter cholesterol"
                        placeholderTextColor="#809CFF"
                    />
                </View>

                {/* Categorical Pickers */}
                <Text style={styles.inputLabel}>Chest Pain Type</Text>
                <View style={styles.pickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.pickerOptions}>
                            {[
                                { label: 'Typical Angina', value: '1' },
                                { label: 'Atypical Angina', value: '2' },
                                { label: 'Non-Anginal Pain', value: '3' },
                                { label: 'Asymptomatic', value: '4' }
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.pickerOption,
                                        formData.cp === option.value && styles.pickerOptionSelected
                                    ]}
                                    onPress={() => updateFormField('cp', option.value)}
                                >
                                    <Text style={[
                                        styles.pickerOptionText,
                                        formData.cp === option.value && styles.pickerOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <Text style={styles.inputLabel}>ECG Results</Text>
                <View style={styles.pickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.pickerOptions}>
                            {[
                                { label: 'Normal', value: '0' },
                                { label: 'ST-T Abnormality', value: '1' },
                                { label: 'Left Ventricular Hypertrophy', value: '2' }
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.pickerOption,
                                        formData.restecg === option.value && styles.pickerOptionSelected
                                    ]}
                                    onPress={() => updateFormField('restecg', option.value)}
                                >
                                    <Text style={[
                                        styles.pickerOptionText,
                                        formData.restecg === option.value && styles.pickerOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <Text style={styles.inputLabel}>Major Vessels</Text>
                <View style={styles.pickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.pickerOptions}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.pickerOption,
                                        formData.ca === i.toString() && styles.pickerOptionSelected
                                    ]}
                                    onPress={() => updateFormField('ca', i.toString())}
                                >
                                    <Text style={[
                                        styles.pickerOptionText,
                                        formData.ca === i.toString() && styles.pickerOptionTextSelected
                                    ]}>
                                        {i} vessels
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <Text style={styles.inputLabel}>Thalassemia</Text>
                <View style={styles.pickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.pickerOptions}>
                            {[
                                { label: 'Normal', value: '3' },
                                { label: 'Fixed Defect', value: '6' },
                                { label: 'Reversible Defect', value: '7' }
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.pickerOption,
                                        formData.thal === option.value && styles.pickerOptionSelected
                                    ]}
                                    onPress={() => updateFormField('thal', option.value)}
                                >
                                    <Text style={[
                                        styles.pickerOptionText,
                                        formData.thal === option.value && styles.pickerOptionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.buttonDisabled]} 
                        onPress={handleSave}
                        disabled={loading || !actualPatientId}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : actualPatientId ? 'Save Data' : 'Please Login First'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.backButtonSecondary}
                        onPress={onBack}
                        disabled={loading}
                    >
                        <Text style={styles.backButtonText}>Back</Text>
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
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 5,
        alignSelf: 'flex-start',
        marginLeft: 5,
        marginTop: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ECF1FF',
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#ECF1FF',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#809CFF',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
        marginLeft: 5,
        fontStyle: 'italic',
    },
    pickerContainer: {
        marginBottom: 15,
    },
    pickerOptions: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 5,
    },
    pickerOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#ECF1FF',
        borderWidth: 1,
        borderColor: '#CAD6FF',
    },
    pickerOptionSelected: {
        backgroundColor: '#2260FF',
        borderColor: '#2260FF',
    },
    pickerOptionText: {
        fontSize: 14,
        color: '#2260FF',
        fontWeight: '500',
    },
    pickerOptionTextSelected: {
        color: '#FFFFFF',
    },
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    saveButton: {
        backgroundColor: '#2260FF',
        borderRadius: 25,
        paddingVertical: 15,
        marginBottom: 15,
        width: '80%',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#809CFF',
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
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
});

export default MedicalDataFormScreen;