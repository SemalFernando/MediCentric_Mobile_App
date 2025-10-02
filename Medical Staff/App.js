import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './src/pages/SplashScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import HomeScreen from './src/pages/HomeScreen';
import SetPasswordScreen from './src/pages/SetPasswordScreen'; // Import your SetPasswordScreen

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');

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
    setCurrentScreen('welcome'); // Or create a separate login screen if needed
  };

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case 'home':
      return <HomeScreen onBack={navigateToWelcome} />;
    case 'setPassword':
      return <SetPasswordScreen onBack={navigateToWelcome} onLogin={navigateToLogin} />;
    case 'welcome':
    default:
      return <WelcomeScreen onNavigateToHome={navigateToHome} onNavigateToSetPassword={navigateToSetPassword} />;
  }
};

export default App;