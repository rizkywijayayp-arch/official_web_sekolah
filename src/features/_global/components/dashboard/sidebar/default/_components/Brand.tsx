import { Avatar, AvatarImage, cn } from "@/core/libs";
import { useSchool } from "@/features/schools";
import React from "react";
import { Link } from "react-router-dom";

interface BrandProps {
  isCollapsed?: boolean;
}

export const Brand = React.memo(({ isCollapsed }: BrandProps) => {
  const school = useSchool();
  const hasLogo = !!school.data?.[0]?.file;

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
        {/* Logo - hanya tampilkan jika ada logo */}
        {hasLogo && (
          <Avatar className="w-8 h-8 lg:w-9 lg:h-9">
            <AvatarImage
              src={`https://dev.kiraproject.id${school.data?.[0]?.file}`}
              alt={school.data?.[0]?.namaSekolah || 'Logo'}
              className="object-cover object-center bg-white"
            />
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="relative top-[2px] text-sm whitespace-nowrap font-bold">
            {school.data?.[0]?.namaSekolah || 'Sekolah'}
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