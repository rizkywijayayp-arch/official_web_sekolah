// Centralized API Configuration for Multi-Tenant
// Use relative paths for API calls to avoid Mixed Content errors
// nginx proxy handles forwarding to backend

const API_CONFIG = {
  // Backend API base URL - use relative path for proxy compatibility
  get BASE_URL() {
    // Use relative path so nginx can proxy (avoids Mixed Content)
    const base = import.meta.env.VITE_API_BASE_URL || '/';
    // Remove trailing slash to avoid double slashes
    return base.replace(/\/$/, '');
  },

  // For explicit schoolId-based calls
  withSchoolId(schoolId) {
    return `${this.BASE_URL}/profileSekolah?schoolId=${schoolId}`;
  }
};

// Export for use in components
export { API_CONFIG };

// Default export for convenience
export default API_CONFIG;