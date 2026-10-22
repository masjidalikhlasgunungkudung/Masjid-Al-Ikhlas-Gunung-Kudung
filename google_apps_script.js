/**
 * =========================================================================================
 * SKRIP GOOGLE APPS SCRIPT (GAS) - WEBSITE RESMI MASJID AL-IKHLAS GUNUNG KUDUNG KM 145
 * =========================================================================================
 * 
 * SISTEM CLOUD DATABASE TERINTEGRASI (4 SHEET):
 * 1. Sheet "Pengaturan"  : Mengisi Nama Bank, Nomor Rekening (a.n. Masjid Al-Ikhlas), dan Kontak DKM.
 * 2. Sheet "KasKeuangan" : Mengisi mutasi kas (Tanggal, Keterangan, Jenis [Masuk/Keluar], Nominal, Kategori).
 * 3. Sheet "JadwalJumat" : Mengisi petugas Jum'at (Khatib, Imam, Muadzin & Judul Khutbah) tiap pekan.
 * 4. Sheet "BukuTamu"    : Menampung doa dan pesan musafir yang dikirim dari formulir website.
 * 
 * Pengurus masjid cukup mengedit spreadsheet di HP atau Laptop,
 * seluruh data di website akan terupdate otomatis secara real-time!
 * 
 * =========================================================================================
 * PANDUAN AKTIVASI (HANYA 2 MENIT):
 * 1. Buka Google Spreadsheet baru: https://sheets.new
 * 2. Beri nama: "Database Website Masjid Al-Ikhlas KM 145"
 * 3. Buka menu: "Ekstensi" (Extensions) > "Apps Script"
 * 4. Hapus seluruh kode default di editor, lalu paste skrip ini seluruhnya.
 * 5. Klik Simpan (Ctrl+S).
 * 6. Klik tombol biru "Terapkan" (Deploy) > "Penerapan baru" (New deployment).
 * 7. Pilih jenis: "Aplikasi Web" (Web app).
 * 8. Konfigurasi:
 *    - Jalankan sebagai (Execute as): "Saya" (Me)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone)  <-- WAJIB!
 * 9. Klik "Terapkan", berikan izin akun Google Anda.
 * 10. Salin URL Aplikasi Web yang berakhiran `/exec`.
 * 11. Masukkan URL ke tombol "Integrasi Google Sheets" di website Masjid Al-Ikhlas.
 * =========================================================================================
 */

const SHEET_PENGATURAN = "Pengaturan";
const SHEET_KAS = "KasKeuangan";
const SHEET_BUKUTAMU = "BukuTamu";
const SHEET_JADWAL = "JadwalJumat";

/**
 * Membuat lembar kerja dan header bersih (tanpa data tiruan/dummy)
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Sheet Pengaturan (Rekening & Profil)
  let setSheet = ss.getSheetByName(SHEET_PENGATURAN);
  if (!setSheet) {
    setSheet = ss.insertSheet(SHEET_PENGATURAN);
    setSheet.appendRow(["Kunci_Pengaturan", "Nilai"]);
    setSheet.getRange("A1:B1").setBackground("#064e28").setFontColor("#ffffff").setFontWeight("bold");

    setSheet.appendRow(["Nama_Bank", ""]);
    setSheet.appendRow(["Nomor_Rekening", ""]);
    setSheet.appendRow(["Atas_Nama", "Masjid Al-Ikhlas"]);
    setSheet.appendRow(["Kontak_WA_Konfirmasi", "082150745576"]);
  }

  // 2. Sheet KasKeuangan (Header Bersih)
  let kasSheet = ss.getSheetByName(SHEET_KAS);
  if (!kasSheet) {
    kasSheet = ss.insertSheet(SHEET_KAS);
    kasSheet.appendRow(["Tanggal", "Keterangan", "Jenis", "Nominal", "Kategori"]);
    kasSheet.getRange("A1:E1").setBackground("#064e28").setFontColor("#ffffff").setFontWeight("bold");
    // Dibiarkan kosong agar Anda isi sendiri data riilnya
  }

  // 3. Sheet BukuTamu (Header Bersih)
  let bukuTamuSheet = ss.getSheetByName(SHEET_BUKUTAMU);
  if (!bukuTamuSheet) {
    bukuTamuSheet = ss.insertSheet(SHEET_BUKUTAMU);
    bukuTamuSheet.appendRow(["Tanggal", "Nama", "AsalKota", "Status", "Pesan", "WaktuKirim"]);
    bukuTamuSheet.getRange("A1:F1").setBackground("#064e28").setFontColor("#ffffff").setFontWeight("bold");
    // Dibiarkan kosong, akan terisi otomatis saat musafir mengirim pesan dari website
  }

  // 4. Sheet JadwalJumat (Header Bersih)
  let jadwalSheet = ss.getSheetByName(SHEET_JADWAL);
  if (!jadwalSheet) {
    jadwalSheet = ss.insertSheet(SHEET_JADWAL);
    jadwalSheet.appendRow(["Tanggal", "Khatib", "Imam", "Muadzin", "JudulKhutbah", "WaktuAdzan"]);
    jadwalSheet.getRange("A1:F1").setBackground("#064e28").setFontColor("#ffffff").setFontWeight("bold");
    // Dibiarkan kosong agar Anda isi nama khatib & imam riil
  }
}

/**
 * Handler GET
 */
function doGet(e) {
  setupSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAll";

  if (action === "getKas") return handleGetKas(ss);
  if (action === "getBukuTamu") return handleGetBukuTamu(ss);
  if (action === "getJadwalJumat") return handleGetJadwalJumat(ss);
  if (action === "getPengaturan") return handleGetPengaturan(ss);

  return handleGetAll(ss);
}

/**
 * Handler POST untuk Buku Tamu
 */
function doPost(e) {
  setupSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let params = {};

  try {
    if (e.postData && e.postData.contents) {
      try { params = JSON.parse(e.postData.contents); } catch (err) { params = e.parameter || {}; }
    } else if (e.parameter) {
      params = e.parameter;
    }

    const action = params.action || "addBukuTamu";

    if (action === "addBukuTamu") {
      const sheet = ss.getSheetByName(SHEET_BUKUTAMU);
      const tanggal = params.date || Utilities.formatDate(new Date(), "Asia/Makassar", "dd MMMM yyyy");
      const nama = params.name || "Musafir";
      const asalKota = params.originCity || "Musafir Singgah";
      const status = params.role || "Musafir";
      const pesan = params.message || "";
      const waktuKirim = new Date().toISOString();

      sheet.appendRow([tanggal, nama, asalKota, status, pesan, waktuKirim]);
      return createJsonResponse({ status: "success", message: "Pesan tersimpan ke Google Sheets!" });
    }

    return createJsonResponse({ status: "error", message: "Aksi tidak dikenal" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Membaca Data Kas
 */
function handleGetKas(ss) {
  const sheet = ss.getSheetByName(SHEET_KAS);
  const rows = sheet.getDataRange().getValues();
  const records = [];
  let totalMasuk = 0;
  let totalKeluar = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] && !row[1] && !row[3]) continue;

    const tanggal = row[0] instanceof Date ? Utilities.formatDate(row[0], "Asia/Makassar", "yyyy-MM-dd") : String(row[0] || "");
    const keterangan = String(row[1] || "");
    const jenisRaw = String(row[2] || "").toLowerCase();
    const type = (jenisRaw.includes("keluar") || jenisRaw.includes("out")) ? "out" : "in";
    const nominal = Number(row[3]) || 0;
    const kategori = String(row[4] || "Umum");

    if (type === "in") totalMasuk += nominal;
    else totalKeluar += nominal;

    records.push({ id: "gas-tx-" + i, date: tanggal, description: keterangan, type: type, amount: nominal, category: kategori });
  }

  records.reverse(); // Transaksi terbaru di atas
  return createJsonResponse({
    status: "success",
    saldoTerkini: totalMasuk - totalKeluar,
    totalPemasukan: totalMasuk,
    totalPengeluaran: totalKeluar,
    records: records,
    lastUpdated: Utilities.formatDate(new Date(), "Asia/Makassar", "HH:mm") + " WITA"
  });
}

/**
 * Membaca Data Buku Tamu
 */
function handleGetBukuTamu(ss) {
  const sheet = ss.getSheetByName(SHEET_BUKUTAMU);
  const rows = sheet.getDataRange().getValues();
  const entries = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1] && !row[4]) continue;

    const tanggal = row[0] instanceof Date ? Utilities.formatDate(row[0], "Asia/Makassar", "dd MMMM yyyy") : String(row[0] || "");
    entries.push({
      id: "gas-gb-" + i,
      date: tanggal,
      name: String(row[1] || "Musafir"),
      originCity: String(row[2] || "Musafir Singgah"),
      role: String(row[3] || "Musafir"),
      message: String(row[4] || "")
    });
  }

  entries.reverse(); // Komentar terbaru di atas
  return createJsonResponse({ status: "success", entries: entries });
}

/**
 * Membaca Jadwal Sholat Jum'at
 */
function handleGetJadwalJumat(ss) {
  const sheet = ss.getSheetByName(SHEET_JADWAL);
  const rows = sheet.getDataRange().getValues();

  let latest = {
    date: "Jum'at Pekan Ini",
    khatib: "Belum diisi pengurus",
    imam: "Belum diisi pengurus",
    muadzin: "Belum diisi pengurus",
    khutbahTopic: "Topik khutbah akan diperbarui oleh DKM",
    adzanTime: "12:08 WITA"
  };

  // Ambil baris data terakhir yang tidak kosong
  for (let i = rows.length - 1; i >= 1; i--) {
    const r = rows[i];
    if (r[0] || r[1] || r[2]) {
      latest = {
        date: String(r[0] || "Jum'at Pekan Ini"),
        khatib: String(r[1] || "Belum diisi"),
        imam: String(r[2] || "Belum diisi"),
        muadzin: String(r[3] || "Belum diisi"),
        khutbahTopic: String(r[4] || "Topik akan diperbarui"),
        adzanTime: String(r[5] || "12:08 WITA")
      };
      break;
    }
  }

  return createJsonResponse({ status: "success", schedule: latest });
}

/**
 * Membaca Pengaturan Rekening
 */
function handleGetPengaturan(ss) {
  const sheet = ss.getSheetByName(SHEET_PENGATURAN);
  const rows = sheet.getDataRange().getValues();
  const settings = {
    namaBank: "Bank BRI",
    nomorRekening: "",
    atasNama: "Masjid Al-Ikhlas",
    kontakWa: "082150745576",
    urlGambarQris: ""
  };

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][0] || "").trim().toLowerCase();
    const val = String(rows[i][1] || "").trim();

    if (key.includes("bank")) settings.namaBank = val || "Bank BRI";
    if (key.includes("rekening")) settings.nomorRekening = val;
    if (key.includes("nama") && !key.includes("bank")) settings.atasNama = val || "Masjid Al-Ikhlas";
    if (key.includes("kontak") || key.includes("wa")) settings.kontakWa = val;
    if (key.includes("qris") || key.includes("gambar")) settings.urlGambarQris = val;
  }

  return createJsonResponse({ status: "success", settings: settings });
}

/**
 * Mengambil Semua Data Sekaligus
 */
function handleGetAll(ss) {
  const kas = JSON.parse(handleGetKas(ss).getContent());
  const bukutamu = JSON.parse(handleGetBukuTamu(ss).getContent());
  const jadwal = JSON.parse(handleGetJadwalJumat(ss).getContent());
  const pengaturan = JSON.parse(handleGetPengaturan(ss).getContent());

  return createJsonResponse({
    status: "success",
    kas: kas,
    bukutamu: bukutamu,
    jadwalJumat: jadwal.schedule,
    pengaturan: pengaturan.settings
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
