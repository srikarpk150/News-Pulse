import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import Title from '@/components/title';

type HomeScreenProps = NativeStackScreenProps<RouteParamList, 'Profile'>

type UserObj = {
  name: string;
  email: string;
  password: string;
}

const Profile = ({ navigation }: HomeScreenProps) => {
  const [userData, setUserData] = useState<UserObj>({ name: '', email: '', password: '' });
  const [isEmailModified, setIsEmailModified] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { appwrite, isLoggedIn, setIsLoggedIn } = useContext(AppwriteContext);
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
        showSnackbar('Failed to update profile');
      });
  };

  const handleResetPassword = () => {
    appwrite.resetUserPassword({oldPassword, newPassword}, showSnackbar)
      .then((response) => {
        if (response) {
          showSnackbar('Password updated successfully');
          setOldPassword('');
          setNewPassword('');
        }
      })
      .catch(e => {
        console.log(e);
        showSnackbar('Failed to update password');
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

        {/* Reset Password Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>OLD PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter old password"
            placeholderTextColor="#C0C0C0"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NEW PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#C0C0C0"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleResetPassword}>
          <Text style={styles.updateButtonText}>RESET PASSWORD</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={() => {
          handleUpdateUserName();
          handleUpdateUserEmail();
        }}>
          <Text style={styles.updateButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
});

export default Profile;
