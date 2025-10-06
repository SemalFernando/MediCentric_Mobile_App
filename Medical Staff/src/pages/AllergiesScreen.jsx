import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const AllergiesScreen = ({ onBack }) => {
    const [activePage, setActivePage] = useState('documents');

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
                    <View style={styles.placeholder} />
                </View>

                {/* Allergies List */}
                <View style={styles.allergiesList}>
                    {/* Allergy Item 1 */}
                    <View style={styles.allergyItem}>
                        <View style={styles.allergyIconContainer}>
                            <Image
                                source={require('../assets/allergies.png')}
                                style={styles.allergyIcon}
                            />
                        </View>
                        <View style={styles.allergyContent}>
                            <Text style={styles.allergyName}>Penicillin</Text>
                            <Text style={styles.allergyDescription} numberOfLines={2}>
                                Severity: Moderate
                            </Text>
                        </View>
                    </View>

                    {/* Allergy Item 2 */}
                    <View style={styles.allergyItem}>
                        <View style={styles.allergyIconContainer}>
                            <Image
                                source={require('../assets/allergies.png')}
                                style={styles.allergyIcon}
                            />
                        </View>
                        <View style={styles.allergyContent}>
                            <Text style={styles.allergyName}>Peanuts</Text>
                            <Text style={styles.allergyDescription} numberOfLines={2}>
                                Severity: Severe
                            </Text>
                        </View>
                    </View>

                    {/* Allergy Item 3 */}
                    <View style={styles.allergyItem}>
                        <View style={styles.allergyIconContainer}>
                            <Image
                                source={require('../assets/allergies.png')}
                                style={styles.allergyIcon}
                            />
                        </View>
                        <View style={styles.allergyContent}>
                            <Text style={styles.allergyName}>Dust Mites</Text>
                            <Text style={styles.allergyDescription} numberOfLines={2}>
                                Severity: Mild
                            </Text>
                        </View>
                    </View>

                    {/* Allergy Item 4 */}
                    <View style={styles.allergyItem}>
                        <View style={styles.allergyIconContainer}>
                            <Image
                                source={require('../assets/allergies.png')}
                                style={styles.allergyIcon}
                            />
                        </View>
                        <View style={styles.allergyContent}>
                            <Text style={styles.allergyName}>Shellfish</Text>
                            <Text style={styles.allergyDescription} numberOfLines={2}>
                                Severity: Severe
                            </Text>
                        </View>
                    </View>

                    {/* Allergy Item 5 */}
                    <View style={styles.allergyItem}>
                        <View style={styles.allergyIconContainer}>
                            <Image
                                source={require('../assets/allergies.png')}
                                style={styles.allergyIcon}
                            />
                        </View>
                        <View style={styles.allergyContent}>
                            <Text style={styles.allergyName}>Pollen</Text>
                            <Text style={styles.allergyDescription} numberOfLines={2}>
                                Severity: Moderate
                            </Text>
                        </View>
                    </View>

                    {/* Allergy Item 6 */}
                    <View style={styles.allergyItem}>
                        <View style={styles.allergyIconContainer}>
                            <Image
                                source={require('../assets/allergies.png')}
                                style={styles.allergyIcon}
                            />
                        </View>
                        <View style={styles.allergyContent}>
                            <Text style={styles.allergyName}>Latex</Text>
                            <Text style={styles.allergyDescription} numberOfLines={2}>
                                Severity: Mild
                            </Text>
                        </View>
                    </View>
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
    },
    activeIcon: {
        tintColor: 'black',
    },
    inactiveIcon: {
        tintColor: '#FFFFFF',
    },
});

export default AllergiesScreen;