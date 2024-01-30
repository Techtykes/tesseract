const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3000;

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define a route to handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageBuffer = req.file.buffer;

  // Perform OCR using Tesseract
  Tesseract.recognize(
    imageBuffer,
    'eng',
    { logger: info => console.log(info) }
  ).then(({ data: { text } }) => {
    res.json({ ocrResult: text });
  }).catch(error => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
