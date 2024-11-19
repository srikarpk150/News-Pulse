import React, { useContext, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {TrendingStackNavigator} from './trendingnav';
import { ProfileStackNavigator } from './profilenav';
import {BrowseStackNavigator} from './browsenav';
import { HomeStackNavigator } from './homnav';
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
  const LogoutComponent = () => null;

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
    initialRouteName="Home"
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
        tabBarActiveTintColor: '#FF4500',
        tabBarInactiveTintColor: '#A9A9A9',
        tabBarStyle: {
          backgroundColor: '#121212',
          paddingBottom: 10,
          height: 70,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      <Tab.Screen name="Browse" component={BrowseStackNavigator} />
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Trending" component={TrendingStackNavigator} />
      <Tab.Screen
        name="Logout"
        component={LogoutComponent}
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
