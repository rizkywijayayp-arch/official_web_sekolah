// Centralized API Configuration for Multi-Tenant
// Single source of truth: VITE_API_BASE_URL must point to production backend

const API_CONFIG = {
  get baseUrl() {
    const base = import.meta.env.VITE_API_BASE_URL || 'https://be.school.kiraproject.id';
    return base.replace(/\/$/, '');
  },

  get adminUrl() {
    return import.meta.env.VITE_ADMIN_PORTAL_URL || 'https://admin.kiraproject.id';
  },

  withSchoolId(schoolId: string) {
    return `${this.baseUrl}/profileSekolah?schoolId=${schoolId}`;
  },

  get perpusBaseUrl() {
    return import.meta.env.VITE_PERPUS_BASE_URL || 'https://be-perpus.kiraproject.id';
  }
};

export { API_CONFIG };
export default API_CONFIG;