import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const ReportsScreen = ({ onBack }) => {
    const [activePage, setActivePage] = useState('documents');
    const [selectedReport, setSelectedReport] = useState(null);

    const handleReportPress = (reportId) => {
        setSelectedReport(reportId);
        // Here you can add navigation to detailed report view
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
                    <Text style={styles.title}>Reports</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Date and Filter Row */}
                <View style={styles.filterRow}>
                    {/* Date Card */}
                    <View style={styles.dateCard}>
                        <Text style={styles.dateText}>26th April</Text>
                    </View>

                    {/* Filter Card */}
                    <View style={styles.filterCard}>
                        <Text style={styles.filterPlaceholder}>filter reports...</Text>
                        <Image
                            source={require('../assets/drop-down.png')}
                            style={styles.dropdownIcon}
                        />
                    </View>
                </View>

                {/* Reports List */}
                <View style={styles.reportsList}>
                    {/* Report Item 1 */}
                    <TouchableOpacity 
                        style={[
                            styles.reportItem,
                            selectedReport === 1 && styles.selectedReportItem
                        ]}
                        onPress={() => handleReportPress(1)}
                    >
                        <View style={styles.reportIconContainer}>
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={styles.docIcon}
                            />
                        </View>
                        <View style={styles.reportContent}>
                            <Text style={styles.reportName}>Sugar (Glucose) Report</Text>
                            <Text style={styles.reportDescription} numberOfLines={2}>
                                Measures blood sugar levels to check for diabetes or prediabetes.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Report Item 2 */}
                    <TouchableOpacity 
                        style={[
                            styles.reportItem,
                            selectedReport === 2 && styles.selectedReportItem
                        ]}
                        onPress={() => handleReportPress(2)}
                    >
                        <View style={styles.reportIconContainer}>
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={styles.docIcon}
                            />
                        </View>
                        <View style={styles.reportContent}>
                            <Text style={styles.reportName}>Complete Blood Count (CBC)</Text>
                            <Text style={styles.reportDescription} numberOfLines={2}>
                                Evaluates overall health and detects various disorders like anemia, infection.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Report Item 3 */}
                    <TouchableOpacity 
                        style={[
                            styles.reportItem,
                            selectedReport === 3 && styles.selectedReportItem
                        ]}
                        onPress={() => handleReportPress(3)}
                    >
                        <View style={styles.reportIconContainer}>
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={styles.docIcon}
                            />
                        </View>
                        <View style={styles.reportContent}>
                            <Text style={styles.reportName}>Lipid Panel</Text>
                            <Text style={styles.reportDescription} numberOfLines={2}>
                                Measures cholesterol levels and triglycerides to assess heart disease risk.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Second Date Card */}
                    <View style={[styles.dateCard, styles.secondDateCard]}>
                        <Text style={styles.dateText}>19th April</Text>
                    </View>

                    {/* Spacing under second date card */}
                    <View style={styles.dateCardSpacing} />

                    {/* Report Item 4 */}
                    <TouchableOpacity 
                        style={[
                            styles.reportItem,
                            selectedReport === 4 && styles.selectedReportItem
                        ]}
                        onPress={() => handleReportPress(4)}
                    >
                        <View style={styles.reportIconContainer}>
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={styles.docIcon}
                            />
                        </View>
                        <View style={styles.reportContent}>
                            <Text style={styles.reportName}>Liver Function Test</Text>
                            <Text style={styles.reportDescription} numberOfLines={2}>
                                Checks liver health by measuring enzymes, proteins, and substances.
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Report Item 5 */}
                    <TouchableOpacity 
                        style={[
                            styles.reportItem,
                            selectedReport === 5 && styles.selectedReportItem
                        ]}
                        onPress={() => handleReportPress(5)}
                    >
                        <View style={styles.reportIconContainer}>
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={styles.docIcon}
                            />
                        </View>
                        <View style={styles.reportContent}>
                            <Text style={styles.reportName}>Thyroid Function Test</Text>
                            <Text style={styles.reportDescription} numberOfLines={2}>
                                Measures thyroid hormone levels to diagnose thyroid disorders.
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Navigation Bar */}
                <View style={styles.thirdRow}>
                    <View style={styles.navigationCard}>
                        {/* Home Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('home')}
                        >
                            <Image
                                source={
                                    activePage === 'home'
                                        ? require('../assets/home-icon1.png')
                                        : require('../assets/home-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'home' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>

                        {/* QR Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('qr')}
                        >
                            <Image
                                source={
                                    activePage === 'qr'
                                        ? require('../assets/qr-icon1.png')
                                        : require('../assets/qr-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'qr' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>

                        {/* Prescription Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('prescription')}
                        >
                            <Image
                                source={
                                    activePage === 'prescription'
                                        ? require('../assets/prescription-icon1.png')
                                        : require('../assets/prescription-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'prescription' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>

                        {/* Documents Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={() => setActivePage('documents')}
                        >
                            <Image
                                source={
                                    activePage === 'documents'
                                        ? require('../assets/docs-icon1.png')
                                        : require('../assets/docs-icon2.png')
                                }
                                style={[
                                    styles.navIconImage,
                                    activePage === 'documents' ? styles.activeIcon : styles.inactiveIcon
                                ]}
                            />
                        </TouchableOpacity>
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
        marginBottom: 10, // Reduced from 20 to decrease gap
        marginTop: 30,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
    },
    backText: {
        fontSize: 50,
        color: '#2260FF',
        fontWeight: 'regular', // Changed from '100' to match login screen
        marginTop: 0, // Removed negative margin to match login screen
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 24, // Changed from 40 to match login screen (24px space)
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: -10,
        marginBottom: 15,
        gap: 10,
    },
    dateCard: {
        backgroundColor: '#CAD6FF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondDateCard: {
        marginTop: 5,
        width: 120,
        alignSelf: 'flex-start',
    },
    dateCardSpacing: {
        height: 15, // Added space under second date card
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
    },
    filterCard: {
        backgroundColor: '#CAD6FF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: 180,
    },
    filterPlaceholder: {
        fontSize: 16,
        color: '#2261ff74',
        fontWeight: '500',
    },
    dropdownIcon: {
        width: 24, // Increased from 20px
        height: 24, // Increased from 20px
        tintColor: '#2260FF',
    },
    reportsList: {
        paddingHorizontal: 20,
        marginBottom: -2,
    },
    reportItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        alignItems: 'center', // Changed from 'flex-start' to center vertically
    },
    selectedReportItem: {
        backgroundColor: '#CAD6FF',
        borderColor: '#2260FF',
    },
    reportIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2260FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        // Already left-aligned and centered
    },
    docIcon: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
    reportContent: {
        flex: 1,
    },
    reportName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    reportDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    thirdRow: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        alignItems: 'center',
    },
    navigationCard: {
        width: 298,
        height: 48,
        backgroundColor: '#2260FF',
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
    },
    activeIcon: {
        tintColor: 'black',
    },
    inactiveIcon: {
        tintColor: '#FFFFFF',
    },
});

export default ReportsScreen;