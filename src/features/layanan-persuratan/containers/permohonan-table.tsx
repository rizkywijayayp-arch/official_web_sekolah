/**
 * Permohonan Table - Untuk admin dashboard
 * Dengan fitur: upload kop, TTD, preset otomatis, format nomor surat
 */
import { usePermohonan, usePermohonanActions, PermohonanData } from '../hooks/usePermohonan';
import { useSchoolPreset } from '../hooks/useSchoolPreset';
import { permohonanColumns, permohonanDataFallback } from '../utils/table-column';
import { BaseDataTable } from '@/features/_global';
import { lang } from '@/core/libs';
import { useMemo, useState } from 'react';
import { BaseActionTable } from '@/features/_global';
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
import { Button } from '@/core/libs';
import { Input } from '@/core/libs';
import { Badge } from '@/core/libs';
import { Eye, CheckCircle, XCircle, Clock, FileCheck, Upload, X, Save, Settings } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

// Kode surat untuk auto-format
const KODE_SURAT: Record<string, string> = {
  izin_guru: 'SIGP',
  keterangan_aktif: 'SKAS',
  keterangan_lulus: 'SKLS',
  keterangan_pindah: 'SKPT',
  lomba: 'SKLM',
  kjp_tutup: 'SKJP',
  kjp_blokir: 'SKJB',
  kjp_nama: 'SKJN',
  kjp_atm: 'SKJA',
  dispensasi: 'SKDS',
  pengalaman: 'SKPJ',
  rekomendasi: 'SKRK',
  rt_rw: 'SKRT',
  domisili: 'SKDM',
  legalisasi: 'SKLG',
};

// Generate nomor surat otomatis
const generateNomorSurat = (jenisSurat: string, existingNomor?: string) => {
  if (existingNomor) return existingNomor;
  const kode = KODE_SURAT[jenisSurat] || 'SK';
  const tahun = new Date().getFullYear();
  return `..../${kode}/${tahun}`;
};

interface PermohonanTableProps {
  statusFilter?: string;
}

export function PermohonanTable({ statusFilter }: PermohonanTableProps) {
  const { data, isLoading, pagination, refetch } = usePermohonan({
    status: statusFilter,
  });
  const { updateStatus, deletePermohonan, isLoading: actionLoading } = usePermohonanActions();
  const { preset, savePreset, saveTTD, saveKopSurat, applyToPermohonan } = useSchoolPreset();

  const [selectedPermohonan, setSelectedPermohonan] = useState<PermohonanData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [catatanAdmin, setCatatanAdmin] = useState('');
  const [nomorSurat, setNomorSurat] = useState('');
  const [kopSuratUrl, setKopSuratUrl] = useState('');
  const [ttdKepalaImage, setTtdKepalaImage] = useState('');
  const [ttdTuImage, setTtdTuImage] = useState('');
  const [ttdKepalaSekolah, setTtdKepalaSekolah] = useState('');
  const [nipKepalaSekolah, setNipKepalaSekolah] = useState('');
  const [ttdTataUsaha, setTtdTataUsaha] = useState('');
  const [nipTataUsaha, setNipTataUsaha] = useState('');
  const [uploading, setUploading] = useState(false);

  // Preset dialog state
  const [presetKopSuratUrl, setPresetKopSuratUrl] = useState('');
  const [presetTtdKepala, setPresetTtdKepala] = useState('');
  const [presetNipKepala, setPresetNipKepala] = useState('');
  const [presetTtdTu, setPresetTtdTu] = useState('');
  const [presetNipTu, setPresetNipTu] = useState('');

  const columns = useMemo(() => {
    const cols = permohonanColumns();
    return [
      ...cols,
      {
        accessorKey: 'actions',
        header: 'Aksi',
        size: 120,
        cell: ({ row }: { row: { original: PermohonanData } }) => (
          <div className="flex items-center gap-2">
            <BaseActionTable
              onDetail={() => {
                setSelectedPermohonan(row.original);
                setIsDetailOpen(true);
              }}
            />
            <button
              onClick={() => {
                setSelectedPermohonan(row.original);
                setNewStatus(row.original.status);
                setCatatanAdmin(row.original.catatanAdmin || '');
                setNomorSurat(generateNomorSurat(row.original.jenisSurat, row.original.nomorSurat));
                setKopSuratUrl(row.original.kopSuratUrl || preset.kopSuratUrl || '');
                setTtdKepalaSekolah(row.original.ttdKepalaSekolah || preset.ttdKepalaSekolah || '');
                setNipKepalaSekolah(row.original.nipKepalaSekolah || preset.nipKepalaSekolah || '');
                setTtdTataUsaha(row.original.ttdTataUsaha || preset.ttdTataUsaha || '');
                setNipTataUsaha(row.original.nipTataUsaha || preset.nipTataUsaha || '');
                setIsStatusDialogOpen(true);
              }}
              className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Proses Surat"
            >
              <Clock className="w-4 h-4" />
            </button>
            {row.original.nomorSurat && (
              <a
                href={`/admin/permohonan/print/${row.original.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                title="Cetak Surat"
              >
                <FileCheck className="w-4 h-4" />
              </a>
            )}
          </div>
        ),
      },
    ];
  }, [preset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: formData,
      });
      const result = await response.json();
      if (result.success && result.url) {
        setUrl(result.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedPermohonan || !newStatus) return;

    const success = await updateStatus(selectedPermohonan.id, newStatus, {
      catatanAdmin,
      nomorSurat: nomorSurat || undefined,
      kopSuratUrl: kopSuratUrl || undefined,
      ttdKepalaSekolah: ttdKepalaSekolah || undefined,
      nipKepalaSekolah: nipKepalaSekolah || undefined,
      ttdTataUsaha: ttdTataUsaha || undefined,
      nipTataUsaha: nipTataUsaha || undefined,
    });

    if (success) {
      setIsStatusDialogOpen(false);
      refetch();
    }
  };

  const handleSavePreset = () => {
    savePreset({
      kopSuratUrl: presetKopSuratUrl,
      ttdKepalaSekolah: presetTtdKepala,
      nipKepalaSekolah: presetNipKepala,
      ttdTataUsaha: presetTtdTu,
      nipTataUsaha: presetNipTu,
    });
    setIsPresetDialogOpen(false);
  };

  const handleLoadPreset = () => {
    setPresetKopSuratUrl(preset.kopSuratUrl || '');
    setPresetTtdKepala(preset.ttdKepalaSekolah || '');
    setPresetNipKepala(preset.nipKepalaSekolah || '');
    setPresetTtdTu(preset.ttdTataUsaha || '');
    setPresetNipTu(preset.nipTataUsaha || '');
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      diproses: 'bg-blue-100 text-blue-800 border-blue-300',
      diterima: 'bg-green-100 text-green-800 border-green-300',
      ditolak: 'bg-red-100 text-red-800 border-red-300',
      selesai: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Button untuk buka preset dialog */}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => { handleLoadPreset(); setIsPresetDialogOpen(true); }}>
          <Settings className="w-4 h-4 mr-2" />
          Pengaturan Sekolah
        </Button>
      </div>

      <BaseDataTable
        columns={columns}
        data={data}
        dataFallback={permohonanDataFallback}
        globalSearch
        searchParamPagination
        searchPlaceholder={lang.text('search')}
        isLoading={isLoading}
      />

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Permohonan</DialogTitle>
          </DialogHeader>
          {selectedPermohonan && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={`flex items-center gap-1 px-3 py-1 ${statusBadge(selectedPermohonan.status)}`}>
                  {selectedPermohonan.status.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">ID: {selectedPermohonan.id}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Jenis Surat</p>
                <p className="font-semibold">{selectedPermohonan.jenisSuratLabel}</p>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm">Data Pemohon</h4>
                {Object.entries(selectedPermohonan.dataPemohon || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium">{value || '-'}</span>
                  </div>
                ))}
              </div>

              {(selectedPermohonan.nomorSurat || selectedPermohonan.catatanAdmin) && (
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Info Admin</h4>
                  {selectedPermohonan.nomorSurat && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Nomor Surat</span>
                      <span className="font-medium">{selectedPermohonan.nomorSurat}</span>
                    </div>
                  )}
                  {selectedPermohonan.ttdKepalaSekolah && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">TTD Kep. Sekolah</span>
                      <span className="font-medium">{selectedPermohonan.ttdKepalaSekolah}</span>
                    </div>
                  )}
                  {selectedPermohonan.catatanAdmin && (
                    <div className="text-sm">
                      <span className="text-gray-500">Catatan</span>
                      <p className="mt-1 p-2 bg-gray-50 rounded">{selectedPermohonan.catatanAdmin}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-400 space-y-1">
                <p>Diajukan: {new Date(selectedPermohonan.tanggalPengajuan).toLocaleString('id-ID')}</p>
                {selectedPermohonan.tanggalProses && (
                  <p>Diproses: {new Date(selectedPermohonan.tanggalProses).toLocaleString('id-ID')}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preset Dialog */}
      <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Sekolah</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-500">Simpan preset agar tidak perlu isi ulang setiap kali.</p>

            {/* Kop Surat */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kop Surat</label>
              {presetKopSuratUrl ? (
                <div className="relative border rounded-lg p-2">
                  <img src={presetKopSuratUrl} alt="Kop Surat" className="w-full h-24 object-contain rounded bg-gray-50" />
                  <button onClick={() => setPresetKopSuratUrl('')} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Upload Kop Surat</p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setPresetKopSuratUrl)} />
                </label>
              )}
            </div>

            {/* Kepala Sekolah */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Kepala Sekolah</label>
              <Input value={presetTtdKepala} onChange={(e) => setPresetTtdKepala(e.target.value)} placeholder="Nama Kepala Sekolah" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">NIP Kepala Sekolah</label>
              <Input value={presetNipKepala} onChange={(e) => setPresetNipKepala(e.target.value)} placeholder="NIP" />
            </div>

            {/* Kepala TU */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Kepala TU</label>
              <Input value={presetTtdTu} onChange={(e) => setPresetTtdTu(e.target.value)} placeholder="Nama Kepala Tata Usaha" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">NIP Kepala TU</label>
              <Input value={presetNipTu} onChange={(e) => setPresetNipTu(e.target.value)} placeholder="NIP" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPresetDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSavePreset}>
              <Save className="w-4 h-4 mr-2" />
              Simpan Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proses Permohonan Surat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPermohonan && (
              <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold">{selectedPermohonan.jenisSuratLabel}</p>
                <p>Pemohon: {selectedPermohonan.dataPemohon?.nama}</p>
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="diproses">Diproses</SelectItem>
                  <SelectItem value="diterima">Diterima</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nomor Surat dengan auto-format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nomor Surat</label>
              <div className="flex gap-2">
                <Input
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  placeholder="001/SK/2025"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedPermohonan) {
                      setNomorSurat(generateNomorSurat(selectedPermohonan.jenisSurat));
                    }
                  }}
                >
                  Auto
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Klik "Auto" untuk generate format otomatis
              </p>
            </div>

            {/* Upload Kop Surat */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Kop Surat</label>
              {kopSuratUrl ? (
                <div className="relative border rounded-lg p-2">
                  <img src={kopSuratUrl} alt="Kop Surat" className="w-full h-24 object-contain rounded bg-gray-50" />
                  <button onClick={() => setKopSuratUrl('')} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Upload Kop Surat</p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, setKopSuratUrl)} />
                </label>
              )}
              {uploading && <p className="text-xs text-blue-500">Mengupload...</p>}
            </div>

            {/* Tanda Tangan */}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-sm mb-3">Tanda Tangan Surat</h4>

              {/* Kepala Sekolah */}
              <div className="space-y-3 mb-4">
                <label className="text-sm font-medium text-gray-700">Kepala Sekolah</label>
                <Input
                  value={ttdKepalaSekolah}
                  onChange={(e) => setTtdKepalaSekolah(e.target.value)}
                  placeholder="Nama Kepala Sekolah"
                />
                <Input
                  value={nipKepalaSekolah}
                  onChange={(e) => setNipKepalaSekolah(e.target.value)}
                  placeholder="NIP"
                />
              </div>

              {/* Kepala TU */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Kepala Tata Usaha</label>
                <Input
                  value={ttdTataUsaha}
                  onChange={(e) => setTtdTataUsaha(e.target.value)}
                  placeholder="Nama Kepala TU"
                />
                <Input
                  value={nipTataUsaha}
                  onChange={(e) => setNipTataUsaha(e.target.value)}
                  placeholder="NIP"
                />
              </div>
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Catatan Admin</label>
              <Textarea
                value={catatanAdmin}
                onChange={(e) => setCatatanAdmin(e.target.value)}
                placeholder="Catatan jika diperlukan..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Batal</Button>
            <Button onClick={handleStatusUpdate} disabled={actionLoading}>
              {actionLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
