import {
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";
import { setFaviconFromProfile } from "@/core/utils/favicon";
import { getSchoolIdSync } from "../../hooks/getSchoolId";

export const FooterComp = () => {
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const schoolId = getSchoolIdSync();
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/profileSekolah?schoolId=${schoolId}`);
        const result = await response.json();
        if (result.success && result.data) {
          setSchoolData(result.data);
          setFaviconFromProfile(result.data);
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // State Loading atau Default jika data belum ada
  if (loading) return <div className="bg-blue-800 h-20" />;

  // Jika belum ada data sekolah, tampilkan footer minimal
  const hasSchoolData = schoolData?.schoolName;

  // Fungsi untuk membersihkan nama dari keterangan wilayah
  const cleanSchoolName = (name: string) => {
    if (!name) return "";
    // Regex untuk mencari kata wilayah, \b memastikan kata berdiri sendiri (bukan bagian dari kata lain)
    const pattern = /\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi;
    return name.replace(pattern, "").replace(/\s\s+/g, ' ').trim();
  };

  const displayData = {
    // Nama sekolah - tidak ada default, kosong sampai admin input
    name: cleanSchoolName(schoolData?.schoolName || ""),

    address: schoolData?.address || "",
    phone: schoolData?.phoneNumber || "",
    email: schoolData?.email || "",

    // Mengambil inisial dari nama yang sudah bersih
    shortName: schoolData?.schoolName
      ? cleanSchoolName(schoolData.schoolName)
          .split(' ')
          .filter(word => word.length > 0)
          .map(n => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : "",

    mapsUrl: (schoolData?.latitude && schoolData?.longitude)
      ? `https://www.google.com/maps?q=${schoolData.latitude},${schoolData.longitude}`
      : "#",

    // Social media
    instagram: schoolData?.socialInstagram || "",
    facebook: schoolData?.socialFacebook || "",
    twitter: schoolData?.socialTwitter || "",

    // Dynamic year
    year: new Date().getFullYear()
  };

  return (
    <footer className="relative bg-blue-800 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-800/10 rounded-full blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            {schoolData?.logoUrl && (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-white overflow-hidden">
                  <img
                    src={schoolData.logoUrl}
                    alt={displayData.name || "Logo Sekolah"}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">
                    {displayData.name}
                  </h2>
                  <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mt-1">
                    Web Pendidikan
                  </p>
                </div>
              </div>
            )}

            {schoolData?.headmasterWelcome && (
              <p className="text-slate-200 text-sm leading-relaxed max-w-sm">
                {schoolData.headmasterWelcome}
              </p>
            )}
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

          {/* Contact Info - hanya tampilkan jika ada data kontak */}
          {hasSchoolData && (
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

              {/* Social Media Icons */}
              {(displayData.instagram || displayData.facebook || displayData.twitter) && (
                <div className="flex items-center gap-3 mt-4">
                  {displayData.instagram && (
                    <a href={displayData.instagram} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Instagram size={14} />
                    </a>
                  )}
                  {displayData.facebook && (
                    <a href={displayData.facebook} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Facebook size={14} />
                    </a>
                  )}
                  {displayData.twitter && (
                    <a href={displayData.twitter} target="_blank" rel="noopener noreferrer"
                       className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Twitter size={14} />
                    </a>
                  )}
                </div>
              )}

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
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-200 text-[11px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>© {displayData.year} {displayData.name}{displayData.name ? ' • All Rights Reserved' : ''}</span>
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