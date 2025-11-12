// Upload Script for Firebase Storage
// This script uploads all 1,152 audio files to Firebase Storage

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// INSTRUCTIONS:
// 1. Download your Firebase Admin SDK private key from Firebase Console
//    (Project Settings > Service Accounts > Generate new private key)
// 2. Save it as 'firebase-admin-key.json' in this folder
// 3. Run: npm install firebase-admin
// 4. Run: node uploadToFirebase.js

// Initialize Firebase Admin
const serviceAccount = require('./firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nlicm-fbb0c.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// Path to your audio files folder
const audioBasePath = path.join(__dirname, '..', 'Krio audio bible new testament');

// Get all book folders
const bookFolders = fs.readdirSync(audioBasePath).filter(file => {
  return fs.statSync(path.join(audioBasePath, file)).isDirectory();
});

console.log(`Found ${bookFolders.length} book folders`);

// Upload function
async function uploadFile(localPath, storagePath) {
  try {
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType: 'audio/mpeg',
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      },
    });
    return true;
  } catch (error) {
    console.error(`Error uploading ${storagePath}:`, error.message);
    return false;
  }
}

// Main upload function
async function uploadAllAudioFiles() {
  let totalFiles = 0;
  let uploadedFiles = 0;
  let failedFiles = 0;
  
  console.log('Starting upload process...\n');
  
  for (const bookFolder of bookFolders) {
    const bookPath = path.join(audioBasePath, bookFolder);
    const files = fs.readdirSync(bookPath).filter(file => file.endsWith('.mp3'));
    
    console.log(`\n📖 Uploading ${bookFolder} (${files.length} files)...`);
    
    for (const file of files) {
      totalFiles++;
      const localFilePath = path.join(bookPath, file);
      const storageFilePath = `audio/${bookFolder}/${file}`;
      
      process.stdout.write(`  Uploading ${file}... `);
      
      const success = await uploadFile(localFilePath, storageFilePath);
      
      if (success) {
        uploadedFiles++;
        console.log('✅');
      } else {
        failedFiles++;
        console.log('❌');
      }
    }
    
    console.log(`  ${bookFolder} complete!`);
  }
  
  console.log('\n========================================');
  console.log('Upload Summary:');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Uploaded: ${uploadedFiles} ✅`);
  console.log(`Failed: ${failedFiles} ❌`);
  console.log('========================================\n');
  
  if (uploadedFiles === totalFiles) {
    console.log('🎉 All files uploaded successfully!');
    console.log('\nNext steps:');
    console.log('1. Update firebaseConfig.js with your Firebase project details');
    console.log('2. Update App.js line 215 with your storage bucket URL');
    console.log('3. Test the app - audio should now stream from Firebase!');
  } else {
    console.log('⚠️  Some files failed to upload. Check the errors above.');
  }
}

// Run the upload
console.log('==============================================');
console.log('Krio Audio Bible - Firebase Upload Script');
console.log('==============================================\n');

uploadAllAudioFiles()
  .then(() => {
    console.log('\nUpload process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
