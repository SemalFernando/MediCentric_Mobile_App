import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './src/pages/SplashScreen';
import WelcomeScreen from './src/pages/WelcomeScreen';
import HomeScreen from './src/pages/HomeScreen';

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

  // Render the appropriate screen based on currentScreen state
  switch (currentScreen) {
    case 'home':
      return <HomeScreen onBack={navigateToWelcome} />;
    case 'welcome':
    default:
      return <WelcomeScreen onNavigateToHome={navigateToHome} />;
  }
};

export default App;