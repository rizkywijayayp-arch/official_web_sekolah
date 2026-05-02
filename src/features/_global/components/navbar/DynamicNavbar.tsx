import { API_CONFIG } from "@/config/api";
import { useTenantNav } from "../../hooks/useTenantNav";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogInIcon, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSchoolIdSync } from "../../hooks/getSchoolId";
import { setFaviconFromProfile } from "@/core/utils/favicon";

// ─── NAV CONFIGURATION ─────────────────────────────────────────────────────────
// Each section checks `hasXxx` before rendering the item.
// Uses Array.isArray() safety guards on all dynamic data.
// "Satu Kode Web untuk Seribu Sekolah"
interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  // Visibility control
  requiresData?: keyof ReturnType<typeof useTenantNav> extends infer T ? T extends string ? T : never : never;
}

const NAV_CONFIG: NavItem[] = [
  {
    label: "Profil Sekolah",
    children: [
      { label: "Halaman Utama", href: "/" },
      { label: "Sambutan", href: "/sambutan" },
      { label: "Visi & Misi", href: "/visiMisi" },
      { label: "Galeri", href: "/galeri", requiresData: "hasGallery" },
      { label: "Sejarah", href: "/sejarah" },
      { label: "Tata tertib", href: "/tata-tertib" },
      { label: "Struktur", href: "/struktur" },
    ],
  },
  {
    label: "Akademik",
    children: [
      { label: "Prestasi", href: "/prestasi", requiresData: "hasPrestasi" },
      { label: "Kurikulum", href: "/kurikulum" },
      { label: "Kalender", href: "/kalender" },
      { label: "Jadwal", href: "/jadwal" },
      { label: "Guru & Tendik", href: "/guru-tendik", requiresData: "hasGuru" },
    ],
  },
  { label: "Program", href: "/program", requiresData: "hasProker" },
  {
    label: "Kegiatan",
    children: [
      { label: "OSIS", href: "/osis" },
      { label: "Voting OSIS", href: "/voting-osis", requiresData: "hasVoting" },
      { label: "Ekstrakurikuler", href: "/ekstrakulikuler", requiresData: "hasEkskul" },
      { label: "Pramuka", href: "/pramuka" },
    ],
  },
  { label: "Perpus", href: "/perpustakaan", requiresData: "hasPerpus" },
  {
    label: "Informasi",
    children: [
      { label: "Pengumuman", href: "/pengumuman", requiresData: "hasPengumuman" },
      { label: "Info Kelulusan", href: "/pengumuman-kelulusan", requiresData: "hasKelulusan" },
      { label: "Ruang Apresiasi", href: "/ruang-apresiasi" },
      { label: "Berita", href: "/berita", requiresData: "hasBerita" },
      { label: "Buku Alumni", href: "/buku-alumni" },
      { label: "PPDB", href: "/ppdb", requiresData: "hasPPDB" },
      { label: "PPID", href: "/ppid", requiresData: "hasPPID" },
      { label: "Layanan", href: "/layanan-persuratan" },
    ],
  },
];

// Filter NAV based on tenant data availability
const filterNav = (nav: NavItem[], tenant: any): NavItem[] => {
  return nav
    .map((item) => {
      // If item has children, filter children
      if (Array.isArray(item.children) && item.children.length > 0) {
        const filteredChildren = item.children
          .filter((child) => {
            if (!child.requiresData) return true;
            // Safety: use tenant[child.requiresData] if it exists, default false
            const hasFlag = tenant?.[child.requiresData];
            return hasFlag === true;
          })
          .map((child) => ({ ...child, requiresData: undefined }));

        // Only show parent if at least one child is visible
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren, requiresData: undefined };
      }

      // Leaf item — check requiresData
      if (item.requiresData) {
        const hasFlag = tenant?.[item.requiresData];
        if (hasFlag !== true) return null;
        return { ...item, requiresData: undefined };
      }

      return { ...item, requiresData: undefined };
    })
    .filter(Boolean) as NavItem[];
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const NavDropdown = ({ item, schoolId }: { item: NavItem; schoolId: string }) => {
  const [open, setOpen] = useState(false);

  // Safety guard: ensure children is always an array
  const children = Array.isArray(item.children) ? item.children : [];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1.5 text-[13px] font-semibold tracking-wide text-slate-700 hover:text-blue-600 transition-colors py-4 uppercase">
        {item.label}
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-[-20px] top-full w-56 bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-2xl p-2 z-50 overflow-hidden"
          >
            <div className="grid gap-1">
              {/* Safety: Array.isArray() before .map() */}
              {children.map((child: NavItem) => (
                <a
                  key={child.label}
                  href={child.href || "#"}
                  className="px-4 py-2.5 text-[12px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all flex items-center justify-between group/item"
                >
                  {child.label}
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
export const DynamicNavbar = () => {
  const schoolId = getSchoolIdSync();
  const { data: profile, isLoading } = useTenantNav();

  // Set favicon and document title when profile loads
  useEffect(() => {
    if (profile?.schoolName) {
      setFaviconFromProfile(profile);
    }
  }, [profile]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter NAV based on tenant data
  const filteredNav = profile ? filterNav(NAV_CONFIG, profile) : NAV_CONFIG;

  const getCleanName = (name: string) => {
    if (!name) return "";
    return name.replace(/\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi, "").trim();
  };

  return (
    <div className="relative top-0 left-0 w-full z-[9999999] transition-all duration-500">

      {/* TOP INFO BAR — Dynamic school info from API */}
      <div className={`hidden md:flex bg-blue-700 text-white py-5 h-[40px] px-12 transition-all duration-500 ${scrolled ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto w-full flex justify-center gap-7 items-center text-[10px] tracking-[0.15em] font-semibold uppercase">
          <div className="flex gap-8">
            <span className="flex items-center gap-2 uppercase hover:text-white transition-colors cursor-pointer">
              <Phone size={12} className="text-blue-400" /> {profile?.phoneNumber || "Contact"}
            </span>
            <span className="flex items-center gap-2 uppercase hover:text-white transition-colors cursor-pointer">
              <Mail size={12} className="text-white" /> {profile?.email || "Email Us"}
            </span>
          </div>
          <div className="flex items-center gap-2 uppercase text-white">
            <MapPin size={12} /> {profile?.address || "Location"}
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div className={`w-full transition-all shadow-2xl duration-500 px-0 md:px-8`}>
        <nav className={`w-screen md:max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-bl-2xl rounded-br-2xl transition-all duration-500
          ${scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white/40 mt-2'
            : 'bg-white border border-slate-100 shadow-sm'}`}>

          {/* Logo Section — schoolName from API */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/30 transition-all" />
              <img
                src={profile?.logoUrl || ""}
                alt="Logo"
                className="w-10 h-10 md:w-11 md:h-11 relative object-contain transition-transform group-hover:scale-110"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-lg font-black tracking-tighter text-slate-900 leading-none">
                {getCleanName(profile?.schoolName || "")}
              </span>
            </div>
          </div>

          {/* Desktop Nav — tenant-filtered */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Safety: Array.isArray() before .map() */}
            {Array.isArray(filteredNav) && filteredNav.map((item) => (
              item.children ? (
                <NavDropdown key={item.label} item={item} schoolId={schoolId} />
              ) : (
                <a
                  key={item.label}
                  href={item.href || "#"}
                  className="text-[13px] font-semibold text-slate-700 hover:text-blue-600 transition-all uppercase tracking-wide"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Admin Portal — tenant-aware with domain context */}
            <a
              href={`https://admin.kiraproject.id/?schoolId=${schoolId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 border border-slate-900 hover:bg-slate-900 text-slate-900 hover:text-white px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 uppercase"
            >
              <LogInIcon size={14} /> Admin Portal
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 bg-slate-50 text-slate-900 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE SIDEBAR — tenant-filtered */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[1000] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <img
                  src={profile?.logoUrl || ""}
                  className="w-10 h-10"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <span className="text-white font-bold tracking-tighter uppercase">
                  {getCleanName(profile?.schoolName || "")}
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto">
              {/* Safety: Array.isArray() before .map() */}
              {Array.isArray(filteredNav) && filteredNav.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h4 className="text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">{item.label}</h4>
                  <div className="flex flex-col gap-4 pl-2 border-l border-white/10">
                    {/* Safety: Array.isArray() guard */}
                    {Array.isArray(item.children) && item.children.map((c: NavItem) => (
                      <a key={c.label} href={c.href || "#"} className="text-2xl font-light text-white/80 hover:text-white">
                        {c.label}
                      </a>
                    ))}
                    {!Array.isArray(item.children) && (
                      <a href={item.href || "#"} className="text-2xl font-light text-white">
                        {item.label}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicNavbar;