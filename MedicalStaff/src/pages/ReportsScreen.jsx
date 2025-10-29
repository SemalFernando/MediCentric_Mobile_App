import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';

const ReportsScreen = ({
    onBack,
    onNavigateToHome,
    onNavigateToInitialHome,
    onNavigateToQRScanner,
    onNavigateToPrescriptions,
    onNavigateToAllergies,
    patientData,
    route
}) => {
    const [activePage, setActivePage] = useState('documents');
    const [selectedReport, setSelectedReport] = useState(null);
    const [patientReports, setPatientReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [groupedReports, setGroupedReports] = useState({});

    // Get patient data from props or route params
    const patientDataFromRoute = route?.params?.patientData;
    const actualPatientData = patientData || patientDataFromRoute;

    useEffect(() => {
        console.log('ReportsScreen - Received patient data:', actualPatientData);

        if (actualPatientData?.patientId) {
            // Fetch lab reports from lab service (port 8083)
            fetchPatientLabReports(actualPatientData.patientId);
        } else {
            // No patient data, clear reports
            setPatientReports([]);
            setGroupedReports({});
        }
    }, [actualPatientData]);

    // Function to fetch patient lab reports from lab service (port 8083)
    const fetchPatientLabReports = async (patientId) => {
        try {
            setIsLoading(true);
            console.log('Fetching lab reports for patient:', patientId);

            const response = await fetch(`http://192.168.8.102:8083/patients/${patientId}/lab-reports`);

            if (response.ok) {
                const labReports = await response.json();
                console.log('Fetched lab reports:', labReports);
                setPatientReports(labReports);
                groupReportsByDate(labReports);
            } else {
                console.log('No lab reports found for patient');
                setPatientReports([]);
                setGroupedReports({});
            }
        } catch (error) {
            console.error('Error fetching lab reports:', error);
            setPatientReports([]);
            setGroupedReports({});
        } finally {
            setIsLoading(false);
        }
    };

    // Group reports by date - using labReportDate
    const groupReportsByDate = (reports) => {
        const grouped = {};

        reports.forEach(report => {
            // Use labReportDate field from your data
            const reportDate = report.labReportDate || report.date || report.createdAt || new Date().toISOString().split('T')[0];
            const formattedDate = formatDateForDisplay(reportDate);

            if (!grouped[formattedDate]) {
                grouped[formattedDate] = [];
            }
            grouped[formattedDate].push(report);
        });

        console.log('Grouped lab reports:', grouped);
        setGroupedReports(grouped);
    };

    // Format date to "26th April" format
    const formatDateForDisplay = (dateString) => {
        try {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });

            // Add ordinal suffix to day
            const getOrdinalSuffix = (day) => {
                if (day > 3 && day < 21) return 'th';
                switch (day % 10) {
                    case 1: return 'st';
                    case 2: return 'nd';
                    case 3: return 'rd';
                    default: return 'th';
                }
            };

            return `${day}${getOrdinalSuffix(day)} ${month}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Unknown Date';
        }
    };

    // Sort dates in descending order (newest first)
    const getSortedDates = () => {
        return Object.keys(groupedReports).sort((a, b) => {
            try {
                // Convert display dates back to proper dates for sorting
                const dateA = new Date(a.replace(/(\d+)(st|nd|rd|th)/, '$1'));
                const dateB = new Date(b.replace(/(\d+)(st|nd|rd|th)/, '$1'));
                return dateB - dateA;
            } catch (error) {
                return 0;
            }
        });
    };

    // Get test type display name - using labReportType from your form
    const getTestTypeDisplay = (report) => {
        return report.labReportType || 'Lab Report';
    };

    // Get test description - using labReportDescription and comments
    const getTestDescription = (report, date) => {
        if (report.labReportDescription) return report.labReportDescription;
        if (report.comments) return report.comments;
        if (report.description) return report.description;

        let description = `Lab report from ${date}`;
        if (report.status) description += ` - Status: ${report.status}`;

        return description;
    };

    // Get result display - using labReportResults
    const getResultDisplay = (report) => {
        if (report.labReportResults) return `Result: ${report.labReportResults}`;
        if (report.result) return `Result: ${report.result}`;
        if (report.status) return `Status: ${report.status}`;
        return null;
    };

    const handleHomePress = () => {
        setActivePage('home');

        // Conditional navigation based on whether patient is scanned
        if (actualPatientData) {
            // If patient is scanned, go to patient homepage
            if (onNavigateToHome) {
                onNavigateToHome();
            }
        } else {
            // If no patient scanned, go to initial homepage
            if (onNavigateToInitialHome) {
                onNavigateToInitialHome();
            }
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

    const handleReportPress = (reportId) => {
        setSelectedReport(reportId);
        // Here you can add navigation to detailed report view
        console.log('Selected report:', reportId);
    };

    // Render loading state
    if (isLoading) {
        return (
            <ScreenWrapper
                backgroundColor="#FFFFFF"
                statusBarStyle="dark-content"
                barStyle="dark-content"
                translucent={false}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2260FF" />
                    <Text style={styles.loadingText}>Loading lab reports...</Text>
                </View>
            </ScreenWrapper>
        );
    }

    // Render empty state when no patient is selected
    if (!actualPatientData) {
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
                        <View style={styles.placeholder} />
                    </View>

                    {/* Empty State */}
                    <View style={styles.emptyContainer}>
                        <Image
                            source={require('../assets/docs-icon2.png')}
                            style={styles.emptyIcon}
                        />
                        <Text style={styles.emptyTitle}>No Patient Selected</Text>
                        <Text style={styles.emptyDescription}>
                            Scan a patient's QR code to view their lab reports
                        </Text>
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
            <ScrollView style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Lab Reports</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Date and Filter Row */}
                <View style={styles.filterRow}>
                    {/* Date Card - Show first date if available */}
                    {getSortedDates().length > 0 && (
                        <View style={styles.dateCard}>
                            <Text style={styles.dateText}>{getSortedDates()[0]}</Text>
                        </View>
                    )}

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
                    {getSortedDates().length > 0 ? (
                        getSortedDates().map((date, dateIndex) => (
                            <View key={date}>
                                {/* Date Card for each group */}
                                {dateIndex > 0 && (
                                    <View style={[styles.dateCard, styles.secondDateCard]}>
                                        <Text style={styles.dateText}>{date}</Text>
                                    </View>
                                )}

                                {/* Spacing under date card */}
                                {dateIndex > 0 && <View style={styles.dateCardSpacing} />}

                                {/* Reports for this date */}
                                {groupedReports[date].map((report, reportIndex) => {
                                    const resultDisplay = getResultDisplay(report);
                                    return (
                                        <TouchableOpacity
                                            key={report.labReportId || report.id || `report-${reportIndex}`}
                                            style={[
                                                styles.reportItem,
                                                selectedReport === (report.labReportId || report.id) && styles.selectedReportItem
                                            ]}
                                            onPress={() => handleReportPress(report.labReportId || report.id)}
                                        >
                                            <View style={styles.reportIconContainer}>
                                                <Image
                                                    source={require('../assets/docs-icon2.png')}
                                                    style={styles.docIcon}
                                                />
                                            </View>
                                            <View style={styles.reportContent}>
                                                <Text style={styles.reportName}>
                                                    {getTestTypeDisplay(report)}
                                                </Text>
                                                <Text style={styles.reportDescription} numberOfLines={2}>
                                                    {getTestDescription(report, date)}
                                                </Text>
                                                {resultDisplay && (
                                                    <Text style={styles.reportResult}>
                                                        {resultDisplay}
                                                    </Text>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))
                    ) : (
                        // Empty state when patient has no reports
                        <View style={styles.emptyContainer}>
                            <Image
                                source={require('../assets/docs-icon2.png')}
                                style={styles.emptyIcon}
                            />
                            <Text style={styles.emptyTitle}>No Lab Reports Available</Text>
                            <Text style={styles.emptyDescription}>
                                No lab reports found for {actualPatientData.fullName || 'this patient'}
                            </Text>
                        </View>
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
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#2260FF',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 50,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        tintColor: '#CAD6FF',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
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
        height: 15,
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
        width: 24,
        height: 24,
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
    reportResult: {
        fontSize: 12,
        color: '#2260FF',
        fontWeight: '500',
        marginTop: 4,
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