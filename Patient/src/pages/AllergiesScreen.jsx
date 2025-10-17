import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const AllergiesScreen = ({ onBack }) => {
    const [activePage, setActivePage] = useState('documents');
    const [allergies, setAllergies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use your computer's IP address instead of localhost
    const baseUrl = 'http://10.87.143.247:8080'; // Your backend port 8080
    const patientId = '101'; // Replace with actual patient ID

    // Fetch allergies from backend
    const fetchAllergies = async () => {
        try {
            setLoading(true);
            console.log('Fetching allergies from:', `${baseUrl}/patients/${patientId}/allergies`);
            
            const response = await fetch(`${baseUrl}/patients/${patientId}/allergies`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const allergiesData = await response.json();
            console.log('Received allergies data:', allergiesData);
            setAllergies(allergiesData);
        } catch (error) {
            console.error('Error fetching allergies:', error);
            Alert.alert('Error', `Failed to load allergies: ${error.message}`);
            setAllergies([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Add a new allergy
    const addAllergy = async (allergyData) => {
        try {
            const response = await fetch(`${baseUrl}/patients/${patientId}/allergies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(allergyData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh the allergies list after adding
            fetchAllergies();
            return true;
        } catch (error) {
            console.error('Error adding allergy:', error);
            Alert.alert('Error', 'Failed to add allergy');
            return false;
        }
    };

    // Load allergies when component mounts
    useEffect(() => {
        fetchAllergies();
    }, []);

    // Function to render allergy items
    const renderAllergyItem = (allergy, index) => (
        <View key={allergy.id || index} style={styles.allergyItem}>
            <View style={styles.allergyIconContainer}>
                <Image
                    source={require('../assets/allergies.png')}
                    style={styles.allergyIcon}
                />
            </View>
            <View style={styles.allergyContent}>
                <Text style={styles.allergyName}>{allergy.allergen}</Text>
                <Text style={styles.allergyDescription} numberOfLines={2}>
                    Severity: {allergy.severity}
                    {allergy.reaction && `, Reaction: ${allergy.reaction}`}
                </Text>
                {allergy.notes && (
                    <Text style={styles.allergyNotes} numberOfLines={2}>
                        Notes: {allergy.notes}
                    </Text>
                )}
                {allergy.confirmedBy && (
                    <Text style={styles.allergyConfirmedBy} numberOfLines={1}>
                        Confirmed by: {allergy.confirmedBy}
                    </Text>
                )}
            </View>
        </View>
    );

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
                    <Text style={styles.title}>Allergies</Text>
                    <TouchableOpacity onPress={fetchAllergies} style={styles.refreshButton}>
                        <Text style={styles.refreshText}>↻</Text>
                    </TouchableOpacity>
                </View>

                {/* Allergies List */}
                <View style={styles.allergiesList}>
                    {loading ? (
                        <Text style={styles.loadingText}>Loading allergies...</Text>
                    ) : allergies.length > 0 ? (
                        allergies.map(renderAllergyItem)
                    ) : (
                        <View style={styles.noAllergiesContainer}>
                            <Text style={styles.noAllergiesText}>No allergies found</Text>
                            <TouchableOpacity onPress={fetchAllergies} style={styles.retryButton}>
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
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
    refreshButton: {
        padding: 5,
    },
    refreshText: {
        fontSize: 24,
        color: '#2260FF',
        fontWeight: 'bold',
    },
    allergiesList: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    allergyItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        alignItems: 'center',
    },
    allergyIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2260FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    allergyIcon: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
    allergyContent: {
        flex: 1,
    },
    allergyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    allergyDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
        marginBottom: 2,
    },
    allergyNotes: {
        fontSize: 12,
        color: '#888',
        lineHeight: 16,
        marginBottom: 2,
        fontStyle: 'italic',
    },
    allergyConfirmedBy: {
        fontSize: 12,
        color: '#888',
        lineHeight: 16,
        fontStyle: 'italic',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    noAllergiesContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noAllergiesText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#2260FF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    activeIcon: {
        tintColor: 'black',
    },
    inactiveIcon: {
        tintColor: '#FFFFFF',
    },
});

export default AllergiesScreen;