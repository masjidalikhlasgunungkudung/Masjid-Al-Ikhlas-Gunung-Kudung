import React from 'react';
import { MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { MASJID_INFO, TPQ_INFO } from '../data/masjidData';

interface FooterProps {
  onOpenAdminPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminPortal }) => {
  return (
    <footer className="mt-16 bg-stone-950 border-t border-stone-800 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity & Motto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-7 h-7 rounded bg-emerald-800 flex items-center justify-center text-xs">🕌</span>
              <span>{MASJID_INFO.name}</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Pusat peribadatan jemaah, pembinaan generasi Al-Qur'an, dan rest area peristirahatan musafir 24 jam di jalur strategis Trans-Kalimantan.
            </p>
            <p className="text-amber-400/90 italic font-serif">
              "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain." (HR. Ahmad)
            </p>
          </div>

          {/* Col 2: Alamat & Kontak */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Alamat & Kontak DKM
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>
                  Gunung Kudung, Desa Tepian Langsat, Kec. Bengalon, Kab. Kutai Timur (KM 145).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DKM Masjid Al-Ikhlas: {MASJID_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{MASJID_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Legalitas & Layanan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Pendidikan & Fasilitas
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Award className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>TPQ Al-Muhajirin: NSLPQ {TPQ_INFO.nslpq}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rest Area Musafir: Siaga 24 Jam Non-Stop</span>
              </li>
              <li className="text-stone-500">
                Penyaluran Zakat, Infaq & Shodaqoh dikelola amanah oleh DKM Masjid Al-Ikhlas.
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <div className="flex flex-col space-y-1.5 text-stone-300">
              <a href="#jadwal" className="hover:text-emerald-400 transition-colors">
                Jadwal Sholat 5 Waktu
              </a>
              <a href="#tpq" className="hover:text-emerald-400 transition-colors">
                TPQ Al-Muhajirin
              </a>
              <a href="#musafir" className="hover:text-emerald-400 transition-colors">
                Rest Area Musafir
              </a>
              <a href="#agenda" className="hover:text-emerald-400 transition-colors">
                Agenda Kajian
              </a>
              <a href="#donasi" className="hover:text-emerald-400 transition-colors">
                Infaq & Rekening
              </a>
              <a href="#lokasi" className="hover:text-emerald-400 transition-colors">
                Peta & GPS
              </a>
              <a href="#statistik" className="hover:text-emerald-400 transition-colors">
                Statistik Pengunjung
              </a>
              {onOpenAdminPortal && (
                <button
                  onClick={onOpenAdminPortal}
                  className="text-left text-amber-400/90 hover:text-amber-300 font-medium transition-colors pt-1 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🔐 Portal Admin DKM</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px] text-center sm:text-left">
          <div>
            &copy; 2026 DKM Masjid Al-Ikhlas Gunung Kudung KM 145. Dikelola untuk Kemakmuran Ummat.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <span>Kutai Timur, Kalimantan Timur</span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span>WITA (UTC+8)</span>
            {onOpenAdminPortal && (
              <>
                <span aria-hidden="true" className="text-stone-700">·</span>
                <button
                  onClick={onOpenAdminPortal}
                  className="text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Login Admin
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
