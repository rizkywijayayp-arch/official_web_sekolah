import { API_CONFIG } from "@/config/api";

/**
 * Set favicon berdasarkan logo sekolah atau favicon URL custom
 * Call ini setiap kali schoolData di-load
 *
 * RULES:
 * - Jika ada faviconUrl custom dari admin, pakai itu
 * - Jika ada logoUrl, pakai logo sebagai favicon
 * - Jika TIDAK ADA logo dan TIDAK ADA favicon, JANGAN tampilkan favicon
 */
export const setFavicon = (logoUrl: string | null, schoolName?: string, faviconUrl?: string | null) => {
  // Hapus link icon yang existing
  const existingLink = document.querySelector("link[rel='icon']");
  if (existingLink) {
    existingLink.remove();
  }

  // Jika tidak ada logo dan tidak ada favicon, jangan tampilkan favicon
  if (!faviconUrl && !logoUrl) {
    console.log('[Favicon] No logo/favicon provided - skipping favicon');
    return;
  }

  // Buat link element baru
  const link = document.createElement("link");
  link.rel = "icon";

  if (faviconUrl) {
    // Pakai favicon custom dari admin
    if (faviconUrl.toLowerCase().endsWith('.png')) {
      link.type = "image/png";
    } else if (faviconUrl.toLowerCase().endsWith('.svg')) {
      link.type = "image/svg+xml";
    } else if (faviconUrl.toLowerCase().endsWith('.ico')) {
      link.type = "image/x-icon";
    } else {
      link.type = "image/x-icon";
    }
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
  }

  document.head.appendChild(link);
  console.log('[Favicon] Set successfully');
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

/**
 * Clear favicon (remove dari head)
 */
export const clearFavicon = () => {
  const existingLink = document.querySelector("link[rel='icon']");
  if (existingLink) {
    existingLink.remove();
  }
};
