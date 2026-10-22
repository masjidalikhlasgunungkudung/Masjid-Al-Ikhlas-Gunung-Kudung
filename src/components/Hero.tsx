import React, { useEffect, useState } from 'react';
import { Clock, Navigation, Moon, HeartHandshake, BookOpen, MapPin, ShieldCheck } from 'lucide-react';
import { MASJID_INFO, TPQ_INFO } from '../data/masjidData';
import { NextPrayerInfo } from '../types/masjid';
import {
  fetchPengaturanFromSheets,
  formatDriveImageUrl,
  MASJID_DATA_UPDATED_EVENT,
} from '../services/googleSheetsService';

interface HeroProps {
  dateMasehi: string;
  dateHijri: string;
  nextPrayer: NextPrayerInfo;
  onOpenDonasi: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  dateMasehi,
  dateHijri,
  nextPrayer,
  onOpenDonasi,
}) => {
  const [witaTime, setWitaTime] = useState<string>('');
  const [heroImage, setHeroImage] = useState<string>('/images/hero_masjid_kudung_1791948462974.jpg');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setWitaTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadHeroImg = async () => {
      try {
        const p = await fetchPengaturanFromSheets();
        if (p && p.urlFotoHero) {
          setHeroImage(formatDriveImageUrl(p.urlFotoHero) || '/images/hero_masjid_kudung_1791948462974.jpg');
        }
      } catch {
        // fallback
      }
    };
    loadHeroImg();
    const handleUpdate = () => loadHeroImg();
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
  }, []);

  return (
    <section className="relative pt-4 sm:pt-6 pb-8 sm:pb-12">
      {/* Hero Visual Card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950">
        {/* Background Image with Responsive Height */}
        <div className="relative min-h-[520px] sm:min-h-[480px] lg:h-[540px] w-full flex flex-col justify-end">
          <img
            src={heroImage}
            alt="Masjid Al-Ikhlas Gunung Kudung KM 145 Bengalon"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('images/hero')) {
                target.src = '/images/hero_masjid_kudung_1791948462974.jpg';
              } else {
                target.src = '/src/assets/images/hero_masjid_kudung_1791948462974.jpg';
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center scale-100 transition-transform duration-700 hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-black/30" />
          <div className="absolute inset-0 bg-emerald-950/30 mix-blend-multiply" />

          {/* Hero Content with safe padding and responsive stacking */}
          <div className="relative z-10 flex flex-col justify-end p-5 sm:p-8 lg:p-12 max-w-4xl">
            {/* Arabic Bismillah */}
            <p className="font-arabic text-xl sm:text-3xl lg:text-4xl text-amber-300 drop-shadow-md mb-2 font-normal">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>

            {/* Regional Trust Marker */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-emerald-300 mb-2 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>KM 145 Poros Muara Wahau</span>
              </span>
              <span aria-hidden="true" className="text-emerald-500">·</span>
              <span>Desa Tepian Langsat, Bengalon</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 sm:mb-4 text-balance leading-tight">
              Masjid Al-Ikhlas Gunung Kudung
            </h1>

            {/* Sub-headline prose */}
            <p className="text-xs sm:text-base text-stone-200 leading-relaxed mb-4 sm:mb-6 max-w-2xl">
              Pusat peribadatan masyarakat, pembinaan generasi Al-Qur'an melalui <strong>TPQ Al-Muhajirin</strong>, dan rest area persinggahan aman 24 jam bagi para musafir lintas Kalimantan.
            </p>

            {/* Primary Action Buttons - Responsive wrap and touch-friendly */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
              <a
                href="#jadwal"
                className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-all text-center cursor-pointer active:scale-98"
              >
                Jadwal Sholat Hari Ini
              </a>
              <a
                href="#musafir"
                className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-stone-100 bg-stone-900/90 hover:bg-stone-800 border border-stone-700 rounded-xl transition-all text-center cursor-pointer active:scale-98"
              >
                Layanan Musafir 24 Jam
              </a>
              <a
                href={MASJID_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs sm:text-sm font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Navigation className="w-4 h-4 shrink-0" />
                <span>Buka GPS Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Operational Ribbon Strip below Hero visual - individual cards for zero mobile overlap */}
        <div className="bg-stone-900/95 border-t border-stone-800 p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-stone-300">
          {/* Card 1: Live Time WITA */}
          <div className="flex items-center gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/80">
            <div className="w-10 h-10 rounded-lg bg-stone-800/90 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400">Waktu Lokal (WITA)</div>
              <div className="text-base sm:text-lg font-bold text-white font-mono tabular-nums truncate">
                {witaTime || '12:00:00'} <span className="text-xs text-amber-400 font-normal">WITA</span>
              </div>
            </div>
          </div>

          {/* Card 2: Next Prayer Countdown */}
          <div className="flex items-center gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/80">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 truncate">
                Menuju {nextPrayer.name}
              </div>
              <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono tabular-nums truncate">
                {nextPrayer.remainingText}
              </div>
            </div>
          </div>

          {/* Card 3: Date & Hijri */}
          <div className="flex items-center gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/80">
            <div className="w-10 h-10 rounded-lg bg-stone-800/90 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 truncate">{dateHijri || '1447 H'}</div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                {dateMasehi}
              </div>
            </div>
          </div>

          {/* Card 4: 24/7 Rest Area status */}
          <div className="flex items-center gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/80">
            <div className="w-10 h-10 rounded-lg bg-stone-800/90 border border-stone-700 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400">Layanan Musafir</div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-300 truncate">
                Buka 24 Jam Non-Stop
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
