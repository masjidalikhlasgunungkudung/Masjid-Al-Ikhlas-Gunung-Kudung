import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Calendar,
  User,
  Share2,
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { ArticleItem } from '../types/masjid';
import { fetchArticlesFromSheets, formatDriveImageUrl, MASJID_DATA_UPDATED_EVENT } from '../services/googleSheetsService';
import { DEFAULT_ARTICLES, MASJID_INFO } from '../data/masjidData';

interface ArtikelSectionProps {
  onNotify?: (msg: string) => void;
  onOpenAdminPortal?: () => void;
  onSelectArticle: (article: ArticleItem) => void;
  articles?: ArticleItem[];
}

export const ArtikelSection: React.FC<ArtikelSectionProps> = ({
  onNotify,
  onOpenAdminPortal,
  onSelectArticle,
  articles: propArticles,
}) => {
  const [articles, setArticles] = useState<ArticleItem[]>(propArticles || DEFAULT_ARTICLES);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const loadArticles = async () => {
    try {
      const data = await fetchArticlesFromSheets();
      if (data && data.length > 0) {
        setArticles(data);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    if (propArticles && propArticles.length > 0) {
      setArticles(propArticles);
    } else {
      loadArticles();
    }
    const handleUpdate = () => loadArticles();
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
  }, [propArticles]);

  const categories = ['Semua', 'Kabar Masjid', 'Kegiatan TPQ', 'Info Musafir', 'Kajian & Fiqih', 'Pembangunan & Kas'];

  const filteredArticles = activeCategory === 'Semua'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const leadArticle = filteredArticles[0] || articles[0];
  const secondaryArticles = filteredArticles.slice(1);

  const handleShareWa = (e: React.MouseEvent, article: ArticleItem) => {
    e.stopPropagation();
    const text = `*${article.title}*\n_${article.date} | Oleh: ${article.author}_\n\n${article.excerpt}\n\nBaca artikel selengkapnya di Website Resmi ${MASJID_INFO.name}:\n${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    if (onNotify) {
      onNotify('Membuka WhatsApp untuk membagikan artikel...');
    }
  };

  return (
    <section id="artikel" className="py-14 sm:py-20 border-b border-stone-800/60">
      {/* Header Section - Clean & Dignified Istiqlal Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">Warta & Kabar Masjid</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">Publikasi Dakwah Resmi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <Newspaper className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
            <span>Artikel & Berita Masjid</span>
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Dokumentasi kegiatan ibadah, santri TPQ Al-Muhajirin, layanan musafir 24 jam, dan kajian Islam di Gunung Kudung KM 145.
          </p>
        </div>

        {/* Action button */}
        {onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="self-start md:self-end px-3.5 py-2 text-xs font-semibold text-amber-300 hover:text-stone-950 bg-stone-900 hover:bg-amber-400 border border-amber-400/30 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Tulis Artikel Baru</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills - Istiqlal minimalist style */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-900/90 text-white border border-emerald-500/60 font-bold shadow-md'
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800 hover:border-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* If No Articles */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center bg-stone-900/30 rounded-2xl border border-stone-800 text-stone-400 text-sm">
          Belum ada artikel pada kategori <strong>{activeCategory}</strong>.
        </div>
      ) : (
        <div className="space-y-6">
          {/* LEAD FEATURED ARTICLE (Headline Card - Istiqlal Style) */}
          {leadArticle && (
            <div
              onClick={() => onSelectArticle(leadArticle)}
              className="bg-stone-900/60 hover:bg-stone-850/80 border border-stone-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 shadow-xl group"
            >
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-stone-950">
                <img
                  src={formatDriveImageUrl(leadArticle.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg'}
                  alt={leadArticle.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-stone-950/80" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 backdrop-blur-md">
                    {leadArticle.category}
                  </span>
                </div>
                {leadArticle.additionalImages && leadArticle.additionalImages.length > 0 && (
                  <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-xs text-stone-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>+{leadArticle.additionalImages.length} Foto</span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{leadArticle.date}</span>
                    </span>
                    <span>·</span>
                    <span className="text-stone-400">{leadArticle.author}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {leadArticle.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed line-clamp-3">
                    {leadArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>

                  <button
                    onClick={(e) => handleShareWa(e, leadArticle)}
                    className="p-2 text-stone-400 hover:text-emerald-400 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
                    title="Bagikan ke WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY ARTICLES GRID (Clean 3-column cards) */}
          {secondaryArticles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {secondaryArticles.map((art) => {
                const img = formatDriveImageUrl(art.primaryImage) || '/images/hero_masjid_kudung_1791948462974.jpg';

                return (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="bg-stone-900/60 hover:bg-stone-850/80 border border-stone-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-1"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                        <img
                          src={img}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_masjid_kudung_1791948462974.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-black/70 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                            {art.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{art.date}</span>
                        </div>

                        <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h4>

                        <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Buka Artikel Penuh</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
