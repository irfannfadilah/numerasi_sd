// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

const protect = (requiredRole) => (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1].trim();
            console.log("TOKEN MASUK:", token, "--- PANJANG:", token.length);
            console.log("SECRET DIGUNAKAN:", process.env.JWT_SECRET);
        } catch (error) {
            console.error("Error saat parsing token:", error);
        }
    }

    try {
        // 2. Verifikasi Token
        const decoded = jwt.verify(token, 'rahasia123');

        // Simpan data user ke request
        req.user = decoded;

        // 3. Verifikasi Role
        if (requiredRole && req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Akses ditolak: Bukan ' + requiredRole });
        }

        next(); // Lanjutkan ke controller jika sukses

    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
    }
};

module.exports = {
    protect
};