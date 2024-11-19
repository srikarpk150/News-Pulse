import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import React, { useState, useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import { AppwriteContext } from '../appwrite/appwritecontext';
import Title from '@/components/title';

type ResetPasswordProps = NativeStackScreenProps<RouteParamList, 'ResetPassword'>;

const ResetPassword = ({ navigation }: ResetPasswordProps) => {
  const { appwrite } = useContext(AppwriteContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const displaySnackbar = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 1500);
  };

  const handleResetPassword = () => {
    if (newPassword.length < 8 || newPassword.length > 256) {
      displaySnackbar('New password must be between 8 and 256 characters.');
      return;
    }
    if (oldPassword === newPassword) {
      displaySnackbar('New password cannot be the same as the old password.');
      return;
    }
    appwrite
      .resetUserPassword({ oldPassword, newPassword },displaySnackbar)
      .then((response) => {
        if (response) {
          displaySnackbar('Password updated successfully');
          setOldPassword('');
          setNewPassword('');
          setTimeout(() => {
            navigation.goBack();
          }, 1500);
        }
      })
      .catch((e) => {
        console.log(e);
        displaySnackbar('Failed to update password');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title Component */}
        <View style={styles.titleContainer}>
          <Title />
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instruction}>• New password must be between 8 and 256 characters.</Text>
            <Text style={styles.instruction}>• Do not use obvious passwords like "123456", "password", or your name.</Text>
            <Text style={styles.instruction}>• Include a mix of uppercase, lowercase, numbers, and symbols for better security.</Text>
            <Text style={styles.instruction}>• Avoid reusing passwords from other accounts.</Text>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>OLD PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter old password"
            placeholderTextColor="#C0C0C0"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true}
          />
          <Text style={styles.label}>NEW PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#C0C0C0"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.updateButton} onPress={handleResetPassword}>
            <Text style={styles.updateButtonText}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Snackbar */}
        {showSnackbar && (
          <View style={styles.snackbar}>
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android status bar
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  instructionsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  instruction: {
    fontSize: 14,
    color: '#A9A9A9',
    marginBottom: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    color: '#A9A9A9',
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FF4500',
    fontSize: 16,
    fontWeight: '600',
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#333333',
    borderRadius: 8,
    alignItems: 'center',
  },
  snackbarText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default ResetPassword;
