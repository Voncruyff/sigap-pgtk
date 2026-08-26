# 🏭 SIGAP &bull; Sistem Informasi Gangguan & Perbaikan
**PT Kebon Agung &bull; Pabrik Gula Trangkil**

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Vanilla-38BDF8?style=flat-square&logo=tailwindcss)

**SIGAP** adalah platform web sistem pelaporan gangguan dan perbaikan fasilitas serta peralatan kerja di **PT Kebon Agung Pabrik Gula Trangkil**. Aplikasi ini dirancang untuk mempercepat respon perbaikan teknis, meningkatkan transparansi penanganan kendala di lapangan, serta menyediakan manajemen arsip data perbaikan secara efisien.

---

## ✨ Fitur-Fitur Utama

### 👤 Modul Publik & Pelapor (User Side)
* **Formulir Laporan Gangguan (`/lapor`)**: Form pelaporan dengan generator nomor tiket otomatis (format `TUK-YYYYMMDD-XXXX`), pilihan unit/bagian kerja, lokasi kendala, rincian kerusakan, dan upload foto lampiran.
* **Pencarian & Cek Status Tiket (`/cek-status`)**: Pelacakan status perbaikan real-time berdasarkan nomor tiket laporan tanpa perlu login.
* **Papan Perkembangan Tiket (`/status/[ticketNumber]`)**: Tampilan alur progres perbaikan 4-langkah (*Form Dikirim &rarr; Menunggu Disposisi &rarr; Sedang Diproses &rarr; Perbaikan Selesai*).
* **Riwayat Tiket Lokal**: Penyimpanan otomatis nomor tiket laporan di peranti pelapor untuk kemudahan akses kembali.

### 🛡️ Modul Panel Admin SIGAP (Admin Side)
* **Dashboard Analitik (`/admin/dashboard`)**: Ringkasan 5 statistik utama (*Total Laporan, Menunggu, Diproses, Selesai, Petugas Admin*) dan feed Log Aktivitas terbaru.
* **Manajemen Laporan Aktif (`/admin/laporan`)**: Pengelolaan laporan berstatus `MENUNGGU` & `DIPROSES`. Laporan yang telah berstatus `SELESAI` otomatis dipindahkan ke arsip riwayat.
* **Riwayat & Arsip Perbaikan (`/admin/riwayat`)**: Pengarsipan data laporan tuntas dengan filter tanggal, pencarian kata kunci, serta opsi ekspor dokumen (PDF/Excel).
* **Kelola Akun Admin (`/admin/kelola-admin`)**: Manajemen pengguna admin oleh Super Admin, termasuk fitur penonaktifan/banned berjangka maupun permanen.
* **Audit Log Aktivitas (`/admin/log-aktivitas`)**: Pencatatan riwayat tindakan admin (perubahan status laporan, pembaruan profil, penambahan/banned admin).
* **Pengaturan Profil (`/admin/pengaturan`)**: Pembaruan profil dengan verifikasi keamanan kata sandi saat menyimpan perubahan.

---

## 🛠️ Teknologi & Arsitektur

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components, API Routes)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) dengan Database PostgreSQL
* **Desain & UI**: [TailwindCSS](https://tailwindcss.com/), Radix UI, Lucide Icons, dan Motion Animation
* **Tipografi**: Google Font `Poppins` (Font Utama) & `JetBrains Mono` (Nomor Tiket & Kode Log)
* **Autentikasi**: JWT (JSON Web Token) dengan penyimpanan HttpOnly Cookie & Bcrypt Password Hashing

---

## 📐 Panduan Desain & Style Guide

Aplikasi ini menggunakan standar panduan visual resmi **PT Kebon Agung PG Trangkil**. Dokumentasi lengkap warna, tipografi, dan prinsip desain minimalis dapat dilihat pada dokumen:

👉 [**STYLE_GUIDE.md**](./STYLE_GUIDE.md)

---

## 🚀 Cara Menjalankan Proyek (Getting Started)

### 1. Prasyarat Sistem
* Node.js v18.0.0 atau versi yang lebih baru
* Database PostgreSQL

### 2. Instalasi Dependensi
```bash
# Clone repositori proyek
git clone https://github.com/Voncruyff/sigap-pgtk.git
cd sigap-pgtk

# Instal dependensi paket
npm install
```

### 3. Konfigurasi Environment Variable (`.env`)
Buat file `.env` di root proyek dan lengkapi konfigurasi variabel berikut:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/sigap_db?schema=public"
JWT_SECRET="sigap_secret_key_change_in_production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Migrasi & Seed Database
```bash
# Sinkronisasi skema database Prisma
npx prisma db push

# Menjalankan data awal admin default
npx prisma db seed
```

### 5. Menjalankan Server Pengembang
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat aplikasi SIGAP.

---

## 📄 Lisensi & Hak Cipta

© **PT Kebon Agung &bull; Pabrik Gula Trangkil**. Hak Cipta Dilindungi Undang-Undang.
