// import { API_CONFIG } from "@/config/api";
// import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
// import { queryClient } from "@/features/_root/queryClient";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import { Building2, ChevronDown, Handshake, HelpCircle, Instagram, Mail, MessageCircle, Play, SquareArrowOutUpRight, UserCheck, UserX } from "lucide-react";
// import { cloneElement, useEffect, useState } from "react";
// import { FooterComp } from "@/features/_global/components/footer";
// import { HeroComp } from "@/features/_global/components/hero";
// import NavbarComp from "@/features/_global/components/navbar";
// import BeritaComp from "@/features/_global/components/berita";
// import GalleryComp from "@/features/_global/components/galeri";
// import { SambutanComp } from "@/features/_global/components/sambutan";
// import TugasComp from "@/features/_global/components/tugas";

// const BASE_URL = `${API_CONFIG.baseUrl}/profileSekolah`;
// const BASE_URL2 = API_CONFIG.baseUrl;

// interface SchoolProfile {
//   schoolId?: number;
//   schoolName?: string;
//   headmasterName?: string;
//   headmasterWelcome?: string;
//   heroTitle?: string;
//   heroSubTitle?: string;
//   photoHeadmasterUrl?: string;
//   studentCount?: number;
//   teacherCount?: number;
//   roomCount?: number;
//   achievementCount?: number;
//   linkYoutube?: string;
// }

// // --- SHARED COMPONENTS & HELPERS ---
// const SectionHeader = ({ title, subtitle, light = false }: any) => (
//   <div className="mb-16 text-center">
//     <motion.span 
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       className={`inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase rounded-full ${light ? 'bg-blue-400/10 text-blue-300 border border-blue-400/20' : 'bg-blue-50 text-blue-700'}`}
//     >
//       Official Information
//     </motion.span>
//     <motion.h2 
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       className={`text-3xl md:text-5xl font-black mb-6 ${light ? 'text-white' : 'text-slate-900'}`}
//     >
//       {title}
//     </motion.h2>
//     <div className={`w-24 h-1.5 mx-auto rounded-full bg-blue-600 mb-6`} />
//     <p className={`w-[96%] md:max-w-2xl mx-auto text-sm md:text-lg ${light ? 'text-blue-100/70' : 'text-slate-600'}`}>{subtitle}</p>
//   </div>
// );

// export function useNews(schoolId: string | number | undefined) {
//   const [news, setNews] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!schoolId) {
//       setError("schoolId tidak ditemukan");
//       setLoading(false);
//       return;
//     }

//     const fetchNews = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_CONFIG.baseUrl}/berita?schoolId=${schoolId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             // Jika nanti pakai autentikasi: "Authorization": `Bearer ${token}`,
//           },
//           cache: "no-store", // agar selalu fresh
//         });

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const json = await res.json();

//         if (!json.success) {
//           throw new Error(json.message || "Gagal mengambil berita");
//         }

//         // Mapping data sesuai struktur backend baru
//         const mappedNews = json.data.map((item: any) => ({
//           id: item.id,
//           title: item.title,
//           date: new Date(item.publishDate).toLocaleDateString("id-ID", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//           }),
//           tag: item.category || "Umum",
//           img: item.imageUrl || "/default-news.jpg",
//           excerpt: item.content.substring(0, 150) + "...", // potong jadi excerpt
//           source: item.source || "Sekolah",
//         }));

//         setNews(mappedNews);
//       } catch (err: any) {
        
//         setError(err.message || "Gagal memuat berita");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, [schoolId]);

//   return { news, loading, error };
// }

// interface Facility {
//   id: number;
//   name: string;
//   description?: string;
//   imageUrl?: string | null;
// }

// const FasilitasSection = () => {
//   const schoolId = getSchoolIdSync();

//   const [facilities, setFacilities] = useState<Facility[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!schoolId) {
//       setError("School ID tidak ditemukan");
//       setLoading(false);
//       return;
//     }

//     const fetchFacilities = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_CONFIG.baseUrl}/fasilitas?schoolId=${schoolId}`, {
//           cache: "no-store",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const json = await res.json();

//         if (!json.success || !Array.isArray(json.data)) {
//           throw new Error("Format response tidak valid");
//         }

//         // Mapping data dari backend
//         const mapped = json.data.map((item: any) => ({
//           id: item.id,
//           name: item.name,
//           description: item.description,
//           imageUrl: item.imageUrl || null,
//         }));

//         setFacilities(mapped);
//       } catch (err: any) {
        
//         setError(err.message || "Gagal memuat fasilitas");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFacilities();
//   }, [schoolId]);

//   if (loading) {
//     return (
//       <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
//         <div className="max-w-7xl mx-auto md:px-0 px-4 text-center4">
//           <p className="text-gray-600">Memuat fasilitas sekolah...</p>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
//         <div className="max-w-7xl mx-auto md:px-0 px-4 text-center">
//           <p className="text-red-600">{error}</p>
//         </div>
//       </section>
//     );
//   }

//   if (facilities.length === 0) {
//     return (
//       <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
//         <div className="max-w-7xl mx-auto md:px-0 px-6 md:text-center">
//           <h2 className="text-3xl md:text-5xl font-black" style={{ color: "black" }}>
//             Fasilitas <span className="text-blue-700 italic underline decoration-normal">Sekolah</span>
//           </h2>
//           <div className="w-full h-[200px] mt-12 rounded-lg border border-black/30 bg-gray-400/5 flex justify-center items-center">
//             <p className="text-gray-500 mt-4">Belum ada data fasilitas yang tersedia saat ini.</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12 md:py-16 bg-slate-50">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* <SectionHeader 
//           title="Fasilitas Sekolah" 
//           subtitle="Lingkungan belajar yang didukung teknologi terkini untuk menunjang kreativitas siswa." 
//         /> */}

//         <div className="md:text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4"
//           >
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
//             </span>
//             Bangunan layak dan nyaman
//           </motion.div>
          
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
//           >
//             Fasilitas <span className="text-blue-600 italic underline direction-normal  ">Sekolah</span>
//           </motion.h2>
          
//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-slate-500 max-w-2xl mx-auto text-lg font-light"
//           >
//             Lingkungan belajar yang didukung teknologi terkini untuk menunjang kreativitas siswa.
//           </motion.p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
//           {facilities.map((item, i) => (
//             <motion.div
//               key={item.id}
//               whileHover={{ y: -10 }}
//               className={`group relative rounded-[2rem] overflow-hidden shadow-xl z-[4] ${
//                 i === 0 ? "md:col-span-2 md:row-span-2" : i === 1 ? "md:col-span-2" : ""
//               }`}
//             >
//               <img src={item.imageUrl || "/default-facility.jpg"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
//               <div className="w-full absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent p-8 flex flex-col justify-end">
//                 <h3 className="text-white font-black leading-tight text-2xl 
//                   group-hover:text-blue-800 group-hover:bg-white w-max group-hover:italic 
//                     duration-200 transition-all 
//                     truncate block max-w-full group-hover:px-4">
//                   {item.name}
//                 </h3>
//                 <p className="text-blue-100 text-sm mt-2 line-clamp-2 font-light">{item.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// };

// const PengurusSection = () => {
//   const [pengurus, setPengurus] = useState<any>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const SCHOOL_ID = getSchoolIdSync(); 
//   const API_URL = `${API_CONFIG.baseUrl}/guruTendik?schoolId=${SCHOOL_ID}`;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(API_URL);
//         const result = await response.json();

//         // 1. Definisikan Struktur 4 Pilar Utama
//         const mainRoles = [
//           { key: "Kepala Sekolah", label: "Kepala Sekolah" },
//           { key: "Komite Sekolah", label: "Komite Sekolah" },
//           { key: "Wakil Kepala Sekolah", label: "Wakil Kepala Sekolah" },
//           { key: "Kepala Tata Usaha", label: "Kepala Tata Usaha" }
//         ];

//         if (result.success) {
//           const allData = result.data;

//           // 2. Map setiap pilar: Ambil dari API jika ada, jika tidak pakai data dummy
//           const mergedData = mainRoles.map((role) => {
//             const found = allData.find((item: any) => item.role === role.key);
            
//             if (found) {
//               return {
//                 jabatan: found.role,
//                 nama: found.nama,
//                 img: found.photoUrl || '/kapalaSekolah.png',
//                 email: found.email,
//                 isPlaceholder: false
//               };
//             } else {
//               // Data Dummy jika tidak ditemukan di API
//               return {
//                 jabatan: role.label,
//                 nama: "Nama Tenaga Pendidik",
//                 img: null,
//                 email: "#",
//                 isPlaceholder: true
//               };
//             }
//           });

//           setPengurus(mergedData);
//         }
//       } catch (error) {
        
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="py-24 text-center">Memuat data pilar pendidikan...</div>;
//   }

//   return (
//     <section className="py-12 md:py-24 bg-slate-50 relative">
//       <div className="max-w-7xl mx-auto px-6 relative z-[4]">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
//           <div className="max-w-2xl">
//             <motion.span 
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm"
//             >
//               Leadership Team
//             </motion.span>
//             <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2">
//               Pilar <span className="text-blue-600 italic underline">Pendidikan</span>
//             </h2>
//           </div>
//           <p className="text-slate-600 max-w-sm font-light leading-relaxed">
//             Kepala Sekolah, Komite Sekolah, Wakil Kepala Sekolah, Kepala Tata Usaha
//           </p>
//         </div>

//         <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 z-[4]">
//           {pengurus.map((item: any, i: number) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.1 }}
//               className={`group z-[4] ${item.isPlaceholder ? 'opacity-80' : ''}`}
//             >
//               {/* Container Card */}
//               <div className={`relative z-[4] rounded-[2rem] overflow-hidden mb-6 aspect-[3/4] shadow-lg transition-all duration-500 
//                 ${item.isPlaceholder 
//                   ? 'bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center grayscale animate-shimmer' 
//                   : 'bg-slate-100 shadow-blue-900/5'}`}
//               >
//                 {item.isPlaceholder ? (
//                   // Konten Placeholder
//                   <div className="flex flex-col items-center gap-2">
//                     <div className="w-12 h-12 rounded-full bg-slate-300/50 flex items-center justify-center">
//                         <span className="text-slate-400">?</span>
//                     </div>
//                     <span className="text-slate-500 font-medium px-4 text-center text-md">
//                       {item.jabatan}
//                     </span>
//                   </div>
//                 ) : (
//                   // Konten Asli
//                   <>
//                     <img 
//                       src={item.img} 
//                       alt={item.nama} 
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                     <div className="absolute bottom-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
//                       <a href={`mailto:${item.email}`} className="w-10 h-10 p-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-blue-600 transition-colors">
//                         <Mail size={20} />
//                       </a>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Info Teks */}
//               <div className="space-y-1 text-center md:text-left px-2">
//                 <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">
//                   {item.jabatan}
//                 </p>
//                 <h3 className={`text-lg font-bold transition-colors ${item.isPlaceholder ? 'text-slate-500 font-medium' : 'text-slate-900 group-hover:text-blue-700'}`}>
//                   {item.nama}
//                 </h3>
//                 <div className={`h-1 transition-all duration-500 rounded-full mt-2 ${item.isPlaceholder ? 'w-12 bg-slate-200' : 'w-8 bg-slate-200 group-hover:w-16 group-hover:bg-blue-600'}`} />
//               </div>
//             </motion.div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// const VideoSection = () => {
//   const [profile, setProfile] = useState<SchoolProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   const SCHOOL_ID = getSchoolIdSync();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`);
//         const result = await res.json();
//         if (result.success) setProfile(result.data);
//       } catch (err) {
        
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [SCHOOL_ID]);

//   const getYouTubeId = (url?: string): string | null => {
//     if (!url) return null;
//     const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const videoId = getYouTubeId(profile?.linkYoutube);
//   const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

//   return (
//     <section className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
//       <div className="max-w-7xl mx-auto px-6 relative z-[2]">
//         <div className="md:text-center mb-16">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4"
//           >
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
//             </span>
//             Audio Visual Experience
//           </motion.div>
          
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="text-3xl md:text-5xl font-black text-slate-900 mb-6"
//           >
//             Tentang <span className="text-blue-600 italic underline direction-normal  ">Kami</span>
//           </motion.h2>
          
//           <motion.p
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-slate-500 max-w-2xl mx-auto text-lg font-light"
//           >
//             {profile?.schoolName || 'Ceria Akademi'} dalam lensa kamera. Saksikan berbagai aktivitas, prestasi, dan kebersamaan kami.
//           </motion.p>
//         </div>

//         <motion.div 
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//           className="relative max-w-7xl mx-auto"
//         >          
//           <div className="relative z-[4] bg-white p-3 md:p-5 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-blue-800/80">
//             <div className="relative aspect-video rounded-[1.8rem] overflow-hidden bg-slate-900 group">
//               {loading ? (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 animate-pulse">
//                   <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
//                   <p className="text-blue-900 font-bold tracking-widest">LOADING CINEMATIC...</p>
//                 </div>
//               ) : !videoId ? (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-center px-6">
//                   <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
//                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
//                   </div>
//                   <h3 className="text-xl font-bold text-slate-900">Video Belum Tersedia</h3>
//                   <p className="text-slate-500 mt-2 font-light">Kami sedang menyiapkan konten video terbaik untuk Anda.</p>
//                 </div>
//               ) : (
//                 <>
//                   <iframe
//                     width="100%"
//                     height="100%"
//                     src={embedUrl}
//                     title="School Profile Video"
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                     allowFullScreen
//                     className="absolute inset-0 w-full h-full"
//                   />
//                   {/* Decorative frame inner shadow */}
//                   <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]" />
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Video Metadata Tag (Bottom Right) */}
//           {!loading && videoId && (
//             <div className="absolute -bottom-6 -right-6 md:right-10 bg-blue-600 text-white px-8 z-[5] py-4 rounded-2xl shadow-xl hidden md:block">
//               <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80 mb-1">Official Video</p>
//               <p className="font-bold text-sm">PROFIL SEKOLAH 2024/2025</p>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// const InstagramFeedSection = ({ theme }: any) => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeeds = async () => {
//       try {
//         const schoolId = getSchoolIdSync();
//         const response = await fetch(`${BASE_URL2}/feed?schoolId=${schoolId}`);
//         const result = await response.json();
//         if (result.success) setPosts(result.data);
//       } catch (error) {
        
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFeeds();
//   }, []);

//   return (
//     <section className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
//       {/* Abstract Background Decor */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10" />

//       <div className="max-w-7xl mx-auto px-6">
//         {/* Modern Header */}
//         <div className="flex flex-col md:flex-row items-start justify-between mb-16 gap-6 text-left">
//           <div>
//             <motion.div 
//               initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
//               className="flex items-center md:justify-start gap-2 text-blue-600 font-black tracking-widest text-xs uppercase mb-3"
//             >
//               <Instagram size={18} strokeWidth={3} /> Social Connect
//             </motion.div>
//             <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 leading-none">
//               Instagram <span className="text-blue-600  italic underline direction-normal">Feed</span>
//             </h2>
//           </div>
//           <a 
//             href="https://instagram.com" target="_blank"
//             className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-3 group"
//           >
//             Follow Our Activities
//             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </a>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {[1, 2, 3, 4, 5, 6].map(i => (
//               <div key={i} className="aspect-square bg-slate-200 animate-pulse rounded-2xl" />
//             ))}
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
//              <p className="text-slate-400 font-bold italic">No recent activities found on social media.</p>
//           </div>
//         ) : (
//           /* INSTAGRAM STYLE GRID */
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
//             {posts.map((post: any, i: number) => (
//               <motion.a
//                 key={post.id || i}
//                 href={post.postLink}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: i * 0.05 }}
//                 className="group relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl shadow-blue-900/5"
//               >
//                 {/* Media */}
//                 {post.mediaType === "video" ? (
//                   <video className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" muted loop autoPlay>
//                     <source src={post.mediaUrl} type="video/mp4" />
//                   </video>
//                 ) : (
//                   <img 
//                     src={post.mediaUrl} 
//                     className="w-full h-full object-cover opacity-90 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110" 
//                   />
//                 )}

//                 {/* Overlay on Hover (Instagram Style) */}
//                 <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
//                    <div className="flex gap-6 text-white font-black text-lg">
//                       <div className="flex items-center gap-2">
//                         <SquareArrowOutUpRight size={24} /> <span className="drop-shadow-md">Kungjungi</span>
//                       </div>
//                    </div>
//                 </div>

//                 {/* Video Indicator */}
//                 {post.mediaType === "video" && (
//                   <div className="absolute top-4 right-4 text-white drop-shadow-lg">
//                     <Play size={20} fill="white" />
//                   </div>
//                 )}

//                 {/* Bottom Caption (Subtle) */}
//                 <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-blue-950 to-transparent">
//                    <p className="text-white text-[10px] md:text-xs font-medium line-clamp-2 italic opacity-90">
//                      {post.caption}
//                    </p>
//                 </div>
//               </motion.a>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// // Ikon tambahan untuk header
// const ArrowRight = ({ className, size }: any) => (
//   <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
// );

// // --- FETCHING LOGIC ---
// const fetchStats = async (schoolId: string) => {
//   const { data } = await axios.get(`${API_CONFIG.baseUrl}/siswa/summary-attendances`, {
//     params: { schoolId }
//   });
  
//   const { siswa, guru } = data.data;
//   console.log('data kehadiran', data.data)
//   console.log('data kehadiran siswa', data.data.siswa)
//   console.log('data kehadiran guru', data.data.guru)

//   // Gabungkan data Siswa & Guru untuk tampilan Dashboard Utama
//   return [
//     { 
//       k: 'Siswa Hadir', 
//       v: siswa.rincian.Hadir 
//     },
//     { 
//       k: 'Siswa Alpha', 
//       // Alpha = Data Status Alpha + Siswa/Guru yang belum scan sama sekali
//       v: siswa.belumAbsen 
//     },
//     { 
//       k: 'Guru Hadir', 
//       v: guru.rincian.Hadir 
//     },
//     { 
//       k: 'Guru Alpha', 
//       v: guru.belumAbsen 
//     },
//   ];
// };

// const StatsBar = ({ schoolId }: { schoolId: string }) => {
//   const { data: stats, isPending, error } = useQuery({
//     queryKey: ['attendanceStats', schoolId],
//     queryFn: () => fetchStats(schoolId),
//     refetchInterval: 60000,
//   });

//   const config = [
//     { color: "from-emerald-500 to-teal-600", icon: <UserCheck />, label: "Hadir" },
//     { color: "from-rose-500 to-red-600", icon: <UserX />, label: "Alpa" },
//     { color: "from-amber-500 to-orange-600", icon: <UserCheck />, label: "Izin/Sakit" },
//     { color: "from-blue-500 to-indigo-600", icon: <UserX />, label: "Total Siswa" },
//   ];

//   if (isPending) return (
//     <div className="max-w-7xl px-6 mx-auto py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {[1, 2, 3, 4].map((i) => (
//         <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl border border-slate-200" />
//       ))}
//     </div>
//   );

//   if (error) return <div className="py-10 text-center text-red-400 font-light">Gagal memuat statistik sistem.</div>;

//   return (
//     <section id="stats" className="w-full max-w-7xl mx-auto px-6 relative py-12">
//       {/* Background Decor */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-blue-50/50 blur-[120px] -z-10" />

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats?.map((s, i) => (
//           <motion.div
//             key={s.k}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: i * 0.1 }}
//             whileHover={{ y: -5, transition: { duration: 0.2 } }}
//             className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-blue-500 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
//           >
//             {/* Hover Gradient Overlay */}
//             <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 bg-gradient-to-br ${config[i].color}`} />
            
//             <div className="relative flex flex-col items-start gap-5">
//               {/* Icon with Soft Shadow */}
//               <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${config[i].color} text-white shadow-lg shadow-current/20`}>
//                 {cloneElement(config[i].icon as React.ReactElement, { size: 28, strokeWidth: 2.5 })}
//               </div>

//               <div className="space-y-1">
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.15em]">
//                   {s.k}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <span className="text-4xl font-black text-slate-900 tracking-tight">
//                     {s.v}
//                   </span>
//                   <span className="text-sm ml-1 font-semibold text-slate-400">
//                     Orang
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// };

// const useComments = (schoolId: number) => {   // parameter tetap number
//   const API_BASE = API_CONFIG.baseUrl;

//   const query = useQuery({
//     queryKey: ['comments', schoolId],
//     queryFn: async () => {
//       const res = await fetch(`${API_BASE}/rating?schoolId=${schoolId}`, {
//         cache: 'no-store',
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       if (!data.success) throw new Error(data.message || 'Gagal memuat komentar');
//       return data.data || [];
//     },
//     staleTime: 2 * 60 * 1000,
//   });

//   const mutation = useMutation({
//     mutationFn: async (newComment: { name: string; email: string; comment: string; rating: number }) => {
//       const res = await fetch(`${API_BASE}/rating`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           ...newComment,
//           schoolId,              
//         }),
//       });
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const data = await res.json();
//       if (!data.success) throw new Error(data.message || 'Gagal mengirim komentar');
//       return data.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['comments', schoolId] });
//     },
//   });

//   return { ...query, mutate: mutation.mutate, isSubmitting: mutation.isPending };
// };

// const CommentSection = () => {
//   const schoolId: any = getSchoolIdSync();  // ← number, bukan string "88"

//   const { data: comments = [], isPending, error } = useComments(schoolId);
//   const { mutate, isSubmitting } = useComments(schoolId);
//   const [showStats, setShowStats] = useState(true);

//   useEffect(() => {
//     // Fetch setting dari backend
//     fetch(`${API_CONFIG.baseUrl}/rating/settings?schoolId=${schoolId}`)
//       .then(res => res.json())
//       .then(json => {
//         if(json.success) setShowStats(json.data.showRatingStats);
//       });
//   }, [schoolId])

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     comment: '',
//     rating: 5,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleRatingChange = (value: number) => {
//     setForm(prev => ({ ...prev, rating: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name.trim() || !form.comment.trim()) {
//       alert('Nama dan komentar wajib diisi');
//       return;
//     }

//     // Catatan: userId sementara kita hardcode atau bisa ambil dari auth nanti
//     mutate({
//       email: form.email.trim() || 'anonymous@example.com',
//       name: form.name.trim(),
//       comment: form.comment.trim(),
//       rating: form.rating,
//     }, {
//       onSuccess: () => {
//         setForm({ name: '', email: '', comment: '', rating: 5 });
//         alert('Terima kasih atas ulasan Anda!');
//       },
//       onError: (err: any) => {
//         alert('Gagal mengirim: ' + (err.message || 'Unknown error'));
//       }
//     });
//   };

//   return (
//    <section className="relative overflow-hidden bg-[#0f172a] py-16 md:py-24">
//       {/* Decorative Blur - Disesuaikan ukurannya agar tidak 'bocor' di mobile */}
//       <div className="absolute -right-20 -top-20 z-0 h-[300px] w-[300px] rounded-full bg-blue-700 opacity-40 blur-[80px] md:h-[800px] md:w-[800px] md:opacity-60 md:blur-[120px]" />
      
//       <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
//         <SectionHeader 
//           light 
//           title="Suara Akademik" 
//           subtitle="Apa kata mereka tentang pengalaman belajar di sekolah kami?" 
//         />

//         {/* Container Form dengan Adaptive Padding & Radius */}
//         <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/20 bg-white/5 p-6 backdrop-blur-xl shadow-2xl md:rounded-[3rem] md:p-12">
//           <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            
//             {/* Input Nama & Email */}
//             <div className="grid gap-6 md:grid-cols-2 md:gap-8">
//               <div className="space-y-3">
//                 <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
//                   Nama Lengkap
//                 </label>
//                 <input 
//                   name="name" 
//                   value={form.name} 
//                   onChange={handleChange} 
//                   required
//                   className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:px-6" 
//                   placeholder="Contoh: Budi Santoso"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
//                   Email
//                 </label>
//                 <input 
//                   type="email" 
//                   name="email" 
//                   value={form.email} 
//                   onChange={handleChange}
//                   className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:px-6" 
//                   placeholder="budi@email.com"
//                 />
//               </div>
//             </div>

//             {/* Rating Selector - Dibuat lebih touch-friendly di mobile */}
//             <div className="space-y-3">
//               <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
//                 Rating Anda
//               </label>
//               <div className="flex w-max gap-2 rounded-2xl border border-white/20 bg-white/5 p-2 md:p-3">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button 
//                     key={star} 
//                     type="button" 
//                     onClick={() => handleRatingChange(star)} 
//                     className={`text-2xl transition-all duration-300 hover:scale-125 md:text-3xl ${
//                       star <= form.rating ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-white/20'
//                     }`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Textarea */}
//             <div className="space-y-3">
//               <label className="ml-1 block text-xs font-bold uppercase tracking-[0.2em] text-blue-300 md:text-sm">
//                 Pesan & Kesan
//               </label>
//               <textarea 
//                 name="comment" 
//                 value={form.comment} 
//                 onChange={handleChange} 
//                 required 
//                 rows={4}
//                 className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 md:px-6"
//                 placeholder="Tuliskan ulasan Anda..."
//               />
//             </div>

//             {/* Submit Button - Animasi Hover & Loading State */}
//             <button 
//               disabled={isSubmitting}
//               className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 text-base font-black tracking-widest text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:bg-slate-700 md:py-5 md:text-lg"
//             >
//               <span className="relative z-10 flex items-center justify-center gap-2">
//                 {isSubmitting ? (
//                   <>
//                     <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     MENGIRIM...
//                   </>
//                 ) : (
//                   'KIRIM ULASAN SEKARANG'
//                 )}
//               </span>
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// interface Sponsor {
//   id: number;
//   name: string;
//   imageUrl?: string | null;
// }

// const SponsorMarqueeSection = () => {
//   const schoolId = getSchoolIdSync();
//   const [sponsors, setSponsors] = useState<Sponsor[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!schoolId) return;
//     const fetchSponsors = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_CONFIG.baseUrl}/partner?schoolId=${schoolId}`, {
//           cache: "no-store",
//         });
//         if (!res.ok) throw new Error("Gagal memuat sponsor");
//         const json = await res.json();
//         if (json.success && Array.isArray(json.data)) {
//           setSponsors(json.data);
//         }
//       } catch (err) {
        
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSponsors();
//   }, [schoolId]);

//   const duplicatedSponsors = [...sponsors, ...sponsors];

//   return (
//     <section className="py-12 mt-16 md:py-12 bg-white relative overflow-hidden">
//       {/* Background Decor (Mirip Feed) */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent -z-10" />

//       <div className="max-w-7xl mx-auto px-6">
//         {/* Modern Header (Konsisten dengan Feed) */}
//         <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 text-left">
//           <div>
//             <motion.div 
//               initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
//               className="flex items-center gap-2 text-blue-600 font-black tracking-widest text-xs uppercase mb-3"
//             >
//               <Handshake size={18} strokeWidth={3} /> Strategic Partners
//             </motion.div>
//             <h2 className="text-3xl md:text-5xl font-[900] text-slate-900 leading-none">
//               Mitra & <span className="text-blue-600 italic underline">Sponsor</span>
//             </h2>
//           </div>
//           <div className="hidden md:block">
//              <p className="text-slate-500 font-medium max-w-xs text-sm">
//                Bekerja sama dengan institusi terbaik untuk memajukan pendidikan.
//              </p>
//           </div>
//         </div>

//         {loading ? (
//           /* SKELETON STATE */
//           <div className="flex gap-4 overflow-hidden">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="min-w-[200px] h-24 bg-slate-200 animate-pulse rounded-2xl" />
//             ))}
//           </div>
//         ) : sponsors.length === 0 ? (
//           /* EMPTY STATE (Mirip Feed) */
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] p-12 md:p-20 text-center"
//           >
//             <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-400 mb-4">
//                <Building2 size={32} />
//             </div>
//             <p className="text-slate-400 font-bold italic">Belum ada mitra atau sponsor yang terdaftar.</p>
//           </motion.div>
//         ) : (
//           /* DATA PRESENT - MARQUEE */
//           <div className="relative group overflow-hidden">
//             <div
//               className="flex animate-marquee hover:pause-marquee whitespace-nowrap"
//               style={{ animation: "marquee 40s linear infinite" }}
//             >
//               {duplicatedSponsors.map((sponsor, index) => (
//                 <div
//                   key={`${sponsor.id}-${index}`}
//                   className="flex-shrink-0 mx-4 md:mx-8 flex flex-col items-center justify-center group/item"
//                   style={{ minWidth: "180px" }}
//                 >
//                   <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
//                     {sponsor.imageUrl ? (
//                       <img
//                         src={sponsor.imageUrl}
//                         alt={sponsor.name}
//                         className="h-16 md:h-20 w-auto object-contain transition-all duration-500"
//                         loading="lazy"
//                       />
//                     ) : (
//                       <div className="h-16 md:h-20 w-32 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs font-bold">
//                         {sponsor.name}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Gradient Overlay untuk efek memudar di pinggir */}
//             {/* <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
//             <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" /> */}
//           </div>
//         )}
//       </div>

//       <style jsx global>{`
//         @keyframes marquee {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         .animate-marquee {
//           display: flex;
//           width: max-content;
//         }
//         .pause-marquee:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </section>
//   );
// };

// const useFAQs = (schoolId: string | number) => {
//   const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!schoolId) {
//       setError("schoolId tidak ditemukan");
//       setLoading(false);
//       return;
//     }

//     const fetchFAQs = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(`${API_CONFIG.baseUrl}/faq?schoolId=${schoolId}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const json = await res.json();

//         if (!json.success || !Array.isArray(json.data)) {
//           throw new Error(json.message || "Format response FAQ tidak valid");
//         }

//         // Flatten semua faqs dari record-record yang aktif
//         const allFaqs = json.data
//           .filter((entry: any) => entry.isActive !== false)
//           .flatMap((entry: any) =>
//             Array.isArray(entry.faqs) ? entry.faqs : []
//           )
//           .filter((faq: any) => faq?.question?.trim() && faq?.answer?.trim());

//         setFaqs(allFaqs);
//       } catch (err: any) {
        
//         setError(err.message || "Gagal memuat FAQ");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFAQs();
//   }, [schoolId]);

//   return { faqs, loading, error };
// };

// const FAQSection = () => {
//   const SCHOOL_ID = getSchoolIdSync();
//   const { faqs, loading, error } = useFAQs(SCHOOL_ID);
//   const [openIndex, setOpenIndex] = useState<number | null>(0); // Default buka item pertama

//   if (loading) return (
//     <div className="py-24 text-center bg-slate-50">
//       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//       <p className="text-slate-500 font-bold">Mengambil informasi...</p>
//     </div>
//   );

//   return (
//     <section className="py-12 md:py-24 bg-white relative overflow-hidden">
//       {/* Background Decor */}
//       <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 hidden md:block" />
//       <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60" />

//       <div className="max-w-7xl mx-auto px-6">
//         <div className="gap-16 w-full text-center flex flex-col justify-center items-center">
          
//           {/* KIRI: Header Content */}
//           <div className="w-full flex flex-col justify-center items-center text-center">
//             <motion.div 
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               className="relative w-full flex flex-col justify-center text-center items-center mx-auto"
//             >
//               <div className="w-max mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 mb-6">
//                 <HelpCircle size={18} />
//                 <span className="text-[10px] font-black uppercase tracking-widest">Help Center</span>
//               </div>
//               <h2 className="w-[90%] md:w-max text-4xl text-center mx-auto md:text-5xl font-[900] text-slate-900 flex-col md:flex items-center leading-tight mb-8">
//                 Pertanyaan yang <br />
//                 <span className="text-blue-600 underline ml-2 direction-normal">Populer</span>
//               </h2>
//               <p className="text-slate-500 text-lg font-light mb-10 w-full md:w-[80%]">
//                 Butuh bantuan cepat? Temukan jawaban dari berbagai pertanyaan umum seputar Sekolah kami.
//               </p>
              
//               <div className="w-full p-8 rounded-[2rem] bg-slate-900 text-white flex text-left items-center gap-6 shadow-2xl shadow-blue-900/20">
//                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
//                   <MessageCircle size={24} />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-lg mb-1">Masih bingung?</h4>
//                   <p className="text-slate-400 text-sm mb-4">Tim administrasi kami siap membantu Anda secara langsung.</p>
//                   <a href="/layanan">
//                     <button className="text-blue-400 font-black text-sm uppercase tracking-tighter hover:text-white transition-colors">
//                       Hubungi Kontak Kami →
//                     </button>
//                   </a>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* KANAN: FAQ Accordion */}
//           <div className="w-full space-y-4">
//             {faqs.length === 0 ? (
//               <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] text-center text-slate-400 font-bold">
//                 Belum ada FAQ tersedia.
//               </div>
//             ) : (
//               faqs.map((faq, index) => {
//                 const isOpen = openIndex === index;
//                 return (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className={`group rounded-[2rem] border-2 transition-all duration-500 ${
//                       isOpen 
//                         ? "bg-white border-blue-600 shadow-2xl shadow-blue-900/10" 
//                         : "bg-slate-50 border-gray-300"
//                     }`}
//                   >
//                     <button
//                       onClick={() => setOpenIndex(isOpen ? null : index)}
//                       className="w-full text-left p-8 flex justify-between items-center outline-none"
//                     >
//                       <h3 className={`text-md md:text-xl font-extrabold pr-6 transition-colors duration-300 ${
//                         isOpen ? "text-blue-600" : "text-slate-800"
//                       }`}>
//                         <span className={`mr-4 text-sm font-black ${isOpen ? "text-blue-600" : "text-slate-300"}`}>
//                           0{index + 1}
//                         </span>
//                         {faq.question}
//                       </h3>
//                       <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
//                         isOpen ? "bg-blue-600 text-white rotate-180" : "bg-white text-slate-400 group-hover:text-blue-600"
//                       }`}>
//                         <ChevronDown size={20} />
//                       </div>
//                     </button>

//                     <AnimatePresence>
//                       {isOpen && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.4, ease: "easeInOut" }}
//                           className="overflow-hidden"
//                         >
//                           <div className="pb-8 text-left text-slate-500 leading-relaxed font-medium text-sm md:text-lg border-t border-slate-100 ml-8">
//                             {faq.answer}
//                           </div>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </motion.div>
//                 );
//               })
//             )}
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// // Page utama
// const Page = ({ theme, schoolId }: any) => (
//   <div className="min-h-screen bg-white">
//     <NavbarComp/>
//     <HeroComp id="#sambutan" />
//     <StatsBar schoolId={schoolId} />
//     <SambutanComp />
//     <FasilitasSection />
//     <VideoSection />
//     <PengurusSection />
//     <BeritaComp />
//     <TugasComp />
//     <GalleryComp />
//     <InstagramFeedSection theme={theme} />
//     <CommentSection />
//     <SponsorMarqueeSection />
//     <FAQSection />
//     <FooterComp />
//   </div>
// );

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

// const Homepage = () => {
//   const { data: profile } = useProfile();
//   const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };
//   const [key, setKey] = useState(profile?.schoolName || 'Sekolah');
//   const schoolID = getSchoolIdSync();

//   useEffect(() => {
//     queryClient.invalidateQueries();
//   }, [key]);

//   return <Page theme={theme} onTenantChange={setKey} currentKey={key} schoolId={schoolID} />;
// };

// export default Homepage;


import { API_CONFIG } from "@/config/api";
import BeritaComp from "@/features/_global/components/berita";
import { FooterComp } from "@/features/_global/components/footer";
import GalleryComp from "@/features/_global/components/galeri";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { SambutanComp } from "@/features/_global/components/sambutan";
import TugasComp from "@/features/_global/components/tugas";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { queryClient } from "@/features/_root/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2, ChevronDown, Handshake,
  Instagram,
  Mail, MessageCircle, Play,
  Sparkles,
  SquareArrowOutUpRight,
  UserCheck,
  Users,
  UserX
} from "lucide-react";
import { cloneElement, useEffect, useState } from "react";

const BASE_URL = `${API_CONFIG.baseUrl}/profileSekolah`;
const BASE_URL2 = API_CONFIG.baseUrl;

interface SchoolProfile {
  schoolId?: number;
  schoolName?: string;
  headmasterName?: string;
  headmasterWelcome?: string;
  heroTitle?: string;
  heroSubTitle?: string;
  photoHeadmasterUrl?: string;
  studentCount?: number;
  teacherCount?: number;
  roomCount?: number;
  achievementCount?: number;
  linkYoutube?: string;
}

// ─── TYPOGRAPHY + FONT ────────────────────────────────────────────────────────
// Tambahkan ke index.html / _document.tsx:
// <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const tokens = {
  // Warna utama: deep navy + electric indigo + warm cream
  navy:   "#0B1120",
  indigo: "#4F6EF7",
  indigoLight: "#EEF1FE",
  cream:  "#FAF9F6",
  slate:  "#64748B",
  border: "#E8E8E4",
  white:  "#FFFFFF",
  green:  "#16A34A",
  amber:  "#D97706",
  rose:   "#E11D48",
};

// ─── SHARED: SECTION BADGE ────────────────────────────────────────────────────
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
    style={{ background: tokens.indigoLight, color: tokens.indigo, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    {children}
  </span>
);

// ─── SECTION HEADING ──────────────────────────────────────────────────────────
const SectionTitle = ({
  badge, title, accent, subtitle, light = false, center = true
}: {
  badge?: string; title: string; accent?: string; subtitle?: string; light?: boolean; center?: boolean;
}) => (
  <div className={`mb-12 ${center ? "text-center" : ""}`}>
    {badge && (
      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="mb-4">
        <Badge><Sparkles size={11} />{badge}</Badge>
      </motion.div>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="text-3xl md:text-5xl font-extrabold leading-tight mb-4"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: light ? tokens.white : tokens.navy,
      }}
    >
      {title}{" "}
      {accent && (
        <em style={{ fontFamily: "'Instrument Serif', serif", color: tokens.indigo, fontStyle: "italic" }}>
          {accent}
        </em>
      )}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="max-w-xl mx-auto text-base md:text-lg font-normal leading-relaxed"
        style={{ color: light ? "rgba(255,255,255,0.65)" : tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

// ─── DIVIDER ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="max-w-7xl mx-auto px-6">
    <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${tokens.border}, transparent)` }} />
  </div>
);

// ─── useNews ──────────────────────────────────────────────────────────────────
export function useNews(schoolId: string | number | undefined) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!schoolId) { setError("schoolId tidak ditemukan"); setLoading(false); return; }
    const fetchNews = async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${API_CONFIG.baseUrl}/berita?schoolId=${schoolId}`, {
          method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Gagal mengambil berita");
        setNews(json.data.map((item: any) => ({
          id: item.id, title: item.title,
          date: new Date(item.publishDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          tag: item.category || "Umum",
          img: item.imageUrl || "/default-news.jpg",
          excerpt: item.content.substring(0, 150) + "...",
          source: item.source || "Sekolah",
        })));
      } catch (err: any) { setError(err.message || "Gagal memuat berita"); }
      finally { setLoading(false); }
    };
    fetchNews();
  }, [schoolId]);
  return { news, loading, error };
}

// ─── FASILITAS ────────────────────────────────────────────────────────────────
interface Facility { id: number; name: string; description?: string; imageUrl?: string | null; }

const FasilitasSection = () => {
  const schoolId = getSchoolIdSync();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) { setError("School ID tidak ditemukan"); setLoading(false); return; }
    const fetchFacilities = async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${API_CONFIG.baseUrl}/fasilitas?schoolId=${schoolId}`, {
          cache: "no-store", headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) throw new Error("Format response tidak valid");
        setFacilities(json.data.map((item: any) => ({
          id: item.id, name: item.name, description: item.description, imageUrl: item.imageUrl || null,
        })));
      } catch (err: any) { setError(err.message || "Gagal memuat fasilitas"); }
      finally { setLoading(false); }
    };
    fetchFacilities();
  }, [schoolId]);

  const Skeleton = () => (
    <section className="py-16 md:py-24" style={{ background: tokens.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-6 w-32 rounded-full bg-gray-200 animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 rounded-xl bg-gray-200 animate-pulse mx-auto mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {[0,1,2,3].map(i => (
            <div key={i} className={`rounded-3xl bg-gray-200 animate-pulse ${i===0?"md:col-span-2 md:row-span-2":""}`}/>
          ))}
        </div>
      </div>
    </section>
  );

  if (loading) return <Skeleton />;

  return (
    <section className="py-16 md:py-24" style={{ background: tokens.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle badge="Infrastruktur" title="Fasilitas" accent="Unggulan" subtitle="Ruang belajar modern yang dirancang untuk memaksimalkan potensi setiap siswa." />

        {facilities.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed p-20 text-center" style={{ borderColor: tokens.border }}>
            <p style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Belum ada data fasilitas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
            {facilities.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`group relative rounded-3xl overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-2" : i === 1 ? "md:col-span-2" : ""}`}
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <img
                  src={item.imageUrl || "/default-facility.jpg"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to top, rgba(11,17,32,0.85) 0%, rgba(11,17,32,0.1) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2"
                    style={{ background: tokens.indigo, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Fasilitas
                  </span>
                  <h3 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-white/60 text-sm mt-1 line-clamp-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ─── PENGURUS ────────────────────────────────────────────────────────────────
const PengurusSection = () => {
  const [pengurus, setPengurus] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const SCHOOL_ID = getSchoolIdSync();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/guruTendik?schoolId=${SCHOOL_ID}`);
        const result = await response.json();
        const mainRoles = [
          { key: "Kepala Sekolah", label: "Kepala Sekolah" },
          { key: "Komite Sekolah", label: "Komite Sekolah" },
          { key: "Wakil Kepala Sekolah", label: "Wakil Kepala Sekolah" },
          { key: "Kepala Tata Usaha", label: "Kepala Tata Usaha" },
        ];
        if (result.success) {
          setPengurus(mainRoles.map(role => {
            const found = result.data.find((item: any) => item.role === role.key);
            return found
              ? { jabatan: found.role, nama: found.nama, img: found.photoUrl || "/kapalaSekolah.png", email: found.email, isPlaceholder: false }
              : { jabatan: role.label, nama: "Nama Tenaga Pendidik", img: null, email: "#", isPlaceholder: true };
          }));
        }
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return (
    <section className="py-16 md:py-24" style={{ background: tokens.white }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[0,1,2,3].map(i=>(
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] rounded-3xl bg-gray-100 animate-pulse" />
              <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <section className="py-16 md:py-24" style={{ background: tokens.white }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <SectionTitle
            badge="Leadership"
            title="Pilar"
            accent="Pendidikan"
            center={false}
          />
          <p className="text-base max-w-xs pb-12" style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Mereka yang memimpin dan menjaga kualitas pendidikan setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pengurus.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="group"
            >
              <div
                className="relative rounded-3xl overflow-hidden mb-5"
                style={{
                  aspectRatio: "3/4",
                  background: item.isPlaceholder ? tokens.cream : "#E8EAF6",
                  border: `1.5px solid ${tokens.border}`,
                }}
              >
                {item.isPlaceholder ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: tokens.indigoLight }}>
                      <Users size={28} style={{ color: tokens.indigo }} />
                    </div>
                    <span className="text-sm font-medium text-center px-4"
                      style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.jabatan}
                    </span>
                  </div>
                ) : (
                  <>
                    <img src={item.img} alt={item.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5"
                      style={{ background: "linear-gradient(to top, rgba(11,17,32,0.7), transparent)" }}>
                      <a href={`mailto:${item.email}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                        style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <Mail size={14} /> Kirim Email
                      </a>
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1"
                style={{ color: tokens.indigo, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {item.jabatan}
              </p>
              <h3 className="text-base font-bold" style={{ color: tokens.navy, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {item.nama}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── VIDEO ───────────────────────────────────────────────────────────────────
const VideoSection = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const SCHOOL_ID = getSchoolIdSync();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`);
        const result = await res.json();
        if (result.success) setProfile(result.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [SCHOOL_ID]);

  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const videoId = getYouTubeId(profile?.linkYoutube);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: tokens.navy }}>
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle
          badge="Audio Visual"
          title="Tentang"
          accent="Kami"
          subtitle={`${profile?.schoolName || "Sekolah kami"} dalam lensa kamera. Saksikan semangat belajar kami.`}
          light
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="rounded-[2rem] overflow-hidden"
            style={{ border: `1.5px solid rgba(255,255,255,0.1)`, boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
            <div className="relative" style={{ aspectRatio: "16/9", background: "#0B1120" }}>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
              ) : !videoId ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(79,110,247,0.2)", border: "1px solid rgba(79,110,247,0.3)" }}>
                    <Play size={28} style={{ color: tokens.indigo }} />
                  </div>
                  <p className="text-white/50 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Video belum tersedia</p>
                </div>
              ) : (
                <iframe width="100%" height="100%" src={embedUrl} title="School Profile Video"
                  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen className="absolute inset-0 w-full h-full" />
              )}
            </div>
          </div>

          {!loading && videoId && (
            <div className="absolute -bottom-4 right-6 px-5 py-3 rounded-2xl text-xs font-bold tracking-widest uppercase"
              style={{ background: tokens.indigo, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: `0 8px 24px ${tokens.indigo}55` }}>
              Official • 2024/2025
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ─── INSTAGRAM FEED ───────────────────────────────────────────────────────────
const InstagramFeedSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const schoolId = getSchoolIdSync();
        const response = await fetch(`${BASE_URL2}/feed?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success) setPosts(result.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchFeeds();
  }, []);

  return (
    <section className="py-16 md:py-24" style={{ background: tokens.cream }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <Badge><Instagram size={11} />Social Media</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-4 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: tokens.navy }}>
              Instagram{" "}
              <em style={{ fontFamily: "'Instrument Serif', serif", color: tokens.indigo, fontStyle: "italic" }}>Feed</em>
            </h2>
          </div>
          <a href="https://instagram.com" target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all"
            style={{ background: tokens.navy, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Ikuti Kami <ArrowRight size={16} />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i=>(
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-3xl"/>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed p-20 text-center" style={{ borderColor: tokens.border }}>
            <p style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Belum ada postingan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {posts.map((post: any, i: number) => (
              <motion.a
                key={post.id || i}
                href={post.postLink} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.04 }}
                className="group relative rounded-3xl overflow-hidden"
                style={{ aspectRatio: "1", background: tokens.navy }}
              >
                {post.mediaType === "video" ? (
                  <video className="w-full h-full object-cover opacity-85 group-hover:opacity-60 transition-opacity" muted loop autoPlay>
                    <source src={post.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img src={post.mediaUrl} className="w-full h-full object-cover transition-all duration-600 group-hover:scale-105 group-hover:opacity-60" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <SquareArrowOutUpRight size={14} /> Lihat
                  </div>
                </div>
                {post.mediaType === "video" && (
                  <div className="absolute top-3 right-3"><Play size={16} fill="white" color="white" /></div>
                )}
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ─── STATS BAR ────────────────────────────────────────────────────────────────
const fetchStats = async (schoolId: string) => {
  const { data } = await axios.get(`${API_CONFIG.baseUrl}/siswa/summary-attendances`, { params: { schoolId } });
  const { siswa, guru } = data.data;
  return [
    { k: "Siswa Hadir", v: siswa.rincian.Hadir, icon: <UserCheck />, color: tokens.green },
    { k: "Siswa Alpha", v: siswa.belumAbsen, icon: <UserX />, color: tokens.rose },
    { k: "Guru Hadir", v: guru.rincian.Hadir, icon: <UserCheck />, color: tokens.indigo },
    { k: "Guru Alpha", v: guru.belumAbsen, icon: <UserX />, color: tokens.amber },
  ];
};

const StatsBar = ({ schoolId }: { schoolId: string }) => {
  const { data: stats, isPending, error } = useQuery({
    queryKey: ["attendanceStats", schoolId],
    queryFn: () => fetchStats(schoolId),
    refetchInterval: 60000,
  });

  if (isPending) return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i=>(
          <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (error) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats?.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.07 }}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: tokens.white, border: `1.5px solid ${tokens.border}` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: s.color + "15" }}>
              {cloneElement(s.icon as React.ReactElement, { size: 20, style: { color: s.color } })}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.k}</p>
              <span className="text-3xl font-extrabold"
                style={{ color: tokens.navy, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.v}</span>
              <span className="text-sm ml-1.5" style={{ color: tokens.slate }}>orang</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── COMMENT / RATING ─────────────────────────────────────────────────────────
const useComments = (schoolId: number) => {
  const API_BASE = API_CONFIG.baseUrl;
  const query = useQuery({
    queryKey: ["comments", schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/rating?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Gagal memuat komentar");
      return data.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
  const mutation = useMutation({
    mutationFn: async (newComment: { name: string; email: string; comment: string; rating: number }) => {
      const res = await fetch(`${API_BASE}/rating`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newComment, schoolId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Gagal mengirim komentar");
      return data.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["comments", schoolId] }); },
  });
  return { ...query, mutate: mutation.mutate, isSubmitting: mutation.isPending };
};

const CommentSection = () => {
  const schoolId: any = getSchoolIdSync();
  const { mutate, isSubmitting } = useComments(schoolId);
  const [form, setForm] = useState({ name: "", email: "", comment: "", rating: 5 });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) { alert("Nama dan komentar wajib diisi"); return; }
    mutate({ email: form.email.trim() || "anonymous@example.com", name: form.name.trim(), comment: form.comment.trim(), rating: form.rating }, {
      onSuccess: () => { setForm({ name: "", email: "", comment: "", rating: 5 }); alert("Terima kasih atas ulasan Anda!"); },
      onError: (err: any) => { alert("Gagal mengirim: " + (err.message || "Unknown error")); },
    });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 14, border: `1.5px solid ${tokens.border}`,
    background: tokens.cream, outline: "none", fontSize: 15, color: tokens.navy,
    fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "border-color 0.2s",
  };

  return (
    <section className="py-16 md:py-24" style={{ background: tokens.navy }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <SectionTitle badge="Testimoni" title="Suara" accent="Akademik"
          subtitle="Bagikan pengalaman belajar Anda bersama kami." light />

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 md:p-10"
          style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Nama Lengkap</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  style={{ ...inputStyle, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#fff" }}
                  placeholder="Nama kamu" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  style={{ ...inputStyle, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#fff" }}
                  placeholder="email@kamu.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setForm(p=>({...p,rating:star}))}
                    className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    style={{ color: star <= form.rating ? "#FBBF24" : "rgba(255,255,255,0.2)" }}>★</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pesan & Kesan</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} required rows={4}
                style={{ ...inputStyle, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#fff", resize: "none" }}
                placeholder="Ceritakan pengalaman belajar kamu..." />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all"
              style={{
                background: isSubmitting ? "rgba(255,255,255,0.1)" : tokens.indigo,
                color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: isSubmitting ? "none" : `0 8px 24px ${tokens.indigo}55`,
              }}>
              {isSubmitting ? "Mengirim..." : "Kirim Ulasan →"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

// ─── SPONSOR MARQUEE ─────────────────────────────────────────────────────────
interface Sponsor { id: number; name: string; imageUrl?: string | null; }

const SponsorMarqueeSection = () => {
  const schoolId = getSchoolIdSync();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;
    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_CONFIG.baseUrl}/partner?schoolId=${schoolId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal memuat sponsor");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) setSponsors(json.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchSponsors();
  }, [schoolId]);

  const duplicated = [...sponsors, ...sponsors];

  return (
    <section className="py-14 border-y" style={{ background: tokens.white, borderColor: tokens.border }}>
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge><Handshake size={11} />Strategic Partners</Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold mt-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: tokens.navy }}>
              Mitra &{" "}
              <em style={{ fontFamily: "'Instrument Serif', serif", color: tokens.indigo, fontStyle: "italic" }}>Sponsor</em>
            </h2>
          </div>
          <p className="text-sm" style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Berkolaborasi dengan institusi terpercaya untuk memajukan pendidikan.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 px-6 overflow-hidden">
          {[1,2,3,4,5].map(i=>(
            <div key={i} className="min-w-[160px] h-20 rounded-2xl bg-gray-100 animate-pulse flex-shrink-0"/>
          ))}
        </div>
      ) : sponsors.length === 0 ? (
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-3xl border-2 border-dashed p-14 text-center" style={{ borderColor: tokens.border }}>
            <Building2 size={28} style={{ color: tokens.slate, margin: "0 auto 8px" }} />
            <p className="text-sm" style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Belum ada mitra terdaftar.</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap" style={{ animation: "marquee 40s linear infinite" }}>
            {duplicated.map((s, i) => (
              <div key={`${s.id}-${i}`} className="flex-shrink-0 mx-6 flex items-center justify-center"
                style={{ minWidth: 160 }}>
                <div className="px-8 py-4 rounded-2xl flex items-center justify-center transition-all hover:shadow-sm"
                  style={{ border: `1.5px solid ${tokens.border}`, background: tokens.white }}>
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.name} className="h-12 w-auto object-contain" />
                  ) : (
                    <span className="text-sm font-semibold" style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: max-content; }
      `}</style>
    </section>
  );
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const useFAQs = (schoolId: string | number) => {
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) { setError("schoolId tidak ditemukan"); setLoading(false); return; }
    const fetchFAQs = async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${API_CONFIG.baseUrl}/faq?schoolId=${schoolId}`, {
          method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) throw new Error("Format tidak valid");
        setFaqs(json.data
          .filter((e: any) => e.isActive !== false)
          .flatMap((e: any) => Array.isArray(e.faqs) ? e.faqs : [])
          .filter((f: any) => f?.question?.trim() && f?.answer?.trim()));
      } catch (err: any) { setError(err.message || "Gagal memuat FAQ"); }
      finally { setLoading(false); }
    };
    fetchFAQs();
  }, [schoolId]);
  return { faqs, loading, error };
};

const FAQSection = () => {
  const SCHOOL_ID = getSchoolIdSync();
  const { faqs, loading } = useFAQs(SCHOOL_ID);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24" style={{ background: tokens.cream }}>
      <div className="max-w-4xl mx-auto px-6">
        <SectionTitle badge="Bantuan" title="Pertanyaan yang" accent="Sering Diajukan"
          subtitle="Temukan jawaban cepat seputar informasi sekolah kami." />

        {loading ? (
          <div className="space-y-3">
            {[0,1,2,3].map(i=>(
              <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse"/>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed p-14 text-center" style={{ borderColor: tokens.border }}>
            <p style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Belum ada FAQ tersedia.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    border: `1.5px solid ${isOpen ? tokens.indigo : tokens.border}`,
                    background: isOpen ? tokens.white : tokens.white,
                    boxShadow: isOpen ? `0 4px 24px rgba(79,110,247,0.08)` : "none",
                  }}>
                  <button onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left outline-none">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold tabular-nums"
                        style={{ color: isOpen ? tokens.indigo : tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {String(i+1).padStart(2,"0")}
                      </span>
                      <span className="font-semibold text-sm md:text-base"
                        style={{ color: isOpen ? tokens.navy : tokens.navy, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ background: isOpen ? tokens.indigo : tokens.cream, transform: isOpen ? "rotate(180deg)" : "none" }}>
                      <ChevronDown size={16} style={{ color: isOpen ? "#fff" : tokens.slate }} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden">
                        <div className="px-6 pb-6 ml-10 text-sm md:text-base leading-relaxed"
                          style={{ color: tokens.slate, fontFamily: "'Plus Jakarta Sans', sans-serif", borderTop: `1px solid ${tokens.border}`, paddingTop: 16 }}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Kontak */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col md:flex-row items-center gap-6 rounded-3xl p-8"
          style={{ background: tokens.navy }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${tokens.indigo}30` }}>
            <MessageCircle size={22} style={{ color: tokens.indigo }} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Masih ada pertanyaan?</h4>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tim kami siap membantu Anda secara langsung.</p>
          </div>
          <a href="/layanan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold flex-shrink-0"
            style={{ background: tokens.indigo, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Hubungi Kami <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const Page = ({ theme, schoolId }: any) => (
  <div className="min-h-screen" style={{ background: tokens.white, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
    <NavbarComp />
    <HeroComp id="#sambutan" />
    <StatsBar schoolId={schoolId} />
    <Divider />
    <SambutanComp />
    <Divider />
    <FasilitasSection />
    <VideoSection />
    <PengurusSection />
    <Divider />
    <BeritaComp />
    <TugasComp />
    <GalleryComp />
    <InstagramFeedSection />
    <CommentSection />
    <SponsorMarqueeSection />
    <FAQSection />
    <FooterComp />
  </div>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const useProfile = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ["school-profile", schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const Homepage = () => {
  const { data: profile } = useProfile();
  const [key, setKey] = useState(profile?.schoolName || "Sekolah");
  const schoolID = getSchoolIdSync();
  useEffect(() => { queryClient.invalidateQueries(); }, [key]);
  return <Page theme={profile?.theme} onTenantChange={setKey} currentKey={key} schoolId={schoolID} />;
};

export default Homepage;