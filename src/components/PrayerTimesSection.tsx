import React, { useState } from 'react';
import { Compass, Volume2, VolumeX, Calendar, RefreshCw, MapPin } from 'lucide-react';
import { MASJID_INFO } from '../data/masjidData';
import { NextPrayerInfo, PrayerTimes } from '../types/masjid';

interface PrayerTimesSectionProps {
  timings: PrayerTimes;
  currentPrayer: string;
  nextPrayer: NextPrayerInfo;
  dateMasehi: string;
  dateHijri: string;
  onOpenMonthly: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  timings,
  currentPrayer,
  nextPrayer,
  dateMasehi,
  dateHijri,
  onOpenMonthly,
  onRefresh,
  isLoading,
}) => {
  const [isPlayingAdzan, setIsPlayingAdzan] = useState(false);
  const [audioOscillator, setAudioOscillator] = useState<AudioContext | null>(null);

  // Gentle Adzan tone notification using Web Audio API
  const toggleAdzanAudio = () => {
    if (isPlayingAdzan && audioOscillator) {
      audioOscillator.close();
      setAudioOscillator(null);
      setIsPlayingAdzan(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      setAudioOscillator(ctx);
      setIsPlayingAdzan(true);

      // Play a peaceful melodic chime sequence
      const notes = [261.63, 329.63, 392.0, 523.25, 392.0]; // C4, E4, G4, C5, G4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.7);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.7);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.7 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.7 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.7);
        osc.stop(ctx.currentTime + idx * 0.7 + 0.7);
      });

      setTimeout(() => {
        setIsPlayingAdzan(false);
        ctx.close();
      }, notes.length * 700 + 500);
    } catch {
      setIsPlayingAdzan(false);
    }
  };

  const prayerList = [
    { key: 'imsak', name: 'Imsak', time: timings.imsak, arabic: 'الإمساك' },
    { key: 'subuh', name: 'Subuh', time: timings.subuh, arabic: 'الفجر' },
    { key: 'terbit', name: 'Terbit', time: timings.terbit, arabic: 'الشروق' },
    { key: 'dzuhur', name: 'Dzuhur', time: timings.dzuhur, arabic: 'الظهر' },
    { key: 'ashar', name: 'Ashar', time: timings.ashar, arabic: 'العصر' },
    { key: 'maghrib', name: 'Maghrib', time: timings.maghrib, arabic: 'المغرب' },
    { key: 'isya', name: 'Isya', time: timings.isya, arabic: 'العشاء' },
  ];

  return (
    <section id="jadwal" className="py-16 sm:py-20 border-b border-stone-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">Kutai Timur (WITA)</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">Standar Kemenag RI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Jadwal Sholat Hari Ini
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Waktu sholat akurat untuk wilayah Gunung Kudung, Bengalon, dan jalur Muara Wahau KM 145.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl hover:border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Segarkan Jadwal Sholat"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Sinkronisasi</span>
          </button>

          {/* Sound Preview toggle */}
          <button
            onClick={toggleAdzanAudio}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isPlayingAdzan
                ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                : 'text-stone-300 hover:text-white bg-stone-900 border-stone-800 hover:border-stone-700'
            }`}
          >
            {isPlayingAdzan ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPlayingAdzan ? 'Bunyikan Bel...' : 'Uji Pengingat'}</span>
          </button>

          {/* Full Month Calendar Modal trigger */}
          <button
            onClick={onOpenMonthly}
            className="px-3.5 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-500/30 hover:border-amber-400 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal 1 Bulan Penuh</span>
          </button>
        </div>
      </div>

      {/* Grid of 7 Prayer Times - perfectly balanced on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 mb-6">
        {prayerList.map((item, idx) => {
          const isNext = nextPrayer.name.toLowerCase() === item.name.toLowerCase();
          const isCurrent = currentPrayer.toLowerCase() === item.name.toLowerCase();
          const isLastOnMobileOdd = idx === 6; // 7th item (Isya)

          return (
            <div
              key={item.key}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                isLastOnMobileOdd ? 'col-span-2 sm:col-span-1' : ''
              } ${
                isNext
                  ? 'bg-emerald-950/70 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/50'
                  : isCurrent
                  ? 'bg-amber-950/40 border-amber-600/60'
                  : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span
                  className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider ${
                    isNext ? 'text-emerald-300' : isCurrent ? 'text-amber-300' : 'text-stone-400'
                  }`}
                >
                  {item.name}
                </span>
                <span className="font-arabic text-xs sm:text-sm text-stone-500">{item.arabic}</span>
              </div>

              <div
                className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-mono tabular-nums tracking-tight my-0.5 sm:my-1 ${
                  isNext ? 'text-white' : 'text-stone-200'
                }`}
              >
                {item.time}
              </div>

              <div className="text-[10px] sm:text-[11px] text-stone-400 mt-1 truncate">
                {isNext ? (
                  <span className="text-emerald-400 font-medium">Sholat Berikutnya</span>
                ) : isCurrent ? (
                  <span className="text-amber-400 font-medium">Waktu Sekarang</span>
                ) : (
                  <span>WITA</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Strip: Qibla & Mosque Location Coordinates */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-stone-400">Arah Kiblat dari Gunung Kudung KM 145:</span>{' '}
            <strong className="text-amber-300 font-mono">{MASJID_INFO.qiblaBearing}</strong>
            <span className="text-stone-400 ml-2 hidden sm:inline">
              (Garis shaf masjid telah diukur presisi tim Kemenag)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-400">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono text-xs text-stone-300">0.8755248° N, 117.1679831° E</span>
        </div>
      </div>
    </section>
  );
};
