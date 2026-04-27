/**
 * Default values for tenant websites
 * Used as fallback when API data is unavailable
 * Can be customized per deployment
 */
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