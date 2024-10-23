import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { Snackbar } from 'react-native-paper'
import { AppwriteContext } from '../appwrite/appwritecontext'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';


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

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };


  const handleSignup = () => {
    if (
      name.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      repeatPassword.length < 1
    ) {
      setError('All fields are required');
      showSnackbar('All fields are required');
    } else if (password !== repeatPassword) {
      setError('Passwords do not match');
      showSnackbar('Passwords do not match');
    } else {
      
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
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.appName}>News Pulse</Text>

        {/* Name */}
        <TextInput
          value={name}
          onChangeText={text => {
            setError('');
            setName(text);
          }}
          placeholderTextColor={'#AEAEAE'}
          placeholder="Name"
          style={styles.input}
        />

        {/* Email */}
        <TextInput
          value={email}
          keyboardType="email-address"
          onChangeText={text => {
            setError('');
            setEmail(text);
          }}
          placeholderTextColor={'#AEAEAE'}
          placeholder="Email"
          style={styles.input}
        />

        {/* Password */}
        <TextInput
          value={password}
          onChangeText={text => {
            setError('');
            setPassword(text);
          }}
          placeholderTextColor={'#AEAEAE'}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />

        {/* Repeat password */}
        <TextInput
          secureTextEntry
          value={repeatPassword}
          onChangeText={text => {
            setError('');
            setRepeatPassword(text);
          }}
          placeholderTextColor={'#AEAEAE'}
          placeholder="Repeat Password"
          style={styles.input}
        />

        {/* Validation error */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Signup button */}
        <Pressable
          onPress={handleSignup}
          style={[styles.btn, { marginTop: error ? 10 : 20 }]}>
          <Text style={styles.btnText}>Sign Up</Text>
        </Pressable>

        {/* Login navigation */}
        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={styles.loginContainer}>
          <Text style={styles.haveAccountLabel}>
            Already have an account?{'  '}
            <Text style={styles.loginLabel}>Login</Text>
          </Text>
        </Pressable>
      </View>

      {/* React Native Paper Snackbar */}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
    paddingHorizontal: 30,
  },
  appName: {
    color: '#E91E63',
    fontSize: 42,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 50,
    alignSelf: 'center',
    borderRadius: 8,
    width: '100%',
    color: '#333333',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  errorText: {
    color: '#D32F2F',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    alignSelf: 'center',
    borderRadius: 8,
    width: '100%',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
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
    color: '#757575',
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  loginLabel: {
    color: '#1E88E5',
    fontWeight: 'bold',
  },
});


export default Signup;
