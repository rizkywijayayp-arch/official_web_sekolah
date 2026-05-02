// Deprecated — kept for backward compatibility only.
// Use getSchoolIdSync() from ./getSchoolId instead.

import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";

export const getXHostHeader = (): string => {
  console.warn('[XHostHeader] getXHostHeader is deprecated — use getSchoolIdSync()');
  return getSchoolIdSync();
};

export const getCurrentHostname = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.toLowerCase();
};

// Regex-only resolver — mirrors getSchoolIdSync logic
export const resolveSchoolIdFromHost = (hostname: string): string => {
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
  // Import DEFAULT_SCHOOL_ID to avoid hardcoding
  const { DEFAULT_SCHOOL_ID } = require("@/core/configs/defaults");
  return DEFAULT_SCHOOL_ID;
};