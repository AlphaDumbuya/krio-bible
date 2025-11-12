import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChaptersListScreen({ route, navigation }) {
  const { book } = route.params;
  
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterCard}
      onPress={() => navigation.navigate('AudioPlayer', { book, chapter: item })}
    >
      <View style={styles.chapterNumber}>
        <Text style={styles.chapterNumberText}>{item}</Text>
      </View>
      <Ionicons name="play-circle" size={32} color="#1a472a" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a472a" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{book.name}</Text>
          <Text style={styles.headerSubtitle}>{book.chapters} Chapters</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 34,
  },
  listContent: {
    padding: 15,
  },
  chapterCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
  },
  chapterNumber: {
    marginBottom: 10,
  },
  chapterNumberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
  },
});
