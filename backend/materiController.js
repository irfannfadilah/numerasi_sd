const { pool } = require('./db');

const createMateri = async (req, res) => {
    const { judul, deskripsi, isi_materi } = req.body;
    const id_guru = req.user.id; 

    if (!judul || !isi_materi) {
        return res.status(400).json({ message: 'Judul dan isi materi wajib diisi.' });
    }

    try {
        const query = 'INSERT INTO materi (judul, deskripsi, isi_materi, id_guru) VALUES (?, ?, ?, ?)';
        await pool.execute(query, [judul, deskripsi, isi_materi, id_guru]);

        res.status(201).json({ message: 'Materi berhasil ditambahkan.', success: true });
    } catch (error) {
        console.error('Error creating materi:', error);
        res.status(500).json({ message: 'Gagal menambahkan materi.' });
    }
};

const getMateriByGuru = async (req, res) => {
    const id_guru = req.user.id;
    try {
        const query = 'SELECT * FROM materi WHERE id_guru = ? ORDER BY created_at DESC';
        const [rows] = await pool.execute(query, [id_guru]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error getting materi:', error);
        res.status(500).json({ message: 'Gagal memuat daftar materi.' });
    }
};

const updateMateri = async (req, res) => {
    const { id } = req.params;
    const { judul, deskripsi, isi_materi } = req.body;
    const id_guru = req.user.id;
    
    try {
        const [materi] = await pool.execute('SELECT id_guru FROM materi WHERE id = ?', [id]);
        if (materi.length === 0 || materi[0].id_guru !== id_guru) {
            return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengedit materi ini.' });
        }

        const query = 'UPDATE materi SET judul = ?, deskripsi = ?, isi_materi = ? WHERE id = ?';
        await pool.execute(query, [judul, deskripsi, isi_materi, id]);
        res.status(200).json({ message: 'Materi berhasil diperbarui.', success: true });
    } catch (error) {
        console.error('Error updating materi:', error);
        res.status(500).json({ message: 'Gagal memperbarui materi.' });
    }
};

const deleteMateri = async (req, res) => {
    const { id } = req.params;
    const id_guru = req.user.id;

    try {
        const [materi] = await pool.execute('SELECT id_guru FROM materi WHERE id = ?', [id]);
        if (materi.length === 0 || materi[0].id_guru !== id_guru) {
            return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus materi ini.' });
        }

        await pool.execute('DELETE FROM materi WHERE id = ?', [id]);
        res.status(200).json({ message: 'Materi berhasil dihapus.', success: true });
    } catch (error) {
        console.error('Error deleting materi:', error);
        res.status(500).json({ message: 'Gagal menghapus materi.' });
    }
};

module.exports = {
    createMateri,
    getMateriByGuru,
    updateMateri,
    deleteMateri
};