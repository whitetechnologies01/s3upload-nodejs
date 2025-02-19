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
app.use(express.static('public')); // Serve static files

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

const upload = multer({ dest: 'uploads/' });

// Upload file to S3
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded.");

    const fileStream = fs.createReadStream(file.path);
    const uploadParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: file.originalname, Body: fileStream };

    s3.upload(uploadParams, (err, data) => {
        fs.unlinkSync(file.path);
        if (err) return res.status(500).json({ message: "Error uploading file." });
        res.json({ message: "File uploaded successfully", url: data.Location });
    });
});

// List files from S3
app.get('/files', async (req, res) => {
    try {
        const params = { Bucket: process.env.AWS_BUCKET_NAME };
        s3.listObjectsV2(params, (err, data) => {
            if (err) return res.status(500).json({ message: "Error fetching files." });
            const files = data.Contents.map(file => ({
                key: file.Key,
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`
            }));
            res.json(files);
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching files." });
    }
});

// Serve index.html
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
