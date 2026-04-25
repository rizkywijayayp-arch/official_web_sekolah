import { API_CONFIG } from "@/config/api";

/**
 * Set favicon berdasarkan logo sekolah atau favicon URL custom
 * Call ini setiap kali schoolData di-load
 */
export const setFavicon = (logoUrl: string | null, schoolName?: string, faviconUrl?: string | null) => {
  // Hapus link icon yang existing
  const existingLink = document.querySelector("link[rel='icon']");
  if (existingLink) {
    existingLink.remove();
  }

  // Buat link element baru
  const link = document.createElement("link");
  link.rel = "icon";

  if (faviconUrl) {
    // Pakai favicon custom dari admin
    link.type = faviconUrl.toLowerCase().endsWith('.png') ? "image/png" : "image/x-icon";
    link.href = faviconUrl;
  } else if (logoUrl) {
    // Pakai logo dari API sebagai favicon
    const lowerUrl = logoUrl.toLowerCase();
    if (lowerUrl.endsWith('.png')) {
      link.type = "image/png";
    } else if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) {
      link.type = "image/jpeg";
    } else if (lowerUrl.endsWith('.webp')) {
      link.type = "image/webp";
    } else if (lowerUrl.endsWith('.svg')) {
      link.type = "image/svg+xml";
    } else if (lowerUrl.endsWith('.ico')) {
      link.type = "image/x-icon";
    } else {
      link.type = "image/x-icon";
    }
    // Add cache-busting timestamp
    link.href = logoUrl.includes('?') ? `${logoUrl}&t=${Date.now()}` : `${logoUrl}?t=${Date.now()}`;
  } else if (schoolName) {
    // Generate favicon dari inisial sekolah
    link.type = "image/svg+xml";
    link.href = generateInitialFavicon(schoolName);
  } else {
    // Fallback
    link.type = "image/x-icon";
    link.href = "/logo.ico";
  }

  document.head.appendChild(link);
};

/**
 * Generate SVG favicon dari inisial sekolah
 */
const generateInitialFavicon = (schoolName: string): string => {
  // Ambil 2 karakter pertama dari kata pertama schoolName
  const words = schoolName.trim().split(/\s+/);
  let initials = words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join("");

  // Fallback kalau kosong
  if (!initials) initials = "SC";

  // Generate SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="#1B5E20"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
          font-family="Arial Black, sans-serif" font-size="50" font-weight="bold" fill="white">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Auto-set favicon dari school profile data
 * Panggil ini di component yang fetch profileSekolah
 */
export const setFaviconFromProfile = (profile: any) => {
  if (!profile) return;

  const logoUrl = profile.logoUrl || null;
  const faviconUrl = profile.faviconUrl || null;
  const schoolName = profile.schoolName || "";
  setFavicon(logoUrl, schoolName, faviconUrl);
};
