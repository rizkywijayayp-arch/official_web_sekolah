// import { API_CONFIG } from "@/config/api";
// import { FooterComp } from "@/features/_global/components/footer";
// import { HeroComp } from "@/features/_global/components/hero";
// import NavbarComp from "@/features/_global/components/navbar";
// import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
// import { useQuery } from '@tanstack/react-query';
// import { AnimatePresence, motion } from "framer-motion";
// import { File } from "lucide-react";
// import { useEffect, useMemo, useState } from "react";

// const IFilter = () => "🔎";
// const ILink = () => "🔗";

// const useProfile = () => {
//   const schoolId = getSchoolIdSync();
//   return useQuery({
//     queryKey: ['school-profile', schoolId],
//     queryFn: async () => {
//       const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`);
//       const json = await res.json();
//       return json.success ? json.data : null;
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };

// /****************************
//  * UTILS
//  ****************************/
// const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
//   <section id={id} className="scroll-mt-32 py-16 border-b border-gray-900/30 last:border-none">
//     <div className="max-w-7xl mx-auto px-6">
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         viewport={{ once: true }}
//         className="flex items-center gap-4 mb-10"
//       >
//         <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
//           {icon}
//         </div>
//         <h2 className="text-3xl text-gray-900 font-black tracking-tight uppercase">
//           {title}
//         </h2>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         className="rounded-[2.5rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-900/30 overflow-hidden"
//       >
//         <div className="p-2 sm:p-4">
//           {children}
//         </div>
//       </motion.div>
//     </div>
//   </section>
// );


// /****************************
//  * API CONFIG PPID
//  ****************************/
// const PPID_API_BASE = `${API_CONFIG.baseUrl}/ppid`;
// const SCHOOL_ID = getSchoolIdSync();

// const fetchPPIDDocuments = async () => {
//   const response = await fetch(`${PPID_API_BASE}?schoolId=${SCHOOL_ID}`, {
//     cache: "no-store",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//   const json = await response.json();

//   if (!json.success) throw new Error(json.message || "Response tidak valid");

//   return json.data || [];
// };

// /****************************
//  * ADAPTER DATA → format DokumenList
//  ****************************/
// const mapToDokumenFormat = (items: any[]) => {
//   return items.map(item => ({
//     id: item.id,
//     judul: item.title || "—",
//     categoryName: item.category || "lainnya",
//     tahun: item.publishedDate
//       ? new Date(item.publishedDate).getFullYear()
//       : (item.createdAt ? new Date(item.createdAt).getFullYear() : new Date().getFullYear()),
//     tipe: "Dokumen",
//     url: item.documentUrl || "",
//   }));
// };

// /****************************
//  * DOKUMEN LIST
//  ****************************/
// const DokumenList = ({ kategoriFilter }: { kategoriFilter: string }) => {
//   const [q, setQ] = useState("");
//   const [tahun, setTahun] = useState("Semua");

//   const { data: rawData = [], isPending: loading } = useQuery({
//     queryKey: ['ppid-documents', SCHOOL_ID],
//     queryFn: fetchPPIDDocuments,
//   });

//   const documents = useMemo(() => mapToDokumenFormat(rawData), [rawData]);

//   const { tahunOpts, filtered } = useMemo(() => {
//     const years = Array.from(new Set(documents.map((d: any) => d.tahun))).sort((a: any, b: any) => b - a);
//     const filteredDocs = documents.filter((d: any) =>
//       d.categoryName === kategoriFilter &&
//       (tahun === "Semua" || String(d.tahun) === tahun) &&
//       (q === "" || d.judul.toLowerCase().includes(q.toLowerCase()))
//     );
//     return {
//       tahunOpts: ["Semua", ...years.map(String)],
//       filtered: filteredDocs,
//     };
//   }, [documents, q, kategoriFilter, tahun]);

//   if (loading) return <div className="p-10 text-center text-gray-600 animate-pulse font-medium">Mengambil arsip dokumen...</div>;

//   return (
//     <div className="space-y-6">
//       {/* Search & Filter Bar */}
//       <div className="flex flex-col md:flex-row gap-4 px-4 pt-4">
//         <div className="flex-1 relative group">
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-600 transition-colors">
//             <IFilter />
//           </div>
//           <input
//             value={q}
//             onChange={e => setQ(e.target.value)}
//             placeholder="Cari dokumen..."
//             className="w-full pl-12 pr-4 py-3.5 bg-gray-200 placeholder:text-black/60 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
//           />
//         </div>
//         <div className="md:w-48">
//           <select
//             value={tahun}
//             onChange={e => setTahun(e.target.value)}
//             className="w-full px-4 py-3.5 bg-gray-200 placeholder:text-black/60 border-none rounded-2xl outline-none text-sm font-bold text-gray-700 cursor-pointer"
//           >
//             {tahunOpts.map(t => <option key={t} value={t}>Tahun {t}</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Modern Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="text-left border-b border-gray-50">
//               <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-600">Arsip Judul</th>
//               <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-600">Tahun</th>
//               <th className="px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-600 text-right">Aksi</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             <AnimatePresence>
//               {filtered.map((d: any, i: number) => (
//                 <motion.tr
//                   key={d.id}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ delay: i * 0.05 }}
//                   className="hover:bg-blue-50/30 transition-colors group"
//                 >
//                   <td className="px-8 py-6">
//                     <div className="flex flex-col">
//                       <span className="text-gray-900 font-bold text-base leading-tight group-hover:text-blue-700 transition-colors">{d.judul}</span>
//                       <span className="text-xs text-gray-600 mt-1 font-medium">{d.tipe}</span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6 text-sm font-black text-gray-500">{d.tahun}</td>
//                   <td className="px-8 py-6 text-right">
//                     {d.url ? (
//                       <a
//                         href={d.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
//                       >
//                         <ILink /> Unduh
//                       </a>
//                     ) : (
//                       <span className="text-xs font-bold text-gray-300 italic uppercase">No File</span>
//                     )}
//                   </td>
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//           </tbody>
//         </table>
//         {filtered.length === 0 && (
//           <div className="py-20 text-center">
//             <p className="text-gray-600 font-semibold uppercase tracking-tighter flex justify-center mx-auto items-center gap-4 text-xl">
//               <File className="relative top-[-2.5px]" />
//               Dokumen Tidak Ditemukan
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /****************************
//  * MAIN PPID PAGE – menggunakan Profile API
//  ****************************/
// export function PPIDMain() {
//   const { data: profile } = useProfile();
//   const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };

//   useEffect(() => {
//     document.documentElement.style.setProperty("--brand-primary", theme.primary);
//     document.documentElement.style.setProperty("--brand-accent", theme.accent);
//     document.documentElement.style.setProperty("--brand-bg", theme.bg);
//     document.documentElement.style.setProperty("--brand-surface", theme.surface);
//   }, [theme]);

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />

//       <HeroComp titleProps="Transparansi PPID" id="#ppid" />

//        {/* DOCUMENT SECTIONS */}
//       <div className="bg-white" id="ppid">
//         <Section id="berkala" title="Informasi Berkala" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="berkala" />
//         </Section>

//         <Section id="setiap-saat" title="Informasi Setiap Saat" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="setiap-saat" />
//         </Section>

//         <Section id="serta-merta" title="Informasi Serta Merta" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="serta-merta" />
//         </Section>

//         <Section id="keuangan" title="Laporan Keuangan" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="keuangan" />
//         </Section>

//         <Section id="kegiatan" title="Dokumentasi Kegiatan" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="kegiatan" />
//         </Section>

//         <Section id="profil" title="Profil Sekolah" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="profil" />
//         </Section>

//         <Section id="ppdb" title="Informasi PPDB" icon={<File size={20}/>}>
//           <DokumenList kategoriFilter="ppdb" />
//         </Section>
//       </div>

//       <FooterComp />
//     </div>
//   );
// }


import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from "react";

const useProfile = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['school-profile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/* ================= DUMMY DATA ================= */
const DUMMY_DOCUMENTS = [
  { id: "bk1",  title: "Laporan Kegiatan Sekolah Semester Ganjil 2024",  category: "berkala",     publishedDate: "2024-01-15", documentUrl: "#" },
  { id: "bk2",  title: "Rencana Kerja Tahunan (RKT) 2024",               category: "berkala",     publishedDate: "2024-02-01", documentUrl: "#" },
  { id: "bk3",  title: "Laporan Bulanan Akademik Januari 2024",           category: "berkala",     publishedDate: "2024-01-31", documentUrl: "#" },
  { id: "bk4",  title: "Agenda Kegiatan Semester Genap 2024",             category: "berkala",     publishedDate: "2024-07-01", documentUrl: "#" },
  { id: "bk5",  title: "Laporan Triwulan I Tahun 2024",                   category: "berkala",     publishedDate: "2024-03-31", documentUrl: "#" },
  { id: "bk6",  title: "Rekap Absensi Guru Periode Januari–Maret 2024",   category: "berkala",     publishedDate: "2024-04-05", documentUrl: "#" },
  { id: "bk7",  title: "Laporan Kehadiran Siswa Semester Ganjil 2023",    category: "berkala",     publishedDate: "2023-12-20", documentUrl: "#" },
  { id: "bk8",  title: "Rencana Kerja dan Anggaran Sekolah (RKAS) 2024",  category: "berkala",     publishedDate: "2024-01-10", documentUrl: "#" },
  { id: "bk9",  title: "Laporan Evaluasi Diri Sekolah (EDS) 2023",        category: "berkala",     publishedDate: "2023-11-30", documentUrl: "#" },
  { id: "bk10", title: "Laporan Penggunaan Dana BOS Triwulan II 2024",    category: "berkala",     publishedDate: "2024-06-30", documentUrl: "#" },
  { id: "ss1",  title: "Peraturan Tata Tertib Siswa 2024",                category: "setiap-saat", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "ss2",  title: "Struktur Organisasi Sekolah",                     category: "setiap-saat", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "ss3",  title: "Daftar Guru dan Tenaga Kependidikan",             category: "setiap-saat", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "ss4",  title: "Kurikulum Operasional Satuan Pendidikan (KOSP)",  category: "setiap-saat", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "ss5",  title: "Jadwal Pelajaran Semester Genap 2024",            category: "setiap-saat", publishedDate: "2024-07-15", documentUrl: "#" },
  { id: "ss6",  title: "Kalender Akademik Tahun 2024/2025",               category: "setiap-saat", publishedDate: "2024-07-01", documentUrl: "#" },
  { id: "ss7",  title: "Panduan Penerimaan Peserta Didik Baru (PPDB)",    category: "setiap-saat", publishedDate: "2024-05-01", documentUrl: "#" },
  { id: "ss8",  title: "Visi, Misi, dan Tujuan Sekolah",                  category: "setiap-saat", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "ss9",  title: "SK Pembagian Tugas Guru Semester Genap 2024",     category: "setiap-saat", publishedDate: "2024-07-10", documentUrl: "#" },
  { id: "ss10", title: "Prosedur Pengaduan dan Pelayanan Publik",          category: "setiap-saat", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "sm1",  title: "Pengumuman Libur Nasional Idul Fitri 2024",                   category: "serta-merta", publishedDate: "2024-04-08", documentUrl: "#" },
  { id: "sm2",  title: "Informasi Darurat Bencana Alam – Prosedur Evakuasi",          category: "serta-merta", publishedDate: "2024-02-20", documentUrl: "#" },
  { id: "sm3",  title: "Pemberitahuan Perubahan Jadwal Ujian Nasional",               category: "serta-merta", publishedDate: "2024-03-05", documentUrl: "#" },
  { id: "sm4",  title: "Pengumuman Kegiatan Pentas Seni Akhir Tahun",                 category: "serta-merta", publishedDate: "2024-11-25", documentUrl: "#" },
  { id: "sm5",  title: "Siaran Pers Pelantikan Kepala Sekolah Baru",                  category: "serta-merta", publishedDate: "2024-08-01", documentUrl: "#" },
  { id: "sm6",  title: "Edaran Kewaspadaan Demam Berdarah di Lingkungan Sekolah",     category: "serta-merta", publishedDate: "2024-11-01", documentUrl: "#" },
  { id: "sm7",  title: "Pengumuman Hasil Seleksi PPDB Tahun 2024",                    category: "serta-merta", publishedDate: "2024-06-20", documentUrl: "#" },
  { id: "sm8",  title: "Pemberitahuan Pemadaman Listrik Sementara Area Sekolah",      category: "serta-merta", publishedDate: "2024-09-10", documentUrl: "#" },
  { id: "sm9",  title: "Pengumuman Kelulusan Siswa Kelas XII Tahun 2024",             category: "serta-merta", publishedDate: "2024-05-06", documentUrl: "#" },
  { id: "sm10", title: "Informasi Penting: Perubahan Sistem Penilaian Raport",        category: "serta-merta", publishedDate: "2024-07-20", documentUrl: "#" },
  { id: "keu1",  title: "Laporan Keuangan Tahunan 2023",                          category: "keuangan", publishedDate: "2024-01-31", documentUrl: "#" },
  { id: "keu2",  title: "Realisasi Anggaran BOS Semester I 2024",                  category: "keuangan", publishedDate: "2024-07-31", documentUrl: "#" },
  { id: "keu3",  title: "Laporan Pertanggungjawaban Dana Komite 2023",             category: "keuangan", publishedDate: "2024-02-15", documentUrl: "#" },
  { id: "keu4",  title: "Rencana Anggaran Belanja Modal Tahun 2024",               category: "keuangan", publishedDate: "2024-01-05", documentUrl: "#" },
  { id: "keu5",  title: "Laporan Audit Internal Keuangan Sekolah 2023",            category: "keuangan", publishedDate: "2024-03-01", documentUrl: "#" },
  { id: "keu6",  title: "Rekapitulasi Penerimaan SPP Siswa Semester Ganjil 2024",  category: "keuangan", publishedDate: "2024-01-20", documentUrl: "#" },
  { id: "keu7",  title: "Neraca Keuangan Sekolah Per Desember 2023",               category: "keuangan", publishedDate: "2024-01-10", documentUrl: "#" },
  { id: "keu8",  title: "Laporan Penggunaan Dana Hibah Provinsi 2023",             category: "keuangan", publishedDate: "2024-02-28", documentUrl: "#" },
  { id: "keu9",  title: "Realisasi Anggaran Kegiatan Ekstrakulikuler 2023",        category: "keuangan", publishedDate: "2024-01-25", documentUrl: "#" },
  { id: "keu10", title: "Laporan Keuangan Semester II 2024",                       category: "keuangan", publishedDate: "2024-12-31", documentUrl: "#" },
  { id: "keg1",  title: "Dokumentasi Peringatan HUT RI ke-79",                          category: "kegiatan", publishedDate: "2024-08-17", documentUrl: "#" },
  { id: "keg2",  title: "Laporan Kegiatan Pramuka Kemah Bersama 2024",                  category: "kegiatan", publishedDate: "2024-10-05", documentUrl: "#" },
  { id: "keg3",  title: "Dokumentasi Wisuda Kelas XII Tahun 2024",                      category: "kegiatan", publishedDate: "2024-05-25", documentUrl: "#" },
  { id: "keg4",  title: "Laporan Kegiatan Studi Wisata Jakarta 2024",                   category: "kegiatan", publishedDate: "2024-09-15", documentUrl: "#" },
  { id: "keg5",  title: "Dokumentasi Pentas Seni Akhir Tahun 2023",                     category: "kegiatan", publishedDate: "2023-12-18", documentUrl: "#" },
  { id: "keg6",  title: "Laporan Olimpiade Sains Nasional Tingkat Kabupaten 2024",      category: "kegiatan", publishedDate: "2024-04-20", documentUrl: "#" },
  { id: "keg7",  title: "Dokumentasi Bakti Sosial Bulan Ramadan 2024",                  category: "kegiatan", publishedDate: "2024-03-28", documentUrl: "#" },
  { id: "keg8",  title: "Laporan Pelatihan P5 Kurikulum Merdeka 2024",                  category: "kegiatan", publishedDate: "2024-08-30", documentUrl: "#" },
  { id: "keg9",  title: "Dokumentasi Upacara Pelantikan OSIS 2024/2025",                category: "kegiatan", publishedDate: "2024-07-22", documentUrl: "#" },
  { id: "keg10", title: "Laporan Kegiatan Masa Orientasi Siswa (MOS) 2024",             category: "kegiatan", publishedDate: "2024-07-18", documentUrl: "#" },
  { id: "prf1",  title: "Profil Sekolah Lengkap Tahun 2024",                    category: "profil", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "prf2",  title: "Sejarah dan Perkembangan Sekolah",                      category: "profil", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "prf3",  title: "Data Pokok Pendidikan (Dapodik) 2024",                 category: "profil", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "prf4",  title: "Akreditasi Sekolah Tahun 2023 – Sertifikat dan Hasil", category: "profil", publishedDate: "2023-10-01", documentUrl: "#" },
  { id: "prf5",  title: "Daftar Prestasi Sekolah Tahun 2023–2024",              category: "profil", publishedDate: "2024-06-30", documentUrl: "#" },
  { id: "prf6",  title: "Data Statistik Siswa Per Jenjang Kelas 2024",          category: "profil", publishedDate: "2024-07-01", documentUrl: "#" },
  { id: "prf7",  title: "Profil Kepala Sekolah dan Wakil Kepala Sekolah",       category: "profil", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "prf8",  title: "Sertifikat ISO Manajemen Mutu Pendidikan",             category: "profil", publishedDate: "2023-05-15", documentUrl: "#" },
  { id: "prf9",  title: "Denah dan Peta Lokasi Sekolah",                        category: "profil", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "prf10", title: "Fasilitas dan Sarana Prasarana Sekolah 2024",          category: "profil", publishedDate: "2024-01-01", documentUrl: "#" },
  { id: "ppdb1",  title: "Buku Panduan PPDB Tahun Ajaran 2024/2025",            category: "ppdb", publishedDate: "2024-05-01", documentUrl: "#" },
  { id: "ppdb2",  title: "Jadwal dan Alur Pendaftaran PPDB 2024",               category: "ppdb", publishedDate: "2024-05-01", documentUrl: "#" },
  { id: "ppdb3",  title: "Persyaratan Dokumen Pendaftaran Calon Siswa Baru",    category: "ppdb", publishedDate: "2024-05-01", documentUrl: "#" },
  { id: "ppdb4",  title: "Pengumuman Hasil Seleksi PPDB Gelombang 1",           category: "ppdb", publishedDate: "2024-06-10", documentUrl: "#" },
  { id: "ppdb5",  title: "Tata Cara Pengisian Formulir Online PPDB",            category: "ppdb", publishedDate: "2024-05-05", documentUrl: "#" },
  { id: "ppdb6",  title: "Daftar Kuota Penerimaan Per Jalur PPDB 2024",         category: "ppdb", publishedDate: "2024-05-01", documentUrl: "#" },
  { id: "ppdb7",  title: "SK Panitia Pelaksana PPDB Tahun 2024",                category: "ppdb", publishedDate: "2024-04-15", documentUrl: "#" },
  { id: "ppdb8",  title: "Pengumuman Hasil Seleksi PPDB Gelombang 2",           category: "ppdb", publishedDate: "2024-06-25", documentUrl: "#" },
  { id: "ppdb9",  title: "Laporan Pelaksanaan dan Evaluasi PPDB 2024",          category: "ppdb", publishedDate: "2024-07-10", documentUrl: "#" },
  { id: "ppdb10", title: "FAQ – Pertanyaan Umum Seputar PPDB 2024",             category: "ppdb", publishedDate: "2024-05-01", documentUrl: "#" },
];

/* ================= SECTION CONFIG ================= */
const SECTION_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  accentColor: string;
  iconBg: string;
  badgeBg: string;
  badgeText: string;
  bar: string;
}> = {
  berkala: {
    title: "Informasi Berkala",
    subtitle: "Informasi yang wajib disediakan dan diumumkan secara berkala oleh sekolah.",
    accentColor: "#185FA5",
    iconBg: "bg-blue-600",
    badgeBg: "#E6F1FB",
    badgeText: "#185FA5",
    bar: "bg-blue-600",
  },
  "setiap-saat": {
    title: "Informasi Setiap Saat",
    subtitle: "Informasi yang wajib tersedia setiap saat dan dapat diakses kapan pun.",
    accentColor: "#534AB7",
    iconBg: "bg-indigo-600",
    badgeBg: "#EEEDFE",
    badgeText: "#3C3489",
    bar: "bg-indigo-600",
  },
  "serta-merta": {
    title: "Informasi Serta Merta",
    subtitle: "Informasi yang harus diumumkan segera tanpa permohonan terlebih dahulu.",
    accentColor: "#854F0B",
    iconBg: "bg-amber-500",
    badgeBg: "#FAEEDA",
    badgeText: "#854F0B",
    bar: "bg-amber-500",
  },
  keuangan: {
    title: "Laporan Keuangan",
    subtitle: "Dokumen transparansi pengelolaan keuangan sekolah untuk publik.",
    accentColor: "#3B6D11",
    iconBg: "bg-emerald-600",
    badgeBg: "#EAF3DE",
    badgeText: "#3B6D11",
    bar: "bg-emerald-600",
  },
  kegiatan: {
    title: "Dokumentasi Kegiatan",
    subtitle: "Laporan dan arsip dokumentasi berbagai kegiatan sekolah.",
    accentColor: "#72243E",
    iconBg: "bg-pink-600",
    badgeBg: "#FBEAF0",
    badgeText: "#72243E",
    bar: "bg-pink-600",
  },
  profil: {
    title: "Profil Sekolah",
    subtitle: "Dokumen resmi yang menggambarkan identitas dan profil institusi.",
    accentColor: "#3C3489",
    iconBg: "bg-purple-600",
    badgeBg: "#EEEDFE",
    badgeText: "#3C3489",
    bar: "bg-purple-600",
  },
  ppdb: {
    title: "Informasi PPDB",
    subtitle: "Seluruh dokumen dan pengumuman terkait penerimaan peserta didik baru.",
    accentColor: "#0F6E56",
    iconBg: "bg-cyan-600",
    badgeBg: "#E1F5EE",
    badgeText: "#0F6E56",
    bar: "bg-cyan-600",
  },
};

const CATEGORY_LABEL: Record<string, string> = {
  berkala: "Berkala",
  "setiap-saat": "Setiap Saat",
  "serta-merta": "Serta Merta",
  keuangan: "Keuangan",
  kegiatan: "Kegiatan",
  profil: "Profil",
  ppdb: "PPDB",
};

/* ================= API ================= */
const PPID_API_BASE = `${API_CONFIG.baseUrl}/ppid`;
const SCHOOL_ID = getSchoolIdSync();

const fetchPPIDDocuments = async () => {
  const res = await fetch(`${PPID_API_BASE}?schoolId=${SCHOOL_ID}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Response tidak valid");
  return json.data || [];
};

const mapDocs = (items: any[]) =>
  items.map(item => ({
    id: item.id,
    judul: item.title || "—",
    categoryName: item.category || "lainnya",
    tahun: item.publishedDate ? new Date(item.publishedDate).getFullYear() : new Date().getFullYear(),
    publishedDate: item.publishedDate || null,
    url: item.documentUrl || "",
  }));

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

/* ================= CARD SHELL — identik Layanan ================= */
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition h-full">
    {children}
  </div>
);

/* ================= DOC CARD CONTENT — struktur identik Layanan ================= */
const DocCard = ({ doc, cfg }: { doc: any; cfg: typeof SECTION_CONFIG[string] }) => (
  <div className="p-8 md:px-10 md:pt-10 pb-8 flex flex-col h-full relative z-[2]">

    {/* Icon & Badge — identik Layanan */}
    <div className="flex justify-between items-start mb-8">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cfg.iconBg} text-white transition-all duration-300 shadow-sm`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      </div>
      <span
        className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 rounded-full backdrop-blur-sm"
        style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
      >
        {CATEGORY_LABEL[doc.categoryName] ?? doc.categoryName}
      </span>
    </div>

    {/* Title — identik Layanan */}
    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight">
      {doc.judul}
    </h3>

    {/* Tanggal publish — sebagai pengganti description */}
    <p className="text-gray-400 text-sm mb-5 flex-grow">
      Diterbitkan: <span className="font-semibold text-gray-600">{formatDate(doc.publishedDate)}</span>
    </p>

    {/* Footer — struktur identik Layanan (2 baris icon + info) */}
    <div className="pt-4 border-t border-gray-100/80 space-y-4">

      {/* Baris 1: Tahun dokumen */}
      <div className="flex items-center group/item cursor-default">
        <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover/item:bg-blue-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gray-700">Tahun {doc.tahun}</span>
      </div>

      {/* Baris 2: Tombol unduh */}
      <div className="flex items-center group/item">
        <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center mr-4 group-hover/item:bg-blue-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 group-hover/item:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        {doc.url ? (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:underline truncate"
          >
            Unduh Dokumen
          </a>
        ) : (
          <span className="text-sm font-semibold text-gray-300 italic">File tidak tersedia</span>
        )}
      </div>

    </div>
  </div>
);

/* ================= SECTION GRID ================= */
const SectionGrid = ({ kategori }: { kategori: string }) => {
  const [q, setQ] = useState("");
  const [tahun, setTahun] = useState("Semua");
  const cfg = SECTION_CONFIG[kategori] ?? SECTION_CONFIG["berkala"];

  const { data: rawData = [], isPending: loading, isError } = useQuery({
    queryKey: ['ppid-documents', SCHOOL_ID],
    queryFn: fetchPPIDDocuments,
    retry: 1,
  });

  const resolvedRaw = (isError || rawData.length === 0) ? DUMMY_DOCUMENTS : rawData;
  const allDocs = useMemo(() => mapDocs(resolvedRaw), [resolvedRaw]);

  const { tahunOpts, filtered } = useMemo(() => {
    const catDocs = allDocs.filter((d: any) => d.categoryName === kategori);
    const years = Array.from(new Set(catDocs.map((d: any) => d.tahun))).sort((a: any, b: any) => b - a);
    const result = catDocs.filter((d: any) =>
      (tahun === "Semua" || String(d.tahun) === tahun) &&
      (q === "" || d.judul.toLowerCase().includes(q.toLowerCase()))
    );
    return { tahunOpts: ["Semua", ...years.map(String)], filtered: result };
  }, [allDocs, q, tahun, kategori]);

  return (
    <section className="py-24 bg-[#F8FAFC] relative">
      {/* Background Decor — identik Layanan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100 blur-[120px] rounded-full" />
      </div>

      <div id={kategori} className="max-w-7xl mx-auto px-6 relative z-[2]">

        {/* Section Header — identik Layanan */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">{cfg.title}</h2>
            <div className={`h-1.5 w-12 rounded-full ${cfg.bar}`} />
          </div>
          <p className="text-gray-500 max-w-sm text-sm">{cfg.subtitle}</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-10">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Cari dokumen..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-black/5 placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <div className="md:w-44">
            <select
              value={tahun}
              onChange={e => setTahun(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl outline-none text-sm font-bold text-gray-700 cursor-pointer shadow-sm"
            >
              {tahunOpts.map(t => (
                <option key={t} value={t}>
                  {t === "Semua" ? "Semua Tahun" : `Tahun ${t}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-sm text-black/60 animate-pulse">Memuat data…</div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white/50 border border-dashed border-gray-300 rounded-[2rem] py-16 text-center text-gray-400">
            Belum ada dokumen ditemukan.
          </div>
        )}

        {/* Card Grid — identik Layanan: 3 kolom */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((doc: any) => (
              <div key={doc.id} className="group">
                <Card>
                  <DocCard doc={doc} cfg={cfg} />
                </Card>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

/* ================= PAGE ================= */
export function PPIDMain() {
  const { data: profile } = useProfile();
  const theme = profile?.theme || {
    bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b',
    subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6',
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-accent", theme.accent);
    document.documentElement.style.setProperty("--brand-bg", theme.bg);
    document.documentElement.style.setProperty("--brand-surface", theme.surface);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      <HeroComp titleProps="Transparansi PPID" id="#ppid" />

      <main className="flex-1 relative z-[1]" id="ppid">
        <SectionGrid kategori="berkala" />
        <SectionGrid kategori="setiap-saat" />
        <SectionGrid kategori="serta-merta" />
        <SectionGrid kategori="keuangan" />
        <SectionGrid kategori="kegiatan" />
        <SectionGrid kategori="profil" />
        <SectionGrid kategori="ppdb" />
      </main>

      <FooterComp />
    </div>
  );
}