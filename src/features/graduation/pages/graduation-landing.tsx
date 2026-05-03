// /**
//  * Kelulusan Landing Page
//  * Public page for students to check graduation status with NISN
//  * Features countdown timer + school photo carousel memories
//  */
// import { useState, useEffect, useMemo } from 'react';
// import { API_CONFIG } from '@/config/api';
// import { FooterComp } from '@/features/_global/components/footer';
// import NavbarComp from '@/features/_global/components/navbar';
// import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';
// import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
// import { Button } from '@/core/libs';
// import { Input } from '@/core/libs';
// import { Card, CardContent } from '@/core/libs';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Search,
//   Award,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Loader2,
//   Printer,
//   ChevronLeft,
//   ChevronRight,
//   Image as ImageIcon,
//   PartyPopper
// } from 'lucide-react';

// interface KelulusanResult {
//   id: number;
//   nama: string;
//   nisn: string;
//   jenjang: string;
//   kelas: string;
//   tahunLulus: number;
//   status: 'lulus' | 'tunda' | 'mengulang';
//   noIjazah?: string;
//   nomorSurat?: string;
// }

// interface AnnouncementConfig {
//   tanggalPengumuman: string;
//   enableCountdown: boolean;
//   isOpen: boolean;
// }

// export function PengumumanKelulusan() {
//   const { data: school } = useSchoolProfile();
//   const [nisn, setNisn] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [result, setResult] = useState<KelulusanResult | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
//   const [memoryPhotos, setMemoryPhotos] = useState<{id: number; url: string; caption: string}[]>([]);
//   const [photosLoading, setPhotosLoading] = useState(true);

//   // Fetch school gallery photos from backend (default empty if not set)
//   const [announcementConfig, setAnnouncementConfig] = useState<AnnouncementConfig | null>(null);
//   useEffect(() => {
//     const schoolId = getSchoolIdSync();
//     // Fetch announcement settings from backend
//     fetch(`${API_CONFIG.baseUrl}/kelulusan/announcement?schoolId=${schoolId}`, {
//       headers: { 'X-API-Key': 'kira-school-2024' },
//     })
//       .then(res => res.json())
//       .then(json => {
//         if (json.success && json.data) {
//           setAnnouncementConfig(json.data);
//         }
//       })
//       .catch(err => console.error('Gagal load pengaturan pengumuman:', err));

//     fetch(`${API_CONFIG.baseUrl}/gallery?schoolId=${schoolId}&limit=8`)
//       .then(res => res.json())
//       .then(json => {
//         if (json.success && json.data && json.data.length > 0) {
//           const photos = json.data.slice(0, 8).map((item: any, idx: number) => ({
//             id: item.id || idx,
//             url: item.imageUrl || item.url || '',
//             caption: item.caption || item.title || 'Galeri Sekolah'
//           })).filter((p: any) => p.url);
//           setMemoryPhotos(photos);
//         }
//       })
//       .catch(err => console.error('Gagal load foto galeri:', err))
//       .finally(() => setPhotosLoading(false));
//   }, []);

//   // Announcement date from backend, fallback ke default
//   const announcementDate = useMemo(() => {
//     if (announcementConfig?.tanggalPengumuman) {
//       return new Date(announcementConfig.tanggalPengumuman);
//     }
//     return new Date('2026-06-05T08:00:00+07:00');
//   }, [announcementConfig?.tanggalPengumuman]);

//   // Enable countdown setting (default true)
//   const showCountdown = announcementConfig?.enableCountdown !== false;

//   // Countdown logic - only run if countdown is enabled
//   useEffect(() => {
//     // If countdown disabled, open immediately
//     if (!showCountdown) {
//       setIsOpen(true);
//       return;
//     }

//     const updateCountdown = () => {
//       const now = new Date();
//       const diff = announcementDate.getTime() - now.getTime();

//       if (diff <= 0) {
//         setIsOpen(true);
//         setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       setCountdown({
//         days: Math.floor(diff / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
//         minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
//         seconds: Math.floor((diff % (1000 * 60)) / 1000),
//       });
//     };

//     updateCountdown();
//     const timer = setInterval(updateCountdown, 1000);
//     return () => clearInterval(timer);
//   }, [announcementDate, showCountdown]);

//   // Auto-rotate carousel (only if photos available)
//   useEffect(() => {
//     if (memoryPhotos.length === 0) return;
//     const interval = setInterval(() => {
//       setCurrentPhotoIndex((prev) => (prev + 1) % memoryPhotos.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [memoryPhotos.length]);

//   // Search NISN
//   const handleSearch = async () => {
//     if (!nisn.trim()) {
//       setError('Masukkan NISN terlebih dahulu');
//       return;
//     }

//     setIsSearching(true);
//     setError(null);
//     setResult(null);

//     try {
//       const response = await fetch(`${API_CONFIG.baseUrl}/kelulusan/check/${nisn}`);
//       const data = await response.json();

//       if (data.success) {
//         setResult(data.data);
//       } else {
//         setError(data.message || 'Data tidak ditemukan');
//       }
//     } catch (err) {
//       setError('Terjadi kesalahan. Silakan coba lagi.');
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % memoryPhotos.length);
//   const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + memoryPhotos.length) % memoryPhotos.length);

//   // Show countdown page with carousel
//   if (!isOpen) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
//         {/* Background Effects */}
//         <div className="absolute inset-0">
//           <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
//         </div>

//         <NavbarComp />

//         <div className="relative z-10 min-h-[calc(100vh-100px)] flex flex-col lg:flex-row items-center justify-center gap-8 px-6 py-12">
//           {/* Left: Countdown */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="text-center lg:text-left max-w-lg"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6"
//             >
//               <Clock className="w-4 h-4" />
//               Pengumuman Kelulusan {announcementDate.getFullYear()}
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
//             >
//               Hitungan Mundur <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
//                 Kelulusan
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-slate-400 text-lg mb-8"
//             >
//               Sabar ya... Pengumuman akan dibuka pada<br />
//               <span className="text-white font-semibold">{announcementDate.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Jakarta' })} WIB</span>
//             </motion.p>

//             {/* Countdown Boxes */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="flex justify-center lg:justify-start gap-4"
//             >
//               {[
//                 { label: 'Hari', val: countdown.days },
//                 { label: 'Jam', val: countdown.hours },
//                 { label: 'Menit', val: countdown.minutes },
//                 { label: 'Detik', val: countdown.seconds },
//               ].map((unit, i) => (
//                 <div key={i} className="flex flex-col items-center">
//                   <div className="w-20 h-24 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
//                     <span className="text-4xl font-black text-white">
//                       {String(unit.val).padStart(2, '0')}
//                     </span>
//                   </div>
//                   <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
//                     {unit.label}
//                   </span>
//                 </div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Right: Photo Carousel */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//             className="relative w-full max-w-lg"
//           >
//             <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-80 md:h-96">
//               {photosLoading ? (
//                 <div className="w-full h-full flex items-center justify-center bg-white/10">
//                   <Loader2 className="w-8 h-8 animate-spin text-white/50" />
//                 </div>
//               ) : memoryPhotos.length === 0 ? (
//                 <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 text-white/60">
//                   <ImageIcon className="w-12 h-12 mb-3" />
//                   <p className="text-sm font-medium">Galeri foto belum tersedia</p>
//                 </div>
//               ) : (
//                 <AnimatePresence mode="wait">
//                   <motion.img
//                     key={currentPhotoIndex}
//                     src={memoryPhotos[currentPhotoIndex].url}
//                     alt={memoryPhotos[currentPhotoIndex].caption}
//                     className="w-full h-80 md:h-96 object-cover"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                   />
//                 </AnimatePresence>
//               )}

//               {/* Caption Overlay - only show when photos exist */}
//               {memoryPhotos.length > 0 && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
//                   <p className="text-white font-semibold text-lg">
//                     {memoryPhotos[currentPhotoIndex]?.caption}
//                   </p>
//                   <p className="text-white/60 text-sm">
//                     Kenangan bersama di sekolah tercinta
//                   </p>
//                 </div>
//               )}

//               {/* Navigation Buttons */}
//               <button
//                 onClick={prevPhoto}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={nextPhoto}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>

//               {/* Dots */}
//               {!photosLoading && memoryPhotos.length > 0 && (
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//                   {memoryPhotos.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setCurrentPhotoIndex(i)}
//                       className={`w-2 h-2 rounded-full transition-all ${
//                         i === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/40'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Photo Count Badge */}
//             {!photosLoading && memoryPhotos.length > 0 && (
//               <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
//                 <ImageIcon className="w-3 h-3" />
//                 {memoryPhotos.length} Foto
//               </div>
//             )}
//           </motion.div>
//         </div>

//         <FooterComp />
//       </div>
//     );
//   }

//   // Show search + result page
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <NavbarComp />

//       {/* Hero */}
//       <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20 px-6 overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
//         </div>
//         <div className="relative z-10 max-w-4xl mx-auto text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-widest mb-6"
//           >
//             <PartyPopper className="w-4 h-4" />
//             Pengumuman Kelulusan {announcementDate.getFullYear()}
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="text-4xl md:text-5xl font-black text-white mb-4"
//           >
//             Selamat! Waktu Yang Dinantikan
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-blue-100 text-lg max-w-2xl mx-auto mb-8"
//           >
//             Masukkan NISN kamu untuk melihat status kelulusan dan mencetak surat keterangan.
//           </motion.p>

//           {/* Search Box */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="max-w-md mx-auto"
//           >
//             <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl">
//               <Input
//                 type="text"
//                 placeholder="Masukkan NISN (10 digit)"
//                 value={nisn}
//                 onChange={(e) => setNisn(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 className="flex-1 h-12 text-lg border-0 focus:ring-0"
//                 maxLength={10}
//               />
//               <Button
//                 onClick={handleSearch}
//                 disabled={isSearching}
//                 className="h-12 px-6 bg-blue-600 hover:bg-blue-700"
//               >
//                 {isSearching ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <Search className="w-5 h-5" />
//                 )}
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       <main className="max-w-4xl mx-auto px-6 -mt-10 pb-20 relative z-20">
//         {/* Error Message */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3"
//             >
//               <XCircle className="w-5 h-5 flex-shrink-0" />
//               <p>{error}</p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Result Card */}
//         <AnimatePresence>
//           {result && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <Card className="overflow-hidden shadow-xl">
//                 {/* Status Header */}
//                 <div className={`p-6 text-center ${
//                   result.status === 'lulus'
//                     ? 'bg-gradient-to-r from-green-500 to-emerald-600'
//                     : result.status === 'tunda'
//                     ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
//                     : 'bg-gradient-to-r from-red-500 to-rose-600'
//                 }`}>
//                   <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
//                     {result.status === 'lulus' ? (
//                       <CheckCircle className="w-10 h-10 text-white" />
//                     ) : result.status === 'tunda' ? (
//                       <Clock className="w-10 h-10 text-white" />
//                     ) : (
//                       <XCircle className="w-10 h-10 text-white" />
//                     )}
//                   </div>
//                   <h2 className="text-3xl font-black text-white uppercase">
//                     {result.status === 'lulus' ? 'Selamat! Anda Lulus' : result.status === 'tunda' ? 'Belum Diumumkn' : 'Tidak Lulus'}
//                   </h2>
//                   <p className="text-white/80 mt-2">
//                     {result.status === 'lulus' ? 'Selamat atas kelulusan Anda!' : result.status === 'tunda' ? 'Pengumuman masih ditunda' : 'Silakan hubungi sekolah'}
//                   </p>
//                 </div>

//                 {/* Student Info */}
//                 <CardContent className="p-6">
//                   <div className="flex items-start gap-6">
//                     <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
//                       <Award className="w-12 h-12 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-2xl font-bold text-gray-900">{result.nama}</h3>
//                       <p className="text-gray-500 font-medium">{result.jenjang} - {result.kelas}</p>

//                       <div className="grid grid-cols-2 gap-4 mt-4">
//                         <div>
//                           <p className="text-xs text-gray-400 uppercase tracking-wider">NISN</p>
//                           <p className="font-semibold text-gray-700">{result.nisn}</p>
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-400 uppercase tracking-wider">Tahun Lulus</p>
//                           <p className="font-semibold text-gray-700">{result.tahunLulus}</p>
//                         </div>
//                         {result.noIjazah && (
//                           <div>
//                             <p className="text-xs text-gray-400 uppercase tracking-wider">No. Ijazah</p>
//                             <p className="font-semibold text-gray-700">{result.noIjazah}</p>
//                           </div>
//                         )}
//                         {result.nomorSurat && (
//                           <div>
//                             <p className="text-xs text-gray-400 uppercase tracking-wider">No. Surat</p>
//                             <p className="font-semibold text-gray-700">{result.nomorSurat}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
//                     {result.status === 'lulus' && (
//                       <>
//                         <Button
//                           variant="outline"
//                           onClick={() => window.open(`/verify/${result.id}`, '_blank')}
//                           className="flex items-center gap-2"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                           Verifikasi Surat
//                         </Button>
//                         <Button
//                           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
//                           onClick={() => window.open(`/admin/kelulusan/print/${result.id}`, '_blank')}
//                         >
//                           <Printer className="w-4 h-4" />
//                           Cetak Surat Keterangan
//                         </Button>
//                       </>
//                     )}
//                     <Button
//                       variant="ghost"
//                       onClick={() => { setResult(null); setNisn(''); }}
//                       className="flex items-center gap-2"
//                     >
//                       <RefreshCw className="w-4 h-4" />
//                       Cari NISN Lain
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Info Box when no result */}
//         {!result && !error && !isSearching && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="bg-white rounded-2xl shadow-lg p-8 text-center"
//           >
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="w-8 h-8 text-blue-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Cek Status Kelulusan</h3>
//             <p className="text-gray-500">
//               Masukkan NISN di kolom pencarian di atas untuk melihat hasil kelulusan Anda.
//             </p>
//           </motion.div>
//         )}
//       </main>

//       <FooterComp />
//     </div>
//   );
// }



/**
 * Kelulusan Landing Page
 * Public page for students to check graduation status with NISN
 * Features countdown timer + school photo carousel memories
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
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
  PartyPopper,
  RefreshCw,
  GraduationCap,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface PhotoItem {
  id: number;
  url: string;
  caption: string;
}

// ─── Countdown Box ─────────────────────────────────────────────────────────

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[72px] h-[76px] flex items-center justify-center rounded-2xl bg-white/[0.07] border border-white/[0.12] overflow-hidden">
        {/* subtle top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
        <span className="text-[32px] font-black text-white tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300/60">
        {label}
      </span>
    </div>
  );
}

// ─── Photo Carousel ────────────────────────────────────────────────────────

function PhotoCarousel({
  photos,
  loading,
  currentIndex,
  onPrev,
  onNext,
  onDot,
}: {
  photos: PhotoItem[];
  loading: boolean;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (i: number) => void;
}) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 h-[320px] md:h-[380px] shadow-2xl">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white/30" />
        </div>
      ) : photos.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/30">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <ImageIcon className="w-8 h-8" />
          </div>
          <p className="text-sm">Galeri foto belum tersedia</p>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={photos[currentIndex].url}
              alt={photos[currentIndex].caption}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-white font-semibold text-base leading-snug">
              {photos[currentIndex].caption}
            </p>
            <p className="text-white/50 text-xs mt-1">Kenangan bersama di sekolah tercinta</p>
          </div>

          {/* Photo count badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/10 text-white/80 px-3 py-1.5 rounded-full text-xs font-semibold">
            <ImageIcon className="w-3 h-3" />
            {currentIndex + 1} / {photos.length}
          </div>

          {/* Nav buttons */}
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-[52px] left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => onDot(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Info Pill ─────────────────────────────────────────────────────────────

function InfoPill({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white/85">{title}</p>
        <p className="text-xs text-white/40 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ─── Status Result Card ────────────────────────────────────────────────────

function ResultCard({
  result,
  onReset,
}: {
  result: KelulusanResult;
  onReset: () => void;
}) {
  const isLulus = result.status === 'lulus';
  const isTunda = result.status === 'tunda';

  const statusConfig = {
    lulus: {
      gradient: 'from-emerald-600 to-green-700',
      icon: CheckCircle,
      title: 'Selamat! Dinyatakan Lulus',
      sub: 'Selamat atas pencapaian luar biasamu!',
    },
    tunda: {
      gradient: 'from-amber-500 to-orange-600',
      icon: Clock,
      title: 'Pengumuman Ditunda',
      sub: 'Harap hubungi pihak sekolah untuk info lebih lanjut.',
    },
    mengulang: {
      gradient: 'from-rose-600 to-red-700',
      icon: XCircle,
      title: 'Belum Dinyatakan Lulus',
      sub: 'Silakan hubungi wali kelas atau tata usaha sekolah.',
    },
  }[result.status];

  const StatusIcon = statusConfig.icon;
  const fields = [
    { label: 'NISN', value: result.nisn },
    { label: 'Kelas', value: result.kelas },
    { label: 'Jenjang', value: result.jenjang },
    { label: 'Tahun Lulus', value: String(result.tahunLulus) },
    ...(result.noIjazah ? [{ label: 'No. Ijazah', value: result.noIjazah }] : []),
    ...(result.nomorSurat ? [{ label: 'No. Surat', value: result.nomorSurat }] : []),
  ];

  const initials = result.nama
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className="overflow-hidden shadow-2xl border-0 rounded-3xl">
        {/* Status header */}
        <div className={`bg-gradient-to-br ${statusConfig.gradient} px-8 py-10 text-center`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <StatusIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">{statusConfig.title}</h2>
          <p className="text-white/70 text-sm mt-1">{statusConfig.sub}</p>
        </div>

        <CardContent className="p-0">
          {/* Student identity strip */}
          <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-black text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{result.nama}</h3>
              <p className="text-slate-400 text-sm mt-0.5">
                {result.jenjang} · {result.kelas}
              </p>
            </div>
          </div>

          {/* Fields grid */}
          <div className="grid grid-cols-2 gap-px bg-slate-100 border-b border-slate-100">
            {fields.map(({ label, value }) => (
              <div key={label} className="bg-white px-6 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {label}
                </p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-8 py-5 flex flex-wrap gap-2.5 bg-white">
            {isLulus && (
              <>
                <Button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm h-10 px-5"
                  onClick={() => window.open(`/admin/kelulusan/print/${result.id}`, '_blank')}
                >
                  <Printer className="w-4 h-4" />
                  Cetak Surat Keterangan
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-xl text-sm h-10 px-5 border-slate-200"
                  onClick={() => window.open(`/verify/${result.id}`, '_blank')}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verifikasi Surat
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-xl text-sm h-10 px-4 text-slate-500"
              onClick={onReset}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Cari NISN Lain
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export function PengumumanKelulusan() {
  const { data: school } = useSchoolProfile();

  // Countdown state
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Photo carousel state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [memoryPhotos, setMemoryPhotos] = useState<PhotoItem[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);

  // Search state
  const [nisn, setNisn] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<KelulusanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Config from backend
  const [announcementConfig, setAnnouncementConfig] = useState<AnnouncementConfig | null>(null);

  // ── Fetch config + photos ──────────────────────────────────────────────
  useEffect(() => {
    const schoolId = getSchoolIdSync();

    fetch(`${API_CONFIG.baseUrl}/kelulusan/announcement?schoolId=${schoolId}`, {
      headers: { 'X-API-Key': 'kira-school-2024' },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setAnnouncementConfig(json.data);
      })
      .catch(() => {});

    fetch(`${API_CONFIG.baseUrl}/gallery?schoolId=${schoolId}&limit=8`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          const photos: PhotoItem[] = json.data
            .slice(0, 8)
            .map((item: any, idx: number) => ({
              id: item.id ?? idx,
              url: item.imageUrl || item.url || '',
              caption: item.caption || item.title || 'Galeri Sekolah',
            }))
            .filter((p: PhotoItem) => p.url);
          setMemoryPhotos(photos);
        }
      })
      .catch(() => {})
      .finally(() => setPhotosLoading(false));
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────
  const announcementDate = useMemo(() => {
    if (announcementConfig?.tanggalPengumuman) {
      return new Date(announcementConfig.tanggalPengumuman);
    }
    return new Date('2026-06-05T08:00:00+07:00');
  }, [announcementConfig?.tanggalPengumuman]);

  const showCountdown = announcementConfig?.enableCountdown !== false;

  const formattedDate = announcementDate.toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  });

  // ── Countdown logic ────────────────────────────────────────────────────
  useEffect(() => {
    if (!showCountdown) {
      setIsOpen(true);
      return;
    }

    const update = () => {
      const diff = announcementDate.getTime() - Date.now();
      if (diff <= 0) {
        setIsOpen(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [announcementDate, showCountdown]);

  // ── Photo auto-rotate ──────────────────────────────────────────────────
  useEffect(() => {
    if (!memoryPhotos.length) return;
    const id = setInterval(
      () => setCurrentPhotoIndex((p) => (p + 1) % memoryPhotos.length),
      4000
    );
    return () => clearInterval(id);
  }, [memoryPhotos.length]);

  // ── Search handler ─────────────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    const trimmed = nisn.trim();
    if (!trimmed) {
      setError('Masukkan NISN terlebih dahulu.');
      return;
    }
    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/kelulusan/check/${trimmed}`);
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Data tidak ditemukan.');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSearching(false);
    }
  }, [nisn]);

  const resetSearch = () => {
    setResult(null);
    setError(null);
    setNisn('');
  };

  // ════════════════════════════════════════════════════════════════════════
  // COUNTDOWN PAGE
  // ════════════════════════════════════════════════════════════════════════
  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[320px] h-[320px] bg-purple-600/15 rounded-full blur-[80px] animate-pulse [animation-delay:1.2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]" />
        </div>

        <NavbarComp />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">

          {/* Top: Title + countdown side by side */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">

            {/* Left: Title block */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 min-w-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/25 text-blue-300 text-[11px] font-bold uppercase tracking-widest mb-5"
              >
                <Clock className="w-3.5 h-3.5" />
                Pengumuman Kelulusan {announcementDate.getFullYear()}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl xl:text-6xl font-black text-white leading-[1.1] mb-5"
              >
                Menuju Hari
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                  yang Dinantikan
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-400 text-base leading-relaxed max-w-sm mb-8"
              >
                Pengumuman kelulusan akan dibuka pada{' '}
                <span className="text-white font-semibold">{formattedDate} WIB</span>.
                Tetap semangat!
              </motion.p>

              {/* Info pills */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <InfoPill
                  icon={GraduationCap}
                  title="Cek NISN"
                  desc="Siapkan NISN 10 digit"
                  color="bg-blue-500/15 text-blue-400"
                />
                <InfoPill
                  icon={FileText}
                  title="Cetak Surat"
                  desc="Langsung dari platform"
                  color="bg-emerald-500/15 text-emerald-400"
                />
                <InfoPill
                  icon={ShieldCheck}
                  title="Verifikasi"
                  desc="Surat dapat diverifikasi"
                  color="bg-purple-500/15 text-purple-400"
                />
              </motion.div>
            </motion.div>

            {/* Right: Countdown boxes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-6 lg:items-end"
            >
              <div className="flex gap-3">
                <CountdownUnit value={countdown.days} label="Hari" />
                <div className="text-white/30 text-3xl font-black self-center pb-5">:</div>
                <CountdownUnit value={countdown.hours} label="Jam" />
                <div className="text-white/30 text-3xl font-black self-center pb-5">:</div>
                <CountdownUnit value={countdown.minutes} label="Menit" />
                <div className="text-white/30 text-3xl font-black self-center pb-5">:</div>
                <CountdownUnit value={countdown.seconds} label="Detik" />
              </div>

              <div className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-center">
                <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-0.5">
                  Dibuka pada
                </p>
                <p className="text-sm text-slate-300 font-semibold">{formattedDate} WIB</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom: Photo carousel full width */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400 font-medium">
                Kenangan bersama · Galeri Sekolah
              </p>
              {!photosLoading && memoryPhotos.length > 0 && (
                <span className="text-xs text-slate-600">{memoryPhotos.length} foto</span>
              )}
            </div>

            <PhotoCarousel
              photos={memoryPhotos}
              loading={photosLoading}
              currentIndex={currentPhotoIndex}
              onPrev={() =>
                setCurrentPhotoIndex(
                  (p) => (p - 1 + memoryPhotos.length) % memoryPhotos.length
                )
              }
              onNext={() => setCurrentPhotoIndex((p) => (p + 1) % memoryPhotos.length)}
              onDot={(i) => setCurrentPhotoIndex(i)}
            />
          </motion.div>
        </div>

        <FooterComp />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // SEARCH PAGE
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarComp />

      {/* Hero search banner */}
      <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.03] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/75 text-[11px] font-bold uppercase tracking-widest mb-5"
          >
            <PartyPopper className="w-3.5 h-3.5" />
            Pengumuman Kelulusan {announcementDate.getFullYear()}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight"
          >
            Selamat!
            <br />
            <span className="text-blue-300">Saatnya Cek Kelulusanmu</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-blue-200/60 text-base mb-10 max-w-md mx-auto leading-relaxed"
          >
            Masukkan NISN kamu untuk melihat status kelulusan dan mencetak surat keterangan lulus.
          </motion.p>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-0 bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
              <Input
                type="text"
                placeholder="Masukkan NISN (10 digit)"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 h-14 text-base border-0 rounded-none focus:ring-0 focus-visible:ring-0 px-5"
                maxLength={10}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="h-14 px-7 rounded-none bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Cari
                  </span>
                )}
              </Button>
            </div>
            <p className="text-white/30 text-xs mt-3">
              Contoh: 1234567890 · NISN terdiri dari 10 digit angka
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main content — pulled up slightly */}
      <main className="max-w-2xl mx-auto px-6 -mt-6 pb-24 relative z-10">
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-5 shadow-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center gap-4"
          >
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-slate-400 text-sm">Mencari data siswa...</p>
          </motion.div>
        )}

        {/* Result card */}
        <AnimatePresence>
          {result && !isSearching && (
            <ResultCard result={result} onReset={resetSearch} />
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !isSearching && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Search className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Cek Status Kelulusan</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Masukkan NISN 10 digit di kolom pencarian di atas untuk melihat hasil kelulusanmu.
            </p>

            {/* Quick tips */}
            <div className="mt-8 grid grid-cols-3 gap-3 text-left">
              {[
                {
                  icon: GraduationCap,
                  label: 'Lulus',
                  desc: 'Dapat cetak surat keterangan',
                  color: 'text-emerald-600 bg-emerald-50',
                },
                {
                  icon: Clock,
                  label: 'Tunda',
                  desc: 'Hubungi pihak sekolah',
                  color: 'text-amber-600 bg-amber-50',
                },
                {
                  icon: XCircle,
                  label: 'Tidak Lulus',
                  desc: 'Konsultasi ke wali kelas',
                  color: 'text-red-500 bg-red-50',
                },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">{label}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      <FooterComp />
    </div>
  );
}