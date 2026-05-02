import { Avatar, AvatarImage, cn } from "@/core/libs";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getSchoolIdSync } from "../../../../hooks/getSchoolId";
import { API_CONFIG } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

interface BrandProps {
  isCollapsed?: boolean;
}

export const Brand = React.memo(({ isCollapsed }: BrandProps) => {
  const schoolId = getSchoolIdSync();

  // Tenant-aware: fetch schoolName from API (works without auth for admin portal)
  const { data: profileData } = useQuery({
    queryKey: ["brandProfile", schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_CONFIG.baseUrl}/profileSekolah?schoolId=${schoolId}`);
      const json = await res.json();
      return json.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const logoUrl = profileData?.logoUrl || null;
  const schoolName = profileData?.schoolName || profileData?.headmasterName || "Admin Dashboard";
  const hasLogo = !!logoUrl;

  return (
    <div
      className={cn(
        "sidebar-brand w-full flex h-14 items-center z-[22] border-b border-white/20 px-4 lg:h-[60px] lg:px-6",
        isCollapsed && "justify-center",
      )}
    >
      <Link
        to="/"
        className={cn(
          "sidebar-brand-logo flex items-center gap-2 font-semibold",
          isCollapsed && "justify-center",
        )}
      >
        {/* Logo — tenant-aware: show only if logoUrl exists */}
        {hasLogo && (
          <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
            <AvatarImage
              src={logoUrl}
              alt={schoolName}
              className="object-cover object-center bg-white"
            />
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="relative top-[2px] text-sm whitespace-nowrap font-bold">
            {schoolName}
          </p>
          {hasLogo && (
            <p className="text-[10px] font-normal opacity-75">
              Admin Dashboard
            </p>
          )}
        </div>
      </Link>
    </div>
  );
});

Brand.displayName = "Brand";