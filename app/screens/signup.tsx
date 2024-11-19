import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, Pressable } from 'react-native';
import React, { useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import Title from '@/components/title';
import { Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type SignupScreenProps = NativeStackScreenProps<RouteParamList, 'Signup'>

const Signup = ({ navigation }: SignupScreenProps) => {
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext)
  const [error, setError] = useState<string>('') 
  const [name, setName] = useState<string>('') 
  const [email, setEmail] = useState<string>('') 
  const [password, setPassword] = useState<string>('') 
  const [repeatPassword, setRepeatPassword] = useState<string>('') 
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPassword = (password: string): boolean => {
    return password.length >= 8
  }

  const handleSignup = () => {
    if (
      name.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      repeatPassword.length < 1
    ) {
      setError('All fields are required');
      showSnackbar('All fields are required');
    } else if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      showSnackbar('Please enter a valid email address');
    } else if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long');
      showSnackbar('Password must be at least 8 characters long');
    } else if (password !== repeatPassword) {
      setError('Passwords do not match');
      showSnackbar('Passwords do not match');
    } else {
      setIsLoading(true)
      const user = {
        email,
        password,
        name,
      };
      appwrite
        .createAccount(user, showSnackbar)
        .then((response: any) => {
          if (response) {
            setIsLoggedIn(true);
            showSnackbar('Signup successful!');
            navigation.replace('TabNav')
          }
        })
        .catch(e => {
          console.log(e);
          setError(e.message);
          showSnackbar(e.message);
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}>
      <Pressable 
        style={styles.container} 
        onPress={Keyboard.dismiss}
      >
        <View style={styles.formContainer}>
          <Title />
          
          <TextInput
            value={name}
            onChangeText={text => {
              setError('');
              setName(text);
            }}
            placeholderTextColor={styles.inputPlaceholder.color}
            placeholder="Name"
            style={styles.input}
          />

          <TextInput
            value={email}
            keyboardType="email-address"
            onChangeText={text => {
              setError('');
              setEmail(text);
            }}
            placeholderTextColor={styles.inputPlaceholder.color}
            placeholder="Email"
            style={styles.input}
          />

          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={text => {
                setError('');
                setPassword(text);
              }}
              placeholderTextColor={styles.inputPlaceholder.color}
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.inputWithIcon}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#A9A9A9"
              />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={repeatPassword}
              onChangeText={text => {
                setError('');
                setRepeatPassword(text);
              }}
              placeholderTextColor={styles.inputPlaceholder.color}
              placeholder="Repeat Password"
              secureTextEntry={!showRepeatPassword}
              style={styles.inputWithIcon}
            />
            <Pressable
              style={styles.eyeIcon}
              onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
              <Ionicons
                name={showRepeatPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#A9A9A9"
              />
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}


          <Pressable
            onPress={handleSignup}
            disabled={isLoading}
            style={[
              styles.btn,
              { marginTop: error ? 10 : 20 },
              isLoading && styles.btnDisabled
            ]}>
            <Text style={styles.btnText}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.loginContainer}>
            <Text style={styles.haveAccountLabel}>
              Already have an account?{'  '}
              <Text style={styles.loginLabel}>Login</Text>
            </Text>
          </Pressable>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_SHORT}
          action={{
            label: 'Close',
            onPress: () => setSnackbarVisible(false),
          }}>
          {snackbarMessage}
        </Snackbar>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  formContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
    paddingHorizontal: 30,
  },
  appName: {
    color: '#FF4500',
    fontSize: 42,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 50,
    alignSelf: 'center',
    borderRadius: 8,
    width: '100%',
    color: '#FFFFFF',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  inputPlaceholder: {
    color: '#A9A9A9',
  },
  errorText: {
    color: '#D32F2F',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    alignSelf: 'center',
    borderRadius: 8,
    width: '100%',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnText: {
    color: '#FFFFFF',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  loginContainer: {
    marginTop: 60,
    alignSelf: 'center',
  },
  haveAccountLabel: {
    color: '#A9A9A9',
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  loginLabel: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.7,
    backgroundColor: '#666',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 15,
  },
  inputWithIcon: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingRight: 50,
    height: 50,
    alignSelf: 'center',
    borderRadius: 8,
    width: '100%',
    color: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});

export default Signup;
