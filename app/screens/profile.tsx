import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import Title from '@/components/title';

type HomeScreenProps = NativeStackScreenProps<RouteParamList, 'ProfileScreen'>;

type UserObj = {
  name: string;
  email: string;
  password: string;
};

const Profile = ({ navigation }: HomeScreenProps) => {
  const [userData, setUserData] = useState<UserObj>({ name: '', email: '', password: '' });
  const [originalData, setOriginalData] = useState<UserObj>({ name: '', email: '', password: '' }); // Store initial values
  const [isEmailModified, setIsEmailModified] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false); // Track snackbar visibility
  const { appwrite, isLoggedIn, setIsLoggedIn } = useContext(AppwriteContext);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setIsSnackbarVisible(true);
    setTimeout(() => setIsSnackbarVisible(false), 3000); // Auto-hide snackbar after 3 seconds
  };

  const handleSaveChanges = async () => {
    let updateResults: string[] = [];

    // Update Name (Only if changed)
    if (userData.name !== originalData.name) {
      try {
        const response = await appwrite.updateUserName(userData.name, showSnackbar);
        if (response) {
          updateResults.push('Name updated successfully');
          setOriginalData((prev) => ({ ...prev, name: userData.name })); // Update original name
        }
      } catch (e) {
        console.log(e);
        updateResults.push('Failed to update name');
      }
    }

    // Update Email (Only if changed)
    if (isEmailModified && userData.email !== originalData.email) {
      const updatedUserData = {
        email: userData.email,
        password: userData.password,
      };
      try {
        const response = await appwrite.updateUserEmail(updatedUserData, showSnackbar);
        if (response) {
          updateResults.push('Email updated successfully');
          setOriginalData((prev) => ({ ...prev, email: userData.email })); // Update original email
          setIsEmailModified(false); // Hide password field after success
          setUserData((prev) => ({ ...prev, password: '' })); // Clear password
        }
      } catch (e) {
        console.log(e);
        updateResults.push('Failed to update email');
      }
    }

    // Show combined results in the snackbar
    if (updateResults.length > 0) {
      showSnackbar(updateResults.join('. '));
    } else {
      showSnackbar('No changes made');
    }
  };

  useFocusEffect(
    useCallback(() => {
      appwrite.getCurrentUser()
        .then(response => {
          if (response) {
            const user: UserObj = {
              name: response.name,
              email: response.email,
              password: ''
            };
            setIsLoggedIn(true);
            setUserData(user);
            setOriginalData(user); // Store initial values to compare
          }
        })
        .catch(e => {
          console.log(e);
          showSnackbar('Failed to fetch user data');
        });
    }, [appwrite])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Title />
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: `https://robohash.org/${userData.email}` }} style={styles.profileImage} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#C0C0C0"
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#C0C0C0"
              value={userData.email}
              onChangeText={(text) => {
                setUserData({ ...userData, email: text });
                setIsEmailModified(true);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {isEmailModified && (
              <Text style={styles.infoMessage}>
                Please enter your password to update the email.
              </Text>
            )}
          </View>
          {isEmailModified && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#C0C0C0"
                value={userData.password}
                onChangeText={(text) => setUserData({ ...userData, password: text })}
                secureTextEntry={true}
              />
            </View>
          )}

          <TouchableOpacity style={styles.updateButton} onPress={handleSaveChanges}>
            <Text style={styles.updateButtonText}>SAVE CHANGES</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.updateButtonText}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </View>

        {/* Snackbar for notifications */}
        {isSnackbarVisible && (
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
});

export default Profile;
