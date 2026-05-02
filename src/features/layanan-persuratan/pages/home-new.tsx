// /**
//  * Layanan Persuratan - Redesigned Homepage
//  * Category Cards UI dengan dynamic data dari API
//  */
// import { FooterComp } from '@/features/_global/components/footer';
// import NavbarComp from '@/features/_global/components/navbar';
// import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
// import { motion } from 'framer-motion';
// import {
//   ArrowRight,
//   CheckCircle,
//   ChevronRight,
//   Clock,
//   FileText, Search
// } from 'lucide-react';
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { PermohonanForm } from '../components/PermohonanForm';
// import { useServiceTypes } from '../hooks/useServiceTypes';

// // Icon map (inline SVG to avoid dynamic imports)
// const ICON_MAP: Record<string, React.ReactNode> = {
//   FileText: <FileText className="w-6 h-6" />,
//   Trophy: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
//   Lock: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
//   Unlock: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
//   UserEdit: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
//   CreditCard: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
//   Clock: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
//   Mail: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
//   Briefcase: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
//   ThumbsUp: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
//   Home: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
//   MapPin: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
//   Stamp: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77z"/><path d="M14 13V8.5C14 7 15 6 16.5 6c0 0-2 2-2 5"/></svg>,
//   Book: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
//   Award: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
//   Users: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
//   Calendar: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
//   Bell: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
//   Star: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
//   Shield: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
//   GraduationCap: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
//   IdCard: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
//   Printer: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
//   Clipboard: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
//   CheckCircle: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
// };

// const getIcon = (iconName: string) => ICON_MAP[iconName] || <FileText className="w-6 h-6" />;

// // JENIS_SURAT mapping for form submission
// // const JENIS_SURAT_MAP: Record<string, string> = {
// //   keterangan_aktif: 'keterangan_aktif',
// //   lomba: 'lomba',
// //   kjp_tutup: 'kjp_tutup',
// //   kjp_blokir: 'kjp_blokir',
// //   kjp_nama: 'kjp_nama',
// //   kjp_atm: 'kjp_atm',
// //   dispensasi: 'dispensasi',
// //   izin_guru: 'izin_guru',
// //   pengalaman: 'pengalaman',
// //   rekomendasi: 'rekomendasi',
// //   rt_rw: 'rt_rw',
// //   domisili: 'domisili',
// //   legalisasi: 'legalisasi',
// // };

// export const LayananPersuratanPageNew = () => {
//   const [selectedType, setSelectedType] = useState<any | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const { data: schoolData } = useSchoolProfile();
//   const { serviceTypes, isLoading } = useServiceTypes();

//   const primaryColor = schoolData?.themePrimary || '#1e6fb5';
//   const schoolName = schoolData?.schoolName || 'Sekolah';
//   const logoUrl = schoolData?.logoUrl;

//   const activeTypes = serviceTypes.filter(t => t.isActive);
//   const filtered = activeTypes.filter(t =>
//     t.jenisSuratLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (selectedType) {
//     return (
//       <PermohonanForm
//         jenisSurat={selectedType.jenisSurat}
//         onBack={() => setSelectedType(null)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Navbar with high z-index */}
//       <div style={{ position: 'relative', zIndex: 9999999 }}>
//         <NavbarComp />
//       </div>

//       {/* Main content */}
//       <div className="flex-1" style={{ background: `linear-gradient(180deg, ${primaryColor}15 0%, #f8fafc 100%)` }}>
//       {/* Hero Header */}
//       <div
//         className="relative overflow-hidden"
//         style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)` }}
//       >
//         <div className="absolute inset-0 opacity-10">
//           <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
//                 <circle cx="30" cy="30" r="1.5" fill="white" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#hero-pattern)" />
//           </svg>
//         </div>

//         <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14 relative z-10">
//           {/* Back + school info */}
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
//               {logoUrl ? (
//                 <img src={logoUrl} alt={schoolName} className="w-full h-full object-cover" />
//               ) : (
//                 <span className="text-white font-bold text-sm">{schoolName.substring(0, 2).toUpperCase()}</span>
//               )}
//             </div>
//             <div>
//               <p className="text-white/70 text-xs font-medium">{schoolName}</p>
//               <h1 className="text-white font-bold text-sm tracking-wide">LAYANAN ADM. PERSURATAN</h1>
//             </div>
//           </div>

//           {/* Title */}
//           <div className="mb-6">
//             <h2 className="text-white text-2xl md:text-3xl font-extrabold leading-tight mb-2">
//               Layanan Administrasi<br />Persuratan Digital
//             </h2>
//             <p className="text-white/75 text-sm md:text-base max-w-lg">
//               Ajukan surat keterangan, legalisasi, dan permohonan lainnya secara online. Mudah, cepat, dan transparan.
//             </p>
//           </div>

//           {/* CTA buttons */}
//           <div className="flex flex-wrap gap-3">
//             <Link
//               to="/cek-status"
//               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-sm font-semibold hover:bg-white/90 transition-colors"
//               style={{ color: primaryColor }}
//             >
//               <Search className="w-4 h-4" />
//               Cek Status Permohonan
//             </Link>
//             <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 text-white text-sm">
//               <CheckCircle className="w-4 h-4" />
//               {activeTypes.length} layanan tersedia
//             </div>
//           </div>
//         </div>

//         {/* Wave divider */}
//         <div className="absolute bottom-0 left-0 w-full">
//           <svg viewBox="0 0 1440 60" className="w-full h-10 md:h-16" preserveAspectRatio="none">
//             <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" fill="#f8fafc" />
//           </svg>
//         </div>
//       </div>

//       {/* Category Cards Grid */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
//         {/* Search */}
//         <div className="mb-6 relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Cari jenis layanan..."
//             className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
//           />
//         </div>

//         {/* Loading state */}
//         {isLoading && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
//             ))}
//           </div>
//         )}

//         {/* Category Cards */}
//         {!isLoading && (
//           <>
//             {filtered.length === 0 ? (
//               <div className="text-center py-16">
//                 <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-400 font-medium">Tidak ada layanan yang cocok</p>
//                 <button onClick={() => setSearchQuery('')} className="mt-2 text-sm text-blue-500 hover:underline">
//                   Reset pencarian
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {filtered
//                   .sort((a, b) => a.order - b.order)
//                   .map((type, idx) => (
//                     <motion.button
//                       key={type.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.04 }}
//                       onClick={() => setSelectedType(type)}
//                       className="group text-left bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden"
//                     >
//                       {/* Color accent bar */}
//                       <div
//                         className="h-1.5 w-full"
//                         style={{ backgroundColor: type.color || primaryColor }}
//                       />

//                       <div className="p-5">
//                         <div className="flex items-start gap-4">
//                           {/* Icon */}
//                           <div
//                             className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
//                             style={{ backgroundColor: type.color || primaryColor }}
//                           >
//                             {getIcon(type.icon || 'FileText')}
//                           </div>

//                           {/* Content */}
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors">
//                               {type.jenisSuratLabel}
//                             </h3>
//                             <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
//                               {type.description || 'Klik untuk mengajukan'}
//                             </p>
//                           </div>

//                           {/* Arrow */}
//                           <div className="flex-shrink-0 self-center">
//                             <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
//                           </div>
//                         </div>

//                         {/* Footer */}
//                         <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
//                           <span className="text-xs text-gray-400">
//                             {type.fields?.length || 0} field formulir
//                           </span>
//                           <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
//                             style={{ backgroundColor: `${type.color || primaryColor}15`, color: type.color || primaryColor }}>
//                             Ajukan Sekarang
//                             <ArrowRight className="w-3 h-3" />
//                           </span>
//                         </div>
//                       </div>
//                     </motion.button>
//                   ))}
//               </div>
//             )}
//           </>
//         )}

//         {/* Info Banner */}
//         <div className="mt-10 p-5 rounded-2xl border border-blue-100 bg-blue-50/50">
//           <div className="flex items-start gap-3">
//             <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
//             <div>
//               <h4 className="font-semibold text-sm text-blue-900 mb-1">Informasi Penting</h4>
//               <ul className="text-xs text-blue-700 space-y-1">
//                 <li>• Waktu proses normal: <strong>3-5 hari kerja</strong> setelah pengajuan disetujui.</li>
//                 <li>• cek status permohonan menggunakan <strong>ID Permohonan</strong> yang diberikan setelah pengajuan.</li>
//                 <li>• Surat yang sudah selesai dapat diambil di sekolah atau dikirim via email.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <FooterComp />
//     </div>
//     </div>
//   );
// };

// export default LayananPersuratanPageNew;




/**
 * Layanan Persuratan - Redesigned Homepage
 * Mengikuti desain sistem PPIDMain: HeroComp, card grid, section header, search & filter
 */
import { FooterComp } from '@/features/_global/components/footer';
import { HeroComp } from '@/features/_global/components/hero';
import NavbarComp from '@/features/_global/components/navbar';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PermohonanForm } from '../components/PermohonanForm';
import { useServiceTypes } from '../hooks/useServiceTypes';

// ─────────────────────────────────────────────
// ICON MAP
// ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-7 h-7" />,
  Trophy: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  Lock: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Unlock: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>,
  UserEdit: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  CreditCard: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Clock: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Mail: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Briefcase: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  ThumbsUp: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
  Home: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  MapPin: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Stamp: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77z"/><path d="M14 13V8.5C14 7 15 6 16.5 6c0 0-2 2-2 5"/></svg>,
  Book: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Award: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Users: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Calendar: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  GraduationCap: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  Shield: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  IdCard: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Printer: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Clipboard: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  CheckCircle: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Star: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Bell: <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

const getIcon = (iconName: string) =>
  ICON_MAP[iconName] || <FileText className="w-7 h-7" />;

// ─────────────────────────────────────────────
// CARD — identik PPIDMain
// ─────────────────────────────────────────────
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition h-full">
    {children}
  </div>
);

// ─────────────────────────────────────────────
// SERVICE CARD CONTENT — struktur identik DocCard PPIDMain
// ─────────────────────────────────────────────
const ServiceCard = ({
  type,
  primaryColor,
  onSelect,
}: {
  type: any;
  primaryColor: string;
  onSelect: () => void;
}) => {
  const color = type.color || primaryColor;

  // Badge background: warna card dengan opacity rendah
  const badgeBg = `${color}18`;
  const badgeText = color;

  return (
    <button
      onClick={onSelect}
      className="group text-left w-full h-full"
    >
      <Card>
        <div className="p-8 md:px-10 md:pt-10 pb-8 flex flex-col h-full relative z-[2]">

          {/* Icon & Badge — identik PPIDMain */}
          <div className="flex justify-between items-start mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-300 shadow-sm"
              style={{ backgroundColor: color }}
            >
              {getIcon(type.icon || 'FileText')}
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full backdrop-blur-sm"
              style={{ backgroundColor: badgeBg, color: badgeText }}
            >
              Surat
            </span>
          </div>

          {/* Title — identik PPIDMain */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-tight">
            {type.jenisSuratLabel}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-5 flex-grow leading-relaxed line-clamp-2">
            {type.description || 'Klik untuk mengajukan permohonan surat ini.'}
          </p>

          {/* Footer — struktur identik PPIDMain (2 baris icon + info) */}
          <div className="pt-4 border-t border-gray-100/80 space-y-4">

            {/* Baris 1: Jumlah field */}
            <div className="flex items-center group/item cursor-default">
              <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover/item:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {type.fields?.length || 0} field formulir
              </span>
            </div>

            {/* Baris 2: CTA Ajukan */}
            <div className="flex items-center group/item">
              <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover/item:bg-blue-50 transition-colors">
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600 transition-colors" />
              </div>
              <span
                className="text-sm font-semibold hover:underline"
                style={{ color }}
              >
                Ajukan Sekarang
              </span>
            </div>

          </div>
        </div>
      </Card>
    </button>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export const LayananPersuratanPageNew = () => {
  const [selectedType, setSelectedType] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: schoolData } = useSchoolProfile();
  const { serviceTypes, isLoading } = useServiceTypes();

  const primaryColor = schoolData?.themePrimary || '#1e6fb5';
  const theme = schoolData?.theme || {
    bg: '#ffffff',
    primary: primaryColor,
    accent: primaryColor,
    surface: '#ffffff',
  };

  const activeTypes = serviceTypes.filter((t: any) => t.isActive);
  const filtered = activeTypes.filter((t: any) =>
    t.jenisSuratLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── If a service type is selected, render PermohonanForm ──
  if (selectedType) {
    return (
      <PermohonanForm
        jenisSurat={selectedType.jenisSurat}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar — identik PPIDMain */}
      <NavbarComp theme={theme} />

      {/* Hero — identik PPIDMain */}
      <HeroComp titleProps="Layanan Persuratan" id="#layanan" />

      {/* Main content */}
      <main className="flex-1 relative z-[1]" id="layanan">
        <section className="py-24 bg-[#F8FAFC] relative">

          {/* Background Decor — identik PPIDMain */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-[2]">

            {/* Section Header — identik PPIDMain */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                  Pilih Jenis Layanan
                </h2>
                <div className="h-1.5 w-12 rounded-full bg-blue-600" />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-gray-500 text-sm">
                  {activeTypes.length} layanan tersedia
                </p>
                <Link
                  to="/cek-status"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Search className="w-4 h-4" />
                  Cek Status Permohonan
                </Link>
              </div>
            </div>

            {/* Search & Filter — identik PPIDMain */}
            <div className="flex flex-col md:flex-row gap-3 mb-10">
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari jenis layanan surat..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-black/5 placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Loading skeleton — identik PPIDMain */}
            {isLoading && (
              <div className="py-20 text-center text-sm text-black/60 animate-pulse">
                Memuat layanan…
              </div>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <div className="bg-white/50 border border-dashed border-gray-300 rounded-[2rem] py-16 text-center text-gray-400">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="font-semibold">Tidak ada layanan yang ditemukan.</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            )}

            {/* Card Grid — identik PPIDMain: 3 kolom */}
            {!isLoading && filtered.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((type: any, idx: number) => (
                    <motion.div
                      key={type.id}
                      className="group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <ServiceCard
                        type={type}
                        primaryColor={primaryColor}
                        onSelect={() => setSelectedType(type)}
                      />
                    </motion.div>
                  ))}
              </div>
            )}

            {/* Info Banner — disesuaikan dengan estetika PPIDMain */}
            <div className="mt-16 p-6 rounded-2xl border border-blue-100 bg-white/60 backdrop-blur-sm shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-blue-900 mb-2">Informasi Penting</h4>
                  <ul className="text-xs text-blue-700 space-y-1.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      Waktu proses normal: <strong className="ml-1">3–5 hari kerja</strong> setelah pengajuan disetujui.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      Cek status menggunakan <strong className="ml-1">ID Permohonan</strong> yang diberikan setelah pengajuan.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      Surat yang selesai dapat diambil di sekolah atau dikirim via email.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer — identik PPIDMain */}
      <FooterComp />
    </div>
  );
};

export default LayananPersuratanPageNew;