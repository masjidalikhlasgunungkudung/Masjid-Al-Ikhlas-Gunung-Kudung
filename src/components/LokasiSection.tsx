import React from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Copy, Phone, ShieldCheck } from 'lucide-react';
import { MASJID_INFO, ROUTE_DISTANCES, TPQ_INFO } from '../data/masjidData';

interface LokasiSectionProps {
  onNotify: (msg: string) => void;
}

export const LokasiSection: React.FC<LokasiSectionProps> = ({ onNotify }) => {
  const handleCopyCoord = () => {
    navigator.clipboard.writeText(`${MASJID_INFO.latitude}, ${MASJID_INFO.longitude}`);
    onNotify('Titik koordinat GPS berhasil disalin!');
  };

  return (
    <section id="lokasi" className="py-12 border-b border-stone-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
            <span>Akses Jalan Poros Trans-Kalimantan</span>
            <span aria-hidden="true">·</span>
            <span>Titik Peristirahatan Strategis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Peta Lokasi & Navigasi GPS
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Berada tepat di tepi lintasan utama Jalan Poros Bengalon - Muara Wahau KM 145, mudah diakses kendaraan dari segala arah.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyCoord}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium text-stone-200 bg-stone-900 border border-stone-700 hover:bg-stone-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            <span>Salin Koordinat</span>
          </button>
          <a
            href={MASJID_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span>Buka Google Maps</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-stone-900/60 border border-stone-800 rounded-3xl p-3 sm:p-4 shadow-xl">
          <div className="relative w-full h-[360px] sm:h-[430px] rounded-2xl overflow-hidden border border-stone-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1578278240566!2d117.1679831!3d0.8755248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x320959f23d0f254d%3A0x2fbd81a6b2e293a9!2sMasjid%20AL-IKHLAS%20G.%20Kudung%20KM145!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              title="Peta Lokasi Google Maps Masjid Al-Ikhlas"
            />
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {MASJID_INFO.address}, {MASJID_INFO.regency}
              </span>
            </div>
            <div className="font-mono text-emerald-300 font-semibold">
              Lat: {MASJID_INFO.latitude} | Lng: {MASJID_INFO.longitude}
            </div>
          </div>
        </div>

        {/* Distance Info & Contact */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Perkiraan Jarak & Waktu Tempuh
            </h3>
            <div className="divide-y divide-stone-800/80">
              {ROUTE_DISTANCES.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-300 font-medium block">{item.from}</span>
                    <span className="text-stone-500">{item.eta}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300 text-sm whitespace-nowrap">
                    {item.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Contacts Box */}
          <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Kontak Darurat & Pelayanan DKM</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Jika kendaraan musafir mengalami kendala atau membutuhkan bantuan saat singgah di sekitar KM 145, silakan hubungi pengurus masjid.
            </p>
            <div className="pt-2 border-t border-emerald-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Pengurus DKM Masjid Al-Ikhlas:</span>
                <a
                  href={`tel:${MASJID_INFO.phone}`}
                  className="font-mono font-bold text-amber-300 hover:underline"
                >
                  {MASJID_INFO.phone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Pengurus TPQ / Marbot:</span>
                <a
                  href={`tel:${MASJID_INFO.secondaryPhone}`}
                  className="font-mono font-bold text-emerald-300 hover:underline"
                >
                  {MASJID_INFO.secondaryPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
