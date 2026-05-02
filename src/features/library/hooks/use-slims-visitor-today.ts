import { slimsService } from "@/core/services/slims";
import { useAuth } from "@/features/auth";
import { useQuery } from "@tanstack/react-query";


export const useTodayVisitors = (baseUrl: string | null) => {
  const auth = useAuth();
  const profile = auth.profile;
  const schoolId = profile?.user?.sekolahId ?? profile?.sekolah?.id;

  return useQuery({
    queryKey: ["todayVisitors", baseUrl],
    queryFn: () => slimsService.getTodayVisitors(baseUrl!, schoolId),
    enabled: !!baseUrl,
    staleTime: 1000 * 60 * 2,
  });
};