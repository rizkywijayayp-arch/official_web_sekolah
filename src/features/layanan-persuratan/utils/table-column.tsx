/**
 * Table columns configuration untuk permohonan surat
 */
import { ColumnDef } from '@tanstack/react-table';
import { PermohonanData } from '../hooks/usePermohonan';

// Simple date formatter
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const permohonanColumns: ColumnDef<PermohonanData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'jenisSuratLabel',
    header: 'Jenis Surat',
    size: 200,
  },
  {
    accessorKey: 'dataPemohon.nama',
    header: 'Nama Pemohon',
    size: 180,
    cell: ({ row }) => row.original.dataPemohon?.nama || '-',
  },
  {
    accessorKey: 'dataPemohon.email',
    header: 'Email',
    size: 180,
    cell: ({ row }) => row.original.dataPemohon?.email || '-',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        diproses: 'bg-blue-100 text-blue-800',
        diterima: 'bg-green-100 text-green-800',
        ditolak: 'bg-red-100 text-red-800',
        selesai: 'bg-emerald-100 text-emerald-800',
      };
      const statusLabels: Record<string, string> = {
        pending: 'Pending',
        diproses: 'Diproses',
        diterima: 'Diterima',
        ditolak: 'Ditolak',
        selesai: 'Selesai',
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}
        >
          {statusLabels[status] || status}
        </span>
      );
    },
  },
  {
    accessorKey: 'tanggalPengajuan',
    header: 'Tgl. Pengajuan',
    size: 120,
    cell: ({ row }) => formatDate(row.original.tanggalPengajuan),
  },
  {
    accessorKey: 'nomorSurat',
    header: 'No. Surat',
    size: 120,
    cell: ({ row }) => row.original.nomorSurat || '-',
  },
  {
    accessorKey: 'prioritas',
    header: 'Prioritas',
    size: 80,
    cell: ({ row }) => {
      const p = row.original.prioritas;
      if (!p) return '-';
      if (p === 1) return '🔴 Tinggi';
      if (p === 2) return '🟡 Sedang';
      return '🟢 Normal';
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    size: 120,
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];

export const permohonanDataFallback = [
  {
    id: 1,
    schoolId: null as any,
    jenisSurat: 'keterangan_aktif',
    jenisSuratLabel: 'Surat Keterangan Aktif Sekolah',
    dataPemohon: { nama: 'Ahmad Fauzi', email: 'ahmad@email.com' },
    status: 'pending',
    tanggalPengajuan: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    schoolId: null as any,
    jenisSurat: 'izin_guru',
    jenisSuratLabel: 'Surat Izin Guru dan Pegawai',
    dataPemohon: { nama: 'Siti Aminah', email: 'siti@email.com' },
    status: 'diproses',
    tanggalPengajuan: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
