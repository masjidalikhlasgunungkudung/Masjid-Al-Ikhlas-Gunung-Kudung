import { AgendaItem, ArticleItem, BankAccount, FacilityItem, FinancialRecord, GuestbookEntry, RestAreaHeaderInfo } from '../types/masjid';

export const MASJID_INFO = {
  name: 'Masjid Al-Ikhlas Gunung Kudung KM 145',
  shortName: 'Masjid Al-Ikhlas',
  tagline: 'Pusat Ibadah Umat & Rest Area Persinggahan Musafir 24 Jam',
  address: 'Gunung Kudung, Desa Tepian Langsat, Kec. Bengalon',
  routeInfo: 'Jl. Poros Muara Wahau KM 145, Jalur Trans-Kalimantan',
  regency: 'Kabupaten Kutai Timur, Kalimantan Timur',
  timezone: 'WITA (UTC+8)',
  latitude: 0.8755248,
  longitude: 117.1679831,
  qiblaBearing: '292.4° (Arah Barat Laut)',
  phone: '+62 821-5074-5576',
  secondaryPhone: '+62 853-8980-8592',
  email: 'masjid.alikhlas.gunungkudung@gmail.com',
  dkmCoordinator: 'DKM Masjid Al-Ikhlas',
  dkmPhone: '+62 821-5074-5576',
  googleMapsUrl: 'https://www.google.com/maps/place/Masjid+AL-IKHLAS+G.+Kudung+KM145/@0.8755248,117.1679831,17z',
  wazeUrl: 'https://waze.com/ul?ll=0.8755248,117.1679831&navigate=yes',
  googleDriveFolderUrl: 'https://drive.google.com/drive/folders/1iZVglGXqCJwlAezOAffFV1qiLLlHcmFi?usp=drive_link',
};

// Data Resmi TPQ AL-MUHAJIRIN sesuai plang resmi LPTKA-BKPRMI
export const TPQ_INFO = {
  name: 'Taman Pendidikan Al-Qur\'an (TPQ) Al-Muhajirin',
  institution: 'Lembaga Pembinaan dan Pengembangan TK Al-Qur\'an (LPTKA - BKPRMI)',
  branch: 'Kecamatan Bengalon, Kabupaten Kutai Timur',
  nslpq: '411264080597',
  address: 'Gunung Kudung Desa Tepian Langsat, Kec. Bengalon, Kab. Kutai Timur',
  scheduleDays: 'Senin sampai Sabtu',
  scheduleTime: '16:00 - 17:30 WITA',
  contacts: [
    { label: 'Pengurus TPQ 1', phone: '082150745576', formatted: '0821-5074-5576' },
    { label: 'Pengurus TPQ 2', phone: '085389808592', formatted: '0853-8980-8592' },
  ],
  curriculum: [
    { title: 'Pembelajaran Membaca Tilawati & Iqro', desc: 'Mulai dari pengenalan makharijul huruf, harakat, hingga membaca fasih sesuai kaidah tajwid.' },
    { title: 'Hafalan Surah Pendek (Juz \'Amma)', desc: 'Target hafalan surah pilihan (An-Naas s/d Ad-Dhuha dan seterusnya) dengan setoran harian.' },
    { title: 'Praktek Sholat & Wudhu Sesuai Sunnah', desc: 'Bimbingan gerakan, bacaan wajib dan sunnah sholat 5 waktu serta doa sesudah wudhu.' },
    { title: 'Doa-doa Harian & Hadits Pilihan', desc: 'Hafalan doa sebelum tidur, masuk masjid, makan, kedua orang tua, dan adab akhlakul karimah.' },
    { title: 'Pendidikan Karakter & Kisah Teladan', desc: 'Kisah 25 Nabi dan Rasul, sirah nabawiyah, serta pembiasaan adab sopan santun terhadap orang tua.' },
  ],
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bri',
    bankName: 'Bank BRI (Bank Rakyat Indonesia)',
    accountNumber: '',
    accountHolder: 'Masjid Al-Ikhlas',
    logoText: 'BRI',
    badgeColor: 'bg-blue-600 text-white',
  },
];

export const JUMAT_SCHEDULE = {
  date: "Jum'at Pekan Ini",
  khatib: 'Belum diisi pengurus',
  imam: 'Belum diisi pengurus',
  muadzin: 'Belum diisi pengurus',
  khutbahTopic: 'Topik khutbah akan diperbarui oleh DKM',
  adzanTime: '12:08 WITA',
};

export const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: '1',
    title: 'Kajian Rutin Fiqih & Yasinan Jamaah',
    category: 'Rutin',
    dayOrDate: 'Setiap Malam Jum\'at (Ba\'da Maghrib)',
    time: '18:30 - 19:45 WITA',
    speakerOrOfficer: 'Ust. Slamet',
    description: 'Pembacaan Surah Yasin, Tahlil bersama warga jemaah & musafir yang singgah, dilanjutkan pembahasan kajian adab dan ibadah harian.',
    location: 'Ruang Sholat Utama',
  },
  {
    id: '2',
    title: 'Pembelajaran TPQ Al-Muhajirin',
    category: 'Rutin',
    dayOrDate: 'Senin s/d Sabtu (6 Hari Belajar)',
    time: '16:00 - 17:30 WITA',
    speakerOrOfficer: 'Asatidz TPQ Al-Muhajirin (BKPRMI)',
    description: 'Pembinaan Al-Qur\'an anak-anak usia dini hingga remaja Desa Tepian Langsat & sekitarnya.',
    location: 'Gedung TPQ Sayap Kanan Masjid',
  },
  {
    id: '3',
    title: 'Sholat Jum\'at Berjamaah & Khutbah',
    category: 'Jumatan',
    dayOrDate: 'Setiap Hari Jum\'at',
    time: '11:45 - 13:00 WITA',
    speakerOrOfficer: 'Khatib & Imam Bergilir DKM',
    description: 'Pelaksanaan Sholat Jum\'at berjamaah untuk warga sekitar KM 145, pekerja perkebunan, dan musafir jalur trans-Kalimantan.',
    location: 'Ruang Sholat Utama & Selasar Terbuka',
  },
  {
    id: '4',
    title: 'Majelis Taklim Muslimah Gunung Kudung',
    category: 'Kajian Spesial',
    dayOrDate: 'Setiap Ahad Pagi',
    time: '08:30 - 10:30 WITA',
    speakerOrOfficer: 'Ustadzah & Pengurus Majelis Taklim Muslimah',
    description: 'Kajian tafsir tematik keluarga sakinah, fiqih wanita, serta pelatihan tajwid praktis.',
    location: 'Ruang Sholat Akhwat',
  },
  {
    id: '5',
    title: 'Kerja Bakti Kebersihan Lingkungan & Rest Area',
    category: 'Sosial',
    dayOrDate: 'Ahad Pertama Setiap Bulan',
    time: '07:00 - 09:30 WITA',
    speakerOrOfficer: 'Warga, Pemuda & Pengurus DKM Masjid Al-Ikhlas',
    description: 'Pembersihan toilet musafir, pengurasan tandon air, perawatan taman, serta sterilisasi karpet sholat.',
    location: 'Kawasan Masjid & Halaman Parkir KM 145',
  },
];

export const FACILITIES: FacilityItem[] = [
  {
    id: '1',
    iconName: 'Building2',
    title: 'Ruang Sholat Utama Bersih & Nyaman',
    description: 'Karpet lembut bergaris shaf lurus, ruangan lapang dengan kipas angin gantung & sirkulasi udara sejuk, terpisah ikhwan & akhwat.',
    availability: 'Buka 24 Jam',
  },
  {
    id: '2',
    iconName: 'BookOpen',
    title: 'Gedung TPQ Al-Muhajirin',
    description: 'Ruang kelas belajar Al-Qur\'an ber-SK resmi LPTKA-BKPRMI NSLPQ 411264080597 dengan bimbingan asatidz berpengalaman.',
    availability: 'Senin - Sabtu (16:00 WITA)',
  },
  {
    id: '3',
    iconName: 'Droplets',
    title: 'Tempat Wudhu Air Mengalir Melimpah',
    description: 'Pasokan air pegunungan jernih dengan bak tandon besar. Air wudhu segar untuk menyegarkan mata lelah pengemudi perjalanan jauh.',
    availability: '24 Jam Non-Stop',
  },
  {
    id: '4',
    iconName: 'Bath',
    title: 'Toilet & Kamar Mandi Musafir Bersih',
    description: 'Bilik kamar mandi terpisah khusus pria dan wanita, senantiasa dibersihkan secara rutin oleh petugas kebersihan masjid.',
    availability: '24 Jam Bersih',
  },
  {
    id: '5',
    iconName: 'Car',
    title: 'Area Parkir Luas Semua Jenis Kendaraan',
    description: 'Halaman paving block padat dan rata, muat sepeda motor, mobil pribadi, travel HiAce, bus pariwisata hingga truk ekspedisi.',
    availability: 'Terang & Aman',
  },
  {
    id: '6',
    iconName: 'Coffee',
    title: 'Pendopo Istirahat & Dispenser Air Minum',
    description: 'Selasar berlantai keramik bersih untuk meluruskan kaki dan rehat sejenak, disediakan air galon minum hangat dan dingin gratis.',
    availability: 'Gratis untuk Musafir',
  },
  {
    id: '7',
    iconName: 'Zap',
    title: 'Terminal Colokan Charger HP / Gadget',
    description: 'Tersedia stopkontak listrik aman di sudut selasar bagi musafir yang memerlukan pengisian daya smartphone sebelum lanjut jalan.',
    availability: 'Gratis 24 Jam',
  },
  {
    id: '8',
    iconName: 'ShieldCheck',
    title: 'Keamanan & Kenyamanan Lingkungan DKM',
    description: 'Lingkungan diawasi pengurus DKM Masjid Al-Ikhlas, aman dari tindak kejahatan malam hari, dengan lampu sorot penerangan terang.',
    availability: 'Pantauan 24 Jam',
  },
];

export const DEFAULT_REST_AREA_HEADER: RestAreaHeaderInfo = {
  sectionTitle: 'Layanan Rest Area & Fasilitas Musafir',
  tagline: 'Rest Area Trans-Kalimantan',
  badgeText: 'Akses 24 Jam Non-Stop',
  description: 'Perjalanan jauh di rute Samarinda - Sangatta - Muara Wahau - Berau membutuhkan tempat singgah yang aman. Masjid Al-Ikhlas siap melayani kebutuhan ibadah dan istirahat Anda sepanjang waktu.',
};

export const DEFAULT_FACILITIES: FacilityItem[] = FACILITIES;

export const FINANCIAL_RECORDS: FinancialRecord[] = [];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [];

export const ROUTE_DISTANCES = [
  { from: 'Sangatta (Ibukota Kutai Timur)', distance: '± 145 KM', eta: '3,5 Jam Perjalanan' },
  { from: 'Kecamatan Muara Wahau', distance: '± 30 KM', eta: '35 - 45 Menit' },
  { from: 'Kecamatan Bengalon', distance: '± 85 KM', eta: '2 Jam Perjalanan' },
  { from: 'Tanjung Redeb (Berau)', distance: '± 210 KM', eta: '5 - 6 Jam Perjalanan' },
  { from: 'Kota Samarinda', distance: '± 320 KM', eta: '8 - 9 Jam Perjalanan' },
];

export const MUSAFIR_PRAYER_GUIDE = [
  {
    title: 'Syarat Sah Sholat Jamak & Qashar Musafir',
    items: [
      'Jarak perjalanan minimal 2 marhalah (sekitar 81 - 85 KM). Perjalanan melewati KM 145 Poros Bengalon-Wahau sudah memenuhi syarat safar bagi perjalanan antarkota.',
      'Tujuan perjalanan adalah perkara mubah atau taat (silaturahmi, dinas kerja, berniaga halal, mudik), bukan untuk kemaksiatan.',
      'Niat jamak/qashar dilakukan di dalam hati saat takbiratul ihram sholat pertama.',
      'Sholat yang boleh di-qashar (diringkas dari 4 rakaat menjadi 2 rakaat): Dzuhur, Ashar, dan Isya. Sholat Subuh (2 rakaat) dan Maghrib (3 rakaat) tetap utuh.',
    ],
  },
  {
    title: 'Tata Cara Jamak Taqdim (Digabung di Waktu Pertama)',
    items: [
      'Contoh: Dzuhur & Ashar dikerjakan di waktu Dzuhur (atau Maghrib & Isya di waktu Maghrib).',
      'Mendahulukan sholat yang punya waktu: Sholat Dzuhur 2 rakaat salam, lalu langsung bangkit tanpa jeda panjang untuk sholat Ashar 2 rakaat.',
      'Muwalat (bersambung berurutan tanpa dipisah kegiatan lain).',
    ],
  },
  {
    title: 'Tata Cara Jamak Takhir (Digabung di Waktu Kedua)',
    items: [
      'Contoh: Dzuhur & Ashar dikerjakan di waktu Ashar (atau Maghrib & Isya dikerjakan di waktu Isya).',
      'Wajib berniat di dalam hati pada waktu pertama (sebelum habis waktu Dzuhur) bahwa sholat Dzuhur akan diakhirkan ke waktu Ashar.',
      'Boleh mendahulukan sholat yang pertama atau sholat yang kedua.',
    ],
  },
];

export const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'artikel-1',
    title: 'Peningkatan Fasilitas Rest Area Musafir 24 Jam di Jalur Poros KM 145',
    category: 'Info Musafir',
    author: 'Pengurus DKM Al-Ikhlas',
    date: '18 Oktober 2026',
    excerpt: 'Kenyamanan musafir rute Samarinda - Sangatta - Wahau - Berau ditingkatkan dengan bale santai berkarpet, fasilitas air wudhu mengalir bersih, dan titik pengisian daya ponsel gratis sepanjang waktu.',
    content: `Alhamdulillah, berkat dukungan doa dan infaq dari jemaah sekalian, DKM Masjid Al-Ikhlas Gunung Kudung terus mengoptimalkan fasilitas rest area bagi para musafir yang melintasi jalan poros Trans-Kalimantan KM 145.

Jalur Bengalon menuju Muara Wahau dan Berau dikenal dengan jarak tempuh yang panjang dan minim pemukiman padat. Oleh karena itu, kehadiran Masjid Al-Ikhlas di titik strategis KM 145 menjadi oase persinggahan yang sangat dibutuhkan para pengemudi dan keluarga yang bepergian.

Fasilitas yang senantiasa disiagakan 24 jam non-stop meliputi:
1. Ruang istirahat dan bale santai beralas karpet tebal yang sejuk dan bersih.
2. Toilet pria dan wanita terpisah dengan pasokan air bersih yang melimpah.
3. Tempat wudhu luas serta area parkir aman untuk roda empat maupun bus/truk ekspedisi.
4. Titik colokan listrik untuk pengisian daya ponsel tanpa dipungut biaya.
5. Tersedianya dispenser air minum hangat dan dingin bagi musafir yang ingin menyeduh kopi atau teh.

Kami mengundang seluruh musafir untuk tidak ragu singgah, beribadah sholat jamak-qashar, dan merebahkan lelah sebelum melanjutkan perjalanan dengan aman dan selamat sampai tujuan.`,
    layoutTemplate: 'banner_top',
    primaryImage: '/images/rest_area_musafir_1791948465509.jpg',
    additionalImages: [
      '/images/interior_sholat_utama_1791948463767.jpg',
      '/images/hero_masjid_kudung_1791948462974.jpg'
    ],
    isFeatured: true,
  },
  {
    id: 'artikel-2',
    title: 'Giat Pembinaan Al-Qur\'an Santri TPQ Al-Muhajirin: Membentuk Generasi Qur\'ani',
    category: 'Kegiatan TPQ',
    author: 'Ustadzah & Asatidz TPQ',
    date: '15 Oktober 2026',
    excerpt: 'Sebanyak 45 santri aktif antusias mengikuti pembelajaran tajwid metode Tilawati, setoran hafalan Juz \'Amma, dan bimbingan adab harian setiap sore dari Senin hingga Sabtu.',
    content: `Pendidikan Al-Qur'an sejak usia dini merupakan benteng moral terpenting bagi generasi masa depan. Di bawah naungan Lembaga Pembinaan dan Pengembangan TK Al-Qur'an (LPTKA - BKPRMI) Kecamatan Bengalon, TPQ Al-Muhajirin Gunung Kudung terus aktif membina santri-santri lokal.

Kegiatan belajar mengajar berlangsung setiap hari Senin sampai Sabtu pukul 16:00 hingga 17:30 WITA di ruang belajar sayap masjid.

Kurikulum pembelajaran meliputi:
- Bimbingan membaca Al-Qur'an mulai dari Iqro dan Tilawati bertahap sesuai tingkat kemampuan santri.
- Latihan makharijul huruf dan sifatul huruf agar santri dapat melafalkan ayat suci secara fasih.
- Hafalan surah-surah pendek dalam Juz 30 serta doa-doa harian praktis (doa makan, tidur, keluar rumah, dan doa kedua orang tua).
- Praktek wudhu dan gerakan sholat lima waktu sesuai sunnah Rasulullah SAW.

Terima kasih kepada seluruh wali santri dan para muhsinin yang senantiasa mendukung kelancaran operasional pendidikan santri di Gunung Kudung.`,
    layoutTemplate: 'photo_left',
    primaryImage: '/images/pengajian_kajian_masjid_1791948465248.jpg',
    additionalImages: [
      '/images/interior_sholat_utama_1791948463767.jpg'
    ],
    isFeatured: true,
  },
  {
    id: 'artikel-3',
    title: 'Keterbukaan Publik & Transparansi Keuangan Kas Masjid Berbasis Digital',
    category: 'Kabar Masjid',
    author: 'Bendahara DKM',
    date: '12 Oktober 2026',
    excerpt: 'Sebagai wujud amanah umat, seluruh transaksi infaq kotak amal, transfer Bank BRI, dan pembayaran digital QRIS dipublikasikan secara real-time dan transparan di website resmi.',
    content: `Amanah dalam memegang kas masjid adalah tanggung jawab besar di hadapan Allah SWT dan masyarakat jemaah. DKM Masjid Al-Ikhlas Gunung Kudung berkomitmen menerapkan tata kelola keuangan yang transparan, akuntabel, dan modern.

Kini masyarakat dapat memantau secara langsung:
1. Total saldo kas terkini secara otomatis yang terhubung ke pembukuan Google Sheets.
2. Rincian setiap dana masuk (Infaq Jumat, donasi musafir, transfer infaq operasional).
3. Rincian pengeluaran berkala untuk pembayaran token listrik, perawatan pompa air, insentif marbot kebersihan, dan pemeliharaan sarana ibadah.

Dengan transparansi ini, setiap rupiah yang diinfaqkan oleh para jemaah dan donatur dapat dipertanggungjawabkan dengan sejelas-jelasnya. Jazakumullahu khairan katsiran kepada seluruh donatur atas kepercayaannya.`,
    layoutTemplate: 'photo_right',
    primaryImage: '/images/interior_sholat_utama_1791948463767.jpg',
    additionalImages: [
      '/images/qris_masjid_official_1792025688952.jpg'
    ],
    isFeatured: false,
  },
  {
    id: 'artikel-4',
    title: 'Gotong Royong & Kerja Bakti Rutin Kebersihan Lingkungan Masjid Al-Ikhlas',
    category: 'Pembangunan & Kas',
    author: 'Seksi Pemeliharaan DKM',
    date: '08 Oktober 2026',
    excerpt: 'Pengurus bersama jemaah warga sekitar Gunung Kudung KM 145 rutin melaksanakan pembersihan karpet sholat, pengecekan lampu penerangan, dan penataan halaman parkir.',
    content: `Rasulullah SAW bersabda: "Kebersihan itu sebagian dari iman." Menjaga rumah Allah agar selalu wangi, bersih, dan asri adalah salah satu ibadah utama memakmurkan masjid.

Pada pekan ini, pengurus DKM bersama sukarelawan warga telah melaksanakan gotong royong terpadu:
- Pencucian dan penyedotan debu karpet ruang sholat utama seluas 200 m².
- Pembersihan toren penampungan air dan saringan air bersih kamar mandi musafir.
- Pengecekan lampu sorot halaman luar demi memastikan musafir yang tiba tengah malam merasa aman dan terang.
- Penataan area wudhu agar bebas licin serta pemangkasan rumput di pekarangan sekitar masjid.

Semoga keikhlasan para pengurus dan warga yang meluangkan tenaga menjadi ladang pahala jariyah yang mengalir tanpa putus. Aamiin ya Rabbal 'Alamin.`,
    layoutTemplate: 'gallery_grid',
    primaryImage: '/images/hero_masjid_kudung_1791948462974.jpg',
    additionalImages: [
      '/images/rest_area_musafir_1791948465509.jpg',
      '/images/interior_sholat_utama_1791948463767.jpg',
      '/images/pengajian_kajian_masjid_1791948465248.jpg'
    ],
    isFeatured: false,
  },
];
