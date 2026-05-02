/**
 * Arsip Surat Table with Tabs, Create/Edit, Detail, Print
 */
import { useState, useMemo } from 'react';
import { useArsipSurat, useArsipActions, ArsipSuratData } from '../hooks/useArsipSurat';
import { API_CONFIG } from '@/config/api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/core/libs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/libs';
import { Textarea } from '@/core/libs';
import { Button } from '@/core/libs';
import { Input } from '@/core/libs';
import { Badge } from '@/core/libs';
import {
  Eye, Pencil, Trash2, Plus, Send, Save, Upload, X, FileText,
  Printer, Download, FileDown, Search, ChevronLeft, ChevronRight
} from 'lucide-react';

// ─── Column Definitions ─────────────────────────────────────────────────────

const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const statusBadge: Record<string, string> = {
  arsip: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  diteruskan: 'bg-blue-100 text-blue-700',
};

const kategoriBadge: Record<string, string> = {
  keluar: 'bg-emerald-100 text-emerald-700',
  masuk: 'bg-purple-100 text-purple-700',
  internal: 'bg-orange-100 text-orange-700',
};

const kategoriLabel: Record<string, string> = {
  keluar: 'Keluar',
  masuk: 'Masuk',
  internal: 'Internal',
};

// ─── Table Row ────────────────────────────────────────────────────────────────

function ArsipRow({ surat, onDetail, onEdit, onDelete, onPrint }: {
  surat: ArsipSuratData;
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPrint: () => void;
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-500">{surat.nomor_surat || '-'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${kategoriBadge[surat.kategori]}`}>
          {kategoriLabel[surat.kategori]}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">{surat.hal}</p>
        {surat.klasifikasi_nama && <p className="text-xs text-gray-400">{surat.klasifikasi_nama}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{surat.pengirim || surat.tujuan || '-'}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(surat.tanggal_surat)}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[surat.status] || 'bg-gray-100 text-gray-600'}`}>
          {surat.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={onDetail} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Detail">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Edit">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={onPrint} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Cetak PDF">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Detail Dialog ─────────────────────────────────────────────────────────────

function DetailDialog({ surat, open, onClose }: { surat: ArsipSuratData | null; open: boolean; onClose: () => void }) {
  if (!surat) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Arsip Surat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Meta badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={kategoriBadge[surat.kategori]}>{kategoriLabel[surat.kategori]}</Badge>
            <Badge className={statusBadge[surat.status]}>{surat.status}</Badge>
            {surat.lampiran_file && <Badge variant="outline">📎 {surat.jumlah_lampiran} lampiran</Badge>}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Nomor Surat', surat.nomor_surat || '-'],
              ['Tanggal Surat', formatDate(surat.tanggal_surat)],
              ['Klasifikasi', surat.klasifikasi_nama || '-'],
              ['Tempat', surat.tempat || '-'],
              ['Pengirim', surat.pengirim || '-'],
              ['Tujuan', surat.tujuan || '-'],
              ['Penandatangan', surat.penandatangan || '-'],
              ['NIP', surat.nip_penandatangan || '-'],
              ['Jabatan', surat.jabatan_penandatangan || '-'],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Hal */}
          <div className="border rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-1">Perihal</p>
            <p className="font-semibold text-gray-900">{surat.hal}</p>
          </div>

          {/* Ringkasan */}
          {surat.ringkasan && (
            <div className="border rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Ringkasan</p>
              <p className="text-sm text-gray-600">{surat.ringkasan}</p>
            </div>
          )}

          {/* Disposisi */}
          {surat.disposisi && surat.disposisi.length > 0 && (
            <div className="border rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2">Disposisi</p>
              <div className="space-y-2">
                {surat.disposisi.map(d => (
                  <div key={d.id} className="bg-blue-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{d.dari_user}</span>
                      <span className="text-xs text-gray-400">{formatDate(d.tanggal_disposisi)}</span>
                    </div>
                    <p className="text-gray-600">→ {d.kepada_user}</p>
                    {d.instruksi && <p className="text-gray-500 mt-1 italic">"{d.instruksi}"</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" /> Tutup
            </Button>
            <Button onClick={() => window.open(`${API_CONFIG.baseUrl}/arsip-surat/${surat.id}/pdf`, '_blank')} className="flex-1">
              <Printer className="w-4 h-4 mr-2" /> Cetak PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create/Edit Dialog ────────────────────────────────────────────────────────

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editData?: ArsipSuratData | null;
}

function CreateDialog({ open, onClose, onSaved, editData }: CreateDialogProps) {
  const { create, update, getNextNomor, getKlasifikasi, isLoading } = useArsipActions(onSaved);
  const [klasifikasiList, setKlasifikasiList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    kategori: 'keluar',
    nomor_surat: '',
    klasifikasi_id: '',
    tanggal_surat: new Date().toISOString().split('T')[0],
    hal: '',
    ringkasan: '',
    pengirim: '',
    tujuan: '',
    tempat: '',
    penandatangan: '',
    nip_penandatangan: '',
    jabatan_penandatangan: 'Kepala Sekolah',
    jumlah_lampiran: 0,
    lampiran_file: '',
    kop_surat_url: '',
  });

  const loadKlasifikasi = async (kat: string) => {
    const list = await getKlasifikasi(kat || undefined);
    setKlasifikasiList(list);
  };

  const handleOpen = async () => {
    if (editData) {
      setForm({
        kategori: editData.kategori || 'keluar',
        nomor_surat: editData.nomor_surat || '',
        klasifikasi_id: editData.klasifikasi_id?.toString() || '',
        tanggal_surat: editData.tanggal_surat?.split('T')[0] || new Date().toISOString().split('T')[0],
        hal: editData.hal || '',
        ringkasan: editData.ringkasan || '',
        pengirim: editData.pengirim || '',
        tujuan: editData.tujuan || '',
        tempat: editData.tempat || '',
        penandatangan: editData.penandatangan || '',
        nip_penandatangan: editData.nip_penandatangan || '',
        jabatan_penandatangan: editData.jabatan_penandatangan || 'Kepala Sekolah',
        jumlah_lampiran: editData.jumlah_lampiran || 0,
        lampiran_file: editData.lampiran_file || '',
        kop_surat_url: editData.kop_surat_url || '',
      });
      await loadKlasifikasi(editData.kategori);
    } else {
      setForm(f => ({ ...f, kategori: 'keluar', nomor_surat: '', hal: '' }));
      await loadKlasifikasi('keluar');
      const nomor = await getNextNomor('keluar');
      setForm(f => ({ ...f, nomor_surat: nomor }));
    }
  };

  const handleKategoriChange = async (val: string) => {
    setForm(f => ({ ...f, kategori: val, klasifikasi_id: '' }));
    const nomor = await getNextNomor(val);
    setForm(f => ({ ...f, nomor_surat: nomor }));
    await loadKlasifikasi(val);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'lampiran_file' | 'kop_surat_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/upload`, {
        method: 'POST',
        headers: { 'X-API-Key': import.meta.env.VITE_API_KEY || '' },
        body: fd,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setForm(f => ({ ...f, [field]: result.url }));
      }
    } catch { /* silent */ }
    finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.hal || !form.tanggal_surat) return;
    const payload = {
      ...form,
      klasifikasi_id: form.klasifikasi_id ? parseInt(form.klasifikasi_id) : null,
      jumlah_lampiran: parseInt(String(form.jumlah_lampiran)) || 0,
    };
    let ok: boolean;
    if (editData) {
      ok = await update(editData.id, payload);
    } else {
      ok = await create(payload);
    }
    if (ok) onClose();
  };

  if (open && klasifikasiList.length === 0) handleOpen();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Arsip Surat' : 'Tambah Arsip Surat Baru'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Kategori</label>
              <Select value={form.kategori} onValueChange={handleKategoriChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="keluar">Surat Keluar</SelectItem>
                  <SelectItem value="masuk">Surat Masuk</SelectItem>
                  <SelectItem value="internal">Surat Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Klasifikasi</label>
              <Select value={form.klasifikasi_id} onValueChange={v => setForm(f => ({ ...f, klasifikasi_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Pilih klasifikasi" /></SelectTrigger>
                <SelectContent>
                  {klasifikasiList.map(k => (
                    <SelectItem key={k.id} value={k.id.toString()}>
                      {k.kode} - {k.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nomor & Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nomor Surat</label>
              <Input value={form.nomor_surat} onChange={e => setForm(f => ({ ...f, nomor_surat: e.target.value }))} placeholder="Otomatis" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tanggal Surat</label>
              <Input type="date" value={form.tanggal_surat} onChange={e => setForm(f => ({ ...f, tanggal_surat: e.target.value }))} />
            </div>
          </div>

          {/* Hal */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Perihal *</label>
            <Input value={form.hal} onChange={e => setForm(f => ({ ...f, hal: e.target.value }))} placeholder="Perihal / Hal surat" />
          </div>

          {/* Pengirim / Tujuan */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Pengirim {form.kategori === 'keluar' ? '(Dari)' : ''}</label>
              <Input value={form.pengirim} onChange={e => setForm(f => ({ ...f, pengirim: e.target.value }))} placeholder="Nama pengirim" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tujuan {form.kategori === 'keluar' ? '(Kepada)' : ''}</label>
              <Input value={form.tujuan} onChange={e => setForm(f => ({ ...f, tujuan: e.target.value }))} placeholder="Nama tujuan" />
            </div>
          </div>

          {/* Tempat */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tempat</label>
            <Input value={form.tempat} onChange={e => setForm(f => ({ ...f, tempat: e.target.value }))} placeholder="Contoh: Jakarta" />
          </div>

          {/* Ringkasan */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Ringkasan / Keterangan</label>
            <Textarea value={form.ringkasan} onChange={e => setForm(f => ({ ...f, ringkasan: e.target.value }))} placeholder="Ringkasan isi surat" rows={2} />
          </div>

          {/* Penandatangan */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Penandatangan</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Nama</label>
                <Input value={form.penandatangan} onChange={e => setForm(f => ({ ...f, penandatangan: e.target.value }))} placeholder="Nama" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">NIP</label>
                <Input value={form.nip_penandatangan} onChange={e => setForm(f => ({ ...f, nip_penandatangan: e.target.value }))} placeholder="NIP" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Jabatan</label>
                <Input value={form.jabatan_penandatangan} onChange={e => setForm(f => ({ ...f, jabatan_penandatangan: e.target.value }))} placeholder="Jabatan" />
              </div>
            </div>
          </div>

          {/* Lampiran */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Jumlah Lampiran</label>
              <Input type="number" min={0} value={form.jumlah_lampiran} onChange={e => setForm(f => ({ ...f, jumlah_lampiran: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">File Lampiran</label>
              {form.lampiran_file ? (
                <div className="flex items-center gap-2">
                  <a href={form.lampiran_file} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">{form.lampiran_file.split('/').pop()}</a>
                  <button onClick={() => setForm(f => ({ ...f, lampiran_file: '' }))} className="text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 h-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-500">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" className="hidden" onChange={e => handleUpload(e, 'lampiran_file')} accept=".pdf,.jpg,.png" />
                </label>
              )}
              {uploading && <p className="text-xs text-blue-500">Mengupload...</p>}
            </div>
          </div>

          {/* Kop Surat */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kop Surat (URL gambar)</label>
            {form.kop_surat_url ? (
              <div className="flex items-start gap-2">
                <img src={form.kop_surat_url} alt="Kop" className="h-16 rounded border object-contain bg-gray-50" />
                <button onClick={() => setForm(f => ({ ...f, kop_surat_url: '' }))} className="text-red-500 mt-1"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 h-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-500">
                <Upload className="w-4 h-4" /> Upload Kop Surat
                <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'kop_surat_url')} />
              </label>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={isLoading || !form.hal || !form.tanggal_surat}>
            {isLoading ? 'Menyimpan...' : <><Save className="w-4 h-4 mr-2" /> Simpan</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Table Component ──────────────────────────────────────────────────────

interface ArsipTableProps {
  kategori: string;
  onCreate: () => void;
}

export function ArsipSuratTable({ kategori, onCreate }: ArsipTableProps) {
  const { data, isLoading, pagination, refetch } = useArsipSurat({ kategori });
  const { remove } = useArsipActions(refetch);

  const [search, setSearch] = useState('');
  const [detailSurat, setDetailSurat] = useState<ArsipSuratData | null>(null);
  const [editSurat, setEditSurat] = useState<ArsipSuratData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.toLowerCase();
    return data.filter(r =>
      r.nomor_surat?.toLowerCase().includes(s) ||
      r.hal?.toLowerCase().includes(s) ||
      r.pengirim?.toLowerCase().includes(s) ||
      r.tujuan?.toLowerCase().includes(s)
    );
  }, [data, search]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    await remove(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nomor surat, perihal, pengirim..."
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Belum ada data arsip surat</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Tambah Surat Baru
            </Button>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['No. Surat', 'Kategori', 'Perihal', 'Tujuan/Pengirim', 'Tanggal', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(surat => (
                  <ArsipRow
                    key={surat.id}
                    surat={surat}
                    onDetail={() => setDetailSurat(surat)}
                    onEdit={() => setEditSurat(surat)}
                    onDelete={() => setDeleteId(surat.id)}
                    onPrint={() => window.open(`${API_CONFIG.baseUrl}/arsip-surat/${surat.id}/print`, '_blank')}
                  />
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-xs text-gray-500">Halaman {pagination.page} dari {pagination.pages} ({pagination.total} data)</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" disabled={pagination.page <= 1}
                    onClick={() => {/* page - 1 */}}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" disabled={pagination.page >= pagination.pages}
                    onClick={() => {/* page + 1 */}}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <DetailDialog surat={detailSurat} open={!!detailSurat} onClose={() => setDetailSurat(null)} />
      <CreateDialog
        open={isCreateOpen || !!editSurat}
        onClose={() => { setIsCreateOpen(false); setEditSurat(null); }}
        onSaved={refetch}
        editData={editSurat}
      />

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Arsip Surat?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Surat akan dipindahkan ke trash. Tindakan ini tidak bisa dibatalkan.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}