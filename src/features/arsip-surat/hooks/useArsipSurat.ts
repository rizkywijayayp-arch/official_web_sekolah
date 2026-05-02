/**
 * Hook untuk manajemen arsip surat
 */
import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '@/config/api';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

const API_BASE = API_CONFIG.baseUrl;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': import.meta.env.VITE_API_KEY || '',
});

export interface ArsipSuratData {
  id: number;
  schoolId: number;
  kategori: 'keluar' | 'masuk' | 'internal';
  nomor_surat: string;
  klasifikasi_id: number;
  klasifikasi_kode: string;
  klasifikasi_kode_full?: string;
  klasifikasi_nama?: string;
  tanggal_surat: string;
  tanggal_input: string;
  hal: string;
  ringkasan: string;
  pengirim: string;
  tujuan: string;
  tempat: string;
  jumlah_lampiran: number;
  lampiran_file: string;
  penandatangan: string;
  nip_penandatangan: string;
  jabatan_penandatangan: string;
  kop_surat_url: string;
  ttd_image_url: string;
  status: 'draft' | 'arsip' | 'diteruskan';
  permohonan_id: number;
  disposisi?: Disposisi[];
  createdAt: string;
  updatedAt: string;
}

export interface Disposisi {
  id: number;
  surat_id: number;
  dari_user: string;
  kepada_user: string;
  instruksi: string;
  tanggal_disposisi: string;
}

export interface ArsipStats {
  total: number;
  total_keluar: number;
  total_masuk: number;
  total_internal: number;
  bulan_ini: number;
  hari_ini: number;
}

export interface Klasifikasi {
  id: number;
  schoolId: number;
  kode: string;
  nama: string;
  kategori: string;
  keterangan: string;
  isActive: number;
}

interface UseArsipSuratReturn {
  data: ArsipSuratData[];
  stats: ArsipStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; pages: number; total: number };
  refetch: () => void;
}

interface FetchParams {
  page?: number;
  limit?: number;
  kategori?: string;
  status?: string;
  search?: string;
}

export function useArsipSurat(params: FetchParams = {}): UseArsipSuratReturn {
  const [data, setData] = useState<ArsipSuratData[]>([]);
  const [stats, setStats] = useState<ArsipStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1, total: 0 });

  const schoolId = getSchoolIdSync();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { page = 1, limit = 20, kategori, status, search } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        schoolId: schoolId,
      });
      if (kategori) queryParams.append('kategori', kategori);
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);

      const res = await fetch(`${API_BASE}/arsip-surat?${queryParams}`, {
        headers: authHeaders(),
      });
      const result = await res.json();

      if (result.success) {
        setData(result.data || []);
        setPagination({ page: result.page, limit: result.limit, pages: result.pages, total: result.total });
      } else {
        setError(result.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, params.page, params.limit, params.kategori, params.status, params.search]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/arsip-surat/stats?schoolId=${schoolId}`, {
        headers: authHeaders(),
      });
      const result = await res.json();
      if (result.success) setStats(result.stats);
    } catch { /* silent */ }
  }, [schoolId]);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [fetchData, fetchStats]);

  const refetch = () => { fetchData(); fetchStats(); };

  return { data, stats, isLoading, error, pagination, refetch };
}

// ─── Actions Hook ─────────────────────────────────────────────────────────

interface ArsipActionsReturn {
  create: (data: Partial<ArsipSuratData>) => Promise<boolean>;
  update: (id: number, data: Partial<ArsipSuratData>) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
  addDisposisi: (suratId: number, dari: string, kepada: string, instruksi: string) => Promise<boolean>;
  getNextNomor: (kategori: string) => Promise<string>;
  getKlasifikasi: (kategori?: string) => Promise<Klasifikasi[]>;
  isLoading: boolean;
  error: string | null;
}

export function useArsipActions(onComplete?: () => void): ArsipActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schoolId = getSchoolIdSync();

  const req = async (method: string, path: string, body?: object) => {
    const url = `${API_BASE}${path}${path.includes('?') ? '&' : '?'}schoolId=${schoolId}`;
    const res = await fetch(url, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };

  const create = async (data: Partial<ArsipSuratData>): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const result = await req('POST', '/arsip-surat', data);
      if (result.success) { onComplete?.(); return true; }
      setError(result.message);
      return false;
    } catch { setError('Terjadi kesalahan'); return false; }
    finally { setIsLoading(false); }
  };

  const update = async (id: number, data: Partial<ArsipSuratData>): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const result = await req('PUT', `/arsip-surat/${id}`, data);
      if (result.success) { onComplete?.(); return true; }
      setError(result.message);
      return false;
    } catch { setError('Terjadi kesalahan'); return false; }
    finally { setIsLoading(false); }
  };

  const remove = async (id: number): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const result = await req('DELETE', `/arsip-surat/${id}`);
      if (result.success) { onComplete?.(); return true; }
      setError(result.message);
      return false;
    } catch { setError('Terjadi kesalahan'); return false; }
    finally { setIsLoading(false); }
  };

  const addDisposisi = async (suratId: number, dari: string, kepada: string, instruksi: string): Promise<boolean> => {
    setIsLoading(true); setError(null);
    try {
      const result = await req('POST', `/arsip-surat/${suratId}/disposisi`, { dari_user: dari, kepada_user: kepada, instruksi });
      if (result.success) { onComplete?.(); return true; }
      setError(result.message);
      return false;
    } catch { setError('Terjadi kesalahan'); return false; }
    finally { setIsLoading(false); }
  };

  const getNextNomor = async (kategori: string): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE}/arsip-surat/next-nomor?kategori=${kategori}&schoolId=${schoolId}`, {
        headers: authHeaders(),
      });
      const result = await res.json();
      return result.nomor || '';
    } catch { return ''; }
  };

  const getKlasifikasi = async (kategori?: string): Promise<Klasifikasi[]> => {
    try {
      const url = `${API_BASE}/arsip-surat/klasifikasi?schoolId=${schoolId}${kategori ? '&kategori=' + kategori : ''}`;
      const res = await fetch(url, { headers: authHeaders() });
      const result = await res.json();
      return result.data || [];
    } catch { return []; }
  };

  return { create, update, remove, addDisposisi, getNextNomor, getKlasifikasi, isLoading, error };
}