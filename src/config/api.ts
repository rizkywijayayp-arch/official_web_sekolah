// Centralized API Configuration for Multi-Tenant
// Use relative paths for API calls to avoid Mixed Content errors
// nginx proxy handles forwarding to backend

const API_CONFIG = {
  get baseUrl() { // ← samakan nama dengan yang dipakai di component
    // const base = import.meta.env.VITE_API_BASE_URL || '';
    const base = "https://admin.kiraproject.id/api";
    return base.replace(/\/$/, '');
  },

  withSchoolId(schoolId: string) {
    return `${this.baseUrl}/profileSekolah?schoolId=${schoolId}`;
  }
};

export { API_CONFIG };
export default API_CONFIG;