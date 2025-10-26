import React, { useEffect, useRef } from 'react';
import { StatusBar, Platform, StyleSheet, View } from 'react-native';

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
          
          await NavigationBarColor.changeNavigationBarColor(
            backgroundColor, 
            barStyle === 'light-content'
          );
          
          if (translucent) {
            await NavigationBarColor.changeNavigationBarColor(
              '#00000000',
              barStyle === 'light-content'
            );
          }
          
        } catch (error) {
          console.log('Error changing navigation bar:', error);
          
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

      if (prevBackgroundColor.current !== backgroundColor) {
        changeNavigationBar();
        prevBackgroundColor.current = backgroundColor;
      } else {
        changeNavigationBar();
      }
    }
  }, [backgroundColor, barStyle, translucent]);

  useEffect(() => {
    if (Platform.OS === 'android' && NavigationBarColor) {
      const handleAppStateChange = async () => {
        try {
          await NavigationBarColor.changeNavigationBarColor(
            backgroundColor, 
            barStyle === 'light-content'
          );
        } catch (error) {
          console.log('Error re-applying navigation bar color:', error);
        }
      };

      handleAppStateChange();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar 
        backgroundColor={translucent ? 'transparent' : backgroundColor}
        barStyle={statusBarStyle}
        translucent={translucent}
      />
      <View style={styles.forceRemoveTopSpace}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  forceRemoveTopSpace: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? -44 : -24, // Force remove space
    paddingTop: 0,
    borderWidth: 0, // For debugging
    borderColor: 'red',
  },
});

export default ScreenWrapper;