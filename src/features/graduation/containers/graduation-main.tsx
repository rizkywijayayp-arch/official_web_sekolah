import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { Award, Calendar, Users, Search, Loader2 } from "lucide-react";

const API_BASE_URL = "https://be-.oject.id";
const SCHOOL_ID = getSchoolIdSync();

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

export function PengumumanKelulusan() {
  const { data: profile } = useProfile();
  const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };
  const [config, setConfig] = useState({ year: "", batch: "" });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        // 1. Ambil Setting Tampilan dari API yang kita buat tadi
        const setRes = await fetch(`${API_BASE_URL}/alumni/get-alumni-display/${SCHOOL_ID}`);
        const setJson = await setRes.json();
        
        if (setJson.success && setJson.data) {
          const { displayAlumniYear, displayAlumniBatch } = setJson.data;
          setConfig({ year: displayAlumniYear, batch: displayAlumniBatch });

          // 2. Ambil data siswa berdasarkan filter tersebut
          const params = new URLSearchParams({
            schoolId: String(SCHOOL_ID),
            isVerified: "true",
            graduationYear: displayAlumniYear || "",
            batch: displayAlumniBatch || ""
          });

          const alRes = await fetch(`${API_BASE_URL}/alumni?${params.toString()}`);
          const alJson = await alRes.json();
          if (alJson.success) setStudents(alJson.data);
        }
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <NavbarComp theme={theme} />
      
      {/* Hero Section Khusus Pengumuman */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#2563eb,transparent)]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-6"
          >
            <Award size={14} /> Official Announcement
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-4">
            Kelulusan Siswa <span className="text-blue-600 font-outline-2">{config.year || "2026"}</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
            Selamat kepada seluruh siswa <span className="text-white">Angkatan {config.batch || "-"}</span> yang telah menyelesaikan masa studinya dengan gemilang.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Tahun Ajaran", val: config.year, icon: <Calendar className="text-blue-500" /> },
            { label: "Total Kelulusan", val: students.length + " Siswa", icon: <Users className="text-green-500" /> },
            { label: "Status Data", val: "Verified", icon: <Award className="text-yellow-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">{stat.icon}</div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.val}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama Anda di daftar kelulusan..."
            className="w-full h-16 pl-16 pr-6 bg-white rounded-2xl shadow-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Menyiapkan data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredStudents.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex items-center gap-4"
                >
                  <img 
                    src={s.photoUrl || "/placeholder.jpg"} 
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-100" 
                    alt={s.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{s.name}</h4>
                    <p className="text-xs text-blue-600 font-black uppercase tracking-widest mt-1">Lulus</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      <FooterComp />
    </div>
  );
}