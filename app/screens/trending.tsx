import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView  } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import {AppwriteContext} from '../appwrite/appwritecontext'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import NewsService from '../newsapi/apicalls';
import TabNav from '../Routes/bottomnav';

type HomeScreenProps = NativeStackScreenProps<RouteParamList, 'Trending'>

type UserObj = {
  name: String;
  email: String;
}

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
};

const Trending = ({ navigation }: HomeScreenProps) => {
  const [userData, setUserData] = useState<UserObj>()
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const {appwrite, setIsLoggedIn} = useContext(AppwriteContext)
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleLogout = () => {
    appwrite.logout(showSnackbar)
    .then(() => {
      setIsLoggedIn(false);
      showSnackbar('Logout Successful');
      navigation.navigate('Login')
    })
  }

  useEffect(() => {
    appwrite.getCurrentUser()
    .then(response => {
      if (response) {
        const user: UserObj = {
          name: response.name,
          email: response.email
        }
        setIsLoggedIn(true);
        setUserData(user)
      }
    })
  }, [appwrite])
  
  useEffect(() => {
    (async () => {
        const newsService = new NewsService();
        try {
            const response = await newsService.getNewsFromAPI();
            if (response && response.articles) {
              setNewsData(response.articles);}
        } catch (error) {
            console.log("Failed to fetch news:", error);
        }
    })();
}, []);

  return (
<SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.message}>NEWS PULSE</Text>

          {/* User Details */}
          {userData && (
            <View style={styles.userContainer}>
              <Text style={styles.userDetails}>Name: {userData.name}</Text>
              <Text style={styles.userDetails}>Email: {userData.email}</Text>
            </View>
          )}

          <View style={styles.newsContainer}>
            {newsData.slice(0, 20).map((article, index) => (
              <View key={index} style={styles.articleContainer}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDescription}>{article.description}</Text>
                <Text style={styles.articleDate}>Published on: {new Date(article.publishedAt).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D32',
  },
  contentWrapper: {
    flex: 1, 
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  message: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 16,
  },
  userContainer: {
    backgroundColor: '#1C1F3D',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  userDetails: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  newsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  articleContainer: {
    backgroundColor: '#1C1F3D',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 4,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  articleDescription: {
    fontSize: 16,
    color: '#C0C0C0',
  },
  articleDate: {
    fontSize: 14,
    color: '#A9A9A9',
    marginTop: 8,
  },
});

export default Trending;