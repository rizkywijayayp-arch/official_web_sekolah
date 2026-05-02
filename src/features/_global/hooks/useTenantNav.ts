/**
 * useTenantNav.ts
 * Tenant-aware navigation — detects menu data availability per school.
 * "Satu Kode Web untuk Seribu Sekolah"
 * Rules:
 * - Fetch menu data from API using X-School-Id from domain detection
 * - Display menu items only if data is available
 * - Use Array.isArray() safety guard before .map()
 * - schoolName comes from API, not hardcoded
 */
import { useQuery } from "@tanstack/react-query";
import { getSchoolIdSync } from "./getSchoolId";
import { API_CONFIG } from "@/config/api";

export interface TenantNavData {
  // Menu availability flags
  hasBerita: boolean;
  hasGuru: boolean;
  hasTendik: boolean;
  hasEkskul: boolean;
  hasFasilitas: boolean;
  hasPrestasi: boolean;
  hasGallery: boolean;
  hasPengumuman: boolean;
  hasProker: boolean;
  hasPPDB: boolean;
  hasPPID: boolean;
  hasPerpus: boolean;
  hasAgenda: boolean;
  hasKelulusan: boolean;
  hasAlumni: boolean;
  hasVoting: boolean;

  // Raw data counts (for display)
  beritaCount: number;
  guruCount: number;
  tendikCount: number;
  ekskulCount: number;
  fasilitasCount: number;
  prestasiCount: number;
  galleryCount: number;
  pengumumanCount: number;

  // School info
  schoolName: string;
  logoUrl: string | null;
  phoneNumber: string;
  email: string;
  address: string;
}

const DEFAULT_NAV: TenantNavData = {
  hasBerita: false,
  hasGuru: false,
  hasTendik: false,
  hasEkskul: false,
  hasFasilitas: false,
  hasPrestasi: false,
  hasGallery: false,
  hasPengumuman: false,
  hasProker: false,
  hasPPDB: false,
  hasPPID: false,
  hasPerpus: false,
  hasAgenda: false,
  hasKelulusan: false,
  hasAlumni: false,
  hasVoting: false,
  beritaCount: 0,
  guruCount: 0,
  tendikCount: 0,
  ekskulCount: 0,
  fasilitasCount: 0,
  prestasiCount: 0,
  galleryCount: 0,
  pengumumanCount: 0,
  schoolName: "",
  logoUrl: null,
  phoneNumber: "",
  email: "",
  address: "",
};

export const useTenantNav = () => {
  const schoolId = getSchoolIdSync();

  return useQuery<TenantNavData>({
    queryKey: ["tenantNav", schoolId],
    queryFn: async () => {
      const base = API_CONFIG.baseUrl;
      const sid = schoolId;

      // Parallel fetch all relevant endpoints
      const [
        profileRes,
        beritaRes,
        guruRes,
        ekskulRes,
        fasilitasRes,
        prestasiRes,
        galleryRes,
        pengumumanRes,
        prokerRes,
        ppdbRes,
        ppidRes,
        perpusRes,
        agendaRes,
        votingRes,
      ] = await Promise.allSettled([
        fetch(`${base}/profileSekolah?schoolId=${sid}`),
        fetch(`${base}/berita?schoolId=${sid}&limit=1`),
        fetch(`${base}/guruTendik?schoolId=${sid}&limit=1`),
        fetch(`${base}/ekskul?schoolId=${sid}&limit=1`),
        fetch(`${base}/fasilitas?schoolId=${sid}&limit=1`),
        fetch(`${base}/prestasi?schoolId=${sid}&limit=1`),
        fetch(`${base}/galeri?schoolId=${sid}&limit=1`),
        fetch(`${base}/public/pengumuman?page=1&limit=1&schoolId=${sid}`),
        fetch(`${base}/proker?schoolId=${sid}&limit=1`),
        fetch(`${base}/ppdb?schoolId=${sid}&limit=1`),
        fetch(`${base}/ppid?schoolId=${sid}&limit=1`),
        fetch(`${base}/perpustakaan?schoolId=${sid}&limit=1`),
        fetch(`${base}/agenda?schoolId=${sid}&limit=1`),
        fetch(`${base}/voting?schoolId=${sid}&limit=1`),
      ]);

      // Helper: parse JSON safely
      const tryJson = async (r: PromiseSettledResult<Response>): Promise<any | null> => {
        if (r.status === "rejected") return null;
        try {
          return await r.value.json();
        } catch {
          return null;
        }
      };

      const [
        profileJson,
        beritaJson,
        guruJson,
        ekskulJson,
        fasilitasJson,
        prestasiJson,
        galleryJson,
        pengumumanJson,
        prokerJson,
        ppdbJson,
        ppidJson,
        perpusJson,
        agendaJson,
        votingJson,
      ] = await Promise.all([
        tryJson(profileRes),
        tryJson(beritaRes),
        tryJson(guruRes),
        tryJson(ekskulRes),
        tryJson(fasilitasRes),
        tryJson(prestasiRes),
        tryJson(galleryRes),
        tryJson(pengumumanRes),
        tryJson(prokerRes),
        tryJson(ppdbRes),
        tryJson(ppidRes),
        tryJson(perpusRes),
        tryJson(agendaRes),
        tryJson(votingRes),
      ]);

      const p = profileJson?.data;

      // Helper: count from array response
      const count = (json: any | null): number => {
        if (!json) return 0;
        if (Array.isArray(json.data)) return json.data.length;
        if (Array.isArray(json.data?.items)) return json.data.items.length;
        if (typeof json.data?.total === "number") return json.data.total;
        return 0;
      };

      // Guru vs Tendik split (if data has role field)
      const guruList = guruJson?.data;
      const guruCount = Array.isArray(guruList) ? guruList.filter((g: any) => !g.role || g.role === "guru").length : 0;
      const tendikCount = Array.isArray(guruList) ? guruList.filter((g: any) => g.role === "tendik" || g.role === "staff").length : 0;

      return {
        hasBerita: count(beritaJson) > 0,
        hasGuru: guruCount > 0 || count(guruJson) > 0,
        hasTendik: tendikCount > 0,
        hasEkskul: count(ekskulJson) > 0,
        hasFasilitas: count(fasilitasJson) > 0,
        hasPrestasi: count(prestasiJson) > 0,
        hasGallery: count(galleryJson) > 0,
        hasPengumuman: count(pengumumanJson) > 0,
        hasProker: count(prokerJson) > 0,
        hasPPDB: count(ppdbJson) > 0,
        hasPPID: count(ppidJson) > 0,
        hasPerpus: count(perpusJson) > 0,
        hasAgenda: count(agendaJson) > 0,
        hasKelulusan: pengumumanJson?.data?.items?.some((item: any) => item.isKelulusan) || false,
        hasAlumni: true, // Always show - alumni book can always be accessed
        hasVoting: votingJson?.data?.isActive === true || count(votingJson) > 0,
        beritaCount: count(beritaJson),
        guruCount,
        tendikCount,
        ekskulCount: count(ekskulJson),
        fasilitasCount: count(fasilitasJson),
        prestasiCount: count(prestasiJson),
        galleryCount: count(galleryJson),
        pengumumanCount: count(pengumumanJson),
        schoolName: p?.schoolName || "",
        logoUrl: p?.logoUrl || null,
        phoneNumber: p?.phoneNumber || "",
        email: p?.email || "",
        address: p?.address || "",
      };
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};