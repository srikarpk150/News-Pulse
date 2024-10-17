import React, { useContext, useEffect, useState } from 'react'
import {AppwriteContext} from './appwrite/appwritecontext';
import Loading from '../components/loading';
import { AppStack } from './Routes/mainapp';
import { AuthStack } from './Routes/Auth';

export default function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const {appwrite, isLoggedIn,setIsLoggedIn} = useContext(AppwriteContext)

    
    useEffect(() => {
      appwrite
      .getCurrentUser()
      .then(response => {
        setIsLoading(false)
        if (response) {
            setIsLoggedIn(true)
        }
      })
      .catch(_ => {
        setIsLoading(false)
        setIsLoggedIn(false)
      })
    }, [appwrite, setIsLoggedIn])
    
    if (isLoading) {
        return <Loading />
    }

    console.log(isLoggedIn ? 'Rendering AppStack' : 'Rendering AuthStack');
    return isLoggedIn ? <AppStack /> : <AuthStack />;
}
