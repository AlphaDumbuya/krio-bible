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
import { BIBLE_BOOKS } from '../data/bibleData';

export default function BooksListScreen({ route, navigation }) {
  const { testament } = route.params;
  const books = testament === 'Old' ? BIBLE_BOOKS.oldTestament : BIBLE_BOOKS.newTestament;

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('ChaptersList', { book: item })}
    >
      <View style={styles.bookIcon}>
        <Ionicons name="book-outline" size={24} color="#1a472a" />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{item.name}</Text>
        <Text style={styles.bookChapters}>{item.chapters} Chapters</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
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
        <Text style={styles.headerTitle}>{testament} Testament</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  placeholder: {
    width: 34,
  },
  listContent: {
    padding: 15,
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 14,
    color: '#666',
  },
});
