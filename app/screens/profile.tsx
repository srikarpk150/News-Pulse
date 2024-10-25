import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';

type HomeScreenProps = NativeStackScreenProps<RouteParamList, 'Profile'>

type UserObj = {
  name: string;
  email: string;
  password: string
}

const Profile = ({ navigation }: HomeScreenProps) => {
  const [userData, setUserData] = useState<UserObj>({ name: '', email: '', password: '' });
  const [error, setError] = useState<string>('');
  const [isEmailModified, setIsEmailModified] = useState<boolean>(false);
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleUpdateUserName = () => {
    appwrite.updateUserName(userData.name, showSnackbar)
      .then((response) => {
        if (response) {
          showSnackbar('Profile updated successfully');
        }
      })
      .catch(e => {
        console.log(e);
        setError('Failed to update profile');
        showSnackbar('Failed to update profile');
      });
  };

  const handleUpdateUserEmail = () => {
    const updatedUserData = {
      email: userData.email,
      password: userData.password
    };
    appwrite.updateUserEmail(updatedUserData, showSnackbar)
      .then((response) => {
        if (response) {
          showSnackbar('Profile updated successfully');
        }
      })
      .catch(e => {
        console.log(e);
        setError('Failed to update profile');
        showSnackbar('Failed to update profile');
      });
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
          }
        });
    }, [appwrite])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.message}>NEWS PULSE</Text>

        <View style={styles.userContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#C0C0C0"
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
          />
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
            <>
              <Text style={styles.infoText}>
                Please enter your current password to update your email address.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#C0C0C0"
                value={userData.password}
                onChangeText={(text) => setUserData({ ...userData, password: text })}
                secureTextEntry={true}
              />
            </>
          )}
          <TouchableOpacity style={styles.updateButton} onPress={() => {
            handleUpdateUserName();
            handleUpdateUserEmail();
          }}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={() => showSnackbar('Password reset functionality coming soon!')}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D32',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  message: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 16,
  },
  userContainer: {
    backgroundColor: '#1C1F3D',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2A2D47',
    color: '#FFFFFF',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    color: '#C0C0C0',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#4287f5',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#f02e65',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  newsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  articleContainer: {
    backgroundColor: '#1C1F3D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 4,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  articleDescription: {
    fontSize: 16,
    color: '#C0C0C0',
  },
  articleDate: {
    fontSize: 14,
    color: '#A9A9A9',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});

export default Profile;
