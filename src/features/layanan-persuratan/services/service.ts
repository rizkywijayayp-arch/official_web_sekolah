/**
 * Service API Layer - Layanan Persuratan
 * All API calls for the layanan persuratan module
 */
import { API_CONFIG } from '@/config/api';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

const BASE = API_CONFIG.baseUrl;
const SCHOOL_ID = () => getSchoolIdSync();

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ServiceType {
  id?: string | number;
  jenisSurat: string;
  jenisSuratLabel: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  order: number;
  fields: ServiceField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'textarea' | 'number' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: string;
  validationMessage?: string;
}

export interface PermohonanSubmission {
  jenisSurat: string;
  jenisSuratLabel: string;
  dataPemohon: Record<string, string>;
  files?: Record<string, File>;
}

export interface TrackResult {
  id: number;
  kodeTiket: string;
  jenisSurat: string;
  jenisSuratLabel: string;
  status: 'pending' | 'diproses' | 'diterima' | 'ditolak' | 'selesai';
  tanggalPengajuan: string;
  tanggalProses?: string;
  tanggalSelesai?: string;
  catatanAdmin?: string;
  nomorSurat?: string;
  fileSuratUrl?: string;
  dataPemohon?: Record<string, string>;
}

// ─── Generic Fetch Helper ────────────────────────────────────────────────────

const apiFetch = async (
  path: string,
  options: RequestInit = {},
  schoolId?: string | number
) => {
  const sid = schoolId ?? SCHOOL_ID();
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}schoolId=${sid}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': import.meta.env.VITE_API_KEY || '',
      ...options.headers,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json;
};

// ─── Service Types (Admin CRUD) ───────────────────────────────────────────────

export const serviceApi = {
  /** List all service types for this school */
  list: () =>
    apiFetch('/jenis-layanan', { method: 'GET' }),

  /** Get one service type */
  get: (id: string | number) =>
    apiFetch(`/jenis-layanan/${id}`, { method: 'GET' }),

  /** Create a new service type */
  create: (data: Omit<ServiceType, 'id'>) =>
    apiFetch('/jenis-layanan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Update a service type */
  update: (id: string | number, data: Partial<ServiceType>) =>
    apiFetch(`/jenis-layanan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** Toggle active/inactive */
  toggleActive: (id: string | number, isActive: boolean) =>
    apiFetch(`/jenis-layanan/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    }),

  /** Delete a service type */
  delete: (id: string | number) =>
    apiFetch(`/jenis-layanan/${id}`, { method: 'DELETE' }),

  /** Reorder service types */
  reorder: (orderedIds: Array<string | number>) =>
    apiFetch('/jenis-layanan/reorder', {
      method: 'PUT',
      body: JSON.stringify({ orderedIds }),
    }),
};

// ─── Permohonan Submissions (User-facing) ────────────────────────────────────

export const permohonanApi = {
  /** Submit a new permohonan (user) */
  submit: async (data: PermohonanSubmission): Promise<{ id: number; kodeTiket: string }> => {
    const formData = new FormData();
    formData.append('jenisSurat', data.jenisSurat);
    formData.append('jenisSuratLabel', data.jenisSuratLabel);
    formData.append('dataPemohon', JSON.stringify(data.dataPemohon));

    if (data.files) {
      for (const [key, file] of Object.entries(data.files)) {
        formData.append(`file_${key}`, file);
      }
    }

    const res = await fetch(`${BASE}/permohonan`, {
      method: 'POST',
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY || '',
      },
      body: formData,
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Submit failed');
    return json.data;
  },

  /** Track a permohonan by kodeTiket or numeric ID (public) */
  track: (kodeTiketOrId: string) => {
    return fetch(`${BASE}/permohonan/track/${encodeURIComponent(kodeTiketOrId)}`).then(r => r.json());
  },

  /** Get submission stats (admin) */
  stats: () =>
    apiFetch('/permohonan/stats', { method: 'GET' }),
};

// ─── File Upload ─────────────────────────────────────────────────────────────

export const uploadApi = {
  upload: async (file: File, folder = 'permohonan'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: {
        'X-API-Key': import.meta.env.VITE_API_KEY || '',
      },
      body: formData,
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Upload failed');
    return json.url as string;
  },
};

// ─── Default Service Types (fallback when API unavailable) ──────────────────

export const DEFAULT_SERVICE_TYPES: ServiceType[] = [
  { jenisSurat: 'keterangan_aktif', jenisSuratLabel: 'Surat Keterangan Aktif Sekolah', description: 'Surat keterangan siswa masih aktif bersekolah', icon: 'FileText', color: '#3B82F6', isActive: true, order: 1, fields: [
    { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap', required: true },
    { name: 'nisn', label: 'NISN', type: 'text', placeholder: '10 digit NISN', required: true },
    { name: 'kelas', label: 'Kelas', type: 'text', placeholder: 'Contoh: XII IPA 1', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa?', required: true },
  ]},
  { jenisSurat: 'lomba', jenisSuratLabel: 'Surat Keterangan Lomba (Team)', description: 'Surat untuk tim lomba/pertandingan', icon: 'Trophy', color: '#F59E0B', isActive: true, order: 2, fields: [
    { name: 'nama', label: 'Nama Pembimbing', type: 'text', placeholder: 'Nama pembimbing/guru', required: true },
    { name: 'nip', label: 'NIP', type: 'text', placeholder: 'Nomor Induk Pegawai', required: true },
    { name: 'namaLomba', label: 'Nama Lomba', type: 'text', placeholder: 'Nama lomba', required: true },
    { name: 'tanggalLomba', label: 'Tanggal Lomba', type: 'date', required: true },
    { name: 'tempatLomba', label: 'Tempat Lomba', type: 'text', placeholder: 'Lokasi lomba', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
  ]},
  { jenisSurat: 'dispensasi', jenisSuratLabel: 'Surat Dispensasi Siswa', description: 'Permohonan dispensasi kegiatan sekolah', icon: 'Clock', color: '#F97316', isActive: true, order: 3, fields: [
    { name: 'nama', label: 'Nama Lengkap Siswa', type: 'text', placeholder: 'Nama lengkap', required: true },
    { name: 'nis', label: 'NIS', type: 'text', placeholder: 'Nomor Induk Sekolah', required: true },
    { name: 'kelas', label: 'Kelas', type: 'text', placeholder: 'Contoh: XII IPA 1', required: true },
    { name: 'kegiatan', label: 'Nama Kegiatan', type: 'text', placeholder: 'Nama kegiatan', required: true },
    { name: 'tanggalMulai', label: 'Tanggal Mulai', type: 'date', required: true },
    { name: 'tanggalSelesai', label: 'Tanggal Selesai', type: 'date', required: true },
    { name: 'alasan', label: 'Alasan / Keterangan', type: 'textarea', placeholder: 'Jelaskan alasan', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
  ]},
  { jenisSurat: 'izin_guru', jenisSuratLabel: 'Surat Izin Guru dan Pegawai', description: 'Surat izin tidak masuk kerja', icon: 'Mail', color: '#6366F1', isActive: true, order: 4, fields: [
    { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
    { name: 'nip', label: 'NIP', type: 'text', placeholder: 'Nomor Induk Pegawai', required: true },
    { name: 'jabatan', label: 'Jabatan', type: 'select', options: ['Guru', 'Pegawai', 'Tenaga Administrasi'], required: true },
    { name: 'alasanIzin', label: 'Alasan Izin', type: 'textarea', placeholder: 'Jelaskan alasan tidak masuk', required: true },
    { name: 'tanggalMulai', label: 'Izin Dari Tanggal', type: 'date', required: true },
    { name: 'tanggalSelesai', label: 'Sampai Tanggal', type: 'date', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
  ]},
  { jenisSurat: 'legalisasi', jenisSuratLabel: 'Surat Permohonan Legalisasi', description: 'Permohonan legalisasi dokumen', icon: 'Stamp', color: '#7E57C2', isActive: true, order: 5, fields: [
    { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap', required: true },
    { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
    { name: 'jenisDokumen', label: 'Jenis Dokumen', type: 'select', options: ['Ijazah', 'Transkrip Nilai', 'SKHU', 'Surat Keterangan', 'Lainnya'], required: true },
    { name: 'jumlah', label: 'Jumlah Lembar', type: 'number', placeholder: 'Jumlah dokumen', required: true },
    { name: 'keperluan', label: 'Keperluan', type: 'textarea', placeholder: 'Untuk keperluan apa?', required: true },
  ]},
  { jenisSurat: 'kjp_tutup', jenisSuratLabel: 'Surat Permohonan Tutup Buku Rekening KJP', description: 'Permohonan tutup buku rekening KJP', icon: 'Lock', color: '#EF4444', isActive: true, order: 6, fields: [
    { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama penerima KJP', required: true },
    { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
    { name: 'noKJP', label: 'No. Kartu KJP', type: 'text', placeholder: 'Nomor kartu KJP', required: true },
    { name: 'namaBank', label: 'Nama Bank', type: 'select', options: ['Bank DKI', 'Bank Mandiri', 'Bank BRI', 'Bank BNI', 'Bank BTN'], required: true },
    { name: 'noRekening', label: 'No. Rekening', type: 'text', placeholder: 'Nomor rekening', required: true },
    { name: 'alasanTutup', label: 'Alasan Tutup Buku', type: 'textarea', placeholder: 'Jelaskan alasan', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
  ]},
  { jenisSurat: 'rekomendasi', jenisSuratLabel: 'Surat Rekomendasi', description: 'Surat rekomendasi untuk keperluan tertentu', icon: 'ThumbsUp', color: '#42A5F5', isActive: true, order: 7, fields: [
    { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama yang direkomendasikan', required: true },
    { name: 'nik', label: 'NIK / No. KTP', type: 'text', placeholder: '16 digit NIK', required: true },
    { name: 'instansi', label: 'Instansi Tujuan', type: 'text', placeholder: 'Nama instansi', required: true },
    { name: 'keperluan', label: 'Keperluan Rekomendasi', type: 'textarea', placeholder: 'Untuk keperluan apa?', required: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com', required: true },
    { name: 'noHp', label: 'No. HP', type: 'phone', placeholder: '08xxxxxxxxxx', required: true },
  ]},
];
