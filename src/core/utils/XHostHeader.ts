// Dynamic X-Host header resolution
// No hardcoded school mappings - uses schoolId from API

import { getSchoolIdSync } from "@/features/_global/hooks/getSchoolId";

// This utility is now deprecated - schoolId is resolved via getSchoolIdSync()
// Kept for backward compatibility but should use getSchoolIdSync() instead

export const getXHostHeader = (): string => {
  // This function is deprecated
  // Use getSchoolIdSync() to get schoolId instead
  console.warn('getXHostHeader is deprecated, use getSchoolIdSync() instead');
  return '';
};

export const getCurrentHostname = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.toLowerCase();
};

export const resolveSchoolIdFromHost = (hostname: string): string => {
  // Extract from hostname pattern (e.g., sman40-jkt.sch.id -> 40)
  const match = hostname.match(/sman(\d+)/i);
  if (match) {
    return match[1];
  }

  // Fallback to default
  return '55';
};