import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, FlatList, Alert, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';

// Bible data structure
const BIBLE_DATA = {
  oldTestament: [
    { id: '01', name: 'Genesis', chapters: 50 },
    { id: '02', name: 'Exodus', chapters: 40 },
    { id: '03', name: 'Leviticus', chapters: 27 },
    { id: '04', name: 'Numbers', chapters: 36 },
    { id: '05', name: 'Deuteronomy', chapters: 34 },
    { id: '06', name: 'Joshua', chapters: 24 },
    { id: '07', name: 'Judges', chapters: 21 },
    { id: '08', name: 'Ruth', chapters: 4 },
    { id: '09', name: '1 Samuel', chapters: 31 },
    { id: '10', name: '2 Samuel', chapters: 24 },
    { id: '11', name: '1 Kings', chapters: 22 },
    { id: '12', name: '2 Kings', chapters: 25 },
    { id: '13', name: '1 Chronicles', chapters: 29 },
    { id: '14', name: '2 Chronicles', chapters: 36 },
    { id: '15', name: 'Ezra', chapters: 10 },
    { id: '16', name: 'Nehemiah', chapters: 13 },
    { id: '17', name: 'Esther', chapters: 10 },
    { id: '18', name: 'Job', chapters: 42 },
    { id: '19', name: 'Psalms', chapters: 150 },
    { id: '20', name: 'Proverbs', chapters: 31 },
    { id: '21', name: 'Ecclesiastes', chapters: 12 },
    { id: '22', name: 'Song of Songs', chapters: 8 },
    { id: '23', name: 'Isaiah', chapters: 66 },
    { id: '24', name: 'Jeremiah', chapters: 52 },
    { id: '25', name: 'Lamentations', chapters: 5 },
    { id: '26', name: 'Ezekiel', chapters: 48 },
    { id: '27', name: 'Daniel', chapters: 12 },
    { id: '28', name: 'Hosea', chapters: 14 },
    { id: '29', name: 'Joel', chapters: 3 },
    { id: '30', name: 'Amos', chapters: 9 },
    { id: '31', name: 'Obadiah', chapters: 1 },
    { id: '32', name: 'Jonah', chapters: 4 },
    { id: '33', name: 'Micah', chapters: 7 },
    { id: '34', name: 'Nahum', chapters: 3 },
    { id: '35', name: 'Habakkuk', chapters: 3 },
    { id: '36', name: 'Zephaniah', chapters: 3 },
    { id: '37', name: 'Haggai', chapters: 2 },
    { id: '38', name: 'Zechariah', chapters: 14 },
    { id: '39', name: 'Malachi', chapters: 4 },
  ],
  newTestament: [
    { id: '40', name: 'Matthew', chapters: 28 },
    { id: '41', name: 'Mark', chapters: 16 },
    { id: '42', name: 'Luke', chapters: 24 },
    { id: '43', name: 'John', chapters: 21 },
    { id: '44', name: 'Acts', chapters: 28 },
    { id: '45', name: 'Romans', chapters: 16 },
    { id: '46', name: '1 Corinthians', chapters: 16 },
    { id: '47', name: '2 Corinthians', chapters: 13 },
    { id: '48', name: 'Galatians', chapters: 6 },
    { id: '49', name: 'Ephesians', chapters: 6 },
    { id: '50', name: 'Philippians', chapters: 4 },
    { id: '51', name: 'Colossians', chapters: 4 },
    { id: '52', name: '1 Thessalonians', chapters: 5 },
    { id: '53', name: '2 Thessalonians', chapters: 3 },
    { id: '54', name: '1 Timothy', chapters: 6 },
    { id: '55', name: '2 Timothy', chapters: 4 },
    { id: '56', name: 'Titus', chapters: 3 },
    { id: '57', name: 'Philemon', chapters: 1 },
    { id: '58', name: 'Hebrews', chapters: 13 },
    { id: '59', name: 'James', chapters: 5 },
    { id: '60', name: '1 Peter', chapters: 5 },
    { id: '61', name: '2 Peter', chapters: 3 },
    { id: '62', name: '1 John', chapters: 5 },
    { id: '63', name: '2 John', chapters: 1 },
    { id: '64', name: '3 John', chapters: 1 },
    { id: '65', name: 'Jude', chapters: 1 },
    { id: '66', name: 'Revelation', chapters: 22 },
  ],
};

// Main App component
export default function App() {
  // State declarations
  const [screen, setScreen] = useState('home');
  const [testament, setTestament] = useState('');
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [downloadedBooks, setDownloadedBooks] = useState({});
  const [downloadingBook, setDownloadingBook] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Krio Audio Bible! 📖",
      description: "Listen to the entire Bible in Krio language. Let's show you how to use the app.",
      icon: "🎧"
    },
    {
      title: "Select Testament",
      description: "Tap 'Old Testament' or 'New Testament' from the home screen to start.",
      icon: "📚"
    },
    {
      title: "Choose Book & Chapter",
      description: "Select any book, then choose a chapter to start listening.",
      icon: "📖"
    },
    {
      title: "Audio Controls",
      description: "Play, pause, skip forward/backward, and adjust playback speed.",
      icon: "🎵"
    },
    {
      title: "Download for Offline",
      description: "Go to Settings ⚙️ and tap 'Download All Books' to listen without internet!",
      icon: "📥",
      highlight: "settings"
    }
  ];

  // Render tutorial overlay - MOVED HERE TO FIX HOISTING ISSUE
  const renderTutorial = () => {
    if (!showTutorial) return null;

    const currentStep = tutorialSteps[tutorialStep];
    const isLastStep = tutorialStep === tutorialSteps.length - 1;

    return (
      <View style={styles.tutorialOverlay}>
        <View style={styles.tutorialModal}>
          <Text style={styles.tutorialIcon}>{currentStep.icon}</Text>
          <Text style={styles.tutorialTitle}>{currentStep.title}</Text>
          <Text style={styles.tutorialDescription}>{currentStep.description}</Text>
          
          <View style={styles.tutorialSteps}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.tutorialDot,
                  index === tutorialStep && styles.tutorialDotActive
                ]}
              />
            ))}
          </View>

          <View style={styles.tutorialButtons}>
            {tutorialStep > 0 && (
              <TouchableOpacity
                style={styles.tutorialBtnSecondary}
                onPress={() => setTutorialStep(tutorialStep - 1)}
              >
                <Text style={styles.tutorialBtnSecondaryText}>← Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.tutorialBtnPrimary}
              onPress={() => {
                if (isLastStep) {
                  setShowTutorial(false);
                } else {
                  setTutorialStep(tutorialStep + 1);
                }
              }}
            >
              <Text style={styles.tutorialBtnPrimaryText}>
                {isLastStep ? "Get Started" : "Next →"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.tutorialSkip}
            onPress={() => setShowTutorial(false)}
          >
            <Text style={styles.tutorialSkipText}>Skip Tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Check if user has seen tutorial
  useEffect(() => {
    // In a real app, you'd use AsyncStorage to persist this
    // For now, we'll show it once per session
  }, []);

  // Auto-play audio when book or chapter changes and on player screen
  useEffect(() => {
    if (book && chapter) {
      loadAndPlayAudio();
    }
  }, [book, chapter]);

  // Update playback speed when it changes
  useEffect(() => {
    if (sound) {
      sound.setRateAsync(playbackSpeed);
    }
  }, [playbackSpeed, sound]);

  // Auto-play next chapter functionality
  const autoPlayNext = async () => {
    await nextChapter();
  };

  // Playback status update handler
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      
      // Auto-play next chapter when current one finishes
      if (status.didJustFinish && autoPlayEnabled && book && chapter) {
        setTimeout(() => {
          autoPlayNext();
        }, 500);
      }
    }
  };

  // Request notification permissions
  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'web' || !Notifications) {
      return false;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
      return false;
    }
    
    return true;
  };

  // Schedule daily notification
  const scheduleDailyNotification = async () => {
    if (Platform.OS === 'web' || !Notifications) {
      Alert.alert('Not Available', 'Notifications are not available on web. Please use the mobile app.');
      return;
    }
    
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;
    
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule daily notification at 8 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Krio Audio Bible',
        body: 'Good morning! Take time to listen to God\'s Word today.',
        sound: true,
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });
    
    Alert.alert('Enabled', 'Daily notifications will remind you at 8:00 AM every day.');
  };

  // Cancel all notifications
  const cancelAllNotifications = async () => {
    if (Platform.OS !== 'web' && Notifications) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  // Mark chapter as downloaded after successful load
  const markChapterDownloaded = (bookId, chapterNum) => {
    setDownloadedBooks(prev => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        chapters: {
          ...(prev[bookId]?.chapters || {}),
          [chapterNum]: true
        }
      }
    }));
  };

  // Check if chapter is downloaded
  const isChapterDownloaded = (bookId, chapterNum) => {
    return downloadedBooks[bookId]?.chapters?.[chapterNum] === true;
  };

  // Get count of downloaded chapters for a book
  const getDownloadedChaptersCount = (bookId) => {
    const chapters = downloadedBooks[bookId]?.chapters || {};
    return Object.values(chapters).filter(Boolean).length;
  };

  // Download entire book for offline use
  const downloadBook = async (bookToDownload) => {
    try {
      setDownloadingBook(bookToDownload.id);
      setDownloadProgress(0);
      
      const bookFolderName = bookToDownload.name.replace(/ /g, '_');
      const bookNameLowercase = bookToDownload.name.toLowerCase().replace(/ /g, '_');
      const CLOUDINARY_CLOUD_NAME = 'dwdgiblmg';
      
      for (let i = 1; i <= bookToDownload.chapters; i++) {
        // Skip if already downloaded
        if (isChapterDownloaded(bookToDownload.id, i)) {
          setDownloadProgress(Math.round((i / bookToDownload.chapters) * 100));
          continue;
        }

        const audioFileName = `${bookNameLowercase}_${i}.mp3`;
        const audioUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/audio/${bookFolderName}/${audioFileName}`;
        
        try {
          if (Platform.OS === 'web') {
            // On web, fetch the audio file which triggers service worker caching
            const response = await fetch(audioUrl);
            if (response.ok) {
              // Read the response to ensure it's fully downloaded
              await response.blob();
            } else {
              throw new Error(`Failed to download: ${response.status}`);
            }
          } else {
            // On native, use Audio.Sound to pre-cache
            const { sound: tempSound } = await Audio.Sound.createAsync(
              { uri: audioUrl },
              { shouldPlay: false }
            );
            await tempSound.unloadAsync();
          }
          
          // Mark as downloaded
          markChapterDownloaded(bookToDownload.id, i);
          setDownloadProgress(Math.round((i / bookToDownload.chapters) * 100));
        } catch (error) {
          // Skip failed chapters but continue
          console.error(`Failed to download ${audioFileName}:`, error);
          continue;
        }
      }
      
      setDownloadingBook(null);
      setDownloadProgress(0);
      
      const downloadedCount = getDownloadedChaptersCount(bookToDownload.id);
      Alert.alert(
        'Download Complete',
        `${bookToDownload.name}: ${downloadedCount}/${bookToDownload.chapters} chapters available offline!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setDownloadingBook(null);
      setDownloadProgress(0);
      Alert.alert(
        'Download Failed',
        `Could not download ${bookToDownload.name}. Please try again.`,
        [{ text: 'OK' }]
      );
    }
  };

  // Load and play audio
  const loadAndPlayAudio = async () => {
    try {
      setIsLoading(true);
      
      // Construct the audio file path
      // Files are named like: matthew_1.mp3, genesis_1.mp3, etc. (lowercase)
      const bookNameLowercase = book.name.toLowerCase().replace(/ /g, '_');
      const audioFileName = `${bookNameLowercase}_${chapter}.mp3`;
      
      // The folder names use underscores for spaces (e.g., "1_Samuel", "Song_of_Songs")
      const bookFolderName = book.name.replace(/ /g, '_');
      
      // CLOUDINARY CONFIGURATION
      const CLOUDINARY_CLOUD_NAME = 'dwdgiblmg';
      const audioUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/audio/${bookFolderName}/${audioFileName}`;
      
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Set audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      
      // Load and play the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { 
          shouldPlay: true, 
          rate: playbackSpeed,
          progressUpdateIntervalMillis: 500
        },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
      
      // Mark chapter as downloaded/cached for offline use
      markChapterDownloaded(book.id, chapter);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Cannot Load Audio',
        `Unable to play ${book.name} Chapter ${chapter}. Please check your internet connection and try again.`,
        [{ text: 'OK' }]
      );
    }
  };

  // Play/Pause toggle
  const togglePlayPause = async () => {
    if (!sound) {
      await loadAndPlayAudio();
      return;
    }
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  // Stop audio
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setPosition(0);
      setIsPlaying(false);
    }
  };

  // Skip forward 15 seconds
  const skipForward = async () => {
    if (sound && duration > 0) {
      const newPosition = Math.min(position + 15000, duration);
      await sound.setPositionAsync(newPosition);
    }
  };

  // Skip backward 15 seconds
  const skipBackward = async () => {
    if (sound) {
      const newPosition = Math.max(position - 15000, 0);
      await sound.setPositionAsync(newPosition);
    }
  };

  // Go to previous chapter (or previous book if at beginning)
  const previousChapter = async () => {
    if (sound) await sound.unloadAsync();
    setSound(null);
    setPosition(0);
    setIsPlaying(false);
    
    const currentChapter = parseInt(chapter, 10);
    if (currentChapter > 1) {
      // Previous chapter in current book
      setChapter(currentChapter - 1);
    } else {
      // Move to previous book
      const allBooks = testament === 'old' ? BIBLE_DATA.oldTestament : BIBLE_DATA.newTestament;
      const currentBookIndex = allBooks.findIndex(b => b.id === book.id);
      
      if (currentBookIndex > 0) {
        // Previous book in same testament
        const prevBook = allBooks[currentBookIndex - 1];
        setBook(prevBook);
        setChapter(prevBook.chapters); // Go to last chapter of previous book
      } else if (testament === 'new') {
        // Move to Old Testament (last book)
        setTestament('old');
        const lastOTBook = BIBLE_DATA.oldTestament[BIBLE_DATA.oldTestament.length - 1];
        setBook(lastOTBook);
        setChapter(lastOTBook.chapters);
      } else {
        // At the beginning of Bible
        Alert.alert('Beginning of Bible', 'You are at Genesis Chapter 1!');
      }
    }
  };

  // Go to next chapter (or next book if at end)
  const nextChapter = async () => {
    if (sound) await sound.unloadAsync();
    setSound(null);
    setPosition(0);
    setIsPlaying(false);
    
    const currentChapter = parseInt(chapter, 10);
    if (currentChapter < book.chapters) {
      // Next chapter in current book
      setChapter(currentChapter + 1);
    } else {
      // Move to next book
      const allBooks = testament === 'old' ? BIBLE_DATA.oldTestament : BIBLE_DATA.newTestament;
      const currentBookIndex = allBooks.findIndex(b => b.id === book.id);
      
      if (currentBookIndex < allBooks.length - 1) {
        // Next book in same testament
        const nextBook = allBooks[currentBookIndex + 1];
        setBook(nextBook);
        setChapter(1);
      } else if (testament === 'old') {
        // Move to New Testament
        setTestament('new');
        setBook(BIBLE_DATA.newTestament[0]);
        setChapter(1);
      } else {
        // At the end of Bible
        Alert.alert('End of Bible', 'You have reached the end of Revelation!');
      }
    }
  };

  // Format time in mm:ss
  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle favorite
  const toggleFavorite = () => {
    if (!book || !chapter) return;
    
    const favoriteKey = `${book.id}_${chapter}`;
    const existingIndex = favorites.findIndex(
      fav => fav.bookId === book.id && fav.chapter === chapter
    );
    
    if (existingIndex >= 0) {
      // Remove from favorites
      const newFavorites = favorites.filter((_, index) => index !== existingIndex);
      setFavorites(newFavorites);
      Alert.alert('Removed', `${book.name} Chapter ${chapter} removed from favorites`);
    } else {
      // Add to favorites
      const newFavorite = {
        bookId: book.id,
        bookName: book.name,
        chapter: chapter,
        testament: testament,
        addedDate: new Date().toISOString(),
      };
      setFavorites([...favorites, newFavorite]);
      Alert.alert('Added', `${book.name} Chapter ${chapter} added to favorites`);
    }
  };

  // Check if current chapter is favorited
  const isFavorited = () => {
    if (!book || !chapter) return false;
    return favorites.some(fav => fav.bookId === book.id && fav.chapter === chapter);
  };

  // Play favorite
  const playFavorite = (favorite) => {
    // Find the book
    const allBooks = [...BIBLE_DATA.oldTestament, ...BIBLE_DATA.newTestament];
    const selectedBook = allBooks.find(b => b.id === favorite.bookId);
    
    if (selectedBook) {
      setTestament(favorite.testament);
      setBook(selectedBook);
      setChapter(favorite.chapter);
      setScreen('home');
    }
  };

  // Render Bottom Tab Bar (reusable component)
  const renderBottomTabBar = () => (
    <View style={styles.bottomTabBar}>
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => setScreen('home')}
      >
        <Text style={screen === 'home' ? styles.tabIconActive : styles.tabIcon}>🏠</Text>
        <Text style={screen === 'home' ? styles.tabLabelActive : styles.tabLabel}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => setScreen('books')}
      >
        <Text style={screen === 'books' ? styles.tabIconActive : styles.tabIcon}>📖</Text>
        <Text style={screen === 'books' ? styles.tabLabelActive : styles.tabLabel}>Books</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => setScreen('favorites')}
      >
        <Text style={screen === 'favorites' ? styles.tabIconActive : styles.tabIcon}>❤️</Text>
        <Text style={screen === 'favorites' ? styles.tabLabelActive : styles.tabLabel}>Favorites</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabItem}
        onPress={() => setScreen('settings')}
      >
        <Text style={screen === 'settings' ? styles.tabIconActive : styles.tabIcon}>⚙️</Text>
        <Text style={screen === 'settings' ? styles.tabLabelActive : styles.tabLabel}>Settings</Text>
      </TouchableOpacity>
    </View>
  );

  // Home Screen
  if (screen === 'home') {
    const oldTestamentBooks = BIBLE_DATA.oldTestament || [];
    const newTestamentBooks = BIBLE_DATA.newTestament || [];
    const currentBooks = testament === 'old' ? oldTestamentBooks : (testament === 'new' ? newTestamentBooks : []);
    const chapters = book ? Array.from({ length: book.chapters }, (_, i) => i + 1) : [];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.homeContainer}>
          {/* Main Content Area */}
          <View style={styles.homeScrollContent}>
            {/* Logo Header - Compact */}
            <View style={styles.homeHeaderCompact}>
              <Image 
                source={require('./assets/nlicm-logo.jpg')}
                style={styles.logoImageCompact}
                resizeMode="contain"
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.homeTitleCompact}>Krio Audio Bible</Text>
                <Text style={styles.homeSubtitleCompact}>NLICM - Kossoh Town</Text>
              </View>
            </View>

            {/* Select Options Row */}
            <View style={styles.selectRow}>
              {/* Testament Select */}
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>📖 Testament</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={testament}
                    onValueChange={(value) => {
                      setTestament(value);
                      setBook(null);
                      setChapter(null);
                    }}
                    style={styles.picker}
                    dropdownIconColor="#ff4081"
                  >
                    <Picker.Item label="Choose..." value="" />
                    <Picker.Item label="📚 Old Testament" value="old" />
                    <Picker.Item label="✨ New Testament" value="new" />
                  </Picker>
                </View>
                {testament && (
                  <Text style={styles.selectHint}>
                    {testament === 'old' ? '39 Books' : '27 Books'}
                  </Text>
                )}
              </View>

              {/* Book Select */}
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>📕 Book</Text>
                <View style={[styles.pickerWrapper, !testament && styles.pickerDisabled]}>
                  <Picker
                    selectedValue={book?.id || ''}
                    onValueChange={(value) => {
                      const allBooks = [...BIBLE_DATA.oldTestament, ...BIBLE_DATA.newTestament];
                      const selectedBook = allBooks.find(b => b.id === value);
                      setBook(selectedBook || null);
                      setChapter(null);
                    }}
                    style={styles.picker}
                    enabled={!!testament}
                    dropdownIconColor="#ff4081"
                  >
                    <Picker.Item label="Choose..." value="" />
                    {currentBooks.map((b) => (
                      <Picker.Item key={b.id} label={b.name} value={b.id} />
                    ))}
                  </Picker>
                </View>
                {book && (
                  <Text style={styles.selectHint}>
                    {book.chapters} Chapters
                    {downloadedBooks[book.id]?.chapters?.[chapter] && ' • ✓ Offline'}
                  </Text>
                )}
              </View>
            </View>

            {/* Chapter Select - Compact */}
            <View style={styles.chapterSelectContainerCompact}>
              <Text style={styles.selectLabelCompact}>📄 Chapter</Text>
              <View style={[styles.pickerWrapperCompact, !book && styles.pickerDisabled]}>
                <Picker
                  selectedValue={chapter || ''}
                  onValueChange={(value) => {
                    if (value) {
                      const chapterNum = parseInt(value, 10);
                      setChapter(chapterNum);
                    }
                  }}
                  style={styles.pickerCompact}
                  enabled={!!book}
                  dropdownIconColor="#ff4081"
                >
                  <Picker.Item label={book ? "Select..." : 'Select book first'} value="" />
                  {book && chapters.map((ch) => (
                    <Picker.Item key={ch} label={`Chapter ${ch}`} value={ch} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Rich Audio Player Section - Always show */}
            <View style={styles.richPlayerContainer}>
              {/* Now Playing Info */}
              <View style={styles.richInfoSectionFull}>
                <Text style={styles.richBookTitle} numberOfLines={1}>
                  {book ? book.name : 'Select a book to begin'}
                </Text>
                <Text style={styles.richChapterTitle}>
                  {chapter ? `Chapter ${chapter}` : book ? 'Select a chapter above' : 'Choose testament and book'}
                </Text>
                {testament && (
                  <View style={styles.richTestamentBadge}>
                    <Text style={styles.richTestamentText}>
                      {testament === 'old' ? '📚 Old Testament' : '✨ New Testament'}
                    </Text>
                  </View>
                )}
                {isLoading && (
                  <Text style={styles.loadingText}>
                    {isChapterDownloaded(book?.id, chapter) ? '📱 Loading from offline...' : '🌐 Downloading & caching...'}
                  </Text>
                )}
                {book && chapter && (
                  <TouchableOpacity 
                    onPress={toggleFavorite}
                    style={styles.favoriteButton}
                  >
                    <Text style={styles.favoriteIcon}>{isFavorited() ? '❤️' : '🤍'}</Text>
                    <Text style={styles.favoriteText}>{isFavorited() ? 'Favorited' : 'Add to Favorites'}</Text>
                  </TouchableOpacity>
                )}
              </View>

                {/* Progress Section */}
                <View style={styles.richProgressSection}>
                  <View style={styles.richProgressBar}>
                    <View style={[styles.richProgressFill, { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }]} />
                    <View style={[styles.richProgressThumb, { left: duration > 0 ? `${(position / duration) * 100}%` : '0%' }]} />
                  </View>
                  <View style={styles.richTimeRow}>
                    <Text style={styles.richTimeText}>{formatTime(position)}</Text>
                    <Text style={styles.richTimeText}>{formatTime(duration)}</Text>
                  </View>
                </View>

                {/* Main Controls */}
                <View style={styles.richMainControls}>
                  <TouchableOpacity 
                    onPress={previousChapter} 
                    style={[styles.richNavButton, !chapter && styles.btnDisabled]}
                    disabled={!chapter}
                  >
                    <Text style={styles.richNavIcon}>⏮️</Text>
                    <Text style={styles.richNavLabel}>Previous</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={togglePlayPause} 
                    style={[styles.richPlayButtonLarge, !chapter && styles.btnDisabled]}
                    disabled={!chapter}
                  >
                    <Text style={styles.richPlayIconLarge}>{isPlaying ? '⏸️' : '▶️'}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={nextChapter} 
                    style={[styles.richNavButton, !chapter && styles.btnDisabled]}
                    disabled={!chapter}
                  >
                    <Text style={styles.richNavIcon}>⏭️</Text>
                    <Text style={styles.richNavLabel}>Next</Text>
                  </TouchableOpacity>
                </View>

                {/* Additional Info */}
                <View style={styles.richFooterInfo}>
                  <View style={styles.richInfoItem}>
                    <Text style={styles.richInfoIcon}>📖</Text>
                    <Text style={styles.richInfoLabel}>
                      {book ? `Book ${BIBLE_DATA.oldTestament.findIndex(b => b.id === book.id) !== -1 ? BIBLE_DATA.oldTestament.findIndex(b => b.id === book.id) + 1 : BIBLE_DATA.newTestament.findIndex(b => b.id === book.id) + 40}` : '66 Books'}
                    </Text>
                  </View>
                  <View style={styles.richInfoItem}>
                    <Text style={styles.richInfoIcon}>📄</Text>
                    <Text style={styles.richInfoLabel}>
                      {book ? (chapter ? `${chapter} of ${book.chapters}` : `${book.chapters} chapters`) : 'Chapters'}
                    </Text>
                  </View>
                  <View style={styles.richInfoItem}>
                    <Text style={styles.richInfoIcon}>🎵</Text>
                    <Text style={styles.richInfoLabel}>{sound ? 'Playing' : 'Ready'}</Text>
                  </View>
                </View>
              </View>
          </View>

          {/* Bottom Tab Bar */}
          {renderBottomTabBar()}
        </View>

        {/* Tutorial Overlay */}
        {renderTutorial()}
      </SafeAreaView>
    );
  }

  // Books List Screen
  if (screen === 'books') {
    // If no testament selected, show testament selection screen
    if (!testament) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => setScreen('home')}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Select Testament</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 40, textAlign: 'center' }}>
              Choose which testament to browse
            </Text>

            <TouchableOpacity
              style={styles.testamentButton}
              onPress={() => {
                setTestament('old');
              }}
            >
              <Text style={styles.testamentIcon}>📜</Text>
              <Text style={styles.testamentTitle}>Old Testament</Text>
              <Text style={styles.testamentSubtitle}>39 Books</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testamentButton}
              onPress={() => {
                setTestament('new');
              }}
            >
              <Text style={styles.testamentIcon}>✝️</Text>
              <Text style={styles.testamentTitle}>New Testament</Text>
              <Text style={styles.testamentSubtitle}>27 Books</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Tab Bar */}
          {renderBottomTabBar()}
        </SafeAreaView>
      );
    }

    const books = testament === 'old' ? BIBLE_DATA.oldTestament : BIBLE_DATA.newTestament;
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>{testament === 'old' ? 'Old' : 'New'} Testament</Text>
          <View style={{ width: 50 }} />
        </View>

        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15, paddingBottom: 90 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookItem}
              onPress={() => {
                setBook(item);
                setScreen('chapters');
              }}
            >
              <View style={styles.bookIcon}>
                <Text style={styles.bookIconText}>📕</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bookName}>{item.name}</Text>
                <Text style={styles.bookChapters}>{item.chapters} Chapters</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />

        {/* Bottom Tab Bar */}
        {renderBottomTabBar()}
      </SafeAreaView>
    );
  }

  // Favorites Screen
  if (screen === 'favorites') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Favorites</Text>
          <View style={{ width: 50 }} />
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💝</Text>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon when listening to a chapter to add it to your favorites
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setScreen('home')}
            >
              <Text style={styles.emptyButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => `${item.bookId}_${item.chapter}_${index}`}
            contentContainerStyle={{ padding: 15, paddingBottom: 90 }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={styles.favoriteItem}
                onPress={() => playFavorite(item)}
              >
                <View style={styles.favoriteIconContainer}>
                  <Text style={styles.favoriteItemIcon}>❤️</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.favoriteItemTitle}>{item.bookName}</Text>
                  <Text style={styles.favoriteItemSubtitle}>Chapter {item.chapter}</Text>
                  <Text style={styles.favoriteItemTestament}>
                    {item.testament === 'old' ? '📚 Old Testament' : '✨ New Testament'}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newFavorites = favorites.filter((_, i) => i !== index);
                    setFavorites(newFavorites);
                    Alert.alert('Removed', 'Removed from favorites');
                  }}
                  style={styles.favoriteDeleteBtn}
                >
                  <Text style={styles.favoriteDeleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Bottom Tab Bar */}
        {renderBottomTabBar()}
      </SafeAreaView>
    );
  }

  // Settings Screen
  if (screen === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Settings</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 90 }}>
          {/* Playback Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>⚙️ Playback Settings</Text>
            
            {/* Auto-Play Next Chapter */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Auto-Play Next Chapter</Text>
                <Text style={styles.settingDescription}>
                  Automatically play the next chapter when current one ends
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAutoPlayEnabled(!autoPlayEnabled)}
                style={[styles.toggleButton, autoPlayEnabled && styles.toggleButtonActive]}
              >
                <Text style={styles.toggleText}>{autoPlayEnabled ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>

            {/* Playback Speed */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Playback Speed</Text>
                <Text style={styles.settingDescription}>
                  Adjust audio playback speed (0.5x - 2.0x)
                </Text>
              </View>
              <View style={styles.speedControls}>
                <TouchableOpacity
                  onPress={() => {
                    const newSpeed = Math.max(0.5, playbackSpeed - 0.25);
                    setPlaybackSpeed(newSpeed);
                  }}
                  style={styles.speedButton}
                  disabled={playbackSpeed <= 0.5}
                >
                  <Text style={styles.speedButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.speedValue}>{playbackSpeed.toFixed(2)}x</Text>
                <TouchableOpacity
                  onPress={() => {
                    const newSpeed = Math.min(2.0, playbackSpeed + 0.25);
                    setPlaybackSpeed(newSpeed);
                  }}
                  style={styles.speedButton}
                  disabled={playbackSpeed >= 2.0}
                >
                  <Text style={styles.speedButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Bible Reading Reminder</Text>
                <Text style={styles.settingDescription}>
                  {Platform.OS === 'web' 
                    ? 'Available on mobile app only' 
                    : 'Receive a notification at 8:00 AM every day'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  if (!notificationsEnabled) {
                    await scheduleDailyNotification();
                    setNotificationsEnabled(true);
                  } else {
                    await cancelAllNotifications();
                    setNotificationsEnabled(false);
                    if (Platform.OS !== 'web') {
                      Alert.alert('Disabled', 'Daily notifications have been disabled.');
                    }
                  }
                }}
                style={[styles.toggleButton, notificationsEnabled && styles.toggleButtonActive]}
                disabled={Platform.OS === 'web'}
              >
                <Text style={styles.toggleText}>{notificationsEnabled ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>
            </View>

            {/* Test Notification - Only on mobile */}
            {notificationsEnabled && Platform.OS !== 'web' && (
              <TouchableOpacity
                style={styles.testNotificationButton}
                onPress={async () => {
                  const hasPermission = await requestNotificationPermissions();
                  if (hasPermission && Notifications) {
                    await Notifications.scheduleNotificationAsync({
                      content: {
                        title: '📖 Krio Audio Bible',
                        body: 'This is a test notification. You will receive daily reminders at 8:00 AM!',
                        sound: true,
                      },
                      trigger: {
                        seconds: 2,
                      },
                    });
                    Alert.alert('Notification Sent', 'You should receive a test notification in 2 seconds!');
                  }
                }}
              >
                <Text style={styles.testNotificationIcon}>🔔</Text>
                <Text style={styles.testNotificationText}>Send Test Notification</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Offline Downloads Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>📥 Download All Books for Offline</Text>
            <Text style={styles.settingDescription}>
              Download all 66 books (1,189 chapters) to listen offline without internet
            </Text>
            
            {downloadingBook ? (
              <View style={styles.downloadAllProgress}>
                <Text style={styles.downloadAllProgressText}>
                  Downloading all books... {downloadProgress}%
                </Text>
                <Text style={styles.downloadAllProgressSubtext}>
                  Please keep the app open until download completes
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.downloadAllButton}
                onPress={async () => {
                  // Download all books sequentially
                  const allBooks = [...BIBLE_DATA.oldTestament, ...BIBLE_DATA.newTestament];
                  for (const bk of allBooks) {
                    await downloadBook(bk);
                  }
                  if (Platform.OS !== 'web') {
                    Alert.alert('Complete!', 'All books have been downloaded for offline use.');
                  }
                }}
              >
                <Text style={styles.downloadAllButtonIcon}>📥</Text>
                <Text style={styles.downloadAllButtonText}>Download All Books</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.downloadStats}>
              <Text style={styles.downloadStatsText}>
                Downloaded: {Object.values(downloadedBooks).reduce((total, book) => 
                  total + Object.values(book.chapters || {}).filter(Boolean).length, 0
                )} / 1,189 chapters
              </Text>
            </View>
          </View>

          {/* Statistics Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>📊 Statistics</Text>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statValue}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favorite Chapters</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📥</Text>
              <Text style={styles.statValue}>
                {Object.values(downloadedBooks).reduce((total, book) => {
                  return total + Object.values(book.chapters || {}).filter(Boolean).length;
                }, 0)}
              </Text>
              <Text style={styles.statLabel}>Downloaded Chapters</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📖</Text>
              <Text style={styles.statValue}>66</Text>
              <Text style={styles.statLabel}>Books Available</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📄</Text>
              <Text style={styles.statValue}>1,189</Text>
              <Text style={styles.statLabel}>Total Chapters</Text>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>🔧 Actions</Text>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setFavorites([]);
                Alert.alert('Cleared', 'All favorites have been cleared');
              }}
            >
              <Text style={styles.actionButtonIcon}>🗑️</Text>
              <Text style={styles.actionButtonText}>Clear All Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setPlaybackSpeed(1.0);
                setAutoPlayEnabled(true);
                setNotificationsEnabled(true);
                Alert.alert('Reset', 'All settings restored to defaults');
              }}
            >
              <Text style={styles.actionButtonIcon}>🔄</Text>
              <Text style={styles.actionButtonText}>Reset to Defaults</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>ℹ️ About</Text>
            
            <View style={styles.aboutCard}>
              <Image 
                source={require('./assets/nlicm-logo.jpg')}
                style={styles.aboutLogo}
                resizeMode="contain"
              />
              <Text style={styles.aboutTitle}>Krio Audio Bible</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
              
              <View style={styles.aboutDivider} />
              
              <Text style={styles.aboutText}>
                The Krio Audio Bible is brought to you by:
              </Text>
              <Text style={styles.aboutChurch}>
                New Life in Christ Ministry
              </Text>
              <Text style={styles.aboutLocation}>
                Kossoh Town Chapter
              </Text>
              
              <View style={styles.aboutDivider} />
              
              <Text style={styles.aboutDescription}>
                Experience the Word of God in the Krio language. This app provides complete audio recordings of the Old and New Testament, making it easy to listen to Scripture anytime, anywhere.
              </Text>
              
              <View style={styles.aboutDivider} />
              
              <Text style={styles.aboutFeatures}>Features:</Text>
              <Text style={styles.aboutFeatureItem}>• Complete Old & New Testament audio</Text>
              <Text style={styles.aboutFeatureItem}>• Save favorite chapters</Text>
              <Text style={styles.aboutFeatureItem}>• Auto-play next chapter</Text>
              <Text style={styles.aboutFeatureItem}>• Adjustable playback speed</Text>
              <Text style={styles.aboutFeatureItem}>• Beautiful, easy-to-use interface</Text>
              
              <View style={styles.aboutDivider} />
              
              <Text style={styles.aboutCopyright}>
                © 2025 New Life in Christ Ministry
              </Text>
              <Text style={styles.aboutRights}>
                All rights reserved
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        {renderBottomTabBar()}
      </SafeAreaView>
    );
  }

  

  // Chapters List Screen
  if (screen === 'chapters') {
    if (!book) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#666' }}>Loading...</Text>
          </View>
        </SafeAreaView>
      );
    }
    
    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setScreen('books')}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.topBarTitle}>{book.name}</Text>
            <Text style={styles.topBarSub}>{book.chapters} Chapters</Text>
          </View>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 90 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {chapters.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.chapterBox}
                onPress={() => {
                  setChapter(item);
                  setScreen('home');
                }}
              >
                <Text style={styles.chapterNum}>{item}</Text>
                <Text style={styles.playIcon}>▶️</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        {renderBottomTabBar()}
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  scrollContent: {
    padding: 20,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  homeScrollContent: {
    flex: 1,
    padding: 12,
    paddingBottom: 80,
    justifyContent: 'space-between',
  },
  homeHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 64, 129, 0.2)',
  },
  logoImageCompact: {
    width: 45,
    height: 45,
    borderRadius: 23,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  homeTitleCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  homeSubtitleCompact: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  homeHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  homeLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 64, 129, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  homeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 64, 129, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  homeSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  homeChapter: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  miniPlayer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  miniPlayerIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  miniPlayerInfo: {
    flex: 1,
    marginRight: 10,
  },
  miniPlayerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
  },
  miniProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#ff4081',
    borderRadius: 2,
  },
  miniPlayBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    borderRadius: 22,
  },
  testamentSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    marginLeft: 2,
  },
  testamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  testamentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  testamentIcon: {
    fontSize: 28,
  },
  testamentInfo: {
    flex: 1,
  },
  testamentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
  },
  testamentDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 1,
  },
  testamentRange: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  testamentArrow: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '300',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 64, 129, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
    paddingTop: 6,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  tabCenterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 64, 129, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#0a0e27',
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 3,
    opacity: 0.5,
  },
  tabIconActive: {
    fontSize: 24,
    marginBottom: 3,
  },
  tabLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabLabelActive: {
    fontSize: 10,
    color: '#ff4081',
    fontWeight: '600',
  },
  selectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  selectContainer: {
    flex: 1,
  },
  selectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    marginLeft: 2,
  },
  selectLabelCompact: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 5,
    marginLeft: 2,
  },
  chapterSelectContainerCompact: {
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 64, 129, 0.5)',
    overflow: 'hidden',
    minHeight: 38,
    justifyContent: 'center',
  },
  pickerWrapperFull: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(138, 43, 226, 0.5)',
    overflow: 'hidden',
    minHeight: 38,
    justifyContent: 'center',
  },
  pickerWrapperCompact: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(138, 43, 226, 0.5)',
    overflow: 'hidden',
    minHeight: 38,
    justifyContent: 'center',
  },
  picker: {
    color: '#ffffff',
    backgroundColor: 'rgba(10, 14, 39, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    height: 38,
    paddingHorizontal: 8,
    borderWidth: 0,
    outlineStyle: 'none',
  },
  pickerCompact: {
    color: '#ffffff',
    backgroundColor: 'rgba(10, 14, 39, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    height: 38,
    paddingHorizontal: 8,
    borderWidth: 0,
    outlineStyle: 'none',
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#1a1a2e',
  },
  pickerDisabled: {
    opacity: 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowOpacity: 0.1,
  },
  selectHint: {
    fontSize: 11,
    color: '#ff4081',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '700',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255, 64, 129, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  chapterSelectContainer: {
    marginBottom: 22,
  },
  richPlayerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  richAlbumSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  richAlbumArtContainer: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255, 64, 129, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
  },
  richAlbumImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingText: {
    color: '#ff4081',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
    fontStyle: 'italic',
  },
  richInfoSection: {
    alignItems: 'center',
    width: '100%',
  },
  richInfoSectionFull: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  richBookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 3,
    textAlign: 'center',
  },
  richChapterTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    fontWeight: '600',
  },
  richTestamentBadge: {
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.4)',
  },
  richTestamentText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '600',
  },
  richProgressSection: {
    marginBottom: 12,
  },
  richProgressBar: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
    position: 'relative',
  },
  richProgressFill: {
    height: '100%',
    backgroundColor: '#ff4081',
    borderRadius: 3,
  },
  richProgressThumb: {
    position: 'absolute',
    top: -3,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ff4081',
    marginLeft: -5.5,
  },
  richTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  richTimeText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  richMainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  richPlayButtonLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4081',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  richPlayIconLarge: {
    fontSize: 28,
  },
  richNavButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 64, 129, 0.5)',
  },
  richNavIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  richNavLabel: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '700',
  },
  richFooterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  richInfoItem: {
    alignItems: 'center',
  },
  richInfoIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  richInfoLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  homePlayerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    marginBottom: 20,
  },
  homePlayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  homeAlbumArt: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 64, 129, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  homeAlbumImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  homePlayerInfo: {
    flex: 1,
  },
  homePlayerBook: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  homePlayerChapter: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 3,
  },
  homePlayerTestament: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  homeProgressSection: {
    marginBottom: 18,
  },
  homeProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  homeProgressFill: {
    height: '100%',
    backgroundColor: '#ff4081',
    borderRadius: 3,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  homeTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  homeTimeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  homeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  homeControlBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  homeControlIcon: {
    fontSize: 20,
  },
  homePlayBtn: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 64, 129, 0.9)',
    borderRadius: 28,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  homePlayIcon: {
    fontSize: 28,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  logo: {
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 64, 129, 0.3)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 64, 129, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 28,
    alignItems: 'center',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 14,
  },
  cardText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 26,
  },
  button: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  buttonSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  footer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
    fontWeight: '500',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  backBtn: {
    fontSize: 17,
    color: '#ff4081',
    fontWeight: '700',
    minWidth: 60,
  },
  homeBtn: {
    fontSize: 26,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  topBarSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontWeight: '500',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    marginBottom: 14,
    borderRadius: 20,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bookIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  bookIconText: {
    fontSize: 32,
  },
  bookName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  bookChapters: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 30,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  chapterBox: {
    width: '30%',
    margin: '1.5%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chapterNum: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  playIcon: {
    fontSize: 36,
  },
  playerContainer: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    backgroundColor: '#0a0e27',
  },
  playerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    padding: 44,
    alignItems: 'center',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  albumArt: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  albumIcon: {
    fontSize: 100,
  },
  playerTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  playerSubtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 40,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff4081',
    borderRadius: 3,
  },
  timeText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 40,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  testamentButton: {
    width: '85%',
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 64, 129, 0.3)',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  testamentIcon: {
    fontSize: 50,
    marginBottom: 12,
  },
  testamentTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  testamentSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.4)',
    marginTop: 8,
  },
  favoriteIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  favoriteText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#ff4081',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  favoriteIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteItemIcon: {
    fontSize: 24,
  },
  favoriteItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  favoriteItemSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  favoriteItemTestament: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  favoriteDeleteBtn: {
    padding: 8,
  },
  favoriteDeleteIcon: {
    fontSize: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  controlButton: {
    padding: 10,
    borderRadius: 30,
  },
  controlIcon: {
    fontSize: 38,
  },
  playBtn: {
    backgroundColor: '#ff4081',
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playBtnText: {
    fontSize: 48,
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  // Settings Styles
  settingsSection: {
    marginBottom: 25,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  toggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 60,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#ff4081',
    borderColor: '#ff4081',
  },
  toggleText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  speedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  testNotificationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  testNotificationText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  speedButton: {
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.4)',
  },
  speedButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  speedValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 45,
    textAlign: 'center',
  },
  statCard: {
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
  },
  downloadAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4081',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  downloadAllButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  downloadAllButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  downloadAllProgress: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  downloadAllProgressText: {
    fontSize: 16,
    color: '#ff4081',
    fontWeight: '700',
    marginBottom: 8,
  },
  downloadAllProgressSubtext: {
    fontSize: 13,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  downloadStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  downloadStatsText: {
    fontSize: 14,
    color: '#b0b0b0',
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
  },
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 15,
  },
  aboutDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 15,
  },
  aboutText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  aboutChurch: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4081',
    textAlign: 'center',
    marginBottom: 4,
  },
  aboutLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 4,
  },
  aboutDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  aboutFeatures: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  aboutFeatureItem: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  aboutCopyright: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 2,
  },
  aboutRights: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tutorialModal: {
    backgroundColor: '#1a1f3a',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 64, 129, 0.5)',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  tutorialIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  tutorialDescription: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  tutorialSteps: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  tutorialDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  tutorialDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4081',
  },
  tutorialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  tutorialBtnPrimary: {
    backgroundColor: '#ff4081',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    flex: 1,
    maxWidth: 200,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  tutorialBtnPrimaryText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  tutorialBtnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tutorialBtnSecondaryText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  tutorialSkip: {
    marginTop: 20,
  },
  tutorialSkipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textDecorationLine: 'underline',
  },
});
