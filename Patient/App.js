import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './src/pages/SplashScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import LoginScreen from './src/pages/LoginScreen';
import SignUpScreen from './src/pages/SignUpScreen';
import HomeScreen from './src/pages/HomeScreen';
import ReportsScreen from './src/pages/ReportsScreen';
import PrescriptionsScreen from './src/pages/PrescriptionsScreen';
import AllergiesScreen from './src/pages/AllergiesScreen';
import SetPasswordScreen from './src/pages/SetPasswordScreen';
import ConsentScreen from './src/pages/ConsentScreen';
import ProfileScreen from './src/pages/ProfileScreen';
import QrCodeScreen from './src/pages/QrCodeScreen'; // Import the QR code screen

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scannedPatient, setScannedPatient] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [patientId, setPatientId] = useState(null);

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
  const navigateToHome = (patientIdFromLogin = null) => {
    if (patientIdFromLogin) {
      setPatientId(patientIdFromLogin);
      console.log('Patient ID set:', patientIdFromLogin);
    }
    setCurrentScreen('home');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
    setUserRole(null);
    setPatientData(null);
    setPatientId(null);
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const navigateToSetPassword = () => {
    setCurrentScreen('setPassword');
  };

  const navigateToConsent = () => {
    setCurrentScreen('consent');
  };

  const navigateBackFromConsent = () => {
    setCurrentScreen('setPassword');
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

  // Navigate to profile screen
  const navigateToProfile = (patientIdFromHome = null) => {
    setCurrentScreen('profile');
  };

  const navigateBackFromProfile = () => {
    setCurrentScreen('home');
  };

  // Navigate to QR code screen
  const navigateToQrCode = () => {
    setCurrentScreen('qrCode');
  };

  const navigateBackFromQrCode = () => {
    setCurrentScreen('home');
  };

  // Handle logout from home screen
  const handleLogout = () => {
    setScannedPatient(null);
    setUserRole(null);
    setPatientData(null);
    setPatientId(null);
    setCurrentScreen('welcome');
  };

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          onBack={navigateToWelcome}
          onLogout={handleLogout}
          patientData={patientData}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
          onNavigateToProfile={navigateToProfile}
          onNavigateToQrCode={navigateToQrCode} // Make sure this line is present
          route={{ params: { patientId } }}
        />
      );
    case 'profile':
      return (
        <ProfileScreen
          onBack={navigateBackFromProfile}
          onLogout={handleLogout}
          route={{ params: { patientId } }}
        />
      );
    case 'login':
      return (
        <LoginScreen
          onBack={navigateToWelcome}
          onNavigateToHome={navigateToHome}
          onNavigateToSignUp={navigateToSignUp}
          onNavigateToSetPassword={navigateToSetPassword}
        />
      );
    case 'signup':
      return (
        <SignUpScreen
          onBack={navigateToWelcome}
          onNavigateToLogin={navigateToLogin}
        />
      );
    case 'setPassword':
      return (
        <SetPasswordScreen
          onBack={navigateToWelcome}
          onSignup={navigateToConsent}
        />
      );
    case 'consent':
      return (
        <ConsentScreen
          onCancel={navigateBackFromConsent}
          onAgree={navigateToHome}
        />
      );
    case 'reports':
      return (
        <ReportsScreen
          onBack={navigateBackFromReports}
          onNavigateToHome={navigateToHome}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
        />
      );
    case 'prescriptions':
      return (
        <PrescriptionsScreen
          onBack={navigateBackFromPrescriptions}
          onNavigateToHome={navigateToHome}
          onNavigateToReports={navigateToReports}
          onNavigateToAllergies={navigateToAllergies}
        />
      );
    case 'allergies':
      return (
        <AllergiesScreen
          onBack={navigateBackFromAllergies}
          onNavigateToHome={navigateToHome}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
        />
      );
    case 'qrCode':
      return (
        <QrCodeScreen
          onBack={navigateBackFromQrCode}
        />
      );
    case 'welcome':
    default:
      return (
        <WelcomeScreen
          onNavigateToHome={navigateToHome}
          onNavigateToLogin={navigateToLogin}
          onNavigateToSignUp={navigateToSignUp}
          onNavigateToSetPassword={navigateToSetPassword}
        />
      );
  }
};

export default App;