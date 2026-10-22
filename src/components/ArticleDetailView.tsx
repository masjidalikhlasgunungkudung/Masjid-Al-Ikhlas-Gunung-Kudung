import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Copy,
  Check,
  BookOpen,
  ChevronRight,
  Eye,
  Maximize2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { ArticleItem } from '../types/masjid';
import { formatDriveImageUrl } from '../services/googleSheetsService';
import { MASJID_INFO } from '../data/masjidData';

interface ArticleDetailViewProps {
  article: ArticleItem;
  allArticles: ArticleItem[];
  onBack: () => void;
  onSelectArticle: (article: ArticleItem) => void;
  onNotify?: (msg: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  allArticles,
  onBack,
  onSelectArticle,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Scroll to top whenever this article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Other related articles (excluding the active one)
  const otherArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  // Estimate reading time (approx 200 words per minute)
  const wordCount = (article.content || article.excerpt).split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  const handleShareWa = () => {
    const text = `*${article.title}*\n\n${article.excerpt}\n\nBaca artikel selengkapnya di Website Resmi ${MASJID_INFO.name}:\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    if (onNotify) {
      onNotify('Membuka WhatsApp untuk membagikan artikel...');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    if (onNotify) {
      onNotify('Tautan artikel berhasil disalin ke clipboard');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const primaryImgUrl =
    formatDriveImageUrl(article.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg';

  // Format paragraphs nicely
  const paragraphs = article.content
    ? article.content.split('\n\n').filter((p) => p.trim().length > 0)
    : [article.excerpt];

  return (
    <article className="min-h-screen py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Top Istiqlal-style Breadcrumbs & Return Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/80 rounded-xl transition-all cursor-pointer shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </button>

          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
            <button onClick={onBack} className="hover:text-stone-200 transition-colors cursor-pointer">
              Beranda
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-amber-400 font-medium">Artikel & Warta</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-stone-300 max-w-[200px] truncate">{article.category}</span>
          </nav>
        </div>
      </div>

      {/* Main Editorial Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Article Meta Header */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700/60 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1.5 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{readingTime} menit baca</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight">
            {article.title}
          </h1>

          {/* Author, Date, and Social Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-4 border-y border-stone-800/80 text-xs sm:text-sm text-stone-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-900/80 border border-emerald-600/50 flex items-center justify-center text-emerald-300 font-bold text-sm shrink-0">
                {article.author ? article.author.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span>{article.author || 'DKM Masjid Al-Ikhlas'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-stone-400 text-xs flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{article.date}</span>
                  </span>
                  <span>·</span>
                  <span>Kutai Timur</span>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={handleShareWa}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                title="Bagikan ke WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-850 border border-stone-800 rounded-xl transition-all cursor-pointer active:scale-95"
                title="Salin Tautan"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image - Grand Editorial Presentation */}
        <div className="relative mb-8 rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-950 border border-stone-800/90 shadow-2xl group">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img
              src={primaryImgUrl}
              alt={article.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Click to expand image */}
            <button
              onClick={() => setZoomedImage(primaryImgUrl)}
              className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-stone-950/80 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all opacity-90 hover:opacity-100 cursor-pointer shadow-lg"
              title="Perbesar Foto"
              aria-label="Perbesar Foto"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 sm:p-4 bg-stone-950/90 border-t border-stone-800/80 text-xs text-stone-400 flex items-center justify-between">
            <span className="italic">Dokumentasi resmi Masjid Al-Ikhlas Gunung Kudung KM 145</span>
            <span className="text-[11px] text-emerald-400">Liputan Terverifikasi</span>
          </div>
        </div>

        {/* Article Excerpt Callout (Lead Paragraph) */}
        {article.excerpt && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900/60 to-stone-900/40 border-l-4 border-amber-400 text-stone-200 text-base sm:text-lg font-medium leading-relaxed italic">
            "{article.excerpt}"
          </div>
        )}

        {/* Article Body Content */}
        <div className="space-y-6 text-stone-200 text-base sm:text-lg leading-relaxed sm:leading-loose">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="tracking-normal text-stone-300">
              {p}
            </p>
          ))}
        </div>

        {/* Additional Images Gallery (If Article has multiple photos) */}
        {article.additionalImages && article.additionalImages.length > 0 && (
          <div className="mt-10 pt-8 border-t border-stone-800/80">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-lg font-bold text-white">Galeri Foto Dokumentasi</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {article.additionalImages.map((img, i) => {
                const formatted = formatDriveImageUrl(img) || img;
                return (
                  <div
                    key={i}
                    onClick={() => setZoomedImage(formatted)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-md"
                  >
                    <img
                      src={formatted}
                      alt={`${article.title} - Foto ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Author / Editorial Signature Box */}
        <div className="mt-12 p-6 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-2xl text-emerald-300 shrink-0 shadow-inner">
            🕌
          </div>
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-0.5">
              Redaksi & Publikasi Resmi
            </div>
            <div className="text-base font-bold text-white">
              DKM Masjid Al-Ikhlas Gunung Kudung KM 145
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Dikelola oleh Bidang Dakwah & Informasi DKM Masjid Al-Ikhlas bersama TPQ Al-Muhajirin. Melayani umat dan musafir di Jalan Poros Bengalon - Muara Wahau KM 145, Kutai Timur.
            </p>
          </div>
        </div>

        {/* Floating Share & Bottom Action Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-stone-800">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-300 hover:text-white bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-stone-400 hidden sm:inline">Bagikan artikel ini:</span>
            <button
              onClick={handleShareWa}
              className="px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan WhatsApp</span>
            </button>
          </div>
        </div>

        {/* SECTION: ARTIKEL LAINNYA (Persis seperti di website Istiqlal) */}
        {otherArticles.length > 0 && (
          <section className="mt-14 pt-8 border-t border-stone-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Kabar Terkait & Warta Masjid
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Pilihan Artikel Lainnya
                </h2>
              </div>
              <button
                onClick={onBack}
                className="text-xs sm:text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 3-Column Istiqlal-style Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherArticles.map((item) => {
                const itemImg =
                  formatDriveImageUrl(item.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectArticle(item)}
                    className="bg-stone-900/70 hover:bg-stone-850/90 border border-stone-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                        <img
                          src={itemImg}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/70 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-stone-400">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{item.date}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                        <span>Baca Artikel</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox / Zoomed image modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 right-0 p-2 text-stone-300 hover:text-white rounded-xl bg-stone-900 border border-stone-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed document"
              className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain border border-stone-800 shadow-2xl"
            />
          </div>
        </div>
      )}
    </article>
  );
};
