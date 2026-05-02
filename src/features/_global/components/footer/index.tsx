// import {
//   ExternalLink,
//   Globe,
//   Mail,
//   MapPin,
//   Phone,
//   ShieldCheck
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getSchoolId } from "../../hooks/getSchoolId";

// export const FooterComp = () => {
//   const [schoolData, setSchoolData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const schoolId = getSchoolId();
//       try {
//         // Ganti URL ini dengan endpoint API backend kamu
//         const response = await fetch(`https://be-school.kiraproject.id/profileSekolah?schoolId=${schoolId}`);
//         const result = await response.json();
//         if (result.success && result.data) {
//           setSchoolData(result.data);
//         }
//       } catch (error) {
//         console.error("Gagal mengambil data footer:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // State Loading atau Default jika data belum ada
//   if (loading) return <div className="bg-blue-800 h-20" />; 

//   // Fungsi untuk membersihkan nama dari keterangan wilayah
//   const cleanSchoolName = (name: string) => {
//     if (!name) return "";
//     // Regex untuk mencari kata wilayah, \b memastikan kata berdiri sendiri (bukan bagian dari kata lain)
//     const pattern = /\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi;
//     return name.replace(pattern, "").replace(/\s\s+/g, ' ').trim();
//   };

//   const displayData = {
//     // Nama sekolah yang sudah dibersihkan
//     name: cleanSchoolName(schoolData?.schoolName || "Ceria Academy"),
    
//     address: schoolData?.address || "Alamat belum diatur",
//     phone: schoolData?.phoneNumber || "-",
//     email: schoolData?.email || "-",
    
//     // Mengambil inisial dari nama yang sudah bersih
//     shortName: cleanSchoolName(schoolData?.schoolName || "CA")
//       .split(' ')
//       .filter(word => word.length > 0)
//       .map(n => n[0])
//       .join('')
//       .substring(0, 2)
//       .toUpperCase(),

//     mapsUrl: (schoolData?.latitude && schoolData?.longitude) 
//       ? `https://www.google.com/maps?q=${schoolData.latitude},${schoolData.longitude}`
//       : "#"
//   };

//   return (
//     <footer className="relative bg-blue-800 text-white overflow-hidden">
//       {/* Decorative background elements */}
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
//       <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800/10 rounded-full blur-[100px]" />
      
//       <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
//           {/* Brand Column */}
//           <div className="md:col-span-5 space-y-6">
//             <div className="flex items-center gap-4">
//               <div 
//                 className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg bg-[#F2C94C] text-[#1e293b]"
//               >
//                 {displayData.shortName}
//               </div>
//               <div>
//                 <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
//                   {displayData.name}
//                 </h2>
//                 <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mt-1">
//                   Web Pendidikan
//                 </p>
//               </div>
//             </div>
            
//             <p className="text-slate-200 text-sm leading-relaxed max-w-sm">
//               Mewujudkan lulusan yang berkarakter Profil Pelajar Pancasila, 
//               unggul dalam prestasi, berbudaya lingkungan, dan siap menghadapi 
//               tantangan global.
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div className="md:col-span-3">
//             <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
//               <Globe size={14} className="text-blue-200 ml-[-4px]" /> Navigasi
//             </h4>
//             <ul className="grid grid-cols-1 gap-4">
//               {['Halaman-utama', 'Pengumuman', 'Galeri', 'Layanan'].map((item) => (
//                 <li key={item}>
//                   <a 
//                     href={`/${item.toLowerCase()}`} 
//                     className="text-slate-200 hover:text-white text-sm font-medium flex items-center gap-2 transition-all hover:translate-x-1"
//                   >
//                     <div className="w-1.5 h-1.5 rounded-full bg-white" />
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div className="md:col-span-4">
//             <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
//               <MapPin size={16} className="text-blue-200 ml-[-4px]" /> Hubungi Kami
//             </h4>
//             <div className="space-y-4">
//               <p className="text-slate-200 text-sm leading-relaxed">
//                 {displayData.address}
//               </p>
              
//               <div className="space-y-2">
//                 <div className="flex items-center gap-3 text-sm text-slate-300">
//                   <Phone size={14} /> {displayData.phone}
//                 </div>
//                 <div className="flex items-center gap-3 text-sm text-slate-300">
//                   <Mail size={14} /> {displayData.email}
//                 </div>
//               </div>

//               <a 
//                 href={displayData.mapsUrl}
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 mt-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
//               >
//                 Buka di Google Maps <ExternalLink size={12} />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
//           <div className="flex items-center gap-2 text-slate-200 text-[11px] font-bold uppercase tracking-widest">
//             <ShieldCheck size={14} />
//             <span>© 2026 {displayData.name} • All Rights Reserved</span>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Official Partner</span>
//             <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/5">
//               <span className="text-[10px] text-slate-300">Powered by</span>
//               <span className="text-xs font-black text-white tracking-tighter italic">XPRESENSI</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };


import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSchoolId, getSchoolIdSync } from "../../hooks/getSchoolId";
import { API_CONFIG } from "@/config/api";

// ─── School Profile Hook ─────────────────────────────────────────────────────
const useSchoolProfile = () => {
  const schoolId = getSchoolId();

  return useQuery({
    queryKey: ["schoolProfile", schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Gagal mengambil profil: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Response tidak valid");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ─── Islamic Ornament (hanya untuk schoolId 3) ───────────────────────────────
const FooterOrnament = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #B7935A)" }} />
    <div className="w-2 h-2 rotate-45" style={{ background: "#D4AF72" }} />
    <div className="w-3 h-3 rotate-45 border" style={{ borderColor: "#B7935A" }} />
    <div className="w-2 h-2 rotate-45" style={{ background: "#D4AF72" }} />
    <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(90deg, #B7935A, transparent)" }} />
  </div>
);

// ─── MAIN FOOTER COMPONENT ──────────────────────────────────────────────────
export const FooterComp = () => {
  const schoolId = getSchoolIdSync();
  const { data: profile, isPending } = useSchoolProfile();

  const isIslamicSchool = !!(profile?.isIslamicSchool || profile?.isIslamic || profile?.schoolType === "islamic");

  // Cleaning function
  const cleanSchoolName = (name: string) => {
    if (!name) return isIslamicSchool ? "Sekolah Islam Terpadu" : "Official Website";
    const pattern = /\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi;
    return name.replace(pattern, "").replace(/\s\s+/g, ' ').trim();
  };

  const displayData = {
    name: cleanSchoolName(profile?.schoolName || ""),
    address: profile?.address || "Alamat belum diatur",
    phone: profile?.phoneNumber || "-",
    email: profile?.email || "-",
    shortName: cleanSchoolName(profile?.schoolName || (isIslamicSchool ? "SIT" : "CA"))
      .split(' ')
      .filter(word => word.length > 0)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase(),
    mapsUrl: (profile?.latitude && profile?.longitude) 
      ? `https://www.google.com/maps?q=${profile.latitude},${profile.longitude}`
      : "#"
  };

  if (isPending) {
    return <div className="bg-[#0D1F17] h-96" />;
  }

  // ====================== ISLAMIC FOOTER (schoolId === "3") ======================
  if (isIslamicSchool) {
    return (
      <footer 
        className="relative overflow-hidden text-white"
        style={{ background: "#0A1A14" }}
      >
        {/* Islamic Geometric Background */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="footer-islamic" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <polygon 
                  points="50,10 65,30 85,30 72,50 85,70 65,70 50,90 35,70 15,70 28,50 15,30 35,30" 
                  fill="none" 
                  stroke="#D4AF72" 
                  strokeWidth="0.6" 
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-islamic)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl border-2"
                  style={{ 
                    background: "linear-gradient(135deg, #1B4332, #2D6A4F)",
                    borderColor: "#D4AF72",
                    color: "#D4AF72"
                  }}
                >
                  {displayData.shortName}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none text-white">
                    {displayData.name}
                  </h2>
                  <p className="text-xs font-semibold tracking-[0.25em] mt-1.5 text-[#D4AF72]">
                    {profile?.schoolType || ""}
                  </p>
                </div>
              </div>

              <p className="text-amber-100/70 text-[15px] leading-relaxed max-w-md">
                {profile?.schoolSlogan || ""}
              </p>

              <div 
                className="text-2xl mt-6"
                style={{ 
                  fontFamily: "'Amiri', 'Scheherazade New', serif",
                  color: "#D4AF72",
                  opacity: 0.85
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#D4AF72]">
                Navigasi Utama
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Beranda", href: "/" },
                  { label: "Profil Sekolah", href: "/profil" },
                  { label: "Kurikulum Islami", href: "/kurikulum" },
                  { label: "PPDB", href: "/ppdb" },
                  { label: "Berita & Pengumuman", href: "/berita" },
                ].map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      className="text-amber-100/80 hover:text-white text-sm flex items-center gap-3 group transition-all"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF72] transition-all group-hover:scale-125" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-4">
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#D4AF72]">
                <MapPin size={17} className="inline mr-2" /> Hubungi Kami
              </h4>
              <div className="space-y-5 text-sm">
                <p className="text-amber-100/75 leading-relaxed">{displayData.address}</p>

                <div className="space-y-3">
                  <a href={`tel:${displayData.phone}`} className="flex items-center gap-3 text-amber-100/80 hover:text-white transition-colors">
                    <Phone size={18} style={{ color: "#D4AF72" }} /> {displayData.phone}
                  </a>
                  <a href={`mailto:${displayData.email}`} className="flex items-center gap-3 text-amber-100/80 hover:text-white transition-colors">
                    <Mail size={18} style={{ color: "#D4AF72" }} /> {displayData.email}
                  </a>
                </div>

                <a 
                  href={displayData.mapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-4 text-[#D4AF72] hover:text-amber-300 transition-colors"
                >
                  Lihat Lokasi di Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          <FooterOrnament />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-amber-100/60">
              <ShieldCheck size={15} style={{ color: "#D4AF72" }} />
              <span>© {new Date().getFullYear()} {displayData.name} • All Rights Reserved</span>
            </div>
            <div className="text-[10px] text-amber-100/50">
              Didesain dengan semangat <span className="font-semibold text-amber-300">إِحْسَان</span>
            </div>
          </div>
        </div>

        <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #B7935A, transparent)" }} />
      </footer>
    );
  }

  // ====================== DEFAULT FOOTER (schoolId !== "3") ======================
  return (
    <footer className="relative bg-blue-800 text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800/10 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg bg-[#F2C94C] text-[#1e293b]"
              >
                {displayData.shortName}
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
                  {displayData.name}
                </h2>
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mt-1">
                  {profile?.schoolType || ""}
                </p>
              </div>
            </div>
            
            <p className="text-slate-200 text-sm leading-relaxed max-w-sm">
              {profile?.schoolDescription || ""}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
              <Globe size={14} className="text-blue-200 ml-[-4px]" /> Navigasi
            </h4>
            <ul className="grid grid-cols-1 gap-4">
              {['Halaman-utama', 'Pengumuman', 'Galeri', 'Layanan'].map((item) => (
                <li key={item}>
                  <a 
                    href={`/${item.toLowerCase()}`} 
                    className="text-slate-200 hover:text-white text-sm font-medium flex items-center gap-2 transition-all hover:translate-x-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-2">
              <MapPin size={16} className="text-blue-200 ml-[-4px]" /> Hubungi Kami
            </h4>
            <div className="space-y-4">
              <p className="text-slate-200 text-sm leading-relaxed">
                {displayData.address}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Phone size={14} /> {displayData.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Mail size={14} /> {displayData.email}
                </div>
              </div>

              <a 
                href={displayData.mapsUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
              >
                Buka di Google Maps <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-200 text-[11px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>© {new Date().getFullYear()} {displayData.name} • All Rights Reserved</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-200 text-[10px] font-black uppercase tracking-widest">Official Partner</span>
            <div className="flex items-center gap-1.5 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span className="text-[10px] text-slate-300">Powered by</span>
              <span className="text-xs font-black text-white tracking-tighter italic">XPRESENSI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;