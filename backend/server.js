require('dotenv').config();
const express = require('express');
// const mysql = require('mysql2/promise');
const authController = require('./authController');
const cors = require('cors');
const { protect } = require('./middleware/auth');  
const materiController = require('./materiController');  
const { pool } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

app.use(cors({
    origin: 'http://localhost:3000', // Izinkan hanya dari frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/api/login', (req, res) => {
    authController.login(req, res, pool);
});

app.get('/api/status', (req, res) => {
    res.json({ message: 'Server is running' });
});

// app.get('/test-db', async (req, res) => {
//     try {
//         const [rows] = await db.execute('SELECT * FROM users WHERE email = "admin@mail.com"');
//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

app.get('/api/db-check', async (req, res) => {
    try {
        await pool.query('SELECT 1 + 1 AS solution'); 
        res.json({ status: 'success', message: 'Database connected successfully' });
    } catch (err) {
        // ...
    }
});

app.post('/api/materi', protect('guru'), materiController.createMateri);
app.get('/api/materi', protect('guru'), materiController.getMateriByGuru);
app.put('/api/materi/:id', protect('guru'), materiController.updateMateri);
app.delete('/api/materi/:id', protect('guru'), materiController.deleteMateri);

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});

// module.exports.pool = pool;