import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Linking, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import MedBot from '../components/MedBot';

const ReportsScreen = ({ 
    onBack, 
    onNavigateToHome, 
    onNavigateToQRScanner, 
    onNavigateToPrescriptions,
    onNavigateToAllergies,
    onNavigateToDiagnose,
    patientId, // Get patientId from props
    patientData // Get patientData from props
}) => {
    const [activePage, setActivePage] = useState('documents');
    const [selectedReport, setSelectedReport] = useState(null);
    const [labReports, setLabReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configuration - Use dynamic patientId
    const BASE_URL = 'http://172.16.102.245:8083';

    // Fetch lab reports from backend
    const fetchLabReports = async () => {
        // Check if patientId is available
        if (!patientId) {
            setError('Patient ID not available. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            console.log(`Fetching lab reports for patient: ${patientId}`);
            const response = await fetch(`${BASE_URL}/patients/${patientId}/lab-reports`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch lab reports: ${response.status}`);
            }
            
            const reports = await response.json();
            console.log(`Retrieved ${reports.length} lab reports for patient ${patientId}`);
            setLabReports(reports);
        } catch (err) {
            console.error('Error fetching lab reports:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load reports when component mounts or patientId changes
    useEffect(() => {
        if (patientId) {
            fetchLabReports();
        } else {
            setError('No patient ID found. Please log in again.');
            setLoading(false);
        }
    }, [patientId]); // Add patientId as dependency

    const handleHomePress = () => {
        setActivePage('home');
        if (onNavigateToHome) {
            onNavigateToHome();
        }
    };

    const handleQRPress = () => {
        setActivePage('qr');
        if (onNavigateToQRScanner) {
            onNavigateToQRScanner();
        }
    };

    const handlePrescriptionsPress = () => {
        setActivePage('prescription');
        if (onNavigateToPrescriptions) {
            onNavigateToPrescriptions();
        }
    };

    const handleAllergiesPress = () => {
        setActivePage('allergies');
        if (onNavigateToAllergies) {
            onNavigateToAllergies();
        }
    };

    const handleDiagnosePress = () => {
        if (onNavigateToDiagnose) {
            onNavigateToDiagnose();
        }
    };

    // Function to handle report press and open Google Drive file
    const handleReportPress = async (report) => {
        setSelectedReport(report.labReportId);
        
        if (report.fileUrl) {
            try {
                // Check if the URL can be opened
                const supported = await Linking.canOpenURL(report.fileUrl);
                
                if (supported) {
                    // Open the Google Drive URL in the device's browser
                    await Linking.openURL(report.fileUrl);
                } else {
                    Alert.alert(
                        'Cannot Open File',
                        `Unable to open the file URL: ${report.fileUrl}`,
                        [{ text: 'OK' }]
                    );
                }
            } catch (error) {
                console.error('Error opening URL:', error);
                Alert.alert(
                    'Error',
                    'Failed to open the file. Please make sure you have a browser installed.',
                    [{ text: 'OK' }]
                );
            }
        } else {
            Alert.alert(
                'No File Available',
                'This lab report does not have an attached file.',
                [{ text: 'OK' }]
            );
        }
    };

    // Function to format date for display (e.g., "25th October")
    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'Date not available';
        
        try {
            const date = new Date(dateString);
            const day = date.getDate();
            const suffix = getDaySuffix(day);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return `${day}${suffix} ${month} ${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    // Helper function to get day suffix (st, nd, rd, th)
    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    // Function to format timestamp to readable date
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Date not available';
        
        try {
            // Handle the timestamp format: "October 29, 2025 at 1:03:48 PM UTC+5:30"
            const date = new Date(timestamp);
            return formatDateDisplay(date);
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return 'Invalid date';
        }
    };

    // Group reports by date (using labReportDate from API)
    const groupReportsByDate = (reports) => {
        const grouped = {};
        
        reports.forEach(report => {
            // Use labReportDate from the API response
            if (report.labReportDate) {
                const date = new Date(report.labReportDate);
                const dateKey = date.toDateString(); // This creates a unique key for each date
                
                if (!grouped[dateKey]) {
                    grouped[dateKey] = {
                        displayDate: formatTimestamp(report.labReportDate),
                        reports: []
                    };
                }
                grouped[dateKey].reports.push(report);
            }
        });
        
        // Sort dates in descending order (most recent first)
        const sortedGroups = {};
        Object.keys(grouped)
            .sort((a, b) => new Date(b) - new Date(a))
            .forEach(key => {
                sortedGroups[key] = grouped[key];
            });
        
        return sortedGroups;
    };

    // Render loading state
    if (loading) {
        return (
            <ScreenWrapper backgroundColor="#FFFFFF">
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2260FF" />
                    <Text style={styles.loadingText}>Loading lab reports...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    // Render error state
    if (error) {
        return (
            <ScreenWrapper backgroundColor="#FFFFFF">
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error loading lab reports</Text>
                    <Text style={styles.errorSubText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchLabReports}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }

    const groupedReports = groupReportsByDate(labReports);

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
                    <Text style={styles.title}>Lab Reports</Text>
                    <TouchableOpacity onPress={fetchLabReports} style={styles.refreshButton}>
                        <Text style={styles.refreshText}>↻</Text>
                    </TouchableOpacity>
                </View>

                {/* Patient Info Display */}
                {patientId && (
                    <View style={styles.patientInfo}>
                        <Text style={styles.patientIdText}>Patient ID: {patientId}</Text>
                        {patientData?.fullName && (
                            <Text style={styles.patientNameText}>Name: {patientData.fullName}</Text>
                        )}
                    </View>
                )}

                {/* Date and Filter Row - Removed the first date card */}
                <View style={styles.filterRow}>
                    {/* Filter Card only - takes full width */}
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
                    {Object.keys(groupedReports).length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No lab reports found</Text>
                            <Text style={styles.emptyStateSubText}>
                                {patientId 
                                    ? "No lab reports available for your account."
                                    : "Please log in to view your lab reports."
                                }
                            </Text>
                        </View>
                    ) : (
                        Object.entries(groupedReports).map(([dateKey, dateGroup]) => (
                            <View key={dateKey}>
                                {/* Date Card for each group */}
                                <View style={[styles.dateCard, styles.groupDateCard]}>
                                    <Text style={styles.dateText} numberOfLines={1}>
                                        {dateGroup.displayDate}
                                    </Text>
                                </View>

                                {/* Reports for this date */}
                                {dateGroup.reports.map((report, index) => (
                                    <TouchableOpacity 
                                        key={report.labReportId || index}
                                        style={[
                                            styles.reportItem,
                                            selectedReport === report.labReportId && styles.selectedReportItem
                                        ]}
                                        onPress={() => handleReportPress(report)}
                                    >
                                        <View style={styles.reportIconContainer}>
                                            <Image
                                                source={require('../assets/docs-icon2.png')}
                                                style={styles.docIcon}
                                            />
                                            {/* File indicator icon */}
                                            {report.fileUrl && (
                                                <View style={styles.fileIndicator}>
                                                    <Text style={styles.fileIndicatorText}>📎</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.reportContent}>
                                            <Text style={styles.reportName}>
                                                {report.labReportType || 'Lab Report'}
                                            </Text>
                                            <Text style={styles.reportDescription} numberOfLines={2}>
                                                {report.labReportDescription || 'No description available'}
                                            </Text>
                                            {report.labReportResults && (
                                                <Text style={styles.reportResults} numberOfLines={1}>
                                                    Results: {report.labReportResults}
                                                </Text>
                                            )}
                                            {report.category && (
                                                <Text style={styles.reportCategory} numberOfLines={1}>
                                                    Category: {report.category}
                                                </Text>
                                            )}
                                            {report.comments && (
                                                <Text style={styles.reportComments} numberOfLines={1}>
                                                    Comments: {report.comments}
                                                </Text>
                                            )}
                                            <View style={styles.statusContainer}>
                                                <Text style={[
                                                    styles.reportStatus,
                                                    report.status === 'COMPLETED' && styles.statusCompleted,
                                                    report.status === 'PENDING' && styles.statusPending,
                                                    report.status === 'CANCELLED' && styles.statusCancelled
                                                ]}>
                                                    Status: {report.status || 'UNKNOWN'}
                                                </Text>
                                                {report.fileUrl && (
                                                    <Text style={styles.viewFileText}>Tap to view file →</Text>
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))
                    )}
                </View>

                {/* Navigation Bar */}
                <View style={styles.thirdRow}>
                    <View style={styles.navigationCard}>
                        {/* Home Icon */}
                        <TouchableOpacity
                            style={styles.navIcon}
                            onPress={handleHomePress}
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
                            onPress={handleQRPress}
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
                            onPress={handlePrescriptionsPress}
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

            {/* MedBot Floating Button */}
            <MedBot onDiagnosePress={handleDiagnosePress} />
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
    refreshButton: {
        padding: 5,
    },
    refreshText: {
        fontSize: 24,
        color: '#2260FF',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        flex: 1,
    },
    patientInfo: {
        paddingHorizontal: 20,
        marginBottom: 10,
        alignItems: 'center',
    },
    patientIdText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 2,
    },
    patientNameText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
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
        paddingHorizontal: 16,
        paddingVertical: 10,
        minWidth: 120,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    groupDateCard: {
        marginTop: 5,
        width: 130,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    dateText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'left',
        width: '100%',
        includeFontPadding: false,
        textAlignVertical: 'center',
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
        width: 24,
        height: 24,
        tintColor: '#2260FF',
    },
    reportsList: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    reportItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        alignItems: 'center',
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
        position: 'relative',
    },
    docIcon: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
    fileIndicator: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileIndicatorText: {
        fontSize: 10,
        color: '#FFFFFF',
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
        marginBottom: 4,
    },
    reportResults: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        marginBottom: 2,
    },
    reportCategory: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    reportComments: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    reportStatus: {
        fontSize: 12,
        fontWeight: '500',
    },
    statusCompleted: {
        color: '#4CAF50',
    },
    statusPending: {
        color: '#FF9800',
    },
    statusCancelled: {
        color: '#F44336',
    },
    viewFileText: {
        fontSize: 10,
        color: '#2260FF',
        fontStyle: 'italic',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#2260FF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#FF0000',
        fontWeight: '600',
        marginBottom: 10,
    },
    errorSubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#2260FF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyStateSubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default ReportsScreen;