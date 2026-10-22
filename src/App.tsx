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
import { ArticleDetailView } from './components/ArticleDetailView';
import { Footer } from './components/Footer';
import { MonthlyScheduleModal } from './components/MonthlyScheduleModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { Toast } from './components/Toast';
import {
  FALLBACK_PRAYER_TIMES,
  calculateNextPrayer,
  fetchLivePrayerTimes,
} from './services/prayerTimeService';
import { fetchArticlesFromSheets, MASJID_DATA_UPDATED_EVENT } from './services/googleSheetsService';
import { DEFAULT_ARTICLES, MASJID_INFO } from './data/masjidData';
import { ArticleItem, NextPrayerInfo, PrayerTimes } from './types/masjid';
import { ArrowUp } from 'lucide-react';

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

  // Articles state and full-page reading mode (Istiqlal style)
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const showNotification = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Fetch articles
  const loadArticles = useCallback(async () => {
    try {
      const data = await fetchArticlesFromSheets();
      if (data && data.length > 0) {
        setArticles(data);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    loadArticles();
    const handleUpdate = () => loadArticles();
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
  }, [loadArticles]);

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

  // Monitor scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handler
  const handleNavigateSection = useCallback((sectionId: string) => {
    // If currently viewing article detail, go back to home view first
    if (selectedArticle) {
      setSelectedArticle(null);
    }

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 80);
  }, [selectedArticle]);

  // Global anchor listener for internal links
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

  // Handle article selection (switch to full-page view & scroll top)
  const handleSelectArticle = (art: ArticleItem) => {
    setSelectedArticle(art);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {selectedArticle ? (
          /* FULL-PAGE ARTICLE READING VIEW (Persis Seperti Website Istiqlal) */
          <ArticleDetailView
            article={selectedArticle}
            allArticles={articles}
            onBack={handleBackToHome}
            onSelectArticle={handleSelectArticle}
            onNotify={showNotification}
          />
        ) : (
          /* HOMEPAGE VIEW: Clean, Majestic, Spacious & Uncluttered Flow (Istiqlal Style) */
          <div className="space-y-4 sm:space-y-6">
            {/* 1. Cinematic Hero */}
            <Hero
              dateMasehi={dateMasehi}
              dateHijri={dateHijri}
              nextPrayer={nextPrayer}
              onOpenDonasi={scrollToDonasi}
            />

            {/* 2. Real-time Prayer Times & Adzan */}
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

            {/* 3. Warta & Berita Masjid (ArtikelSection with Full-Page Transition) */}
            <ArtikelSection
              articles={articles}
              onSelectArticle={handleSelectArticle}
              onNotify={showNotification}
              onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
            />

            {/* 4. Rest Area Musafir 24 Jam & Layanan */}
            <MusafirSection onOpenAdminPortal={() => setIsAdminPortalOpen(true)} />

            {/* 5. Pendidikan TPQ Al-Muhajirin */}
            <TPQSection onNotify={showNotification} />

            {/* 6. Agenda Khutbah & Kajian Islam Rutin */}
            <AgendaSection />

            {/* 7. Donasi & Kas Keuangan Transparan (QRIS & Bank BRI) */}
            <DonasiKasSection onNotify={showNotification} />

            {/* 8. Peta Lokasi GPS, Buku Tamu & Statistik */}
            <div className="space-y-6">
              <LokasiSection onNotify={showNotification} />
              <BukuTamuSection onNotify={showNotification} />
              <StatistikSection />
            </div>
          </div>
        )}
      </main>

      {/* Floating Back to Top Button: Positioned comfortably at bottom-20 sm:bottom-24 to avoid "Powered by Netlify" */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-5 sm:bottom-24 sm:right-8 z-50 p-3 sm:p-3.5 bg-stone-900/95 hover:bg-emerald-800 text-stone-200 hover:text-white border border-stone-700/80 hover:border-emerald-400 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group ring-2 ring-black/40"
          title="Kembali ke atas halaman"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="w-5 h-5 text-emerald-400 group-hover:text-amber-300 transition-colors" />
        </button>
      )}

      <Footer onOpenAdminPortal={() => setIsAdminPortalOpen(true)} />

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
