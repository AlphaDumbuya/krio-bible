import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

export default function AudioPlayerScreen({ route, navigation }) {
  const { book, chapter } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio file path - adjust based on your file structure
  const audioPath = `../../../Krio audio bible new testament/${book.name}/${book.id}_${chapter}.mp3`;

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        // For now using a placeholder - you'll need to link to actual audio files
        { uri: audioPath },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not load audio file. Please ensure the audio file exists.');
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const playPauseAudio = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setPosition(0);
    }
  };

  const skipForward = async () => {
    if (sound && duration > 0) {
      const newPosition = Math.min(position + 15000, duration);
      await sound.setPositionAsync(newPosition);
    }
  };

  const skipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(position - 15000, 0);
      await sound.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const goToNextChapter = () => {
    if (chapter < book.chapters) {
      navigation.replace('AudioPlayer', { book, chapter: chapter + 1 });
    }
  };

  const goToPreviousChapter = () => {
    if (chapter > 1) {
      navigation.replace('AudioPlayer', { book, chapter: chapter - 1 });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{book.name}</Text>
          <Text style={styles.headerSubtitle}>Chapter {chapter}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.playerContainer}>
        {/* Album Art */}
        <View style={styles.albumArt}>
          <Ionicons name="book" size={80} color="#fff" />
        </View>

        {/* Chapter Info */}
        <Text style={styles.chapterTitle}>Chapter {chapter}</Text>
        <Text style={styles.bookTitle}>{book.name}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' },
              ]}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={goToPreviousChapter}
            disabled={chapter === 1}
          >
            <Ionicons
              name="play-skip-back"
              size={32}
              color={chapter === 1 ? '#666' : '#1a472a'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <Ionicons name="play-back" size={32} color="#1a472a" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={playPauseAudio}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={48}
                color="#fff"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <Ionicons name="play-forward" size={32} color="#1a472a" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={goToNextChapter}
            disabled={chapter === book.chapters}
          >
            <Ionicons
              name="play-skip-forward"
              size={32}
              color={chapter === book.chapters ? '#666' : '#1a472a'}
            />
          </TouchableOpacity>
        </View>

        {/* Stop Button */}
        <TouchableOpacity style={styles.stopButton} onPress={stopAudio}>
          <Ionicons name="stop-circle-outline" size={24} color="#666" />
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#d0e8d8',
    marginTop: 2,
  },
  placeholder: {
    width: 34,
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: '#2d5f3f',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  chapterTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 20,
    color: '#d0e8d8',
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#2d5f3f',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#d0e8d8',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2d5f3f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
  stopButtonText: {
    fontSize: 16,
    color: '#d0e8d8',
  },
});
