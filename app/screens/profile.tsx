import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import Title from '@/components/title';

type ProfileScreenProps = NativeStackScreenProps<RouteParamList, 'ProfileScreen'>;

interface UserObj {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const Profile = ({ navigation }: ProfileScreenProps) => {
  // State Management
  const [userData, setUserData] = useState<UserObj>({ name: '', email: '', password: '' });
  const [originalData, setOriginalData] = useState<UserObj>({ name: '', email: '', password: '' });
  const [isEmailModified, setIsEmailModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const { appwrite, isLoggedIn, setIsLoggedIn } = useContext(AppwriteContext);

  // Helper Functions
  const showSnackbar = (message: string) => {
    setSnackbar({ visible: true, message });
    setTimeout(() => setSnackbar({ visible: false, message: '' }), 3000);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (userData.name !== originalData.name && !userData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (isEmailModified && userData.email !== originalData.email) {
      if (!userData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
        newErrors.email = 'Invalid email format';
      }
      
      if (!userData.password.trim()) {
        newErrors.password = 'Password is required to change email';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API Handlers
  const handleSaveChanges = async () => {
    if (isEmailModified && userData.email !== originalData.email) {
      setShowConfirmDialog(true);
      return;
    }
    await saveChanges();
  };

  const saveChanges = async () => {
    if (!validateForm()) {
      showSnackbar('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    setError(null);
    const updateResults: string[] = [];

    try {
      if (userData.name !== originalData.name && userData.name.trim()) {
        const nameResponse = await appwrite.updateUserName(userData.name, showSnackbar);
        if (nameResponse) {
          updateResults.push('Name updated successfully');
          setOriginalData(prev => ({ ...prev, name: userData.name }));
        }
      }

      if (isEmailModified && 
          userData.email !== originalData.email && 
          userData.email.trim() && 
          userData.password.trim()) {
        const emailResponse = await appwrite.updateUserEmail(
          { email: userData.email, password: userData.password },
          showSnackbar
        );
        if (emailResponse) {
          updateResults.push('Email updated successfully');
          setOriginalData(prev => ({ ...prev, email: userData.email }));
          setIsEmailModified(false);
          setUserData(prev => ({ ...prev, password: '' }));
        }
      }

      showSnackbar(updateResults.length > 0 ? updateResults.join('. ') : 'No changes made');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await appwrite.getCurrentUser();
          if (response) {
            const user: UserObj = {
              name: response.name,
              email: response.email,
              password: ''
            };
            setIsLoggedIn(true);
            setUserData(user);
            setOriginalData(user);
            setIsEmailModified(false);
            setErrors({});
          }
        } catch (error) {
          console.error(error);
          showSnackbar('Failed to fetch user data');
          setError('Failed to fetch user data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }, [appwrite])
  );

  // Render Components
  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options: {
      secureTextEntry?: boolean;
      keyboardType?: 'email-address' | 'default';
      autoCapitalize?: 'none' | 'sentences';
      error?: string;
    } = {}
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={label}
        placeholderTextColor="#C0C0C0"
        value={value}
        onChangeText={onChangeText}
        {...options}
      />
      {options.error && <Text style={styles.errorText}>{options.error}</Text>}
    </View>
  );

  const renderConfirmDialog = () => (
    <View style={styles.dialogContainer}>
      <View style={styles.dialog}>
        <Text style={styles.dialogText}>
          Are you sure you want to change your email? You'll need to verify the new email address.
        </Text>
        <View style={styles.dialogButtons}>
          <TouchableOpacity 
            style={styles.dialogButton}
            onPress={() => setShowConfirmDialog(false)}
          >
            <Text style={styles.dialogButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.dialogButton, styles.dialogConfirmButton]}
            onPress={async () => {
              setShowConfirmDialog(false);
              await saveChanges();
            }}
          >
            <Text style={styles.dialogButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Title />
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: `https://robohash.org/${userData.email}` }} 
            style={styles.profileImage} 
          />
        </View>

        <View style={styles.formContainer}>
          {renderInputField('NAME', userData.name, 
            (text) => setUserData({ ...userData, name: text }),
            { error: errors.name }
          )}

          {renderInputField('EMAIL', userData.email, 
            (text) => {
              setUserData({ ...userData, email: text });
              setIsEmailModified(true);
            },
            { 
              keyboardType: 'email-address',
              autoCapitalize: 'none',
              error: errors.email 
            }
          )}

          {isEmailModified && (
            <>
              <Text style={styles.infoMessage}>
                Please enter your password to update the email.
              </Text>
              {renderInputField('PASSWORD', userData.password,
                (text) => setUserData({ ...userData, password: text }),
                { 
                  secureTextEntry: true,
                  error: errors.password 
                }
              )}
            </>
          )}

          <TouchableOpacity 
            style={[styles.updateButton, isLoading && styles.disabledButton]} 
            onPress={handleSaveChanges}
            disabled={isLoading}
          >
            <Text style={styles.updateButtonText}>
              {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.updateButtonText}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </View>

        {snackbar.visible && (
          <View style={styles.snackbar}>
            <Text style={styles.snackbarText}>{snackbar.message}</Text>
          </View>
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        {showConfirmDialog && renderConfirmDialog()}
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
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#A9A9A9',
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoMessage: {
    color: '#FF4500',
    fontSize: 12,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 6,
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
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#FF4500',
    textAlign: 'center',
    marginTop: 10,
  },
  dialogContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#242424',
    borderRadius: 8,
    padding: 20,
    width: '100%',
  },
  dialogText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dialogButton: {
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#363636',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  dialogConfirmButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 10,
  },
  dialogButtonText: {
    color: '#FFFFFF',
  },
});

export default Profile;
