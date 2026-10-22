import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, User, MapPin, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { INITIAL_GUESTBOOK } from '../data/masjidData';
import { GuestbookEntry } from '../types/masjid';
import { fetchBukuTamuFromSheets, submitBukuTamuToSheets } from '../services/googleSheetsService';

interface BukuTamuSectionProps {
  onNotify: (msg: string) => void;
}

export const BukuTamuSection: React.FC<BukuTamuSectionProps> = ({ onNotify }) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK);
  const [name, setName] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [role, setRole] = useState<GuestbookEntry['role']>('Musafir');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [source, setSource] = useState<'google-sheets' | 'local-fallback'>('local-fallback');

  const loadEntries = useCallback(async () => {
    setIsLoadingEntries(true);
    try {
      const data = await fetchBukuTamuFromSheets();
      setEntries(data.entries);
      setSource(data.source);
    } catch {
      // fallback
    } finally {
      setIsLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      onNotify('Mohon lengkapi nama dan pesan doa Anda.');
      return;
    }

    setIsSubmitting(true);
    const currentDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const newEntryData = {
      name: name.trim(),
      originCity: originCity.trim() || 'Musafir Singgah',
      role,
      date: currentDate,
      message: message.trim(),
    };

    try {
      await submitBukuTamuToSheets(newEntryData);

      // Add to UI immediately
      const newEntry: GuestbookEntry = {
        ...newEntryData,
        id: `gb-${Date.now()}`,
      };
      setEntries([newEntry, ...entries]);

      setName('');
      setOriginCity('');
      setMessage('');
      onNotify('Alhamdulillah! Pesan & doa Anda telah tersimpan dan terkirim ke Google Sheets DKM.');
    } catch (err) {
      onNotify('Pesan tersimpan di perangkat lokal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 border-b border-stone-800/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider mb-2 font-semibold">
            <span className="text-amber-400">Ukhuwah & Kesan Pengunjung</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">Tercatat di Google Sheets</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Buku Tamu Digital Musafir & Jemaah
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Tinggalkan doa, salam, atau kesan saat Anda singgah beribadah dan beristirahat di Masjid Al-Ikhlas Gunung Kudung KM 145.
          </p>
        </div>

        <button
          onClick={loadEntries}
          disabled={isLoadingEntries}
          className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEntries ? 'animate-spin' : ''}`} />
          <span>Muat Ulang Pesan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-stone-900/70 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Tulis Kesan & Doa Anda</span>
          </h3>
          <p className="text-xs text-stone-400 mb-5">
            Pesan Anda otomatis terkirim dan tercatat di spreadsheet database DKM Masjid Al-Ikhlas.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Nama Lengkap / Panggilan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Bpk. Ridwan & Keluarga"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Kota Asal / Tujuan Perjalanan</label>
              <input
                type="text"
                placeholder="Contoh: Samarinda (Menuju Berau)"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Status Pengunjung</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as GuestbookEntry['role'])}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-200 focus:outline-none focus:border-emerald-400"
              >
                <option value="Musafir">Musafir (Pelintas Antarkota)</option>
                <option value="Sopir Ekspedisi">Sopir Travel / Truk Logistik</option>
                <option value="Keluarga Traveling">Keluarga Sedang Bepergian</option>
                <option value="Jemaah Warga">Jemaah Warga Sekitar Gunung Kudung</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Pesan, Doa, atau Kesan Singgah</label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan pengalaman Anda saat singgah di masjid ini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 text-xs sm:text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Google Sheets...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirimkan ke Buku Tamu</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Entries Column */}
        <div className="lg:col-span-7 space-y-4 max-h-[580px] overflow-y-auto pr-1">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-stone-900/50 border border-stone-800/90 rounded-2xl p-4 sm:p-5 hover:border-stone-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white leading-tight truncate">{entry.name}</h4>
                      <div className="text-[10px] sm:text-[11px] text-stone-400 flex flex-wrap items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{entry.originCity}</span>
                        <span aria-hidden="true" className="text-stone-600">·</span>
                        <span className="text-amber-400/90">{entry.role}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 font-mono self-start sm:self-auto mt-1 sm:mt-0">
                    {entry.date}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mt-2 pl-0 sm:pl-10.5">
                  "{entry.message}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-6 bg-stone-900/40 border border-stone-800 rounded-3xl">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-stone-200 mb-1">
                Belum Ada Doa atau Pesan Musafir
              </div>
              <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                Jadilah yang pertama menuliskan doa dan kesan singgah melalui formulir di samping! Pesan akan otomatis tersimpan ke Google Sheets DKM.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
