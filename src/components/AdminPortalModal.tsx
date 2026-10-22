import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  FileSpreadsheet,
  Upload,
  Check,
  RefreshCw,
  Calendar,
  Wallet,
  BookOpen,
  Phone,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  PlusCircle,
  ExternalLink,
  Copy,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  Newspaper,
  Coffee,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Edit2,
  Building2,
  Droplets,
  Bath,
  Car,
  Zap,
  Wifi,
  Phone as PhoneIcon,
  Clock,
  HeartHandshake,
  Utensils,
  Compass,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  getAdminPassword,
  setAdminPassword,
  verifyAdminPassword,
  resetAdminPasswordToDefault,
  DEFAULT_ADMIN_PASSWORD,
  getGoogleSheetsApiUrl,
  setGoogleSheetsApiUrl,
  fetchKasFromSheets,
  submitKasToSheets,
  fetchPengaturanFromSheets,
  submitPengaturanToSheets,
  formatDriveImageUrl,
  fetchJadwalJumatFromSheets,
  submitJadwalJumatToSheets,
  fetchTPQFromSheets,
  submitTPQToSheets,
  fetchAgendaFromSheets,
  submitAgendaToSheets,
  fetchArticlesFromSheets,
  submitArticlesToSheets,
  fetchFacilitiesFromSheets,
  submitFacilitiesToSheets,
  fetchRestAreaHeaderFromSheets,
  COMPLETE_GOOGLE_APPS_SCRIPT_CODE,
  triggerMasjidDataSync,
  KasSheetsResponse,
  PengaturanResponse,
  JumatScheduleResponse,
  TPQDataResponse,
  fetchStatistikPengunjung,
  VisitorStatsResponse,
} from '../services/googleSheetsService';
import { AgendaItem, ArticleItem, ArticleLayoutTemplate, FacilityItem, RestAreaHeaderInfo } from '../types/masjid';
import { DEFAULT_FACILITIES, DEFAULT_REST_AREA_HEADER } from '../data/masjidData';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

type TabType = 'rekening_qris' | 'foto_drive' | 'artikel' | 'fasilitas' | 'kas' | 'jumat' | 'tpq' | 'agenda' | 'statistik' | 'sheets' | 'password';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose, onNotify }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('rekening_qris');

  // Loading states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTestingSheet, setIsTestingSheet] = useState<boolean>(false);
  const [sheetTestResult, setSheetTestResult] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Form states: Rekening & QRIS
  const [namaBank, setNamaBank] = useState<string>('Bank BRI');
  const [nomorRekening, setNomorRekening] = useState<string>('');
  const [atasNama, setAtasNama] = useState<string>('Masjid Al-Ikhlas');
  const [kontakWa, setKontakWa] = useState<string>('082150745576');
  const [qrisPreview, setQrisPreview] = useState<string>('');
  const [nmidQris, setNmidQris] = useState<string>('ID1024358892110');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states: Foto Website & Google Drive
  const [heroPhoto, setHeroPhoto] = useState<string>('');
  const [interiorPhoto, setInteriorPhoto] = useState<string>('');
  const [restAreaPhoto, setRestAreaPhoto] = useState<string>('');
  const [tpqPhoto, setTpqPhoto] = useState<string>('');
  const heroFileRef = useRef<HTMLInputElement>(null);
  const interiorFileRef = useRef<HTMLInputElement>(null);
  const restAreaFileRef = useRef<HTMLInputElement>(null);
  const tpqFileRef = useRef<HTMLInputElement>(null);

  // Visitor Stats state
  const [visitorStats, setVisitorStats] = useState<VisitorStatsResponse | null>(null);

  // Form states: Kas Transaksi
  const [kasSummary, setKasSummary] = useState<KasSheetsResponse | null>(null);
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [txType, setTxType] = useState<'in' | 'out'>('in');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txDesc, setTxDesc] = useState<string>('');
  const [txCategory, setTxCategory] = useState<string>('Kotak Amal');

  // Form states: Jadwal Jumat
  const [jumatDate, setJumatDate] = useState<string>('');
  const [khatib, setKhatib] = useState<string>('');
  const [imam, setImam] = useState<string>('');
  const [muadzin, setMuadzin] = useState<string>('');
  const [khutbahTopic, setKhutbahTopic] = useState<string>('');
  const [adzanTime, setAdzanTime] = useState<string>('12:08 WITA');

  // Form states: TPQ & Ustadz
  const [ustadzPengajar, setUstadzPengajar] = useState<string>('');
  const [tpqKontak1, setTpqKontak1] = useState<string>('');
  const [tpqKontak2, setTpqKontak2] = useState<string>('');
  const [tpqDays, setTpqDays] = useState<string>('Senin sampai Sabtu');
  const [tpqTime, setTpqTime] = useState<string>('16:00 - 17:30 WITA');
  const [tpqNslpq, setTpqNslpq] = useState<string>('411264080597');

  // Form states: Agenda
  const [agendaList, setAgendaList] = useState<AgendaItem[]>([]);
  const [newAgendaTitle, setNewAgendaTitle] = useState<string>('');
  const [newAgendaDay, setNewAgendaDay] = useState<string>('');
  const [newAgendaTime, setNewAgendaTime] = useState<string>('');
  const [newAgendaSpeaker, setNewAgendaSpeaker] = useState<string>('');
  const [newAgendaDesc, setNewAgendaDesc] = useState<string>('');

  // Form states: Artikel & Publikasi Kabar Masjid
  const [articlesList, setArticlesList] = useState<ArticleItem[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState<string>('');
  const [artCategory, setArtCategory] = useState<ArticleItem['category']>('Kabar Masjid');
  const [artAuthor, setArtAuthor] = useState<string>('Pengurus DKM Al-Ikhlas');
  const [artDate, setArtDate] = useState<string>('');
  const [artExcerpt, setArtExcerpt] = useState<string>('');
  const [artContent, setArtContent] = useState<string>('');
  const [artTemplate, setArtTemplate] = useState<ArticleLayoutTemplate>('banner_top');
  const [artPrimaryImage, setArtPrimaryImage] = useState<string>('');
  const [artAdditionalImages, setArtAdditionalImages] = useState<string>('');
  const [artIsFeatured, setArtIsFeatured] = useState<boolean>(false);
  const articlePrimaryFileRef = useRef<HTMLInputElement>(null);

  // Form states: Fasilitas Musafir & Rest Area
  const [facilitiesList, setFacilitiesList] = useState<FacilityItem[]>(DEFAULT_FACILITIES);
  const [restHeaderTitle, setRestHeaderTitle] = useState<string>(DEFAULT_REST_AREA_HEADER.sectionTitle);
  const [restHeaderTagline, setRestHeaderTagline] = useState<string>(DEFAULT_REST_AREA_HEADER.tagline);
  const [restHeaderBadge, setRestHeaderBadge] = useState<string>(DEFAULT_REST_AREA_HEADER.badgeText);
  const [restHeaderDescription, setRestHeaderDescription] = useState<string>(DEFAULT_REST_AREA_HEADER.description);

  // Form states: Tambah / Edit Satu Fasilitas
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [facTitle, setFacTitle] = useState<string>('');
  const [facIcon, setFacIcon] = useState<string>('Building2');
  const [facAvailability, setFacAvailability] = useState<string>('24 Jam Non-Stop');
  const [facDescription, setFacDescription] = useState<string>('');

  // Form states: Google Sheets URL
  const [sheetsUrl, setSheetsUrl] = useState<string>(getGoogleSheetsApiUrl());

  // Form states: Ganti Password
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passMessage, setPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Load existing data when modal opens or authenticated
  const loadPortalData = async () => {
    try {
      // 1. Pengaturan Rekening & QRIS
      const p = await fetchPengaturanFromSheets();
      setNamaBank(p.namaBank || 'Bank BRI');
      setNomorRekening(p.nomorRekening || '');
      setAtasNama(p.atasNama || 'Masjid Al-Ikhlas');
      setKontakWa(p.kontakWa || '082150745576');
      setQrisPreview(p.urlGambarQris || '');
      setNmidQris(p.nmidQris || 'ID1024358892110');
      setHeroPhoto(p.urlFotoHero || '');
      setInteriorPhoto(p.urlFotoInterior || '');
      setRestAreaPhoto(p.urlFotoRestArea || '');
      setTpqPhoto(p.urlFotoTPQ || '');

      // 2. Kas
      const k = await fetchKasFromSheets();
      setKasSummary(k);

      // 3. Jadwal Jumat
      const j = await fetchJadwalJumatFromSheets();
      setJumatDate(j.date || '');
      setKhatib(j.khatib === 'Belum diisi pengurus' ? '' : j.khatib);
      setImam(j.imam === 'Belum diisi pengurus' ? '' : j.imam);
      setMuadzin(j.muadzin === 'Belum diisi pengurus' ? '' : j.muadzin);
      setKhutbahTopic(j.khutbahTopic || '');
      setAdzanTime(j.adzanTime || '12:08 WITA');

      // 4. TPQ
      const t = await fetchTPQFromSheets();
      setUstadzPengajar(t.ustadzPengajar || '');
      setTpqKontak1(t.contacts[0]?.phone || '082150745576');
      setTpqKontak2(t.contacts[1]?.phone || '085389808592');
      setTpqDays(t.scheduleDays || 'Senin sampai Sabtu');
      setTpqTime(t.scheduleTime || '16:00 - 17:30 WITA');
      setTpqNslpq(t.nslpq || '411264080597');

      // 5. Agenda
      const ag = await fetchAgendaFromSheets();
      setAgendaList(ag);

      // 5.5 Artikel
      const arts = await fetchArticlesFromSheets();
      setArticlesList(arts);

      // 5.6 Fasilitas & Rest Area
      const [facs, restH] = await Promise.all([
        fetchFacilitiesFromSheets(),
        fetchRestAreaHeaderFromSheets(),
      ]);
      if (facs && facs.length > 0) {
        setFacilitiesList(facs);
      }
      if (restH) {
        setRestHeaderTitle(restH.sectionTitle || DEFAULT_REST_AREA_HEADER.sectionTitle);
        setRestHeaderTagline(restH.tagline || DEFAULT_REST_AREA_HEADER.tagline);
        setRestHeaderBadge(restH.badgeText || DEFAULT_REST_AREA_HEADER.badgeText);
        setRestHeaderDescription(restH.description || DEFAULT_REST_AREA_HEADER.description);
      }

      // 6. Sheets URL & Statistik
      setSheetsUrl(getGoogleSheetsApiUrl());
      const st = await fetchStatistikPengunjung();
      setVisitorStats(st);
    } catch (e) {
      console.warn('Gagal memuat sebagian data portal:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPortalData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(inputPassword)) {
      setIsAuthenticated(true);
      setAuthError(null);
      setInputPassword('');
      loadPortalData();
      onNotify('Berhasil masuk ke Portal Admin DKM Masjid Al-Ikhlas!');
    } else {
      setAuthError('Password salah. Silakan masukkan password admin yang sesuai.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPassword('');
    setAuthError(null);
    onClose();
    onNotify('Anda telah keluar dari Portal Admin.');
  };

  // 1. Simpan Rekening & QRIS
  const handleSaveRekeningQris = async () => {
    setIsSaving(true);
    try {
      await submitPengaturanToSheets({
        namaBank: namaBank.trim() || 'Bank BRI',
        nomorRekening: nomorRekening.trim(),
        atasNama: atasNama.trim() || 'Masjid Al-Ikhlas',
        kontakWa: kontakWa.trim() || '082150745576',
        urlGambarQris: qrisPreview,
        nmidQris: nmidQris.trim() || 'ID1024358892110',
        urlFotoHero: heroPhoto.trim(),
        urlFotoInterior: interiorPhoto.trim(),
        urlFotoRestArea: restAreaPhoto.trim(),
        urlFotoTPQ: tpqPhoto.trim(),
      });
      triggerMasjidDataSync();
      onNotify('Rekening BRI, Foto QRIS & NMID berhasil disimpan dan disinkronkan ke website!');
    } catch {
      onNotify('Terjadi kendala saat menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Simpan Foto Website & Google Drive
  const handleSaveFotoDrive = async () => {
    setIsSaving(true);
    try {
      await submitPengaturanToSheets({
        namaBank: namaBank.trim() || 'Bank BRI',
        nomorRekening: nomorRekening.trim(),
        atasNama: atasNama.trim() || 'Masjid Al-Ikhlas',
        kontakWa: kontakWa.trim() || '082150745576',
        urlGambarQris: qrisPreview,
        nmidQris: nmidQris.trim() || 'ID1024358892110',
        urlFotoHero: heroPhoto.trim(),
        urlFotoInterior: interiorPhoto.trim(),
        urlFotoRestArea: restAreaPhoto.trim(),
        urlFotoTPQ: tpqPhoto.trim(),
      });
      triggerMasjidDataSync();
      onNotify('Seluruh foto website & link Google Drive berhasil disimpan dan disinkronkan ke Google Sheets!');
    } catch {
      onNotify('Terjadi kendala saat menyimpan foto.');
    } finally {
      setIsSaving(false);
    }
  };

  // Generic File Upload for any photo
  const handleGenericFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    photoLabel: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar berformat JPG, JPEG, PNG, atau WebP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
        onNotify(`Foto ${photoLabel} berhasil dipilih! Klik tombol "Simpan Semua Foto" untuk menerapkan.`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload custom QRIS image
  const handleQrisFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar berformat JPG, JPEG, atau PNG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQrisPreview(reader.result);
        onNotify('Foto QRIS berhasil dipilih! Klik "Simpan Pengaturan" untuk menerapkan.');
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. Tambah Transaksi Kas
  const handleAddKas = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(txAmount.replace(/[^0-9]/g, ''), 10);
    if (!nominal || nominal <= 0) {
      alert('Mohon masukkan nominal transaksi yang valid.');
      return;
    }
    if (!txDesc.trim()) {
      alert('Mohon isi keterangan transaksi.');
      return;
    }

    setIsSaving(true);
    try {
      await submitKasToSheets({
        date: txDate,
        description: txDesc.trim(),
        type: txType,
        amount: nominal,
        category: txCategory,
      });
      setTxAmount('');
      setTxDesc('');
      const updated = await fetchKasFromSheets();
      setKasSummary(updated);
      triggerMasjidDataSync();
      onNotify(`Transaksi kas Rp ${nominal.toLocaleString('id-ID')} berhasil dicatat & disinkronkan!`);
    } catch {
      onNotify('Gagal menyimpan transaksi kas.');
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Simpan Jadwal Jumat
  const handleSaveJadwalJumat = async () => {
    setIsSaving(true);
    try {
      await submitJadwalJumatToSheets({
        date: jumatDate.trim() || "Jum'at Pekan Ini",
        khatib: khatib.trim(),
        imam: imam.trim(),
        muadzin: muadzin.trim(),
        khutbahTopic: khutbahTopic.trim(),
        adzanTime: adzanTime.trim() || '12:08 WITA',
      });
      triggerMasjidDataSync();
      onNotify("Jadwal Sholat Jum'at berhasil diperbarui di website!");
    } catch {
      onNotify('Gagal menyimpan jadwal Jumat.');
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Simpan Data TPQ & Ustadz
  const handleSaveTPQ = async () => {
    setIsSaving(true);
    try {
      await submitTPQToSheets({
        ustadzPengajar: ustadzPengajar.trim(),
        kontak1: tpqKontak1.trim(),
        kontak2: tpqKontak2.trim(),
        scheduleDays: tpqDays.trim(),
        scheduleTime: tpqTime.trim(),
        nslpq: tpqNslpq.trim(),
      });
      triggerMasjidDataSync();
      onNotify('Data TPQ Al-Muhajirin & Pengajar berhasil diperbarui di website!');
    } catch {
      onNotify('Gagal menyimpan data TPQ.');
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Tambah Agenda Baru
  const handleAddAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaTitle.trim() || !newAgendaDay.trim()) {
      alert('Mohon isi judul dan hari/tanggal agenda.');
      return;
    }

    const newItem: AgendaItem = {
      id: `agenda-${Date.now()}`,
      title: newAgendaTitle.trim(),
      category: 'Rutin',
      dayOrDate: newAgendaDay.trim(),
      time: newAgendaTime.trim() || "Ba'da Maghrib",
      speakerOrOfficer: newAgendaSpeaker.trim() || 'Ustadz DKM',
      description: newAgendaDesc.trim(),
      location: 'Ruang Sholat Utama',
    };

    const updated = [newItem, ...agendaList];
    setAgendaList(updated);
    setNewAgendaTitle('');
    setNewAgendaDay('');
    setNewAgendaTime('');
    setNewAgendaSpeaker('');
    setNewAgendaDesc('');

    await submitAgendaToSheets(updated);
    triggerMasjidDataSync();
    onNotify('Agenda baru berhasil ditambahkan ke jadwal website!');
  };

  // Hapus Agenda
  const handleDeleteAgenda = async (id: string) => {
    if (!confirm('Hapus agenda kegiatan ini?')) return;
    const updated = agendaList.filter((a) => a.id !== id);
    setAgendaList(updated);
    await submitAgendaToSheets(updated);
    triggerMasjidDataSync();
    onNotify('Agenda kegiatan telah dihapus.');
  };

  // 5.5. Artikel Handlers
  const resetArticleForm = () => {
    setEditingArticleId(null);
    setArtTitle('');
    setArtCategory('Kabar Masjid');
    setArtAuthor('Pengurus DKM Al-Ikhlas');
    setArtDate('');
    setArtExcerpt('');
    setArtContent('');
    setArtTemplate('banner_top');
    setArtPrimaryImage('');
    setArtAdditionalImages('');
    setArtIsFeatured(false);
  };

  const handleStartEditArticle = (art: ArticleItem) => {
    setEditingArticleId(art.id);
    setArtTitle(art.title);
    setArtCategory(art.category);
    setArtAuthor(art.author);
    setArtDate(art.date);
    setArtExcerpt(art.excerpt);
    setArtContent(art.content);
    setArtTemplate(art.layoutTemplate || 'banner_top');
    setArtPrimaryImage(art.primaryImage || '');
    setArtAdditionalImages(
      art.additionalImages && art.additionalImages.length > 0 ? art.additionalImages.join('\n') : ''
    );
    setArtIsFeatured(Boolean(art.isFeatured));
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) {
      alert('Mohon isi judul artikel.');
      return;
    }
    if (!artContent.trim()) {
      alert('Mohon isi konten artikel.');
      return;
    }

    setIsSaving(true);
    try {
      const formattedDate = artDate.trim() || new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeZone: 'Asia/Makassar',
      }).format(new Date());

      const addImgs = artAdditionalImages
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const newArticle: ArticleItem = {
        id: editingArticleId || `artikel-${Date.now()}`,
        title: artTitle.trim(),
        category: artCategory,
        author: artAuthor.trim() || 'Pengurus DKM Al-Ikhlas',
        date: formattedDate,
        excerpt: artExcerpt.trim() || artContent.trim().slice(0, 160) + '...',
        content: artContent.trim(),
        layoutTemplate: artTemplate,
        primaryImage: artPrimaryImage.trim() || '/images/hero_masjid_kudung_1791948462974.jpg',
        additionalImages: addImgs,
        isFeatured: artIsFeatured,
      };

      let updatedList: ArticleItem[];
      if (editingArticleId) {
        updatedList = articlesList.map((a) => (a.id === editingArticleId ? newArticle : a));
      } else {
        updatedList = [newArticle, ...articlesList];
      }

      setArticlesList(updatedList);
      await submitArticlesToSheets(updatedList);
      triggerMasjidDataSync();
      resetArticleForm();
      onNotify(editingArticleId ? 'Artikel berhasil diperbarui di website!' : 'Artikel baru berhasil diterbitkan!');
    } catch {
      onNotify('Gagal menyimpan artikel.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Hapus artikel ini dari website?')) return;
    const updated = articlesList.filter((a) => a.id !== id);
    setArticlesList(updated);
    if (editingArticleId === id) {
      resetArticleForm();
    }
    await submitArticlesToSheets(updated);
    triggerMasjidDataSync();
    onNotify('Artikel telah dihapus dari website.');
  };

  // 5.6 Handlers Fasilitas Musafir & Rest Area
  const handleEditFacility = (fac: FacilityItem) => {
    setEditingFacilityId(fac.id);
    setFacTitle(fac.title);
    setFacIcon(fac.iconName || 'Building2');
    setFacAvailability(fac.availability);
    setFacDescription(fac.description);
  };

  const handleResetFacilityForm = () => {
    setEditingFacilityId(null);
    setFacTitle('');
    setFacIcon('Building2');
    setFacAvailability('24 Jam Non-Stop');
    setFacDescription('');
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facTitle.trim()) {
      alert('Mohon isi nama/judul fasilitas.');
      return;
    }

    setIsSaving(true);
    try {
      const newFacility: FacilityItem = {
        id: editingFacilityId || `fac-${Date.now()}`,
        iconName: facIcon || 'Building2',
        title: facTitle.trim(),
        availability: facAvailability.trim() || '24 Jam Non-Stop',
        description: facDescription.trim(),
      };

      let updatedList: FacilityItem[];
      if (editingFacilityId) {
        updatedList = facilitiesList.map((f) => (f.id === editingFacilityId ? newFacility : f));
      } else {
        updatedList = [...facilitiesList, newFacility];
      }

      setFacilitiesList(updatedList);
      await submitFacilitiesToSheets(updatedList, {
        sectionTitle: restHeaderTitle,
        tagline: restHeaderTagline,
        badgeText: restHeaderBadge,
        description: restHeaderDescription,
      });
      triggerMasjidDataSync();
      handleResetFacilityForm();
      onNotify(editingFacilityId ? 'Fasilitas rest area berhasil diperbarui!' : 'Fasilitas rest area baru berhasil ditambahkan!');
    } catch {
      onNotify('Gagal menyimpan fasilitas rest area.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm('Hapus fasilitas ini dari daftar rest area?')) return;
    const updated = facilitiesList.filter((f) => f.id !== id);
    setFacilitiesList(updated);
    if (editingFacilityId === id) {
      handleResetFacilityForm();
    }
    await submitFacilitiesToSheets(updated, {
      sectionTitle: restHeaderTitle,
      tagline: restHeaderTagline,
      badgeText: restHeaderBadge,
      description: restHeaderDescription,
    });
    triggerMasjidDataSync();
    onNotify('Fasilitas berhasil dihapus.');
  };

  const handleMoveFacility = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= facilitiesList.length) return;
    const clone = [...facilitiesList];
    const [moved] = clone.splice(index, 1);
    clone.splice(targetIdx, 0, moved);
    setFacilitiesList(clone);
    await submitFacilitiesToSheets(clone, {
      sectionTitle: restHeaderTitle,
      tagline: restHeaderTagline,
      badgeText: restHeaderBadge,
      description: restHeaderDescription,
    });
    triggerMasjidDataSync();
    onNotify('Urutan fasilitas berhasil dipindahkan!');
  };

  const handleSaveRestAreaHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const header: RestAreaHeaderInfo = {
        sectionTitle: restHeaderTitle.trim() || 'Layanan Rest Area & Fasilitas Musafir',
        tagline: restHeaderTagline.trim() || 'Rest Area Trans-Kalimantan',
        badgeText: restHeaderBadge.trim() || 'Akses 24 Jam Non-Stop',
        description: restHeaderDescription.trim(),
      };
      await submitFacilitiesToSheets(facilitiesList, header);
      triggerMasjidDataSync();
      onNotify('Info header Rest Area berhasil disimpan!');
    } catch {
      onNotify('Gagal menyimpan info Rest Area.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetFacilitiesDefault = async () => {
    if (!confirm('Kembalikan seluruh daftar fasilitas rest area ke setelan standar bawaan?')) return;
    setFacilitiesList(DEFAULT_FACILITIES);
    setRestHeaderTitle(DEFAULT_REST_AREA_HEADER.sectionTitle);
    setRestHeaderTagline(DEFAULT_REST_AREA_HEADER.tagline);
    setRestHeaderBadge(DEFAULT_REST_AREA_HEADER.badgeText);
    setRestHeaderDescription(DEFAULT_REST_AREA_HEADER.description);
    handleResetFacilityForm();
    await submitFacilitiesToSheets(DEFAULT_FACILITIES, DEFAULT_REST_AREA_HEADER);
    triggerMasjidDataSync();
    onNotify('Fasilitas & rest area berhasil dikembalikan ke standar awal.');
  };

  // 6. Simpan Google Sheets URL
  const handleSaveSheetsUrl = () => {
    setGoogleSheetsApiUrl(sheetsUrl);
    triggerMasjidDataSync();
    onNotify('URL Google Sheets Web App berhasil diperbarui!');
  };

  // Uji koneksi Google Sheets
  const handleTestSheets = async () => {
    if (!sheetsUrl || !sheetsUrl.startsWith('https://script.google.com')) {
      setSheetTestResult('⚠️ URL harus diawali dengan https://script.google.com/macros/s/...');
      return;
    }
    setIsTestingSheet(true);
    setSheetTestResult('Menghubungkan ke Google Apps Script Web App...');
    try {
      const res = await fetch(`${sheetsUrl}?action=getAll`);
      const data = await res.json();
      if (data && data.status === 'success') {
        const found: string[] = [];
        if (data.articles) found.push('Artikel');
        if (data.fasilitas) found.push('Fasilitas Musafir');
        if (data.kas) found.push('Kas Keuangan');
        if (data.bukuTamu) found.push('Buku Tamu');
        if (data.agenda) found.push('Agenda');
        if (data.tpq) found.push('TPQ');
        if (data.settings) found.push('Pengaturan');
        const listStr = found.length > 0 ? found.join(', ') : 'Semua Layanan';
        setSheetTestResult(`✅ BERHASIL TERKONEKSI REAL-TIME! Data aktif: [${listStr}]. Setiap perubahan yang Anda simpan di Portal Admin langsung live di website Netlify Anda secara otomatis tanpa perlu ubah HTML!`);
        loadPortalData();
      } else {
        setSheetTestResult('⚠️ Terhubung ke Google Apps Script, namun data belum lengkap.');
      }
    } catch {
      setSheetTestResult('❌ Gagal terhubung. Pastikan Web App diset "Who has access: Anyone" dan sudah di-Deploy sebagai New Version.');
    } finally {
      setIsTestingSheet(false);
    }
  };

  // 7. Ganti Password Admin
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (!verifyAdminPassword(oldPassword)) {
      setPassMessage({ text: 'Password saat ini salah!', isError: true });
      return;
    }

    if (newPassword.length < 6) {
      setPassMessage({ text: 'Password baru minimal 6 karakter.', isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'Konfirmasi password baru tidak cocok.', isError: true });
      return;
    }

    setAdminPassword(newPassword);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPassMessage({ text: '✅ Password admin berhasil diubah! Gunakan password baru saat login berikutnya.', isError: false });
    onNotify('Password admin berhasil diubah!');
  };

  const handleResetPassword = () => {
    if (confirm('Kembalikan password admin ke pengaturan bawaan awal?')) {
      resetAdminPasswordToDefault();
      setPassMessage({ text: 'Password admin berhasil dikembalikan ke bawaan awal.', isError: false });
      onNotify('Password telah direset ke default.');
    }
  };

  // Copy Google Apps Script code
  const handleCopyScript = () => {
    navigator.clipboard.writeText(COMPLETE_GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    onNotify('Kode Google Apps Script berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // ==========================================
  // RENDER: PASSWORD LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Akses Terproteksi Pengurus DKM
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Portal Admin Masjid
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Masjid Al-Ikhlas Gunung Kudung KM 145
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Masukkan Password Admin:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Ketik password admin..."
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none pr-11 transition-colors font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Buka Portal Pengurus</span>
            </button>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Area terbatas khusus Pengurus & Takmir DKM Masjid Al-Ikhlas Gunung Kudung.
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92vh] bg-stone-900 border border-stone-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar Header */}
        <div className="px-4 sm:px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-600/60 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Portal Pengurus DKM</span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sistem Aktif" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                Kelola Website & Sinkronisasi Google Sheets
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('password')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-800 text-stone-300 hover:text-white border-stone-700'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ganti Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Keluar dari Portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 bg-stone-950/80 border-b border-stone-800/90 text-xs shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('rekening_qris')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rekening_qris'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>💳 Rekening BRI & QRIS</span>
          </button>

          <button
            onClick={() => setActiveTab('foto_drive')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'foto_drive'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🖼️ Foto Website & Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('artikel')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'artikel'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>📝 Artikel & Berita</span>
          </button>

          <button
            onClick={() => setActiveTab('fasilitas')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fasilitas'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🛋️ Fasilitas Rest Area</span>
          </button>

          <button
            onClick={() => setActiveTab('kas')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kas'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>📊 Kas & Keuangan</span>
          </button>

          <button
            onClick={() => setActiveTab('jumat')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jumat'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🕌 Jadwal Jum'at</span>
          </button>

          <button
            onClick={() => setActiveTab('tpq')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tpq'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>📖 TPQ & Ustadz</span>
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>📅 Agenda Rutin</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sheets'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🌐 Google Sheets API</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'password'
                ? 'bg-amber-400 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🔑 Keamanan</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: REKENING BANK BRI & FOTO QRIS RESMI */}
          {activeTab === 'rekening_qris' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Pengaturan Rekening Bank BRI & Foto QRIS Resmi</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Data yang diubah di sini otomatis terhubung ke tampilan publik website dan Google Sheets.
                  </p>
                </div>
                <button
                  onClick={handleSaveRekeningQris}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan & Terapkan'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Form Rekening Bank */}
                <div className="space-y-4 bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Informasi Rekening Resmi
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nama Bank:
                    </label>
                    <input
                      type="text"
                      value={namaBank}
                      onChange={(e) => setNamaBank(e.target.value)}
                      placeholder="Bank BRI"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nomor Rekening Bank BRI:
                    </label>
                    <input
                      type="text"
                      value={nomorRekening}
                      onChange={(e) => setNomorRekening(e.target.value)}
                      placeholder="Contoh: 0123-01-000123-50-1"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Kosongkan bila nomor rekening belum siap. Jika diisi, tombol 'Salin Rekening' otomatis muncul di halaman depan.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Atas Nama Rekening:
                    </label>
                    <input
                      type="text"
                      value={atasNama}
                      onChange={(e) => setAtasNama(e.target.value)}
                      placeholder="Masjid Al-Ikhlas"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nomor WhatsApp Konfirmasi DKM:
                    </label>
                    <input
                      type="text"
                      value={kontakWa}
                      onChange={(e) => setKontakWa(e.target.value)}
                      placeholder="082150745576"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Form Upload Foto QRIS Resmi */}
                <div className="space-y-4 bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Foto QRIS Resmi Masjid (JPG/PNG)
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-medium">Bisa Unggah File Sendiri</span>
                  </div>

                  {/* QRIS Image Preview Card */}
                  <div className="bg-white p-3 rounded-2xl border border-stone-300 max-w-[220px] mx-auto text-center shadow-lg">
                    {qrisPreview ? (
                      <img
                        src={formatDriveImageUrl(qrisPreview) || qrisPreview}
                        alt="Preview QRIS"
                        className="w-full h-auto rounded-lg object-contain max-h-[200px] mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/qris_masjid_official_1792025688952.jpg';
                        }}
                      />
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center text-stone-400 text-xs">
                        <Upload className="w-8 h-8 mb-2 text-stone-300" />
                        <span>Belum ada gambar QRIS</span>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-stone-200">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 block">
                        NMID: {nmidQris || 'ID1024358892110'}
                      </span>
                      <span className="text-[9px] text-stone-500 font-medium block">
                        A.N. DKM MASJID AL-IKHLAS
                      </span>
                    </div>
                  </div>

                  {/* Input Link Google Drive untuk Foto QRIS */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Link Google Drive Foto QRIS (Direkomendasikan):</span>
                      </label>
                      <a
                        href="https://drive.google.com/drive/folders/1iZVglGXqCJwlAezOAffFV1qiLLlHcmFi?usp=drive_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 underline"
                        title="Buka folder Drive masjid untuk upload foto QRIS"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Buka Folder Drive</span>
                      </a>
                    </div>
                    <input
                      type="text"
                      value={qrisPreview.startsWith('data:') ? '' : qrisPreview}
                      onChange={(e) => setQrisPreview(e.target.value.trim())}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
                      💡 <strong>Catatan:</strong> Foto dari HP tidak otomatis masuk ke Google Drive Anda. Upload foto QRIS ke folder Drive masjid, klik <em>Bagikan &rarr; Siapa saja yang memiliki link</em>, lalu tempelkan linknya di sini agar QRIS tersinkron permanen untuk semua pengunjung website di Netlify.
                    </p>
                  </div>

                  {/* Input Kode NMID QRIS */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>Nomor NMID QRIS (National Merchant ID):</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Tercetak di QRIS</span>
                    </label>
                    <input
                      type="text"
                      value={nmidQris}
                      onChange={(e) => setNmidQris(e.target.value.toUpperCase())}
                      placeholder="Contoh: ID1024358892110"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono tracking-wider focus:outline-none focus:border-amber-400 font-bold"
                    />
                    <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
                      Sesuaikan kode NMID yang tercetak pada kartu QRIS baru Anda.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleQrisFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                  />

                  <div className="space-y-2 pt-1 border-t border-stone-800/80">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Atau Pilih File Langsung dari HP / Laptop</span>
                      </button>

                      {qrisPreview && (
                        <button
                          type="button"
                          onClick={() => setQrisPreview('/images/qris_masjid_official_1792025688952.jpg')}
                          className="py-2 px-3 text-xs text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors border border-stone-800"
                          title="Kembalikan ke gambar QRIS bawaan"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: FOTO WEBSITE & INTEGRASI GOOGLE DRIVE */}
          {activeTab === 'foto_drive' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <span>Kelola Foto Website & Sinkronisasi Google Drive</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Ganti foto masjid, rest area, ruang sholat, dan kegiatan TPQ cukup dengan memasukkan link Google Drive. Website terbarui otomatis tanpa perlu upload ulang ke GitHub/Netlify.
                  </p>
                </div>
                <button
                  onClick={handleSaveFotoDrive}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50 shrink-0"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Foto'}</span>
                </button>
              </div>

              {/* Panduan Google Drive */}
              <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-emerald-950/30 border border-amber-400/30 rounded-2xl p-4 sm:p-5 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-bold text-amber-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Petunjuk Menyimpan Foto di Google Drive:</span>
                  </div>
                  <a
                    href="https://drive.google.com/drive/folders/1iZVglGXqCJwlAezOAffFV1qiLLlHcmFi?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Folder Google Drive Resmi</span>
                  </a>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-stone-300 text-[11px] sm:text-xs leading-relaxed pl-1">
                  <li>Buka folder Google Drive di atas $\rightarrow$ unggah foto-foto dokumentasi masjid Anda (JPG / PNG).</li>
                  <li>Klik kanan file foto $\rightarrow$ pilih <strong>Bagikan (Share)</strong> $\rightarrow$ ubah Akses Umum menjadi <strong>"Siapa saja yang memiliki link" (Anyone with the link)</strong>.</li>
                  <li>Klik <strong>Salin link (Copy link)</strong>, lalu tempelkan (*Paste*) ke kolom foto yang sesuai di bawah ini.</li>
                  <li>Klik tombol hijau <strong>"Simpan Semua Foto"</strong> di atas. Foto website Anda langsung berganti secara *real-time*!</li>
                </ol>
              </div>

              {/* Grid 4 Kartu Foto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* 1. Foto Utama Masjid (Hero Banner) */}
                <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      1. Foto Utama Masjid (Hero Banner Atas)
                    </h4>
                    <span className="text-[10px] text-stone-400">Tampilan Paling Depan</span>
                  </div>

                  <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 h-44 w-full relative group">
                    <img
                      src={formatDriveImageUrl(heroPhoto) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                      alt="Pratinjau Foto Utama"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                      Pratinjau Foto Utama Saat Ini
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Link Google Drive / URL Gambar:
                    </label>
                    <input
                      type="text"
                      value={heroPhoto}
                      onChange={(e) => setHeroPhoto(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <input
                    type="file"
                    ref={heroFileRef}
                    onChange={(e) => handleGenericFileUpload(e, setHeroPhoto, 'Utama Masjid')}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => heroFileRef.current?.click()}
                      className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload dari File HP/Laptop</span>
                    </button>
                    {heroPhoto && (
                      <button
                        type="button"
                        onClick={() => setHeroPhoto('')}
                        className="py-2 px-3 text-xs text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors border border-stone-800"
                        title="Kembalikan ke foto bawaan"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Foto Interior Ruang Sholat Utama */}
                <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      2. Foto Interior Ruang Sholat Utama
                    </h4>
                    <span className="text-[10px] text-stone-400">Bagian Musafir & Fasilitas</span>
                  </div>

                  <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 h-44 w-full relative group">
                    <img
                      src={formatDriveImageUrl(interiorPhoto) || '/images/interior_sholat_utama_1791948463767.jpg'}
                      alt="Pratinjau Ruang Sholat"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/interior_sholat_utama_1791948463767.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                      Pratinjau Ruang Sholat
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Link Google Drive / URL Gambar:
                    </label>
                    <input
                      type="text"
                      value={interiorPhoto}
                      onChange={(e) => setInteriorPhoto(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <input
                    type="file"
                    ref={interiorFileRef}
                    onChange={(e) => handleGenericFileUpload(e, setInteriorPhoto, 'Ruang Sholat')}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => interiorFileRef.current?.click()}
                      className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload dari File HP/Laptop</span>
                    </button>
                    {interiorPhoto && (
                      <button
                        type="button"
                        onClick={() => setInteriorPhoto('')}
                        className="py-2 px-3 text-xs text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors border border-stone-800"
                        title="Kembalikan ke foto bawaan"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Foto Bale Santai & Tempat Wudhu Musafir */}
                <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      3. Foto Bale Santai & Tempat Wudhu Musafir
                    </h4>
                    <span className="text-[10px] text-stone-400">Bagian Rest Area 24 Jam</span>
                  </div>

                  <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 h-44 w-full relative group">
                    <img
                      src={formatDriveImageUrl(restAreaPhoto) || '/images/rest_area_musafir_1791948465509.jpg'}
                      alt="Pratinjau Rest Area"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/rest_area_musafir_1791948465509.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                      Pratinjau Rest Area Musafir
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Link Google Drive / URL Gambar:
                    </label>
                    <input
                      type="text"
                      value={restAreaPhoto}
                      onChange={(e) => setRestAreaPhoto(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <input
                    type="file"
                    ref={restAreaFileRef}
                    onChange={(e) => handleGenericFileUpload(e, setRestAreaPhoto, 'Rest Area Musafir')}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => restAreaFileRef.current?.click()}
                      className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload dari File HP/Laptop</span>
                    </button>
                    {restAreaPhoto && (
                      <button
                        type="button"
                        onClick={() => setRestAreaPhoto('')}
                        className="py-2 px-3 text-xs text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors border border-stone-800"
                        title="Kembalikan ke foto bawaan"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Foto Kegiatan Belajar Santri TPQ Al-Muhajirin */}
                <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      4. Foto Kegiatan Santri TPQ Al-Muhajirin
                    </h4>
                    <span className="text-[10px] text-stone-400">Bagian TPQ & Pendidikan</span>
                  </div>

                  <div className="bg-stone-900 rounded-xl overflow-hidden border border-stone-800 h-44 w-full relative group">
                    <img
                      src={formatDriveImageUrl(tpqPhoto) || '/images/pengajian_kajian_masjid_1791948465248.jpg'}
                      alt="Pratinjau Belajar TPQ"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/pengajian_kajian_masjid_1791948465248.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium">
                      Pratinjau Kegiatan TPQ
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Link Google Drive / URL Gambar:
                    </label>
                    <input
                      type="text"
                      value={tpqPhoto}
                      onChange={(e) => setTpqPhoto(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <input
                    type="file"
                    ref={tpqFileRef}
                    onChange={(e) => handleGenericFileUpload(e, setTpqPhoto, 'Kegiatan TPQ')}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => tpqFileRef.current?.click()}
                      className="flex-1 py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload dari File HP/Laptop</span>
                    </button>
                    {tpqPhoto && (
                      <button
                        type="button"
                        onClick={() => setTpqPhoto('')}
                        className="py-2 px-3 text-xs text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors border border-stone-800"
                        title="Kembalikan ke foto bawaan"
                      >
                        Reset Default
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.7: MANAJEMEN ARTIKEL, WARTA & KEGIATAN MASJID */}
          {activeTab === 'artikel' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-amber-400" />
                    <span>Manajemen Artikel, Warta & Kegiatan Masjid</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Buat berita kegiatan dakwah, pembinaan santri TPQ, rest area, dan laporan transparansi. Tampilan artikel dapat diatur dengan 4 jenis template tata letak foto yang inspiratif.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl">
                    {articlesList.length} Artikel Aktif
                  </span>
                </div>
              </div>

              {/* Form Tulis / Edit Artikel */}
              <form onSubmit={handleSaveArticle} className="bg-stone-950/70 p-4 sm:p-6 rounded-2xl border border-stone-800 space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>{editingArticleId ? 'Edit Artikel Yang Dipilih' : 'Tulis Artikel & Warta Baru'}</span>
                  </h4>
                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={resetArticleForm}
                      className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                    >
                      Batal Edit (Buat Baru)
                    </button>
                  )}
                </div>

                {/* 1. Pemilihan Template Tata Letak Artikel */}
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-2">
                    Pilih Template Tata Letak Tampilan Artikel:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Template 1: Banner Top */}
                    <button
                      type="button"
                      onClick={() => setArtTemplate('banner_top')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        artTemplate === 'banner_top'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <div className="space-y-1 mb-2">
                        <div className="h-6 w-full rounded bg-amber-400/30 border border-amber-400/50 flex items-center justify-center text-[10px] text-amber-300">
                          Foto Banner Atas
                        </div>
                        <div className="h-1.5 w-full bg-stone-700 rounded"></div>
                        <div className="h-1.5 w-3/4 bg-stone-700 rounded"></div>
                      </div>
                      <div className="text-xs font-bold text-white">Banner Atas</div>
                      <div className="text-[10px] text-stone-400 leading-tight">Foto lebar di atas, teks di bawah</div>
                    </button>

                    {/* Template 2: Photo Left */}
                    <button
                      type="button"
                      onClick={() => setArtTemplate('photo_left')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        artTemplate === 'photo_left'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex gap-1.5 mb-2 h-9 items-center">
                        <div className="w-1/2 h-full rounded bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center text-[9px] text-emerald-300">
                          Foto Kiri
                        </div>
                        <div className="w-1/2 space-y-1">
                          <div className="h-1.5 w-full bg-stone-700 rounded"></div>
                          <div className="h-1.5 w-full bg-stone-700 rounded"></div>
                          <div className="h-1.5 w-1/2 bg-stone-700 rounded"></div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white">Editorial Kiri</div>
                      <div className="text-[10px] text-stone-400 leading-tight">Foto di kiri, teks di kanan</div>
                    </button>

                    {/* Template 3: Photo Right */}
                    <button
                      type="button"
                      onClick={() => setArtTemplate('photo_right')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        artTemplate === 'photo_right'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex gap-1.5 mb-2 h-9 items-center">
                        <div className="w-1/2 space-y-1">
                          <div className="h-1.5 w-full bg-stone-700 rounded"></div>
                          <div className="h-1.5 w-full bg-stone-700 rounded"></div>
                          <div className="h-1.5 w-1/2 bg-stone-700 rounded"></div>
                        </div>
                        <div className="w-1/2 h-full rounded bg-emerald-400/30 border border-emerald-400/50 flex items-center justify-center text-[9px] text-emerald-300">
                          Foto Kanan
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white">Editorial Kanan</div>
                      <div className="text-[10px] text-stone-400 leading-tight">Teks di kiri, foto di kanan</div>
                    </button>

                    {/* Template 4: Gallery Grid */}
                    <button
                      type="button"
                      onClick={() => setArtTemplate('gallery_grid')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        artTemplate === 'gallery_grid'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-1 mb-2 h-9">
                        <div className="rounded bg-blue-400/30 border border-blue-400/50 flex items-center justify-center text-[8px] text-blue-300">Foto 1</div>
                        <div className="rounded bg-blue-400/30 border border-blue-400/50 flex items-center justify-center text-[8px] text-blue-300">Foto 2</div>
                      </div>
                      <div className="text-xs font-bold text-white">Galeri Foto</div>
                      <div className="text-[10px] text-stone-400 leading-tight">Kolase foto kegiatan</div>
                    </button>
                  </div>
                </div>

                {/* Judul Artikel */}
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">
                    Judul Artikel / Berita:
                  </label>
                  <input
                    type="text"
                    value={artTitle}
                    onChange={(e) => setArtTitle(e.target.value)}
                    placeholder="Contoh: Kerja Bakti & Perawatan Sarana Air Bersih Musafir"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    required
                  />
                </div>

                {/* Kategori, Penulis & Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Kategori:</label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value as ArticleItem['category'])}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="Kabar Masjid">Kabar Masjid</option>
                      <option value="Kegiatan TPQ">Kegiatan TPQ</option>
                      <option value="Info Musafir">Info Musafir</option>
                      <option value="Kajian & Fiqih">Kajian & Fiqih</option>
                      <option value="Pembangunan & Kas">Pembangunan & Kas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Penulis / Sumber:</label>
                    <input
                      type="text"
                      value={artAuthor}
                      onChange={(e) => setArtAuthor(e.target.value)}
                      placeholder="Pengurus DKM Al-Ikhlas"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Tanggal Publikasi:</label>
                    <input
                      type="text"
                      value={artDate}
                      onChange={(e) => setArtDate(e.target.value)}
                      placeholder="Contoh: 20 Oktober 2026"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Foto Utama Artikel */}
                <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Foto Utama Artikel (Link Google Drive / URL Gambar):</span>
                    </label>
                    <a
                      href="https://drive.google.com/drive/folders/1iZVglGXqCJwlAezOAffFV1qiLLlHcmFi?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 underline self-start sm:self-auto"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Folder Google Drive Masjid</span>
                    </a>
                  </div>

                  <input
                    type="text"
                    value={artPrimaryImage.startsWith('data:') ? '' : artPrimaryImage}
                    onChange={(e) => setArtPrimaryImage(e.target.value.trim())}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <input
                      type="file"
                      ref={articlePrimaryFileRef}
                      onChange={(e) => handleGenericFileUpload(e, setArtPrimaryImage, 'Artikel')}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => articlePrimaryFileRef.current?.click()}
                      className="w-full sm:w-auto py-2 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-750 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pilih Foto dari HP/Laptop</span>
                    </button>

                    {artPrimaryImage && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formatDriveImageUrl(artPrimaryImage)}
                          alt="Pratinjau"
                          className="w-10 h-10 object-cover rounded-lg border border-stone-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                          }}
                        />
                        <span className="text-[10px] text-emerald-400">Pratinjau Foto Siap</span>
                        <button
                          type="button"
                          onClick={() => setArtPrimaryImage('')}
                          className="text-[10px] text-stone-400 hover:text-rose-400 underline"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Foto Tambahan (Terutama untuk Template Galeri) */}
                {(artTemplate === 'gallery_grid' || artTemplate === 'banner_top') && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Link Foto Tambahan Dokumentasi (1 link per baris - Opsional):
                    </label>
                    <textarea
                      rows={2}
                      value={artAdditionalImages}
                      onChange={(e) => setArtAdditionalImages(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view&#10;https://drive.google.com/file/d/.../view"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      Foto tambahan akan ditampilkan berdampingan sebagai galeri dokumentasi kegiatan di dalam jendela baca artikel.
                    </p>
                  </div>
                )}

                {/* Ringkasan Singkat (Excerpt) */}
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">
                    Ringkasan Singkat (Ditampilkan pada Kartu Carousel Depan):
                  </label>
                  <textarea
                    rows={2}
                    value={artExcerpt}
                    onChange={(e) => setArtExcerpt(e.target.value)}
                    placeholder="Tulis 1-2 kalimat ringkasan menarik tentang berita ini agar jamaah tertarik membaca..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Isi Lengkap Artikel */}
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">
                    Isi Lengkap Artikel & Narasi Berita:
                  </label>
                  <textarea
                    rows={6}
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    placeholder="Tuliskan berita lengkap mengenai kegiatan masjid, ayat Al-Qur'an/hadits pendukung, kronologi gotong royong, atau informasi yang ingin disampaikan..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                    required
                  />
                </div>

                {/* Checkbox Featured & Tombol Submit */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                    <input
                      type="checkbox"
                      checked={artIsFeatured}
                      onChange={(e) => setArtIsFeatured(e.target.checked)}
                      className="rounded border-stone-700 text-amber-400 focus:ring-0 cursor-pointer"
                    />
                    <span>Jadikan Artikel Utama / Sorotan di Carousel</span>
                  </label>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {editingArticleId && (
                      <button
                        type="button"
                        onClick={resetArticleForm}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 sm:flex-initial px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSaving ? 'Menyimpan...' : (editingArticleId ? 'Perbarui Artikel' : 'Terbitkan Artikel Baru')}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Daftar Artikel Aktif */}
              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center justify-between">
                  <span>Daftar Artikel Yang Telah Diterbitkan ({articlesList.length})</span>
                  <span className="text-[10px] text-stone-400 font-normal">Klik 'Edit' untuk mengubah isi artikel atau template foto</span>
                </h4>

                {articlesList.length === 0 ? (
                  <div className="p-6 text-center text-stone-400 text-xs">
                    Belum ada artikel yang diterbitkan. Silakan tulis artikel baru di atas.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {articlesList.map((art) => (
                      <div
                        key={art.id}
                        className={`p-3 sm:p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                          editingArticleId === art.id
                            ? 'bg-amber-950/40 border-amber-500/60'
                            : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={formatDriveImageUrl(art.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                            alt={art.title}
                            className="w-12 h-12 object-cover rounded-lg border border-stone-700 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                                {art.category}
                              </span>
                              <span className="text-[10px] text-stone-400">{art.date}</span>
                              <span className="text-[10px] text-stone-400 px-1.5 py-0.2 rounded bg-stone-800 border border-stone-700 hidden sm:inline">
                                Template: {art.layoutTemplate || 'banner_top'}
                              </span>
                              {art.isFeatured && (
                                <span className="text-[9px] text-emerald-400 font-medium">★ Sorotan</span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-white truncate">{art.title}</h5>
                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{art.excerpt}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditArticle(art)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-stone-950 bg-stone-800 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer border border-stone-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FASILITAS MUSAFIR & REST AREA 24 JAM */}
          {activeTab === 'fasilitas' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Kelola Fasilitas Musafir & Rest Area 24 Jam</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ⚡ Real-Time Sync
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Tambah, edit, ubah ikon, status ketersediaan, atau susun urutan fasilitas rest area. Semua data langsung tersimpan secara real-time ke Google Sheets dan terupdate di website Netlify Anda tanpa ganti HTML.
                  </p>
                </div>
              </div>

              {/* Realtime Netlify Sync Banner */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-stone-900 to-amber-950/30 rounded-2xl border border-emerald-500/30 text-xs flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-200">
                    Otomatis Tersimpan & Live di Netlify
                  </p>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    Setiap kali Anda menekan tombol <strong>Simpan</strong>, sistem otomatis memperbarui memori lokal dan mengirim data ke Google Sheets Web App. Jamaah dan musafir yang mengakses website Netlify Anda akan langsung melihat data terbaru secara real-time tanpa perlu build ulang atau merubah file HTML.
                  </p>
                </div>
              </div>

              {/* 1. Pengaturan Header Rest Area */}
              <form onSubmit={handleSaveRestAreaHeader} className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Identitas & Header Halaman Rest Area
                    </h4>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Header Rest Area'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Judul Section Rest Area:
                    </label>
                    <input
                      type="text"
                      value={restHeaderTitle}
                      onChange={(e) => setRestHeaderTitle(e.target.value)}
                      placeholder="Layanan Rest Area & Fasilitas Musafir"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Tagline Atas:
                    </label>
                    <input
                      type="text"
                      value={restHeaderTagline}
                      onChange={(e) => setRestHeaderTagline(e.target.value)}
                      placeholder="Rest Area Trans-Kalimantan"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Lencana Status Jam:
                    </label>
                    <input
                      type="text"
                      value={restHeaderBadge}
                      onChange={(e) => setRestHeaderBadge(e.target.value)}
                      placeholder="Akses 24 Jam Non-Stop"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                    Deskripsi Ringkas Rest Area untuk Musafir & Jamaah:
                  </label>
                  <textarea
                    rows={2}
                    value={restHeaderDescription}
                    onChange={(e) => setRestHeaderDescription(e.target.value)}
                    placeholder="Perjalanan jauh di rute Samarinda - Sangatta - Muara Wahau - Berau membutuhkan tempat singgah yang aman..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>
              </form>

              {/* 2. Formulir Tambah / Edit Fasilitas */}
              <form onSubmit={handleSaveFacility} className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {editingFacilityId ? '✏️ Edit Fasilitas Musafir' : '➕ Tambah Fasilitas Baru'}
                    </h4>
                  </div>
                  {editingFacilityId && (
                    <button
                      type="button"
                      onClick={handleResetFacilityForm}
                      className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
                    >
                      Batal Edit & Buat Baru
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1">
                      Nama / Judul Fasilitas <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={facTitle}
                      onChange={(e) => setFacTitle(e.target.value)}
                      placeholder="Contoh: Bilik Mandi Air Hangat, Dapur Sedekah Kopi/Teh Gratis"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-200 mb-1">
                      Ketersediaan / Waktu Akses <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={facAvailability}
                      onChange={(e) => setFacAvailability(e.target.value)}
                      placeholder="Buka 24 Jam / Gratis 24 Jam / 24 Jam Bersih"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    {/* Quick suggestion chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Buka 24 Jam', '24 Jam Bersih', '24 Jam Non-Stop', 'Gratis untuk Musafir', 'Terang & Aman', 'Gratis 24 Jam'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setFacAvailability(chip)}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700/80 transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pemilih Ikon Visual */}
                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-2">
                    Pilih Ikon Fasilitas:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {[
                      { id: 'Building2', label: 'Ruang Sholat', Icon: Building2 },
                      { id: 'Droplets', label: 'Air / Wudhu', Icon: Droplets },
                      { id: 'Bath', label: 'Toilet / Mandi', Icon: Bath },
                      { id: 'Car', label: 'Area Parkir', Icon: Car },
                      { id: 'Coffee', label: 'Bale / Minum', Icon: Coffee },
                      { id: 'Zap', label: 'Charger HP', Icon: Zap },
                      { id: 'Wifi', label: 'WiFi Gratis', Icon: Wifi },
                      { id: 'Phone', label: 'Pusat Kontak', Icon: PhoneIcon },
                      { id: 'Clock', label: '24 Jam', Icon: Clock },
                      { id: 'ShieldCheck', label: 'Keamanan DKM', Icon: ShieldCheck },
                      { id: 'HeartHandshake', label: 'Pelayanan', Icon: HeartHandshake },
                      { id: 'BookOpen', label: 'TPQ / Qur\'an', Icon: BookOpen },
                      { id: 'Utensils', label: 'Dapur & Rehat', Icon: Utensils },
                      { id: 'Compass', label: 'Arah Kiblat', Icon: Compass },
                    ].map(({ id, label, Icon }) => {
                      const isSelected = facIcon === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFacIcon(id)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/50 shadow-sm'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                          <span className="text-[10px] font-medium truncate w-full text-center">
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-200 mb-1">
                    Deskripsi Lengkap Fasilitas:
                  </label>
                  <textarea
                    rows={2}
                    value={facDescription}
                    onChange={(e) => setFacDescription(e.target.value)}
                    placeholder="Jelaskan kenyamanan, letak, atau kelebihan fasilitas bagi musafir yang singgah di KM 145..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/80">
                  {editingFacilityId && (
                    <button
                      type="button"
                      onClick={handleResetFacilityForm}
                      className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan ke Google Sheets...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingFacilityId ? 'Perbarui Fasilitas (Real-Time)' : 'Tambahkan Fasilitas (Real-Time)'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* 3. Daftar Fasilitas Musafir Saat Ini */}
              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Daftar Fasilitas Rest Area Aktif</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800 text-stone-300 font-mono">
                        {facilitiesList.length} Fasilitas
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Klik tombol panah naik/turun untuk mengatur urutan tampilan pada halaman depan.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFacilitiesDefault}
                    className="text-[11px] text-stone-400 hover:text-stone-200 underline cursor-pointer self-start sm:self-auto"
                  >
                    Kembalikan ke 8 Fasilitas Bawaan
                  </button>
                </div>

                {facilitiesList.length === 0 ? (
                  <div className="text-center py-8 text-stone-500 text-xs">
                    Belum ada fasilitas. Silakan tambahkan fasilitas baru di formulir atas.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {facilitiesList.map((fac, idx) => {
                      const isEditingThis = editingFacilityId === fac.id;
                      return (
                        <div
                          key={fac.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                            isEditingThis
                              ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40'
                              : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0">
                                  {fac.iconName === 'Droplets' && <Droplets className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'Bath' && <Bath className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'Car' && <Car className="w-4 h-4 text-amber-400" />}
                                  {fac.iconName === 'Coffee' && <Coffee className="w-4 h-4 text-amber-400" />}
                                  {fac.iconName === 'Zap' && <Zap className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'Wifi' && <Wifi className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'Phone' && <PhoneIcon className="w-4 h-4 text-amber-400" />}
                                  {fac.iconName === 'Clock' && <Clock className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'ShieldCheck' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'HeartHandshake' && <HeartHandshake className="w-4 h-4 text-emerald-400" />}
                                  {fac.iconName === 'BookOpen' && <BookOpen className="w-4 h-4 text-amber-400" />}
                                  {fac.iconName === 'Utensils' && <Utensils className="w-4 h-4 text-amber-400" />}
                                  {fac.iconName === 'Compass' && <Compass className="w-4 h-4 text-amber-400" />}
                                  {!['Droplets', 'Bath', 'Car', 'Coffee', 'Zap', 'Wifi', 'Phone', 'Clock', 'ShieldCheck', 'HeartHandshake', 'BookOpen', 'Utensils', 'Compass'].includes(fac.iconName) && (
                                    <Building2 className="w-4 h-4 text-emerald-400" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white line-clamp-1">
                                    {fac.title}
                                  </h5>
                                  <span className="text-[10px] text-emerald-400 font-semibold">
                                    {fac.availability}
                                  </span>
                                </div>
                              </div>

                              {/* Ordering & Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveFacility(idx, 'up')}
                                  className="p-1 text-stone-400 hover:text-amber-400 disabled:opacity-20 transition-colors cursor-pointer"
                                  title="Pindah ke atas"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === facilitiesList.length - 1}
                                  onClick={() => handleMoveFacility(idx, 'down')}
                                  className="p-1 text-stone-400 hover:text-amber-400 disabled:opacity-20 transition-colors cursor-pointer"
                                  title="Pindah ke bawah"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                              {fac.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-stone-800/80">
                            <button
                              type="button"
                              onClick={() => handleEditFacility(fac)}
                              className="px-2.5 py-1 text-[11px] font-medium text-amber-300 hover:text-stone-950 bg-stone-800 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer border border-stone-700 flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFacility(fac.id)}
                              className="p-1 text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Fasilitas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: KAS & KEUANGAN MASJID */}
          {activeTab === 'kas' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Kelola Transaksi Kas Masjid & Rest Area</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Setiap transaksi yang dicatat di sini langsung disimpan dan disinkronkan ke Google Sheets serta memperbarui saldo website.
                  </p>
                </div>
                {kasSummary && (
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Saldo Kas Terkini</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      Rp {kasSummary.saldoTerkini.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              {/* Form Tambah Transaksi Kas */}
              <form onSubmit={handleAddKas} className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Tambah Catatan Transaksi Baru</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Tanggal Transaksi:</label>
                    <input
                      type="date"
                      value={txDate}
                      onChange={(e) => setTxDate(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Jenis Kas:</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value as 'in' | 'out')}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="in">🟢 Pemasukan (Infaq / Donasi)</option>
                      <option value="out">🔴 Pengeluaran (Biaya / Operasional)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Nominal (Rp):</label>
                    <input
                      type="number"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="Contoh: 250000"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Kategori:</label>
                    <select
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Kotak Amal">Kotak Amal Sholat Jum'at</option>
                      <option value="Donasi Musafir">Infaq Musafir Rest Area</option>
                      <option value="Operasional">Listrik & Air Bersih</option>
                      <option value="Kebersihan">Kebersihan & Toilet</option>
                      <option value="TPQ">Santri TPQ Al-Muhajirin</option>
                      <option value="Marbot">Kesejahteraan Petugas</option>
                      <option value="Sosial">Kegiatan Sosial / PHBI</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Keterangan / Uraian:</label>
                  <input
                    type="text"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder="Contoh: Infaq tromol Jum'at atau Pembelian token listrik tandon air musafir"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{isSaving ? 'Menyimpan...' : 'Catat Transaksi ke Google Sheets'}</span>
                  </button>
                </div>
              </form>

              {/* Tabel Transaksi Terkini */}
              <div className="bg-stone-950/40 border border-stone-800 rounded-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Catatan Kas Terkini
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    Total: {kasSummary?.records.length || 0} Transaksi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-xs text-left">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-400 text-[11px]">
                        <th className="py-2 px-3">Tanggal</th>
                        <th className="py-2 px-3">Keterangan</th>
                        <th className="py-2 px-3">Kategori</th>
                        <th className="py-2 px-3 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-850">
                      {kasSummary && kasSummary.records.length > 0 ? (
                        kasSummary.records.slice(0, 8).map((r) => (
                          <tr key={r.id} className="hover:bg-stone-900/50">
                            <td className="py-2 px-3 text-stone-400 font-mono">{r.date}</td>
                            <td className="py-2 px-3 text-stone-200">{r.description}</td>
                            <td className="py-2 px-3 text-stone-400">
                              <span className="px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[10px]">
                                {r.category}
                              </span>
                            </td>
                            <td className={`py-2 px-3 text-right font-mono font-bold ${r.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {r.type === 'in' ? '+' : '-'} Rp {r.amount.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-stone-500">
                            Belum ada riwayat transaksi kas tercatat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JADWAL SHOLAT JUMAT */}
          {activeTab === 'jumat' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Kelola Petugas & Jadwal Sholat Jum'at</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Nama Khatib, Imam, Muadzin, dan Judul Khutbah yang diisi di sini akan langsung tampil pada banner Jum'at di halaman utama.
                  </p>
                </div>
                <button
                  onClick={handleSaveJadwalJumat}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Jadwal Jum\'at'}</span>
                </button>
              </div>

              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Tanggal Pelaksanaan Sholat Jum'at:
                    </label>
                    <input
                      type="text"
                      value={jumatDate}
                      onChange={(e) => setJumatDate(e.target.value)}
                      placeholder="Contoh: Jum'at, 17 Oktober 2026"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Waktu Adzan / Mulai Khutbah:
                    </label>
                    <input
                      type="text"
                      value={adzanTime}
                      onChange={(e) => setAdzanTime(e.target.value)}
                      placeholder="12:08 WITA"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Khatib Jum'at:
                    </label>
                    <input
                      type="text"
                      value={khatib}
                      onChange={(e) => setKhatib(e.target.value)}
                      placeholder="Nama Khatib..."
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Imam Sholat:
                    </label>
                    <input
                      type="text"
                      value={imam}
                      onChange={(e) => setImam(e.target.value)}
                      placeholder="Nama Imam Sholat..."
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Muadzin / Bilal:
                    </label>
                    <input
                      type="text"
                      value={muadzin}
                      onChange={(e) => setMuadzin(e.target.value)}
                      placeholder="Nama Muadzin..."
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Judul / Tema Khutbah Jum'at:
                  </label>
                  <input
                    type="text"
                    value={khutbahTopic}
                    onChange={(e) => setKhutbahTopic(e.target.value)}
                    placeholder="Contoh: Menjaga Ukhuwah Islamiyah & Amanah Kehidupan"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TPQ AL-MUHAJIRIN & DATA USTADZ */}
          {activeTab === 'tpq' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">Kelola TPQ Al-Muhajirin & Data Asatidz</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Informasi Ustadz/Ustadzah pengajar, jam mengaji, dan nomor telepon pengurus TPQ.
                  </p>
                </div>
                <button
                  onClick={handleSaveTPQ}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Data TPQ'}</span>
                </button>
              </div>

              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Nama Ustadz / Ustadzah Pengajar TPQ:
                  </label>
                  <input
                    type="text"
                    value={ustadzPengajar}
                    onChange={(e) => setUstadzPengajar(e.target.value)}
                    placeholder="Contoh: Ust. Slamet & Ustadzah Nurul Hidayah"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nomor HP/WA Pengurus TPQ 1:
                    </label>
                    <input
                      type="text"
                      value={tpqKontak1}
                      onChange={(e) => setTpqKontak1(e.target.value)}
                      placeholder="082150745576"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nomor HP/WA Pengurus TPQ 2:
                    </label>
                    <input
                      type="text"
                      value={tpqKontak2}
                      onChange={(e) => setTpqKontak2(e.target.value)}
                      placeholder="085389808592"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Hari Belajar:
                    </label>
                    <input
                      type="text"
                      value={tpqDays}
                      onChange={(e) => setTpqDays(e.target.value)}
                      placeholder="Senin sampai Sabtu"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Jam Belajar:
                    </label>
                    <input
                      type="text"
                      value={tpqTime}
                      onChange={(e) => setTpqTime(e.target.value)}
                      placeholder="16:00 - 17:30 WITA"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Nomor Statistik (NSLPQ BKPRMI):
                    </label>
                    <input
                      type="text"
                      value={tpqNslpq}
                      onChange={(e) => setTpqNslpq(e.target.value)}
                      placeholder="411264080597"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AGENDA & KEGIATAN RUTIN */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3">
                <h3 className="text-base font-bold text-white">Kelola Agenda & Kajian Rutin</h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Tambahkan atau sesuaikan jadwal pengajian, yasinan, dan majelis taklim di Masjid Al-Ikhlas.
                </p>
              </div>

              {/* Form Tambah Agenda */}
              <form onSubmit={handleAddAgenda} className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Tambah Kegiatan Baru</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Nama Kegiatan / Kajian:</label>
                    <input
                      type="text"
                      value={newAgendaTitle}
                      onChange={(e) => setNewAgendaTitle(e.target.value)}
                      placeholder="Contoh: Kuliah Subuh Ahad Pagi"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Hari / Waktu Pelaksanaan:</label>
                    <input
                      type="text"
                      value={newAgendaDay}
                      onChange={(e) => setNewAgendaDay(e.target.value)}
                      placeholder="Contoh: Setiap Ahad Pagi"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Jam (WITA):</label>
                    <input
                      type="text"
                      value={newAgendaTime}
                      onChange={(e) => setNewAgendaTime(e.target.value)}
                      placeholder="05:30 - 06:45 WITA"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Penceramah / Ustadz / Pembina:</label>
                    <input
                      type="text"
                      value={newAgendaSpeaker}
                      onChange={(e) => setNewAgendaSpeaker(e.target.value)}
                      placeholder="Contoh: Ust. Slamet"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">Deskripsi Singkat:</label>
                    <input
                      type="text"
                      value={newAgendaDesc}
                      onChange={(e) => setNewAgendaDesc(e.target.value)}
                      placeholder="Pembahasan tafsir tematik dan sarapan bersama jemaah"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambahkan ke Jadwal</span>
                  </button>
                </div>
              </form>

              {/* Daftar Kegiatan Saat Ini */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Daftar Kegiatan Aktif ({agendaList.length})
                </h4>

                <div className="space-y-2">
                  {agendaList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-stone-950/50 border border-stone-800 p-3 sm:p-4 rounded-xl flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{item.title}</span>
                          <span className="text-[10px] text-amber-300 px-2 py-0.5 bg-amber-950/80 border border-amber-800/80 rounded-full">
                            {item.dayOrDate}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1 leading-snug">
                          {item.time} · Penceramah: <strong className="text-stone-300">{item.speakerOrOfficer}</strong>
                        </p>
                        {item.description && (
                          <p className="text-[11px] text-stone-500 mt-0.5">{item.description}</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteAgenda(item.id)}
                        className="p-1.5 text-stone-500 hover:text-rose-400 hover:bg-stone-900 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE SHEETS API & SINKRONISASI */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="border-b border-stone-800 pb-3">
                <h3 className="text-base font-bold text-white">Integrasi Google Sheets & Sinkronisasi Real-Time Netlify</h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Seluruh data website (Artikel, Fasilitas Rest Area, Jadwal Jum'at, TPQ, Agenda, Rekening & Kas) terhubung ke Google Sheets pengurus tanpa batasan kuota.
                </p>
              </div>

              {/* Panduan Netlify & Real-Time Sync */}
              <div className="bg-stone-900/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Panduan Netlify: Kenapa Data Otomatis Tersimpan Tanpa Gonta-Ganti HTML?</span>
                </div>
                <div className="space-y-2 text-xs text-stone-300 leading-relaxed">
                  <p>
                    <strong className="text-white">1. Website Bekerja Secara Dinamis (SPA):</strong> Saat Anda mengupload website ke Netlify, file HTML/JS bertindak sebagai bingkai pintar. Konten tidak terkunci di dalam file HTML statis, melainkan otomatis ditarik dari Google Sheets pengurus.
                  </p>
                  <p>
                    <strong className="text-white">2. Real-Time Saat Admin Mengedit:</strong> Setiap kali admin menerbitkan artikel, mengubah fasilitas musafir, memperbarui jadwal Jum'at, atau mencatat kas di Portal Admin, website otomatis mengirim perubahan ke Google Spreadsheet Anda via Google Apps Script.
                  </p>
                  <p>
                    <strong className="text-white">3. Tidak Perlu Re-Upload ke Netlify:</strong> Siapa pun yang membuka website Anda di Netlify akan otomatis membaca data artikel dan fasilitas terbaru secara langsung. Anda <span className="text-amber-300 font-semibold">TIDAK PERLU mengedit kode HTML atau mengupload ulang file ke Netlify</span> setiap kali ada pembaruan!
                  </p>
                  <p>
                    <strong className="text-white">4. Kunci Pengaturan:</strong> Cukup salin kode <em>Google Apps Script</em> terbaru di bawah ke Google Sheets Anda, lalu klik <strong>Deploy &gt; New deployment &gt; Web app (Who has access: Anyone)</strong> dan tempelkan URL-nya ke kolom di bawah.
                  </p>
                </div>
              </div>

              {/* URL Web App */}
              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <label className="block text-xs font-semibold text-stone-200">
                  URL Google Apps Script Web App (Database Real-Time):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={sheetsUrl}
                    onChange={(e) => setSheetsUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono break-all"
                  />
                  <button
                    onClick={handleSaveSheetsUrl}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Simpan URL
                  </button>
                  <button
                    onClick={handleTestSheets}
                    disabled={isTestingSheet}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-xl border border-stone-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingSheet ? 'animate-spin' : ''}`} />
                    <span>Uji Koneksi</span>
                  </button>
                </div>

                {sheetTestResult && (
                  <div className="p-3 bg-stone-900 border border-stone-700 rounded-xl text-xs font-medium text-stone-200">
                    {sheetTestResult}
                  </div>
                )}
              </div>

              {/* Copy Full Apps Script Code */}
              <div className="bg-stone-950/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Kode Google Apps Script (Siap Pakai)
                  </h4>
                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Tersalin!' : 'Salin Kode Script'}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  Pasang skrip ini di menu <strong>Extensions &gt; Apps Script</strong> pada Google Sheets Anda, lalu klik <strong>Deploy &gt; New deployment &gt; Web app (Who has access: Anyone)</strong>.
                </p>

                <div className="relative">
                  <pre className="max-h-56 overflow-auto p-3 bg-stone-950 rounded-xl text-[11px] font-mono text-emerald-300 border border-stone-800">
                    {COMPLETE_GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: KEAMANAN & GANTI PASSWORD */}
          {activeTab === 'password' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="border-b border-stone-800 pb-3 text-center sm:text-left">
                <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Keamanan & Ganti Password Admin</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Ubah password masuk portal admin untuk menjaga keamanan pengelolaan website masjid.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Password Saat Ini:
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan password lama..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Password Baru:
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Ulangi Password Baru:
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang password baru..."
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>

                {passMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      passMessage.isError
                        ? 'bg-rose-950/60 border border-rose-800/80 text-rose-300'
                        : 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                    }`}
                  >
                    {passMessage.text}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Simpan Password Baru
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-stone-400 hover:text-stone-200 text-xs underline cursor-pointer"
                  >
                    Reset ke password default awal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Footer Ribbon */}
        <div className="px-4 sm:px-6 py-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Tersinkronisasi Realtime dengan Google Sheets</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            Keluar dari Portal
          </button>
        </div>
      </div>
    </div>
  );
};
