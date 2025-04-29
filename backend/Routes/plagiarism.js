const express = require('express');
const { execFile } = require('child_process');
const router = express.Router();

// Prepare data once when the route file is first loaded
console.log("⏳ Preparing reference data for plagiarism checker...");

function prepareData() {
    return new Promise((resolve, reject) => {
        execFile('python', ['prepare_data.py'], (error, stdout, stderr) => {
            if (error) {
                console.error(` Error preparing data: ${stderr}`);
                return reject(error);
            }
            console.log(`✅ Data prepared:\n${stdout}`);
            resolve();
        });
    });
}

// Run the data preparation once
prepareData()
    .then(() => console.log("🚀 Plagiarism route ready."))
    .catch(err => console.error(" Failed to prepare data:", err));

// POST /api/plagiarism/
router.post('/', (req, res) => {
    const userText = req.body.text;

    if (!userText) {
        return res.status(400).json({ error: 'No text provided.' });
    }

    execFile('python', ['plagiarism_check.py', userText], (error, stdout, stderr) => {
        if (error) {
            console.error(` Error checking plagiarism: ${stderr}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const output = JSON.parse(stdout);
            res.json(output);
        } catch (e) {
            console.error(' Error parsing plagiarism output:', e);
            res.status(500).json({ error: 'Failed to parse plagiarism check result' });
        }
    });
});

module.exports = router;
