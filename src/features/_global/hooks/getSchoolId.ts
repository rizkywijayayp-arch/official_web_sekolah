// Dynamic schoolId resolution — automatically detects from URL domain
// Zero hardcoded school numbers. All fallbacks reference DEFAULT_SCHOOL_ID.

import { DEFAULT_SCHOOL_ID } from "@/core/configs/defaults";

// ── Backend base URL (single source of truth) ────────────────────────────────
const _getBackendBase = (): string => {
  try {
    return import.meta.env.VITE_API_BASE_URL || 'https://be-school.kiraproject.id';
  } catch {
    return 'https://be-school.kiraproject.id';
  }
};

// ── Async: resolve schoolId from backend API by domain ───────────────────────
export const getSchoolId = async (): Promise<string> => {
  const hostname = window.location.hostname;

  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    try {
      const response = await fetch(
        `${_getBackendBase()}/school/resolve?domain=${encodeURIComponent(hostname)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.schoolId) return data.schoolId;
      }
    } catch {
      // fall through to regex extraction
    }

    // Extract from subdomain patterns
    const patterns = [
      /sman(\d+)/i,
      /smpn(\d+)/i,
      /smkn(\d+)/i,
      /(\d+)-?jkt/i,
    ];
    for (const pattern of patterns) {
      const match = hostname.match(pattern);
      if (match?.[1]) return match[1];
    }
  }

  return DEFAULT_SCHOOL_ID;
};

// ── Sync: lightweight regex-only extraction for immediate use ────────────────
export const getSchoolIdSync = (): string => {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_ID;

  // Return cached value to avoid recalculation
  const cached = (window as any).__cachedSchoolId;
  if (cached) return cached;

  const hostname = window.location.hostname;

  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    const patterns = [
      /sman(\d+)/i,
      /smpn(\d+)/i,
      /smkn(\d+)/i,
      /(\d+)-?jkt/i,
      /(\d+)jakarta/i,
    ];
    for (const pattern of patterns) {
      const match = hostname.match(pattern);
      if (match?.[1]) {
        const id = match[1];
        (window as any).__cachedSchoolId = id;
        return id;
      }
    }
  }

  // Localhost dev override via localStorage
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const devOverride = localStorage.getItem('devSchoolId');
    if (devOverride) {
      (window as any).__cachedSchoolId = devOverride;
      return devOverride;
    }
  }

  // FINAL FALLBACK — never return undefined
  (window as any).__cachedSchoolId = DEFAULT_SCHOOL_ID;
  return DEFAULT_SCHOOL_ID;
};