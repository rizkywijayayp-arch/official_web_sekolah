import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import HallOfFameComp from "../container/apresiasiMain";

const useProfile = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['school-profile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.BASE_URL}/profileSekolah?schoolId=${schoolId}`);
      const json = await res.json();
      return json.success ? json.data : null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export default function ApresiasiLanding() {
  const { data: profile } = useProfile();
  const theme = profile?.theme || {
    bg: '#ffffff',
    primary: '#1e3a8a',
    primaryText: '#1e293b',
    subtle: '#e2e8f0',
    surface: '#ffffff',
    surfaceText: '#475569',
    accent: '#3b82f6'
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-accent", theme.accent);
    document.documentElement.style.setProperty("--brand-bg", theme.bg);
    document.documentElement.style.setProperty("--brand-surface", theme.surface);
  }, [theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroComp
        titleProps="Ruang Apresiasi"
        id="#ruang-apresiasi"
        subTitleProps="Apresiasi siswa teladan dan tepat waktu"
      />

      <main id="ruang-apresiasi" className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Siswa Teladan & Tepat Waktu
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Penghargaan otomatis bagi siswa dengan tingkat kehadiran terbaik dan kedatangan paling awal.
            </p>
          </motion.div>

          {/* Hall of Fame Component */}
          <HallOfFameComp />
        </div>
      </main>

      <FooterComp />
    </div>
  );
}