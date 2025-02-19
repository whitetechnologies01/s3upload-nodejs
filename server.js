require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from "public" folder

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    // Read file from local storage
    const fileStream = fs.createReadStream(file.path);

    // Set up S3 upload parameters
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname, // File name
        Body: fileStream
    };

    // Upload file to S3
    s3.upload(uploadParams, (err, data) => {
        fs.unlinkSync(file.path); // Remove local file after upload

        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error uploading file." });
        }
        res.json({ message: "File uploaded successfully", url: data.Location });
    });
});

// Serve index.html at root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
