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
import QRCodeScannerScreen from './src/pages/QrScannerScreen';
import DoctorProfileScreen from './src/pages/DoctorProfileScreen';
import LabReportFormScreen from './src/pages/LabReportFormScreen';
import ScanReportFormScreen from './src/pages/ScanReportFormScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [scannedPatient, setScannedPatient] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Navigation functions
  const navigateToInitialHome = (doctorDataFromLogin = null) => {
    console.log('navigateToInitialHome received doctor data:', doctorDataFromLogin);

    if (doctorDataFromLogin) {
      console.log('Setting doctor data in state:', doctorDataFromLogin);
      setDoctorData(doctorDataFromLogin);
    }

    setScannedPatient(null); // Clear any previous patient data
    setCurrentScreen('initialHome');
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome');
    setUserRole(null);
    setDoctorData(null);
    setScannedPatient(null);
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
    // Always go back to initial home when back button pressed in QR scanner
    setCurrentScreen('initialHome');
  };

  // Navigate to patient home screen after QR scan - THIS IS THE KEY FUNCTION
  const navigateToPatientHome = (patientData) => {
    console.log('Navigating to patient home with data:', patientData);
    setScannedPatient(patientData);
    setCurrentScreen('home'); // This navigates to the patient homepage, NOT initial homepage
  };

  // Navigate back from patient home to initial home (when back button pressed in patient home)
  const navigateBackToInitialHome = () => {
    setScannedPatient(null);
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

  // Navigate to profile screen - ONLY FOR DOCTORS
  const navigateToProfile = (doctorId = null) => {
    console.log('Navigating to profile with doctorId:', doctorId);
    setCurrentScreen('profile');
  };

  const navigateBackFromProfile = () => {
    setCurrentScreen('home');
  };

  // Navigate to lab report screen
  const navigateToLabReport = () => {
    setUserRole('lab_technician');
    setCurrentScreen('labReport');
  };

  const navigateBackFromLabReport = () => {
    setCurrentScreen('welcome');
  };

  // Navigate to scan report screen
  const navigateToScanReport = () => {
    setUserRole('radiologist');
    setCurrentScreen('scanReport');
  };

  const navigateBackFromScanReport = () => {
    setCurrentScreen('welcome');
  };

  // Handle logout from profile screen
  const handleLogout = () => {
    setScannedPatient(null);
    setUserRole(null);
    setDoctorData(null);
    setCurrentScreen('welcome');
  };

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case 'initialHome':
      return (
        <InitialHomeScreen
          onBack={navigateToWelcome}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToReports={navigateToReports}
        />
      );
    case 'home':
      return (
        <HomeScreen
          onBack={navigateBackToInitialHome} // Back goes to initial home
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
          onNavigateToPrescriptionForm={navigateToPrescriptionForm}
          onNavigateToProfile={navigateToProfile}
          patientData={scannedPatient} // Pass scanned patient data
          doctorData={doctorData} // Pass doctor data directly as prop
        />
      );
    // In App.js, update the ReportsScreen case:
    case 'reports':
      return (
        <ReportsScreen
          onBack={navigateBackFromReports}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToInitialHome={() => setCurrentScreen('initialHome')} // Add this
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
          patientData={scannedPatient}
        />
      );
    // In App.js, update the PrescriptionsScreen case:
    case 'prescriptions':
      return (
        <PrescriptionsScreen
          onBack={navigateBackFromPrescriptions}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToInitialHome={() => setCurrentScreen('initialHome')}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToAllergies={navigateToAllergies}
          patientData={scannedPatient}
        />
      );
    case 'allergies':
      return (
        <AllergiesScreen
          onBack={navigateBackFromAllergies}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          patientData={scannedPatient}
        />
      );
    case 'prescriptionForm':
      return (
        <PrescriptionFormScreen
          onBack={navigateBackFromPrescriptionForm}
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToQRScanner={navigateToQRScanner}
          onNavigateToReports={navigateToReports}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToAllergies={navigateToAllergies}
          patientData={scannedPatient}
          doctorData={doctorData}
        />
      );
    case 'labReport':
      return (
        <LabReportFormScreen
          onBack={navigateBackFromLabReport}
          onNavigateToHome={navigateToInitialHome}
        />
      );
    case 'scanReport':
      return (
        <ScanReportFormScreen
          onBack={navigateBackFromScanReport}
          onNavigateToHome={navigateToInitialHome}
        />
      );
    case 'setPassword':
      return <SetPasswordScreen onBack={navigateToWelcome} onLogin={navigateToLogin} />;
    case 'qrScanner':
      return (
        <QRCodeScannerScreen
          onBack={navigateBackFromQR}
          onPatientScanned={navigateToPatientHome} // This navigates to patient homepage
          onNavigateToHome={() => setCurrentScreen('home')}
          onNavigateToPrescriptions={navigateToPrescriptions}
          onNavigateToReports={navigateToReports}
        />
      );
    case 'profile':
      return (
        <DoctorProfileScreen
          onBack={navigateBackFromProfile}
          onLogout={handleLogout}
          route={{ params: { doctorId: doctorData?.doctorId } }}
          doctorData={doctorData}
        />
      );
    case 'welcome':
    default:
      return (
        <WelcomeScreen
          onNavigateToHome={navigateToInitialHome} // Login goes to initial home
          onNavigateToSetPassword={navigateToSetPassword}
          onNavigateToLabReport={navigateToLabReport}
          onNavigateToScanReport={navigateToScanReport}
        />
      );
  }
};

export default App;