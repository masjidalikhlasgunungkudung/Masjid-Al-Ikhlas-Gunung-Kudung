import React, { useEffect, useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { TPQSection } from './components/TPQSection';
import { MusafirSection } from './components/MusafirSection';
import { AgendaSection } from './components/AgendaSection';
import { DonasiKasSection } from './components/DonasiKasSection';
import { BukuTamuSection } from './components/BukuTamuSection';
import { LokasiSection } from './components/LokasiSection';
import { StatistikSection } from './components/StatistikSection';
import { ArtikelSection } from './components/ArtikelSection';
import { Footer } from './components/Footer';
import { MonthlyScheduleModal } from './components/MonthlyScheduleModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { Toast } from './components/Toast';
import {
  FALLBACK_PRAYER_TIMES,
  calculateNextPrayer,
  fetchLivePrayerTimes,
} from './services/prayerTimeService';
import { NextPrayerInfo, PrayerTimes } from './types/masjid';

export default function App() {
  const [timings, setTimings] = useState<PrayerTimes>(FALLBACK_PRAYER_TIMES);
  const [dateMasehi, setDateMasehi] = useState<string>('');
  const [dateHijri, setDateHijri] = useState<string>('');
  const [currentPrayer, setCurrentPrayer] = useState<string>('Dzuhur');
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo>({
    name: 'Ashar',
    time: '15:18',
    remainingText: '00:00:00',
    secondsRemaining: 0,
  });
  const [isLoadingPrayer, setIsLoadingPrayer] = useState<boolean>(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState<boolean>(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const loadPrayers = useCallback(async () => {
    setIsLoadingPrayer(true);
    try {
      const data = await fetchLivePrayerTimes();
      setTimings(data.timings);
      setDateMasehi(data.dateMasehi);
      setDateHijri(data.dateHijri);

      const calculated = calculateNextPrayer(data.timings);
      setCurrentPrayer(calculated.currentPrayer);
      setNextPrayer(calculated.nextPrayer);
    } catch {
      // Fallback already handled
    } finally {
      setIsLoadingPrayer(false);
    }
  }, []);

  useEffect(() => {
    loadPrayers();
  }, [loadPrayers]);

  // Periodic calculation for smooth real-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const calculated = calculateNextPrayer(timings);
      setCurrentPrayer(calculated.currentPrayer);
      setNextPrayer(calculated.nextPrayer);
    }, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  const [activeTab, setActiveTab] = useState<'all' | 'artikel' | 'layanan' | 'agenda' | 'donasi' | 'lokasi'>('all');
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Monitor scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigateSection = useCallback((sectionId: string) => {
    if (['artikel'].includes(sectionId)) {
      if (activeTab !== 'all' && activeTab !== 'artikel') {
        setActiveTab('artikel');
      }
    } else if (['tpq', 'musafir'].includes(sectionId)) {
      if (activeTab !== 'all' && activeTab !== 'layanan') {
        setActiveTab('layanan');
      }
    } else if (['agenda'].includes(sectionId)) {
      if (activeTab !== 'all' && activeTab !== 'agenda') {
        setActiveTab('agenda');
      }
    } else if (['donasi'].includes(sectionId)) {
      if (activeTab !== 'all' && activeTab !== 'donasi') {
        setActiveTab('donasi');
      }
    } else if (['lokasi', 'buku-tamu', 'statistik'].includes(sectionId)) {
      if (activeTab !== 'all' && activeTab !== 'lokasi') {
        setActiveTab('lokasi');
      }
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  }, [activeTab]);

  // Global anchor listener for all internal hash links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const id = href.replace('#', '');
        if (id) {
          e.preventDefault();
          handleNavigateSection(id);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [handleNavigateSection]);

  const scrollToDonasi = () => {
    handleNavigateSection('donasi');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 islamic-bg-pattern flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950">
      <Navbar
        onOpenDonasi={scrollToDonasi}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Cinematic Hero */}
        <Hero
          dateMasehi={dateMasehi}
          dateHijri={dateHijri}
          nextPrayer={nextPrayer}
          onOpenDonasi={scrollToDonasi}
        />

        {/* Real-time Prayer Times & Adzan */}
        <PrayerTimesSection
          timings={timings}
          currentPrayer={currentPrayer}
          nextPrayer={nextPrayer}
          dateMasehi={dateMasehi}
          dateHijri={dateHijri}
          onOpenMonthly={() => setIsMonthlyModalOpen(true)}
          onRefresh={loadPrayers}
          isLoading={isLoadingPrayer}
        />

        {/* Dynamic Executive Hub Navigation (Pilihan A: Tampilan Dinamis & Rapi) */}
        <section id="kategori-hub" className="pt-8 pb-4 scroll-mt-20">
          <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800/90 rounded-2xl p-4 sm:p-6 shadow-xl">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  <span>Pusat Layanan & Informasi Dinamis</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Pilih Kategori Informasi
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                  Klik menu di bawah untuk fokus pada informasi yang Anda butuhkan, atau pilih Semua Layanan untuk melihat seluruh halaman.
                </p>
              </div>

              {activeTab !== 'all' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-3.5 py-1.5 text-xs font-medium bg-stone-800/90 hover:bg-stone-750 text-stone-300 hover:text-white rounded-lg border border-stone-700/80 transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer"
                >
                  <span>🏛️ Tampilkan Semua Halaman</span>
                </button>
              )}
            </div>

            {/* Segmented Tab Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850/60'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">🏛️</span>
                <span className="text-xs sm:text-sm font-bold truncate">Semua Layanan</span>
                <span className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'all' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  Tampilan Utuh
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('artikel')}
                className={`flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'artikel'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850/60'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">📰</span>
                <span className="text-xs sm:text-sm font-bold truncate">Kabar & Artikel</span>
                <span className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'artikel' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  Carousel Warta
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('layanan')}
                className={`flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'layanan'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850/60'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">🕌</span>
                <span className="text-xs sm:text-sm font-bold truncate">Rest Area & TPQ</span>
                <span className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'layanan' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  24 Jam & Santri
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('agenda')}
                className={`flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'agenda'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850/60'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">📅</span>
                <span className="text-xs sm:text-sm font-bold truncate">Agenda & Kajian</span>
                <span className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'agenda' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  Jum'at & Rutin
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('donasi')}
                className={`flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'donasi'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850/60'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">💚</span>
                <span className="text-xs sm:text-sm font-bold truncate">Kas & Infaq</span>
                <span className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'donasi' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  QRIS & BRI
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('lokasi')}
                className={`flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeTab === 'lokasi'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/40'
                    : 'bg-stone-950/60 border-stone-800/90 text-stone-400 hover:text-stone-200 hover:bg-stone-850/60'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">📍</span>
                <span className="text-xs sm:text-sm font-bold truncate">Lokasi & Tamu</span>
                <span className={`text-[10px] mt-0.5 px-2 py-0.5 rounded-full font-medium ${
                  activeTab === 'lokasi' ? 'bg-emerald-800/80 text-emerald-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  GPS & Statistik
                </span>
              </button>
            </div>

            {/* Quick Context Banner */}
            <div className="mt-4 pt-3.5 border-t border-stone-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-medium">
                  {activeTab === 'all' && '✨ Menampilkan seluruh layanan, artikel warta, dan informasi masjid secara berurutan.'}
                  {activeTab === 'artikel' && '📰 Fokus Artikel: Dokumentasi Berita Kegiatan, Santri TPQ & Rest Area dengan Tampilan Carousel Inspiratif.'}
                  {activeTab === 'layanan' && '🕌 Fokus Layanan: Fasilitas Musafir 24 Jam dan Pembinaan TPQ Al-Muhajirin.'}
                  {activeTab === 'agenda' && '📅 Fokus Agenda: Jadwal Khutbah Sholat Jum\'at dan Kajian Islam Rutin.'}
                  {activeTab === 'donasi' && '💚 Fokus Infaq: Laporan Transparansi Kas, Rekening Bank BRI & QRIS Resmi.'}
                  {activeTab === 'lokasi' && '📍 Fokus Lokasi: Peta Jalur Trans-Kalimantan, Buku Tamu Musafir & Statistik.'}
                </span>
              </div>
              <div className="text-[11px] text-stone-400">
                Poros Bengalon - Wahau KM 145 · Kutai Timur
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Sections Render based on activeTab */}
        <div className="transition-all duration-300 space-y-2">
          {/* Artikel & Berita Carousel Category */}
          {(activeTab === 'all' || activeTab === 'artikel') && (
            <div className="animate-fadeIn">
              <ArtikelSection
                onNotify={showNotification}
                onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
              />
            </div>
          )}

          {/* Layanan & Musafir Category (TPQ & Rest Area) */}
          {(activeTab === 'all' || activeTab === 'layanan') && (
            <div className="space-y-2 animate-fadeIn">
              <TPQSection onNotify={showNotification} />
              <MusafirSection onOpenAdminPortal={() => setIsAdminPortalOpen(true)} />
            </div>
          )}

          {/* Agenda & Kajian Category */}
          {(activeTab === 'all' || activeTab === 'agenda') && (
            <div className="animate-fadeIn">
              <AgendaSection />
            </div>
          )}

          {/* Donasi & Kas Keuangan Category */}
          {(activeTab === 'all' || activeTab === 'donasi') && (
            <div className="animate-fadeIn">
              <DonasiKasSection onNotify={showNotification} />
            </div>
          )}

          {/* Lokasi, Buku Tamu & Statistik Category */}
          {(activeTab === 'all' || activeTab === 'lokasi') && (
            <div className="space-y-2 animate-fadeIn">
              <BukuTamuSection onNotify={showNotification} />
              <LokasiSection onNotify={showNotification} />
              <StatistikSection />
            </div>
          )}
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-stone-900/90 hover:bg-emerald-900 text-stone-200 hover:text-white border border-stone-700 hover:border-emerald-500 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
          title="Kembali ke atas halaman"
          aria-label="Kembali ke atas"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold px-1">
            <span className="text-emerald-400 text-sm">↑</span>
            <span className="hidden sm:inline text-[11px] text-stone-300 group-hover:text-white">Ke Atas</span>
          </div>
        </button>
      )}

      <Footer
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* Monthly Prayer Schedule Modal */}
      <MonthlyScheduleModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
      />

      {/* Admin Portal Modal (Protected with Admin Password) */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        onNotify={showNotification}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
