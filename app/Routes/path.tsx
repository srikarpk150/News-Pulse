import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from '../screens/signup';
import Login from '../screens/login';


export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
  };