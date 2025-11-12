// Cloudinary Upload Script for Krio Audio Bible
// Uploads all 1,152 audio files to Cloudinary

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load credentials from cloudinary-credentials.json
let credentials;
try {
  credentials = require('./cloudinary-credentials.json');
  cloudinary.config({
    cloud_name: credentials.cloud_name,
    api_key: credentials.api_key,
    api_secret: credentials.api_secret
  });
  console.log('✅ Cloudinary credentials loaded');
} catch (error) {
  console.error('❌ Error: cloudinary-credentials.json not found!');
  console.error('\nPlease create cloudinary-credentials.json with:');
  console.error(`{
  "cloud_name": "YOUR_CLOUD_NAME",
  "api_key": "YOUR_API_KEY",
  "api_secret": "YOUR_API_SECRET"
}`);
  process.exit(1);
}

// Path to your audio files folder
const audioBasePath = path.join(__dirname, '..', 'Krio audio bible new testament');

// Get all book folders
const bookFolders = fs.readdirSync(audioBasePath).filter(file => {
  const fullPath = path.join(audioBasePath, file);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`\nFound ${bookFolders.length} book folders`);

// Upload function with retry logic
async function uploadFile(localPath, cloudinaryPath, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(localPath, {
        resource_type: 'video', // Audio files use 'video' resource type
        public_id: cloudinaryPath,
        overwrite: false,
        folder: 'audio',
      });
      return { success: true, url: result.secure_url };
    } catch (error) {
      if (attempt === retries) {
        return { success: false, error: error.message };
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Main upload function
async function uploadAllAudioFiles() {
  let totalFiles = 0;
  let uploadedFiles = 0;
  let skippedFiles = 0;
  let failedFiles = 0;
  
  const startTime = Date.now();
  
  console.log('\n========================================');
  console.log('Starting Cloudinary Upload Process');
  console.log('========================================\n');
  
  for (const bookFolder of bookFolders) {
    const bookPath = path.join(audioBasePath, bookFolder);
    const files = fs.readdirSync(bookPath).filter(file => file.endsWith('.mp3'));
    
    console.log(`\n📖 Processing: ${bookFolder} (${files.length} files)`);
    
    for (const file of files) {
      totalFiles++;
      const localFilePath = path.join(bookPath, file);
      const fileName = path.parse(file).name; // Remove .mp3 extension
      const cloudinaryPath = `${bookFolder}/${fileName}`;
      
      process.stdout.write(`  [${totalFiles}/${totalFiles}] ${file}... `);
      
      const result = await uploadFile(localFilePath, cloudinaryPath);
      
      if (result.success) {
        uploadedFiles++;
        console.log('✅');
      } else {
        failedFiles++;
        console.log(`❌ (${result.error})`);
      }
      
      // Show progress every 10 files
      if (totalFiles % 10 === 0) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const rate = totalFiles / elapsed;
        const remaining = Math.floor((1152 - totalFiles) / rate / 60);
        console.log(`    Progress: ${totalFiles}/1152 | ~${remaining} min remaining`);
      }
    }
    
    console.log(`  ✓ ${bookFolder} complete!`);
  }
  
  const totalTime = Math.floor((Date.now() - startTime) / 1000 / 60);
  
  console.log('\n========================================');
  console.log('Upload Summary');
  console.log('========================================');
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`✅ Uploaded: ${uploadedFiles}`);
  console.log(`⏭️  Skipped: ${skippedFiles}`);
  console.log(`❌ Failed: ${failedFiles}`);
  console.log(`⏱️  Time taken: ${totalTime} minutes`);
  console.log('========================================\n');
  
  if (uploadedFiles > 0) {
    console.log('🎉 Upload completed!');
    console.log('\nYour audio files are now hosted on Cloudinary!');
    console.log(`\nBase URL: https://res.cloudinary.com/${credentials.cloud_name}/video/upload/audio/`);
    console.log('\nExample URL:');
    console.log(`https://res.cloudinary.com/${credentials.cloud_name}/video/upload/audio/Matthew/matthew_1.mp3`);
    console.log('\n📝 Next steps:');
    console.log('1. Your App.js is already configured to use Cloudinary');
    console.log('2. Build for web: npx expo export:web');
    console.log('3. Deploy to Netlify: https://app.netlify.com/drop');
    console.log('4. Share your app URL with users!\n');
  } else {
    console.log('⚠️  No files were uploaded successfully.');
    console.log('Please check your Cloudinary credentials and try again.');
  }
}

// Run the upload
console.log('==============================================');
console.log('Krio Audio Bible - Cloudinary Upload Script');
console.log('==============================================');

uploadAllAudioFiles()
  .then(() => {
    console.log('Upload process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
