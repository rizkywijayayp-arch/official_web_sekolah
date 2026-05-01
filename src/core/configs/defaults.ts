/**
 * Central default values for multi-tenant school platform.
 * All schoolId fallbacks MUST reference DEFAULT_SCHOOL_ID — never hardcode a number.
 * Override via VITE_DEFAULT_SCHOOL_ID in .env for deployment-specific defaults.
 */
export const DEFAULT_SCHOOL_ID = import.meta.env.VITE_DEFAULT_SCHOOL_ID || "1001";

export const DEFAULTS = {
  school: {
    name: "Nayaka Website",
    type: "Platform Sekolah Digital",
  },
  theme: {
    primary: "#3B82F6",
    accent: "#FEF08A",
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceText: "#334155",
    subtle: "#E2E8F0",
    pop: "#F87171",
  },
};

// For backwards compatibility
export const THEMES = {
  default: {
    name: DEFAULTS.school.name,
    ...DEFAULTS.theme,
  },
};

export default DEFAULTS;