import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Trending from '../screens/trending';
import Profile from '../screens/profile';
import Browse from '../screens/browse';
import {HomeStackNavigator} from './homnav'
import { AppwriteContext } from '../appwrite/appwritecontext';
import { RouteParamList } from '../Routes/path';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<RouteParamList>();

type TabNavProps = CompositeScreenProps<
  BottomTabScreenProps<RouteParamList, 'TabNav'>,
  NativeStackScreenProps<RouteParamList>
>;

export default function TabNav({ navigation }: TabNavProps) {
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogout = () => {
    appwrite.logout(showSnackbar).then(() => {
      setIsLoggedIn(false);
      showSnackbar('Logout Successful');
      navigation.navigate('Login');
    });
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home" | "home-outline" 
            | "trending-up" | "trending-up-outline"
            | "person" | "person-outline"
            | "search" | "search-outline"
            | "exit" | "exit-outline" = "home-outline";

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Trending':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Browse':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Logout':
              iconName = focused ? 'exit' : 'exit-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f02e65',
        tabBarInactiveTintColor: '#a9a9a9',
        tabBarStyle: {
          backgroundColor: '#1C1F3D',
          paddingBottom: 5,
          height: 60,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 5,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Trending" component={Trending} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Browse" component={Browse} />
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tab.Navigator>
  );
}
