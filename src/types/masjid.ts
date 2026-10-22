export interface PrayerTimes {
  imsak: string;
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  remainingText: string;
  secondsRemaining: number;
}

export interface AgendaItem {
  id: string;
  title: string;
  category: 'Rutin' | 'Jumatan' | 'Kajian Spesial' | 'Sosial';
  dayOrDate: string;
  time: string;
  speakerOrOfficer?: string;
  description: string;
  location: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoText: string;
  badgeColor: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  type: 'in' | 'out';
  amount: number;
  category: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  originCity: string;
  role: 'Musafir' | 'Jemaah Warga' | 'Sopir Ekspedisi' | 'Keluarga Traveling';
  date: string;
  message: string;
}

export interface FacilityItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  availability: string;
}

export interface RestAreaHeaderInfo {
  sectionTitle: string;
  tagline: string;
  badgeText: string;
  description: string;
}

export type ArticleLayoutTemplate =
  | 'banner_top'    // Foto Utama Lebar di Atas
  | 'photo_left'     // Foto di Kiri, Teks di Kanan (Editorial)
  | 'photo_right'    // Teks di Kiri, Foto di Kanan
  | 'gallery_grid';  // Galeri Foto Bersanding dengan Narasi

export interface ArticleItem {
  id: string;
  title: string;
  category: 'Kabar Masjid' | 'Kajian & Fiqih' | 'Kegiatan TPQ' | 'Info Musafir' | 'Pembangunan & Kas';
  author: string;
  date: string;
  excerpt: string;
  content: string;
  layoutTemplate: ArticleLayoutTemplate;
  primaryImage: string;
  additionalImages?: string[];
  isFeatured?: boolean;
}
