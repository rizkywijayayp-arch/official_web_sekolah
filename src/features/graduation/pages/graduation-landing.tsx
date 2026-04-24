import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Award, Calendar, Loader2, Search, Users } from "lucide-react";
import { useState, useMemo, useEffect } from 'react';
import _ from "lodash"; // Import Lodash
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = API_CONFIG.BASE_URL;
const SCHOOL_ID = getSchoolIdSync();

export function PengumumanKelulusan() {
  const [searchTerm, setSearchTerm] = useState("");
  // State tambahan untuk menyimpan hasil debounce
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const navigate = useNavigate();

  // --- LOGIKA DEBOUNCE LODASH ---
  const handleDebounceSearch = useMemo(
    () => _.debounce((value: string) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Input tetap responsif (instant)
    handleDebounceSearch(value); // Filter dijalankan setelah delay 500ms
  };

  // --- REACT QUERY CONFIG ---
  const { data: config, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['alumniConfig', SCHOOL_ID],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/alumni/get-alumni-display/${SCHOOL_ID}`);
      const json = await res.json();
      return json.data;
    },
    // staleTime: 1 * 60 * 1000, // 1 Menit
    // gcTime: 2 * 60 * 1000,    // 2 Menit
  });

  // --- REACT QUERY STUDENTS ---
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['alumniList', SCHOOL_ID, config?.displayAlumniYear],
    queryFn: async () => {
      const params = new URLSearchParams({
        schoolId: String(SCHOOL_ID),
        isVerified: "true",
        graduationYear: config?.displayAlumniYear || "",
      });
      const res = await fetch(`${API_BASE_URL}/alumni?${params.toString()}`);
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!config?.displayAlumniYear,
    staleTime: 3 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
  });

  // Filter menggunakan debouncedSearch (bukan searchTerm)
  const filteredStudents = students.filter((s: any) =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const loading = isLoadingConfig || isLoadingStudents;

  useEffect(() => {
    // 2. Fungsi untuk menjalankan konfeti
    const fireConfetti = () => {
      const duration = 10 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Menembakkan dari sisi kiri dan kanan
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 350);
    };

    // Jalankan jika user tidak mengaktifkan 'reduced motion'
    if (!prefersReducedMotion) {
      fireConfetti();
    }

    // Smoke tests Anda tetap di sini
    try {
      
    } catch (e) {
      
    }
  }, [prefersReducedMotion]);

  // Logika Hitung Mundur
  useEffect(() => {
    if (!config?.announcementDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(config.announcementDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft(null); // Waktu sudah habis
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config?.announcementDate]);

  // Jika Loading Config
  if (isLoadingConfig) return <div className="min-h-screen flex items-center justify-center bg-[#0B1220]"><Loader2 className="animate-spin text-blue-600" /></div>;
  
    // VIEW: Jika waktu belum tiba (COUNTDOWN)
  if (timeLeft) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          {/* Glow Effect di belakang teks */}
          <div className="absolute -inset-20 bg-blue-600/10 blur-[120px] rounded-full -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-black uppercase tracking-[0.3em] mb-8">
            Announcement Coming Soon
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-8 tracking-tighter">
            Halaman Kelulusan <br /> <p className="text-blue-600 mt-1.5">Segera Dibuka</p>
          </h1>
          
          <div className="flex gap-3 md:gap-6 justify-center">
            {[
              { label: "Hari", val: timeLeft.days },
              { label: "Jam", val: timeLeft.hours },
              { label: "Menit", val: timeLeft.minutes },
              { label: "Detik", val: timeLeft.seconds },
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-26 md:h-26 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[1.6rem] flex items-center justify-center text-4xl md:text-4xl font-black text-white shadow-2xl backdrop-blur-md">
                  {String(unit.val).padStart(2, '0')}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white mt-4 italic">{unit.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)} // -1 artinya kembali ke halaman sebelumnya (history)
          className="relative text-center mt-12 justify-center bg-blue-800 p-4 hover:bg-blue-700 active:scale-[0.98] rounded-2xl border-2 border-white text-white w-max mx-auto flex items-center gap-4 hover:text-white transition-all group z-50"
        >
          <div className="w">
            <ArrowLeft size={20} />
          </div>
          <div className="flex items-start relative top-[2px]">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-1">Kembali Ke Halaman Utama</span>
            {/* <span className="text-[10px] text-white transition-colors">Ke Halaman Utama</span> */}
          </div>
        </motion.button>

        {/* Background Ornaments */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-600/20 blur-[100px]" />
          <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-blue-900/20 blur-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <NavbarComp />
      
      {/* Hero Section */}
      <div className="relative pt-32 h-[80vh] pb-20 px-6 overflow-hidden bg-[#0B1220]">
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
            Kelulusan Siswa <span className="text-blue-600 font-outline-2">{config?.displayAlumniYear || new Date().getFullYear()}</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
            Selamat kepada seluruh siswa <span className="text-white">angkatan {config?.displayAlumniBatch || (new Date().getFullYear() - 3)}</span> yang telah menyelesaikan masa studinya dengan gemilang.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Tahun Ajaran", val: config?.displayAlumniYear, icon: <Calendar className="text-blue-500" /> },
            { label: "Total Kelulusan", val: students.length + " Siswa", icon: <Users className="text-green-500" /> },
            { label: "Status Data", val: "Verified", icon: <Award className="text-yellow-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[1rem] shadow-xl border border-gray-100 flex items-center gap-5">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">{stat.icon}</div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.val}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Search Bar - Gunakan onChange baru */}
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama Anda di daftar kelulusan..."
            className="w-full h-16 pl-16 pr-6 bg-white rounded-2xl shadow-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Menyiapkan data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredStudents.map((s: any, idx: number) => (
                <motion.div
                  layout // Tambahkan ini agar transisi grid halus saat filter
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-3 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col gap-3 group"
                >
                  <div className="relative overflow-hidden rounded-[1.5rem]">
                    <img 
                      src={s.photoUrl || "/defaultProfile.png"} 
                      className={`w-full aspect-square ${s.photoUrl ? 'object-cover' : 'object-contain'} bg-gray-100 group-hover:scale-110 transition-transform duration-500`}
                      alt={s.name}
                    />
                    <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md border-2 border-white text-[9px] text-white font-black px-3 py-1.5 rounded-full shadow-2xl">
                      LULUS {s.graduationYear}
                    </div>
                  </div>
                  
                  <div className="w-full px-1 pb-2 text-left">
                    <h4 className="w-[92%] truncate font-bold text-gray-900 leading-tight line-clamp-1 text-md group-hover:text-blue-600 transition-colors">
                      {s.name} 
                    </h4>
                    
                    <p className="w-full truncate text-[14px] font-mono font-bold text-gray-500 mt-1 tracking-wider">
                      NIS: {s.nis || "—"}
                    </p>

                    <div className="mt-3 pt-3 border-t border-gray-50 flex flex-col gap-1">
                      <div className="flex justify-start items-center ml-[-1px]">
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Batch: {s.batch ?? '????'}
                        </span>
                      </div>
                      <p className="text-[8px] text-gray-400 font-medium uppercase tracking-[0.1em] mt-1">
                        Alumni Angkatan {s.batch ?? '????'}
                      </p>
                    </div>
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