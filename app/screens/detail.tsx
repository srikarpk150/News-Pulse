import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, Share, ScrollView } from 'react-native';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title Component */}
        <View style={styles.titleContainer}>
          <Title />
        </View>
        
        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>{article.title}</Text>
          {article.urlToImage && (
            <Image source={{ uri: article.urlToImage }} style={styles.image} />
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
        </ScrollView>
        
        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Icon name="share-social" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  titleContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
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
    width: '90%',
    height: 200,
    borderRadius: 10,
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
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#333333',
    borderRadius: 20,
  },
});

export default Detail;
