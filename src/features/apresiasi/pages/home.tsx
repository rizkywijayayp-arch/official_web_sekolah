import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import HallOfFameComp from "../container/apresiasiMain";

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

export default function ApresiasiPage() {
  const { data: profile } = useProfile();
  const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-accent", theme.accent);
    document.documentElement.style.setProperty("--brand-bg", theme.bg);
    document.documentElement.style.setProperty("--brand-surface", theme.surface);
  }, [theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroComp titleProps="Ruang Apresiasi" id="#ruang-apresiasi" subTitleProps="Apresiasi siswa teladan dan tepat waktu" />

      <main id="ruang-apresiasi">
        <HallOfFameComp />
      </main>

      <FooterComp />
    </div>
  );
}