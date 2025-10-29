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
import QrCodeScreen from './src/pages/QrCodeScreen';
import MedicalDataFormScreen from './src/pages/MedicalDataFormScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scannedPatient, setScannedPatient] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [newPatientData, setNewPatientData] = useState(null);

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
  const navigateToHome = (patientDataFromLogin = null) => {
    console.log('navigateToHome received:', patientDataFromLogin);
    
    if (patientDataFromLogin && patientDataFromLogin.patientId) {
      setPatientId(patientDataFromLogin.patientId);
      setPatientData(patientDataFromLogin);
      console.log('Patient data set successfully');
    }
    setCurrentScreen('home');
  };

  // Navigate to QR code screen after successful registration
  const navigateToQrCodeAfterSignup = (patientData) => {
    setNewPatientData(patientData);
    setCurrentScreen('qrCode');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
    setUserRole(null);
    setPatientData(null);
    setPatientId(null);
    setNewPatientData(null);
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

  // Navigate to reports screen - UPDATED: Now accepts patientId and patientData parameters
  const navigateToReports = (patientIdFromHome = null, patientDataFromHome = null) => {
    console.log('Navigating to reports with patientId:', patientIdFromHome);
    setCurrentScreen('reports');
  };

  const navigateBackFromReports = () => {
    setCurrentScreen('home');
  };

  // Navigate to prescriptions screen - UPDATED: Now accepts patientId and patientData parameters
  const navigateToPrescriptions = (patientIdFromHome = null, patientDataFromHome = null) => {
    console.log('Navigating to prescriptions with patientId:', patientIdFromHome);
    setCurrentScreen('prescriptions');
  };

  const navigateBackFromPrescriptions = () => {
    setCurrentScreen('home');
  };

  // Navigate to allergies screen - UPDATED: Now accepts patientId and patientData parameters
  const navigateToAllergies = (patientIdFromHome = null, patientDataFromHome = null) => {
    console.log('Navigating to allergies with patientId:', patientIdFromHome);
    setCurrentScreen('allergies');
  };

  const navigateBackFromAllergies = () => {
    setCurrentScreen('home');
  };

  // Navigate to profile screen - UPDATED: Now accepts patientId and patientData parameters
  const navigateToProfile = (patientIdFromHome = null, patientDataFromHome = null) => {
    console.log('Navigating to profile with patientId:', patientIdFromHome);
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

  // Navigate to medical data form screen
  const navigateToMedicalData = () => {
    setCurrentScreen('medicalData');
  };

  const navigateBackFromMedicalData = () => {
    setCurrentScreen('profile');
  };

  // Navigate from QR screen to home after registration
  const navigateFromQrToHome = () => {
    if (newPatientData && newPatientData.patientId) {
      setPatientId(newPatientData.patientId);
      setPatientData(newPatientData);
    }
    setCurrentScreen('home');
  };

  // Handle logout from home screen
  const handleLogout = () => {
    setScannedPatient(null);
    setUserRole(null);
    setPatientData(null);
    setPatientId(null);
    setNewPatientData(null);
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
          onNavigateToQrCode={navigateToQrCode}
          route={{ params: { patientId, patientData } }}
        />
      );
    case 'profile':
      return (
        <ProfileScreen
          onBack={navigateBackFromProfile}
          onLogout={handleLogout}
          onNavigateToMedicalData={navigateToMedicalData}
          route={{ params: { patientId, patientData } }}
        />
      );
    case 'medicalData':
      return (
        <MedicalDataFormScreen
          onBack={navigateBackFromMedicalData}
          patientId={patientId}
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
          onNavigateToQrCode={navigateToQrCodeAfterSignup}
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
          patientId={patientId} // ADDED: pass patientId
          patientData={patientData} // ADDED: pass patientData
        />
      );
    case 'prescriptions':
      return (
        <PrescriptionsScreen
          onBack={navigateBackFromPrescriptions}
          onNavigateToHome={navigateToHome}
          onNavigateToReports={navigateToReports}
          onNavigateToAllergies={navigateToAllergies}
          patientId={patientId} // ADDED: pass patientId
          patientData={patientData} // ADDED: pass patientData
        />
      );
    case 'allergies':
      return (
        <AllergiesScreen
          onBack={navigateBackFromAllergies}
          onNavigateToHome={navigateToHome}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          patientId={patientId} // ADDED: pass patientId
          patientData={patientData} // ADDED: pass patientData
        />
      );
    case 'qrCode':
      return (
        <QrCodeScreen
          onBack={newPatientData ? navigateFromQrToHome : navigateBackFromQrCode}
          patientData={newPatientData || patientData}
          route={{ params: { 
            patientId: newPatientData?.patientId || patientId,
            patientData: newPatientData || patientData 
          }}}
          onNavigateToHome={navigateToHome}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToQrCode={navigateToQrCode}
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