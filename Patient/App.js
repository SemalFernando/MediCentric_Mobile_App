import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './src/pages/SplashScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import HomeScreen from './src/pages/HomeScreen';
import ReportsScreen from './src/pages/ReportsScreen';
import PrescriptionsScreen from './src/pages/PrescriptionsScreen';
import AllergiesScreen from './src/pages/AllergiesScreen';
import SetPasswordScreen from './src/pages/SetPasswordScreen';
import ConsentScreen from './src/pages/ConsentScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scannedPatient, setScannedPatient] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
    setUserRole(null);
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

  const navigateToLogin = () => {
    setCurrentScreen('welcome');
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

  // Handle logout from home screen
  const handleLogout = () => {
    setScannedPatient(null);
    setUserRole(null);
    setCurrentScreen('welcome');
  };

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case 'home':
      return (
        <HomeScreen
          onBack={navigateToWelcome}
          onLogout={handleLogout}
          patientData={scannedPatient}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
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