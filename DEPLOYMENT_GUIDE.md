# 📘 PANDUAN DEPLOYMENT WEBSITE SEKOLAH

## Prasyarat

- Akun hosting (cPanel, NiagaHoster, atau hosting lainnya)
- Domain yang sudahpointing ke hosting
- File project website sekolah

---

## LANGKAH 1: Download & Siapkan File

### 1.1. Download File Project
Download file website sekolah dari link yang diberikan admin.

### 1.2. Extract File
```bash
# Extract file ZIP yang sudah didownload
unzip website-sekolah.zip
cd website-sekolah
```

---

## LANGKAH 2: Konfigurasi API

### 2.1. Buat File `.env`

Di dalam folder project, buat file baru dengan nama `.env` (titik di depan).

### 2.2. Isi File `.env`

```env
# ========================================
# KONFIGURASI WEBSITE SEKOLAH
# ========================================

# API Base URL (biarkan seperti ini)
VITE_API_BASE_URL=https://be-school.kiraproject.id

# School ID (dari admin)
VITE_SCHOOL_ID=55

# API Key (dari admin - JANGAN BERITAHUAN ORANG LAIN!)
VITE_API_KEY=tenant-55-abc123xyzdef456
```

### 2.3. Contoh Lokasi File

```
website-sekolah/
├── .env                    ← Buat file ini
├── src/
├── public/
├── package.json
└── README.md
```

---

## LANGKAH 3: Build Project

### 3.1. Install Dependencies

```bash
npm install
```

### 3.2. Build untuk Production

```bash
npm run build
```

Setelah build selesai, akan muncul folder `dist/` atau `build/` berisi file siap deploy.

---

## LANGKAH 4: Deploy ke Hosting

### Metode A: cPanel / Hosting Biasa

#### 4A.1. Upload via File Manager
1. Login ke cPanel
2. Buka **File Manager**
3. Navigate ke `public_html` atau folder domain
4. Upload isi folder `dist/` ke `public_html/`

#### 4A.2. Upload via FTP
1. Gunakan FTP Client (FileZilla, Cyberduck)
2. Connect ke hosting dengan credentials FTP
3. Upload semua file dari folder `dist/`

### Metode B: Vercel (Recommended - Gratis)

#### 4B.1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 4B.2. Login ke Vercel
```bash
vercel login
```

#### 4B.3. Deploy
```bash
cd website-sekolah
vercel
```

Ikuti instruksi di layar. Dalam 1-2 menit website sudah online!

### Metode C: Netlify

1. Buka [netlify.com](https://netlify.com)
2. Login / Sign up
3. Klik "Add new site" → "Deploy manually"
4. Drag & drop folder `dist/` ke area yang tersedia
5. Website akan langsung online!

---

## LANGKAH 5: Setup Domain (Optional)

### 5.1. Custom Domain di Vercel
```bash
vercel add domain
# Ikuti instruksi untuk pointing domain
```

### 5.2. Custom Domain di Netlify
1. Buka site settings
2. Pilih "Custom domains"
3. Tambah domain sekolah (misal: smkn5.sch.id)
4. Ikuti instruksi untuk setup DNS

### 5.3. Setup DNS

Tambahkan record DNS di domain registrar:

```
Type    Name    Value                   TTL
------  ------  ----------------------  ----
CNAME   www     your-site.vercel.app    3600
CNAME   @       your-site.vercel.app    3600
```

---

## LANGKAH 6: Verifikasi

### 6.1. Test Website
Buka browser → ketik URL website sekolah

### 6.2. Test API Connection
Buka DevTools (F12) → Console → Lihat apakah ada error API

Kalau muncul error seperti:
```
API Key diperlukan
```
→ Cek kembali file `.env` sudah benar

---

## TROUBLESHOOTING

### Error: "API Key tidak valid"
1. Pastikan file `.env` ada dan benar
2. Pastikan tidak ada spasi ekstra
3. Pastikan tanda kutip sudah benar

### Error: "CORS Error"
1. Hubungi admin untuk whitelist domain kamu
2. Pastikan domain sudah pakai HTTPS

### Website Blank / Putih
1. Buka DevTools → Console → cek error
2. Pastikan sudah melakukan `npm run build`
3. Pastikan file `.env` sudah dibuat

### Error saat Build
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
npm run build
```

---

## KEAMANAN

### ⚠️ PENTING:

1. **JANGAN** upload file `.env` ke GitHub atau repository publik
2. **JANGAN** share API Key ke orang yang tidak berhak
3. Pastikan website menggunakan **HTTPS**

### Cara Mengamankan di GitHub:
Buat file `.gitignore` dengan isi:
```
.env
.env.local
.env.production
```

---

## KONTAK SUPPORT

Kalau ada masalah:
- Email: support@kiraproject.id
- WhatsApp: Hubungi admin

---

## VERSI DOKUMENTASI

- Versi: 1.0.0
- Tanggal: April 2026
- Platform: Vite + React