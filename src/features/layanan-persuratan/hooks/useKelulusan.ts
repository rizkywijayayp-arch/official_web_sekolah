/**
 * Hook untuk fetch data kelulusan
 * Bisa untuk siswa umum atau admin
 */
import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

export interface KelulusanData {
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
  ket?: string;
  // TTD fields
  nomorSurat?: string;
  kopSuratUrl?: string;
  ttdKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  ttdTataUsaha?: string;
  nipTataUsaha?: string;
  catatanAdmin?: string;
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface UseKelulusanReturn {
  data: KelulusanData[];
  stats: {
    total: number;
    lulus: number;
    tunda: number;
    mengulang: number;
    belumLulus: number;
    byTahun: Array<{ tahunLulus: number; total: number; lulus: number }>;
  } | null;
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
  search?: string;
}

export function useKelulusan(params: FetchParams = {}): UseKelulusanReturn {
  const [data, setData] = useState<KelulusanData[]>([]);
  const [stats, setStats] = useState<UseKelulusanReturn['stats']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1, total: 0 });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const schoolId = getSchoolIdSync();
      const { page = 1, limit = 20, tahun, jenjang, search } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        schoolId: schoolId,
      });

      if (tahun) queryParams.append('tahun', tahun.toString());
      if (jenjang) queryParams.append('jenjang', jenjang);
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
        setStats(result.stats || null);
      } else {
        setError(result.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('[useKelulusan] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.page, params.limit, params.tahun, params.jenjang, params.search]);

  const refetch = () => {
    fetchData();
  };

  return { data, stats, isLoading, error, pagination, refetch };
}

// Hook untuk admin actions
export function useKelulusanActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createKelulusan = async (data: Partial<KelulusanData>): Promise<boolean> => {
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
      return result.success;
    } catch (err) {
      setError('Gagal menyimpan data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateKelulusan = async (id: number, data: Partial<KelulusanData>): Promise<boolean> => {
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

  const deleteKelulusan = async (id: number): Promise<boolean> => {
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

  const importExcel = async (file: File): Promise<{ success: number; failed: number }> => {
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
        success: result.successCount || 0,
        failed: result.failedCount || 0,
      };
    } catch (err) {
      setError('Gagal import data');
      return { success: 0, failed: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return { createKelulusan, updateKelulusan, deleteKelulusan, importExcel, isLoading, error };
}
