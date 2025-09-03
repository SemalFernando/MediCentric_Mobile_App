import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            {/* First Row - White Background */}
            <View style={styles.firstRow}>
                {/* First Horizontal Row: Profile + Icons */}
                <View style={styles.firstHorizontalRow}>
                    {/* Left Section: Profile and Welcome */}
                    <View style={styles.profileSection}>
                        <Image
                            source={require('../assets/profile-pic.png')}
                            style={styles.profilePic}
                        />
                        <View style={styles.welcomeText}>
                            <Text style={styles.welcomeBack}>Welcome back!</Text>
                            <Text style={styles.doctorName}>Dr. John Doe</Text>
                        </View>
                    </View>

                    {/* Right Section: Notification and Settings Icons */}
                    <View style={styles.iconsSection}>
                        <TouchableOpacity style={styles.iconCircle}>
                            <Image
                                source={require('../assets/notification-icon.png')}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconCircle}>
                            <Image
                                source={require('../assets/settings-icon.png')}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Second Horizontal Row: Doctors, Favorite + Search */}
                <View style={styles.secondHorizontalRow}>
                    {/* Left Section: Doctors and Favorite with icons above text */}
                    <View style={styles.linksSection}>
                        <TouchableOpacity style={styles.linkItem}>
                            <Image
                                source={require('../assets/doctors-icon.png')}
                                style={styles.linkIcon}
                            />
                            <Text style={styles.linkText}>Doctors</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkItem}>
                            <Image
                                source={require('../assets/favorite-icon.png')}
                                style={styles.linkIcon}
                            />
                            <Text style={styles.linkText}>Favorite</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Right Section: Search Bar */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchBar}>
                            <Image
                                source={require('../assets/search-icon.png')}
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="search..."
                                placeholderTextColor="#809CFF"
                            />
                        </View>
                    </View>
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Patient Summary Title */}
                <Text style={styles.patientSummaryTitle}>Patient Summary:</Text>
            </View>

            {/* Second Row - CAD6FF Background */}
            <View style={styles.secondRow}>
                <View style={styles.cardsContainer}>
                    {/* Patient Name Card */}
                    <View style={styles.patientNameCard}>
                        <Text style={styles.patientNameLabel}>Patient Name:</Text>
                        <Text style={styles.patientNameValue}>Mr. Ryan Ravikumar</Text>
                    </View>

                    {/* Blood Type and Recent Lab Reports */}
                    <View style={styles.row}>
                        {/* Blood Type Card */}
                        <View style={styles.bloodTypeCard}>
                            <Text style={styles.bloodTypeLabel}>Blood Type:</Text>
                            <Text style={styles.bloodTypeValue}>O+</Text>
                        </View>

                        {/* Recent Lab Reports Card */}
                        <View style={styles.labReportsCard}>
                            <Text style={styles.cardTitleCenter}>Recent Lab Reports</Text>
                            <View style={styles.cardDivider} />
                            <View style={styles.reportItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.reportText}>Complete Blood Count (CBC) Date: July 10, 2025 - Status: Normal</Text>
                            </View>
                            <View style={styles.reportItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.reportText}>Lipid Panel Date: June 25, 2025 - Status: Normal</Text>
                            </View>
                            <View style={styles.reportItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.reportText}>Glucose Test Date: June 15, 2025 - Status: Elevated</Text>
                            </View>
                            <View style={styles.reportItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.reportText}>Thyroid Function Date: May 30, 2025 - Status: Normal</Text>
                            </View>
                            <TouchableOpacity style={styles.viewMoreButton}>
                                <Text style={styles.viewMoreText}>view more</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Allergies and Empty Space */}
                    <View style={styles.row}>
                        {/* Allergies Card */}
                        <View style={styles.allergiesCard}>
                            <Text style={styles.cardTitleCenter}>Allergies</Text>
                            <View style={styles.cardDivider} />
                            <View style={styles.allergyItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.allergyText}>Penicillin, Severity: Moderate</Text>
                            </View>
                            <View style={styles.allergyItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.allergyText}>Peanuts, Severity: Severe</Text>
                            </View>
                            <View style={styles.allergyItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.allergyText}>Dust Mites, Severity: Mild</Text>
                            </View>
                            <View style={styles.allergyItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.allergyText}>Shellfish, Severity: Moderate</Text>
                            </View>
                            <TouchableOpacity style={styles.viewMoreButton}>
                                <Text style={styles.viewMoreText}>view more</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Empty Space */}
                        <View style={styles.emptySpace} />
                    </View>

                    {/* Current Medication Card */}
                    <View style={styles.medicationCard}>
                        <Text style={styles.cardTitleCenter}>Current Medication</Text>
                        <View style={styles.cardDivider} />
                        <View style={styles.medicationItem}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.medicationText}>Last Prescription: July 10, 2025</Text>
                        </View>
                        <View style={styles.subMedication}>
                            <Text style={styles.subBullet}>-</Text>
                            <Text style={styles.subMedicationText}>Ibuprofen</Text>
                        </View>
                        <View style={styles.subMedication}>
                            <Text style={styles.subBullet}>-</Text>
                            <Text style={styles.subMedicationText}>Amoxicillin</Text>
                        </View>
                        <View style={styles.subMedication}>
                            <Text style={styles.subBullet}>-</Text>
                            <Text style={styles.subMedicationText}>Metformin</Text>
                        </View>
                        <TouchableOpacity style={styles.medicationViewMore}>
                            <Text style={styles.viewMoreText}>view more</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Third Row - Navigation */}
            <View style={styles.thirdRow}>
                <View style={styles.navigationCard}>
                    <TouchableOpacity style={styles.navIcon}>
                        <Image source={require('../assets/home-icon1.png')} style={styles.navIconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Image source={require('../assets/qr-icon1.png')} style={styles.navIconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Image source={require('../assets/profile-icon1.png')} style={styles.navIconImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Image source={require('../assets/docs-icon1.png')} style={styles.navIconImage} />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    firstRow: {
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    firstHorizontalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    welcomeText: {
        flex: 1,
    },
    welcomeBack: {
        fontSize: 18,
        fontWeight: '400',
        color: '#2260FF',
        marginBottom: 2,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    iconsSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CAD6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: '#000000',
    },
    secondHorizontalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    linksSection: {
        flexDirection: 'row',
        flex: 1,
    },
    linkItem: {
        alignItems: 'center',
        marginRight: 30,
    },
    linkIcon: {
        width: 20,
        height: 20,
        marginBottom: 5,
        tintColor: '#2260FF',
    },
    linkText: {
        fontSize: 12,
        color: '#2260FF',
        fontWeight: '600',
        textAlign: 'center',
    },
    searchSection: {
        justifyContent: 'flex-end',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CAD6FF',
        borderRadius: 20,
        paddingHorizontal: 15,
        height: 40,
        width: 200,
    },
    searchIcon: {
        width: 16,
        height: 16,
        marginRight: 8,
        tintColor: '#2260FF',
    },
    searchInput: {
        flex: 1,
        fontSize: 12,
        color: '#2260FF',
    },
    divider: {
        height: 1,
        backgroundColor: '#2261ff72',
        marginBottom: 15,
    },
    patientSummaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'left',
    },
    secondRow: {
        backgroundColor: '#CAD6FF',
        padding: 20,
    },
    cardsContainer: {
        marginBottom: 10,
    },
    patientNameCard: {
        width: '100%',
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        alignSelf: 'center',
    },
    patientNameLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 2,
    },
    patientNameValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 15,
    },
    bloodTypeCard: {
        width: 130,
        height: 80,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    bloodTypeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 5,
        textAlign: 'center',
    },
    bloodTypeValue: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
    },
    labReportsCard: {
        width: 179,
        height: 268,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'space-between',
    },
    allergiesCard: {
        width: 130,
        height: 214,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'space-between',
    },
    emptySpace: {
        width: 179,
        height: 214,
    },
    medicationCard: {
        width: '100%',
        height: 150,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    cardTitleCenter: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 8,
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#DDD',
        marginBottom: 10,
    },
    reportItem: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    allergyItem: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    medicationItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    subMedication: {
        flexDirection: 'row',
        marginLeft: 12,
        marginBottom: 3,
    },
    bullet: {
        fontSize: 10,
        color: '#2260FF',
        marginRight: 6,
        marginTop: 2,
    },
    subBullet: {
        fontSize: 10,
        color: '#2260FF',
        marginRight: 6,
    },
    reportText: {
        fontSize: 10,
        color: '#070707',
        flex: 1,
        lineHeight: 14,
    },
    allergyText: {
        fontSize: 10,
        color: '#070707',
        flex: 1,
        lineHeight: 14,
    },
    medicationText: {
        fontSize: 10,
        color: '#070707',
        lineHeight: 14,
    },
    subMedicationText: {
        fontSize: 10,
        color: '#070707',
        lineHeight: 14,
    },
    viewMoreButton: {
        backgroundColor: '#2260FF',
        borderRadius: 6,
        padding: 6,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
    },
    medicationViewMore: {
        backgroundColor: '#2260FF',
        borderRadius: 6,
        padding: 6,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
    },
    viewMoreText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    thirdRow: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        alignItems: 'center',
    },
    navigationCard: {
        width: 298,
        height: 48,
        backgroundColor: '#ECF1FF',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navIcon: {
        padding: 10,
    },
    navIconImage: {
        width: 24,
        height: 24,
        tintColor: '#2260FF',
    },
});

export default HomeScreen;