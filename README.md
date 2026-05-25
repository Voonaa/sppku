# 🎓 SPPku — Sistem Pengelolaan Pembayaran SPP Premium

Aplikasi **SPPku** adalah platform modern yang dirancang khusus untuk mengelola administrasi pembayaran Sumbangan Pembinaan Pendidikan (SPP) secara efisien. Proyek ini dibangun dengan arsitektur *decoupled* profesional untuk memisahkan logika backend RESTful API dengan antarmuka frontend Single Page Application (SPA) yang interaktif dan dinamis.

---

## 🛠️ Tech Stack & Ekosistem

Aplikasi ini menggunakan teknologi mutakhir industri untuk menjamin kecepatan, keamanan, dan keindahan visual:

- **Backend**: **Laravel 12** ( REST API murni, menggunakan struktur rute asinkron dan validasi data tangguh ).
- **Frontend**: **React.js** ( SPA bertenaga **Vite** untuk kompilasi super cepat ).
- **Desain & Gaya**: **Tailwind CSS v4** mengimplementasikan tema kustom **Alexandria — High-End Editorial** (tipografi premium, *No-Line Rule* tanpa border tajam, efek shadow difus, serta Glassmorphism sidebar).
- **Basis Data**: **MySQL** (diintegrasikan melalui server Laragon).
- **Pengujian**: **PHPUnit** (menjamin cakupan pengujian unit & fitur di sisi backend).

---

## ✨ Fitur-Fitur Utama

1. **Autentikasi Multi-Role Otoritas**:
   - Mendukung login untuk **Admin** (akses penuh kelola master data) dan **Petugas/Kasir** (akses transaksi pembayaran).
   - Pengamanan request menggunakan *Custom Middleware* berbasis HTTP Header `X-Id-Petugas` yang terhindar dari kendala sesi CORS.

2. **Manajemen Transaksi Kasir & Sinkronisasi Real-Time**:
   - Halaman kasir dinamis dengan penghitungan uang kembalian secara interaktif.
   - Fitur **Cepat Bayar** di mana kasir dapat melihat daftar siswa belum melunasi SPP dan langsung melakukan pengisian formulir dengan satu klik.
   - Integrasi database backend dengan pengamanan `DB::transaction()` untuk menjamin integritas data (anti-corrupt) dan sinkronisasi instan ke tabel `cek_pembayaran`.

3. **Master Data CRUD Terintegrasi Penuh**:
   - CRUD lengkap untuk Data Siswa, Kelas, SPP, dan Petugas yang langsung terhubung ke basis data MySQL (tidak hilang saat halaman disegarkan).
   - Fitur pencarian data siswa responsif secara langsung (*live search*).

4. **Desain Premium Alexandria — High-End Editorial**:
   - Tipografi yang sangat elegan menggunakan Google Fonts: **Noto Serif** (judul), **Inter** (paragraf/tabel), dan **Public Sans** (label).
   - Estetika modern tanpa border 1px yang kasar (*No-Line Rule*), melainkan menggunakan elevasi bayangan halus (diffuse shadow 4-6% opacity) dan warna latar belakang yang lembut.
   - Halaman struk bukti bayar resmi yang siap dicetak (*print-ready layout* menggunakan perintah bawaan browser).

---

## 🗄️ Arsitektur Basis Data (Keunikan Proyek)

Proyek ini mengelola 6 tabel relasional yang dirancang khusus untuk memenuhi kriteria penilaian ujian kompetensi:

1. `tb_spp` — Tarif SPP per tahun.
2. `tb_kelas` — Kelas akademik siswa.
3. `tb_petugas` — Akun admin dan petugas penagihan.
4. `tb_siswa` — Profil data siswa beserta relasi kelas/SPP.
5. `tb_pembayaran` — Riwayat transaksi pembayaran SPP.
6. `cek_pembayaran` — Tabel ringkasan status pembayaran aktif siswa.

> [!IMPORTANT]
> **Keunikan Primary Key VARCHAR**: 
> Sesuai spesifikasi teknis ketat, seluruh model data utama menggunakan tipe data `VARCHAR` sebagai Primary Key (bukan Auto-Increment Integer). Proyek ini berhasil mengonfigurasinya secara kokoh dengan pengaturan `public $incrementing = false;` dan `protected $keyType = 'string';` di setiap Model Eloquent.

---

## 🚀 Panduan Instalasi Lokal

### 1. Prasyarat Sistem
- **Laragon / XAMPP** (dengan PHP 8.2 ke atas & MySQL).
- **Composer** (untuk dependensi Laravel).
- **Node.js & npm** (untuk frontend React).

### 2. Konfigurasi Backend (Laravel)
1. Salin berkas `.env.example` menjadi `.env` dan sesuaikan kredensial basis data Anda:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=sppku
   DB_USERNAME=root
   DB_PASSWORD=
   ```
2. Jalankan instalasi dependensi dan migrasi basis data:
   ```bash
   composer install
   php artisan migrate --seed
   ```
3. Jalankan server lokal backend Laravel:
   ```bash
   php artisan serve
   ```
   *Backend akan aktif di alamat `http://127.0.0.1:8000`.*

### 3. Konfigurasi Frontend (React SPA)
1. Masuk ke direktori frontend:
   ```bash
   cd frontend-sppku
   ```
2. Instal dependensi Node.js:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan Vite lokal:
   ```bash
   npm run dev
   ```
   *Frontend akan aktif di alamat `http://localhost:5173`.*

---

## 🧪 Menjalankan Pengujian Backend
Untuk memverifikasi kebenaran logika backend dan transaksi basis data:
```bash
php artisan test
```
