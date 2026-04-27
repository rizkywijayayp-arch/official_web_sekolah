/**
 * Graduation Admin Dashboard
 * Manage graduation data for students
 */
import { DashboardPageLayout } from '@/features/_global';
import { useGraduation, useGraduationActions, GraduationData } from '../hooks/useGraduation';
import { useSchoolPreset } from '@/features/layanan-persuratan/hooks/useSchoolPreset';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/core/libs';
import { BaseDataTable } from '@/features/_global';
import { useNavigate } from 'react-router-dom';
import { Printer, Plus, Upload, Clock, CheckCircle, XCircle, Calendar, Settings, Bell } from 'lucide-react';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { formatDate } from '@/features/layanan-persuratan/utils/table-column';
import { getSchoolIdSync } from '@/features/_global/hooks/getSchoolId';

const COUNTDOWN_STORAGE_KEY = (schoolId: string | null) => `kelulusan_countdown_${schoolId || 'default'}`;
const DEFAULT_ANNOUNCEMENT_DATE = '2026-06-05T08:00:00+07:00';

const graduationColumns = (onEdit: (data: GraduationData) => void, onPrint: (data: GraduationData) => void) => [
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

const graduationDataFallback: GraduationData[] = [
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
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function GraduationAdminDashboard() {
  const navigate = useNavigate();
  const { data: schoolData } = useSchoolProfile();
  const { data, isLoading, pagination, refetch, stats } = useGraduation({ limit: 50 });
  const { updateGraduation, createGraduation, importExcel, bulkUpdateStatus, isLoading: actionLoading } = useGraduationActions();
  const { preset } = useSchoolPreset();

  const [filterTahun, setFilterTahun] = useState<string>('');
  const [filterJenjang, setFilterJenjang] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<GraduationData | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [kelulusanOpen, setKelulusanOpen] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [announcementDate, setAnnouncementDate] = useState(() => {
    const schoolId = getSchoolIdSync();
    const stored = localStorage.getItem(COUNTDOWN_STORAGE_KEY(schoolId));
    return stored ? new Date(stored) : new Date(DEFAULT_ANNOUNCEMENT_DATE);
  });
  const [isCountdownEnabled, setIsCountdownEnabled] = useState(() => {
    const schoolId = getSchoolIdSync();
    const stored = localStorage.getItem(`kelulusan_countdown_enabled_${schoolId || 'default'}`);
    return stored ? stored === 'true' : true;
  });

  // Countdown
  useState(() => {
    if (!isCountdownEnabled) {
      setKelulusanOpen(true);
      return;
    }
    const updateCountdown = () => {
      const now = new Date();
      const diff = announcementDate.getTime() - now.getTime();
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

  // Add form state
  const [addForm, setAddForm] = useState({
    nama: '',
    nisn: '',
    nis: '',
    jenjang: 'SMA / MA',
    jurusan: '',
    kelas: '',
    tahunLulus: new Date().getFullYear(),
  });

  const columns = useMemo(() => graduationColumns(
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

    const success = await updateGraduation(selectedData.id, {
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

  const handleAddStudent = async () => {
    const schoolId = getSchoolIdSync();
    const success = await createGraduation({
      ...addForm,
      schoolId: schoolId,
      status: 'tunda',
    });

    if (success.success) {
      setIsAddOpen(false);
      setAddForm({
        nama: '',
        nisn: '',
        nis: '',
        jenjang: 'SMA / MA',
        jurusan: '',
        kelas: '',
        tahunLulus: new Date().getFullYear(),
      });
      refetch();
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importExcel(file);
    setImportResult({ success: result.success, failed: result.failed });
    refetch();

    // Clear after 5 seconds
    setTimeout(() => setImportResult(null), 5000);
  };

  return (
    <DashboardPageLayout
      siteTitle={`Data Kelulusan | ${schoolData?.schoolName || 'Nayaka Website'}`}
      breadcrumbs={[{ label: 'Data Kelulusan', url: '/admin/kelulusan' }]}
      title="Data Kelulusan"
    >
      {/* Import Result Toast */}
      {importResult && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          importResult.failed === 0 ? 'bg-green-500' : 'bg-yellow-500'
        } text-white`}>
          <p className="font-semibold">Import Selesai!</p>
          <p className="text-sm">{importResult.success} berhasil, {importResult.failed} gagal</p>
        </div>
      )}

      {/* Countdown Banner */}
      {isCountdownEnabled && !kelulusanOpen && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h3 className="text-lg font-bold">Pengumuman Kelulusan</h3>
              </div>
              <p className="text-blue-100 text-sm">Tanggal pengumuman: {announcementDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {announcementDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
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
                  <Calendar className="w-5 h-5" />
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Status</SelectItem>
            <SelectItem value="lulus">LULUS</SelectItem>
            <SelectItem value="tunda">TUNDA</SelectItem>
            <SelectItem value="mengulang">MENGULANG</SelectItem>
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
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleImportExcel}
          />
          <Button variant="outline" size="sm" className="cursor-pointer" as="span">
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
        </label>
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Manual
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Pengaturan
        </Button>
      </div>

      {/* Table */}
      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={graduationDataFallback}
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

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Data Siswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap *</label>
              <Input
                value={addForm.nama}
                onChange={(e) => setAddForm(prev => ({ ...prev, nama: e.target.value }))}
                placeholder="Nama lengkap siswa"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">NISN *</label>
                <Input
                  value={addForm.nisn}
                  onChange={(e) => setAddForm(prev => ({ ...prev, nisn: e.target.value }))}
                  placeholder="10 digit"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">NIS</label>
                <Input
                  value={addForm.nis}
                  onChange={(e) => setAddForm(prev => ({ ...prev, nis: e.target.value }))}
                  placeholder="NIS Sekolah"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jenjang *</label>
                <Select value={addForm.jenjang} onValueChange={(v) => setAddForm(prev => ({ ...prev, jenjang: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SD / MI">SD / MI</SelectItem>
                    <SelectItem value="SMP / MTs">SMP / MTs</SelectItem>
                    <SelectItem value="SMA / MA">SMA / MA</SelectItem>
                    <SelectItem value="SMK / MAK">SMK / MAK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tahun Lulus *</label>
                <Select value={addForm.tahunLulus.toString()} onValueChange={(v) => setAddForm(prev => ({ ...prev, tahunLulus: parseInt(v) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026, 2027].map(t => (
                      <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kelas</label>
              <Input
                value={addForm.kelas}
                onChange={(e) => setAddForm(prev => ({ ...prev, kelas: e.target.value }))}
                placeholder="XII IPA 1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jurusan</label>
              <Input
                value={addForm.jurusan}
                onChange={(e) => setAddForm(prev => ({ ...prev, jurusan: e.target.value }))}
                placeholder="IPA / IPS / TKJ (jika ada)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button onClick={handleAddStudent} disabled={actionLoading || !addForm.nama || !addForm.nisn}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Countdown Kelulusan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Aktifkan Countdown</p>
                <p className="text-sm text-gray-500">Tampilkan hitungan mundur sebelum tanggal pengumuman</p>
              </div>
              <button
                onClick={() => {
                  const newValue = !isCountdownEnabled;
                  setIsCountdownEnabled(newValue);
                  const schoolId = getSchoolIdSync();
                  localStorage.setItem(`kelulusan_countdown_enabled_${schoolId || 'default'}`, newValue.toString());
                  setKelulusanOpen(newValue);
                }}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isCountdownEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isCountdownEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Pengumuman</label>
              <Input
                type="datetime-local"
                value={announcementDate.toISOString().slice(0, 16)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setAnnouncementDate(newDate);
                  const schoolId = getSchoolIdSync();
                  localStorage.setItem(COUNTDOWN_STORAGE_KEY(schoolId), newDate.toISOString());
                }}
              />
              <p className="text-xs text-gray-500">
                Tanggal dan waktu kapan pengumuman kelulusan akan dibuka secara otomatis.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Info:</strong> Pengaturan ini hanya berlaku untuk tenant ini.
                Tanggal default: 5 Juni 2026 pukul 08:00 WIB.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
}
