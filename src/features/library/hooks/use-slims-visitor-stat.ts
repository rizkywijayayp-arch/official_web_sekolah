import { slimsService } from "@/core/services/slims";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";


export const useSlimsVisitorStats = (
  baseUrl?: string,
  startDate?: string,
  endDate?: string
) => {
  const auth = useAuth();
  const profile = auth.profile;
  const schoolId = profile?.user?.sekolahId ?? profile?.sekolah?.id;

  return useQuery({
    queryKey: ["slims-visitor-stats", baseUrl, startDate, endDate],
    enabled: !!baseUrl && !!startDate && !!endDate,
    queryFn: () => slimsService.getVisitorStats(baseUrl!, startDate!, endDate!, schoolId),
    staleTime: 1000 * 60 * 2, // 5 minutes
  });
};