-- ====================================================================
-- DATABASE SCRIPT RS FURNITURE (UNTUK MYSQL WORKBENCH / PHPMYADMIN)
-- ====================================================================
-- Petunjuk penggunaan di MySQL Workbench:
-- 1. Buka MySQL Workbench dan hubungkan ke Local Instance MySQL Anda.
-- 2. Buka file ini (File -> Open SQL Script) atau Copy-Paste query berikut.
-- 3. Klik tombol Execute (ikon petir ⚡) untuk menjalankan seluruh query.
-- ====================================================================

-- 1. Buat Database jika belum ada
CREATE DATABASE IF NOT EXISTS `rs_furniture` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Gunakan database rs_furniture
USE `rs_furniture`;

-- 3. Buat Tabel Produk
CREATE TABLE IF NOT EXISTS `produk` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama` VARCHAR(255) NOT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `bahan` VARCHAR(255) NOT NULL,
    `panjang` DECIMAL(10, 2) DEFAULT NULL,
    `lebar` DECIMAL(10, 2) DEFAULT NULL,
    `tinggi` DECIMAL(10, 2) DEFAULT NULL,
    `harga` BIGINT NOT NULL,
    `deskripsi` TEXT DEFAULT NULL,
    `foto_url` TEXT DEFAULT NULL,
    `stok` INT DEFAULT 5,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Masukkan Data Seeder Katalog RS Furniture
INSERT INTO `produk` 
(`id`, `nama`, `kategori`, `bahan`, `panjang`, `lebar`, `tinggi`, `harga`, `deskripsi`, `foto_url`, `stok`) 
VALUES
(1, 'L Putus Rectangle', 'Ruang Tamu', 'Kain Fabric / Custom', 200, 140, 80, 1900000, 'Sofa L Putus Rectangle nyaman, bebas pilih & custom warna tanpa biaya tambahan. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(2, 'L Putus Vios', 'Ruang Tamu', 'Kain Fabric / Custom', 200, 140, 80, 1950000, 'Sofa L Putus Vios modern, bebas pilih & custom warna tanpa biaya tambahan. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(3, 'L Putus Civic', 'Ruang Tamu', 'Kain Fabric / Velvet', 210, 150, 85, 2700000, 'Sofa L Putus Civic dengan aksen kancing klasik. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(4, 'Sofa Sudut Ilufa', 'Ruang Tamu', 'Kain Fabric / Sintetis', 220, 160, 85, 2400000, 'Sofa sudut Ilufa elegan cocok untuk ruang keluarga. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(5, 'Sofa Ornhis', 'Ruang Tamu', 'Kain Suede / Fabric', 230, 160, 85, 2800000, 'Sofa Ornhis lengkap dengan puff dudukan tambahan. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(6, 'Sofa Cancer', 'Ruang Tamu', 'Kain Fabric Premium', 220, 150, 80, 2300000, 'Sofa Cancer desain dinamis dengan bantalan empuk. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(7, 'Sofa Beranak / Ottoman', 'Ruang Tamu', 'Kombinasi Fabric / Oscar', 250, 180, 85, 3800000, 'Sofa beranak dengan banyak stool/ottoman kecil serbaguna. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(8, 'Sofa Gelombang Cinta / Curved', 'Ruang Tamu', 'Kulit Oscar / Sintetis', 240, 180, 90, 2800000, 'Sofa bentuk lengkung mewah khas ruang tamu besar. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(9, 'Jaguar Series Sofa', 'Ruang Tamu', 'Kulit Oscar Premium', 260, 190, 95, 4900000, 'Sofa Mewah Jaguar Series dengan ukiran dan busa tebal. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(10, 'Boxy Sofa / Boxer', 'Ruang Tamu', 'Kulit Sintetis Tebal', 250, 190, 90, 5000000, 'Sofa Boxy/Boxer kokoh dan tahan lama. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(11, 'Sofa Headrest', 'Ruang Tamu', 'Kain Fabric Mild', 240, 160, 90, 3700000, 'Sofa dilengkapi penyangga kepala (headrest) yang adjustable. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(12, 'Sofa Elfa', 'Ruang Tamu', 'Kain Suede Soft', 210, 150, 85, 3600000, 'Set sofa Elfa 3-2-1 dudukan lengkap. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(13, 'Sofa Dolphin', 'Ruang Tamu', 'Kombinasi Fabric & Oscar', 200, 140, 80, 2800000, 'Sofa Dolphin minimalis modern. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(14, 'Sofa Demini', 'Ruang Tamu', 'Kain Fabric Bludru', 220, 150, 85, 2800000, 'Sofa Demini dengan bench panjang tambahan. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5),
(15, 'Sofa Bed', 'Kamar Tidur', 'Kain Fabric / Canvas', 180, 110, 40, 1750000, 'Sofa fleksibel yang bisa dilipat menjadi tempat tidur. Garansi 1 Tahun.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 5)
ON DUPLICATE KEY UPDATE 
    `nama`=VALUES(`nama`),
    `kategori`=VALUES(`kategori`),
    `bahan`=VALUES(`bahan`),
    `panjang`=VALUES(`panjang`),
    `lebar`=VALUES(`lebar`),
    `tinggi`=VALUES(`tinggi`),
    `harga`=VALUES(`harga`),
    `deskripsi`=VALUES(`deskripsi`),
    `foto_url`=VALUES(`foto_url`),
    `stok`=VALUES(`stok`);

-- 5. Cek Hasil
SELECT * FROM `produk`;
