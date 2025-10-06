import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './src/pages/SplashScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import InitialHomeScreen from './src/pages/InitialHomeScreen';
import HomeScreen from './src/pages/HomeScreen'; // Import the new PatientHomeScreen
import ReportsScreen from './src/pages/ReportsScreen'; // Import the ReportsScreen
import PrescriptionsScreen from './src/pages/PrescriptionsScreen'; // Import the PrescriptionsScreen
import PrescriptionFormScreen from './src/pages/PrescriptionFormScreen'; // Import the PrescriptionFormScreen
import AllergiesScreen from './src/pages/AllergiesScreen'; // Import the AllergiesScreen
import SetPasswordScreen from './src/pages/SetPasswordScreen';
import QRCodeScannerScreen from './src/pages/QRCodeScannerScreen'; // Import QR code screen
import PermissionTestScreen from './src/pages/PermissionTestScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scannedPatient, setScannedPatient] = useState(null); // Track scanned patient data

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Handle navigation between screens
  const navigateToHome = () => {
    setCurrentScreen('home'/*'initialHome'*/);
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const navigateToSetPassword = () => {
    setCurrentScreen('setPassword');
  };

  const navigateToLogin = () => {
    setCurrentScreen('welcome'); // Or create a separate login screen if needed
  };

  const navigateToQRScanner = () => {
    setCurrentScreen('qrScanner');
  };

  const navigateBackFromQR = () => {
    setCurrentScreen('home'/*'initialHome'*/);
  };

  // Navigate to patient home screen after QR scan
  const navigateToPatientHome = (patientData) => {
    setScannedPatient(patientData);
    setCurrentScreen('home');
  };

  // Navigate back from patient home to initial home
  const navigateBackToHome = () => {
    setCurrentScreen('home'/*'initialHome'*/);
  };

  // Navigate to reports screen
  const navigateToReports = () => {
    setCurrentScreen('reports');
  };

  // Navigate back from reports
  const navigateBackFromReports = () => {
    setCurrentScreen('home');
  };

  // Navigate to prescriptions screen
  const navigateToPrescriptions = () => {
    setCurrentScreen('prescriptions');
  };

  // Navigate back from prescriptions
  const navigateBackFromPrescriptions = () => {
    setCurrentScreen('home');
  };

  // Navigate to allergies screen
  const navigateToAllergies = () => {
    setCurrentScreen('allergies');
  };

  // Navigate back from allergies
  const navigateBackFromAllergies = () => {
    setCurrentScreen('home');
  };

  // Navigate to prescription form screen
  const navigateToPrescriptionForm = () => {
    setCurrentScreen('prescriptionForm');
  };

  // Navigate back from prescription form
  const navigateBackFromPrescriptionForm = () => {
    setCurrentScreen('home');
  };

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case 'initialHome':
      return (
        <InitialHomeScreen
          onBack={navigateToWelcome}
          onNavigateToQRScanner={navigateToQRScanner}
        />
      );
    case 'home':
      return (
        <HomeScreen
          onBack={navigateBackToHome}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
          onNavigateToPrescriptionForm={navigateToPrescriptionForm}
          patientData={scannedPatient}
        />
      );
    case 'reports':
      return (
        <ReportsScreen
          onBack={navigateBackFromReports}
        />
      );
    case 'prescriptions':
      return (
        <PrescriptionsScreen
          onBack={navigateBackFromPrescriptions}
        />
      );
    case 'allergies':
      return (
        <AllergiesScreen
          onBack={navigateBackFromAllergies}
        />
      );
    case 'prescriptionForm':
      return (
        <PrescriptionFormScreen
          onBack={navigateBackFromPrescriptionForm}
        />
      );
    case 'setPassword':
      return <SetPasswordScreen onBack={navigateToWelcome} onLogin={navigateToLogin} />;
    case 'qrScanner':
      return (
        <QRCodeScannerScreen
          onBack={navigateBackFromQR}
          onPatientScanned={navigateToPatientHome}
        />
      );
    // case 'qrScanner':
    //   return <PermissionTestScreen onBack={navigateBackFromQR} />;
    case 'welcome':
    default:
      return (
        <WelcomeScreen
          onNavigateToHome={navigateToHome}
          onNavigateToSetPassword={navigateToSetPassword}
        />
      );
  }
};

export default App;