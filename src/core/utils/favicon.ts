import { API_CONFIG } from "@/config/api";

/**
 * Set favicon berdasarkan logo sekolah
 * Call ini setiap kali schoolData di-load
 */
export const setFavicon = (logoUrl: string | null, schoolName?: string) => {
  const link = document.querySelector("link[rel='icon']") as HTMLLinkElement || document.createElement("link");

  if (logoUrl) {
    // Pakai logo dari API
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = logoUrl;
  } else if (schoolName) {
    // Generate favicon dari inisial sekolah
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = generateInitialFavicon(schoolName);
  }

  if (!document.head.contains(link)) {
    document.head.appendChild(link);
  }
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
  const schoolName = profile.schoolName || "";
  setFavicon(logoUrl, schoolName);
};
