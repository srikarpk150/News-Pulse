import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AppwriteContext } from '../appwrite/appwritecontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteParamList } from '../Routes/path';
import NewsService from '../newsapi/apicalls';
import Title from '@/components/title';

type BrowseScreenProps = NativeStackScreenProps<RouteParamList, 'Browse'>;

type UserObj = {
  name: String;
  email: String;
};

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
};

const Browse = ({ navigation }: BrowseScreenProps) => {
  const [userData, setUserData] = useState<UserObj>();
  const [newsData, setNewsData] = useState<Record<string, NewsArticle[]>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const categories = [
    "Corporate/Industry Events",
    "Ideas Festivals",
    "Political Events",
    "Social Events",
    "Lifestyle Expos",
    "Cultural Events",
    "Galas and Awards",
    "Education and Training Workshops",
    "Listening and Community Events",
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const updatedCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];

      saveCategoriesToDatabase(updatedCategories);
      return updatedCategories;
    });
  };

  const saveCategoriesToDatabase = async (categories: string[]) => {
    try {
      const user = await appwrite.getCurrentUser();
      if (user && user.$id) {
        const userId = user.$id;
  
        if (documentId) {
          await appwrite.savepreferences(
            {
              documentid: documentId,
              userid: userId,
              categories: { interested_categories: categories },
            },
            showSnackbar
          );
        } else {
          const response = await appwrite.createpreferences(
            {
              userid: userId,
              categories: { interested_categories: categories },
            },
            showSnackbar
          );
  
          if (response && response.$id) {
            setDocumentId(response.$id);
          } else {
            console.log('Error: response from createpreferences is undefined');
          }
        }
  
        showSnackbar("Preferences updated successfully");
      }
    } catch (error) {
      console.log('Error saving categories:', error);
    }
  };

  const loadSavedCategories = async () => {
    try {
        const user = await appwrite.getCurrentUser();
        if (user && user.$id) {
            const userId = user.$id;
            const response = await appwrite.getpreferences(
                { userid: userId },
                showSnackbar
            );

            if (response) {
                setSelectedCategories(response.interested_categories);
                setDocumentId(response.$id);
            } else {
                setSelectedCategories([]);
                setDocumentId(null);
            }
        }
    } catch (error) {
        console.log('Error fetching saved categories:', error);
    }
  };

  useEffect(() => {
    appwrite.getCurrentUser()
      .then(response => {
        if (response) {
          const user: UserObj = {
            name: response.name,
            email: response.email
          };
          setIsLoggedIn(true);
          setUserData(user);
          loadSavedCategories();
        }
      });
  }, [appwrite]);

  useEffect(() => {
    const fetchNewsData = async () => {
      const newsService = new NewsService();
      const categoryData: Record<string, NewsArticle[]> = {};

      try {
        for (const category of selectedCategories) {
          const response = await newsService.getCategoryNewsFromAPI([category]);
          if (response && response[category]) {
            categoryData[category] = response[category].slice(0, 20);
          }
        }
        setNewsData(categoryData);
      } catch (error) {
        console.log("Failed to fetch news:", error);
      }
    };

    if (selectedCategories.length > 0) {
      fetchNewsData();
    }
  }, [selectedCategories]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Title />

          <Text style={styles.sectionTitle}>Select Categories:</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => toggleCategory(category)} 
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.categoryButtonSelected
                ]}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.newsContainer}>
            {Object.keys(newsData).map((category) => (
              <View key={category} style={styles.articleCategoryContainer}>
                <Text style={styles.sectionTitle}>{category}</Text>
                <ScrollView horizontal >
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF4500',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#2A2E43',
    margin: 6,
  },
  categoryButtonSelected: {
    backgroundColor: '#FF4500',
  },
  categoryText: {
    color: '#E0E0E0',
    fontSize: 15,
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
    flexWrap: 'nowrap',
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
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Browse;
