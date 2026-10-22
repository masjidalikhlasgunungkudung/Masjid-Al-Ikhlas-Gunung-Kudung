import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, User, Clock, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { AGENDA_ITEMS, JUMAT_SCHEDULE } from '../data/masjidData';
import {
  fetchJadwalJumatFromSheets,
  fetchAgendaFromSheets,
  JumatScheduleResponse,
  MASJID_DATA_UPDATED_EVENT,
} from '../services/googleSheetsService';
import { AgendaItem } from '../types/masjid';

export const AgendaSection: React.FC = () => {
  const [jumatData, setJumatData] = useState<JumatScheduleResponse>({
    ...JUMAT_SCHEDULE,
    source: 'local-fallback',
  });
  const [agendaList, setAgendaList] = useState<AgendaItem[]>(AGENDA_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [jumat, agenda] = await Promise.all([
        fetchJadwalJumatFromSheets(),
        fetchAgendaFromSheets(),
      ]);
      setJumatData(jumat);
      if (agenda && agenda.length > 0) {
        setAgendaList(agenda);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    };
  }, [loadData]);

  return (
    <section id="agenda" className="py-16 sm:py-20 border-b border-stone-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">Kemakmuran Masjid & Kajian Ilmu</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">
              {jumatData.source === 'google-sheets' ? 'Google Sheets Aktif' : 'Jadwal DKM'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agenda Ibadah & Kegiatan Rutin
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Jadwal kegiatan pembinaan rohani, Sholat Jum'at, pengajian tafsir, dan majelis taklim di lingkungan Masjid Al-Ikhlas Gunung Kudung.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer disabled:opacity-50"
          title="Perbarui Jadwal dari Google Sheets"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Segarkan Jadwal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Petugas Sholat Jum'at Highlight */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-900/90 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Petugas Sholat Jum'at Pekan Ini</span>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {jumatData.date}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
            Pelaksanaan Sholat Jum'at Berjamaah
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            Diadakan setiap hari Jum'at mulai pukul 11:45 WITA. Terbuka bagi masyarakat sekitar, jemaah pekerja perkebunan, serta musafir yang melintas di KM 145.
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
              <span className="text-stone-400 text-xs shrink-0">Khatib:</span>
              <strong className="text-white font-medium text-xs sm:text-sm text-left sm:text-right break-words">
                {jumatData.khatib || 'Akan diumumkan pengurus'}
              </strong>
            </div>

            <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
              <span className="text-stone-400 text-xs shrink-0">Imam Sholat:</span>
              <strong className="text-white font-medium text-xs sm:text-sm text-left sm:text-right break-words">
                {jumatData.imam || 'Akan diumumkan pengurus'}
              </strong>
            </div>

            <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
              <span className="text-stone-400 text-xs shrink-0">Muadzin & Bilal:</span>
              <strong className="text-white font-medium text-xs sm:text-sm text-left sm:text-right break-words">
                {jumatData.muadzin || 'Akan diumumkan pengurus'}
              </strong>
            </div>

            <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
              <span className="text-stone-400 text-xs shrink-0">Waktu Adzan Awal:</span>
              <strong className="text-amber-300 font-mono font-bold text-xs sm:text-sm text-left sm:text-right">{jumatData.adzanTime}</strong>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-amber-950/20 border border-amber-800/30 rounded-2xl">
            <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider mb-1">
              Topik Khutbah Jum'at:
            </div>
            <p className="text-xs text-stone-200 italic font-serif leading-relaxed">
              "{jumatData.khutbahTopic || 'Topik khutbah akan diperbarui oleh DKM'}"
            </p>
          </div>
        </div>

        {/* Right Column: Routine Agenda List */}
        <div className="lg:col-span-7 space-y-4">
          {agendaList.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900/60 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>{item.dayOrDate}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{item.time}</span>
                  </span>
                </div>
              </div>

              <h4 className="text-base font-bold text-white mb-1.5">{item.title}</h4>
              <p className="text-xs text-stone-300 leading-relaxed mb-3">{item.description}</p>

              <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                {item.speakerOrOfficer && (
                  <span className="flex items-center gap-1 text-stone-300">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.speakerOrOfficer}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.location}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
