const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const membersFilePath = path.join(__dirname, 'data/members.json');
const uploadFolder = path.join(__dirname, 'data/uploads/');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/data/uploads', express.static(uploadFolder));

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Function to read members from the JSON file
function readMembers(callback) {
    fs.readFile(membersFilePath, 'utf8', (err, data) => {
        if (err) return callback(err);
        callback(null, JSON.parse(data));
    });
}

// Function to write members to the JSON file
function writeMembers(members, callback) {
    fs.writeFile(membersFilePath, JSON.stringify(members, null, 2), 'utf8', callback);
}

// Get members
app.get('/members', (req, res) => {
    const filePath = path.join(membersFilePath);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading members.json:', err);
            return res.status(500).json({ error: 'Unable to read members file' });
        }
        
        let members;
        try {
            members = JSON.parse(data);
        } catch (parseError) {
            console.error('Invalid JSON format:', parseError);
            return res.status(500).json({ error: 'Invalid JSON format in members file' });
        }
        
        res.json(members);
    });
});
// Add member
app.post('/members', upload.fields([{ name: 'portrait1' }, { name: 'portrait2' }]), (req, res) => {
    const newMember = {
        displayName: req.body.displayName,
        fullName: req.body.fullName,
        rollno: req.body.rollno,
        section: req.body.section,
        year: req.body.year,
        role: req.body.role,
        portrait1: req.files.portrait1 ? req.files.portrait1[0].filename : '',
        portrait2: req.files.portrait2 ? req.files.portrait2[0].filename : '',
        description: req.body.description,
        linkedin: req.body.linkedin,
        github: req.body.github,
        email: req.body.email,
        instagram: req.body.instagram
    };

    readMembers((err, members) => {
        if (err) return res.status(500).send('Error reading file');
        
        members.push(newMember);
        
        writeMembers(members, (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.status(201).json(newMember);
        });
    });
});

// Edit member
app.put('/members/:rollno', (req, res) => {
    readMembers((err, members) => {
        if (err) return res.status(500).send('Error reading file');
        
        const index = members.findIndex(member => member.rollno === req.params.rollno);
        if (index === -1) return res.status(404).send('Member not found');
        
        members[index] = { ...members[index], ...req.body };
        
        writeMembers(members, (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.json(members[index]);
        });
    });
});

// Delete member
app.delete('/members/:rollno', (req, res) => {
    readMembers((err, members) => {
        if (err) return res.status(500).send('Error reading file');
        
        const updatedMembers = members.filter(member => member.rollno !== req.params.rollno);
        
        writeMembers(updatedMembers, (err) => {
            if (err) return res.status(500).send('Error writing file');
            res.status(204).send();
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});