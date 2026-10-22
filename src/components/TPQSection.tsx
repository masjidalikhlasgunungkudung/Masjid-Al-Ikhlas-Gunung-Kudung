import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Calendar, Phone, MessageSquare, Award, CheckCircle2, MapPin, UserCheck } from 'lucide-react';
import { TPQ_INFO } from '../data/masjidData';
import {
  fetchTPQFromSheets,
  fetchPengaturanFromSheets,
  formatDriveImageUrl,
  TPQDataResponse,
  MASJID_DATA_UPDATED_EVENT,
} from '../services/googleSheetsService';

interface TPQSectionProps {
  onNotify: (msg: string) => void;
}

export const TPQSection: React.FC<TPQSectionProps> = ({ onNotify }) => {
  const [tpqData, setTpqData] = useState<TPQDataResponse>({
    name: TPQ_INFO.name,
    institution: TPQ_INFO.institution,
    branch: TPQ_INFO.branch,
    nslpq: TPQ_INFO.nslpq,
    address: TPQ_INFO.address,
    scheduleDays: TPQ_INFO.scheduleDays,
    scheduleTime: TPQ_INFO.scheduleTime,
    ustadzPengajar: 'Asatidz LPTKA-BKPRMI Bengalon & Guru Al-Qur\'an Gunung Kudung',
    contacts: TPQ_INFO.contacts,
    source: 'local-fallback',
  });
  const [tpqPhotoUrl, setTpqPhotoUrl] = useState<string>('/images/pengajian_kajian_masjid_1791948465248.jpg');

  const loadTpqData = useCallback(async () => {
    try {
      const [data, pengaturan] = await Promise.all([
        fetchTPQFromSheets(),
        fetchPengaturanFromSheets(),
      ]);
      setTpqData(data);
      if (pengaturan.urlFotoTPQ) {
        setTpqPhotoUrl(formatDriveImageUrl(pengaturan.urlFotoTPQ) || '/images/pengajian_kajian_masjid_1791948465248.jpg');
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    loadTpqData();
    const handleUpdate = () => {
      loadTpqData();
    };
    window.addEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(MASJID_DATA_UPDATED_EVENT, handleUpdate);
    };
  }, [loadTpqData]);

  const handleCopyPhone = (num: string) => {
    navigator.clipboard.writeText(num);
    onNotify(`Nomor HP ${num} berhasil disalin!`);
  };

  const getWaLink = (phone: string, text: string) => {
    const cleanNum = phone.replace(/^0/, '62');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="tpq" className="py-16 sm:py-20 border-b border-stone-800/60">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="text-amber-400">Pendidikan Al-Qur'an</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-400 font-normal">LPTKA - BKPRMI Bengalon</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            TPQ Al-Muhajirin Gunung Kudung
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Lembaga pendidikan Al-Qur'an resmi binaan BKPRMI di lingkungan Masjid Al-Ikhlas untuk mencetak generasi sholeh, berakhlak mulia, dan fasih membaca Kitabullah.
          </p>
        </div>

        {/* NSLPQ Badge */}
        <div className="bg-stone-900/60 border border-stone-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400">Nomor Statistik Resmi (NSLPQ)</div>
            <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
              {tpqData.nslpq || TPQ_INFO.nslpq}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Institutional Plang / Profile Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          {/* Header Plang */}
          <div className="border-b border-stone-800 pb-5 text-center">
            <div className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-800/80 rounded-full text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-3">
              LPTKA - BKPRMI KUTAI TIMUR
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-tight">
              TPQ AL - MUHAJIRIN
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Kecamatan Bengalon, Kabupaten Kutai Timur
            </p>
          </div>

          {/* Official Metadata */}
          <div className="space-y-3.5 text-xs sm:text-sm">
            {tpqData.ustadzPengajar && (
              <div className="flex items-start gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
                <UserCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Ustadz / Ustadzah Pengajar</span>
                  <span className="font-semibold text-white leading-snug">{tpqData.ustadzPengajar}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
              <Award className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Legalitas NSLPQ</span>
                <span className="font-mono font-bold text-white text-sm">{tpqData.nslpq}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
              <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Jadwal Belajar Mengaji</span>
                <span className="font-semibold text-amber-300">{tpqData.scheduleDays}</span>
                <span className="text-stone-300 block text-xs mt-0.5">Pukul {tpqData.scheduleTime}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
              <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Alamat Lengkap</span>
                <span className="text-stone-200 leading-snug">{tpqData.address}</span>
              </div>
            </div>
          </div>

          {/* Official Contacts Box */}
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Kontak Resmi Pengurus TPQ:</span>
            </div>

            <div className="space-y-2.5">
              {tpqData.contacts.map((contact, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-stone-900/80 border border-stone-800 rounded-xl"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">{contact.label}</div>
                    <div className="font-mono text-sm font-bold text-white">{contact.formatted}</div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                    <button
                      onClick={() => handleCopyPhone(contact.phone)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Salin
                    </button>
                    <a
                      href={getWaLink(contact.phone, `Assalamu'alaikum Pengurus TPQ Al-Muhajirin Gunung Kudung. Saya ingin bertanya perihal pendaftaran / info santri.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visual and Curriculum Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo banner */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-800 h-64 sm:h-72 w-full shadow-lg">
            <img
              src={tpqPhotoUrl}
              alt="Suasana Pengajian dan Pembelajaran Al-Qur'an"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('images/pengajian')) {
                  target.src = '/images/pengajian_kajian_masjid_1791948465248.jpg';
                } else {
                  target.src = '/src/assets/images/pengajian_kajian_masjid_1791948465248.jpg';
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs sm:text-sm text-stone-200">
              <strong className="text-white block font-semibold">Suasana Belajar Kondusif & Terbimbing</strong>
              Santri dibimbing secara intensif dengan metode Tilawati, hafalan surah, dan praktek ibadah harian.
            </div>
          </div>

          {/* Curriculum Pillars */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h4 className="text-base sm:text-lg font-bold text-white">
                Kurikulum & Materi Bimbingan Santri
              </h4>
            </div>

            <div className="space-y-3.5">
              {TPQ_INFO.curriculum.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-stone-950/40 border border-stone-800/80 rounded-2xl">
                  <div className="w-6 h-6 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-semibold text-emerald-300 mb-0.5">
                      {item.title}
                    </h5>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Registration / Inquiry CTA */}
            <div className="mt-6 pt-5 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-white">Ingin Mendaftarkan Putra-Putri Anda?</div>
                <div className="text-[11px] text-stone-400">Pendaftaran santri baru terbuka untuk warga Gunung Kudung dan sekitarnya.</div>
              </div>
              <a
                href={getWaLink(tpqData.contacts[0]?.phone || '082150745576', "Assalamu'alaikum Pengurus TPQ Al-Muhajirin Gunung Kudung. Saya ingin mendaftarkan anak saya belajar mengaji di TPQ.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Daftar / Konsultasi via WA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
