export const BIBLE_BOOKS = {
  oldTestament: [
    { id: 'genesis', name: 'Genesis', chapters: 50, testament: 'Old' },
    { id: 'exodus', name: 'Exodus', chapters: 40, testament: 'Old' },
    { id: 'leviticus', name: 'Leviticus', chapters: 27, testament: 'Old' },
    { id: 'numbers', name: 'Numbers', chapters: 36, testament: 'Old' },
    { id: 'deuteronomy', name: 'Deuteronomy', chapters: 34, testament: 'Old' },
    { id: 'joshua', name: 'Joshua', chapters: 24, testament: 'Old' },
    { id: 'judges', name: 'Judges', chapters: 21, testament: 'Old' },
    { id: 'ruth', name: 'Ruth', chapters: 4, testament: 'Old' },
    { id: '1_samuel', name: '1 Samuel', chapters: 31, testament: 'Old' },
    { id: '2_samuel', name: '2 Samuel', chapters: 24, testament: 'Old' },
    { id: '1_kings', name: '1 Kings', chapters: 22, testament: 'Old' },
    { id: '2_kings', name: '2 Kings', chapters: 25, testament: 'Old' },
    { id: '1_chronicles', name: '1 Chronicles', chapters: 29, testament: 'Old' },
    { id: '2_chronicles', name: '2 Chronicles', chapters: 36, testament: 'Old' },
    { id: 'ezra', name: 'Ezra', chapters: 10, testament: 'Old' },
    { id: 'nehemiah', name: 'Nehemiah', chapters: 13, testament: 'Old' },
    { id: 'esther', name: 'Esther', chapters: 10, testament: 'Old' },
    { id: 'job', name: 'Job', chapters: 42, testament: 'Old' },
    { id: 'psalms', name: 'Psalms', chapters: 150, testament: 'Old' },
    { id: 'proverbs', name: 'Proverbs', chapters: 31, testament: 'Old' },
    { id: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12, testament: 'Old' },
    { id: 'song_of_songs', name: 'Song of Songs', chapters: 8, testament: 'Old' },
    { id: 'isaiah', name: 'Isaiah', chapters: 66, testament: 'Old' },
    { id: 'jeremiah', name: 'Jeremiah', chapters: 52, testament: 'Old' },
    { id: 'lamentations', name: 'Lamentations', chapters: 5, testament: 'Old' },
    { id: 'ezekiel', name: 'Ezekiel', chapters: 48, testament: 'Old' },
    { id: 'daniel', name: 'Daniel', chapters: 12, testament: 'Old' },
    { id: 'hosea', name: 'Hosea', chapters: 14, testament: 'Old' },
    { id: 'joel', name: 'Joel', chapters: 3, testament: 'Old' },
    { id: 'amos', name: 'Amos', chapters: 9, testament: 'Old' },
    { id: 'obadiah', name: 'Obadiah', chapters: 1, testament: 'Old' },
    { id: 'jonah', name: 'Jonah', chapters: 4, testament: 'Old' },
    { id: 'micah', name: 'Micah', chapters: 7, testament: 'Old' },
    { id: 'nahum', name: 'Nahum', chapters: 3, testament: 'Old' },
    { id: 'habakkuk', name: 'Habakkuk', chapters: 3, testament: 'Old' },
    { id: 'zephaniah', name: 'Zephaniah', chapters: 3, testament: 'Old' },
    { id: 'haggai', name: 'Haggai', chapters: 2, testament: 'Old' },
    { id: 'zechariah', name: 'Zechariah', chapters: 14, testament: 'Old' },
    { id: 'malachi', name: 'Malachi', chapters: 4, testament: 'Old' },
  ],
  newTestament: [
    { id: 'matthew', name: 'Matthew', chapters: 28, testament: 'New' },
    { id: 'mark', name: 'Mark', chapters: 16, testament: 'New' },
    { id: 'luke', name: 'Luke', chapters: 24, testament: 'New' },
    { id: 'john', name: 'John', chapters: 21, testament: 'New' },
    { id: 'acts', name: 'Acts', chapters: 28, testament: 'New' },
    { id: 'romans', name: 'Romans', chapters: 16, testament: 'New' },
    { id: '1_corinthians', name: '1 Corinthians', chapters: 16, testament: 'New' },
    { id: '2_corinthians', name: '2 Corinthians', chapters: 13, testament: 'New' },
    { id: 'galatians', name: 'Galatians', chapters: 6, testament: 'New' },
    { id: 'ephesians', name: 'Ephesians', chapters: 6, testament: 'New' },
    { id: 'philippians', name: 'Philippians', chapters: 4, testament: 'New' },
    { id: 'colossians', name: 'Colossians', chapters: 4, testament: 'New' },
    { id: '1_thessalonians', name: '1 Thessalonians', chapters: 5, testament: 'New' },
    { id: '2_thessalonians', name: '2 Thessalonians', chapters: 3, testament: 'New' },
    { id: '1_timothy', name: '1 Timothy', chapters: 6, testament: 'New' },
    { id: '2_timothy', name: '2 Timothy', chapters: 4, testament: 'New' },
    { id: 'titus', name: 'Titus', chapters: 3, testament: 'New' },
    { id: 'philemon', name: 'Philemon', chapters: 1, testament: 'New' },
    { id: 'hebrews', name: 'Hebrews', chapters: 13, testament: 'New' },
    { id: 'james', name: 'James', chapters: 5, testament: 'New' },
    { id: '1_peter', name: '1 Peter', chapters: 5, testament: 'New' },
    { id: '2_peter', name: '2 Peter', chapters: 3, testament: 'New' },
    { id: '1_john', name: '1 John', chapters: 5, testament: 'New' },
    { id: '2_john', name: '2 John', chapters: 1, testament: 'New' },
    { id: '3_john', name: '3 John', chapters: 1, testament: 'New' },
    { id: 'jude', name: 'Jude', chapters: 1, testament: 'New' },
    { id: 'revelation', name: 'Revelation', chapters: 22, testament: 'New' },
  ],
};

export const getAllBooks = () => {
  return [...BIBLE_BOOKS.oldTestament, ...BIBLE_BOOKS.newTestament];
};

export const getBookById = (id) => {
  return getAllBooks().find(book => book.id === id);
};

export const getAudioPath = (bookId, chapter) => {
  // This should point to your audio files location
  return `../../../Krio audio bible new testament/${bookId.charAt(0).toUpperCase() + bookId.slice(1)}/${bookId}_${chapter}.mp3`;
};
