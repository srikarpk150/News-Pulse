import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Share, ScrollView, Linking } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RouteParamList } from '../Routes/path';
import Title from '@/components/title';
import Icon from 'react-native-vector-icons/Ionicons';

type DetailScreenRouteProp = RouteProp<RouteParamList, 'Detail'>;

const Detail = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { article } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.description}\n\nRead more: ${article.url}`,
      });
    } catch (error) {
      console.log('Error sharing article:', error);
    }
  };

  const visitPage = () => {
    if (article.url) {
      Linking.openURL(article.url).catch((err) => console.error("Couldn't open the URL:", err));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Component */}
        <View style={styles.titleContainer}>
          <Title />
        </View>

        {/* Article Content */}
        <Text style={styles.header}>{article.title}</Text>
        {article.urlToImage && (
          <Image source={{ uri: article.urlToImage }} style={styles.image} resizeMode="contain" />
        )}
        {article.author && <Text style={styles.author}>By: {article.author}</Text>}
        {article.source?.name && <Text style={styles.source}>Source: {article.source.name}</Text>}

        <Text style={styles.description}>{article.description}</Text>

        {article.content && (
          <Text style={styles.fullContent}>{article.content}</Text>
        )}

        <Text style={styles.date}>
          Published on: {new Date(article.publishedAt).toLocaleDateString()}
        </Text>

        {/* Visit Page Button */}
        <TouchableOpacity style={styles.visitButton} onPress={visitPage}>
          <Text style={styles.visitButtonText}>Visit Full Article</Text>
        </TouchableOpacity>

        {/* Back and Share Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name="share-social-outline" size={24} color="#FF4500" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF4500',
    textAlign: 'center',
    marginBottom: 12,
  },
  author: {
    fontSize: 16,
    color: '#A9A9A9',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 5,
  },
  source: {
    fontSize: 14,
    color: '#A9A9A9',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  fullContent: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#A9A9A9',
    textAlign: 'center',
    marginTop: 10,
  },
  visitButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF4500',
    alignItems: 'center',
  },
  visitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#FF4500',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    padding: 10,
  },
});

export default Detail;
