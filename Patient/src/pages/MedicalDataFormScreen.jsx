import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import ScreenWrapper from '../components/ScreenWrapper';  // Your wrapper

const MedicalDataFormScreen = ({ onBack, patientId }) => {
    const [formData, setFormData] = useState({
        age: '',
        thalach: '',
        oldpeak: '',
        trestbps: '',
        bmi: '',
        chol: '',
        ca: 0,
        thal: 3,
        restecg: 0,
        cp: 1,
    });
    const [loading, setLoading] = useState(false);

    const ML_DATA_URL = 'http://192.168.1.4:8089';  // mldata URL

    const updateFormField = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSave = async () => {
        if (!patientId) {
            Alert.alert('Error', 'No patient ID available. Please log in.');
            return;
        }
        if (!formData.age) {
            Alert.alert('Error', 'Age is required.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${ML_DATA_URL}/health/record?userId=${patientId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Save failed');
            }
            Alert.alert('Success', 'Medical data saved successfully!');
            onBack();  // Navigate back to Home
        } catch (error) {
            Alert.alert('Save Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Medical Data Form</Text>

                {/* Numerical Inputs */}
                <Text style={styles.label}>Age (29-77 years) *</Text>
                <TextInput style={styles.input} value={formData.age} onChangeText={(text) => updateFormField('age', text)} keyboardType="numeric" placeholder="Enter age" />
                <HelperText>A key risk factor.</HelperText>

                <Text style={styles.label}>Max Heart Rate (71-202 bpm)</Text>
                <TextInput style={styles.input} value={formData.thalach} onChangeText={(text) => updateFormField('thalach', text)} keyboardType="numeric" placeholder="Enter max heart rate" />
                <HelperText>Higher is better for fitness.</HelperText>

                <Text style={styles.label}>ST Depression (0-6.2)</Text>
                <TextInput style={styles.input} value={formData.oldpeak} onChangeText={(text) => updateFormField('oldpeak', text)} keyboardType="numeric" placeholder="Enter ST depression" />
                <HelperText>From exercise test; higher indicates stress.</HelperText>

                <Text style={styles.label}>Resting BP (90-200 mmHg)</Text>
                <TextInput style={styles.input} value={formData.trestbps} onChangeText={(text) => updateFormField('trestbps', text)} keyboardType="numeric" placeholder="Enter resting BP" />

                <Text style={styles.label}>BMI (15-41)</Text>
                <TextInput style={styles.input} value={formData.bmi} onChangeText={(text) => updateFormField('bmi', text)} keyboardType="numeric" placeholder="Enter BMI" />

                <Text style={styles.label}>Cholesterol (120-400 mg/dl)</Text>
                <TextInput style={styles.input} value={formData.chol} onChangeText={(text) => updateFormField('chol', text)} keyboardType="numeric" placeholder="Enter cholesterol" />

                {/* Categorical Pickers */}
                <Text style={styles.label}>Chest Pain Type (1-4)</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={formData.cp} onValueChange={(value) => updateFormField('cp', value)}>
                        <Picker.Item label="1: Typical Angina" value={1} />
                        <Picker.Item label="2: Atypical Angina" value={2} />
                        <Picker.Item label="3: Non-Anginal Pain" value={3} />
                        <Picker.Item label="4: Asymptomatic" value={4} />
                    </Picker>
                </View>

                <Text style={styles.label}>ECG Results (0-2)</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={formData.restecg} onValueChange={(value) => updateFormField('restecg', value)}>
                        <Picker.Item label="0: Normal" value={0} />
                        <Picker.Item label="1: ST-T Abnormality" value={1} />
                        <Picker.Item label="2: Left Ventricular Hypertrophy" value={2} />
                    </Picker>
                </View>

                <Text style={styles.label}>Major Vessels (0-4)</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={formData.ca} onValueChange={(value) => updateFormField('ca', value)}>
                        {Array.from({ length: 5 }, (_, i) => <Picker.Item key={i} label={`${i} vessels`} value={i} />)}
                    </Picker>
                </View>

                <Text style={styles.label}>Thalassemia (3-7)</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={formData.thal} onValueChange={(value) => updateFormField('thal', value)}>
                        <Picker.Item label="3: Normal" value={3} />
                        <Picker.Item label="6: Fixed Defect" value={6} />
                        <Picker.Item label="7: Reversible Defect" value={7} />
                    </Picker>
                </View>

                <View style={styles.buttons}>
                    <Button mode="contained" onPress={handleSave} loading={loading} style={styles.saveButton}>
                        Save Data
                    </Button>
                    <Button mode="outlined" onPress={onBack} disabled={loading} style={styles.backButton}>
                        Back
                    </Button>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2260FF',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        marginBottom: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E5E9F9',
        borderRadius: 8,
        marginBottom: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        flex: 0.5,
        marginRight: 10,
        backgroundColor: '#2260FF',
    },
    backButton: {
        flex: 0.5,
        marginLeft: 10,
    },
});

export default MedicalDataFormScreen;