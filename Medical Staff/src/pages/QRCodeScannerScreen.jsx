import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { requestCameraPermission } from '../utils/permissions';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    requestCameraPermission().then((granted) => {
      setHasPermission(granted);
    });
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraKitCameraScreen
        scanBarcode={true}
        onReadCode={(event) => Alert.alert('QR Code', event.nativeEvent.codeStringValue)}
        showFrame={true}
        laserColor={'red'}
        frameColor={'white'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
