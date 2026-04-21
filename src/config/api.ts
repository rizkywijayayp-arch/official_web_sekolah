// Centralized API Configuration for Multi-Tenant
// Use window.location.origin for dynamic domain resolution

const API_CONFIG = {
  // Dynamic base URL based on current domain
  get BASE_URL() {
    if (typeof window === 'undefined') {
      return 'https://be-school.kiraproject.id';
    }

    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Vite dev server (5173) or React dev server (3000)
      if (port === '5173' || port === '3000') {
        return 'http://localhost:5005';
      }
      // Already on backend port
      return `${protocol}//${hostname}:${port}`;
    }

    // Production - use current domain's origin
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
  },

  // For explicit schoolId-based calls
  withSchoolId(schoolId) {
    return `${this.BASE_URL}?schoolId=${schoolId}`;
  }
};

// Export for use in components
export { API_CONFIG };

// Default export for convenience
export default API_CONFIG;
