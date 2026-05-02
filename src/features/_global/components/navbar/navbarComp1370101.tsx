import { API_CONFIG } from "@/config/api";
import { useTenantNav } from "../../hooks/useTenantNav";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogInIcon, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getSchoolIdSync } from "../../hooks/getSchoolId";
import { setFaviconFromProfile } from "@/core/utils/favicon";

// ─── NAV CONFIGURATION (Tenant-Aware) ─────────────────────────────────────────
// Each section checks `requiresData` before rendering.
// Safety: Array.isArray() guard on all dynamic data.
// "Satu Kode Web untuk Seribu Sekolah"
interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  requiresData?: string;
}

const NAV_CONFIG: NavItem[] = [
  {
    label: "Profil Sekolah",
    children: [
      { label: "Halaman Utama", href: "/halaman-utama" },
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
      if (Array.isArray(item.children) && item.children.length > 0) {
        const filteredChildren = item.children
          .filter((child) => {
            if (!child.requiresData) return true;
            return tenant?.[child.requiresData] === true;
          })
          .map((child) => ({ ...child, requiresData: undefined }));
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren, requiresData: undefined };
      }
      if (item.requiresData) {
        if (tenant?.[item.requiresData] !== true) return null;
        return { ...item, requiresData: undefined };
      }
      return { ...item, requiresData: undefined };
    })
    .filter(Boolean) as NavItem[];
};

// Shim Link
const Link = ({ href, className, style, children, target, rel }) => (
  <a href={href} className={className} style={style} target={target} rel={rel}>
    {children}
  </a>
);

// Hook click-outside
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || (e.target instanceof Node && ref.current.contains(e.target))) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// === LOGIN MENU ===
const LoginMenu = ({ theme, schoolId }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <a href={`https://admin.kiraproject.id/?schoolId=${schoolId}`} target="_blank" rel="noopener noreferrer">
        <button
          className="text-sm font-medium rounded-lg bg-white border border-blue-700 gap-3 text-blue-700 pl-2 hover:text-white hover:bg-blue-600 pr-3 py-2 hidden md:flex items-center"
          style={{ background: theme.accent }}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <LogInIcon className="w-4" />
          <p className="uppercase w-max">Login Admin</p>
        </button>
      </a>
    </div>
  );
};

// === DROPDOWN (Desktop) ===
const NavDropdown = ({ item, theme }: { item: NavItem; theme: any }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  // Safety: ensure children is always an array
  const children = Array.isArray(item.children) ? item.children : [];
  const hasChild = children.length > 0;

  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link
        href={item.href || "#"}
        className="text-sm px-1 w-max py-1 uppercase hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href || "#"}
        className="text-sm px-1 w-max py-1 uppercase hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="text-sm px-1 py-1 w-max uppercase flex items-center gap-1"
        style={{ color: 'black' }}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <span aria-hidden>
          <ChevronDown className="w-[14px]" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="bg-blue-800 absolute left-0 mt-2 w-44 rounded-2xl shadow-3xl uppercase border border-white p-2"
            style={{ borderColor: theme.subtle }}
          >
            {/* Safety: Array.isArray() before .map() */}
            {children.map((c: NavItem) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href || "#"}
                  className="block px-3 py-2 rounded-lg text-sm uppercase hover:bg-white/10"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href || "#"}
                  className="block px-3 py-2 rounded-lg text-sm uppercase hover:bg-white/10"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === MOBILE ACCORDION ===
const MobileAccordion = ({ item, theme }: { item: NavItem; theme: any }) => {
  const [open, setOpen] = useState(false);
  // Safety: ensure children is always an array
  const children = Array.isArray(item.children) ? item.children : [];
  const hasChild = children.length > 0;

  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link
        href={item.href || "#"}
        className="block px-4 py-3 rounded-lg uppercase hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href || "#"}
        className="block px-4 py-3 rounded-lg uppercase hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center uppercase justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        <span>{item.label}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden pl-4"
          >
            {/* Safety: Array.isArray() before .map() */}
            {children.map((c: NavItem) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href || "#"}
                  className="block px-4 py-2 uppercase rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href || "#"}
                  className="block px-4 py-2 uppercase rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === MOBILE MENU HOOK ===
const useMobileMenu = (isOpen, onClose) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);
  return ref;
};

// === NAVBAR COMPONENT ===
export const NavbarComp1378101 = ({ theme = {}, onTenantChange = () => {}, currentKey = "smkn13" }) => {
  const schoolId = getSchoolIdSync();
  const { data: tenant, isPending } = useTenantNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useMobileMenu(mobileOpen, () => setMobileOpen(false));

  // Filter NAV based on tenant data
  const filteredNav = tenant ? filterNav(NAV_CONFIG, tenant) : NAV_CONFIG;

  // === FUNGSI PEMBERSIH NAMA SEKOLAH ===
  const getCleanName = (name: string) => {
    if (!name) return "";
    const pattern = /\b(jakarta|barat|timur|utara|selatan|pusat)\b/gi;
    return name.replace(pattern, "").replace(/\s\s+/g, ' ').trim();
  };

  const cleanedSchoolName = getCleanName(tenant?.schoolName || "Official Website");

  const navItems = filteredNav.map((it) =>
    it.children ? { ...it } : it
  );

  useEffect(() => {
    if (tenant?.schoolName) setFaviconFromProfile(tenant);
  }, [tenant]);

  return (
    <div className="relative top-0 left-0 w-full z-[999999]">
      {/* Top Header - Dynamic from tenant API */}
      <header className="w-full text-[10px] md:text-xs px-4 md:px-16 uppercase font-medium bg-blue-700 text-white hidden md:flex items-center justify-center p-3">
        {isPending ? (
          <p className="animate-pulse tracking-widest">Sinkronisasi data sekolah...</p>
        ) : (
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={12} className="opacity-70" />
              {tenant?.phoneNumber || "+62 21 1234 5678"}
            </span>
            <span className="flex items-center gap-2">
              <Mail size={12} className="opacity-70" />
              {tenant?.email || "info@sekolah.sch.id"}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={12} className="opacity-70" />
              {tenant?.address || "Alamat sekolah belum diatur"}
            </span>
          </div>
        )}
      </header>

      {/* Header Utama */}
      <div className="w-full relative top-0 z-[4] backdrop-blur shadow-xl justify-between bg-white">
        <div className="max-w-7xl mx-auto md:px-1">
          <div className="w-full flex items-center justify-between px-5 md:px-0 py-3 md:py-3">
            {/* Logo & Nama Sekolah — tenant-aware */}
            <div className="flex items-center gap-2 w-[40%] md:w-[30%]">
              <div className="leading-none flex gap-4 items-center">
                <div
                  className="flex items-center gap-3 text-sm md:text-lg font-bold tracking-tighter"
                  style={{ color: 'black' }}
                >
                  <img
                    src={tenant?.logoUrl || ""}
                    alt="Logo Sekolah"
                    className="w-8 h-8 md:w-10 md:h-10 md:flex hidden object-contain"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
                  <span className="uppercase md:text-[15px] text-[16px] w-max">{cleanedSchoolName}</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation — tenant-filtered */}
            <div className="hidden md:flex uppercase items-center w-max gap-6 xl:gap-8">
              {/* Safety: Array.isArray() before .map() */}
              {Array.isArray(navItems) && navItems.map((item) => (
                <NavDropdown key={item.label} item={item} theme={theme} />
              ))}
            </div>

            {/* Right Menu (Login + Toggle) — tenant-aware */}
            <div className="flex items-center w-[30%] uppercase justify-end gap-4">
              <LoginMenu theme={theme} schoolId={schoolId} />
              <button
                className="md:hidden flex flex-col gap-1.5 p-2"
                aria-label="Menu"
                onClick={() => setMobileOpen(true)}
              >
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-4 h-0.5 bg-black self-end"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar — tenant-filtered */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-blue-800 backdrop-blur-sm z-[999]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              ref={mobileRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[100vw] bg-blue-800 text-white shadow-2xl z-[999] flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <img
                     src={tenant?.logoUrl || ""}
                     alt="Logo"
                     className="w-8 h-8 rounded"
                     onError={(e) => e.currentTarget.style.display = 'none'}
                   />
                   <span className="font-bold tracking-tighter uppercase text-sm">{cleanedSchoolName}</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center font-black border border-white/60 hover:bg-red-700 active:scale-[1] hover:scale-[1.1] duration-200 transition-scale justify-center rounded-full bg-red-600 text-white"
                >
                  ✕
                </button>
              </div>

              {/* Sidebar Content (Scrollable) — tenant-filtered */}
              <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {/* Safety: Array.isArray() before .map() */}
                {Array.isArray(navItems) && navItems.map((item) => (
                  <MobileAccordion key={item.label} item={item} theme={theme} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarComp1378101;