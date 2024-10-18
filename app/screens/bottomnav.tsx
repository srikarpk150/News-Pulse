import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Signup from '../screens/signup'; 
import Login from '../screens/login'; 
import Home from './home'; 

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component = {Home as any}
                options={{
                    headerShown: false,
                    tabBarActiveTintColor: '#DA3349',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={30} />)
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
