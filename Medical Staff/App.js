import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './src/pages/SplashScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import InitialHomeScreen from './src/pages/InitialHomeScreen';
import HomeScreen from './src/pages/HomeScreen';
import ReportsScreen from './src/pages/ReportsScreen';
import PrescriptionsScreen from './src/pages/PrescriptionsScreen';
import PrescriptionFormScreen from './src/pages/PrescriptionFormScreen';
import AllergiesScreen from './src/pages/AllergiesScreen';
import SetPasswordScreen from './src/pages/SetPasswordScreen';
import QRCodeScannerScreen from './src/pages/QRCodeScannerScreen';
import PermissionTestScreen from './src/pages/PermissionTestScreen';
import ProfileScreen from './src/pages/ProfileScreen'; // Import the ProfileScreen

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scannedPatient, setScannedPatient] = useState(null);

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
    setCurrentScreen('home');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const navigateToSetPassword = () => {
    setCurrentScreen('setPassword');
  };

  const navigateToLogin = () => {
    setCurrentScreen('welcome');
  };

  const navigateToQRScanner = () => {
    setCurrentScreen('qrScanner');
  };

  const navigateBackFromQR = () => {
    setCurrentScreen('home');
  };

  // Navigate to patient home screen after QR scan
  const navigateToPatientHome = (patientData) => {
    setScannedPatient(patientData);
    setCurrentScreen('home');
  };

  // Navigate back from patient home to initial home
  const navigateBackToHome = () => {
    setCurrentScreen('initialHome');
  };

  // Navigate to reports screen
  const navigateToReports = () => {
    setCurrentScreen('reports');
  };

  const navigateBackFromReports = () => {
    setCurrentScreen('home');
  };

  // Navigate to prescriptions screen
  const navigateToPrescriptions = () => {
    setCurrentScreen('prescriptions');
  };

  const navigateBackFromPrescriptions = () => {
    setCurrentScreen('home');
  };

  // Navigate to allergies screen
  const navigateToAllergies = () => {
    setCurrentScreen('allergies');
  };

  const navigateBackFromAllergies = () => {
    setCurrentScreen('home');
  };

  // Navigate to prescription form screen
  const navigateToPrescriptionForm = () => {
    setCurrentScreen('prescriptionForm');
  };

  const navigateBackFromPrescriptionForm = () => {
    setCurrentScreen('home');
  };

  // Navigate to profile screen
  const navigateToProfile = () => {
    setCurrentScreen('profile');
  };

  const navigateBackFromProfile = () => {
    setCurrentScreen('home');
  };

  // Handle logout from profile screen
  const handleLogout = () => {
    setScannedPatient(null);
    setCurrentScreen('welcome');
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
          onNavigateToProfile={navigateToProfile} // Add this prop
          patientData={scannedPatient}
        />
      );
    case 'reports':
      return (
        <ReportsScreen
          onBack={navigateBackFromReports}
          onNavigateToHome={navigateToHome}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
        />
      );
    case 'prescriptions':
      return (
        <PrescriptionsScreen
          onBack={navigateBackFromPrescriptions}
          onNavigateToHome={navigateToHome}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToAllergies={navigateToAllergies}
          onNavigateToPrescriptionForm={navigateToPrescriptionForm}
        />
      );
    case 'allergies':
      return (
        <AllergiesScreen
          onBack={navigateBackFromAllergies}
          onNavigateToHome={navigateToHome}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
        />
      );
    case 'prescriptionForm':
      return (
        <PrescriptionFormScreen
          onBack={navigateBackFromPrescriptionForm}
          onNavigateToHome={navigateToHome}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
        />
      );
    case 'setPassword':
      return <SetPasswordScreen onBack={navigateToWelcome} onLogin={navigateToLogin} />;
    case 'qrScanner':
      return (
        <QRCodeScannerScreen
          onBack={navigateBackFromQR}
          onPatientScanned={navigateToPatientHome}
          onNavigateToHome={navigateToHome}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToReports={navigateToReports}
        />
      );
    case 'profile':
      return (
        <ProfileScreen
          onBack={navigateBackFromProfile}
          onLogout={handleLogout}
        />
      );
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