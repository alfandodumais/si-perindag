# SI-PERINDAG (Sistem Informasi Dinas Perdagangan)

Aplikasi Full-Stack modern untuk pendataan, pemetaan GIS, dan verifikasi Usaha Mikro, Kecil, dan Menengah (UMKM) serta Pedagang Daerah di bawah naungan Dinas Perdagangan.

Sesuai dengan bagan arsitektur sistem:
1. **PORTAL (Publik / Pelaku Usaha)**:
   - Formulir pendaftaran mandiri (Nama, NIK, No. HP, Nama Usaha, Kategori Komoditas, Skala Usaha, Alamat).
   - **Interactive GIS Map Picker (Leaflet / OpenStreetMap)**: Pemilihan titik koordinat usaha secara presisi pada peta digital interaktif dengan fitur pencarian alamat dan deteksi lokasi otomatis (*Geolocation*).
   - Upload berkas e-KTP dan Foto Tempat Usaha / Produk.
   - Pelacakan status pendaftaran mandiri menggunakan Nomor Registrasi (`REG-YYYYMM-XXXX`) atau NIK.
   - Cetak Surat Tanda Pendaftaran Usaha Perdagangan resmi ber-QR Code validasi.
   - Peta publik sebaran UMKM terverifikasi di seluruh wilayah kecamatan.
2. **SYSTEM (Backoffice Admin Dinas Perdagangan)**:
   - Autentikasi petugas verifikator dinas.
   - Dashboard analitik KPI (Total Pendaftar, Pending, Disetujui, Ditolak).
   - Peta GIS pemetaan sebaran pedagang dengan indikator warna status.
   - Modul verifikasi permohonan pendaftaran (Setujui / Tolak dengan catatan revisi).
   - Cetak Surat Tanda Terdaftar resmi (format A4 PDF siap cetak dengan kop dinas dan QR Code).
   - Export rekapitulasi data pendaftar ke format Excel / CSV.

---

## 🚀 Teknologi Utama

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript, React 18).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan palet warna instansi dinas resmi (*Emerald, Slate & Navy*).
- **GIS / Peta Digital**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) (OpenStreetMap 100% gratis tanpa API Key).
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) dengan **SQLite** (lokal) & siap migrasi ke LibSQL / Turso / Postgres untuk Vercel.
- **Autentikasi**: JSON Web Token (JWT) & HTTP-Only Secure Cookies.
- **Ikon & Komponen**: [Lucide React](https://lucide.dev/), [QRCode](https://github.com/soldair/node-qrcode).

---

## 🛠️ Panduan Menjalankan di Lokal (Development)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Lingkungan (`.env`)
File `.env` sudah disediakan secara otomatis untuk penggunaan lokal:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="si-perindag-super-secret-key-2026"
NEXT_PUBLIC_APP_NAME="SI-PERINDAG"
NEXT_PUBLIC_REGION_NAME="Dinas Perindustrian dan Perdagangan"
```

### 3. Migrasi & Seed Database
Jalankan perintah berikut untuk membuat database SQLite lokal dan mengisi data akun admin serta pedagang percontohan:
```bash
npx prisma db push
npm run db:seed
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di `http://localhost:3000`.

---

## 🔑 Akun Default Petugas Dinas (Backoffice Admin)

- **URL Login Admin**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

---

## 🌐 Panduan Deploy ke Vercel

Panduan lengkap mengenai persiapan deploy ke platform Vercel dapat Anda baca pada dokumen khusus:
👉 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
