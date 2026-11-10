<div align="center">

# 🛋️ RS FURNITURE
### Modern Furniture Catalog, Admin Management & AI Customer Service

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq_Cloud-AI_Powered-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<p align="center">
  Aplikasi web katalog furnitur modern yang dilengkapi dengan panel manajemen admin, sistem dual-autentikasi (Username/Password & PIN), integrasi kecerdasan buatan (AI Customer Service via Groq), dan konektivitas database MySQL Workbench.
</p>

[Fitur Utama](#-fitur-utama) •
[Tech Stack](#-teknologi-yang-digunakan) •
[Struktur Proyek](#-struktur-direktori) •
[Panduan Instalasi](#-panduan-instalasi--menjalankan-proyek) •
[Kredensial Bawaan](#-kredensial-admin-bawaan) •
[Dokumentasi API](#-dokumentasi-api)

---

</div>

## 📌 Gambaran Proyek

**RS Furniture** adalah solusi e-catalog berbasis web yang dirancang untuk toko furnitur lokal agar dapat menampilkan produk mereka secara profesional secara online. Pengguna dapat mencari furnitur berdasarkan kategori, bahan, dan budget harga, serta berkonsultasi langsung melalui asisten cerdas AI atau WhatsApp. Pemilik toko dibekali dengan **Admin Panel** yang aman untuk mengelola inventaris produk secara instan.

---

## ✨ Fitur Utama

### 🛒 1. Pengalaman Pengunjung (Katalog Publik)
* **Katalog Responsif & Modern:** Tampilan kartu produk yang bersih dengan gambar berkualitas, harga, dan bahan.
* **Filter Multifaset Real-Time:**
  * Filter berdasarkan kategori (*Ruang Tamu, Kamar Tidur, Dapur*).
  * Filter rentang anggaran (*budget slider*).
  * Pencarian teks instan berdasarkan nama produk dan bahan.
* **Halaman Detail Produk (`detail.html`):** Informasi spesifikasi ukuran dimensi ($P \times L \times T$), bahan kain/kulit, garansi 1 tahun, dan status stok.
* **Pemesanan WhatsApp Instan:** Tombol pesan langsung yang otomatis memformat teks pesanan dengan nama dan harga produk ke nomor admin.

### 🤖 2. Chatbot AI Customer Service (Groq API)
* Didukung model bahasa AI mutakhir (`openai/gpt-oss-120b`) melalui **Groq Cloud API** dengan inferensi ultra-cepat.
* **Context-Aware Database:** AI secara otomatis membaca daftar produk terkini dari database MySQL untuk memberikan rekomendasi yang akurat kepada calon pembeli.
* Mampu menjawab pertanyaan terkait konsultasi bahan, ukuran, opsi custom warna gratis, dan garansi.

### 🔐 3. Dual-Authentication Admin Login (`admin-login.html`)
* **Metode 1 (Username & Password):** Login standar akun admin dengan validasi keamanan.
* **Metode 2 (PIN Cepat 6-Digit):** Akses instan menggunakan kode PIN numerik admin.
* **Fitur UI & Proteksi:**
  * Toggle tampilkan/sembunyikan password dan PIN.
  * Fitur *Remember Me* (tersimpan di `localStorage` / `sessionStorage`).
  * Animasi *shake* dan indikator pesan kesalahan yang interaktif.
  * Tombol *Isi Otomatis* untuk kemudahan demonstrasi.
  * Halaman admin dilengkapi *Auth Guard* otomatis (redirect ke login jika belum terautentikasi).

### 🛠️ 4. Panel Manajemen Produk (`admin.html`)
* **Tambah Produk:** Form lengkap dengan input nama, kategori, material, dimensi (P, L, T), harga, deskripsi, stok, serta **upload gambar produk langsung** via Multer.
* **Hapus Produk:** Hapus data produk dari database MySQL secara real-time.
* **Status Koneksi Database:** Endpoint monitoring `/api/db/status` untuk memastikan server web terhubung ke MySQL Workbench.

---

## 💻 Teknologi yang Digunakan

| Komponen | Teknologi | Penjelasan |
| :--- | :--- | :--- |
| **Backend Runtime** | Node.js (v18+) | Runtime JavaScript non-blocking |
| **Web Framework** | Express.js 4.19 | Framework HTTP server & RESTful API |
| **Database** | MySQL (MySQL Workbench) | Database Relasional Relatif Tinggi |
| **Database Driver** | `mysql2/promise` | Driver performa tinggi dengan Connection Pooling |
| **File Upload** | Multer | Menangani multipart/form-data untuk upload foto produk |
| **AI / LLM Engine** | Groq Cloud SDK | Inferensi AI super cepat untuk Customer Service Chatbot |
| **Frontend UI** | HTML5, JavaScript (ES6+), Tailwind CSS | Antarmuka responsif tanpa dependensi framework berat |
| **Environment Config** | `dotenv` | Manajemen konfigurasi environment variable aman |

---

## 📁 Struktur Direktori

```plaintext
project 1/
├── public/                     # Asset frontend statis
│   ├── uploads/                # Direktori penyimpanan foto produk hasil upload
│   ├── index.html              # Halaman utama katalog produk publik & Chatbot AI
│   ├── detail.html             # Halaman rincian detail spesifikasi produk
│   ├── admin-login.html        # Halaman login admin (Dual-Auth: User/Pass & PIN)
│   └── admin.html              # Dashboard panel administrasi (Tambah & Hapus Produk)
├── .env                        # Konfigurasi environment (diabaikan oleh git)
├── .env.example                # Template konfigurasi environment
├── .gitignore                  # File pengabaian git
├── package.json                # Dependensi proyek & script runner
├── package-lock.json           # Lockfile dependensi
├── rs_furniture_mysql.sql      # Script DDL/DML untuk MySQL Workbench
└── server.js                   # Entry point aplikasi backend Express & API routes
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal:

### 1. Prasyarat Sistem
* [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru).
* [MySQL Server](https://dev.mysql.com/downloads/mysql/) dan [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (atau XAMPP / MariaDB).
* Git terpasang di komputer.

### 2. Clone Repositori
```bash
git clone https://github.com/USERNAME_ANDA/rs-furniture.git
cd rs-furniture
```

### 3. Instal Dependensi Node.js
```bash
npm install
```

### 4. Setup Database di MySQL Workbench
1. Buka aplikasi **MySQL Workbench**.
2. Hubungkan ke instance MySQL Anda (misal: `Local instance MySQL`).
3. Buka file [`rs_furniture_mysql.sql`](rs_furniture_mysql.sql) (`File` -> `Open SQL Script...`) atau salin seluruh kodenya.
4. Klik tombol **Execute (ikon petir ⚡)** untuk mengeksekusi script.
5. Database `rs_furniture` dan tabel `produk` beserta 15 data awal berhasil dibuat.

### 5. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan sesuaikan dengan akun MySQL di komputer Anda:
```env
# Konfigurasi Koneksi MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mysql_kamu
DB_NAME=rs_furniture

# Kredensial Admin Panel
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_PIN=211204

# API Key Groq AI (Opsional untuk fitur Chatbot)
GROQ_API_KEY=your_groq_api_key_here
```

### 6. Jalankan Server
```bash
npm start
```
Atau:
```bash
node server.js
```

Jika berhasil, terminal akan menampilkan:
```plaintext
------------------------------------------------------------
✅ [MySQL Connected] Berhasil terhubung ke database 'rs_furniture'
   Host: localhost | Port: 3306 | User: root
------------------------------------------------------------
🚀 Server RS Furniture aktif di http://localhost:3000
📁 Katalog Publik: http://localhost:3000
🔐 Admin Login:   http://localhost:3000/admin-login.html
🛠️ Status MySQL:   http://localhost:3000/api/db/status
```

---

## 🔑 Kredensial Admin Bawaan

| Parameter | Nilai Bawaan | Keterangan |
| :--- | :--- | :--- |
| **Username** | `admin` | Digunakan pada form login Username & Password |
| **Password** | `admin123` | Password akun admin |
| **PIN Cepat** | `211204` | Digunakan pada form login PIN Cepat 6-Digit |

> 💡 *Catatan: Anda dapat mengubah kredensial ini kapan saja melalui file `.env`.*

---

## 📡 Dokumentasi API

### 1. Produk Publik
| Method | Endpoint | Deskripsi | Query / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/produk` | Mengambil seluruh katalog produk | `kategori`, `max_budget`, `search` |
| `GET` | `/api/produk/:id` | Mengambil detail produk spesifik | Params: `id` |

### 2. Chatbot AI
| Method | Endpoint | Deskripsi | Payload JSON |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Berinteraksi dengan CS AI Toko | `{ "message": "rekomendasi sofa budget 2 juta" }` |

### 3. Autentikasi Admin
| Method | Endpoint | Deskripsi | Payload JSON |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Login via User/Pass atau PIN | `{ "username": "admin", "password": "..." }` atau `{ "pin": "211204" }` |
| `GET` | `/api/admin/check` | Mengecek kesiapan sesi admin | - |

### 4. Manajemen Produk (Admin)
| Method | Endpoint | Deskripsi | Format Data |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/produk` | Menambah produk baru + upload foto | `multipart/form-data` (`nama`, `kategori`, `bahan`, `panjang`, `lebar`, `tinggi`, `harga`, `deskripsi`, `foto`) |
| `DELETE` | `/api/produk/:id` | Menghapus produk dari database | Params: `id` |

### 5. Health Check Database
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/db/status` | Mengecek status koneksi MySQL, versi server, dan total produk |

---

## 🛡️ Keamanan & Best Practices
* **Environment Isolation:** File `.env` yang memuat password database dan token API dikecualikan dari repositori melalui `.gitignore`.
* **Parameter Binding:** Seluruh query ke database MySQL menggunakan parameterized queries (`?`) melalui `mysql2` untuk mencegah serangan **SQL Injection**.
* **Upload Sanitization:** Nama file gambar yang diunggah diproses ulang menggunakan format timestamp acak guna mencegah konflik penamaan dan eksploitasi file.

---

## 👨‍💻 Kontributor

* **Pengembang:** RS Furniture Dev Team
* **Lisensi:** Proyek ini dilisensikan di bawah [MIT License](LICENSE).
