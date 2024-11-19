import { StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import React, { useState, useContext } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import { AppwriteContext } from '../appwrite/appwritecontext';
import Title from '@/components/title';
import { Ionicons } from '@expo/vector-icons';

type ResetPasswordProps = NativeStackScreenProps<RouteParamList, 'ResetPassword'>;

const ResetPassword = ({ navigation }: ResetPasswordProps) => {
  const { appwrite } = useContext(AppwriteContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const displaySnackbar = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 1500);
  };

  const checkPasswordStrength = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (password.length < 8) return 'Too short';
    if (strength === 4) return 'Strong';
    if (strength === 3) return 'Good';
    return 'Weak';
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
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
        {/* Header Section with Back Button and Title */}
        <View style={styles.headerSection}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Title />
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>OLD PASSWORD</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter old password"
              placeholderTextColor="#C0C0C0"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowOldPassword(!showOldPassword)}
            >
              <Ionicons 
                name={showOldPassword ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#A9A9A9" 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>NEW PASSWORD</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#C0C0C0"
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons 
                name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
                size={24} 
                color="#A9A9A9" 
              />
            </TouchableOpacity>
          </View>

          {newPassword.length > 0 && (
            <Text style={[
              styles.strengthIndicator,
              { color: passwordStrength === 'Strong' ? '#4CAF50' : 
                      passwordStrength === 'Good' ? '#FFC107' : '#F44336' }
            ]}>
              Password Strength: {passwordStrength}
            </Text>
          )}

          <TouchableOpacity style={styles.updateButton} onPress={handleResetPassword}>
            <Text style={styles.updateButtonText}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions Container */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Please Note:</Text>
          <Text style={styles.instruction}>• New password must be between 8 and 256 characters.</Text>
          <Text style={styles.instruction}>• Do not use obvious passwords like "123456", "password", or your name.</Text>
          <Text style={styles.instruction}>• Include a mix of uppercase, lowercase, numbers, and symbols for better security.</Text>
          <Text style={styles.instruction}>• Avoid reusing passwords from other accounts.</Text>
          <Text style={styles.instruction}>• Don't use personal information like birthdays or phone numbers.</Text>
          <Text style={styles.instruction}>• Avoid using sequential keyboard patterns (e.g., qwerty, 12345).</Text>
          <Text style={styles.instruction}>• Consider using a passphrase instead of a single word.</Text>
          <Text style={styles.instruction}>• Never share your password with anyone.</Text>
        </View>

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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  headerSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FF4500',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
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
    marginVertical: 20,
  },
  label: {
    color: '#A9A9A9',
    fontSize: 12,
    marginBottom: 5,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    borderRadius: 8,
    width: '100%',
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
  strengthIndicator: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    padding: 8,
  },
});

export default ResetPassword;
