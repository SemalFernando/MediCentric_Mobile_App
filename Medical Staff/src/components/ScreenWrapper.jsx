import React, { useEffect, useRef } from 'react';
import { StatusBar, Platform, StyleSheet, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// For Android navigation bar
let NavigationBarColor;
if (Platform.OS === 'android') {
  try {
    NavigationBarColor = require('react-native-navigation-bar-color');
  } catch (e) {
    console.log('Navigation bar color package not available');
  }
}

const ScreenWrapper = ({ 
  children, 
  backgroundColor = '#ffffff',
  statusBarStyle = 'dark-content',
  barStyle = 'light-content',
  translucent = false
}) => {
  const prevBackgroundColor = useRef(backgroundColor);

  // Change navigation bar color on Android
  useEffect(() => {
    if (Platform.OS === 'android' && NavigationBarColor) {
      const changeNavigationBar = async () => {
        try {
          console.log('Changing navigation bar color to:', backgroundColor);
          
          // Method 1: Try changing color
          await NavigationBarColor.changeNavigationBarColor(
            backgroundColor, 
            barStyle === 'light-content'
          );
          
          // Method 2: Also try setting it to translucent
          if (translucent) {
            await NavigationBarColor.changeNavigationBarColor(
              '#00000000', // Transparent
              barStyle === 'light-content'
            );
          }
          
        } catch (error) {
          console.log('Error changing navigation bar:', error);
          
          // Fallback: Try the alternative method
          try {
            await NavigationBarColor.changeNavigationBarColor(
              backgroundColor, 
              barStyle === 'light-content'
            );
          } catch (fallbackError) {
            console.log('Fallback also failed:', fallbackError);
          }
        }
      };

      // Only change if background color actually changed
      if (prevBackgroundColor.current !== backgroundColor) {
        changeNavigationBar();
        prevBackgroundColor.current = backgroundColor;
      } else {
        changeNavigationBar(); // Still try to set it on first render
      }
    }
  }, [backgroundColor, barStyle, translucent]);

  // Additional effect to handle app state changes
  useEffect(() => {
    if (Platform.OS === 'android' && NavigationBarColor) {
      const handleAppStateChange = async () => {
        try {
          // Re-apply navigation bar color when app comes to foreground
          await NavigationBarColor.changeNavigationBarColor(
            backgroundColor, 
            barStyle === 'light-content'
          );
        } catch (error) {
          console.log('Error re-applying navigation bar color:', error);
        }
      };

      // Re-apply when component mounts
      handleAppStateChange();
    }
  }, []);

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }]} 
      edges={['right', 'left', 'top']}
    >
      <StatusBar 
        backgroundColor={translucent ? 'transparent' : backgroundColor}
        barStyle={statusBarStyle}
        translucent={translucent}
      />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;