import { API_CONFIG } from "@/config/api";
import { getSchoolId } from "@/features/_global/hooks/getSchoolId";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Medal, Star, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

/****************************
 * SECTION: Hall of Fame
 ****************************/
function HallOfFameSection() {
  const [data, setData] = useState<{
    dailyEarlyBirds: any[];
    monthlyChampions: any[];
  }>({ dailyEarlyBirds: [], monthlyChampions: [] });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    const fetchHallOfFame = async () => {
      try {
        setLoading(true);
        setError(null);
        const schoolId = getSchoolId();
        
        // Memanggil API Hall of Fame sesuai base url anda
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/siswa/hall-of-fame?schoolId=${schoolId}`,
          { method: "GET", cache: "no-store" }
        );

        if (!response.ok) throw new Error(`Gagal memuat data (HTTP ${response.status})`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Gagal mengambil data");
        }
      } catch (err: any) {
        setError("Gagal memuat daftar apresiasi siswa.");
      } finally {
        setLoading(false);
      }
    };
    fetchHallOfFame();
  }, []);

  const formatJamMenitISO = (isoString: string) => {
    if (!isoString) return "--:--";

    try {
      const date = new Date(isoString);

      // Cek apakah date valid
      if (isNaN(date.getTime())) return "--:--";

      // Mengambil jam dan menit sesuai waktu lokal (WIB jika di Indonesia)
      const jam = date.getHours().toString().padStart(2, '0');
      const menit = date.getMinutes().toString().padStart(2, '0');

      return `${jam}:${menit}`;
    } catch (e) {
      return "--:--";
    }
  };

  return (
    <section id="hall-of-fame" className="py-14 bg-[#FAFBFC] relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            Apresiasi Kedisiplinan
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Siswa Teladan & <span className="text-blue-700">Tepat Waktu</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Penghargaan otomatis bagi siswa dengan tingkat kehadiran terbaik dan kedatangan paling awal.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 flex gap-2">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-6 py-3 rounded-full font-black text-sm transition-all ${
                activeTab === "daily" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              HARI INI - TOP 10 AWAL
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-6 py-3 rounded-full font-black text-sm transition-all ${
                activeTab === "monthly" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              BULAN INI - TOP 5 KONSISTEN
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 z-[999999] md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {(activeTab === "daily" ? data.dailyEarlyBirds : data.monthlyChampions).map((siswa, idx) => (
                <motion.div
                  key={`${activeTab}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group bg-white rounded-[2.5rem] p-6 border border-slate-300 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Badge Peringkat */}
                  <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-white ${
                    idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : idx === 2 ? "bg-orange-400" : "bg-blue-500"
                  }`}>
                    #{idx + 1}
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Avatar Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                      idx === 0 ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-400"
                    }`}>
                      {idx === 0 ? <Trophy size={32} /> : <Medal size={32} />}
                    </div>

                    <div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none mb-1">
                        {siswa.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Users size={12} /> {siswa.class}
                      </p>
                    </div>
                  </div>

                  <hr className="my-5 border-slate-50" />

                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {activeTab === "daily" ? "Waktu Kedatangan" : "Total Tepat Waktu"}
                      </p>
                      <div className="flex items-center gap-2 text-blue-600 font-black">
                        {activeTab === "daily" ? (
                          <>
                            <Clock size={16} />
                            <span>{formatJamMenitISO(siswa.time)} WIB</span>
                          </>
                        ) : (
                          <>
                            <Star size={16} />
                            <span>{siswa.totalOnTime} Kali</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {idx === 0 && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black animate-pulse">
                        SANGAT DISIPLIN
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && (activeTab === "daily" ? data.dailyEarlyBirds.length : data.monthlyChampions.length) === 0 && (
          <div className="text-center py-20 z-[9999] bg-white rounded-[3rem] border-2 border-dashed border-slate-400">
             <p className="text-slate-500 font-normal">Belum ada data tersedia untuk periode ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}

const HallOfFameComp = () => {
  return <HallOfFameSection />;
};

export default HallOfFameComp;