import React, { useContext, useEffect, useState } from 'react';
import { AppwriteProvider, AppwriteContext } from './appwrite/appwritecontext';
import Loading from '../components/loading';
import { NavigationContainer } from '@react-navigation/native';
import { RouteStack } from './Routes/path';
import * as Font from 'expo-font';

const AppContent = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { appwrite, isLoggedIn, setIsLoggedIn } = useContext(AppwriteContext);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    'TimesNewRoman': require('../assets/fonts/TimesNewRoman.ttf'),
                });
                setFontsLoaded(true);
            } catch (e) {
                console.error(e);
            }
        };

        loadFonts();
    }, []);

    useEffect(() => {
        appwrite
            .getCurrentUser()
            .then(response => {
                setIsLoading(false);
                if (response) {
                    setIsLoggedIn(true);
                }
            })
            .catch(_ => {
                setIsLoading(false);
                setIsLoggedIn(false);
            });
    }, [appwrite, setIsLoggedIn]);

    if (isLoading || !fontsLoaded) {
        return <Loading />;
    }

    console.log(isLoggedIn ? 'Navigating to Home' : 'Navigating to Login');
    
    return (
        <NavigationContainer independent={true}>
            <RouteStack initialRoute={isLoggedIn ? 'TabNav' : 'Login'} />
        </NavigationContainer>
    );
};

export default function App() {
    return (
        <AppwriteProvider>
            <AppContent />
        </AppwriteProvider>
    );
}
