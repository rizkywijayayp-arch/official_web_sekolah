/**
 * Cek Status Permohonan - Public Ticket Tracking Page
 * Pengguna bisa cek status permohonan menggunakan nomor tiket/ID
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FooterComp } from '@/features/_global/components/footer';
import NavbarComp from '@/features/_global/components/navbar';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import {
  Search, CheckCircle, Clock, XCircle, FileCheck, AlertCircle,
  ChevronLeft, RefreshCw, Download, ExternalLink, Loader2,
  FileText, Calendar, User, Hash
} from 'lucide-react';

type StatusType = 'pending' | 'diproses' | 'diterima' | 'ditolak' | 'selesai';

const STATUS_CONFIG: Record<StatusType, {
  icon: React.ReactNode;
  bg: string;
  text: string;
  label: string;
  desc: string;
}> = {
  pending: {
    icon: <Clock className="w-5 h-5" />,
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
    label: 'DALAM ANTRIAN',
    desc: 'Permohonan Anda sedang menunggu untuk ditinjau oleh admin.',
  },
  diproses: {
    icon: <FileCheck className="w-5 h-5" />,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    label: 'SEDANG DIPROSES',
    desc: 'Permohonan sedang diproses oleh tim kami.',
  },
  diterima: {
    icon: <CheckCircle className="w-5 h-5" />,
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    label: 'DITERIMA',
    desc: 'Permohonan telah diterima dan disetujui.',
  },
  ditolak: {
    icon: <XCircle className="w-5 h-5" />,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    label: 'DITOLAK',
    desc: 'Mohon maaf, permohonan ditolak. Lihat catatan untuk informasi lebih lanjut.',
  },
  selesai: {
    icon: <CheckCircle className="w-5 h-5" />,
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    label: 'SELESAI',
    desc: 'Permohonan telah selesai dan siap diambil atau telah dikirim.',
  },
};

interface TrackData {
  id: number;
  kodeTiket: string;
  jenisSurat: string;
  jenisSuratLabel: string;
  status: StatusType;
  tanggalPengajuan: string;
  tanggalProses?: string;
  tanggalSelesai?: string;
  catatanAdmin?: string;
  nomorSurat?: string;
  dataPemohon?: Record<string, string>;
  fileSuratUrl?: string;
  schoolName?: string;
}

export const CekStatusPage = () => {
  const [ticketInput, setTicketInput] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [data, setData] = useState<TrackData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: schoolData } = useSchoolProfile();

  const primaryColor = schoolData?.themePrimary || '#1e6fb5';
  const schoolName = schoolData?.schoolName || 'Sekolah';
  const logoUrl = schoolData?.logoUrl;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // Try by kodeTiket first, then by numeric ID
      const res = await fetch(
        `${API_CONFIG.baseUrl}/permohonan/track/${encodeURIComponent(ticketInput.trim())}`
      );
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
        setTicketId(ticketInput.trim());
      } else {
        setError(result.message || 'Permohonan tidak ditemukan. Pastikan nomor tiket/ID benar.');
      }
    } catch {
      setError('Gagal mengambil data. Silakan coba beberapa saat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (ticketId) {
      const input = ticketId;
      setTicketInput(input);
      setTicketId(null);
      setData(null);
      setError(null);
      // Trigger search
      setTimeout(async () => {
        setIsLoading(true);
        try {
          const res = await fetch(
            `${API_CONFIG.baseUrl}/permohonan/track/${encodeURIComponent(input)}`
          );
          const result = await res.json();
          if (result.success && result.data) setData(result.data);
          else setError(result.message || 'Permohonan tidak ditemukan.');
        } catch {
          setError('Gagal mengambil data.');
        } finally {
          setIsLoading(false);
        }
      }, 50);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const statusCfg = data ? STATUS_CONFIG[data.status as StatusType] || STATUS_CONFIG.pending : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <div style={{ position: 'relative', zIndex: 9999999 }}>
        <NavbarComp />
      </div>

      {/* Header */}
      <div
        className="relative"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)` }}
      >
        <div className="max-w-lg mx-auto px-4 py-8">
          <Link
            to="/layanan-persuratan"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Layanan
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              {logoUrl ? (
                <img src={logoUrl} alt={schoolName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{schoolName.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <p className="text-white/70 text-xs">{schoolName}</p>
              <h1 className="text-white font-bold text-sm tracking-wide">CEK STATUS PERMOHONAN</h1>
            </div>
          </div>

          <h2 className="text-white text-xl font-extrabold mb-2">
            Lacak Permohonan Surat
          </h2>
          <p className="text-white/75 text-sm mb-6">
            Masukkan ID Permohonan atau Nomor Tiket yang Anda terima saat mengirim permohonan.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Contoh: 12345 atau TRK-ABC123"
              className="w-full pl-12 pr-28 py-4 rounded-2xl border-0 shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-white/30"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !ticketInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-white font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isLoading ? 'Mencari...' : 'Lacak'}
            </button>
          </form>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 60" className="w-full h-10" preserveAspectRatio="none">
            <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </div>

      {/* Result Area */}
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-red-900 mb-1">Tidak Ditemukan</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <button onClick={handleRetry} className="text-red-500 hover:text-red-700 p-1">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-red-100">
              <p className="text-xs text-gray-500 mb-2">Tips:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Pastikan ID permohonan yang Anda masukkan benar</li>
                <li>• ID permohonan terlihat seperti: <code className="bg-gray-100 px-1 rounded">#12345</code></li>
                <li>• Hubungi admin sekolah jika masalah berlanjut</li>
              </ul>
            </div>
          </div>
        )}

        {/* Data */}
        {data && statusCfg && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Status Banner */}
            <div className={`p-5 ${statusCfg.bg} border-b`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusCfg.bg} border ${statusCfg.text}`}>
                  {statusCfg.icon}
                </div>
                <div>
                  <p className={`font-black text-sm tracking-wider ${statusCfg.text}`}>{statusCfg.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{statusCfg.desc}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              {/* Ticket ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">ID Permohonan</span>
                </div>
                <span className="font-bold text-sm">#{data.id || data.kodeTiket}</span>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Jenis Surat</p>
                    <p className="font-semibold text-sm">{data.jenisSuratLabel || data.jenisSurat}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Tanggal Pengajuan</p>
                    <p className="font-semibold text-sm">{formatDate(data.tanggalPengajuan)}</p>
                  </div>
                </div>

                {data.tanggalProses && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Tanggal Diproses</p>
                      <p className="font-semibold text-sm">{formatDate(data.tanggalProses)}</p>
                    </div>
                  </div>
                )}

                {data.nomorSurat && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <FileCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-green-600">Nomor Surat</p>
                      <p className="font-bold text-sm text-green-800">{data.nomorSurat}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Catatan Admin */}
              {data.catatanAdmin && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Catatan Admin</p>
                  <p className="text-sm text-amber-800">{data.catatanAdmin}</p>
                </div>
              )}

              {/* Download Surat */}
              {data.fileSuratUrl && data.status === 'selesai' && (
                <a
                  href={data.fileSuratUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Unduh Surat
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {/* Timeline */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Riwayat</p>
                <div className="space-y-0">
                  {[
                    { label: 'Pengajuan diajukan', date: data.tanggalPengajuan, done: true, active: data.status === 'pending' },
                    { label: 'Sedang diproses', date: data.tanggalProses, done: ['diproses', 'diterima', 'selesai'].includes(data.status), active: data.status === 'diproses' },
                    { label: 'Selesai / Ditolak', date: data.tanggalSelesai || data.catatanAdmin ? data.tanggalPengajuan : undefined, done: ['selesai', 'ditolak'].includes(data.status), active: ['selesai', 'ditolak'].includes(data.status) },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          step.done
                            ? step.active
                              ? 'bg-blue-500 text-white'
                              : 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {step.done ? <CheckCircle className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                        </div>
                        {i < 2 && <div className={`w-0.5 h-6 ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />}
                      </div>
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${step.done ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        {step.date && <p className="text-xs text-gray-400">{formatDate(step.date)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <Link
                to="/layanan-persuratan"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Ajukan Permohonan Baru
              </Link>
            </div>
          </div>
        )}

        {/* Empty state (no search yet) */}
        {!data && !error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-600 mb-1">Cek Status Permohonan</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Masukkan nomor tiket atau ID permohonan Anda di atas untuk melihat status.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <FooterComp />
    </div>
  );
};

export default CekStatusPage;
