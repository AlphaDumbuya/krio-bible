const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add audio file extensions
config.resolver.assetExts.push('mp3');

module.exports = config;
