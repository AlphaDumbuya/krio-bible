import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Ionicons name="book" size={60} color="#1a472a" />
          </View>
          <Text style={styles.title}>Krio Audio Bible</Text>
          <Text style={styles.subtitle}>
            New Life in Christ Ministry{'\n'}
            Kossoh Town Chapter
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Ionicons name="book" size={40} color="#1a472a" />
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeText}>
            Listen to God's Word in Krio language. Select from the Old Testament or New Testament below.
          </Text>
        </View>

        {/* Testament Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.testamentButton, styles.oldTestamentButton]}
            onPress={() => navigation.navigate('BooksList', { testament: 'Old' })}
          >
            <Ionicons name="book-outline" size={40} color="#fff" />
            <Text style={styles.buttonTitle}>Old Testament</Text>
            <Text style={styles.buttonSubtitle}>39 Books</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testamentButton, styles.newTestamentButton]}
            onPress={() => navigation.navigate('BooksList', { testament: 'New' })}
          >
            <Ionicons name="book" size={40} color="#fff" />
            <Text style={styles.buttonTitle}>New Testament</Text>
            <Text style={styles.buttonSubtitle}>27 Books</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="heart" size={16} color="#666" />
          <Text style={styles.footerText}>
            Made with love for New Life in Christ Ministry
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    marginBottom: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a472a',
    marginTop: 15,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  testamentButton: {
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  oldTestamentButton: {
    backgroundColor: '#2d5f3f',
  },
  newTestamentButton: {
    backgroundColor: '#1a472a',
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#d0e8d8',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});
