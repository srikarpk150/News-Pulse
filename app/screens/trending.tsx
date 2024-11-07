import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import NewsService from '../newsapi/apicalls';

type TrendingScreenProps = NativeStackScreenProps<RouteParamList, 'Trending'>;

type UserObj = {
  name: string;
  email: string;
};

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  urlToImage?: string;
};

const Trending = ({ navigation }: TrendingScreenProps) => {
  const [userData, setUserData] = useState<UserObj>();
  const [newsData, setNewsData] = useState<Record<string, NewsArticle[]>>({});
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);

  useEffect(() => {
    appwrite.getCurrentUser()
      .then(response => {
        if (response) {
          setIsLoggedIn(true);
          setUserData({
            name: response.name,
            email: response.email
          });
        }
      });
  }, [appwrite]);

  useEffect(() => {
    const fetchNewsData = async () => {
      const newsService = new NewsService();
      const categoryData: Record<string, NewsArticle[]> = {};

      try {
        const response = await newsService.getTrendingNewsFromAPI();
        if (response) {
          for (const [category, articles] of Object.entries(response)) {
            categoryData[category] = articles.slice(0, 20);
          }
        }
        setNewsData(categoryData);
      } catch (error) {
        console.log("Failed to fetch news:", error);
      }
    };
    fetchNewsData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Trending News</Text>

          <View style={styles.newsContainer}>
            {Object.keys(newsData).map((category) => (
              <View key={category} style={styles.articleCategoryContainer}>
                <Text style={styles.sectionTitle}>{category}</Text>
                <ScrollView horizontal contentContainerStyle={styles.horizontalScrollContent}>
                  {newsData[category].map((article, index) => (
                    <View key={index} style={styles.articleContainer}>
                      {article.urlToImage ? (
                        <Image
                          source={{ uri: encodeURI(article.urlToImage) }}
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
                  ))}
                </ScrollView>
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
    backgroundColor: '#121212',  // Dark background
  },
  contentWrapper: {
    flex: 1, 
  },
  scrollContent: {
    paddingVertical: 25,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FF4500',
    textAlign: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4500',
    marginBottom: 12,
  },
  newsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  articleCategoryContainer: {
    width: '100%',
    marginBottom: 24,
  },
  horizontalScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  articleContainer: {
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 10,
    width: 300,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  articleTextContainer: {
    flex: 1,
    marginTop: 10,
  },
  articleImageSmall: {
    width: 180,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  articleDate: {
    fontSize: 12,
    color: '#A9A9A9',
    textAlign: 'center',
  },
});

export default Trending;
