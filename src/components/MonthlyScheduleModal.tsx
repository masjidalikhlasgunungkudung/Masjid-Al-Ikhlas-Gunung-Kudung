import React, { useState } from 'react';
import { X, Printer, Search } from 'lucide-react';
import { getMonthlyCalendar } from '../services/prayerTimeService';

interface MonthlyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthlyScheduleModal: React.FC<MonthlyScheduleModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  if (!isOpen) return null;

  const currentMonthData = getMonthlyCalendar();
  const filtered = currentMonthData.filter(
    (d) =>
      d.dateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.day.toString().includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Jadwal Waktu Sholat Bulanan
            </div>
            <h3 className="text-xl font-bold text-white">
              Kutai Timur & Jalur Poros KM 145 (WITA)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="px-6 py-3 bg-stone-950/50 border-b border-stone-800 flex items-center gap-2">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Cari hari atau tanggal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:outline-none"
          />
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <table className="w-full min-w-[560px] text-xs text-left text-stone-300">
            <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-950/70 sticky top-0 border-b border-stone-800">
              <tr>
                <th className="py-2.5 px-3">Tgl</th>
                <th className="py-2.5 px-3">Hari</th>
                <th className="py-2.5 px-3 font-mono">Imsak</th>
                <th className="py-2.5 px-3 font-mono">Subuh</th>
                <th className="py-2.5 px-3 font-mono">Terbit</th>
                <th className="py-2.5 px-3 font-mono">Dzuhur</th>
                <th className="py-2.5 px-3 font-mono">Ashar</th>
                <th className="py-2.5 px-3 font-mono">Maghrib</th>
                <th className="py-2.5 px-3 font-mono">Isya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono tabular-nums">
              {filtered.map((item) => (
                <tr key={item.day} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-2 px-3 font-bold text-white">{item.day}</td>
                  <td className="py-2 px-3 font-sans text-stone-400 whitespace-nowrap">{item.dateStr}</td>
                  <td className="py-2 px-3 text-stone-400">{item.imsak}</td>
                  <td className="py-2 px-3 text-emerald-300 font-semibold">{item.subuh}</td>
                  <td className="py-2 px-3 text-stone-400">{item.terbit}</td>
                  <td className="py-2 px-3 text-amber-300 font-semibold">{item.dzuhur}</td>
                  <td className="py-2 px-3 text-amber-300">{item.ashar}</td>
                  <td className="py-2 px-3 text-emerald-300 font-semibold">{item.maghrib}</td>
                  <td className="py-2 px-3 text-stone-200">{item.isya}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/70 border-t border-stone-800 text-center text-xs text-stone-400">
          Dihitung berdasarkan koordinat Masjid Al-Ikhlas Gunung Kudung KM 145 (Kutai Timur - Kemenag RI).
        </div>
      </div>
    </div>
  );
};
