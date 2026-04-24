// Dynamic schoolId resolution from backend API
// No hardcoded domain mappings - all resolved via API

const DEFAULT_SCHOOL_ID = "55"; // fallback if API fails

export const getSchoolId = async (): Promise<string> => {
  const hostname = window.location.hostname;

  // Skip localhost default - always try to extract from subdomain
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    try {
      // Fetch schoolId from backend API based on current domain
      const response = await fetch(`https://be-school.kiraproject.id/school/resolve?domain=${hostname}`);

      if (response.ok) {
        const data = await response.json();
        if (data.schoolId) {
          return data.schoolId;
        }
      }
    } catch (error) {
      
    }

    // Extract from various subdomain patterns
    const patterns = [
      /sman(\d+)/i,                    // sman40, sman40jkt, NEW.sman40-jkt
      /smpn(\d+)/i,                    // smpn12
      /smkn(\d+)/i,                    // smkn13
      /(\d+)-?jkt/i,                  // 40-jkt, 40jkt
    ];

    for (const pattern of patterns) {
      const match = hostname.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  }

  // For localhost, try subdomain patterns first
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    const localhostMatch = hostname.match(/(\d+)/);
    if (localhostMatch && localhostMatch[1]) {
      // Check if it's a school number pattern (e.g., localhost with 40 in it)
      const num = localhostMatch[1];
      if (num.length >= 2 && num !== "5173" && num !== "3000" && num !== "5005") {
        return num;
      }
    }
  }

  return DEFAULT_SCHOOL_ID;
};

// Synchronous version for components that need it immediately
export const getSchoolIdSync = (): string => {
  // If already called before, return cached value to avoid recalculation
  if (typeof window !== 'undefined' && (window as any).__cachedSchoolId) {
    return (window as any).__cachedSchoolId;
  }

  const hostname = window.location.hostname;

  // Skip localhost default - always try to extract from subdomain
  if (hostname !== "localhost" && hostname !== "127.0.0.1") {
    // Extract from various subdomain patterns - include sch.id domains
    const patterns = [
      /sman(\d+)/i,                    // sman40, sman40jkt, sman40-jkt.sch.id
      /smpn(\d+)/i,                    // smpn12
      /smkn(\d+)/i,                    // smkn13
      /(\d+)-?jkt/i,                   // 40-jkt, 40jkt (including sch.id)
      /(\d+)jakarta/i,                 // sman40jakarta
    ];

    for (const pattern of patterns) {
      const match = hostname.match(pattern);
      if (match && match[1]) {
        const id = match[1];
        // Cache the result
        if (typeof window !== 'undefined') {
          (window as any).__cachedSchoolId = id;
        }
        return id;
      }
    }
  }

  // For localhost, use default (user should change this in local dev)
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    // Can be overridden by localStorage if needed
    const localSchoolId = localStorage.getItem('devSchoolId');
    if (localSchoolId) {
      if (typeof window !== 'undefined') {
        (window as any).__cachedSchoolId = localSchoolId;
      }
      return localSchoolId;
    }
  }

  // ALWAYS return default schoolId - never return undefined
  const defaultId = DEFAULT_SCHOOL_ID;
  if (typeof window !== 'undefined') {
    (window as any).__cachedSchoolId = defaultId;
  }
  return defaultId;
};