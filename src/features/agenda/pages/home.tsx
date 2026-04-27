import { API_CONFIG } from "@/config/api";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { FooterComp } from "@/features/_global/components/footer";
import GalleryComp from "@/features/_global/components/galeri";
import NavbarComp from "@/features/_global/components/navbar";
import { queryClient } from "@/features/_root/queryClient";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

let useSwipeable;
try { useSwipeable = require("react-swipeable").useSwipeable; } catch { useSwipeable = () => ({}) }

// --- REUSABLE COMPONENTS ---
const SafeImage = ({ src, alt, className, style }: any) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={className} aria-label={alt || 'image'}
           style={{ ...style, background: "#E2E8F0" }} />
    );
  }
  return <img src={src} alt={alt || ''} className={className} style={style} loading="lazy" decoding="async"
               referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setFailed(true)} />;
};

const Badge = ({ children }: any) => (
  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-50 text-blue-600 border border-blue-100">
    {children}
  </span>
);

// --- HOOKS ---
const useHeroSlides = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['heroSlides', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/beranda?schoolId=${schoolId}`);
      const data = await res.json();
      return (data.heroSlides || []).map((s: any) => ({
        title: s.title,
        desc: s.desc,
        img: s.img,
        cta1: { href: s.cta1Href || "#", label: s.cta1Label || "Lihat Detail" },
        cta2: { href: s.cta2Href || "#", label: s.cta2Label || "Pelajari Lebih" },
      }));
    },
  });
};

const useStats = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['stats', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/public/statistics/daily?schoolId=${schoolId}`);
      const data = await res.json();
      return [
        { k: "Hadir Hari Ini", v: data.data?.hadirHariIni || 0 },
        { k: "Izin/Sakit", v: data.data?.izinSakit || 0 },
        { k: "Terlambat", v: data.data?.terlambat || 0 },
        { k: "Guru Hadir", v: data.data?.guruHadir || 0 },
      ];
    },
  });
};

const useSambutanAndHeadmasters = () => {
  const schoolId = getSchoolIdSync();
  return useQueries({
    queries: [
      {
        queryKey: ['sambutan', schoolId],
        queryFn: async () => {
          const res = await fetch(`${API_CONFIG.baseUrl}/beranda?schoolId=${schoolId}`);
          const data = await res.json();
          return data.sambutan;
        },
      },
      {
        queryKey: ['headmasters', schoolId],
        queryFn: async () => {
          const res = await fetch(`${API_CONFIG.baseUrl}/sejarah/kepsek?schoolId=${schoolId}`);
          const data = await res.json();
          return data.items || [];
        },
      },
    ],
  });
};

const useAnnouncements = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['announcements', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/public/announcements?page=1&limit=10&schoolId=${schoolId}`);
      const data = await res.json();
      return data.data || [];
    },
  });
};

const useNews = () => {
  const schoolId = getSchoolIdSync();
  return useQuery({
    queryKey: ['news', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/berita?schoolId=${schoolId}&page=1&limit=20`);
      const data = await res.json();
      return (data.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        tag: item.kategori,
        img: item.featuredImage || '/defaultImage.png',
        excerpt: item.excerpt,
        source: item.sumber?.toLowerCase() === 'dinas' ? 'dinas' : 'api',
      }));
    },
  });
};

// === HERO (RE-STYLED) ===
const Hero = ({ theme }: any) => {
  const { data: heroSlides = [], isPending } = useHeroSlides();
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const go = (dir: number) => setIndex((p) => (p + dir + heroSlides.length) % heroSlides.length);
  const handlers = useSwipeable({ onSwipedLeft: () => go(1), onSwipedRight: () => go(-1) });

  useEffect(() => {
    if (prefersReducedMotion || heroSlides.length === 0) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, [prefersReducedMotion, heroSlides.length]);

  if (isPending) return <div className="py-24 text-center animate-pulse text-slate-400">Loading experience...</div>;

  const slide = heroSlides[index];

  return (
    <section className="relative min-h-[600px] flex items-center bg-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="relative h-full w-full">
            <SafeImage src={`${API_CONFIG.baseUrl}${slide.img}`} className="w-full h-full object-cover" style={{ filter: "brightness(0.95)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #F8FAFC 30%, transparent 100%)" }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-6 z-10 w-full" {...handlers}>
        <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Badge>Highlight Utama</Badge>
          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-2xl" style={{ color: theme.primaryText }}>
            {slide.title}
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
            {slide.desc}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={slide.cta1.href} className="px-8 py-4 rounded-full font-bold text-white shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95" style={{ background: theme.primary }}>
              {slide.cta1.label}
            </a>
            <a href={slide.cta2.href} className="px-8 py-4 rounded-full font-bold border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
              {slide.cta2.label}
            </a>
          </div>
        </motion.div>
        
        <div className="mt-12 flex gap-2">
          {heroSlides.map((_: any, i: any) => (
            <button key={i} onClick={() => setIndex(i)} className="h-1.5 rounded-full transition-all" style={{ width: i === index ? 40 : 12, background: i === index ? theme.primary : "#CBD5E1" }} />
          ))}
        </div>
      </div>
    </section>
  );
};

// === STATS BAR (SOFT) ===
const StatsBar = () => {
  const { data: stats = [] } = useStats();

  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.k} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} 
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center md:text-left">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{s.k}</div>
              <div className="text-3xl font-black text-slate-800">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === GLOBAL INFO BAR (DYNAMIC) ===
const GlobalInfoBar = () => {
  const { data: announcements = [] } = useAnnouncements();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length === 0) return;
    const id = setInterval(() => setIndex(i => (i + 1) % announcements.length), 4000);
    return () => clearInterval(id);
  }, [announcements.length]);

  if (announcements.length === 0) return null;
  const ann = announcements[index];

  return (
    <div className="bg-white border-b border-slate-100 py-3">
      <div className="max-w-6xl mx-auto px-6 text-sm flex items-center justify-center gap-3">
        <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded">INFO</span>
        <AnimatePresence mode="wait">
          <motion.p key={index} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-slate-600 font-medium truncate">
            {ann.title}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

// === HEADMASTER GREETING (RE-STYLED) ===
const HeadmasterGreeting = () => {
  const [sambutanQuery] = useSambutanAndHeadmasters();
  const { data: profile } = useQuery({
    queryKey: ['schoolProfile'],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah`);
      const data = await res.json();
      return data.data;
    },
  });
  const sambutan = kepalaSekolah?.data;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-[320px,1fr] gap-12 items-center bg-slate-50 p-8 md:p-16 rounded-[3rem]">
          <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
            <SafeImage src={profile?.photoHeadmasterUrl ? `${API_CONFIG.baseUrl}${profile.photoHeadmasterUrl}` : "/defaultProfile.png"} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-blue-500 font-bold text-sm uppercase tracking-widest">Kepala Sekolah</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-800 leading-tight">Membangun Masa Depan Berkarakter</h2>
            <div className="w-20 h-1.5 bg-blue-500 my-8 rounded-full" />
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed italic">
              {sambutan?.text?.split("\n").map((p: string, i: number) => <p key={i}>"{p}"</p>)}
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-bold text-slate-900">{sambutan?.name || profile?.headmasterName || 'Kepala Sekolah'}</h4>
              <p className="text-slate-500">Kepala {profile?.schoolName || 'Sekolah'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// === ANNOUNCEMENTS (SOFT CARDS) ===
const Announcements = ({ theme }: any) => {
  const { data: announcements = [] } = useAnnouncements();

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Pengumuman</h2>
            <p className="text-slate-500 mt-2">Update informasi kegiatan sekolah</p>
          </div>
          <a href="/pengumuman" className="text-blue-600 font-bold hover:underline">Lihat Semua</a>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {announcements.map((item: any) => (
            <motion.div key={item.id} whileHover={{ y: -10 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
              <Badge>{item.kategori}</Badge>
              <h3 className="mt-6 text-xl font-bold text-slate-800 leading-snug grow">{item.title}</h3>
              <p className="mt-4 text-slate-500 text-sm line-clamp-3">{item.excerpt}</p>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{new Date(item.publishedAt).toLocaleDateString('id-ID')}</span>
                <button className="text-sm font-bold text-blue-600">Detail →</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === NEWS (RE-STYLED) ===
const News = ({ schoolName }: any) => {
  const { data: items = [] } = useNews();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800">Kabar Terbaru</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto">Ikuti liputan kegiatan dan prestasi siswa siswi {schoolName} setiap harinya.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {items.slice(0, 3).map((n: any) => (
            <article key={n.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6 shadow-lg">
                <SafeImage src={n.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {n.source === 'dinas' && <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">DINAS</div>}
              </div>
              <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{n.title}</h3>
              <p className="mt-3 text-slate-500 text-sm line-clamp-2">{n.excerpt}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">25</div>
                <span className="text-xs font-bold text-slate-400">{n.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

// === MAIN PAGE (DYNAMIC) ===
const Page = () => {
  const { data: profile } = useQuery({
    queryKey: ['schoolProfile'],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah`);
      const data = await res.json();
      return data.data;
    },
  });

  const theme = {
    bg: profile?.themeBg || '#FFFFFF',
    primary: profile?.themePrimary || '#3B82F6',
    primaryText: profile?.themePrimaryText || '#1E293B',
  };
  const schoolName = profile?.schoolName || 'Sekolah';

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp />
      <GlobalInfoBar />
      <Hero theme={theme} schoolName={schoolName} />
      <StatsBar />
      <HeadmasterGreeting />
      <Announcements theme={theme} />
      <News schoolName={schoolName} />
      <GalleryComp />
      <FooterComp />
    </div>
  );
};

const Homepage = () => {
  return <Page />;
};

export default Homepage;
