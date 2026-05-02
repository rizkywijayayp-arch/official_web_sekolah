import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FooterComp } from '@/features/_global/components/footer';
import NavbarComp from '@/features/_global/components/navbar';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { PermohonanForm } from '../components/PermohonanForm';
import {
  FileText,
  Mail,
  Snowflake,
  Share2,
  MoreVertical
} from 'lucide-react';

// Map menu ID to jenisSurat key
const JENIS_SURAT_MAP: Record<number, string> = {
  1: 'keterangan_aktif',
  2: 'lomba',
  3: 'kjp_tutup',
  4: 'kjp_blokir',
  5: 'kjp_nama',
  6: 'kjp_atm',
  7: 'dispensasi',
  8: 'izin_guru',
  9: 'pengalaman',
  10: 'rekomendasi',
  11: 'rt_rw',
  12: 'domisili',
  13: 'legalisasi',
};

const menuItems = [
  { id: 1, label: 'Surat Keterangan Aktif Sekolah' },
  { id: 2, label: 'Surat Keterangan Lomba (Team)' },
  { id: 3, label: 'Surat Permohonan Tutup Buku Rekening KJP' },
  { id: 4, label: 'Surat Permohonan Buka Blokir KJP' },
  { id: 5, label: 'Surat Permohonan Perubahan Nama / Wali KJP' },
  { id: 6, label: 'Surat Permohonan Ganti Buku / ATM Bank DKI KJP' },
  { id: 7, label: 'Surat Dispensasi Siswa' },
  { id: 8, label: 'Surat Izin Guru dan Pegawai' },
  { id: 9, label: 'Surat Keterangan Pengalaman' },
  { id: 10, label: 'Surat Rekomendasi' },
  { id: 11, label: 'Surat Pengantar RT/RW' },
  { id: 12, label: 'Surat Keterangan Domisili' },
  { id: 13, label: 'Surat Permohonan Legalisasi' },
];

export const LayananPersuratanPage = () => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: schoolData } = useSchoolProfile();

  const primaryColor = schoolData?.themePrimary || '#1e6fb5';
  const schoolName = schoolData?.schoolName || 'Sekolah';
  const logoUrl = schoolData?.logoUrl;

  const handleMenuClick = (id: number) => {
    setActiveMenu(id);
    setShowForm(true);
  };

  const handleBackFromForm = () => {
    setShowForm(false);
    setActiveMenu(null);
  };

  if (showForm && activeMenu !== null) {
    const jenisSurat = JENIS_SURAT_MAP[activeMenu];
    return <PermohonanForm jenisSurat={jenisSurat} onBack={handleBackFromForm} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with high z-index */}
      <div style={{ position: 'relative', zIndex: 9999999 }}>
        <NavbarComp />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6"
      style={{
        background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
        fontFamily: "'Nunito', sans-serif"
      }}
    >
      <div
        className="w-full max-w-[380px] rounded-3xl p-5 pb-7 relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 30%, ${primaryColor}bb 60%, ${primaryColor}aa 100%)`,
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute -top-15 -right-15 w-50 h-50 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(100,180,255,0.15) 0%, transparent 70%)'
          }}
        />

        {/* Top bar */}
        <div className="flex justify-end gap-2 mb-5">
          <motion.button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Snowflake className="w-5 h-5" />
          </motion.button>
          <motion.button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6 gap-3">
          <div className="w-16 h-16 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-[3px] border-white/50 shadow-md">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={schoolName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: primaryColor }}
                >
                  <span className="text-white font-bold text-xs">
                    {schoolName.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <h1
            className="text-white text-sm font-extrabold tracking-wide text-center"
            style={{ letterSpacing: '0.5px' }}
          >
            LAYANAN ADM. PERSURATAN
          </h1>
        </div>

        {/* Menu List */}
        <div className="flex flex-col gap-2.5">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-white text-sm font-bold cursor-pointer ${
                activeMenu === item.id ? 'border-white/40' : 'border-white/25'
              }`}
              style={{
                background: activeMenu === item.id ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)',
                border: '1.5px solid',
                transition: 'all 0.2s'
              }}
              onClick={() => handleMenuClick(item.id)}
              whileTap={{ scale: 0.98 }}
            >
              <span className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </span>
              <span className="flex-1 text-left leading-tight">{item.label}</span>
              <span className="opacity-70">
                <MoreVertical className="w-4 h-4" />
              </span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-center">
          <Mail className="w-6 h-6 text-white opacity-85" />
        </div>
      </div>
    </div>
      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default LayananPersuratanPage;