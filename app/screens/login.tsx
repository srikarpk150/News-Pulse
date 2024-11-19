import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Snackbar } from 'react-native-paper';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import Title from '@/components/title';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenProps = NativeStackScreenProps<RouteParamList, 'Login'>
SplashScreen.preventAutoHideAsync();

const Login = ({ navigation }: LoginScreenProps) => {
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [fontsLoaded] = useFonts({
    TimesNewRoman: require('@/assets/fonts/TimesNewRoman.ttf'),
  });
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError('');
    
    const trimmedEmail = email.trim();
    if (trimmedEmail.length < 1 || password.length < 1) {
      setError('All fields are required');
      showSnackbar('All fields are required');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      showSnackbar('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      showSnackbar('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await appwrite.login({ email: trimmedEmail, password }, showSnackbar);
      if (response) {
        setIsLoggedIn(true);
        navigation.replace('TabNav');
        showSnackbar('Login Success');
      }
    } catch (e) {
      console.log(e);
      setError('Incorrect email or password');
      showSnackbar('Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.formContainer}>
        <Title />

        <TextInput
          ref={emailRef}
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
          placeholderTextColor={styles.inputPlaceholder.color}
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={text => setPassword(text)}
            placeholderTextColor={styles.inputPlaceholder.color}
            placeholder="Password"
            style={[styles.input, styles.passwordInput]}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <Pressable 
            style={styles.passwordVisibilityButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="#A9A9A9" 
            />
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable 
          onPress={handleLogin} 
          style={[
            styles.btn, 
            { marginTop: error ? 10 : 20 },
            isLoading && styles.btnDisabled
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>Login</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Signup')} style={styles.signUpContainer}>
          <Text style={styles.noAccountLabel}>
            Don't have an account?{'  '}
            <Text style={styles.signUpLabel}>Create an account</Text>
          </Text>
        </Pressable>

        <Text style={styles.passwordRecoveryText}>
          Forgot your password? Contact us at  
          <Text style={styles.emailHighlight}> Newspulse@gmail.com</Text>.
        </Text>
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
    </KeyboardAvoidingView>
  );
};

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
  signUpContainer: {
    marginTop: 60,
    alignSelf: 'center',
  },
  noAccountLabel: {
    color: '#A9A9A9',
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  signUpLabel: {
    color: '#FF4500',
    fontWeight: 'bold',
  },
  passwordRecoveryText: {
    color: '#A9A9A9',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  emailHighlight: {
    color: '#FF4500', 
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.25,
  },
  btnDisabled: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 15,
  },
  passwordInput: {
    marginTop: 0,
    paddingRight: 50,
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
