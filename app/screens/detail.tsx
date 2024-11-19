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

        <View style={styles.sourceDateContainer}>
          <Text style={styles.source}>{article.source?.name}</Text>
          <Text style={styles.date}>
            Published on: {new Date(article.publishedAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.description}>{article.description}</Text>

        {article.content && (
          <Text style={styles.fullContent}>{article.content}</Text>
        )}

        {/* Subtle View Full Article Option */}
        <TouchableOpacity style={styles.viewArticleLink} onPress={visitPage}>
          <Icon name="link-outline" size={18} color="#FF4500" />
          <Text style={styles.viewArticleLinkText}>View Full Article</Text>
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
    fontSize: 24,
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
  sourceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  source: {
    fontSize: 14,
    color: '#A9A9A9',
  },
  date: {
    fontSize: 14,
    color: '#A9A9A9',
    fontStyle: 'italic',
  },
  image: {
    width: '100%',
    height: 200,
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
  viewArticleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  viewArticleLinkText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF4500',
    fontWeight: '600',
    textDecorationLine: 'underline',
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
