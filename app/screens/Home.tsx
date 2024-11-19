import { StyleSheet, Text, View, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import React, { useContext, useState, useEffect, useMemo } from 'react';
import Title from '@/components/title';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import NewsService from '../newsapi/apicalls';

type HomeScreenProps = NativeStackScreenProps<RouteParamList, 'HomeScreen'>;

type UserObj = {
  name: String;
  email: String;
};

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


const Home = ({ navigation }: HomeScreenProps) => {
  const [userData, setUserData] = useState<UserObj>();
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    appwrite.getCurrentUser().then((response) => {
      if (response) {
        const user: UserObj = {
          name: response.name,
          email: response.email,
        };
        setIsLoggedIn(true);
        setUserData(user);
      }
    });
  }, [appwrite]);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const newsService = new NewsService();
        const response = await newsService.getNewsFromAPI();
        if (response && response.articles) {
          setNewsData(response.articles);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => 
    newsData
      .filter(article => article.urlToImage && article.urlToImage.trim() !== "")
      .slice(0, 25),
    [newsData]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title></Title>
          {userData && (
            <View>
              <Text style={styles.welcomeMessage}>Welcome, {userData.name}!</Text>
              <Text style={styles.welcomeSubMessage}>Stay updated with the latest news tailored just for you.</Text>
            </View>
          )}



          <View style={styles.newsContainer}>
            {filteredNews.map((article, index) => (
              <Pressable
                key={index}
                style={[styles.articleContainer, index === 0 && styles.firstArticle]}
                onPress={() => navigation.navigate('Detail', { article, })}>
                {index === 0 ? (
                  article.urlToImage ? (
                    <View>
                      <Image
                        source={{ uri: encodeURI(article.urlToImage) }}
                        style={styles.articleImageLarge}
                        resizeMode="cover"
                      />
                      <Text style={styles.articleTitleLarge}>{article.title}</Text>
                      <Text style={styles.articleDescriptionLarge}>{article.description}</Text>
                    </View>
                  ) : null
                ) : (
                  <View style={styles.articleRow}>
                    {article.urlToImage ? (
                      <Image
                        source={{ uri: article.urlToImage }}
                        style={styles.articleImageSmall}
                        resizeMode="cover"
                      />
                    ) : null}
                    <View style={styles.articleTextContainer}>
                      <Text style={styles.articleTitle}>{article.title}</Text>
                      <Text style={styles.articleDate}>
                        Published on: {new Date(article.publishedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                )}
              </Pressable>
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
    backgroundColor: '#121212',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 25,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  message: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 18,
    letterSpacing: 0.5,
    fontFamily: 'TimesNewRoman',
  },
  welcomeMessage: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 10,
    letterSpacing: 0.3,
  },
  welcomeSubMessage: {
    fontSize: 15,
    color: '#C0C0C0',
    fontWeight: '400',
    textAlign: 'left',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  newsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  articleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
    paddingVertical: 15,
    width: '95%',
    alignItems: 'flex-start',
  },
  firstArticle: {
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FF4500',
  },
  articleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  articleImageLarge: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  articleImageSmall: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  articleTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 22,
  },
  articleTitleLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 12,
    lineHeight: 26,
  },
  articleDescriptionLarge: {
    fontSize: 17,
    color: '#C0C0C0',
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  articleDate: {
    fontSize: 13,
    color: '#A9A9A9',
    marginTop: 8,
    lineHeight: 18,
  },
});


export default Home;
