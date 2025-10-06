import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';

const PermissionTestScreen = ({ onBack }) => {
    const [permissionStatus, setPermissionStatus] = useState('unknown');

    const testCameraPermission = async () => {
        try {
            console.log('Testing camera permission...');
            
            if (Platform.OS === 'android') {
                // First, check if we have permission
                const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
                console.log('Camera permission check:', hasPermission);
                
                if (!hasPermission) {
                    console.log('Requesting camera permission...');
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                            title: "Camera Permission Test",
                            message: "This app needs camera access to test permissions",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel", 
                            buttonPositive: "OK"
                        }
                    );
                    console.log('Permission request result:', granted);
                    
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        setPermissionStatus('GRANTED');
                        Alert.alert('Success', 'Camera permission granted!');
                    } else {
                        setPermissionStatus('DENIED: ' + granted);
                        Alert.alert('Permission Denied', `Permission result: ${granted}`);
                    }
                } else {
                    setPermissionStatus('ALREADY_GRANTED');
                    Alert.alert('Info', 'Camera permission was already granted');
                }
            } else {
                setPermissionStatus('IOS_NOT_SUPPORTED');
            }
        } catch (err) {
            console.warn('Permission test error:', err);
            setPermissionStatus('ERROR: ' + err.message);
            Alert.alert('Error', 'Failed to check permissions: ' + err.message);
        }
    };

    const checkAppPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const permissions = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ]);
                console.log('All permissions:', permissions);
                Alert.alert('Permissions', JSON.stringify(permissions, null, 2));
            } catch (err) {
                console.warn('Multiple permissions error:', err);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Permission Test</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.status}>Status: {permissionStatus}</Text>
                
                <TouchableOpacity style={styles.button} onPress={testCameraPermission}>
                    <Text style={styles.buttonText}>Test Camera Permission</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button} onPress={checkAppPermissions}>
                    <Text style={styles.buttonText}>Check All Permissions</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2260FF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    status: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2260FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#666',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});

export default PermissionTestScreen;