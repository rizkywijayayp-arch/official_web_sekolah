/**
 * SchoolDesignRegistry.tsx
 * Central mapping: schoolId → { hero, navbar }
 * All designs resolved here — no hardcoded schoolId elsewhere.
 * Default fallback = schoolId 1001 (DEFAULT_SCHOOL_ID from defaults.ts)
 */
import { DEFAULT_SCHOOL_ID } from "@/core/configs/defaults";

// Re-export for convenience
export { DEFAULT_SCHOOL_ID };

// ── Per-school design metadata ──────────────────────────────────────────────
export const SCHOOL_DESIGN_MAP: Record<string, { label?: string }> = {
  "13":  { label: "SMKN 13 Jakarta" },
  "40":  { label: "SMAN 40 Jakarta" },
  "78":  { label: "SMAN 78 Jakarta" },
  "101": { label: "SMAN 101 Jakarta" },
};

// ── Hero component map ───────────────────────────────────────────────────────
export const HERO_COMPONENT_MAP: Record<string, { componentName: string; variant: string }> = {
  "13":  { componentName: "HeroComp13",      variant: "smkn13" },
  "40":  { componentName: "HeroComp40",     variant: "sman40" },
  "78":  { componentName: "HeroComp78101",  variant: "sman78" },
  "101": { componentName: "HeroComp101",     variant: "sman101" },
};

// ── Navbar component map ──────────────────────────────────────────────────────
export const NAVBAR_COMPONENT_MAP: Record<string, { componentName: string; variant: string }> = {
  "40":  { componentName: "NavbarComp40",       variant: "navbar40" },
  "101": { componentName: "NavbarComp1370101",  variant: "navbar101" },
};

// ── Resolve helpers ─────────────────────────────────────────────────────────
export const resolveHeroVariant = (schoolId: string): string =>
  HERO_COMPONENT_MAP[schoolId]?.variant ?? "default";

export const resolveNavbarVariant = (schoolId: string): string =>
  NAVBAR_COMPONENT_MAP[schoolId]?.variant ?? "default";

export const resolveSchoolLabel = (schoolId: string): string =>
  SCHOOL_DESIGN_MAP[schoolId]?.label ?? `Sekolah ID ${schoolId}`;

export const isCustomDesign = (schoolId: string): boolean =>
  schoolId in HERO_COMPONENT_MAP || schoolId in NAVBAR_COMPONENT_MAP;