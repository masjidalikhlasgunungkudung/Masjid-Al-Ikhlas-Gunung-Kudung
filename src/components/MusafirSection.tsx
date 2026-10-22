import React, { useState, useEffect } from 'react';
import {
  Building2,
  Droplets,
  Bath,
  Car,
  Coffee,
  Zap,
  HeartHandshake,
  Compass,
  BookOpen,
  Info,
  CheckCircle,
  Wifi,
  Phone,
  Clock,
  Utensils,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_FACILITIES, DEFAULT_REST_AREA_HEADER, MUSAFIR_PRAYER_GUIDE } from '../data/masjidData';
import { FacilityItem, RestAreaHeaderInfo } from '../types/masjid';
import {
  fetchPengaturanFromSheets,
  fetchFacilitiesFromSheets,
  fetchRestAreaHeaderFromSheets,
  formatDriveImageUrl,
  MASJID_DATA_UPDATED_EVENT,
} from '../services/googleSheetsService';

interface MusafirSectionProps {
  onOpenAdminPortal?: () => void;
}

export const MusafirSection: React.FC<MusafirSectionProps> = ({ onOpenAdminPortal }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [restAreaImg, setRestAreaImg] = useState<string>('/images/rest_area_musafir_1791948465509.jpg');
  const [interiorImg, setInteriorImg] = useState<string>('/images/interior_sholat_utama_1791948463767.jpg');
  const [facilities, setFacilities] = useState<FacilityItem[]>(DEFAULT_FACILITIES);
  const [headerInfo, setHeaderInfo] = useState<RestAreaHeaderInfo>(DEFAULT_REST_AREA_HEADER);

  const loadAllMusafirData = async () => {
    try {
      const [p, facs, header] = await Promise.all([
        fetchPengaturanFromSheets(),
        fetchFacilitiesFromSheets(),
        fetchRestAreaHeaderFromSheets(),
      ]);
      if (p.urlFotoRestArea) {
        setRestAreaImg(formatDriveImageUrl(p.urlFotoRestArea) || '/images/rest_area_musafir_1791948465509.jpg');
      }
      if (p.urlFotoInterior) {
        setInteriorImg(formatDriveImageUrl(p.urlFotoInterior) || '/images/interior_sholat_utama_1791948463767.jpg');
      }
      if (facs && facs.length > 0) {
        setFacilities(facs);
      }
      if (header) {
        setHeaderInfo(header);
      }
    } catch {
      // fallback to defaults
    }
  };

  useEffect(() => {
    loadAllMusafirData();
    const handleUpdate = () => loadAllMusafirData();
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    Building2: <Building2 className="w-5 h-5 text-amber-400" />,
    BookOpen: <BookOpen className="w-5 h-5 text-amber-400" />,
    Droplets: <Droplets className="w-5 h-5 text-emerald-400" />,
    Bath: <Bath className="w-5 h-5 text-emerald-400" />,
    Car: <Car className="w-5 h-5 text-amber-400" />,
    Coffee: <Coffee className="w-5 h-5 text-amber-400" />,
    Zap: <Zap className="w-5 h-5 text-emerald-400" />,
    ShieldCheck: <HeartHandshake className="w-5 h-5 text-emerald-400" />,
    HeartHandshake: <HeartHandshake className="w-5 h-5 text-emerald-400" />,
    Compass: <Compass className="w-5 h-5 text-amber-400" />,
    Wifi: <Wifi className="w-5 h-5 text-emerald-400" />,
    Phone: <Phone className="w-5 h-5 text-amber-400" />,
    Clock: <Clock className="w-5 h-5 text-emerald-400" />,
    Utensils: <Utensils className="w-5 h-5 text-amber-400" />,
    CheckCircle: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
    MapPin: <MapPin className="w-5 h-5 text-emerald-400" />,
    Info: <Info className="w-5 h-5 text-amber-400" />,
  };

  return (
    <section id="musafir" className="py-16 sm:py-20 border-b border-stone-800/60">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">{headerInfo.tagline || 'Rest Area Trans-Kalimantan'}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">{headerInfo.badgeText || 'Akses 24 Jam Non-Stop'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {headerInfo.sectionTitle || 'Layanan Rest Area & Fasilitas Musafir'}
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            {headerInfo.description || 'Perjalanan jauh di rute Samarinda - Sangatta - Muara Wahau - Berau membutuhkan tempat singgah yang aman. Masjid Al-Ikhlas siap melayani kebutuhan ibadah dan istirahat Anda sepanjang waktu.'}
          </p>
        </div>
        {onOpenAdminPortal && (
          <button
            onClick={onOpenAdminPortal}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 text-xs font-medium transition-all shadow-sm cursor-pointer"
            title="Kelola & edit fasilitas di Portal Admin"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Kelola Fasilitas di Portal</span>
          </button>
        )}
      </div>

      {/* Two Photos Gallery Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative rounded-3xl overflow-hidden border border-stone-800 h-64 sm:h-72 shadow-lg group">
          <img
            src={restAreaImg}
            alt="Tempat Wudhu & Bale Rehat Musafir"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('images/rest_area')) {
                target.src = '/images/rest_area_musafir_1791948465509.jpg';
              } else {
                target.src = '/src/assets/images/rest_area_musafir_1791948465509.jpg';
              }
            }}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">Fasilitas Eksterior</span>
            <h4 className="text-base font-bold text-white">Tempat Wudhu Air Mengalir & Bale Santai</h4>
            <p className="text-xs text-stone-300 mt-0.5">Air jernih pegunungan dan serambi lapang untuk istirahat meluruskan kaki.</p>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-stone-800 h-64 sm:h-72 shadow-lg group">
          <img
            src={interiorImg}
            alt="Interior Ruang Sholat Utama"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('images/interior')) {
                target.src = '/images/interior_sholat_utama_1791948463767.jpg';
              } else {
                target.src = '/src/assets/images/interior_sholat_utama_1791948463767.jpg';
              }
            }}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">Ruang Sholat Utama</span>
            <h4 className="text-base font-bold text-white">Suasana Ibadah Khusyuk & Sejuk</h4>
            <p className="text-xs text-stone-300 mt-0.5">Karpet bersih tebal, mihrab berukir kayu, dan sirkulasi udara segar.</p>
          </div>
        </div>
      </div>

      {/* Dynamic Facilities Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-stone-900/60 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center mb-3">
                {iconMap[fac.iconName] || <Building2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">{fac.title}</h4>
              <p className="text-xs text-stone-400 leading-relaxed">{fac.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Ketersediaan</span>
              <span className="text-emerald-400 font-semibold">{fac.availability}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Panduan Fiqih Safar & Sholat Jamak Qashar */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Panduan Sholat Bagi Musafir</h3>
              <p className="text-xs text-stone-400">Rukhshah (keringanan) syariat sholat Jamak & Qashar di perjalanan</p>
            </div>
          </div>

          {/* Interactive Filter Tabs - Full width grid on mobile */}
          <div className="grid grid-cols-3 w-full sm:w-auto p-1 bg-stone-950 rounded-xl border border-stone-800">
            {MUSAFIR_PRAYER_GUIDE.map((g, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer ${
                  activeTab === idx
                    ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {idx === 0 ? 'Syarat Sah' : idx === 1 ? 'Jamak Taqdim' : 'Jamak Takhir'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 sm:p-6 mb-6">
          <h4 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{MUSAFIR_PRAYER_GUIDE[activeTab].title}</span>
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
            {MUSAFIR_PRAYER_GUIDE[activeTab].items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Doa Bepergian / Safar */}
        <div className="bg-stone-950/80 border border-stone-800/90 rounded-2xl p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            Doa Naik Kendaraan & Bepergian (Safar)
          </div>
          <p className="font-arabic text-xl sm:text-2xl text-amber-300 leading-loose my-2 text-right">
            سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ
          </p>
          <p className="text-xs sm:text-sm text-stone-300 italic font-serif mt-2">
            "Subhaanal-ladzii sakh-khoro lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa robbinaa lamunqolibuun."
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Artinya: "Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami." (QS. Az-Zukhruf: 13-14)
          </p>
        </div>
      </div>
    </section>
  );
};
