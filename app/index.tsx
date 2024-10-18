import React, { useContext, useEffect, useState } from 'react';
import { AppwriteContext } from './appwrite/appwritecontext';
import Loading from '../components/loading';
import { NavigationContainer } from '@react-navigation/native';
import { RouteStack } from './Routes/path';

export default function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { appwrite, isLoggedIn, setIsLoggedIn } = useContext(AppwriteContext);

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

    if (isLoading) {
        return <Loading />;
    }

    console.log(isLoggedIn ? 'Navigating to Home' : 'Navigating to Login');
    
    return (
        <NavigationContainer independent = {true}>
            <RouteStack initialRoute = {isLoggedIn ? 'Home' : 'Login'} />
        </NavigationContainer>
    );
}
