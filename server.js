require('dotenv').config(); // Membaca konfigurasi dari file .env
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// ====================================================================
// 1. INISIALISASI GROQ AI SDK
// ====================================================================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ====================================================================
// 2. KREDENSIAL ADMIN PANEL RS FURNITURE
// ====================================================================
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_PIN = process.env.ADMIN_PIN || '211204';

// ====================================================================
// 3. SETUP DIREKTORI UPLOAD
// ====================================================================
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ====================================================================
// 4. MIDDLEWARE
// ====================================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Konfigurasi Multer untuk upload gambar produk
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ====================================================================
// 5. TEMPLATE KONEKSI DATABASE MYSQL (MYSQL WORKBENCH / XAMPP)
// ====================================================================
// Konfigurasi ini otomatis membaca port dan password dari file .env
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3309,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'rs_furniture',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
};

// Buat Connection Pool MySQL
const pool = mysql.createPool(dbConfig);

// Cek status koneksi MySQL saat server dimulai
async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('------------------------------------------------------------');
        console.log(`✅ [MySQL Connected] Berhasil terhubung ke database '${dbConfig.database}'`);
        console.log(`   Host: ${dbConfig.host} | Port: ${dbConfig.port} | User: ${dbConfig.user}`);
        console.log('------------------------------------------------------------');
        connection.release();
    } catch (err) {
        console.log('------------------------------------------------------------');
        console.error(`⚠️ [MySQL Connection Warning]: ${err.message}`);
        console.error(`👉 TIPS: Pastikan MySQL Workbench/service MySQL Anda sudah Running.`);
        console.error(`👉 Periksa file '.env' untuk menyesuaikan DB_PORT dan DB_PASSWORD.`);
        console.log('------------------------------------------------------------');
    }
}
testDbConnection();

// ====================================================================
// 6. ENDPOINT STATUS DATABASE (Untuk Memeriksa Koneksi dari Browser)
// ====================================================================
app.get('/api/db/status', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT DATABASE() as database_name, VERSION() as mysql_version");
        const [countRow] = await pool.query("SELECT COUNT(*) as total_produk FROM produk");

        res.json({
            status: "connected",
            message: "Berhasil terhubung ke MySQL Workbench!",
            database: rows[0].database_name,
            mysql_version: rows[0].mysql_version,
            total_produk: countRow[0].total_produk,
            config: {
                host: dbConfig.host,
                port: dbConfig.port,
                user: dbConfig.user
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Gagal terhubung ke database MySQL.",
            error: err.message,
            petunjuk: "Pastikan database 'rs_furniture' sudah dibuat di MySQL Workbench dan sesuaikan DB_PASSWORD / DB_PORT di file .env"
        });
    }
});

// ====================================================================
// 7. ENDPOINT KATALOG PRODUK (READ)
// ====================================================================

// GET: Ambil daftar produk dengan filter Kategori, Budget, dan Pencarian
app.get('/api/produk', async (req, res) => {
    try {
        const { kategori, max_budget, search } = req.query;

        let query = "SELECT * FROM produk WHERE 1=1";
        let params = [];

        if (kategori && kategori !== 'Semua') {
            query += " AND kategori = ?";
            params.push(kategori);
        }

        if (max_budget && !isNaN(max_budget) && Number(max_budget) > 0) {
            query += " AND harga <= ?";
            params.push(Number(max_budget));
        }

        if (search) {
            query += " AND (nama LIKE ? OR bahan LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        query += " ORDER BY harga ASC";

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Error GET /api/produk:", err.message);
        res.status(500).json({
            error: "Gagal mengambil data produk dari MySQL: " + err.message
        });
    }
});

// GET: Ambil detail 1 produk berdasarkan ID
app.get('/api/produk/:id', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM produk WHERE id = ?", [req.params.id]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan"
            });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Error GET /api/produk/:id:", err.message);
        res.status(500).json({
            error: "Gagal mengambil detail produk: " + err.message
        });
    }
});

// ====================================================================
// 8. ENDPOINT CHATBOT AI (GROQ) DENGAN KONTEKS DATA PRODUK
// ====================================================================
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: "Pesan tidak boleh kosong"
        });
    }

    try {
        // Ambil ringkasan produk dari MySQL untuk konteks chatbot AI
        let productContext = "[]";
        try {
            const [products] = await pool.query(
                "SELECT nama, kategori, bahan, harga, deskripsi FROM produk"
            );
            productContext = JSON.stringify(products);
        } catch (dbErr) {
            console.warn("Peringatan: Gagal membaca produk untuk AI context:", dbErr.message);
        }

        const systemPrompt = `
Kamu adalah Customer Service AI yang ramah dan profesional untuk toko 'RS Furniture'.

Kontak WhatsApp Admin RS Furniture:
081-215-618-998.

Keunggulan Toko:
- Seluruh produk bergaransi 1 Tahun.
- Bebas memilih dan meng-custom warna tanpa biaya tambahan.

Berikut adalah daftar katalog produk yang saat ini tersedia di database toko kami:

${productContext}

Instruksi Respons:
1. Jawab pertanyaan pelanggan dengan sopan dan ramah dalam bahasa Indonesia.
2. Rekomendasikan nama produk beserta harganya dari data di atas jika pelanggan bertanya tentang produk/budget.
3. Jawab pertanyaan dengan ringkas dan langsung pada intinya.
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "openai/gpt-oss-120b",
            temperature: 0.5,
            max_tokens: 300
        });

        const reply = chatCompletion.choices[0]?.message?.content ||
            "Maaf, terjadi kendala saat memproses balasan.";

        res.json({ reply });

    } catch (error) {
        console.error("Groq API Error:", error.message);
        res.status(500).json({
            reply: "Maaf, sistem AI sedang tidak dapat dijangkau. Silakan hubungi admin via WhatsApp di 081-215-618-998."
        });
    }
});

// ====================================================================
// 9. ENDPOINT AUTENTIKASI ADMIN
// ====================================================================
app.post('/api/admin/login', (req, res) => {
    const { username, password, pin } = req.body || {};

    // 1. Cek Login via PIN
    if (pin !== undefined && pin !== null && String(pin).trim() !== '') {
        const cleanPin = String(pin).trim();
        if (cleanPin === String(ADMIN_PIN).trim()) {
            return res.json({
                success: true,
                message: 'Login berhasil!',
                admin: { username: ADMIN_USERNAME },
                token: 'rs-admin-auth-' + Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64')
            });
        }
        return res.status(401).json({
            success: false,
            message: 'PIN admin yang dimasukkan salah.'
        });
    }

    // 2. Cek Login via Username & Password
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username dan password wajib diisi.'
        });
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();

    if (
        (cleanUsername === ADMIN_USERNAME && cleanPassword === ADMIN_PASSWORD) ||
        (cleanUsername === ADMIN_USERNAME && cleanPassword === ADMIN_PIN)
    ) {
        return res.json({
            success: true,
            message: 'Login berhasil!',
            admin: { username: cleanUsername },
            token: 'rs-admin-auth-' + Buffer.from(`${cleanUsername}:${Date.now()}`).toString('base64')
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Username atau password admin salah!'
    });
});

// Verifikasi Sesi Admin
app.get('/api/admin/check', (req, res) => {
    res.json({
        status: 'active',
        admin_ready: true
    });
});

// ====================================================================
// 10. ENDPOINT ADMIN: TAMBAH & HAPUS PRODUK (MYSQL)
// ====================================================================

// POST: Tambah Produk Baru ke MySQL
app.post('/api/produk', upload.single('foto'), async (req, res) => {
    try {
        const {
            nama,
            kategori,
            bahan,
            panjang,
            lebar,
            tinggi,
            harga,
            deskripsi,
            stok
        } = req.body;

        const foto_url = req.file
            ? `/uploads/${req.file.filename}`
            : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500";

        const sql = `
            INSERT INTO produk
            (nama, kategori, bahan, panjang, lebar, tinggi, harga, deskripsi, foto_url, stok)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await pool.query(sql, [
            nama,
            kategori,
            bahan,
            panjang ? Number(panjang) : null,
            lebar ? Number(lebar) : null,
            tinggi ? Number(tinggi) : null,
            Number(harga),
            deskripsi || '',
            foto_url,
            stok ? Number(stok) : 5
        ]);

        res.json({
            id: result.insertId,
            message: "Produk berhasil ditambahkan ke database MySQL!"
        });
    } catch (err) {
        console.error("Error POST /api/produk:", err.message);
        res.status(500).json({
            error: "Gagal menyimpan produk ke database MySQL: " + err.message
        });
    }
});

// DELETE: Hapus Produk dari MySQL berdasarkan ID
app.delete('/api/produk/:id', async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM produk WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Produk tidak ditemukan atau sudah dihapus."
            });
        }

        res.json({
            message: "Produk berhasil dihapus dari database MySQL"
        });
    } catch (err) {
        console.error("Error DELETE /api/produk/:id:", err.message);
        res.status(500).json({
            error: "Gagal menghapus produk: " + err.message
        });
    }
});

// ====================================================================
// 11. JALANKAN SERVER
// ====================================================================
app.listen(PORT, () => {
    console.log(`🚀 Server RS Furniture aktif di http://localhost:${PORT}`);
    console.log(`📁 Katalog Publik: http://localhost:${PORT}`);
    console.log(`🔐 Admin Login:   http://localhost:${PORT}/admin-login.html`);
    console.log(`🛠️ Status MySQL:   http://localhost:${PORT}/api/db/status`);
});