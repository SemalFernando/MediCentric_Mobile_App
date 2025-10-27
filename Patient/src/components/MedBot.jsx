import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Modal, StyleSheet, ActivityIndicator, Alert } from 'react-native';

const MedBot = ({ onPress, onDiagnosePress }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    const BASE_URL = 'http://192.168.1.4:8088';

    const handleMedBotPress = () => {
        setIsPopupVisible(true);
        setPredictionResult(null); // Reset previous results
        if (onPress) {
            onPress();
        }
    };

    const handleDiagnosePress = async () => {
        setIsLoading(true);
        try {
            // First, check if the service is healthy
            const healthResponse = await fetch(`${BASE_URL}/api/health`);

            if (!healthResponse.ok) {
                throw new Error('Service is not healthy');
            }

            // Prepare the patient data (using your high-risk example)
            const patientData = {
                "age": 65,
                "thalach": 100,
                "oldpeak": 3.5,
                "trestbps": 150,
                "bmi": 30,
                "chol": 280,
                "ca": 2,
                "thal": 3,
                "restecg": 1,
                "cp": 2
            };

            // const patientData = {
            //     "age": 40,
            //     "thalach": 160,
            //     "oldpeak": 0.5,
            //     "trestbps": 120,
            //     "bmi": 22,
            //     "chol": 180,
            //     "ca": 0,
            //     "thal": 6,
            //     "restecg": 0,
            //     "cp": 1
            // };

            // Make the prediction request
            const predictionResponse = await fetch(`${BASE_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData)
            });

            if (!predictionResponse.ok) {
                throw new Error('Prediction request failed');
            }

            const result = await predictionResponse.json();
            setPredictionResult(result);

            // Call the onDiagnosePress callback with the result
            if (onDiagnosePress) {
                onDiagnosePress(result);
            }

        } catch (error) {
            console.error('Diagnosis error:', error);
            Alert.alert(
                'Diagnosis Error',
                `Unable to connect to diagnosis service: ${error.message}`,
                [{ text: 'OK' }]
            );
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

        // Using your actual backend response format
        const isHighRisk = predictionResult.risk === 1;
        const probability = predictionResult.probability ? (predictionResult.probability * 100).toFixed(1) : 'N/A';
        const explanation = predictionResult.explanation || 'No explanation provided.';

        return (
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Diagnosis Result:</Text>
                <View style={[
                    styles.riskIndicator,
                    isHighRisk ? styles.highRisk : styles.lowRisk
                ]}>
                    <Text style={styles.riskText}>
                        {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
                    </Text>
                </View>
                <Text style={styles.probabilityText}>
                    Confidence: {probability}%
                </Text>
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
                                    <Text style={styles.popupTitle}>Hey!, I'm your Medi Bot...</Text>
                                    <Text style={styles.popupSubtitle}>Would you like me to:</Text>
                                </View>
                            </View>

                            {/* Loading Indicator */}
                            {isLoading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#2260FF" />
                                    <Text style={styles.loadingText}>Analyzing patient data...</Text>
                                </View>
                            )}

                            {/* Diagnosis Result */}
                            {renderResult()}

                            {/* Diagnose Button - Hidden when loading or when result is shown */}
                            {!isLoading && !predictionResult && (
                                <TouchableOpacity
                                    style={styles.diagnoseButton}
                                    onPress={handleDiagnosePress}
                                >
                                    <Text style={styles.diagnoseButtonText}>Diagnose Patient Illnesses</Text>
                                </TouchableOpacity>
                            )}

                            {/* New Diagnosis Button - Show when result is available */}
                            {predictionResult && (
                                <TouchableOpacity
                                    style={styles.newDiagnosisButton}
                                    onPress={() => setPredictionResult(null)}
                                >
                                    <Text style={styles.newDiagnosisButtonText}>New Diagnosis</Text>
                                </TouchableOpacity>
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