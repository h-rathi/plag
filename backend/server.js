// const express = require('express');
// const fs = require('fs');
// const { execFile } = require('child_process');
// const cors = require('cors');
// const app = express();
// app.use(cors());
// const port = 5000;

// // To accept JSON input
// app.use(express.json());

// // ========== Load and prepare reference data at server start ==========

// console.log("⏳ Server starting... preparing reference data...");

// function prepareData() {
//     return new Promise((resolve, reject) => {
//         execFile('python', ['prepare_data.py'], (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`❌ Error preparing data: ${stderr}`);
//                 return reject(error);
//             }
//             console.log(`✅ Data prepared:\n${stdout}`);
//             resolve();
//         });
//     });
// }

// prepareData().then(() => {
//     console.log("🚀 Server ready.");

//     // ========== API ==========

//     app.post('/check-plagiarism', (req, res) => {
//         const userText = req.body.text;

//         if (!userText) {
//             return res.status(400).json({ error: 'No text provided.' });
//         }

//         // Run the plagiarism checker Python script
//         execFile('python', ['plagiarism_check.py', userText], (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`❌ Error checking plagiarism: ${stderr}`);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             try {
//                 const output = JSON.parse(stdout);
//                 res.json(output);
//             } catch (e) {
//                 console.error('❌ Error parsing output:', e);
//                 res.status(500).json({ error: 'Failed to parse plagiarism check result' });
//             }
//         });
//     });

//     app.listen(port, () => {
//         console.log(`🌐 API listening on http://localhost:${port}`);
//     });
// }).catch(err => {
//     console.error('❌ Server initialization failed:', err);
// });
const db = require('./db');
const cors = require('cors');
const express = require('express');

const app = express();
const port = 5000;

// Connect to DB
db();

// Middleware
app.use(cors());
app.use(express.json());
// app.options('*', cors());

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use('/api/login', require('./Routes/auth'));
app.use('/api/plagiarism', require('./Routes/plagiarism'));

// Server start
app.listen(port, () => {
  console.log(`SherNotebook app listening on port ${port}`);
});
