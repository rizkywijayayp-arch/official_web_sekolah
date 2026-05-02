/**
 * Kelulusan Admin Dashboard
 * Menu terpisah di admin dashboard untuk manage data kelulusan siswa
 */
import { DashboardPageLayout } from '@/features/_global';
import { useKelulusan, useKelulusanActions, KelulusanData } from '../hooks/useKelulusan';
import { useSchoolPreset } from '../hooks/useSchoolPreset';
import { Button } from '@/core/libs';
import { Input } from '@/core/libs';
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/core/libs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/libs';
import { Textarea } from '@/core/libs';
import { Badge } from '@/core/libs';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/libs';
import { BaseDataTable } from '@/features/_global';
import { BaseActionTable } from '@/features/_global';
import { useNavigate } from 'react-router-dom';
import { Printer, Plus, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';
import { API_CONFIG } from '@/config/api';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';

// Table columns
const kelulusanColumns = (onEdit: (data: KelulusanData) => void, onPrint: (data: KelulusanData) => void) => [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
    size: 180,
  },
  {
    accessorKey: 'nisn',
    header: 'NISN',
    size: 120,
  },
  {
    accessorKey: 'nis',
    header: 'NIS',
    size: 100,
  },
  {
    accessorKey: 'jenjang',
    header: 'Jenjang',
    size: 100,
  },
  {
    accessorKey: 'jurusan',
    header: 'Jurusan',
    size: 150,
    cell: ({ row }: any) => row.original.jurusan || '-',
  },
  {
    accessorKey: 'kelas',
    header: 'Kelas',
    size: 100,
  },
  {
    accessorKey: 'tahunLulus',
    header: 'Tahun',
    size: 80,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 110,
    cell: ({ row }: any) => {
      const status = row.original.status;
      const colors: Record<string, string> = {
        lulus: 'bg-green-100 text-green-800',
        tunda: 'bg-yellow-100 text-yellow-800',
        mengulang: 'bg-red-100 text-red-800',
      };
      const labels: Record<string, string> = {
        lulus: 'LULUS',
        tunda: 'TUNDA',
        mengulang: 'MENGULANG',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>
          {labels[status] || status.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'nomorSurat',
    header: 'No. Surat',
    size: 120,
    cell: ({ row }: any) => row.original.nomorSurat || <span className="text-gray-400">-</span>,
  },
];

// Fallback data
const kelulusanDataFallback: KelulusanData[] = [
  {
    id: 1,
    schoolId: null as any,
    nama: 'Ahmad Fauzi',
    nisn: '1234567890',
    nis: '2024001',
    jenjang: 'SMK / MAK',
    jurusan: 'Teknik Komputer dan Jaringan',
    kelas: 'XII TKJ 1',
    tahunLulus: 2025,
    status: 'lulus',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const KelulusanAdminLanding = () => {
  const navigate = useNavigate();
  const { data: schoolData } = useSchoolProfile();
  const { data, isLoading, pagination, refetch, stats } = useKelulusan({ limit: 50 });
  const { updateKelulusan, createKelulusan, importExcel, isLoading: actionLoading } = useKelulusanActions();
  const { preset } = useSchoolPreset();

  const [filterTahun, setFilterTahun] = useState<string>('');
  const [filterJenjang, setFilterJenjang] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<KelulusanData | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [kelulusanOpen, setKelulusanOpen] = useState(false);

  // Countdown
  useState(() => {
    const kelulusanDate = new Date('2026-06-05T08:00:00+07:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = kelulusanDate.getTime() - now.getTime();
      if (diff <= 0) {
        setKelulusanOpen(true);
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  });

  // Edit form state
  const [editNomorSurat, setEditNomorSurat] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editCatatan, setEditCatatan] = useState('');

  const columns = useMemo(() => kelulusanColumns(
    (item) => {
      setSelectedData(item);
      setEditNomorSurat(item.nomorSurat || '');
      setEditStatus(item.status);
      setEditCatatan(item.catatanAdmin || '');
      setIsEditOpen(true);
    },
    (item) => {
      navigate(`/admin/kelulusan/print/${item.id}`);
    }
  ), [navigate]);

  const handleSaveEdit = async () => {
    if (!selectedData) return;

    const success = await updateKelulusan(selectedData.id, {
      status: editStatus as any,
      nomorSurat: editNomorSurat,
      catatanAdmin: editCatatan,
      ttdKepalaSekolah: preset.ttdKepalaSekolah,
      nipKepalaSekolah: preset.nipKepalaSekolah,
      ttdTataUsaha: preset.ttdTataUsaha,
      nipTataUsaha: preset.nipTataUsaha,
      kopSuratUrl: preset.kopSuratUrl,
    });

    if (success) {
      setIsEditOpen(false);
      refetch();
    }
  };

  return (
    <DashboardPageLayout
      siteTitle={`Data Kelulusan | ${schoolData?.schoolName || 'Nayaka Website'}`}
      breadcrumbs={[{ label: 'Data Kelulusan', url: '/admin/kelulusan' }]}
      title="Data Kelulusan"
    >
      {/* Countdown Banner */}
      {!kelulusanOpen && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Pengumuman Kelulusan</h3>
              <p className="text-blue-100 text-sm">Tanggal pengumuman: 5 Juni 2026 pukul 08:00 WIB</p>
            </div>
            <div className="flex gap-4 text-center">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-3xl font-bold">{countdown.days}</div>
                <div className="text-xs">Hari</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-3xl font-bold">{countdown.hours}</div>
                <div className="text-xs">Jam</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-3xl font-bold">{countdown.minutes}</div>
                <div className="text-xs">Menit</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-3xl font-bold">{countdown.seconds}</div>
                <div className="text-xs">Detik</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.lulus}</p>
                  <p className="text-xs text-gray-500">Lulus</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.tunda}</p>
                  <p className="text-xs text-gray-500">Tunda</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.mengulang}</p>
                  <p className="text-xs text-gray-500">Mengulang</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.byTahun?.[0]?.tahunLulus || '-'}</p>
                  <p className="text-xs text-gray-500">Tahun Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter & Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="Cari nama/NISN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-48"
        />
        <Select value={filterJenjang} onValueChange={setFilterJenjang}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua Jenjang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Jenjang</SelectItem>
            <SelectItem value="SD / MI">SD / MI</SelectItem>
            <SelectItem value="SMP / MTs">SMP / MTs</SelectItem>
            <SelectItem value="SMA / MA">SMA / MA</SelectItem>
            <SelectItem value="SMK / MAK">SMK / MAK</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterTahun} onValueChange={setFilterTahun}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Tahun</SelectItem>
            {[2024, 2025, 2026].map(t => (
              <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Import Excel
        </Button>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Manual
        </Button>
      </div>

      {/* Table */}
      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={kelulusanDataFallback}
        globalSearch
        searchParamPagination
        isLoading={isLoading}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Kelulusan</DialogTitle>
          </DialogHeader>
          {selectedData && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold">{selectedData.nama}</p>
                <p className="text-sm text-gray-500">NISN: {selectedData.nisn}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status Kelulusan</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lulus">LULUS</SelectItem>
                    <SelectItem value="tunda">TUNDA</SelectItem>
                    <SelectItem value="mengulang">MENGULANG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nomor Surat</label>
                <Input
                  value={editNomorSurat}
                  onChange={(e) => setEditNomorSurat(e.target.value)}
                  placeholder="001/SKL/2025"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catatan</label>
                <Textarea
                  value={editCatatan}
                  onChange={(e) => setEditCatatan(e.target.value)}
                  placeholder="Catatan admin..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit} disabled={actionLoading}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
