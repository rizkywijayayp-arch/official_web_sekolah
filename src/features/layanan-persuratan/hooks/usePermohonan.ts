/**
 * Hook untuk fetching data permohonan surat
 */
import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';

export interface PermohonanData {
  id: number;
  schoolId: number;
  jenisSurat: string;
  jenisSuratLabel: string;
  dataPemohon: Record<string, string>;
  status: 'pending' | 'diproses' | 'diterima' | 'ditolak' | 'selesai';
  tanggalPengajuan: string;
  tanggalProses?: string;
  tanggalSelesai?: string;
  catatanAdmin?: string;
  fileSuratUrl?: string;
  nomorSurat?: string;
  kopSuratUrl?: string;
  ttdKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  ttdTataUsaha?: string;
  nipTataUsaha?: string;
  ipAddress?: string;
  prioritas?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermohonanStats {
  total: number;
  pending: number;
  recent: number;
  byStatus: Array<{ status: string; count: string }>;
  topJenis: Array<{ jenisSurat: string; jenisSuratLabel: string; count: string }>;
}

interface UsePermohonanReturn {
  data: PermohonanData[];
  stats: PermohonanStats | null;
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
  status?: string;
  jenisSurat?: string;
}

export function usePermohonan(params: FetchParams = {}): UsePermohonanReturn {
  const [data, setData] = useState<PermohonanData[]>([]);
  const [stats, setStats] = useState<PermohonanStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1, total: 0 });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { page = 1, limit = 20, status, jenisSurat } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) queryParams.append('status', status);
      if (jenisSurat) queryParams.append('jenisSurat', jenisSurat);

      const response = await fetch(`${API_CONFIG.baseUrl}/permohonan?${queryParams}`, {
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setPagination(result.pagination);
        setStats(result.stats);
      } else {
        setError(result.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('[usePermohonan] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.page, params.limit, params.status, params.jenisSurat]);

  const refetch = () => {
    fetchData();
  };

  return { data, stats, isLoading, error, pagination, refetch };
}

// Hook untuk update status permohonan
export function usePermohonanActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    id: number,
    status: string,
    additionalData?: {
      catatanAdmin?: string;
      fileSuratUrl?: string;
      nomorSurat?: string;
      kopSuratUrl?: string;
      ttdKepalaSekolah?: string;
      nipKepalaSekolah?: string;
      ttdTataUsaha?: string;
      nipTataUsaha?: string;
      prioritas?: number;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/permohonan/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: JSON.stringify({ status, ...additionalData }),
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.message || 'Gagal mengupdate status');
        return false;
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengupdate status');
      console.error('[usePermohonanActions] Error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePermohonan = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/permohonan/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
      });

      const result = await response.json();

      if (result.success) {
        return true;
      } else {
        setError(result.message || 'Gagal menghapus permohonan');
        return false;
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus permohonan');
      console.error('[usePermohonanActions] Error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStatus, deletePermohonan, isLoading, error };
}
