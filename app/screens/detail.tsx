import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RouteParamList } from '../Routes/path';


type DetailScreenRouteProp = RouteProp<RouteParamList, 'Detail'>;


const Detail = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { article } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{article.title}</Text>
      <Text style={styles.content}>{article.description}</Text>
      <Text style={styles.date}>Published on: {new Date(article.publishedAt).toLocaleDateString()}</Text>
    </View>
  );
};

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
});

// Export the Detail component
export default Detail;