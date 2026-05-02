/**
 * Admin: Manajemen Jenis Layanan Persuratan
 * CRUD untuk menambah/mengedit/menghapus jenis layanan dan field-nya
 */
import { DashboardPageLayout } from '@/features/_global';
import { useServiceTypes, useServiceTypeActions, DEFAULT_SERVICE_TYPES, ServiceType } from '../hooks/useServiceTypes';
import { lang } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';
import { Button } from '@/core/libs';
import { Badge } from '@/core/libs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/core/libs';
import { Input } from '@/core/libs';
import { Textarea } from '@/core/libs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/core/libs';
import { Switch } from '@/core/libs';
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  GripVertical, ChevronUp, ChevronDown, Save, X, Settings, FileText
} from 'lucide-react';
import { useState } from 'react';

// Available icon options
const ICON_OPTIONS = [
  'FileText', 'Trophy', 'Lock', 'Unlock', 'UserEdit', 'CreditCard',
  'Clock', 'Mail', 'Briefcase', 'ThumbsUp', 'Home', 'MapPin', 'Stamp',
  'Book', 'Award', 'Users', 'Calendar', 'Bell', 'Star', 'Shield',
  'GraduationCap', 'IdCard', 'Printer', 'Clipboard', 'CheckCircle',
];

const COLOR_OPTIONS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#F97316', '#6366F1', '#14B8A6', '#42A5F5',
  '#7E57C2', '#26A69A', '#78909C', '#1E6FB5', '#2ECC71',
];

const FIELD_TYPES = ['text', 'email', 'phone', 'date', 'select', 'textarea', 'number'] as const;

interface FieldEditorProps {
  fields: ServiceType['fields'];
  onChange: (fields: ServiceType['fields']) => void;
}

function FieldEditor({ fields, onChange }: FieldEditorProps) {
  const addField = () => {
    onChange([...fields, {
      name: `field_${Date.now()}`,
      label: 'Field Baru',
      type: 'text',
      placeholder: '',
      required: false,
    }]);
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, patch: Partial<ServiceType['fields'][0]>) => {
    const updated = fields.map((f, i) => i === index ? { ...f, ...patch } : f);
    onChange(updated);
  };

  const moveField = (index: number, dir: -1 | 1) => {
    const newFields = [...fields];
    const target = index + dir;
    if (target < 0 || target >= newFields.length) return;
    [newFields[index], newFields[target]] = [newFields[target], newFields[index]];
    onChange(newFields);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Field Formulir</span>
        <Button size="sm" variant="outline" onClick={addField}>
          <Plus className="w-3 h-3 mr-1" /> Tambah Field
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-gray-400 py-4 text-center">Belum ada field. Klik "Tambah Field" untuk menambahkan.</p>
      )}

      {fields.map((field, idx) => (
        <div key={field.name + idx} className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
            <span className="text-xs font-bold text-gray-500 w-6">{idx + 1}.</span>
            <Input
              value={field.label}
              onChange={(e) => updateField(idx, { label: e.target.value, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              placeholder="Label field"
              className="flex-1 h-8 text-xs"
            />
            <Select value={field.type} onValueChange={(v) => updateField(idx, { type: v as any })}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <button onClick={() => moveField(idx, -1)} className="p-1 rounded hover:bg-gray-200"><ChevronUp className="w-3 h-3" /></button>
            <button onClick={() => moveField(idx, 1)} className="p-1 rounded hover:bg-gray-200"><ChevronDown className="w-3 h-3" /></button>
            <button onClick={() => removeField(idx)} className="p-1 rounded hover:bg-red-100 text-red-500"><X className="w-3 h-3" /></button>
          </div>

          <div className="flex items-center gap-4 ml-8">
            <Input
              value={field.placeholder || ''}
              onChange={(e) => updateField(idx, { placeholder: e.target.value })}
              placeholder="Placeholder"
              className="flex-1 h-7 text-xs"
            />
            <label className="flex items-center gap-1 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => updateField(idx, { required: e.target.checked })}
                className="w-3 h-3"
              />
              Wajib isi
            </label>
            {field.type === 'select' && (
              <Input
                value={(field.options || []).join(', ')}
                onChange={(e) => updateField(idx, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="Opsi (pisah koma)"
                className="flex-1 h-7 text-xs"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export const ServiceTypesAdminPage = () => {
  const { serviceTypes, isLoading, refetch } = useServiceTypes();
  const { createServiceType, updateServiceType, toggleActive, deleteServiceType, isLoading: actionLoading, error } = useServiceTypeActions(refetch);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingType, setEditingType] = useState<ServiceType | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formLabel, setFormLabel] = useState('');
  const [formJenis, setFormJenis] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('FileText');
  const [formColor, setFormColor] = useState('#3B82F6');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formOrder, setFormOrder] = useState(1);
  const [formFields, setFormFields] = useState<ServiceType['fields']>([]);

  const openNew = () => {
    setEditingType(null);
    setIsNew(true);
    setFormLabel('');
    setFormJenis(`custom_${Date.now()}`);
    setFormDescription('');
    setFormIcon('FileText');
    setFormColor('#3B82F6');
    setFormIsActive(true);
    setFormOrder(serviceTypes.length + 1);
    setFormFields([]);
    setIsEditOpen(true);
  };

  const openEdit = (type: ServiceType) => {
    setEditingType(type);
    setIsNew(false);
    setFormLabel(type.jenisSuratLabel);
    setFormJenis(type.jenisSurat);
    setFormDescription(type.description || '');
    setFormIcon(type.icon || 'FileText');
    setFormColor(type.color || '#3B82F6');
    setFormIsActive(type.isActive);
    setFormOrder(type.order);
    setFormFields(type.fields || []);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!formLabel.trim() || !formJenis.trim()) return;
    const payload = {
      jenisSuratLabel: formLabel.trim(),
      jenisSurat: formJenis.trim().toLowerCase().replace(/\s+/g, '_'),
      description: formDescription.trim(),
      icon: formIcon,
      color: formColor,
      isActive: formIsActive,
      order: formOrder,
      fields: formFields,
    };
    let success: boolean;
    if (isNew) success = await createServiceType(payload as any);
    else success = await updateServiceType(editingType!.id, payload as any);
    if (success) setIsEditOpen(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteServiceType(id);
    if (ok) setDeleteConfirm(null);
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await toggleActive(id, !isActive);
  };

  return (
    <DashboardPageLayout
      siteTitle={`Manajemen Layanan | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: 'Layanan Persuratan', url: '/admin/permohonan' },
        { label: 'Manajemen Jenis Layanan' },
      ]}
      title="Manajemen Jenis Layanan"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            {serviceTypes.length} jenis layanan terkonfigurasi
            {error && <span className="text-red-500 ml-2">({error})</span>}
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jenis Layanan
        </Button>
      </div>

      {/* Service Types Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Memuat...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceTypes
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((type) => (
              <div
                key={type.id}
                className={`rounded-xl border bg-white p-4 transition-all ${
                  type.isActive ? 'border-gray-200 shadow-sm hover:shadow-md' : 'border-gray-100 opacity-60'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: type.color || '#3B82F6' }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      className={`text-xs ${type.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {type.isActive ? 'Aktif' : 'Non-aktif'}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-semibold text-sm mb-1 leading-tight">{type.jenisSuratLabel}</h3>
                <p className="text-xs text-gray-400 mb-1">{type.jenisSurat}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{type.description || 'Tanpa deskripsi'}</p>

                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <span>{type.fields?.length || 0} field</span>
                  <span className="mx-1">•</span>
                  <span>Order: {type.order}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => openEdit(type)}
                  >
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleToggle(type.id, type.isActive)}
                    title={type.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    {type.isActive
                      ? <ToggleRight className="w-4 h-4 text-green-600" />
                      : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-red-500 hover:text-red-700"
                    onClick={() => setDeleteConfirm(type.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Edit / Create Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? 'Tambah Jenis Layanan' : 'Edit Jenis Layanan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Label */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nama Layanan</label>
              <Input
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="Contoh: Surat Keterangan Aktif Sekolah"
              />
            </div>

            {/* Jenis (key) */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Kode (Key)</label>
              <Input
                value={formJenis}
                onChange={(e) => setFormJenis(e.target.value)}
                placeholder="keterangan_aktif"
                disabled={!isNew}
              />
              <p className="text-xs text-gray-400">Kode unik untuk API. Tidak bisa diubah setelah dibuat.</p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Deskripsi singkat layanan..."
                rows={2}
              />
            </div>

            {/* Icon & Color */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Warna</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => setFormColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${formColor === c ? 'scale-125 border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Ikon</label>
                <Select value={formIcon} onValueChange={setFormIcon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(icon => (
                      <SelectItem key={icon} value={icon} className="text-xs">{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Order & Active */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Urutan</label>
                <Input
                  type="number"
                  min={1}
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <div className="flex items-center gap-2 h-10">
                  <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
                  <span className="text-sm">{formIsActive ? 'Aktif' : 'Non-aktif'}</span>
                </div>
              </div>
            </div>

            {/* Field Editor */}
            <FieldEditor fields={formFields} onChange={setFormFields} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={actionLoading || !formLabel.trim() || !formJenis.trim()}>
              {actionLoading ? 'Menyimpan...' : <><Save className="w-4 h-4 mr-1" /> Simpan</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Jenis Layanan?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-2">
            Tindakan ini tidak bisa dibatalkan. Semua data terkait akan ikut terhapus.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={actionLoading}
            >
              {actionLoading ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
