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
import ResetPassword from '../screens/resetpassword';


type NewsArticle = {
  url: string;
  title: string;
  author?: string;
  content?: string;
  urlToImage?: string;
  description: string;
  publishedAt: string;
  source?: { id?: string; name: string;};
};

export type RouteParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Browse: undefined;
  Logout: undefined;
  TabNav: undefined;
  Profile:undefined;
  Trending: undefined;
  HomeScreen: undefined;
  BrowseScreen:undefined;
  ResetPassword:undefined;
  ProfileScreen:undefined;
  TrendingScreen:undefined;
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
        name="HomeScreen" 
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
        name="TrendingScreen" 
        component={Trending} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="ProfileScreen" 
        component={Profile} 
        options={{
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="BrowseScreen" 
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
