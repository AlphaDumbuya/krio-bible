const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the parent directory to the watch folders so we can access the audio files
config.watchFolders = [
  path.resolve(__dirname, '../Krio audio bible new testament'),
];

// Add audio file extensions
config.resolver.assetExts.push('mp3');

module.exports = config;
