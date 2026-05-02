/**
 * NavbarDesignSwitcher.tsx
 * Automatically selects navbar component based on schoolId.
 * Falls back to DynamicNavbar if no custom design exists.
 * All data sourced from profile API — no hardcoded school names.
 */
import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";
import { DynamicNavbar }   from "./DynamicNavbar";
import { NavbarComp40 }    from "./navbarComp40";
import { NavbarComp1378101 } from "./navbarComp1370101";

export const NavbarDesignSwitcher = () => {
  const schoolId = getSchoolIdSync();

  switch (schoolId) {
    case "40":
      return <NavbarComp40 />;
    case "101":
      return <NavbarComp1378101 />;
    default:
      // Default = DynamicNavbar — pulls logo, name, contact from API
      return <DynamicNavbar />;
  }
};

export default NavbarDesignSwitcher;