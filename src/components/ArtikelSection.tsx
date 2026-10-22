import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Share2,
  X,
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { ArticleItem, ArticleLayoutTemplate } from '../types/masjid';
import { fetchArticlesFromSheets, formatDriveImageUrl, MASJID_DATA_UPDATED_EVENT } from '../services/googleSheetsService';
import { DEFAULT_ARTICLES, MASJID_INFO } from '../data/masjidData';

interface ArtikelSectionProps {
  onNotify?: (msg: string) => void;
  onOpenAdminPortal?: () => void;
}

export const ArtikelSection: React.FC<ArtikelSectionProps> = ({ onNotify, onOpenAdminPortal }) => {
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const loadArticles = async () => {
    try {
      const data = await fetchArticlesFromSheets();
      if (data && data.length > 0) {
        setArticles(data);
      }
    } catch {
      // fallback to DEFAULT_ARTICLES
    }
  };

  useEffect(() => {
    loadArticles();
    const handleUpdate = () => loadArticles();
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
  }, []);

  const categories = ['Semua', 'Kabar Masjid', 'Kegiatan TPQ', 'Info Musafir', 'Kajian & Fiqih', 'Pembangunan & Kas'];

  const filteredArticles = activeCategory === 'Semua'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay || filteredArticles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredArticles.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredArticles.length]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? filteredArticles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % filteredArticles.length);
  };

  const handleShareWa = (article: ArticleItem) => {
    const text = `*${article.title}*\n_${article.date} | Oleh: ${article.author}_\n\n${article.excerpt}\n\nBaca artikel selengkapnya di Website Resmi Masjid Al-Ikhlas Gunung Kudung KM 145:\n${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    if (onNotify) {
      onNotify('Membuka WhatsApp untuk membagikan artikel...');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Info Musafir':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Kegiatan TPQ':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Pembangunan & Kas':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Kajian & Fiqih':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  const getTemplateBadge = (tpl: ArticleLayoutTemplate) => {
    switch (tpl) {
      case 'banner_top':
        return 'Foto Banner Atas';
      case 'photo_left':
        return 'Editorial Kiri';
      case 'photo_right':
        return 'Editorial Kanan';
      case 'gallery_grid':
        return 'Galeri Foto';
      default:
        return 'Standar';
    }
  };

  return (
    <section id="artikel" className="py-12 sm:py-16 border-b border-stone-800/60">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">Kabar & Publikasi Dakwah</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">Warta Masjid Al-Ikhlas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Newspaper className="w-7 h-7 text-emerald-400 shrink-0" />
            <span>Artikel, Kegiatan & Berita Masjid</span>
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Informasi dokumentasi kegiatan ibadah, perkembangan santri TPQ, fasilitas rest area musafir, dan warta kebaikan di Gunung Kudung KM 145.
          </p>
        </div>

        {/* Carousel Controls & Admin Portal Action */}
        <div className="flex items-center gap-3">
          {onOpenAdminPortal && (
            <button
              onClick={onOpenAdminPortal}
              className="px-3.5 py-1.5 text-xs font-medium text-amber-300 hover:text-stone-950 bg-stone-900 hover:bg-amber-400 border border-amber-400/30 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Tulis artikel baru di Portal Admin"
            >
              <span>+ Tulis Artikel</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-xl p-1">
            <button
              onClick={handlePrev}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Artikel Sebelumnya"
              aria-label="Artikel Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-stone-400 px-1">
              {filteredArticles.length > 0 ? `${currentIndex + 1}/${filteredArticles.length}` : '0/0'}
            </span>
            <button
              onClick={handleNext}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Artikel Selanjutnya"
              aria-label="Artikel Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900/90 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured / Carousel Highlight */}
      {filteredArticles.length === 0 ? (
        <div className="p-8 text-center bg-stone-900/40 rounded-2xl border border-stone-800 text-stone-400 text-sm">
          Belum ada artikel pada kategori <strong>{activeCategory}</strong>.
        </div>
      ) : (
        <div
          className="relative bg-stone-900/70 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl transition-all"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Active Featured Slide */}
          {(() => {
            const article = filteredArticles[currentIndex] || filteredArticles[0];
            const imgSrc = formatDriveImageUrl(article.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg';

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
                {/* Visual Image Banner with Template Accent */}
                <div className="lg:col-span-7 relative overflow-hidden bg-stone-950 min-h-[260px] lg:min-h-full group">
                  <img
                    src={imgSrc}
                    alt={article.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-stone-950/40 lg:to-stone-950" />

                  {/* Template indicator badge on image */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border backdrop-blur-md ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-black/60 text-stone-300 rounded-md backdrop-blur-md border border-white/10">
                      Tata Letak: {getTemplateBadge(article.layoutTemplate)}
                    </span>
                  </div>

                  {article.additionalImages && article.additionalImages.length > 0 && (
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-[11px] text-stone-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{article.additionalImages.length} Foto Dokumentasi</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{article.author}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug line-clamp-3 hover:text-amber-300 transition-colors cursor-pointer"
                      onClick={() => setSelectedArticle(article)}
                    >
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Baca Selengkapnya</span>
                    </button>

                    <button
                      onClick={() => handleShareWa(article)}
                      className="p-2.5 text-stone-400 hover:text-emerald-400 hover:bg-stone-800 rounded-xl border border-stone-800 transition-colors cursor-pointer"
                      title="Bagikan ke WhatsApp"
                      aria-label="Bagikan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Dots Indicator */}
          {filteredArticles.length > 1 && (
            <div className="px-6 py-3 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {filteredArticles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="text-[11px] text-stone-400 flex items-center gap-2">
                <span>{isAutoPlay ? 'Auto-Slide Aktif' : 'Slide Manual'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid Thumbnail Preview of Other Articles */}
      {filteredArticles.length > 1 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((art, idx) => (
            <div
              key={art.id}
              onClick={() => {
                setCurrentIndex(idx);
                setSelectedArticle(art);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3.5 group ${
                currentIndex === idx
                  ? 'bg-stone-900/90 border-amber-400/50 shadow-lg'
                  : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/50'
              }`}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                <img
                  src={formatDriveImageUrl(art.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1">
                    <span className="text-amber-400 truncate">{art.category}</span>
                    <span>·</span>
                    <span className="truncate">{art.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-400 pt-1 font-medium">
                  <span>Lihat Artikel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* READING MODAL (Full Article with Chosen Layout Template) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Top Bar */}
            <div className="px-5 py-3.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${getCategoryColor(selectedArticle.category)}`}>
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-stone-400 truncate">
                  {selectedArticle.date} · Oleh {selectedArticle.author}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWa(selectedArticle)}
                  className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bagikan</span>
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Render according to layoutTemplate */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              {/* TEMPLATE 1: BANNER TOP */}
              {selectedArticle.layoutTemplate === 'banner_top' && (
                <div className="space-y-6">
                  {/* Big Banner Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-stone-800 max-h-[380px] w-full bg-stone-950 group">
                    <img
                      src={formatDriveImageUrl(selectedArticle.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover max-h-[380px]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                      }}
                    />
                    <button
                      onClick={() => setZoomedImage(formatDriveImageUrl(selectedArticle.primaryImage))}
                      className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm border border-white/20 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-2 border-b border-stone-800 pb-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {selectedArticle.title}
                    </h2>
                    <div className="text-xs text-emerald-400 flex items-center gap-2">
                      <span>Dipublikasikan: {selectedArticle.date}</span>
                      <span>·</span>
                      <span>Penulis: {selectedArticle.author}</span>
                      <span>·</span>
                      <span>Masjid Al-Ikhlas KM 145</span>
                    </div>
                  </div>

                  {/* Article Prose Content */}
                  <div className="prose prose-invert max-w-none text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
                    {selectedArticle.content}
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: PHOTO LEFT (EDITORIAL) */}
              {selectedArticle.layoutTemplate === 'photo_left' && (
                <div className="space-y-6">
                  <div className="space-y-2 border-b border-stone-800 pb-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {selectedArticle.title}
                    </h2>
                    <div className="text-xs text-emerald-400 flex items-center gap-2">
                      <span>{selectedArticle.date}</span>
                      <span>·</span>
                      <span>{selectedArticle.author}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-5 space-y-3">
                      <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-lg">
                        <img
                          src={formatDriveImageUrl(selectedArticle.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                          alt={selectedArticle.title}
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                          }}
                        />
                      </div>
                      <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 text-[11px] text-stone-400 italic text-center">
                        Dokumentasi: {selectedArticle.title}
                      </div>
                    </div>

                    <div className="md:col-span-7 text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                      {selectedArticle.content}
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 3: PHOTO RIGHT */}
              {selectedArticle.layoutTemplate === 'photo_right' && (
                <div className="space-y-6">
                  <div className="space-y-2 border-b border-stone-800 pb-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {selectedArticle.title}
                    </h2>
                    <div className="text-xs text-emerald-400 flex items-center gap-2">
                      <span>{selectedArticle.date}</span>
                      <span>·</span>
                      <span>{selectedArticle.author}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-7 text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 order-2 md:order-1">
                      {selectedArticle.content}
                    </div>

                    <div className="md:col-span-5 space-y-3 order-1 md:order-2">
                      <div className="rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-lg">
                        <img
                          src={formatDriveImageUrl(selectedArticle.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                          alt={selectedArticle.title}
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                          }}
                        />
                      </div>
                      <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800 text-[11px] text-stone-400 italic text-center">
                        Dokumentasi: {selectedArticle.title}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TEMPLATE 4: GALLERY GRID */}
              {selectedArticle.layoutTemplate === 'gallery_grid' && (
                <div className="space-y-6">
                  <div className="space-y-2 border-b border-stone-800 pb-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {selectedArticle.title}
                    </h2>
                    <div className="text-xs text-emerald-400 flex items-center gap-2">
                      <span>{selectedArticle.date}</span>
                      <span>·</span>
                      <span>{selectedArticle.author}</span>
                      <span>·</span>
                      <span>Format: Galeri Dokumentasi Foto</span>
                    </div>
                  </div>

                  {/* Multi-Photo Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 rounded-2xl overflow-hidden border border-stone-800 max-h-[300px] bg-stone-950 group relative">
                      <img
                        src={formatDriveImageUrl(selectedArticle.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                        alt={selectedArticle.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                        }}
                      />
                      <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white">Foto Utama</span>
                    </div>

                    {selectedArticle.additionalImages && selectedArticle.additionalImages.map((img, idx) => (
                      <div key={idx} className="rounded-2xl overflow-hidden border border-stone-800 h-[145px] sm:h-auto bg-stone-950 group relative">
                        <img
                          src={formatDriveImageUrl(img) || '/images/interior_sholat_utama_1791948463767.jpg'}
                          alt={`Dokumentasi ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => setZoomedImage(formatDriveImageUrl(img))}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4" />
                          <span>Perbesar</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Content below gallery */}
                  <div className="text-stone-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 pt-2">
                    {selectedArticle.content}
                  </div>
                </div>
              )}

              {/* Additional Photos in other templates if any */}
              {selectedArticle.layoutTemplate !== 'gallery_grid' && selectedArticle.additionalImages && selectedArticle.additionalImages.length > 0 && (
                <div className="pt-6 border-t border-stone-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Foto Dokumentasi Tambahan:</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedArticle.additionalImages.map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-stone-800 h-32 bg-stone-950 relative group">
                        <img
                          src={formatDriveImageUrl(img)}
                          alt={`Dokumentasi ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => setZoomedImage(formatDriveImageUrl(img))}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-1 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400 shrink-0">
              <div className="flex items-center gap-2">
                <span>Diterbitkan resmi oleh <strong>{MASJID_INFO.name}</strong></span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-full sm:w-auto px-5 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl transition-colors cursor-pointer text-center font-medium"
              >
                Tutup Jendela Baca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-pointer animate-in fade-in duration-150"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain mx-auto shadow-2xl border border-stone-700"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 bg-stone-900/90 text-white rounded-full hover:bg-stone-800 border border-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
