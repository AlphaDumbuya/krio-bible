const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve audio files from the parent directory
const audioPath = path.join(__dirname, '../Krio audio bible new testament');
app.use('/audio', express.static(audioPath));

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Audio server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${audioPath}`);
  console.log(`\nExample: http://localhost:${PORT}/audio/Matthew/matthew_1.mp3`);
});
