-- =========================================================
-- SIGAP — Sistem Informasi Gangguan & Perbaikan
-- MySQL Database Dump & Schema Definition
-- Compatible with XAMPP, phpMyAdmin, MariaDB, MySQL 5.7+ / 8.0+
-- =========================================================

CREATE DATABASE IF NOT EXISTS `sigap_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sigap_db`;

-- ---------------------------------------------------------
-- 1. Table Structure for `reports`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` VARCHAR(36) NOT NULL,
  `ticket_number` VARCHAR(50) NOT NULL,
  `nama_pelapor` VARCHAR(150) NOT NULL,
  `bagian` VARCHAR(100) NOT NULL,
  `unit_kerja` VARCHAR(150) NOT NULL,
  `nomor_hp` VARCHAR(30) DEFAULT NULL,
  `lokasi_kerusakan` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `foto_url` LONGTEXT DEFAULT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'MENUNGGU',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `reports_ticket_number_unique` (`ticket_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 2. Table Structure for `activity_logs`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` VARCHAR(36) NOT NULL,
  `waktu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `admin` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'SUPER_ADMIN',
  `aktivitas` VARCHAR(100) NOT NULL,
  `target` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- 3. Table Structure for `admin_users`
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` VARCHAR(36) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
  `is_banned` TINYINT(1) NOT NULL DEFAULT 0,
  `banned_until` DATETIME(3) DEFAULT NULL,
  `banned_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Default Seed Accounts for Multi-Role Auth:
-- 1. Super Admin: superadmin (Password: super123)
-- ---------------------------------------------------------
INSERT INTO `admin_users` (`id`, `username`, `password`, `nama`, `role`, `is_banned`) VALUES
('adm-super-001', 'superadmin', '$2a$10$wT2M.xO5bW.O1c/gD4M0..aZzO3B5d7kE2lP6Q0R2S4T6U8V1W2X3', 'Super Admin SIGAP', 'SUPER_ADMIN', 0);

-- =========================================================
-- END OF MYSQL DUMP SCRIPT
-- =========================================================
