import { API_CONFIG } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { getSchoolIdSync } from "./getSchoolId";

export const useSchoolProfile = () => {
  const schoolId = getSchoolIdSync();
  const API_BASE = API_CONFIG.BASE_URL;

  return useQuery({
    queryKey: ['schoolProfile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profileSekolah?schoolId=${schoolId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Gagal mengambil profil sekolah: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Response tidak valid");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
