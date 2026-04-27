import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { Award, Calendar, Users, Search, Loader2, Clock, Lock, CheckCircle } from "lucide-react";

const SCHOOL_ID = getSchoolIdSync();

const useProfile = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['school-profile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/profileSekolah?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Announcement hook
const useAnnouncement = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['announcement', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/kelulusan/announcement?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    staleTime: 60 * 1000, // Refresh every minute during countdown
    refetchInterval: 60 * 1000,
  });
};

// Student list hook
const useStudents = (enabled: boolean, year?: string, batch?: string) => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['graduation-students', schoolId, year, batch],
    queryFn: async () => {
      const params = new URLSearchParams({
        schoolId: String(schoolId),
        tahun: year || '',
        page: '1',
        limit: '500',
      });
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/kelulusan?${params}`);
      const json = await res.json();
      return json.success ? json.data : [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) return null;

  const timeBlocks = [
    { val: timeLeft.days, label: 'Hari' },
    { val: timeLeft.hours, label: 'Jam' },
    { val: timeLeft.minutes, label: 'Menit' },
    { val: timeLeft.seconds, label: 'Detik' },
  ];

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {timeBlocks.map((block, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
            <span className="text-3xl md:text-4xl font-black text-white">{String(block.val).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-2">{block.label}</span>
        </div>
      ))}
    </div>
  );
}

// Locked State Component (before announcement)
function LockedState({ targetDate, schoolName }: { targetDate: string; schoolName?: string }) {
  const formattedDate = new Date(targetDate).toLocaleDateContext('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-8 border-2 border-blue-500/30"
      >
        <Lock className="text-blue-400" size={48} />
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tight mb-4">
        Hasil Kelulusan
      </h2>

      <p className="text-blue-300 text-sm mb-2">Pengumuman akan dilakukan pada:</p>
      <p className="text-white font-bold text-lg mb-10">{formattedDate}</p>

      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 w-full max-w-md">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Hitung Mundur</p>
        <CountdownTimer targetDate={targetDate} />
      </div>

      <p className="text-gray-500 text-xs mt-10 max-w-sm">
        Hasil kelulusan masih tersembunyi. Siswa dapat mengecek NISN mereka untuk persiapan.
      </p>
    </div>
  );
}

export function PengumumanKelulusan() {
  const { data: profile } = useProfile();
  const { data: announcement, isLoading: loadingAnnouncement } = useAnnouncement();

  const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };

  const [searchTerm, setSearchTerm] = useState("");
  const [nisnInput, setNisnInput] = useState("");
  const [nisnResult, setNisnResult] = useState<any>(null);
  const [nisnLoading, setNisnLoading] = useState(false);
  const [nisnError, setNisnError] = useState("");

  // Announcement settings
  const targetDate = announcement?.tanggalPengumuman || '2026-06-05T08:00:00+07:00';
  const enableCountdown = announcement?.enableCountdown !== false;
  const isOpen = announcement?.isOpen || new Date() >= new Date(targetDate);

  // Fetch students if announcement is open
  const { data: students = [], isLoading: loadingStudents } = useStudents(
    isOpen && enableCountdown === false,
    announcement?.displayAlumniYear,
    announcement?.displayAlumniBatch
  );

  // Also try to get students from kelulusan API
  const { data: kelulusanData = [], isLoading: loadingKelulusan } = useStudents(isOpen);

  const allStudents = [...students, ...kelulusanData];
  const uniqueStudents = allStudents.filter((s, i, arr) => arr.findIndex(t => t.id === s.id) === i);

  // NISN Check
  const checkNisn = async () => {
    if (!nisnInput.trim()) return;
    setNisnLoading(true);
    setNisnError("");
    setNisnResult(null);

    try {
      const schoolId = getSchoolIdSync();
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/kelulusan/check/${nisnInput}?schoolId=${schoolId}`);
      const json = await res.json();

      if (json.success && json.data) {
        setNisnResult(json.data);
      } else {
        setNisnError("Data tidak ditemukan. Pastikan NISN yang Anda masukkan benar.");
      }
    } catch (err) {
      setNisnError("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setNisnLoading(false);
    }
  };

  const filteredStudents = uniqueStudents.filter(s =>
    (s.nama || s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = loadingAnnouncement || loadingStudents || loadingKelulusan;

  // If countdown enabled and not open yet -> show locked state
  if (enableCountdown && !isOpen && !isLoading) {
    return (
      <div className="min-h-screen" style={{ background: "#0B1220" }}>
        <NavbarComp theme={theme} />
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
          <LockedState targetDate={targetDate} schoolName={profile?.schoolName} />
        </div>
        <FooterComp />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <NavbarComp theme={theme} />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden bg-[#0B1220]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#2563eb,transparent)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-6"
          >
            <Award size={14} /> {isOpen ? "Pengumuman Resmi" : "Menunggu Pengumuman"}
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-4">
            Kelulusan Siswa <span className="text-blue-600 font-outline-2">{announcement?.displayAlumniYear || new Date().getFullYear()}</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-medium">
            Selamat kepada seluruh siswa yang telah menyelesaikan masa studinya dengan gemilang.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        {/* NISN Check Box */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 mb-8">
          <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Search size={16} /> Cek NISN Anda
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Masukkan NISN untuk cek status kelulusan..."
              value={nisnInput}
              onChange={(e) => setNisnInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkNisn()}
              className="flex-1 h-12 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            />
            <button
              onClick={checkNisn}
              disabled={nisnLoading}
              className="px-8 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {nisnLoading ? <Loader2 size={20} className="animate-spin" /> : "Cek"}
            </button>
          </div>

          {/* NISN Result */}
          {nisnError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {nisnError}
            </div>
          )}
          {nisnResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                {nisnResult.status === 'lulus' ? (
                  <CheckCircle className="text-green-600" size={28} />
                ) : (
                  <Clock className="text-yellow-600" size={28} />
                )}
                <div>
                  <h4 className="font-black text-gray-900 text-lg">{nisnResult.nama}</h4>
                  <p className="text-xs text-gray-500">NISN: {nisnInput}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Kelas</p>
                  <p className="font-bold text-gray-800">{nisnResult.kelas}</p>
                </div>
                <div className="bg-white/60 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                  <p className={`font-black uppercase ${
                    nisnResult.status === 'lulus' ? 'text-green-600' :
                    nisnResult.status === 'tunda' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {nisnResult.status === 'lulus' ? 'LULUS' : nisnResult.status?.toUpperCase() || '-'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "Tahun Ajaran", val: announcement?.displayAlumniYear || new Date().getFullYear(), icon: <Calendar className="text-blue-500" /> },
            { label: "Total Siswa", val: uniqueStudents.length + " Siswa", icon: <Users className="text-green-500" /> },
            { label: "Status", val: isOpen ? "Dibuka" : "Ditutup", icon: <Award className={isOpen ? "text-green-500" : "text-yellow-500"} /> },
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

        {/* Student Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">Menyiapkan data...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Belum ada data kelulusan yang ditampilkan.</p>
            <p className="text-gray-400 text-sm mt-2">Silakan cek pengumuman di lain waktu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredStudents.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex items-center gap-4"
                >
                  <img
                    src={s.photoUrl || s.fotoUrl || "/placeholder.jpg"}
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-100"
                    alt={s.nama || s.name}
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{s.nama || s.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{s.nisn || s.NISN || ''}</p>
                    <p className={`text-xs font-black uppercase tracking-widest mt-1 ${
                      (s.status || 'lulus') === 'lulus' ? 'text-green-600' :
                      (s.status || 'tunda') === 'tunda' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {s.status || 'lulus'}
                    </p>
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