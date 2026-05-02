/**
 * Hook untuk CRUD manajemen jenis layanan persuratan (admin)
 * Endpoint: GET/POST/PUT/DELETE /api/jenis-layanan
 */
import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '@/config/api';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

export interface FormFieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface ServiceType {
  id: string;
  jenisSurat: string; // unique key, e.g. "keterangan_aktif"
  jenisSuratLabel: string; // display name
  description?: string;
  icon?: string; // lucide icon name
  color?: string; // hex color
  isActive: boolean;
  order: number;
  fields: FormFieldDef[];
  createdAt?: string;
  updatedAt?: string;
}

// Fallback default service types (when API unavailable)
export const DEFAULT_SERVICE_TYPES: ServiceType[] = [
  { id: '1', jenisSurat: 'keterangan_aktif', jenisSuratLabel: 'Surat Keterangan Aktif Sekolah', description: 'Surat keterangan siswa masih aktif bersekolah', icon: 'FileText', color: '#3B82F6', isActive: true, order: 1, fields: [] },
  { id: '2', jenisSurat: 'lomba', jenisSuratLabel: 'Surat Keterangan Lomba (Team)', description: 'Surat untuk tim lomba/pertandingan', icon: 'Trophy', color: '#F59E0B', isActive: true, order: 2, fields: [] },
  { id: '3', jenisSurat: 'kjp_tutup', jenisSuratLabel: 'Surat Permohonan Tutup Buku Rekening KJP', description: 'Permohonan tutup buku rekening KJP', icon: 'Lock', color: '#EF4444', isActive: true, order: 3, fields: [] },
  { id: '4', jenisSurat: 'kjp_blokir', jenisSuratLabel: 'Surat Permohonan Buka Blokir KJP', description: 'Permohonan buka blokir rekening KJP', icon: 'Unlock', color: '#8B5CF6', isActive: true, order: 4, fields: [] },
  { id: '5', jenisSurat: 'kjp_nama', jenisSuratLabel: 'Surat Permohonan Perubahan Nama / Wali KJP', description: 'Permohonan perubahan data nama atau wali KJP', icon: 'UserEdit', color: '#EC4899', isActive: true, order: 5, fields: [] },
  { id: '6', jenisSurat: 'kjp_atm', jenisSuratLabel: 'Surat Permohonan Ganti Buku / ATM Bank DKI KJP', description: 'Permohonan ganti buku tabungan atau ATM Bank DKI', icon: 'CreditCard', color: '#10B981', isActive: true, order: 6, fields: [] },
  { id: '7', jenisSurat: 'dispensasi', jenisSuratLabel: 'Surat Dispensasi Siswa', description: 'Permohonan dispensasi kegiatan sekolah', icon: 'Clock', color: '#F97316', isActive: true, order: 7, fields: [] },
  { id: '8', jenisSurat: 'izin_guru', jenisSuratLabel: 'Surat Izin Guru dan Pegawai', description: 'Surat izin tidak masuk kerja', icon: 'Mail', color: '#6366F1', isActive: true, order: 8, fields: [] },
  { id: '9', jenisSurat: 'pengalaman', jenisSuratLabel: 'Surat Keterangan Pengalaman', description: 'Surat keterangan pengalaman kerja', icon: 'Briefcase', color: '#14B8A6', isActive: true, order: 9, fields: [] },
  { id: '10', jenisSurat: 'rekomendasi', jenisSuratLabel: 'Surat Rekomendasi', description: 'Surat rekomendasi untuk keperluan tertentu', icon: 'ThumbsUp', color: '#42A5F5', isActive: true, order: 10, fields: [] },
  { id: '11', jenisSurat: 'rt_rw', jenisSuratLabel: 'Surat Pengantar RT/RW', description: 'Surat pengantar untuk keperluan administrasi', icon: 'Home', color: '#78909C', isActive: true, order: 11, fields: [] },
  { id: '12', jenisSurat: 'domisili', jenisSuratLabel: 'Surat Keterangan Domisili', description: 'Surat keterangan domisili sekolah', icon: 'MapPin', color: '#26A69A', isActive: true, order: 12, fields: [] },
  { id: '13', jenisSurat: 'legalisasi', jenisSuratLabel: 'Surat Permohonan Legalisasi', description: 'Permohonan legalisasi dokumen', icon: 'Stamp', color: '#7E57C2', isActive: true, order: 13, fields: [] },
];

interface UseServiceTypesReturn {
  serviceTypes: ServiceType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseServiceTypeActionsReturn {
  createServiceType: (data: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateServiceType: (id: string, data: Partial<ServiceType>) => Promise<boolean>;
  toggleActive: (id: string, isActive: boolean) => Promise<boolean>;
  deleteServiceType: (id: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const API_BASE = `${API_CONFIG.baseUrl}/layanan`;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'X-API-Key': import.meta.env.VITE_API_KEY || '',
});

export function useServiceTypes(): UseServiceTypesReturn {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const schoolId = getSchoolIdSync();

  const fetchServiceTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?schoolId=${schoolId}`, {
        headers: authHeaders(),
      });
      const result = await res.json();
      if (result.success) {
        const types: ServiceType[] = result.data || [];
        setServiceTypes(types.length > 0 ? types : DEFAULT_SERVICE_TYPES);
      } else {
        // Fallback to defaults
        setServiceTypes(DEFAULT_SERVICE_TYPES);
      }
    } catch {
      setServiceTypes(DEFAULT_SERVICE_TYPES);
    } finally {
      setIsLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchServiceTypes();
  }, [fetchServiceTypes]);

  return { serviceTypes, isLoading, error, refetch: fetchServiceTypes };
}

export function useServiceTypeActions(onComplete?: () => void): UseServiceTypeActionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const schoolId = getSchoolIdSync();

  const request = async (method: string, path: string, body?: object) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify({ ...body, schoolId: parseInt(schoolId) }) : undefined,
    });
    return res.json();
  };

  const createServiceType = async (data: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await request('POST', '', data);
      if (result.success) { onComplete?.(); return true; }
      setError(result.message || 'Gagal membuat jenis layanan');
      return false;
    } catch {
      setError('Terjadi kesalahan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceType = async (id: string, data: Partial<ServiceType>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await request('PUT', `/${id}`, data);
      if (result.success) { onComplete?.(); return true; }
      setError(result.message || 'Gagal mengupdate jenis layanan');
      return false;
    } catch {
      setError('Terjadi kesalahan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean): Promise<boolean> => {
    return updateServiceType(id, { isActive });
  };

  const deleteServiceType = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await request('DELETE', `/${id}`);
      if (result.success) { onComplete?.(); return true; }
      setError(result.message || 'Gagal menghapus jenis layanan');
      return false;
    } catch {
      setError('Terjadi kesalahan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createServiceType, updateServiceType, toggleActive, deleteServiceType, isLoading, error };
}

// Status check hook for public users (no auth needed)
export function useTrackPermohonan(kodeTiket: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const track = useCallback(async () => {
    if (!kodeTiket.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/permohonan/track/${encodeURIComponent(kodeTiket.trim())}`);
      const result = await res.json();
      if (result.success) setData(result.data);
      else setError(result.message || 'Permohonan tidak ditemukan');
    } catch {
      setError('Gagal mengambil data');
    } finally {
      setIsLoading(false);
    }
  }, [kodeTiket]);

  useEffect(() => { track(); }, [track]);

  return { data, isLoading, error, refetch: track };
}
