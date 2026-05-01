// import { SMAN25_CONFIG } from "@/core/theme";
// import { FooterComp } from "@/features/_global/components/footer";
// import { HeroComp } from "@/features/_global/components/hero";
// import NavbarComp from "@/features/_global/components/navbar";
// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useMemo, useRef, useState } from "react";

// function getExt(name = "") {
//   const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
//   return m ? `.${m[1]}` : "";
// }
// const prettySize = (n) => {
//   if (!Number.isFinite(n)) return "-";
//   const kb = n / 1024; if (kb < 1024) return `${kb.toFixed(1)} KB`;
//   const mb = kb / 1024; return `${mb.toFixed(2)} MB`;
// };
// const READS_KEY = "smkn13_library_reads";
// const loadReads = () => { try { return JSON.parse(localStorage.getItem(READS_KEY) || '{}'); } catch { return {}; } };
// const saveReads = (obj) => { try { localStorage.setItem(READS_KEY, JSON.stringify(obj)); } catch {} };
// const incrementRead = (id) => { const m = loadReads(); m[id] = (m[id]||0)+1; saveReads(m); return m[id]; };
// const mimeOf: any = (ext: any) => ({
//   ".html": "text/html",
//   ".htm": "text/html",
//   ".md": "text/markdown",
//   ".markdown": "text/markdown",
//   ".txt": "text/plain",
//   ".pdf": "application/pdf",
//   ".epub": "application/epub+zip",
// }[ext] || "application/octet-stream");

// const StatChip = ({ children, theme }) => (
//   <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.10)", color: theme.primaryText }}>{children}</span>
// );

// const ShelfCard = ({ book, theme, onRead }) => (
//   <motion.div layout whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="rounded-xl md:h-[500px] overflow-hidden shrink-0 w-full" style={{background: theme.surface }}>
//     <div className="w-full" style={{ aspectRatio: '3 / 4', background: theme.subtle }}>
//       <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
//     </div>
//     <div className="p-3">
//       <div className="flex items-center justify-between gap-2">
//         <div className="font-semibold text-sm line-clamp-2" style={{ color: 'black' }}>{book.title}</div>
//         <StatChip theme={theme}>{book.format.toUpperCase().replace('.', '')}</StatChip>
//       </div>
//       <div className="text-[11px] opacity-80 mt-1" style={{ color: 'black' }}>{book.author}</div>
//       <div className="mt-2 flex items-center justify-between text-[11px]">
//         <div style={{ color: 'black' }}>{book.pages} hlm</div>
//       </div>
//     </div>
//   </motion.div>
// );

// const Reader = ({ item, theme, onClose }) => {
//   const [blobUrl, setBlobUrl] = useState(null);
//   const [text, setText] = useState("");
//   const ext = getExt(item?.name);

//   useEffect(()=>{
//     if (!item) return;
//     const url = URL.createObjectURL(item);
//     setBlobUrl(url);
//     const fr = new FileReader();
//     if ([".txt", ".md", ".markdown", ".html", ".htm"].includes(ext)) {
//       fr.onload = () => setText(String(fr.result||""));
//       fr.readAsText(item);
//     }
//     return () => { URL.revokeObjectURL(url); };
//   }, [item]);

//   const makeSrcDoc = () => {
//     if (!text) return undefined;
//     if (ext === ".html" || ext === ".htm") return text;
//     if (ext === ".md" || ext === ".markdown") {
//       let html = text
//         .replace(/^# (.*$)/gim, '<h1>$1</h1>')
//         .replace(/^## (.*$)/gim, '<h2>$1</h2>')
//         .replace(/^### (.*$)/gim, '<h3>$1</h3>')
//         .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
//         .replace(/\*(.*?)\*/gim, '<i>$1</i>')
//         .replace(/\n\n/g, '<br/>');
//       return `<!doctype html><html><head><meta charset='utf-8'/><meta name='viewport' content='width=device-width, initial-scale=1'>
//         <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial;line-height:1.6;padding:16px;color:${theme.primaryText};background:${theme.surface}}h1,h2,h3{margin:0 0 8px}</style></head><body>${html}</body></html>`;
//     }
//     if (ext === ".txt") {
//       const esc = (s)=>s.replace(/[&<>]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
//       const pre = `<pre style="white-space:pre-wrap">${esc(text)}</pre>`;
//       return `<!doctype html><meta charset='utf-8'/>${pre}`;
//     }
//     return undefined;
//   };

//   return (
//     <AnimatePresence>
//       {item && (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] p-4 flex" style={{ background: 'rgba(0,0,0,0.35)' }}>
//           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
//             className="relative max-w-5xl w-full mx-auto rounded-2xl overflow-hidden flex flex-col"
//             style={{ background: theme.surface }}>
//             <div className="flex items-center justify-between p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
//               <div className="text-sm" style={{ color: theme.primaryText }}>
//                 <strong>{item.name}</strong> · {getExt(item.name).toUpperCase()} · {prettySize(item.size)}
//               </div>
//               <div className="flex items-center gap-2">
//                 {blobUrl && (
//                   <a className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: theme.primaryText }} href={blobUrl} download={item.name}>Unduh</a>
//                 )}
//                 <button onClick={onClose} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: theme.primaryText }}>Tutup</button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-auto" style={{ background: theme.bg }}>
//               {(ext === ".pdf") && blobUrl && (
//                 <motion.embed initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={blobUrl} type="application/pdf" className="w-full" style={{ height: "calc(100vh - 180px)" }} />
//               )}

//               {(ext === ".html" || ext === ".htm" || ext === ".md" || ext === ".markdown" || ext === ".txt") && (
//                 <motion.iframe initial={{ opacity: 0 }} animate={{ opacity: 1 }} srcDoc={makeSrcDoc()} className="w-full" style={{ height: "calc(100vh - 180px)", background: theme.surface }} sandbox="allow-same-origin allow-popups allow-forms" />
//               )}

//               {ext === ".epub" && (
//                 <div className="p-4 text-sm" style={{ color: theme.primaryText }}>
//                   <div className="mb-2">Pratinjau EPUB:</div>
//                   {typeof window !== 'undefined' && window?.ePub ? (
//                     <EpubInlineReader file={item} theme={theme} />
//                   ) : (
//                     <div>
//                       Browser belum punya <code>epub.js</code>. Silakan unduh file atau pasang <em>epub.js</em> global (window.ePub) untuk pratinjau langsung.
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// const EpubInlineReader = ({ file, theme }) => {
//   const containerRef = useRef(null);
//   useEffect(()=>{
//     if (!file || !(typeof window !== 'undefined' && window?.ePub)) return;
//     const url = URL.createObjectURL(file);
//     const b = window.ePub(url);
//     const r = b.renderTo(containerRef.current, { width: '100%', height: '70vh', spread: 'auto', manager: 'continuous' });
//     r.display();
//     return () => { URL.revokeObjectURL(url); b && b.destroy && b.destroy(); };
//   }, [file]);
//   return <div ref={containerRef} className="rounded-xl" style={{ background: theme.surface }} />;
// };

// function LibrarySection({ theme }) {
//   const safeTheme = SMAN25_CONFIG;
//   const [openItem, setOpenItem] = useState(null);
//   const [query, setQuery] = useState("islam");
//   const [apiBooks, setApiBooks] = useState([]); // State for API-fetched books

//   // 3-ROW CAROUSEL CONFIG
//   const GAP = 12; // px
//   const ROWS = 3;

//   const viewportRef = useRef(null);
//   const scrollerRef = useRef(null);
//   const [vw, setVw] = useState(0);
//   const [cols, setCols] = useState(3);
//   const [pageIndex, setPageIndex] = useState(0);

//   // Fetch books from API when query changes
// useEffect(() => {
//   if (!query.trim()) {
//     setApiBooks([]); // Clear API books if query is empty
//     return;
//   }

//   const fetchBooks = async () => {
//     try {
//       const response = await fetch("https://lib.sman1jkt.sch.id/index.php?p=api/book/search", {
//         method: "POST",
//         body: JSON.stringify({ keyword: query }), // Use query directly
//       });
//       const result = await response.json();
//       if (result.success && Array.isArray(result.data)) {
//         const mappedBooks = result.data.map((book, index) => ({
//           id: book.id || `api-book-${index}`,
//           title: book.title || "Untitled",
//           author: book.authors?.[0]?.author_name || "Unknown Author",
//           category: book.subjects?.[0]?.topic || "Uncategorized",
//           format: ".pdf",
//           pages: parseInt(book.collation) || 50,
//           cover: book.image
//             ? `http://lib.sman1jkt.sch.id/${book.image.replace(/^\.\//, "")}`
//             : "/slide2.jpg",
//           generateBlob: () => new Blob([`Placeholder content for ${book.title}`], { type: mimeOf(".txt") }),
//         }));
//         setApiBooks(mappedBooks);
//       } else {
//         setApiBooks([]);
//       }
//     } catch (error) {
//       
//       setApiBooks([]);
//     }
//   };

//   const debounce = setTimeout(fetchBooks, 300);
//   return () => clearTimeout(debounce);
// }, [query]);

// // Example input handler to reset query to "islam" when cleared
// const handleInputChange = (e) => {
//   const value = e.target.value;
//   setQuery(value || "islam"); // Set to "islam" if input is empty
// };

//   // Filter API books based on search query
//   const filteredBooks = useMemo(() => {
//     return apiBooks.filter(
//       (b) =>
//         b.title.toLowerCase().includes(query.toLowerCase()) ||
//         b.author.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [query, apiBooks]);

//   const pageSize = Math.max(ROWS * Math.max(1, cols), ROWS);

//   const pages = useMemo(() => {
//     const arr = [];
//     for (let i = 0; i < filteredBooks.length; i += pageSize) {
//       arr.push(filteredBooks.slice(i, i + pageSize));
//     }
//     return arr;
//   }, [filteredBooks, pageSize]);

//   useEffect(() => {
//     setPageIndex((i) => Math.min(i, Math.max(0, pages.length - 1)));
//   }, [pages.length]);

//   useEffect(() => {
//     const el = scrollerRef.current;
//     if (!el) return;
//     el.scrollTo({ left: pageIndex * vw, behavior: "smooth" });
//   }, [pageIndex, vw]);

//   const handleRead = (book) => {
//     const blob = book.generateBlob();
//     const file = new File([blob], `${book.title}${book.format}`, {
//       type: blob.type || mimeOf(book.format),
//       lastModified: Date.now(),
//     });
//     incrementRead(book.id);
//     setOpenItem(file);
//   };

//   const go = (dir) =>
//     setPageIndex((i) => {
//       const next = i + dir;
//       if (next < 0) return 0;
//       if (next > pages.length - 1) return pages.length - 1;
//       return next;
//     });

//   return (
//     <section id="perpustakaan-content" className="pb-12 md:pb-16">

//       <HeroComp titleProps="Perpus Digital" id="#perpus"/>

//       <div className="max-w-7xl mx-auto px-4 mt-12" id="perpus">
//         <div className="w-full mb-10 flex items-center justify-between">
//           <div className="w-full md:items-center flex flex-col md:justify-center gap-4 mb-4">
//             <h2
//               className="text-2xl md:text-3xl font-bold"
//               style={{ color: 'black' }}
//             >
//               Cari buku
//             </h2>
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Cari judul/penulis…"
//               className="px-4 py-4 mt-4 rounded-xl border border-gray-500 text-sm w-[80%]"
//               style={{ background: "rgba(255,255,255,0.08)", color: 'black' }}
//             />
//           </div>
//         </div>

//         {/* Viewport */}
//         <div ref={viewportRef} className="w-full overflow-hidden rounded-2xl">
//           {/* Scroller pages */}
//           <div
//             ref={scrollerRef}
//             className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 overflow-x-auto"
//             style={{ scrollBehavior: "smooth" }}
//           >
//             {pages.map((page, pIdx) => (
//               <div
//                 key={pIdx}
//                 className="w-full px-1"
//                 style={{ width: vw || "100%" }}
//               >
//                 <div className="gap-3 space-y-2 flex flex-wrap justify-between">
//                   {page.map((b) => (
//                     <ShelfCard key={b.id} book={b} theme={safeTheme} onRead={handleRead} />
//                   ))}
//                 </div>
//               </div>
//             ))}
//             {pages.length === 0 && (
//               <motion.div
//                 layout
//                 className="w-max rounded-2xl p-4 text-sm"
//                 style={{ color: safeTheme.surfaceText, background: "rgba(255,255,255,0.06)" }}
//               >
//                 <p className="w-max">
//                   Tidak ada buku yang cocok dengan pencarian.
//                 </p>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Reader item={openItem} theme={safeTheme} onClose={() => setOpenItem(null)} />
//     </section>
//   );
// }

// const PerpustakaanPage = () => {
//   const theme = SMAN25_CONFIG;

//   return (
//     <div className="min-h-screen" style={{ background: theme.theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <LibrarySection theme={theme} />
//       </main>
//       <FooterComp />
//     </div>
//   );
// }

// export default PerpustakaanPage;



import { FooterComp } from "@/features/_global/components/footer";
import { HeroComp } from "@/features/_global/components/hero";
import NavbarComp from "@/features/_global/components/navbar";
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronLeft, ChevronRight, BookOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";

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

// --- Utility Functions ---
function getExt(name = "") {
  const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? `.${m[1]}` : "";
}

// --- Components ---
const ShelfCard = ({ book, onRead, onDownload }) => (
  <motion.div 
    layout 
    whileHover={{ y: -8, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }} 
    className="group rounded-2xl overflow-hidden flex flex-col border border-gray-400 shadow-sm transition-all relative h-full" 
    style={{ background: 'white' }}
  >
    {/* Tombol Download Cepat (EPUB) */}
    <button 
      onClick={(e) => { e.stopPropagation(); onDownload(book); }}
      className="absolute top-3 left-3 border border-white/20 z-20 shadow-xl flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
      title="Download EPUB"
    >
      <Download size={18} />
      <span className="text-[10px] font-bold pr-1">EPUB</span>
    </button>

    {/* Area Klik untuk Membaca */}
    <div className="cursor-pointer flex-1 flex flex-col" onClick={() => onRead(book)}>
      <div className="w-full relative overflow-hidden bg-gray-100" style={{ aspectRatio: '3 / 4' }}>
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e: any) => { e.target.src = "https://via.placeholder.com/300x400?text=No+Cover" }} 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <BookOpen className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="font-bold text-sm line-clamp-2 mb-1 text-black group-hover:text-blue-600 transition-colors leading-tight">
          {book.title}
        </div>
        <div className="text-[11px] opacity-60 line-clamp-1 mb-3 text-gray-700">
          {book.author}
        </div>
        <div className="mt-auto flex items-center justify-between text-[10px] font-bold opacity-50 uppercase tracking-tighter">
          <span>{book.downloads.toLocaleString()} READS</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded text-black">{book.language}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Reader = ({ item, theme, onClose }) => {
  const [content, setContent] = useState("");
  const ext = getExt(item?.name);

  useEffect(() => {
    if (!item) return;
    const reader = new FileReader();
    reader.onload = (e) => setContent(e.target?.result as string);
    reader.readAsText(item);
  }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center text-white mb-4">
        <div className="truncate pr-4">
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-xs opacity-50 uppercase font-mono">{ext.replace('.','')} Mode</p>
        </div>
        <button onClick={onClose} className="bg-white text-black hover:bg-red-500 hover:text-white px-8 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-lg">
            KELUAR
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden bg-[#fdfaf1] mx-auto w-full max-w-5xl rounded-3xl shadow-2xl border border-white/10">
        {ext === ".html" || ext === ".htm" ? (
          <iframe 
            srcDoc={content} 
            className="w-full h-full border-none" 
            title="Book Reader"
          />
        ) : (
          <div className="p-8 md:p-16 h-full overflow-y-auto font-serif text-lg md:text-xl leading-relaxed text-gray-900 whitespace-pre-wrap selection:bg-yellow-200">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Library Section ---
export default function LibrarySection() {
  const { data: profile } = useProfile();
  const theme = profile?.theme || { bg: '#ffffff', primary: '#1e3a8a', primaryText: '#1e293b', subtle: '#e2e8f0', surface: '#ffffff', surfaceText: '#475569', accent: '#3b82f6' };
  const [openItem, setOpenItem] = useState(null);
  const [query, setQuery] = useState("");
  const [apiBooks, setApiBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Pagination & Limit
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(40);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGutenberg = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_CONFIG.perpusBaseUrl}/gutenberg/books?search=${query}&limit=${limit}&page=${page}`);
        const result = await res.json();
        
        if (result.success) {
          setTotalPages(result.pagination?.totalPages || 1);
          const mapped = result.data.map(b => {
            const file = b.gutenberg_files?.find(f => f.file_format === 'epub') || b.gutenberg_files?.[0];
            return {
              id: b.id,
              gutenberg_id: b.gutenberg_id,
              title: b.title.split(' by ')[0],
              author: b.author || "Anonim",
              gutenberg_url: b.gutenberg_url,
              downloads: b.downloads || 0,
              language: b.language?.toUpperCase() || "EN",
              format: file ? `.${file.file_format}` : ".txt",
              downloadUrl: file?.download_url,
              allFiles: b.gutenberg_files, // Penting: untuk mencari format alternatif di handleRead
              cover: `https://www.gutenberg.org/cache/epub/${b.gutenberg_id}/pg${b.gutenberg_id}.cover.medium.jpg`
            };
          });
          setApiBooks(mapped);
        }
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchGutenberg, 500);
    return () => clearTimeout(delay);
  }, [query, page, limit]);

  const handleDownload = (book) => {
    const epubFile = book.allFiles?.find(f => f.file_format === 'epub');
    if (epubFile) {
      window.open(epubFile.download_url, '_blank');
    } else {
      alert("Format EPUB tidak tersedia.");
    }
  };

  const handleRead = async (book: any) => {
    window.open(book.gutenberg_url || `https://www.gutenberg.org/ebooks/${book.gutenberg_id}`, '_blank');
    // const readableFile = book.allFiles?.find(f => f.file_format === 'html' || f.file_format === 'txt');
    
    // if (!readableFile) {
    //   return;
    // }

    // setLoading(true);
    // try {
    //   const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(readableFile.download_url)}`;
    //   const res = await fetch(proxyUrl);
    //   const json = await res.json();
      
    //   const file = new File([json.contents], `${book.title}.${readableFile.file_format}`, { 
    //     type: readableFile.file_format === 'html' ? 'text/html' : 'text/plain' 
    //   });
      
    //   setOpenItem(file);
    // } catch (e) {
    //   window.open(readableFile.download_url, '_blank');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <section className="min-h-screen bg-[#f8f9fa]">

      <NavbarComp />
      <HeroComp titleProps="Gutenberg Library" id="#perpus" />
      
      <div className="max-w-7xl pb-20 mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border border-gray-100">
          
          {/* Controls Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-black italic tracking-tighter">PROJECT GUTENBERG</h2>
              <div className="flex items-center gap-2 text-gray-700 text-sm font-bold uppercase tracking-widest">
                <span className="w-8 h-[2px] bg-gray-700"></span>
                <span>Page {page} of {totalPages}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Limit Selector */}
              <div className="flex items-center rounded-2xl px-4 py-1 border-2 border-black transition-all">
                {/* <span className="text-[10px] font-black mr-2 opacity-40">SHOW</span> */}
                <select 
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="bg-transparent py-3 text-black font-black outline-none cursor-pointer text-sm"
                >
                  {[20, 40, 60, 80, 100].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Find masterpieces..."
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-black outline-none transition-all text-black font-bold placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
            {apiBooks.map((book) => (
              <ShelfCard 
                key={book.id} 
                book={book} 
                theme={theme} 
                onRead={handleRead} 
                onDownload={handleDownload} 
              />
            ))}
          </div>

          {/* Pagination Navigation */}
          {apiBooks.length > 0 && (
            <div className="mt-16 flex flex-col items-end gap-6">
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0, 400); }}
                  className="p-4 rounded-2xl bg-black text-white disabled:bg-gray-200 disabled:text-gray-500 transition-all hover:bg-red-600 active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex items-center gap-2 px-4">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        // Logika sederhana untuk menampilkan 5 nomor halaman terdekat
                        let pageNum = page <= 3 ? i + 1 : page - 2 + i;
                        if (pageNum > totalPages) return null;
                        return (
                            <button 
                                key={i}
                                onClick={() => { setPage(pageNum); window.scrollTo(0, 400); }}
                                className={`w-12 h-12 rounded-2xl font-black transition-all ${page === pageNum ? 'bg-red-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-black hover:bg-black hover:text-white'}`}
                            >
                                {pageNum}
                            </button>
                        )
                    })}
                </div>

                <button 
                  disabled={page >= totalPages}
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0, 400); }}
                  className="p-4 rounded-2xl bg-black text-white disabled:bg-gray-100 disabled:text-gray-300 transition-all hover:bg-red-600 active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}

          {!loading && apiBooks.length === 0 && (
            <div className="py-32 text-center">
               <div className="text-6xl mb-4">📚</div>
               <h3 className="text-gray-300 font-black text-2xl uppercase italic">No books found in this section</h3>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {openItem && <Reader item={openItem} theme={theme} onClose={() => setOpenItem(null)} />}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed bottom-10 right-10 z-[110] bg-black text-white px-8 py-4 rounded-2xl font-black italic animate-pulse shadow-2xl border border-white/20 flex items-center gap-3">
           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
           SYNCING DATABASE...
        </div>
      )}

      <FooterComp />
    </section>
  );
}