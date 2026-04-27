import { API_CONFIG } from "@/config/api";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, User, X, BookOpen, Clock, Link as LinkIcon, GraduationCap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSchoolIdSync } from "../../hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";

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

/****************************
 * UTILS
 ****************************/
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

/****************************
 * SECTION: Tugas
 ****************************/
function TugasSection({ theme, schoolName }: { theme: any; schoolName: string }) {
  const [q, setQ] = useState("");
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [selected, setSelected] = useState<any>(null);
  const [tugasData, setTugasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTugas = async () => {
      try {
        setLoading(true);
        setError(null);
        const schoolId = getSchoolIdSync();
        // Memanggil API Tugas
        const response = await fetch(
          `${API_CONFIG.baseUrl}/tugas?schoolId=${schoolId}`,
          { method: "GET", cache: "no-store" }
        );

        if (!response.ok) throw new Error(`Gagal memuat tugas (HTTP ${response.status})`);
        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) throw new Error("Format tidak sesuai");

        // Mapping data sesuai model backend Tugas
        const mapped = result.data.map((item: any) => ({
          id: item.id,
          title: item.judul,
          desc: item.deskripsi || "Tidak ada instruksi tambahan.",
          teacher: item.namaGuru,
          email: item.emailGuru,
          subject: item.mapel,
          category: item.jenisSoal, // Pilihan Ganda, Essay, dll
          classLevel: item.kelas,
          minScore: item.nilaiMinimal,
          externalLink: item.linkEksternal,
          day: item.hari,
          date: fmtDate(item.tanggal),
          deadlineTime: item.deadlineJam,
          imageUrl: "/default-tugas.png", // Gambar default untuk tugas
        }));

        setTugasData(mapped);
      } catch (err: any) {
        setError("Gagal memuat daftar tugas.");
      } finally {
        setLoading(false);
      }
    };
    fetchTugas();
  }, []);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(tugasData.map((t: any) => t.category)))], [tugasData]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return tugasData.filter((t: any) => {
      const okQ = !nq || t.title.toLowerCase().includes(nq) || t.subject.toLowerCase().includes(nq) || t.teacher.toLowerCase().includes(nq);
      const okC = jenisFilter === "Semua" || t.category === jenisFilter;
      return okQ && okC;
    });
  }, [q, jenisFilter, tugasData]);

  return (
    <section id="tugas" className="py-14 bg-[#FAFBFC] relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            E-Learning & Tugas
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
            📝 Daftar Tugas Siswa
          </h2>
        </motion.div>

        {/* Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari mapel, guru, atau judul tugas..."
            className="w-full md:flex-1 px-6 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-4 rounded-2xl bg-slate-100 border-none font-bold text-slate-700 appearance-none cursor-pointer"
          >
            {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>

        {/* Grid Tugas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((t) => (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-slate-300 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                onClick={() => setSelected(t)}
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-800 overflow-hidden flex items-center justify-center">
                  <BookOpen size={80} className="text-white/20 absolute -right-4 -bottom-4 rotate-12" />
                  <div className="text-center p-6">
                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold mb-2 uppercase">
                      {t.subject}
                    </div>
                    <h3 className="text-xl font-black text-white line-clamp-2 px-4">{t.title}</h3>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase text-blue-600 shadow-lg">
                      {t.category}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {t.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="flex items-center gap-1"><Clock size={12}/> {t.deadlineTime}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {t.teacher.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Guru Pengampu</p>
                        <p className="text-sm font-bold text-slate-700">{t.teacher}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-blue-600 font-black text-sm group-hover:gap-3 transition-all">
                    LIHAT DETAIL TUGAS <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL DETAIL TUGAS */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[94vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header Modal */}
              <div className="relative h-48 md:h-56 shrink-0 bg-blue-600 flex items-center p-8 md:p-12">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <button 
                  onClick={() => setSelected(null)}
                  className="absolute top-6 right-6 p-3 bg-red-600 border-2 border-white shadow-2xl hover:bg-red-700 text-white rounded-full transition-all z-10"
                >
                  <X size={24} />
                </button>
                
                <div className="relative text-white z-0">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-lg rounded-xl text-[10px] font-black uppercase">
                      {selected.subject} • {selected.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                    {selected.title}
                  </h2>
                </div>
              </div>

              {/* Konten Modal */}
              <div className="p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline</p>
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <Clock size={16} className="text-blue-600" />
                        {selected.deadlineTime} WIB
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelas</p>
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <GraduationCap size={16} className="text-blue-600" />
                        {selected.classLevel}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KKM</p>
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">★</div>
                        {selected.minScore}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pengampu</p>
                    <div className="flex items-center gap-2 text-slate-700 font-bold text-sm truncate">
                        <User size={16} className="text-blue-600" />
                        {selected.teacher}
                    </div>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none mb-10">
                  <h4 className="text-slate-900 font-black uppercase text-xs mb-4 flex items-center gap-2">
                    <BookOpen size={16} /> Instruksi Tugas
                  </h4>
                  <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {selected.desc}
                  </p>
                </div>

                {selected.externalLink && (
                    <a 
                        href={selected.externalLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-200"
                    >
                        <LinkIcon size={20} />
                        BUKA LINK PENGERJAAN
                    </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

const TugasComp = () => {
  const { data: profile } = useProfile();
  const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };
  const schoolName = profile?.schoolName || 'Sekolah';
  return <TugasSection theme={theme} schoolName={schoolName} />;
};

export default TugasComp;