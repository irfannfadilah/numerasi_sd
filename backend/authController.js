const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('./db');

// Fungsi untuk mendapatkan user dari database
const getUserByCredentials = async (email) => {  
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
};

// Fungsi untuk generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt:', { email, password }); 

        const user = await getUserByCredentials(email);  

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (isPasswordValid) {
                // Password cocok, lanjutkan
                const token = generateToken(user);

                res.status(200).json({
                    success: true,
                    status: "success",
                    token: token,
                    role: user.role,
                    name: user.nama
                });
            } else {
                // Password tidak cocok
                res.status(401).json({
                    success: false,
                    message: "Email atau password salah"
                });
            }
        } else {
            // User tidak ditemukan (Email salah)
            res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }
        // --- AKHIR LOGIKA VERIFIKASI ---
    } catch (error) {
        console.error("Error saat login:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server"
        });
    }
};

module.exports = {
    login
};