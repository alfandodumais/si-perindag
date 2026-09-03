# 🚀 Panduan Deploy SI-PERINDAG ke Vercel

Aplikasi ini dibangun menggunakan **Next.js 14 App Router** yang didesain secara khusus untuk platform **Vercel**.

> [!NOTE]
> Pada lingkungan Serverless Vercel, filesystem bersifat *ephemeral / read-only* pada setiap pemanggilan function. Oleh karena itu, file lokal `dev.db` (SQLite file) hanya digunakan untuk pengembangan lokal (*local development*).
> Untuk deployment production di Vercel, disarankan menghubungkannya ke database cloud gratis seperti **Turso** (Serverless SQLite) atau **Supabase / Neon** (PostgreSQL).

---

## Opsi 1: Menggunakan Turso (Serverless SQLite - Sangat Direkomendasikan)
Turso adalah database SQLite cloud serverless dengan tier gratis yang sangat memadai dan 100% kompatibel dengan sintaks SQLite.

### Langkah-langkah:
1. Buat akun gratis di [https://turso.tech/](https://turso.tech/).
2. Buat database baru bernama `si-perindag`.
3. Dapatkan **Database URL** (misal: `libsql://si-perindag-xxxx.turso.io`) dan **Auth Token**.
4. Di Vercel, atur Environment Variable:
   ```env
   DATABASE_URL="libsql://si-perindag-xxxx.turso.io?authToken=YOUR_AUTH_TOKEN"
   JWT_SECRET="masukkan-kunci-rahasia-acak-disini"
   NEXT_PUBLIC_APP_NAME="SI-PERINDAG"
   ```

---

## Opsi 2: Menggunakan Supabase / Neon / Vercel Postgres

Jika Anda lebih memilih PostgreSQL:
1. Buat project baru di [Supabase](https://supabase.com/) atau [Neon.tech](https://neon.tech/) (keduanya gratis).
2. Di file `prisma/schema.prisma`, cukup ganti provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Di Vercel, pasang `DATABASE_URL` dari database PostgreSQL Anda:
   ```env
   DATABASE_URL="postgres://postgres:password@db.supabase.co:5432/postgres"
   JWT_SECRET="masukkan-kunci-rahasia-acak-disini"
   ```

---

## Langkah Deploy ke Vercel via GitHub

### 1. Inisialisasi Git dan Push ke GitHub
Jalankan di terminal proyek Anda:
```bash
git init
git add .
git commit -m "feat: inisialisasi SI-PERINDAG full-stack Next.js"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/si-perindag.git
git push -u origin main
```

### 2. Import Proyek di Dashboard Vercel
1. Buka [https://vercel.com/dashboard](https://vercel.com/dashboard) dan klik **Add New... -> Project**.
2. Pilih repository `si-perindag`.
3. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL` (dari Turso atau Supabase)
   - `JWT_SECRET` (string acak yang aman)
   - `NEXT_PUBLIC_APP_NAME` = `SI-PERINDAG`
   - `NEXT_PUBLIC_REGION_NAME` = `Dinas Perindustrian dan Perdagangan`
4. Di bagian **Build and Output Settings**, biarkan default (`npm run build` yang sudah otomatis menjalankan `prisma generate && next build`).
5. Klik tombol **Deploy**!

Sistem SI-PERINDAG Anda akan langsung aktif secara global dengan domain gratis `.vercel.app`!
