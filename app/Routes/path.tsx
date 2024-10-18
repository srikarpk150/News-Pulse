import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from '../screens/signup'; 
import Login from '../screens/login'; 
import Home from '../screens/Home'; 

export type RouteParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RouteParamList>();

type RouteStackProps = {
  initialRoute: keyof RouteParamList;
};

export const RouteStack: React.FC<RouteStackProps> = ({ initialRoute }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={Signup} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      
    </Stack.Navigator>
  );
};
