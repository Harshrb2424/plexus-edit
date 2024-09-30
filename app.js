const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');  // Import multer for file uploads
const app = express();
const port = 3000;

// Set up storage for image uploads using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');  // Save files in 'public/uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Rename file to prevent conflicts
    }
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use(express.json());

// Serve members.json
app.get('/api/members', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'members.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading members data');
        }
        res.json(JSON.parse(data));
    });
});

// Save updated members.json
app.post('/api/members', (req, res) => {
    const updatedMembers = req.body;
    fs.writeFile(path.join(__dirname, 'data', 'members.json'), JSON.stringify(updatedMembers, null, 2), 'utf8', err => {
        if (err) {
            return res.status(500).send('Error saving members data');
        }
        res.send('Members data updated successfully!');
    });
});

// Handle image uploads
app.post('/api/upload', upload.single('portrait'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });  // Return file path to frontend
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
