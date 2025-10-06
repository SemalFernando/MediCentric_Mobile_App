import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const PrescriptionFormScreen = ({ onBack }) => {
    const [activePage, setActivePage] = useState('prescription');
    const [issueDate, setIssueDate] = useState('');
    const [reviewDate, setReviewDate] = useState('');
    const [category, setCategory] = useState('');
    const [medicationList, setMedicationList] = useState('');

    const handleAddPrescription = () => {
        // Handle adding prescription logic here
        console.log('Adding prescription:', { issueDate, reviewDate, category, medicationList });
        // You can add navigation or API call here
    };

    return (
        <ScreenWrapper
            backgroundColor="#FFFFFF"
            statusBarStyle="dark-content"
            barStyle="dark-content"
            translucent={false}
        >
            <ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>New Prescription</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Issue Date Field */}
                    <Text style={styles.inputLabel}>Issue Date</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/calendar-icon.png')} // You'll need to add this icon
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#809CFF"
                            value={issueDate}
                            onChangeText={setIssueDate}
                        />
                    </View>

                    {/* Next Review Date Field */}
                    <Text style={styles.inputLabel}>Next Review Date</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/calendar-icon.png')} // You'll need to add this icon
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#809CFF"
                            value={reviewDate}
                            onChangeText={setReviewDate}
                        />
                    </View>

                    {/* Category Field */}
                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.inputContainer}>
                        <Image
                            source={require('../assets/category-icon.png')} // You'll need to add this icon
                            style={styles.inputIcon}
                            resizeMode="contain"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Select type..."
                            placeholderTextColor="#809CFF"
                            value={category}
                            onChangeText={setCategory}
                        />
                        <Image
                            source={require('../assets/drop-down.png')}
                            style={styles.dropdownIcon}
                            resizeMode="contain"
                        />
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
                        style={styles.addButton}
                        onPress={handleAddPrescription}
                    >
                        <Text style={styles.addButtonText}>Add Prescription</Text>
                    </TouchableOpacity>
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
        fontWeight: 'regular',
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
        height: 220,
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
    dropdownIcon: {
        width: 20,
        height: 20,
        tintColor: '#809CFF',
        marginLeft: 10,
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
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    activeIcon: {
        tintColor: 'black',
    },
    inactiveIcon: {
        tintColor: '#FFFFFF',
    },
});

export default PrescriptionFormScreen;