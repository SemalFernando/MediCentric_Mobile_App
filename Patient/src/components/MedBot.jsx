import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const MedBot = ({ patientId, onPress, onDiagnosePress }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    const BASE_URL = 'http://10.185.72.247:8088';  // Update to your medbot URL/port

    const handleMedBotPress = () => {
        console.log('MedBot pressed - Patient ID:', patientId); // Debug log
        setIsPopupVisible(true);
        setPredictionResult(null);
        if (onPress) {
            onPress();
        }
    };

    const handleDiagnosePress = async () => {
        console.log('Diagnose pressed - Patient ID:', patientId); // Debug log
        
        if (!patientId) {
            Alert.alert('Error', 'No patient ID available. Please log in.');
            return;
        }
        
        setIsLoading(true);
        try {
            console.log('Making prediction request for patient:', patientId);
            const response = await fetch(`${BASE_URL}/api/predict?patientId=${patientId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No health records found. Please complete the health form with a medical professional first.');
                }
                throw new Error(`Prediction request failed with status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Prediction result:', result);
            setPredictionResult(result);

            // Call the onDiagnosePress callback with the result
            if (onDiagnosePress) {
                onDiagnosePress(result);
            }
        } catch (error) {
            console.error('Diagnosis error:', error);
            if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
                Alert.alert('Connection Error', 'Cannot connect to MedBot service. Please check if the service is running.');
            } else {
                Alert.alert('Diagnosis Error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        setPredictionResult(null);
    };

    const renderResult = () => {
        if (!predictionResult) return null;

        const isHighRisk = predictionResult.risk === 1;
        const probability = (predictionResult.probability * 100).toFixed(1);
        const explanation = predictionResult.explanation || 'No explanation provided.';

        return (
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Diagnosis Result:</Text>
                <View style={[styles.riskIndicator, isHighRisk ? styles.highRisk : styles.lowRisk]}>
                    <Text style={styles.riskText}>{isHighRisk ? 'HIGH RISK' : 'LOW RISK'}</Text>
                </View>
                <Text style={styles.probabilityText}>Confidence: {probability}%</Text>
                <View style={styles.explanationContainer}>
                    <Text style={styles.explanationTitle}>Key Factors:</Text>
                    <Text style={styles.explanationText}>{explanation}</Text>
                </View>
                <Text style={styles.recommendationText}>
                    {isHighRisk
                        ? 'Recommendation: Please consult a cardiologist immediately.'
                        : 'Recommendation: Maintain regular check-ups and healthy lifestyle.'
                    }
                </Text>
            </View>
        );
    };

    return (
        <>
            <TouchableOpacity
                style={styles.medBotContainer}
                onPress={handleMedBotPress}
                activeOpacity={0.8}
            >
                <View style={styles.medBotSquare}>
                    <View style={styles.whiteCircle}>
                        <View style={styles.blueCircle}>
                            <Image
                                source={require('../assets/medbot-icon.png')}
                                style={styles.medBotIcon}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                visible={isPopupVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closePopup}
            >
                <View style={styles.modalOverlay}>
                    {/* Popup Container */}
                    <View style={styles.popupWrapper}>
                        {/* Close Button - Positioned close to popup */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closePopup}
                            activeOpacity={0.7}
                        >
                            <View style={styles.closeButtonCircle}>
                                <View style={styles.closeButtonInnerCircle}>
                                    <Image
                                        source={require('../assets/medbot-icon.png')}
                                        style={styles.closeButtonIcon}
                                    />
                                </View>
                            </View>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>

                        {/* Popup Container */}
                        <View style={styles.popupContainer}>
                            {/* Header with MedBot Icon and Text */}
                            <View style={styles.popupHeader}>
                                <View style={styles.popupIconContainer}>
                                    <View style={styles.popupWhiteCircle}>
                                        <View style={styles.popupBlueCircle}>
                                            <Image
                                                source={require('../assets/medbot-icon.png')}
                                                style={styles.popupMedBotIcon}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.popupTextContainer}>
                                    <Text style={styles.popupTitle}>Hey! I'm your Med Bot</Text>
                                    <Text style={styles.popupSubtitle}>Ready to check your heart health?</Text>
                                </View>
                            </View>

                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#2260FF" />
                                    <Text style={styles.loadingText}>Analyzing your health data...</Text>
                                </View>
                            ) : (
                                <>
                                    {/* Only show Diagnose button when there are no results */}
                                    {!predictionResult && (
                                        <TouchableOpacity 
                                            style={[
                                                styles.diagnoseButton, 
                                                !patientId && styles.disabledButton
                                            ]} 
                                            onPress={handleDiagnosePress}
                                            disabled={!patientId}
                                        >
                                            <Text style={styles.diagnoseButtonText}>
                                                {patientId ? 'Diagnose' : 'Please Login First'}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    
                                    {renderResult()}
                                    
                                    {/* Only show New Diagnosis button when there are results */}
                                    {predictionResult && (
                                        <TouchableOpacity style={styles.newDiagnosisButton} onPress={handleDiagnosePress}>
                                            <Text style={styles.newDiagnosisButtonText}>New Diagnosis</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    medBotContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    medBotSquare: {
        width: 80,
        height: 80,
        backgroundColor: '#2260FF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    whiteCircle: {
        width: 60,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blueCircle: {
        width: 48,
        height: 48,
        backgroundColor: '#2260FF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    medBotIcon: {
        width: 28,
        height: 28,
        tintColor: '#FFFFFF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupWrapper: {
        alignItems: 'center',
        width: '100%',
    },
    // Close Button Styles - Enhanced with white border
    closeButton: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 10,
        zIndex: 1001,
    },
    closeButtonCircle: {
        width: 50,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 3,
        borderColor: '#2260FF',
    },
    closeButtonInnerCircle: {
        width: 36,
        height: 36,
        backgroundColor: '#2260FF',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonIcon: {
        width: 18,
        height: 18,
        tintColor: '#FFFFFF',
    },
    closeButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        backgroundColor: '#2260FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    popupContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#2260FF',
        padding: 20,
        margin: 20,
        width: '80%',
        maxWidth: 350,
    },
    popupHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    popupIconContainer: {
        marginRight: 12,
    },
    popupWhiteCircle: {
        width: 50,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2260FF',
    },
    popupBlueCircle: {
        width: 36,
        height: 36,
        backgroundColor: '#2260FF',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupMedBotIcon: {
        width: 20,
        height: 20,
        tintColor: '#FFFFFF',
    },
    popupTextContainer: {
        flex: 1,
    },
    popupTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 4,
    },
    popupSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000000',
    },
    // Loading Styles
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#2260FF',
        fontWeight: '500',
    },
    // Result Styles
    resultContainer: {
        backgroundColor: '#F8F9FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E9F9',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 12,
        textAlign: 'center',
    },
    riskIndicator: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
        alignItems: 'center',
    },
    highRisk: {
        backgroundColor: '#FFE6E6',
        borderWidth: 2,
        borderColor: '#FF4444',
    },
    lowRisk: {
        backgroundColor: '#E6FFE6',
        borderWidth: 2,
        borderColor: '#44FF44',
    },
    riskText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    probabilityText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
        marginBottom: 12,
    },
    explanationContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E9F9',
    },
    explanationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2260FF',
        marginBottom: 4,
    },
    explanationText: {
        fontSize: 12,
        color: '#666666',
        lineHeight: 16,
    },
    recommendationText: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    diagnoseButton: {
        backgroundColor: '#E5E9F9',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CAD6FF',
    },
    disabledButton: {
        backgroundColor: '#F0F0F0',
        borderColor: '#DDD',
    },
    diagnoseButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2260FF',
        textAlign: 'center',
    },
    newDiagnosisButton: {
        backgroundColor: '#2260FF',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1a4fd8',
    },
    newDiagnosisButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default MedBot;