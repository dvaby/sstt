# 💖 Website Kenangan Spesial untuk Vhenix

Web interaktif bertema **Warm Peach & Lavender** bergaya **Polaroid Scrapbook**, dirancang khusus agar ringan dan nyaman dibuka lewat browser HP.

## 📁 Struktur File
- `index.html` — Struktur halaman (Layarkunci kode `060307`, layar sambutan, dan halaman rekapan 6 momen).
- `styles.css` — Tema warna *Warm Peach & Lavender*, kartu Polaroid dengan *washi tape*, serta animasi responsif untuk HP.
- `app.js` — Logika keypad imut, ledakan partikel love, tombol **Keluar** yang kabur, musik kotak musik otomatis, dan konfigurasi 6 momen.
- `images/` — Folder tempat menaruh foto (`.jpg`/`.png`) maupun video pendek (`.mp4`/`.webm`) kenangan kalian.

## 🖼️🎬 Cara Memasukkan Foto & Video Kenangan
1. Siapkan 6 foto favorit atau video pendek kalian (bisa dicampur, misalnya 4 foto + 2 video) dan masukkan ke dalam folder **`images/`**.
2. Beri nama filenya atau sesuaikan pada bagian `image:` di **`app.js`**, misalnya:
   - `foto1.jpg`
   - `foto2.mp4`
   - `foto3.jpg`
   - `foto4.mp4`
   - `foto5.jpg`
   - `foto6.jpg`
   *(Gunakan video format **`.mp4`** berdurasi singkat **3–10 detik** dan ukuran di bawah **8 MB** agar otomatis berputar mulus di HP. Setiap kartu video dilengkapi tombol **🔇 / 🔊** yang otomatis menjeda musik latar saat suara video dinyalakan.)*

## ✏️ Cara Mengubah Judul & Cerita Tiap Momen
1. Buka file **`app.js`**.
2. Edit bagian **`MEMORIES_DATA`** di baris paling atas (ubah `title`, `date`, dan `story` untuk Chapter 01 sampai Chapter 06).

## 🎵 Cara Mengganti Lagu Latar (Opsional)
- Secara otomatis, web ini sudah memutar **melodi kotak musik romantis** begitu Vhenix memasukkan kode **`060307`**.
- Jika ingin memakai lagu MP3 kalian sendiri, cukup taruh file lagu di folder utama dengan nama **`music.mp3`** — web akan otomatis memutarnya!

## 📱 Cara Menjalankan & Mengirim ke Vhenix
- **Preview lokal di komputer:** Jalankan `npx serve .` atau `python3 -m http.server 8080`, lalu buka `http://localhost:8080`.
- **Kirim link ke HP Vhenix:** Upload folder `vhenix` ke **Vercel**, **Netlify**, atau **GitHub Pages** (semuanya gratis), lalu kirim link-nya ke Vhenix!
# sstt
