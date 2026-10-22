# 🕌 Website Resmi Masjid Al-Ikhlas Gunung Kudung KM 145
### Pusat Ibadah Umat & Rest Area Persinggahan Musafir 24 Jam Non-Stop
**Jl. Poros Bengalon - Muara Wahau KM 145, Jalur Trans-Kalimantan, Kab. Kutai Timur, Kalimantan Timur (WITA - UTC+8)**

---

## 🌟 Tentang Aplikasi

Aplikasi web modern ini dibangun khusus untuk **DKM Masjid Al-Ikhlas Gunung Kudung KM 145** sebagai sarana dakwah digital, pusat informasi pelayanan jamaah, transparansi kas masjid, dan panduan musafir perjalanan darat antarkota (Samarinda – Sangatta – Muara Wahau – Berau).

Website ini menggunakan arsitektur **Jamstack / Single Page Application (SPA)** yang dipadukan dengan **Google Sheets & Google Apps Script** sebagai basis data cloud *real-time* tanpa biaya langganan bulanan (*zero cost*).

---

## 🚀 Fitur Unggulan

1. **Jadwal Sholat Real-Time (WITA)**:
   - Penghitungan waktu sholat akurat untuk koordinat Gunung Kudung Bengalon (0.8755° LU, 117.1680° BT).
   - Pengingat hitung mundur (*countdown*) sholat berikutnya & waktu Imsak.
   - Jadwal sholat bulanan lengkap dengan tombol buka popup.

2. **Layanan Rest Area & Fasilitas Musafir 24 Jam**:
   - Menampilkan fasilitas ramah musafir: tempat wudhu air pegunungan melimpah, toilet & kamar mandi bersih, area parkir luas (motor, mobil, travel, bus, truk), bale istirahat & dispenser air minum gratis, colokan charger HP, dan keamanan 24 jam.
   - **Bisa diedit langsung dari Portal Admin**: Pengurus dapat menambah fasilitas baru, mengubah ikon (14 pilihan ikon visual), mengubah ketersediaan, serta mengatur urutan tampilan.
   - Panduan fiqih safar sholat Jamak & Qashar untuk musafir jalur trans-Kalimantan.

3. **Artikel & Berita Warta Masjid (Carousel Dinamis)**:
   - Tampilan slider / carousel modern dengan auto-play.
   - Filter kategori warta: *Kabar Masjid*, *Kegiatan TPQ*, *Info Musafir*, *Kajian & Fiqih*, *Pembangunan & Kas*.
   - Pilihan 4 jenis template layout tata letak foto (*Banner Atas*, *Editorial Foto Kiri*, *Editorial Foto Kanan*, dan *Galeri Foto Dokumentasi*).
   - Tombol bagikan langsung ke WhatsApp.
   - Tambah, edit, dan hapus artikel secara real-time dari Portal Admin.

4. **TPQ Al-Muhajirin (Resmi LPTKA - BKPRMI)**:
   - Data legalitas lembaga: NSLPQ `411264080597`.
   - Kurikulum pembelajaran: Tilawati & Iqro, Hafalan Juz 'Amma, Praktek Wudhu & Sholat, Doa Harian, dan Kisah Nabi.
   - Kontak langsung ustadz/pengurus TPQ via WhatsApp.

5. **Transparansi Kas & Infaq Online**:
   - Laporan saldo kas terkini, total pemasukan, dan pengeluaran operasional.
   - Informasi Rekening Resmi Bank BRI dan QRIS Standar Nasional.
   - Input transaksi pemasukan/pengeluaran baru langsung dari Portal Admin.

6. **Jadwal Khutbah Sholat Jum'at Mingguan**:
   - Menampilkan nama Khatib, Imam, Muadzin, Topik Khutbah, dan Waktu Adzan Jum'at yang selalu diperbarui oleh DKM.

7. **Buku Tamu Digital Musafir**:
   - Musafir dan warga dapat mengisi kesan, pesan, asal kota, dan status perjalanan.
   - Data otomatis tersimpan ke Google Sheets.

8. **Peta Rute & Titik Penting Jalur Poros**:
   - Informasi rute dari Sangatta (±145 km), Bengalon (±85 km), Wahau (±30 km), Berau (±210 km), dan Samarinda (±320 km).
   - Tombol navigasi 1-klik menuju Google Maps dan Waze.

9. **Portal Admin Terproteksi Password**:
   - Password admin 100% aman dan tidak terlihat di publik.
   - Seluruh pengelolaan (Artikel, Fasilitas, Kas, Jadwal, TPQ, Agenda, Rekening BRI & QRIS) terpusat dalam 1 jendela admin yang responsif di HP maupun laptop.

---

## 🌐 Panduan Hosting & Deploy ke Netlify

Website ini 100% siap di-hosting ke [Netlify](https://www.netlify.com/) secara gratis.

### Opsi A: Drag & Drop Folder Build (Paling Mudah)
1. Jalankan perintah kompilasi di terminal:
   ```bash
   npm install
   npm run build
   ```
2. Buka dashboard [Netlify](https://app.netlify.com/) dan login.
3. Buka tab **Sites**, lalu tarik (*drag & drop*) folder `dist` yang telah dihasilkan ke area deploy Netlify.
4. Website Anda langsung online dalam hitungan detik!

### Opsi B: Hubungkan Repositori Git (Otomatis)
1. Push proyek ini ke GitHub / GitLab.
2. Di Netlify, pilih **Add new site > Import an existing project**.
3. Pilih repositori Anda. File `netlify.toml` yang sudah tersedia di proyek ini akan otomatis mengonfigurasi:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Redirects SPA**: Mengarahkan seluruh rute ke `/index.html` (bebas error 404).

---

## ⚡ Sinkronisasi Real-Time dengan Google Sheets

### Kenapa Tidak Perlu Gonta-Ganti File HTML di Netlify?
Website ini dibuat dinamis. File HTML di Netlify hanya bertindak sebagai antarmuka yang selalu mengambil data terkini via Google Apps Script API. Jadi setelah website live di Netlify, **Anda tidak perlu mengedit file HTML atau upload ulang file ke Netlify setiap kali ada artikel atau fasilitas baru**.

### Langkah Menghubungkan Google Spreadsheet:
1. Buka spreadsheet Google Sheets pengurus masjid.
2. Buka menu **Ekstensi > Apps Script**.
3. Buka **Portal Admin** di website Anda, masuk ke tab **🌐 Integrasi Google Sheets & Netlify**, lalu klik tombol **"Salin Kode Script"**.
4. Tempelkan (*paste*) kode tersebut ke editor Apps Script di Google Sheets Anda.
5. Klik **Deploy > New deployment**:
   - Pilih jenis: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone (Siapa saja)**
6. Salin URL Web App yang dihasilkan (berawalan `https://script.google.com/macros/s/.../exec`).
7. Masukkan URL tersebut ke kolom **URL Google Apps Script** di Portal Admin website Anda, lalu klik **Simpan URL** dan **Uji Koneksi**.

---

## 🛠️ Menjalankan Proyek Secara Lokal

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

3. **Periksa kode & tipe data**:
   ```bash
   npm run lint
   ```

---

## 📞 Informasi Kontak & Layanan Masjid

- **Alamat**: Gunung Kudung, Desa Tepian Langsat, Kec. Bengalon, Kab. Kutai Timur, Kalimantan Timur
- **Rute**: Jl. Poros Muara Wahau KM 145 (Jalur Trans-Kalimantan)
- **Kontak / WhatsApp DKM**: `+62 821-5074-5576` / `+62 853-8980-8592`
- **Email**: `masjid.alikhlas.gunungkudung@gmail.com`
