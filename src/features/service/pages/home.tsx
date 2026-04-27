import { API_CONFIG } from "@/config/api";
import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = API_CONFIG.baseUrl;

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

const useLayananData = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['layanan-list', schoolId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/layanan?schoolId=${schoolId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Gagal memuat data layanan");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Response tidak valid");
      return json.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
};

const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition">
    {children}
  </div>
);

const Loading = () => (
  <div className="py-20 md:text-center text-left text-sm text-black/80 animate-pulse">
    Memuat data layanan…
  </div>
);

const ServicesGrid = ({ services, loading }: { services: any[]; loading: boolean }) => {
  const [activeTab, setActiveTab] = useState<"all" | "internal" | "publik">("all");

  const filteredServices = services.filter((s: any) => {
    if (activeTab === "all") return true;
    return s.type === activeTab;
  });

  if (loading) return <Loading />;

  if (filteredServices.length === 0) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 font-medium">Belum ada layanan tersedia</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    if (type === "internal") return <Phone size={24} />;
    return <Globe size={24} />;
  };

  return (
    <div className="space-y-6">
      {/* Tab Filter */}
      <div className="flex gap-3 px-4">
        {["all", "internal", "publik"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "all" ? "Semua" : tab === "internal" ? "Internal" : "Publik"}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredServices.map((service: any, idx: number) => (
          <motion.div
            key={service.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group"
          >
            <Card>
              <div className="p-8 md:p-10 flex flex-col h-full relative z-[2]">
                {/* Icon & Badge */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-600 text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                    {getIcon(service.type)}
                  </div>
                  {service.type && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      service.type === "internal"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {service.type}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title || service.name || "Layanan"}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed">
                  {service.description || service.desc || "Deskripsi layanan tidak tersedia"}
                </p>

                {/* Contact Info */}
                {(service.atasNama || service.noTelephone || service.email) && (
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    {service.atasNama && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-blue-500" />
                        <span>{service.atasNama}</span>
                      </div>
                    )}
                    {service.noTelephone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={14} className="text-blue-500" />
                        <span>{service.noTelephone}</span>
                      </div>
                    )}
                    {service.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail size={14} className="text-blue-500" />
                        <span>{service.email}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Active Badge */}
                {service.isActive !== undefined && (
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      service.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${service.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                      {service.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function LayananPage() {
  const { data: profile } = useProfile();
  const { data: services = [], isLoading } = useLayananData();
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

      <HeroComp
        titleProps="Layanan Sekolah"
        id="#layanan"
        subTitleProps="Layanan internal dan publik untuk siswa, orang tua, dan masyarakat"
      />

      <main id="layanan" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Daftar Layanan
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Jelajahi berbagai layanan yang tersedia di sekolah kami untuk memenuhi kebutuhan Anda.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Globe size={14} />
                Total: {services.length} layanan
              </span>
            </div>
          </motion.div>

          {/* Services Grid */}
          <ServicesGrid services={services} loading={isLoading} />
        </div>
      </main>

      <FooterComp />
    </div>
  );
}