import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from '../screens/signup'; 
import Login from '../screens/login'; 
import Home from '../screens/Home'
import Trending from '../screens/trending';
import Profile from '../screens/profile';
import Browse from '../screens/browse';
import Detail from '../screens/detail';
import TabNav from './bottomnav';


type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
};

export type RouteParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Trending: undefined;
  Profile:undefined;
  Browse: undefined;
  Logout: undefined;
  TabNav: undefined;
  HomeScreen: undefined;
  Detail: { article: NewsArticle }
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
      <Stack.Screen 
        name="Trending" 
        component={Trending} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Browse" 
        component={Browse} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="TabNav" 
        component={TabNav} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Detail" 
        component={Detail} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      
    </Stack.Navigator>
  );
};
