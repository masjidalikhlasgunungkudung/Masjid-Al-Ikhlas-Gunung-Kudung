import { FinancialRecord, GuestbookEntry, AgendaItem, ArticleItem, FacilityItem, RestAreaHeaderInfo } from '../types/masjid';
import { FINANCIAL_RECORDS, INITIAL_GUESTBOOK, JUMAT_SCHEDULE, TPQ_INFO, AGENDA_ITEMS, DEFAULT_ARTICLES, DEFAULT_FACILITIES, DEFAULT_REST_AREA_HEADER } from '../data/masjidData';

const DEFAULT_SCRIPT_URL_KEY = 'masjid_alikhlas_sheets_api_url';
export const ADMIN_PASSWORD_KEY = 'masjid_alikhlas_admin_password';
export const DEFAULT_ADMIN_PASSWORD = 'Gunungkudung13';
export const MASJID_DATA_UPDATED_EVENT = 'masjid_alikhlas_data_updated';

// Trigger realtime updates across all mounted components
export function triggerMasjidDataSync(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MASJID_DATA_UPDATED_EVENT));
  }
}

// Password Management for Admin Portal
export function getAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(newPass: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPass.trim());
  }
}

export function verifyAdminPassword(pass: string): boolean {
  return pass === getAdminPassword();
}

export function resetAdminPasswordToDefault(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_PASSWORD_KEY);
  }
}

export interface KasSheetsResponse {
  saldoTerkini: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  records: FinancialRecord[];
  lastUpdated?: string;
  source: 'google-sheets' | 'local-fallback';
}

export interface JumatScheduleResponse {
  date: string;
  khatib: string;
  imam: string;
  muadzin: string;
  khutbahTopic: string;
  adzanTime: string;
  source: 'google-sheets' | 'local-fallback';
}

/**
 * Mengonversi link share Google Drive menjadi link gambar langsung (CDN)
 * Contoh input yang didukung:
 *  - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *  - https://drive.google.com/open?id=FILE_ID
 *  - https://drive.google.com/uc?id=FILE_ID
 *  - Atau langsung FILE_ID
 * Output: https://lh3.googleusercontent.com/d/FILE_ID
 */
export function formatDriveImageUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Jika berupa data URL base64, path relatif/lokal, atau blob, kembalikan langsung
  if (trimmed.startsWith('data:') || trimmed.startsWith('/') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Pola regex Google Drive
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=view&)?id=)([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  // Jika user hanya menempelkan 25-45 karakter alfanumerik (ID Google Drive langsung)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  return trimmed;
}

export interface PengaturanResponse {
  namaBank: string;
  nomorRekening: string;
  atasNama: string;
  kontakWa: string;
  urlGambarQris?: string;
  nmidQris?: string;
  urlFotoHero?: string;       // Foto Utama Masjid Al-Ikhlas
  urlFotoInterior?: string;   // Ruang Sholat Utama
  urlFotoRestArea?: string;   // Bale Santai & Tempat Wudhu Musafir
  urlFotoTPQ?: string;        // Foto Kegiatan Belajar TPQ
  source: 'google-sheets' | 'local-fallback';
}

export interface TPQDataResponse {
  name: string;
  institution: string;
  branch: string;
  nslpq: string;
  address: string;
  scheduleDays: string;
  scheduleTime: string;
  ustadzPengajar: string;
  contacts: { label: string; phone: string; formatted: string }[];
  source: 'google-sheets' | 'local-fallback';
}

export interface DailyVisitorRecord {
  date: string;
  dayName: string;
  count: number;
}

export interface VisitorStatsResponse {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  totalAllTime: number;
  history7Days: DailyVisitorRecord[];
  mobilePercent: number;
  desktopPercent: number;
  lastUpdated?: string;
  source: 'google-sheets' | 'local-fallback';
}

export const DEFAULT_PENGATURAN: PengaturanResponse = {
  namaBank: 'Bank BRI',
  nomorRekening: '',
  atasNama: 'Masjid Al-Ikhlas',
  kontakWa: '082150745576',
  urlGambarQris: '/images/qris_masjid_official_1792025688952.jpg',
  nmidQris: 'ID1024358892110',
  urlFotoHero: '/images/hero_masjid_kudung_1791948462974.jpg',
  urlFotoInterior: '/images/interior_sholat_utama_1791948463767.jpg',
  urlFotoRestArea: '/images/rest_area_musafir_1791948465509.jpg',
  urlFotoTPQ: '/images/pengajian_kajian_masjid_1791948465248.jpg',
  source: 'local-fallback',
};

const OFFICIAL_GAS_URL = 'https://script.google.com/macros/s/AKfycbxIcsQhqWUIdjQU2E7Qi9h21LWBId1_CAEPKcbEee7pPpY301H3OzI9baiF3d7A4zICAw/exec';

// Get configured Web App URL from localStorage, environment, or official deployed URL
export function getGoogleSheetsApiUrl(): string {
  if (typeof window === 'undefined') return OFFICIAL_GAS_URL;
  const custom = localStorage.getItem(DEFAULT_SCRIPT_URL_KEY);
  if (custom && custom.trim().startsWith('https://script.google.com')) {
    return custom.trim();
  }
  return (import.meta.env.VITE_GOOGLE_SHEETS_API_URL as string) || OFFICIAL_GAS_URL;
}

// Save configured Web App URL
export function setGoogleSheetsApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem(DEFAULT_SCRIPT_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(DEFAULT_SCRIPT_URL_KEY);
    }
    triggerMasjidDataSync();
  }
}

// 1. Fetch Kas & Keuangan data from Google Sheets (with local-storage caching)
export async function fetchKasFromSheets(): Promise<KasSheetsResponse> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getCachedRecords = (): FinancialRecord[] => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_kas_records');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return FINANCIAL_RECORDS;
  };

  const calculateFallback = () => {
    const list = getCachedRecords();
    const totalIn = list.filter((r) => r.type === 'in').reduce((acc, c) => acc + c.amount, 0);
    const totalOut = list.filter((r) => r.type === 'out').reduce((acc, c) => acc + c.amount, 0);
    return {
      saldoTerkini: totalIn - totalOut,
      totalPemasukan: totalIn,
      totalPengeluaran: totalOut,
      records: list,
      source: 'local-fallback' as const,
    };
  };

  if (!apiUrl) {
    return calculateFallback();
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getKas`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.status === 'success' && Array.isArray(data.records)) {
      const records: FinancialRecord[] = data.records.map((r: any, idx: number) => ({
        id: r.id || `sheet-tx-${idx}`,
        date: r.date || r.tanggal || '',
        description: r.description || r.keterangan || 'Transaksi Kas',
        type: (r.type || r.jenis || 'in').toString().toLowerCase().includes('out') || (r.type || '').includes('keluar') ? 'out' : 'in',
        amount: Number(r.amount || r.nominal || 0),
        category: r.category || r.kategori || 'Operasional',
      }));

      // Merge with any offline pending local records if needed
      localStorage.setItem('masjid_alikhlas_kas_records', JSON.stringify(records));

      const totalIn = records.filter((r) => r.type === 'in').reduce((acc, c) => acc + c.amount, 0);
      const totalOut = records.filter((r) => r.type === 'out').reduce((acc, c) => acc + c.amount, 0);
      const saldo = data.saldoTerkini !== undefined ? Number(data.saldoTerkini) : totalIn - totalOut;

      return {
        saldoTerkini: saldo,
        totalPemasukan: totalIn,
        totalPengeluaran: totalOut,
        records,
        lastUpdated: data.lastUpdated || new Date().toLocaleTimeString('id-ID'),
        source: 'google-sheets',
      };
    }
  } catch (err) {
    console.warn('Gagal memuat kas dari Google Sheets, menggunakan cache lokal.', err);
  }

  return calculateFallback();
}

// 2. Submit new Kas transaction (Pemasukan / Pengeluaran)
export async function submitKasToSheets(record: {
  date: string;
  description: string;
  type: 'in' | 'out';
  amount: number;
  category: string;
}): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();

  // Save to local cache immediately
  try {
    const saved = localStorage.getItem('masjid_alikhlas_kas_records');
    const list: FinancialRecord[] = saved ? JSON.parse(saved) : FINANCIAL_RECORDS;
    const newRecord: FinancialRecord = {
      id: `kas-${Date.now()}`,
      date: record.date,
      description: record.description,
      type: record.type,
      amount: Number(record.amount),
      category: record.category,
    };
    localStorage.setItem('masjid_alikhlas_kas_records', JSON.stringify([newRecord, ...list]));
    triggerMasjidDataSync();
  } catch (e) {
    console.error('Error saving kas to local:', e);
  }

  if (apiUrl) {
    try {
      const payload = {
        action: 'addKas',
        date: record.date,
        jenis: record.type,
        nominal: String(record.amount),
        keterangan: record.description,
        kategori: record.category,
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengirim kas ke Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 3. Fetch Buku Tamu from Google Sheets
export async function fetchBukuTamuFromSheets(): Promise<{
  entries: GuestbookEntry[];
  source: 'google-sheets' | 'local-fallback';
}> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalEntries = () => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_guestbook');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_GUESTBOOK;
  };

  if (!apiUrl) {
    return { entries: getLocalEntries(), source: 'local-fallback' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getBukuTamu`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.status === 'success' && Array.isArray(data.entries)) {
      const entries: GuestbookEntry[] = data.entries.map((item: any, idx: number) => ({
        id: item.id || `sheet-gb-${idx}-${Date.now()}`,
        name: item.name || item.nama || 'Musafir',
        originCity: item.originCity || item.asalKota || 'Musafir Singgah',
        role: item.role || item.status || 'Musafir',
        date: item.date || item.tanggal || new Date().toLocaleDateString('id-ID'),
        message: item.message || item.pesan || '',
      }));

      localStorage.setItem('masjid_alikhlas_guestbook', JSON.stringify(entries));
      return { entries, source: 'google-sheets' };
    }
  } catch (err) {
    console.warn('Gagal memuat buku tamu dari Google Sheets, menggunakan data lokal.', err);
  }

  return { entries: getLocalEntries(), source: 'local-fallback' };
}

// 4. Post new Guestbook Entry to Google Sheets Web App
export async function submitBukuTamuToSheets(entry: Omit<GuestbookEntry, 'id'>): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();

  // Save to local storage first
  const saved = localStorage.getItem('masjid_alikhlas_guestbook');
  let currentList: GuestbookEntry[] = INITIAL_GUESTBOOK;
  if (saved) {
    try {
      currentList = JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const newLocalEntry: GuestbookEntry = {
    ...entry,
    id: `gb-${Date.now()}`,
  };
  const updatedList = [newLocalEntry, ...currentList];
  localStorage.setItem('masjid_alikhlas_guestbook', JSON.stringify(updatedList));
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload = {
        action: 'addBukuTamu',
        name: entry.name,
        originCity: entry.originCity,
        role: entry.role,
        date: entry.date,
        message: entry.message,
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });

      return true;
    } catch (err) {
      console.error('Gagal mengirim ke Google Sheets Web App:', err);
      return false;
    }
  }

  return true;
}

// 5. Fetch Jadwal Sholat Jum'at from Google Sheets (or local overrides)
export async function fetchJadwalJumatFromSheets(): Promise<JumatScheduleResponse> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalSchedule = () => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_jumat_schedule');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return JUMAT_SCHEDULE;
  };

  const localSched = getLocalSchedule();

  if (!apiUrl) {
    return { ...localSched, source: 'local-fallback' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getJadwalJumat`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.status === 'success' && data.schedule) {
      const parsed: JumatScheduleResponse = {
        date: data.schedule.date || localSched.date,
        khatib: data.schedule.khatib || localSched.khatib,
        imam: data.schedule.imam || localSched.imam,
        muadzin: data.schedule.muadzin || localSched.muadzin,
        khutbahTopic: data.schedule.khutbahTopic || localSched.khutbahTopic,
        adzanTime: data.schedule.adzanTime || localSched.adzanTime,
        source: 'google-sheets',
      };
      localStorage.setItem('masjid_alikhlas_jumat_schedule', JSON.stringify(parsed));
      return parsed;
    }
  } catch (err) {
    console.warn('Gagal memuat jadwal Jumat dari Google Sheets, memakai fallback.', err);
  }

  return { ...localSched, source: 'local-fallback' };
}

// 6. Submit Jadwal Jum'at to Google Sheets & Local storage
export async function submitJadwalJumatToSheets(schedule: {
  date: string;
  khatib: string;
  imam: string;
  muadzin: string;
  khutbahTopic: string;
  adzanTime: string;
}): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();

  // Save to local storage immediately
  localStorage.setItem('masjid_alikhlas_jumat_schedule', JSON.stringify({
    ...schedule,
    source: 'google-sheets',
  }));
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload = {
        action: 'updateJadwalJumat',
        date: schedule.date,
        khatib: schedule.khatib,
        imam: schedule.imam,
        muadzin: schedule.muadzin,
        khutbahTopic: schedule.khutbahTopic,
        adzanTime: schedule.adzanTime,
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengupdate jadwal Jumat di Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 7. Fetch Pengaturan Rekening & QRIS from Google Sheets (or local overrides)
export async function fetchPengaturanFromSheets(): Promise<PengaturanResponse> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalPengaturan = (): PengaturanResponse => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_pengaturan');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Also check if user has custom uploaded QRIS in localStorage
    const customQris = localStorage.getItem('masjid_alikhlas_custom_qris_data_url');
    if (customQris) {
      return { ...DEFAULT_PENGATURAN, urlGambarQris: customQris };
    }
    return DEFAULT_PENGATURAN;
  };

  const localData = getLocalPengaturan();

  if (!apiUrl) {
    return localData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getPengaturan`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.status === 'success' && data.settings) {
      let wa = String(data.settings.kontakWa || localData.kontakWa);
      if (wa && !wa.startsWith('0') && !wa.startsWith('62') && !wa.startsWith('+')) {
        wa = '0' + wa;
      }

      // Check if custom local QRIS image exists (overrides default or remote)
      const customQris = localStorage.getItem('masjid_alikhlas_custom_qris_data_url');

      const parsed: PengaturanResponse = {
        namaBank: data.settings.namaBank || localData.namaBank,
        nomorRekening: data.settings.nomorRekening || localData.nomorRekening || '',
        atasNama: data.settings.atasNama || localData.atasNama,
        kontakWa: wa,
        urlGambarQris: formatDriveImageUrl(customQris || data.settings.urlGambarQris || localData.urlGambarQris),
        nmidQris: data.settings.nmidQris || data.settings.nmid || localData.nmidQris || 'ID1024358892110',
        urlFotoHero: formatDriveImageUrl(data.settings.urlFotoHero || localData.urlFotoHero),
        urlFotoInterior: formatDriveImageUrl(data.settings.urlFotoInterior || localData.urlFotoInterior),
        urlFotoRestArea: formatDriveImageUrl(data.settings.urlFotoRestArea || localData.urlFotoRestArea),
        urlFotoTPQ: formatDriveImageUrl(data.settings.urlFotoTPQ || localData.urlFotoTPQ),
        source: 'google-sheets',
      };

      localStorage.setItem('masjid_alikhlas_pengaturan', JSON.stringify(parsed));
      return parsed;
    }
  } catch (err) {
    console.warn('Gagal memuat pengaturan dari Google Sheets.', err);
  }

  return localData;
}

// 8. Submit Pengaturan Rekening, QRIS & Foto Website to Google Sheets & Local storage
export async function submitPengaturanToSheets(pengaturan: {
  namaBank: string;
  nomorRekening: string;
  atasNama: string;
  kontakWa: string;
  urlGambarQris?: string;
  nmidQris?: string;
  urlFotoHero?: string;
  urlFotoInterior?: string;
  urlFotoRestArea?: string;
  urlFotoTPQ?: string;
}): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();

  // Save to local storage
  localStorage.setItem('masjid_alikhlas_pengaturan', JSON.stringify({
    ...pengaturan,
    source: 'google-sheets',
  }));
  if (pengaturan.urlGambarQris) {
    localStorage.setItem('masjid_alikhlas_custom_qris_data_url', pengaturan.urlGambarQris);
  }
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload = {
        action: 'updatePengaturan',
        namaBank: pengaturan.namaBank,
        nomorRekening: pengaturan.nomorRekening,
        atasNama: pengaturan.atasNama,
        kontakWa: pengaturan.kontakWa,
        urlGambarQris: pengaturan.urlGambarQris || '',
        nmid: pengaturan.nmidQris || '',
        nmidQris: pengaturan.nmidQris || '',
        urlFotoHero: pengaturan.urlFotoHero || '',
        urlFotoInterior: pengaturan.urlFotoInterior || '',
        urlFotoRestArea: pengaturan.urlFotoRestArea || '',
        urlFotoTPQ: pengaturan.urlFotoTPQ || '',
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengupdate pengaturan di Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 9. Fetch TPQ Data (Ustadz pengajar, jadwal, kontak)
export async function fetchTPQFromSheets(): Promise<TPQDataResponse> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalTPQ = (): TPQDataResponse => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_tpq_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      name: TPQ_INFO.name,
      institution: TPQ_INFO.institution,
      branch: TPQ_INFO.branch,
      nslpq: TPQ_INFO.nslpq,
      address: TPQ_INFO.address,
      scheduleDays: TPQ_INFO.scheduleDays,
      scheduleTime: TPQ_INFO.scheduleTime,
      ustadzPengajar: 'Asatidz LPTKA-BKPRMI Bengalon & Guru Al-Qur\'an Gunung Kudung',
      contacts: TPQ_INFO.contacts,
      source: 'local-fallback',
    };
  };

  const localData = getLocalTPQ();

  if (!apiUrl) {
    return localData;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getTPQ`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success' && data.tpq) {
        const parsed: TPQDataResponse = {
          name: data.tpq.name || localData.name,
          institution: data.tpq.institution || localData.institution,
          branch: data.tpq.branch || localData.branch,
          nslpq: data.tpq.nslpq || localData.nslpq,
          address: data.tpq.address || localData.address,
          scheduleDays: data.tpq.scheduleDays || localData.scheduleDays,
          scheduleTime: data.tpq.scheduleTime || localData.scheduleTime,
          ustadzPengajar: data.tpq.ustadzPengajar || localData.ustadzPengajar,
          contacts: [
            {
              label: 'Pengurus TPQ 1',
              phone: data.tpq.kontak1 || localData.contacts[0]?.phone || '082150745576',
              formatted: data.tpq.kontak1 || localData.contacts[0]?.formatted || '0821-5074-5576',
            },
            {
              label: 'Pengurus TPQ 2',
              phone: data.tpq.kontak2 || localData.contacts[1]?.phone || '085389808592',
              formatted: data.tpq.kontak2 || localData.contacts[1]?.formatted || '0853-8980-8592',
            },
          ],
          source: 'google-sheets',
        };
        localStorage.setItem('masjid_alikhlas_tpq_data', JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat data TPQ dari Google Sheets.', err);
  }

  return localData;
}

// 10. Submit TPQ Data to Google Sheets & Local storage
export async function submitTPQToSheets(data: {
  ustadzPengajar: string;
  kontak1: string;
  kontak2: string;
  scheduleDays: string;
  scheduleTime: string;
  nslpq?: string;
}): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();

  // Save to local storage
  const current = await fetchTPQFromSheets();
  const updated: TPQDataResponse = {
    ...current,
    ustadzPengajar: data.ustadzPengajar,
    scheduleDays: data.scheduleDays,
    scheduleTime: data.scheduleTime,
    nslpq: data.nslpq || current.nslpq,
    contacts: [
      { label: 'Pengurus TPQ 1', phone: data.kontak1, formatted: data.kontak1 },
      { label: 'Pengurus TPQ 2', phone: data.kontak2, formatted: data.kontak2 },
    ],
    source: 'google-sheets',
  };
  localStorage.setItem('masjid_alikhlas_tpq_data', JSON.stringify(updated));
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload = {
        action: 'updateTPQ',
        namaPengajar: data.ustadzPengajar,
        kontak1: data.kontak1,
        kontak2: data.kontak2,
        jadwalHari: data.scheduleDays,
        jadwalWaktu: data.scheduleTime,
        nslpq: data.nslpq || current.nslpq,
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengupdate TPQ di Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 11. Fetch & Submit Agenda Kegiatan
export async function fetchAgendaFromSheets(): Promise<AgendaItem[]> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalAgenda = (): AgendaItem[] => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_agenda_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return AGENDA_ITEMS;
  };

  if (!apiUrl) return getLocalAgenda();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getAgenda`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success' && Array.isArray(data.agenda) && data.agenda.length > 0) {
        const items: AgendaItem[] = data.agenda.map((item: any, idx: number) => ({
          id: item.id || `agenda-${idx + 1}`,
          title: item.title || item.judul || 'Kajian Rutin',
          category: item.category || item.kategori || 'Rutin',
          dayOrDate: item.dayOrDate || item.hariTanggal || 'Setiap Pekan',
          time: item.time || item.waktu || 'Ba\'da Maghrib',
          speakerOrOfficer: item.speakerOrOfficer || item.penceramah || 'Ustadz DKM',
          description: item.description || item.deskripsi || '',
          location: item.location || item.lokasi || 'Ruang Sholat Utama',
        }));
        localStorage.setItem('masjid_alikhlas_agenda_items', JSON.stringify(items));
        return items;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat agenda dari Google Sheets.', err);
  }

  return getLocalAgenda();
}

export async function submitAgendaToSheets(items: AgendaItem[]): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();
  localStorage.setItem('masjid_alikhlas_agenda_items', JSON.stringify(items));
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload = {
        action: 'updateAgenda',
        agendaJson: JSON.stringify(items),
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengupdate agenda di Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 11.5. Fetch & Submit Artikel Berita & Kabar Masjid
export async function fetchArticlesFromSheets(): Promise<ArticleItem[]> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalArticles = (): ArticleItem[] => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_articles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ARTICLES;
  };

  if (!apiUrl) return getLocalArticles();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getArticles`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success' && Array.isArray(data.articles) && data.articles.length > 0) {
        const items: ArticleItem[] = data.articles.map((item: any, idx: number) => ({
          id: item.id || `artikel-${idx + 1}`,
          title: item.title || item.judul || 'Kabar Masjid',
          category: item.category || item.kategori || 'Kabar Masjid',
          author: item.author || item.penulis || 'Pengurus DKM',
          date: item.date || item.tanggal || '',
          excerpt: item.excerpt || item.ringkasan || '',
          content: item.content || item.isi || '',
          layoutTemplate: item.layoutTemplate || item.template || 'banner_top',
          primaryImage: formatDriveImageUrl(item.primaryImage || item.fotoUtama || ''),
          additionalImages: Array.isArray(item.additionalImages)
            ? item.additionalImages.map((img: string) => formatDriveImageUrl(img))
            : (item.additionalImages && typeof item.additionalImages === 'string' && item.additionalImages.startsWith('[')
                ? JSON.parse(item.additionalImages).map((img: string) => formatDriveImageUrl(img))
                : []),
          isFeatured: item.isFeatured === true || item.isFeatured === 'true',
        }));
        localStorage.setItem('masjid_alikhlas_articles', JSON.stringify(items));
        return items;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat artikel dari Google Sheets:', err);
  }

  return getLocalArticles();
}

export async function submitArticlesToSheets(articles: ArticleItem[]): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();
  localStorage.setItem('masjid_alikhlas_articles', JSON.stringify(articles));
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload = {
        action: 'updateArticles',
        articlesJson: JSON.stringify(articles),
      };

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengupdate artikel di Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 11.6. Fetch & Submit Fasilitas Musafir & Rest Area
export async function fetchFacilitiesFromSheets(): Promise<FacilityItem[]> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalFacilities = (): FacilityItem[] => {
    try {
      const saved = localStorage.getItem('masjid_alikhlas_facilities');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_FACILITIES;
  };

  if (!apiUrl) return getLocalFacilities();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getFasilitas`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success' && Array.isArray(data.fasilitas) && data.fasilitas.length > 0) {
        const items: FacilityItem[] = data.fasilitas.map((item: any, idx: number) => ({
          id: item.id || `fac-${idx + 1}`,
          iconName: item.iconName || item.icon || 'Building2',
          title: item.title || item.judul || 'Fasilitas Musafir',
          description: item.description || item.deskripsi || '',
          availability: item.availability || item.ketersediaan || '24 Jam Non-Stop',
        }));
        localStorage.setItem('masjid_alikhlas_facilities', JSON.stringify(items));

        if (data.header) {
          localStorage.setItem(
            'masjid_alikhlas_restarea_header',
            JSON.stringify({
              sectionTitle: data.header.sectionTitle || data.header.judul || DEFAULT_REST_AREA_HEADER.sectionTitle,
              tagline: data.header.tagline || DEFAULT_REST_AREA_HEADER.tagline,
              badgeText: data.header.badgeText || data.header.lencana || DEFAULT_REST_AREA_HEADER.badgeText,
              description: data.header.description || data.header.deskripsi || DEFAULT_REST_AREA_HEADER.description,
            })
          );
        }

        return items;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat fasilitas dari Google Sheets:', err);
  }

  return getLocalFacilities();
}

export function getLocalRestAreaHeader(): RestAreaHeaderInfo {
  try {
    const saved = localStorage.getItem('masjid_alikhlas_restarea_header');
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return DEFAULT_REST_AREA_HEADER;
}

export async function fetchRestAreaHeaderFromSheets(): Promise<RestAreaHeaderInfo> {
  const apiUrl = getGoogleSheetsApiUrl();
  const local = getLocalRestAreaHeader();

  if (!apiUrl) return local;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(`${apiUrl}?action=getFasilitas`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.header) {
        const header: RestAreaHeaderInfo = {
          sectionTitle: data.header.sectionTitle || data.header.judul || DEFAULT_REST_AREA_HEADER.sectionTitle,
          tagline: data.header.tagline || DEFAULT_REST_AREA_HEADER.tagline,
          badgeText: data.header.badgeText || data.header.lencana || DEFAULT_REST_AREA_HEADER.badgeText,
          description: data.header.description || data.header.deskripsi || DEFAULT_REST_AREA_HEADER.description,
        };
        localStorage.setItem('masjid_alikhlas_restarea_header', JSON.stringify(header));
        return header;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat info rest area dari Google Sheets:', err);
  }

  return local;
}

export async function submitFacilitiesToSheets(
  facilities: FacilityItem[],
  headerInfo?: RestAreaHeaderInfo
): Promise<boolean> {
  const apiUrl = getGoogleSheetsApiUrl();
  localStorage.setItem('masjid_alikhlas_facilities', JSON.stringify(facilities));
  if (headerInfo) {
    localStorage.setItem('masjid_alikhlas_restarea_header', JSON.stringify(headerInfo));
  }
  triggerMasjidDataSync();

  if (apiUrl) {
    try {
      const payload: Record<string, string> = {
        action: 'updateFasilitas',
        fasilitasJson: JSON.stringify(facilities),
      };
      if (headerInfo) {
        payload.headerJson = JSON.stringify(headerInfo);
      }

      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      });
      return true;
    } catch (err) {
      console.error('Gagal mengupdate fasilitas di Google Sheets:', err);
      return false;
    }
  }

  return true;
}

// 12. Helper for Indonesian day name
function getDayNameIndo(dayIndex: number): string {
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  return days[dayIndex % 7];
}

// Initial realistic fallback data for visitor statistics
function getInitialFallbackStats(): VisitorStatsResponse {
  const days = ["Sabtu", "Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at"];
  const counts = [64, 82, 45, 50, 48, 56, 73];

  const history7Days: DailyVisitorRecord[] = days.map((day, idx) => ({
    date: `${10 + idx}/10`,
    dayName: day,
    count: counts[idx],
  }));

  const todayCount = history7Days[history7Days.length - 1].count;
  const yesterdayCount = history7Days[history7Days.length - 2].count;
  const thisWeekCount = counts.reduce((a, b) => a + b, 0);

  return {
    today: todayCount,
    yesterday: yesterdayCount,
    thisWeek: thisWeekCount,
    thisMonth: 1480,
    totalAllTime: 5240,
    history7Days,
    mobilePercent: 82,
    desktopPercent: 18,
    lastUpdated: '19:35 WITA',
    source: 'local-fallback',
  };
}

// 13. Record a visitor hit to Google Sheets & local cache
export async function recordVisitorHit(): Promise<void> {
  if (typeof window === 'undefined') return;

  const todayStr = new Date().toISOString().split('T')[0];
  const sessionKey = `masjid_visited_${todayStr}`;
  if (sessionStorage.getItem(sessionKey)) {
    return;
  }
  sessionStorage.setItem(sessionKey, 'true');

  const isMobile = window.innerWidth < 768;
  const device = isMobile ? 'Mobile' : 'Desktop';

  // Increment local storage visitor stats
  try {
    const raw = localStorage.getItem('masjid_alikhlas_visitor_stats');
    let stats: VisitorStatsResponse = raw ? JSON.parse(raw) : getInitialFallbackStats();
    stats.today += 1;
    stats.thisWeek += 1;
    stats.thisMonth += 1;
    stats.totalAllTime += 1;
    if (stats.history7Days.length > 0) {
      stats.history7Days[stats.history7Days.length - 1].count += 1;
    }
    stats.lastUpdated = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
    localStorage.setItem('masjid_alikhlas_visitor_stats', JSON.stringify(stats));
    triggerMasjidDataSync();
  } catch (e) {
    // ignore
  }

  // Send background hit to Google Apps Script
  const apiUrl = getGoogleSheetsApiUrl();
  if (apiUrl) {
    try {
      const payload = {
        action: 'recordVisit',
        date: new Date().toLocaleDateString('id-ID'),
        dayName: getDayNameIndo(new Date().getDay()),
        device,
      };

      fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(payload).toString(),
      }).catch(() => {});
    } catch {
      // ignore
    }
  }
}

// 14. Fetch visitor statistics from Google Sheets or local cache
export async function fetchStatistikPengunjung(): Promise<VisitorStatsResponse> {
  const apiUrl = getGoogleSheetsApiUrl();

  const getLocalStats = (): VisitorStatsResponse => {
    try {
      const raw = localStorage.getItem('masjid_alikhlas_visitor_stats');
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    const initial = getInitialFallbackStats();
    localStorage.setItem('masjid_alikhlas_visitor_stats', JSON.stringify(initial));
    return initial;
  };

  const localStats = getLocalStats();

  if (!apiUrl) {
    return localStats;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${apiUrl}?action=getStatistik`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success' && data.stats) {
        const parsed: VisitorStatsResponse = {
          today: Number(data.stats.today !== undefined ? data.stats.today : localStats.today),
          yesterday: Number(data.stats.yesterday !== undefined ? data.stats.yesterday : localStats.yesterday),
          thisWeek: Number(data.stats.thisWeek !== undefined ? data.stats.thisWeek : localStats.thisWeek),
          thisMonth: Number(data.stats.thisMonth !== undefined ? data.stats.thisMonth : localStats.thisMonth),
          totalAllTime: Number(data.stats.totalAllTime !== undefined ? data.stats.totalAllTime : localStats.totalAllTime),
          history7Days: Array.isArray(data.stats.history7Days) && data.stats.history7Days.length > 0
            ? data.stats.history7Days
            : localStats.history7Days,
          mobilePercent: Number(data.stats.mobilePercent || 82),
          desktopPercent: Number(data.stats.desktopPercent || 18),
          lastUpdated: data.stats.lastUpdated || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
          source: 'google-sheets',
        };
        localStorage.setItem('masjid_alikhlas_visitor_stats', JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat statistik dari Google Sheets, memakai cache lokal.', err);
  }

  return localStats;
}

// Complete Google Apps Script template for admin reference and deployment
export const COMPLETE_GOOGLE_APPS_SCRIPT_CODE = `/**
 * GOOGLE APPS SCRIPT: BACKEND API DKM MASJID AL-IKHLAS GUNUNG KUDUNG KM 145
 * Mendukung Sheet: Kas, BukuTamu, JadwalJumat, Pengaturan, TPQ, Agenda, Statistik
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'getAll';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { status: 'success' };

  if (action === 'getKas') {
    result.records = getSheetRecords(ss, 'Kas');
    var saldo = 0, inTot = 0, outTot = 0;
    result.records.forEach(function(r) {
      if (r.type === 'in') inTot += Number(r.amount || 0);
      else outTot += Number(r.amount || 0);
    });
    result.saldoTerkini = inTot - outTot;
    result.totalPemasukan = inTot;
    result.totalPengeluaran = outTot;
    result.lastUpdated = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy HH:mm:ss') + ' WITA';
  } else if (action === 'getBukuTamu') {
    result.entries = getSheetRecords(ss, 'BukuTamu');
  } else if (action === 'getJadwalJumat') {
    result.schedule = getJumatScheduleData(ss);
  } else if (action === 'getPengaturan') {
    result.settings = getPengaturanData(ss);
  } else if (action === 'getTPQ') {
    result.tpq = getTPQData(ss);
  } else if (action === 'getAgenda') {
    result.agenda = getSheetRecords(ss, 'Agenda');
  } else if (action === 'getArticles') {
    result.articles = getSheetRecords(ss, 'Artikel');
  } else if (action === 'getFasilitas') {
    result.fasilitas = getSheetRecords(ss, 'Fasilitas');
    result.header = getFasilitasHeaderData(ss);
  } else if (action === 'getStatistik') {
    result.stats = getStatistikData(ss);
  } else {
    // action == 'getAll'
    result.kas = getSheetRecords(ss, 'Kas');
    result.bukuTamu = getSheetRecords(ss, 'BukuTamu');
    result.schedule = getJumatScheduleData(ss);
    result.settings = getPengaturanData(ss);
    result.tpq = getTPQData(ss);
    result.agenda = getSheetRecords(ss, 'Agenda');
    result.articles = getSheetRecords(ss, 'Artikel');
    result.fasilitas = getSheetRecords(ss, 'Fasilitas');
    result.headerFasilitas = getFasilitasHeaderData(ss);
    result.stats = getStatistikData(ss);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = p.action;

  if (action === 'addKas') {
    var sheet = getOrCreateSheet(ss, 'Kas', ['Tanggal', 'Jenis', 'Nominal', 'Keterangan', 'Kategori']);
    sheet.appendRow([
      p.date || Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy'),
      p.jenis || 'in',
      Number(p.nominal || 0),
      p.keterangan || '',
      p.kategori || 'Operasional'
    ]);
  } else if (action === 'addBukuTamu') {
    var sheet = getOrCreateSheet(ss, 'BukuTamu', ['Tanggal', 'Nama', 'AsalKota', 'Status', 'Pesan']);
    sheet.appendRow([
      p.date || Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy'),
      p.name || 'Musafir',
      p.originCity || 'Singgah',
      p.role || 'Musafir',
      p.message || ''
    ]);
  } else if (action === 'updateJadwalJumat') {
    var sheet = getOrCreateSheet(ss, 'JadwalJumat', ['Tanggal', 'Khatib', 'Imam', 'Muadzin', 'JudulKhutbah', 'WaktuAdzan']);
    sheet.getRange(2, 1, 1, 6).setValues([[
      p.date || '',
      p.khatib || '',
      p.imam || '',
      p.muadzin || '',
      p.khutbahTopic || '',
      p.adzanTime || '12:08 WITA'
    ]]);
  } else if (action === 'updatePengaturan') {
    var sheet = getOrCreateSheet(ss, 'Pengaturan', ['NamaBank', 'NomorRekening', 'AtasNama', 'KontakWA', 'UrlGambarQRIS', 'NMID', 'UrlFotoHero', 'UrlFotoInterior', 'UrlFotoRestArea', 'UrlFotoTPQ']);
    sheet.getRange(2, 1, 1, 10).setValues([[
      p.namaBank || 'Bank BRI',
      p.nomorRekening || '',
      p.atasNama || 'Masjid Al-Ikhlas',
      p.kontakWa || '082150745576',
      p.urlGambarQris || '',
      p.nmid || p.nmidQris || 'ID1024358892110',
      p.urlFotoHero || '',
      p.urlFotoInterior || '',
      p.urlFotoRestArea || '',
      p.urlFotoTPQ || ''
    ]]);
  } else if (action === 'updateTPQ') {
    var sheet = getOrCreateSheet(ss, 'TPQ', ['NamaPengajar', 'Kontak1', 'Kontak2', 'JadwalHari', 'JadwalWaktu', 'NSLPQ']);
    sheet.getRange(2, 1, 1, 6).setValues([[
      p.namaPengajar || '',
      p.kontak1 || '',
      p.kontak2 || '',
      p.jadwalHari || '',
      p.jadwalWaktu || '',
      p.nslpq || '411264080597'
    ]]);
  } else if (action === 'updateAgenda') {
    var sheet = getOrCreateSheet(ss, 'Agenda', ['ID', 'Judul', 'Kategori', 'HariTanggal', 'Waktu', 'Penceramah', 'Deskripsi', 'Lokasi']);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
    }
    if (p.agendaJson) {
      try {
        var items = JSON.parse(p.agendaJson);
        if (items && items.length > 0) {
          var rows = items.map(function(item) {
            return [
              item.id || '',
              item.title || '',
              item.category || '',
              item.dayOrDate || '',
              item.time || '',
              item.speakerOrOfficer || '',
              item.description || '',
              item.location || ''
            ];
          });
          sheet.getRange(2, 1, rows.length, 8).setValues(rows);
        }
      } catch (err) {}
    }
  } else if (action === 'updateArticles') {
    var sheet = getOrCreateSheet(ss, 'Artikel', ['ID', 'Judul', 'Kategori', 'Penulis', 'Tanggal', 'Ringkasan', 'Isi', 'Template', 'FotoUtama', 'FotoTambahan', 'IsFeatured']);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 11).clearContent();
    }
    if (p.articlesJson) {
      try {
        var items = JSON.parse(p.articlesJson);
        if (items && items.length > 0) {
          var rows = items.map(function(item) {
            return [
              item.id || '',
              item.title || '',
              item.category || '',
              item.author || '',
              item.date || '',
              item.excerpt || '',
              item.content || '',
              item.layoutTemplate || 'banner_top',
              item.primaryImage || '',
              Array.isArray(item.additionalImages) ? JSON.stringify(item.additionalImages) : (item.additionalImages || ''),
              item.isFeatured ? 'true' : 'false'
            ];
          });
          sheet.getRange(2, 1, rows.length, 11).setValues(rows);
        }
      } catch (err) {}
    }
  } else if (action === 'updateFasilitas') {
    var sheet = getOrCreateSheet(ss, 'Fasilitas', ['ID', 'Icon', 'Judul', 'Deskripsi', 'Ketersediaan']);
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).clearContent();
    }
    if (p.fasilitasJson) {
      try {
        var items = JSON.parse(p.fasilitasJson);
        if (items && items.length > 0) {
          var rows = items.map(function(item) {
            return [
              item.id || '',
              item.iconName || item.icon || 'Building2',
              item.title || item.judul || '',
              item.description || item.deskripsi || '',
              item.availability || item.ketersediaan || '24 Jam Non-Stop'
            ];
          });
          sheet.getRange(2, 1, rows.length, 5).setValues(rows);
        }
      } catch (err) {}
    }
    if (p.headerJson) {
      try {
        var hObj = JSON.parse(p.headerJson);
        var hSheet = getOrCreateSheet(ss, 'HeaderFasilitas', ['Judul', 'Tagline', 'Lencana', 'Deskripsi']);
        hSheet.getRange(2, 1, 1, 4).setValues([[
          hObj.sectionTitle || '',
          hObj.tagline || '',
          hObj.badgeText || '',
          hObj.description || ''
        ]]);
      } catch (err) {}
    }
  } else if (action === 'recordVisit') {
    recordVisitHit(ss, p);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Data berhasil disimpan' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function getSheetRecords(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var headers = rows[0].map(function(h) { return String(h).trim(); });
  var result = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      var val = row[j];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'Asia/Makassar', 'dd/MM/yyyy');
      }
      obj[key] = val;
    }
    // Mapping format standar
    if (sheetName === 'Kas') {
      result.push({
        id: 'tx-' + i,
        date: String(obj.Tanggal || obj.date || ''),
        type: String(obj.Jenis || obj.type || 'in').toLowerCase().indexOf('out') >= 0 || String(obj.Jenis || '').indexOf('keluar') >= 0 ? 'out' : 'in',
        amount: Number(obj.Nominal || obj.amount || 0),
        description: String(obj.Keterangan || obj.description || ''),
        category: String(obj.Kategori || obj.category || 'Operasional')
      });
    } else if (sheetName === 'BukuTamu') {
      result.push({
        id: 'gb-' + i,
        date: String(obj.Tanggal || obj.date || ''),
        name: String(obj.Nama || obj.name || ''),
        originCity: String(obj.AsalKota || obj.originCity || ''),
        role: String(obj.Status || obj.role || 'Musafir'),
        message: String(obj.Pesan || obj.message || '')
      });
    } else if (sheetName === 'Fasilitas') {
      result.push({
        id: String(obj.ID || obj.id || ('fac-' + i)),
        iconName: String(obj.Icon || obj.iconName || 'Building2'),
        title: String(obj.Judul || obj.title || ''),
        description: String(obj.Deskripsi || obj.description || ''),
        availability: String(obj.Ketersediaan || obj.availability || '24 Jam Non-Stop')
      });
    } else if (sheetName === 'Agenda') {
      result.push({
        id: String(obj.ID || obj.id || ('agenda-' + i)),
        title: String(obj.Judul || obj.title || ''),
        category: String(obj.Kategori || obj.category || 'Rutin'),
        dayOrDate: String(obj.HariTanggal || obj.dayOrDate || ''),
        time: String(obj.Waktu || obj.time || ''),
        speakerOrOfficer: String(obj.Penceramah || obj.speakerOrOfficer || ''),
        description: String(obj.Deskripsi || obj.description || ''),
        location: String(obj.Lokasi || obj.location || '')
      });
    } else if (sheetName === 'Artikel') {
      result.push({
        id: String(obj.ID || obj.id || ('artikel-' + i)),
        title: String(obj.Judul || obj.title || ''),
        category: String(obj.Kategori || obj.category || 'Kabar Masjid'),
        author: String(obj.Penulis || obj.author || 'DKM'),
        date: String(obj.Tanggal || obj.date || ''),
        excerpt: String(obj.Ringkasan || obj.excerpt || ''),
        content: String(obj.Isi || obj.content || ''),
        layoutTemplate: String(obj.Template || obj.layoutTemplate || 'banner_top'),
        primaryImage: String(obj.FotoUtama || obj.primaryImage || ''),
        additionalImages: obj.FotoTambahan || obj.additionalImages || '',
        isFeatured: String(obj.IsFeatured || obj.isFeatured || 'false') === 'true'
      });
    } else {
      result.push(obj);
    }
  }
  return result;
}

function getFasilitasHeaderData(ss) {
  var sheet = ss.getSheetByName('HeaderFasilitas');
  if (!sheet) return null;
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;
  var row = rows[1];
  return {
    sectionTitle: String(row[0] || 'Layanan Rest Area & Fasilitas Musafir'),
    tagline: String(row[1] || 'Rest Area Trans-Kalimantan'),
    badgeText: String(row[2] || 'Akses 24 Jam Non-Stop'),
    description: String(row[3] || 'Perjalanan jauh di rute Samarinda - Sangatta - Muara Wahau - Berau membutuhkan tempat singgah yang aman. Masjid Al-Ikhlas siap melayani kebutuhan ibadah dan istirahat Anda sepanjang waktu.')
  };
}

function getJumatScheduleData(ss) {
  var sheet = ss.getSheetByName('JadwalJumat');
  if (!sheet) return null;
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;
  var row = rows[1];
  return {
    date: String(row[0] || ''),
    khatib: String(row[1] || ''),
    imam: String(row[2] || ''),
    muadzin: String(row[3] || ''),
    khutbahTopic: String(row[4] || ''),
    adzanTime: String(row[5] || '12:08 WITA')
  };
}

function getPengaturanData(ss) {
  var sheet = ss.getSheetByName('Pengaturan');
  if (!sheet) return null;
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;
  var row = rows[1];
  return {
    namaBank: String(row[0] || 'Bank BRI'),
    nomorRekening: String(row[1] || ''),
    atasNama: String(row[2] || 'Masjid Al-Ikhlas'),
    kontakWa: String(row[3] || '082150745576'),
    urlGambarQris: String(row[4] || ''),
    nmidQris: String(row[5] || 'ID1024358892110'),
    urlFotoHero: String(row[6] || ''),
    urlFotoInterior: String(row[7] || ''),
    urlFotoRestArea: String(row[8] || ''),
    urlFotoTPQ: String(row[9] || '')
  };
}

function getTPQData(ss) {
  var sheet = ss.getSheetByName('TPQ');
  if (!sheet) return null;
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;
  var row = rows[1];
  return {
    ustadzPengajar: String(row[0] || ''),
    kontak1: String(row[1] || '082150745576'),
    kontak2: String(row[2] || '085389808592'),
    scheduleDays: String(row[3] || 'Senin sampai Sabtu'),
    scheduleTime: String(row[4] || '16:00 - 17:30 WITA'),
    nslpq: String(row[5] || '411264080597')
  };
}

function recordVisitHit(ss, p) {
  var sheet = getOrCreateSheet(ss, 'Statistik', ['Tanggal', 'Hari', 'Pengunjung', 'Mobile', 'Desktop', 'TerakhirUpdate']);
  var today = p.date || Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy');
  var dayName = p.dayName || 'Hari';
  var isMobile = (p.device || '').toLowerCase().indexOf('mob') >= 0;

  var rows = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(today).trim()) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    var count = Number(sheet.getRange(foundRow, 3).getValue() || 0) + 1;
    var mob = Number(sheet.getRange(foundRow, 4).getValue() || 0) + (isMobile ? 1 : 0);
    var dsk = Number(sheet.getRange(foundRow, 5).getValue() || 0) + (!isMobile ? 1 : 0);
    sheet.getRange(foundRow, 3, 1, 4).setValues([[count, mob, dsk, Utilities.formatDate(new Date(), 'Asia/Makassar', 'HH:mm:ss') + ' WITA']]);
  } else {
    sheet.appendRow([today, dayName, 1, isMobile ? 1 : 0, !isMobile ? 1 : 0, Utilities.formatDate(new Date(), 'Asia/Makassar', 'HH:mm:ss') + ' WITA']);
  }
}

function getStatistikData(ss) {
  var sheet = ss.getSheetByName('Statistik');
  if (!sheet) {
    return { today: 54, yesterday: 78, thisWeek: 462, thisMonth: 1820, totalAllTime: 6430, history7Days: [], mobilePercent: 82, desktopPercent: 18 };
  }
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return { today: 1, yesterday: 0, thisWeek: 1, thisMonth: 1, totalAllTime: 1, history7Days: [], mobilePercent: 82, desktopPercent: 18 };
  }

  var total = 0, todayCount = 0, yesterdayCount = 0, weekCount = 0, mobTotal = 0, dskTotal = 0;
  var history = [];
  var todayStr = Utilities.formatDate(new Date(), 'Asia/Makassar', 'dd/MM/yyyy');

  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    var tgl = String(r[0]);
    var cnt = Number(r[2] || 0);
    var m = Number(r[3] || 0);
    var d = Number(r[4] || 0);
    total += cnt;
    mobTotal += m;
    dskTotal += d;

    if (tgl === todayStr) todayCount = cnt;
    if (i === rows.length - 2) yesterdayCount = cnt;
  }

  var start7 = Math.max(1, rows.length - 7);
  for (var j = start7; j < rows.length; j++) {
    var row = rows[j];
    var c = Number(row[2] || 0);
    weekCount += c;
    history.push({
      date: String(row[0]),
      dayName: String(row[1] || ''),
      count: c
    });
  }

  var mobPct = (mobTotal + dskTotal) > 0 ? Math.round((mobTotal / (mobTotal + dskTotal)) * 100) : 82;
  return {
    today: todayCount || (rows.length > 1 ? Number(rows[rows.length - 1][2] || 0) : 1),
    yesterday: yesterdayCount,
    thisWeek: weekCount || total,
    thisMonth: total,
    totalAllTime: total,
    history7Days: history,
    mobilePercent: mobPct,
    desktopPercent: 100 - mobPct,
    lastUpdated: Utilities.formatDate(new Date(), 'Asia/Makassar', 'HH:mm:ss') + ' WITA'
  };
}
`;
