import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  Maximize2,
  X,
  PhoneCall,
  RefreshCw,
  Building,
  Download,
} from 'lucide-react';
import { MASJID_INFO } from '../data/masjidData';
import {
  fetchKasFromSheets,
  fetchPengaturanFromSheets,
  formatDriveImageUrl,
  KasSheetsResponse,
  PengaturanResponse,
  DEFAULT_PENGATURAN,
  MASJID_DATA_UPDATED_EVENT,
} from '../services/googleSheetsService';

interface DonasiKasSectionProps {
  onNotify: (msg: string) => void;
}

export const DonasiKasSection: React.FC<DonasiKasSectionProps> = ({ onNotify }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedNominal, setSelectedNominal] = useState<number>(50000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [showQrisModal, setShowQrisModal] = useState<boolean>(false);

  // Live Kas data
  const [kasData, setKasData] = useState<KasSheetsResponse>({
    saldoTerkini: 0,
    totalPemasukan: 0,
    totalPengeluaran: 0,
    records: [],
    source: 'local-fallback',
  });
  const [isLoadingKas, setIsLoadingKas] = useState<boolean>(false);

  // Live Pengaturan Rekening
  const [pengaturan, setPengaturan] = useState<PengaturanResponse>(DEFAULT_PENGATURAN);

  const loadData = useCallback(async () => {
    setIsLoadingKas(true);
    try {
      const [kas, set] = await Promise.all([
        fetchKasFromSheets(),
        fetchPengaturanFromSheets(),
      ]);
      setKasData(kas);
      setPengaturan(set);
    } catch {
      // handled in service
    } finally {
      setIsLoadingKas(false);
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

  const activeQrisImage =
    formatDriveImageUrl(pengaturan.urlGambarQris) ||
    '/images/qris_masjid_official_1792025688952.jpg';

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const [isNmidCopied, setIsNmidCopied] = useState<boolean>(false);

  const handleCopyNmid = () => {
    const nmid = pengaturan.nmidQris || 'ID1024358892110';
    navigator.clipboard.writeText(nmid);
    setIsNmidCopied(true);
    onNotify('Kode NMID QRIS berhasil disalin!');
    setTimeout(() => setIsNmidCopied(false), 3000);
  };

  const handleCopyRekening = () => {
    if (!pengaturan.nomorRekening) {
      onNotify('Nomor rekening Bank BRI belum diisi di Google Sheets.');
      return;
    }
    navigator.clipboard.writeText(pengaturan.nomorRekening);
    setIsCopied(true);
    onNotify('Nomor Rekening Bank BRI berhasil disalin!');
    setTimeout(() => setIsCopied(false), 3000);
  };

  const getNominalValue = () => {
    if (customNominal && parseInt(customNominal, 10) > 0) {
      return parseInt(customNominal, 10);
    }
    return selectedNominal;
  };

  const getWaConfirmationLink = () => {
    const nominalFormatted = formatRupiah(getNominalValue());
    const bankName = pengaturan.namaBank || 'Bank BRI';
    const text = `Assalamu'alaikum Warahmatullahi Wabarakatuh Pengurus DKM Masjid Al-Ikhlas Gunung Kudung.\n\nSaya ingin mengonfirmasi infaq sebesar *${nominalFormatted}* melalui *${bankName}* (a.n. ${pengaturan.atasNama}) untuk kas operasional masjid & rest area.\n\nSemoga berkah dan bermanfaat untuk kemakmuran masjid & jemaah. Terima kasih.`;
    const cleanPhone = (pengaturan.kontakWa || MASJID_INFO.phone).replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="donasi" className="py-16 sm:py-20 border-b border-stone-800/60">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">Infaq & Shodaqoh Jariyah</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">Akuntabilitas & Amanah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Infaq Kas Masjid & Rest Area
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Dukung operasional listrik, air bersih musafir, kesejahteraan marbot, serta fasilitas mengaji santri TPQ Al-Muhajirin Gunung Kudung.
          </p>
        </div>

        {/* Real-time Status & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoadingKas}
            className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
            title="Segarkan data kas & saldo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingKas ? 'animate-spin text-amber-400' : ''}`} />
            <span>Segarkan Kas</span>
          </button>
        </div>
      </div>

      {/* Official DKM Management Notice */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Amanah Pengelolaan Kas DKM Masjid Al-Ikhlas
            </div>
            <p className="text-xs sm:text-sm text-stone-300 mt-0.5 leading-relaxed">
              Seluruh rekening resmi kas masjid dikelola secara transparan dan bertanggung jawab oleh <strong>Pengurus DKM Masjid Al-Ikhlas Gunung Kudung KM 145</strong> untuk kemakmuran ibadah dan fasilitas musafir.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${(pengaturan.kontakWa || MASJID_INFO.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Assalamu'alaikum Pengurus DKM Masjid Al-Ikhlas Gunung Kudung. Saya ingin konfirmasi infaq.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          <span>Hubungi DKM Masjid Al-Ikhlas</span>
        </a>
      </div>

      {/* Grid: Single Bank Account & QRIS Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12">
        {/* Left: Single Bank Account Card & Confirmation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-stone-300 uppercase tracking-wider">
              Rekening Resmi Kas Masjid
            </h3>
            <span className="text-xs font-medium text-stone-400 font-mono">
              {pengaturan.namaBank || 'Bank BRI'}
            </span>
          </div>

          {/* Single Bank Account Card a.n. Masjid Al-Ikhlas - Bank BRI */}
          <div className="bg-stone-900/70 border border-stone-800 hover:border-stone-700 rounded-2xl p-4 sm:p-6 transition-all space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-600/80 text-blue-300 flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-sm">
                  BRI
                </span>
                <div className="min-w-0">
                  <span className="text-xs text-blue-400 font-bold block truncate">
                    {pengaturan.namaBank || 'Bank BRI (Bank Rakyat Indonesia)'}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white block">
                    Atas Nama: <span className="text-amber-300">{pengaturan.atasNama || 'Masjid Al-Ikhlas'}</span>
                  </span>
                </div>
              </div>

              {pengaturan.nomorRekening ? (
                <button
                  onClick={handleCopyRekening}
                  className={`w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700 hover:text-white'
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin No. Rekening BRI'}</span>
                </button>
              ) : null}
            </div>

            {/* Account Number or Waiting State */}
            <div className="p-3.5 sm:p-4 bg-stone-950/80 border border-stone-800/80 rounded-xl">
              {pengaturan.nomorRekening ? (
                <div>
                  <div className="text-[10px] sm:text-[11px] text-stone-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Nomor Rekening Bank BRI:</span>
                    <span className="text-emerald-400 font-sans font-medium text-[10px]">Terverifikasi DKM</span>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-extrabold font-mono tracking-wider text-amber-300 tabular-nums break-all">
                    {pengaturan.nomorRekening}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="text-sm font-semibold text-stone-300 mb-1 flex items-center justify-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Nomor Rekening Bank BRI Sedang Dalam Proses Input</span>
                  </div>
                  <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                    Nomor rekening Bank BRI akan otomatis muncul di sini segera setelah pengurus menginputnya di Google Sheets (Sheet: <em>Pengaturan</em>). Untuk saat ini penyaluran infaq dapat melalui scan gambar QRIS di samping atau konfirmasi WhatsApp DKM.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Confirmation Box */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Kirim Konfirmasi Infaq via WhatsApp ke DKM Masjid Al-Ikhlas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2">
              {[10000, 25000, 50000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedNominal(amt);
                    setCustomNominal('');
                  }}
                  className={`px-3 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer text-center ${
                    selectedNominal === amt && !customNominal
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                placeholder="Atau ketik nominal lainnya (Rp)..."
                value={customNominal}
                onChange={(e) => setCustomNominal(e.target.value)}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <a
              href={getWaConfirmationLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-center">Kirim Bukti / Konfirmasi ke WhatsApp DKM Masjid</span>
            </a>
          </div>
        </div>

        {/* Right: QRIS Card with Image Display & File Upload */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-5 sm:p-7 text-center shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-[11px]">
              QRIS Standar Nasional
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              Didukung Bank BRI
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white">Scan Gambar QRIS Infaq Masjid</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Mendukung semua aplikasi m-Banking (BRImo, BCA, Mandiri, BNI) dan Dompet Digital (GoPay, OVO, Dana, ShopeePay).
          </p>

          {/* QRIS Real Image Card Display */}
          <div className="my-3 mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl max-w-[250px] relative group border border-stone-200">
            <img
              src={activeQrisImage}
              alt="Gambar QRIS Resmi Masjid Al-Ikhlas Gunung Kudung KM 145"
              className="w-full h-auto rounded-xl object-contain max-h-[320px] transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('src/assets')) {
                  target.src = '/src/assets/images/qris_masjid_official_1792025688952.jpg';
                } else {
                  target.src = '/qris.jpg';
                }
              }}
            />
            <button
              onClick={() => setShowQrisModal(true)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer backdrop-blur-[2px]"
            >
              <Maximize2 className="w-6 h-6 text-amber-400" />
              <span>Perbesar Gambar QRIS</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800/80 rounded-xl">
              <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider">
                NMID: {pengaturan.nmidQris || 'ID1024358892110'}
              </span>
              <button
                type="button"
                onClick={handleCopyNmid}
                className="p-1 hover:bg-emerald-900/60 rounded-md text-emerald-400 hover:text-emerald-200 transition-colors cursor-pointer"
                title="Salin Kode NMID"
              >
                {isNmidCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {isNmidCopied && (
              <span className="text-[10px] text-emerald-400 block font-medium">
                NMID tersalin ke clipboard!
              </span>
            )}
            <div className="text-[11px] text-stone-400 font-medium">
              A.N. DKM MASJID AL-IKHLAS GUNUNG KUDUNG
            </div>
            <div className="text-[11px] text-blue-400 font-semibold">
              Bank Rekening Pembayaran: {pengaturan.namaBank || 'Bank BRI'}
            </div>
          </div>

          {/* Action buttons: View Full and Download */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowQrisModal(true)}
                className="py-2.5 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Lihat Jelas</span>
              </button>

              <a
                href={activeQrisImage}
                download="qris-masjid-al-ikhlas-km145.jpg"
                className="py-2.5 px-3 text-xs font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>Unduh Gambar</span>
              </a>
            </div>

            <p className="text-[11px] text-stone-500 text-center">
              Pindai QRIS resmi melalui m-Banking atau dompet digital Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Transparency Summary - Live from Google Sheets */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-4 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="text-emerald-400">Laporan Keuangan Terbuka</span>
              <span aria-hidden="true" className="text-stone-600">·</span>
              <span className={kasData.source === 'google-sheets' ? 'text-emerald-400' : 'text-stone-400'}>
                {kasData.source === 'google-sheets' ? '🟢 Terhubung Google Sheets' : '⚪ Menunggu Input Data'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Transparansi Kas DKM & Rest Area</h3>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              disabled={isLoadingKas}
              className="p-2 text-stone-400 hover:text-white bg-stone-950 border border-stone-800 rounded-xl hover:bg-stone-900 transition-colors cursor-pointer shrink-0"
              title="Perbarui Data Kas dari Google Sheets"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingKas ? 'animate-spin' : ''}`} />
            </button>

            <div className="bg-stone-950 px-3.5 sm:px-4 py-2 rounded-xl border border-stone-800 flex-1 sm:flex-initial">
              <span className="text-[10px] sm:text-[11px] text-stone-400 block">Saldo Kas Terkini:</span>
              <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {formatRupiah(kasData.saldoTerkini)}
              </span>
            </div>
          </div>
        </div>

        {/* Transactions List or Clean Empty State with min-width for mobile */}
        {kasData.records.length > 0 ? (
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full min-w-[500px] text-xs text-left text-stone-300">
              <thead className="text-[11px] uppercase tracking-wider text-stone-400 bg-stone-950/70 border-b border-stone-800">
                <tr>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Keterangan Transaksi</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono tabular-nums">
                {kasData.records.map((record) => (
                  <tr key={record.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-stone-400 whitespace-nowrap">{record.date}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-stone-200">{record.description}</td>
                    <td className="py-2.5 px-3 font-sans text-stone-400">{record.category}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold whitespace-nowrap ${
                        record.type === 'in' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {record.type === 'in' ? '+' : '-'} {formatRupiah(record.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-10 px-4 bg-stone-950/50 rounded-2xl border border-stone-800/60">
            <div className="text-sm font-semibold text-stone-300 mb-1">
              Belum Ada Catatan Transaksi Kas
            </div>
            <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
              Seluruh mutasi infaq dan pengeluaran operasional yang Anda ketik di Google Sheets (Sheet: <em>KasKeuangan</em>) akan otomatis tampil di tabel ini secara transparan.
            </p>
          </div>
        )}
      </div>

      {/* QRIS Modal Pop-up */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 text-center shadow-2xl overflow-y-auto max-h-[92vh]">
            <button
              onClick={() => setShowQrisModal(false)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              Gambar QRIS Resmi DKM Masjid
            </div>
            <h4 className="text-lg font-bold text-white mb-0.5">Masjid Al-Ikhlas Gunung Kudung KM 145</h4>
            <p className="text-xs text-blue-400 font-medium mb-3">Didukung Rekening Bank BRI · Pemindaian Instan</p>

            {/* Official QRIS Image in high resolution */}
            <div className="bg-white p-3 rounded-2xl shadow-inner mb-4 max-w-[320px] mx-auto border border-stone-200">
              <img
                src={activeQrisImage}
                alt="QRIS Resmi Masjid Al-Ikhlas Gunung Kudung KM 145"
                className="w-full h-auto rounded-lg object-contain max-h-[460px] mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('src/assets')) {
                    target.src = '/src/assets/images/qris_masjid_official_1792025688952.jpg';
                  } else {
                    target.src = '/qris.jpg';
                  }
                }}
              />
            </div>

            <div className="text-xs text-stone-300 font-mono mb-1">
              A.N. <strong>DKM MASJID AL-IKHLAS GUNUNG KUDUNG</strong>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[11px] text-emerald-400 font-mono">
                NMID: {pengaturan.nmidQris || 'ID1024358892110'} · {pengaturan.namaBank || 'Bank BRI'}
              </span>
              <button
                type="button"
                onClick={handleCopyNmid}
                className="p-1 hover:bg-stone-800 rounded text-emerald-400 hover:text-emerald-200 transition-colors cursor-pointer"
                title="Salin NMID"
              >
                {isNmidCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="space-y-2">
              <a
                href={activeQrisImage}
                download="qris-masjid-al-ikhlas-km145.jpg"
                className="w-full py-2.5 px-3 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Simpan Gambar ke Galeri HP / Komputer</span>
              </a>

              <button
                onClick={() => setShowQrisModal(false)}
                className="w-full py-2 text-xs font-medium text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              >
                Tutup Tampilan QRIS
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
