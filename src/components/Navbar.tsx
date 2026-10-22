import React, { useState } from 'react';
import { Menu, X, HeartHandshake, Lock } from 'lucide-react';
import { MASJID_INFO } from '../data/masjidData';

interface NavbarProps {
  onOpenDonasi: () => void;
  onOpenAdminPortal: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDonasi, onOpenAdminPortal, onNavigateSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    if (onNavigateSection) {
      e.preventDefault();
      onNavigateSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16 sm:h-18">
          {/* Zone 1: Single element wordmark */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group">
            <span className="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-600/40 flex items-center justify-center text-emerald-300 text-sm font-arabic group-hover:bg-emerald-700 transition-colors shrink-0">
              🕌
            </span>
            <span className="truncate">{MASJID_INFO.shortName}</span>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-300">
            <a
              href="#jadwal"
              onClick={(e) => handleNavClick('jadwal', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Jadwal Sholat
            </a>
            <a
              href="#artikel"
              onClick={(e) => handleNavClick('artikel', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Artikel & Kabar
            </a>
            <a
              href="#tpq"
              onClick={(e) => handleNavClick('tpq', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              TPQ Al-Muhajirin
            </a>
            <a
              href="#musafir"
              onClick={(e) => handleNavClick('musafir', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Rest Area Musafir
            </a>
            <a
              href="#agenda"
              onClick={(e) => handleNavClick('agenda', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Agenda & Kajian
            </a>
            <a
              href="#donasi"
              onClick={(e) => handleNavClick('donasi', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Kas & Infaq
            </a>
            <a
              href="#lokasi"
              onClick={(e) => handleNavClick('lokasi', e)}
              className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
            >
              Peta Lokasi
            </a>
          </nav>

          {/* Zone 3: Actions (Infaq & Portal Admin) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenDonasi}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Infaq & Kas Masjid</span>
            </button>

            {/* Desktop Admin Portal Shortcut */}
            <button
              onClick={onOpenAdminPortal}
              className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-900 border border-transparent hover:border-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Portal Admin DKM Masjid Al-Ikhlas"
              aria-label="Portal Admin"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger toggle (garis tiga) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Menu Garis Tiga) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          <div className="text-xs text-stone-400 px-2 py-1 border-b border-stone-800/80 mb-2">
            Gunung Kudung · Poros Muara Wahau KM 145
          </div>
          <a
            href="#jadwal"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('jadwal', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            Jadwal Sholat Real-Time
          </a>
          <a
            href="#artikel"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('artikel', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            Artikel & Kabar Warta
          </a>
          <a
            href="#tpq"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('tpq', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            TPQ Al-Muhajirin (Senin - Sabtu)
          </a>
          <a
            href="#musafir"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('musafir', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            Layanan Rest Area Musafir 24 Jam
          </a>
          <a
            href="#agenda"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('agenda', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            Agenda Jum'at & Pengajian Rutin
          </a>
          <a
            href="#donasi"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('donasi', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            Infaq Kas & Rekening DKM Masjid
          </a>
          <a
            href="#lokasi"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleNavClick('lokasi', e);
            }}
            className="block px-3 py-2 text-sm text-stone-200 hover:text-emerald-400 hover:bg-stone-900 rounded-lg transition-colors"
          >
            Peta Lokasi & Navigasi GPS
          </a>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonasi();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Infaq & Kas DKM Masjid</span>
            </button>
          </div>

          {/* Portal Admin DKM (Menu Garis Tiga) */}
          <div className="pt-2 border-t border-stone-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminPortal();
              }}
              className="w-full px-3.5 py-3 text-xs font-semibold bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 rounded-xl transition-all flex items-center justify-between cursor-pointer group shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-stone-200 group-hover:text-amber-300 font-bold text-xs">
                    Portal Admin DKM
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    Kelola QRIS, Kas, Jadwal, TPQ & Sheets
                  </span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-stone-800 group-hover:bg-amber-400 group-hover:text-stone-950 text-amber-300 rounded-md font-mono transition-colors">
                Masuk
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
