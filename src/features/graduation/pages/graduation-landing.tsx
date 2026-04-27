/**
 * Kelulusan Landing Page
 * Public page for students to check graduation status with NISN
 * Features countdown timer + school photo carousel memories
 */
import { useState, useEffect, useMemo } from 'react';
import { API_CONFIG } from '@/config/api';
import { FooterComp } from '@/features/_global/components/footer';
import NavbarComp from '@/features/_global/components/navbar';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { Button } from '@/core/libs';
import { Input } from '@/core/libs';
import { Card, CardContent } from '@/core/libs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  PartyPopper
} from 'lucide-react';

interface KelulusanResult {
  id: number;
  nama: string;
  nisn: string;
  jenjang: string;
  kelas: string;
  tahunLulus: number;
  status: 'lulus' | 'tunda' | 'mengulang';
  noIjazah?: string;
  nomorSurat?: string;
}

interface AnnouncementConfig {
  tanggalPengumuman: string;
  enableCountdown: boolean;
  isOpen: boolean;
}

export function PengumumanKelulusan() {
  const { data: school } = useSchoolProfile();
  const [nisn, setNisn] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<KelulusanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [memoryPhotos, setMemoryPhotos] = useState<{id: number; url: string; caption: string}[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

  // Fetch school gallery photos from backend (default empty if not set)
  const [announcementConfig, setAnnouncementConfig] = useState<AnnouncementConfig | null>(null);
  useEffect(() => {
    const schoolId = getSchoolIdSync();
    // Fetch announcement settings from backend
    fetch(`${API_CONFIG.baseUrl}/kelulusan/announcement?schoolId=${schoolId}`, {
      headers: { 'X-API-Key': 'kira-school-2024' },
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setAnnouncementConfig(json.data);
        }
      })
      .catch(err => console.error('Gagal load pengaturan pengumuman:', err));

    fetch(`${API_CONFIG.baseUrl}/gallery?schoolId=${schoolId}&limit=8`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          const photos = json.data.slice(0, 8).map((item: any, idx: number) => ({
            id: item.id || idx,
            url: item.imageUrl || item.url || '',
            caption: item.caption || item.title || 'Galeri Sekolah'
          })).filter((p: any) => p.url);
          setMemoryPhotos(photos);
        }
      })
      .catch(err => console.error('Gagal load foto galeri:', err))
      .finally(() => setPhotosLoading(false));
  }, []);

  // Announcement date from backend, fallback ke default
  const announcementDate = useMemo(() => {
    if (announcementConfig?.tanggalPengumuman) {
      return new Date(announcementConfig.tanggalPengumuman);
    }
    return new Date('2026-06-05T08:00:00+07:00');
  }, [announcementConfig?.tanggalPengumuman]);

  // Enable countdown setting (default true)
  const showCountdown = announcementConfig?.enableCountdown !== false;

  // Countdown logic - only run if countdown is enabled
  useEffect(() => {
    // If countdown disabled, open immediately
    if (!showCountdown) {
      setIsOpen(true);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = announcementDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsOpen(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [announcementDate, showCountdown]);

  // Auto-rotate carousel (only if photos available)
  useEffect(() => {
    if (memoryPhotos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % memoryPhotos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [memoryPhotos.length]);

  // Search NISN
  const handleSearch = async () => {
    if (!nisn.trim()) {
      setError('Masukkan NISN terlebih dahulu');
      return;
    }

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/kelulusan/check/${nisn}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Data tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  };

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % memoryPhotos.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + memoryPhotos.length) % memoryPhotos.length);

  // Show countdown page with carousel
  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Navbar */}
        <div className="relative z-10 pt-6">
          <div className="max-w-7xl mx-auto px-6">
            <NavbarComp />
          </div>
        </div>

        <div className="relative z-10 min-h-[calc(100vh-100px)] flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-12">
          {/* Left: Countdown */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left max-w-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Clock className="w-4 h-4" />
              Pengumuman Kelulusan {announcementDate.getFullYear()}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            >
              Hitungan Mundur <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Kelulusan
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-lg mb-8"
            >
              Sabar ya... Pengumuman akan dibuka pada<br />
              <span className="text-white font-semibold">{announcementDate.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' })} WIB</span>
            </motion.p>

            {/* Countdown Boxes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center lg:justify-start gap-4"
            >
              {[
                { label: 'Hari', val: countdown.days },
                { label: 'Jam', val: countdown.hours },
                { label: 'Menit', val: countdown.minutes },
                { label: 'Detik', val: countdown.seconds },
              ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-20 h-24 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-4xl font-black text-white">
                      {String(unit.val).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                    {unit.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Photo Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative w-full max-w-lg"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-80 md:h-96">
              {photosLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                </div>
              ) : memoryPhotos.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 text-white/60">
                  <ImageIcon className="w-12 h-12 mb-3" />
                  <p className="text-sm font-medium">Galeri foto belum tersedia</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    src={memoryPhotos[currentPhotoIndex].url}
                    alt={memoryPhotos[currentPhotoIndex].caption}
                    className="w-full h-80 md:h-96 object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
              )}

              {/* Caption Overlay - only show when photos exist */}
              {memoryPhotos.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-semibold text-lg">
                    {memoryPhotos[currentPhotoIndex]?.caption}
                  </p>
                  <p className="text-white/60 text-sm">
                    Kenangan bersama di sekolah tercinta
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              {!photosLoading && memoryPhotos.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {memoryPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhotoIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Photo Count Badge */}
            {!photosLoading && memoryPhotos.length > 0 && (
              <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <ImageIcon className="w-3 h-3" />
                {memoryPhotos.length} Foto
              </div>
            )}
          </motion.div>
        </div>

        <FooterComp />
      </div>
    );
  }

  // Show search + result page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavbarComp />

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <PartyPopper className="w-4 h-4" />
            Pengumuman Kelulusan {announcementDate.getFullYear()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            Selamat! Waktu Yang Dinantikan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg max-w-2xl mx-auto mb-8"
          >
            Masukkan NISN kamu untuk melihat status kelulusan dan mencetak surat keterangan.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl">
              <Input
                type="text"
                placeholder="Masukkan NISN (10 digit)"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 h-12 text-lg border-0 focus:ring-0"
                maxLength={10}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-10 pb-20 relative z-20">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="overflow-hidden shadow-xl">
                {/* Status Header */}
                <div className={`p-6 text-center ${
                  result.status === 'lulus'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : result.status === 'tunda'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                    {result.status === 'lulus' ? (
                      <CheckCircle className="w-10 h-10 text-white" />
                    ) : result.status === 'tunda' ? (
                      <Clock className="w-10 h-10 text-white" />
                    ) : (
                      <XCircle className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase">
                    {result.status === 'lulus' ? 'Selamat! Anda Lulus' : result.status === 'tunda' ? 'Belum Diumumkn' : 'Tidak Lulus'}
                  </h2>
                  <p className="text-white/80 mt-2">
                    {result.status === 'lulus' ? 'Selamat atas kelulusan Anda!' : result.status === 'tunda' ? 'Pengumuman masih ditunda' : 'Silakan hubungi sekolah'}
                  </p>
                </div>

                {/* Student Info */}
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-12 h-12 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{result.nama}</h3>
                      <p className="text-gray-500 font-medium">{result.jenjang} - {result.kelas}</p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">NISN</p>
                          <p className="font-semibold text-gray-700">{result.nisn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Tahun Lulus</p>
                          <p className="font-semibold text-gray-700">{result.tahunLulus}</p>
                        </div>
                        {result.noIjazah && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">No. Ijazah</p>
                            <p className="font-semibold text-gray-700">{result.noIjazah}</p>
                          </div>
                        )}
                        {result.nomorSurat && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">No. Surat</p>
                            <p className="font-semibold text-gray-700">{result.nomorSurat}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
                    {result.status === 'lulus' && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`/verify/${result.id}`, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Verifikasi Surat
                        </Button>
                        <Button
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open(`/admin/kelulusan/print/${result.id}`, '_blank')}
                        >
                          <Printer className="w-4 h-4" />
                          Cetak Surat Keterangan
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => { setResult(null); setNisn(''); }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Cari NISN Lain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Box when no result */}
        {!result && !error && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cek Status Kelulusan</h3>
            <p className="text-gray-500">
              Masukkan NISN di kolom pencarian di atas untuk melihat hasil kelulusan Anda.
            </p>
          </motion.div>
        )}
      </main>

      <FooterComp />
    </div>
  );
}
