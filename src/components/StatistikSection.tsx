import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Users,
  CalendarDays,
  TrendingUp,
  Globe,
  RefreshCw,
  Smartphone,
  Laptop,
  Clock,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import {
  fetchStatistikPengunjung,
  recordVisitorHit,
  VisitorStatsResponse,
  MASJID_DATA_UPDATED_EVENT,
} from '../services/googleSheetsService';

export const StatistikSection: React.FC = () => {
  const [stats, setStats] = useState<VisitorStatsResponse>({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalAllTime: 0,
    history7Days: [],
    mobilePercent: 82,
    desktopPercent: 18,
    source: 'local-fallback',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchStatistikPengunjung();
      setStats(data);
    } catch {
      // fallback handled in service
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Record hit on mount (guarded per session per day)
    recordVisitorHit();
    loadStats();

    const handleUpdate = () => {
      loadStats();
    };
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    };
  }, [loadStats]);

  // Find max count for proportional bar scaling
  const maxDayCount = Math.max(
    ...stats.history7Days.map((d) => d.count),
    1
  );

  return (
    <section id="statistik" className="py-12 border-b border-stone-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-emerald-400">Trafik & Transparansi Layanan</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className={stats.source === 'google-sheets' ? 'text-emerald-400' : 'text-stone-400'}>
              {stats.source === 'google-sheets' ? '🟢 Terhubung Google Sheets' : '⚪ Real-time Tracker'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Statistik Pengunjung Website</span>
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Data pemantauan kunjungan harian musafir dan jemaah yang mengakses informasi jadwal sholat, fasilitas rest area 24 jam KM 145, serta laporan keuangan kas masjid.
          </p>
        </div>

        <button
          onClick={loadStats}
          disabled={isLoading}
          className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer disabled:opacity-50 shadow-sm"
          title="Segarkan statistik pengunjung"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isLoading ? 'Memuat...' : 'Segarkan Data'}</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Hari Ini */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-stone-900/80 border border-emerald-800/40 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
              {stats.today.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-stone-400 font-medium">jiwa</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Kunjungan unik hari ini</span>
          </div>
        </div>

        {/* Kemarin */}
        <div className="bg-gradient-to-br from-blue-950/30 to-stone-900/80 border border-blue-800/30 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Kemarin
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-white tabular-nums tracking-tight">
              {stats.yesterday.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-stone-400 font-medium">jiwa</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            Kunjungan terekam kemarin
          </div>
        </div>

        {/* Minggu Ini */}
        <div className="bg-gradient-to-br from-amber-950/30 to-stone-900/80 border border-amber-800/30 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Minggu Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-amber-300 tabular-nums tracking-tight">
              {stats.thisWeek.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-stone-400 font-medium">jiwa</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            Akumulasi 7 hari terakhir
          </div>
        </div>

        {/* Total Seluruh Kunjungan */}
        <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Total Akses
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-emerald-400 tabular-nums tracking-tight">
              {stats.totalAllTime.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-stone-400 font-medium">kali</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400 truncate">
            Terkumpul sejak diluncurkan
          </div>
        </div>
      </div>

      {/* Grid: 7-Day Visual Bar Chart & Safar Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 7-Day Trend Visual Chart */}
        <div className="lg:col-span-8 bg-stone-900/60 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Grafik Tren Kunjungan Harian (7 Hari Terakhir)
                </h3>
              </div>
              <span className="text-[11px] text-stone-400 font-mono">
                Pembaruan: {stats.lastUpdated || 'Realtime'}
              </span>
            </div>

            {/* Visual Bar Columns */}
            <div className="pt-6 pb-2">
              <div className="h-44 sm:h-52 flex items-end justify-between gap-2 sm:gap-4 px-1 sm:px-3 border-b border-stone-800">
                {stats.history7Days.map((item, idx) => {
                  const isToday = idx === stats.history7Days.length - 1;
                  const heightPercent = Math.max(Math.round((item.count / maxDayCount) * 100), 12);

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center h-full justify-end group relative"
                    >
                      {/* Tooltip chip above bar */}
                      <div className="opacity-90 group-hover:opacity-100 transition-opacity mb-2 text-center">
                        <span
                          className={`inline-block px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold ${
                            isToday
                              ? 'bg-amber-400 text-stone-950 shadow-md'
                              : 'bg-stone-800 text-stone-200 border border-stone-700'
                          }`}
                        >
                          {item.count}
                        </span>
                      </div>

                      {/* Bar Fill */}
                      <div className="w-full max-w-[42px] bg-stone-950 rounded-t-xl overflow-hidden p-0.5 flex flex-col justify-end">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isToday
                              ? 'bg-gradient-to-t from-emerald-600 via-amber-400 to-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                              : 'bg-gradient-to-t from-emerald-900 to-emerald-600/80 group-hover:from-emerald-800 group-hover:to-emerald-500'
                          }`}
                        />
                      </div>

                      {/* Day Label */}
                      <div className="mt-3 text-center">
                        <span
                          className={`block text-[11px] sm:text-xs font-semibold leading-tight ${
                            isToday ? 'text-amber-400 font-bold' : 'text-stone-300'
                          }`}
                        >
                          {item.dayName}
                        </span>
                        <span className="block text-[10px] text-stone-500 font-mono mt-0.5">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 border-t border-stone-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span>Hari Biasa</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Hari Ini</span>
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              *Tercatat otomatis saat musafir & warga membuka situs
            </span>
          </div>
        </div>

        {/* Right: Device Breakdown & Analytics Insight */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Device Proportion Card */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Perangkat Pengakses</span>
            </h4>

            <p className="text-xs text-stone-400 leading-relaxed">
              Mayoritas pengunjung mengakses melalui smartphone dalam perjalanan (musafir Poros Wahau-Bengalon KM 145).
            </p>

            {/* Proportion Bar */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-stone-950 rounded-full overflow-hidden flex p-0.5 border border-stone-800">
                <div
                  style={{ width: `${stats.mobilePercent}%` }}
                  className="bg-emerald-400 rounded-full h-full transition-all duration-500"
                  title={`Smartphone: ${stats.mobilePercent}%`}
                />
                <div
                  style={{ width: `${stats.desktopPercent}%` }}
                  className="bg-blue-400 rounded-full h-full transition-all duration-500 ml-0.5"
                  title={`Laptop/PC: ${stats.desktopPercent}%`}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>HP / Ponsel ({stats.mobilePercent}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-300 font-medium">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Komputer ({stats.desktopPercent}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Characteristics Info */}
          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Karakteristik Trafik Musafir</span>
            </div>

            <ul className="space-y-2 text-xs text-stone-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Waktu Puncak:</strong> Menjelang waktu Sholat Dzuhur & Maghrib saat kendaraan singgah rehat.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Halaman Terpopuler:</strong> Jadwal Sholat Real-Time, Rest Area 24 Jam, dan Rekening Infaq BRI.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-stone-400 text-[11px]">Penghitungan dilakukan secara anonim tanpa menyimpan data identitas pengunjung.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
