/**
 * Hook untuk fetch data kelulusan
 * Untuk tenant website - NISN check
 */
import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

export interface GraduationData {
  id: number;
  schoolId: number;
  nama: string;
  nisn: string;
  nis: string;
  jenjang: string;
  jurusan?: string;
  kelas: string;
  tahunLulus: number;
  noIjazah?: string;
  status: 'lulus' | 'tunda' | 'mengulang';
  nomorSurat?: string;
  kopSuratUrl?: string;
  ttdKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  ttdTataUsaha?: string;
  nipTataUsaha?: string;
  catatanAdmin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GraduationStats {
  total: number;
  lulus: number;
  tunda: number;
  mengulang: number;
  belumLulus: number;
  byTahun: Array<{ tahunLulus: number; total: number; lulus: number }>;
}

interface UseGraduationReturn {
  data: GraduationData[];
  stats: GraduationStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  refetch: () => void;
}

interface FetchParams {
  page?: number;
  limit?: number;
  tahun?: number;
  jenjang?: string;
  status?: string;
  search?: string;
}

export function useGraduation(params: FetchParams = {}): UseGraduationReturn {
  const [data, setData] = useState<GraduationData[]>([]);
  const [stats, setStats] = useState<GraduationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1, total: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const schoolId = getSchoolIdSync();
      const { page = 1, limit = 20, tahun, jenjang, status, search } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (schoolId) queryParams.append('schoolId', schoolId);
      if (tahun) queryParams.append('tahun', tahun.toString());
      if (jenjang) queryParams.append('jenjang', jenjang);
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);

      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan?${queryParams}`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data || []);
        setPagination(result.pagination || { page: 1, limit: 20, pages: 1, total: 0 });
      } else {
        setError(result.message || 'Gagal mengambil data');
      }

      // Fetch stats separately
      const statsResponse = await fetch(`${API_CONFIG.BASE_URL}/kelulusan/stats`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
      });
      const statsResult = await statsResponse.json();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('[useGraduation] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.page, params.limit, params.tahun, params.jenjang, params.status, params.search, refreshKey]);

  const refetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { data, stats, isLoading, error, pagination, refetch };
}

// Public hook for NISN check (no auth required)
export function useGraduationNisnCheck() {
  const [data, setData] = useState<Partial<GraduationData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkNisn = async (nisn: string): Promise<{ success: boolean; data?: Partial<GraduationData> }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan/check/${nisn}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message || 'Data tidak ditemukan');
        return { success: false };
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { data, isLoading, error, checkNisn, reset };
}

// Admin actions for graduation management
export function useGraduationActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGraduation = async (data: Partial<GraduationData>): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return { success: result.success, message: result.message };
    } catch (err) {
      setError('Gagal menyimpan data');
      return { success: false, message: 'Gagal menyimpan data' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateGraduation = async (id: number, data: Partial<GraduationData>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result.success;
    } catch (err) {
      setError('Gagal mengupdate data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGraduation = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
      });

      const result = await response.json();
      return result.success;
    } catch (err) {
      setError('Gagal menghapus data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const importExcel = async (file: File): Promise<{ success: number; failed: number; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan/import`, {
        method: 'POST',
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: formData,
      });

      const result = await response.json();
      return {
        success: result.results?.success || 0,
        failed: result.results?.failed || 0,
        message: result.message || 'Import selesai',
      };
    } catch (err) {
      setError('Gagal import data');
      return { success: 0, failed: 0, message: 'Gagal import data' };
    } finally {
      setIsLoading(false);
    }
  };

  const bulkUpdateStatus = async (
    ids: number[],
    data: { status: string; nomorSurat?: string }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/kelulusan/bulk-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: JSON.stringify({ ids, ...data }),
      });

      const result = await response.json();
      return result.success;
    } catch (err) {
      setError('Gagal update data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGraduation,
    updateGraduation,
    deleteGraduation,
    importExcel,
    bulkUpdateStatus,
    isLoading,
    error,
  };
}
