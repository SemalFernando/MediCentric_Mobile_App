import React, { useEffect, useState } from 'react';
import { View, Alert, PermissionsAndroid, Platform } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const QRCodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs access to your camera to scan QR codes.',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
          } else {
            Alert.alert('Permission Denied', 'Camera access is required.');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestCameraPermission();
  }, []);

  if (!hasPermission) return null;

  return (
    <QRCodeScanner
      onRead={({ data }) => Alert.alert('QR Code', data)}
      flashMode={RNCamera.Constants.FlashMode.auto}
    />
  );
};

export default QRCodeScannerScreen;