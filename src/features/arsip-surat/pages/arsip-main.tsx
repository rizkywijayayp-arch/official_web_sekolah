/**
 * Arsip Surat Admin Landing Page
 */
import { DashboardPageLayout } from '@/features/_global';
import { ArsipSuratTable } from '../containers/arsip-table';
import { ArsipStats } from '../containers/arsip-stats';
import { useState } from 'react';
import { APP_CONFIG } from '@/core/configs';
import { Button } from '@/core/libs';
import { cn } from '@/core/libs';
import { Plus } from 'lucide-react';

const KATEGORI_TABS = [
  { value: '', label: 'Semua' },
  { value: 'keluar', label: 'Surat Keluar' },
  { value: 'masuk', label: 'Surat Masuk' },
  { value: 'internal', label: 'Internal' },
];

export const ArsipSuratAdminPage = () => {
  const [kategori, setKategori] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  return (
    <DashboardPageLayout
      siteTitle={`Arsip Surat | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        { label: 'Arsip Surat' },
      ]}
      title="Arsip Surat"
    >
      {/* Stats */}
      <div className="mb-6">
        <ArsipStats />
      </div>

      {/* Tab Filter + Create */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {KATEGORI_TABS.map(tab => (
            <Button
              key={tab.value}
              variant={kategori === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setKategori(tab.value)}
              className={cn(
                kategori === tab.value && 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Surat
        </Button>
      </div>

      {/* Table */}
      <ArsipSuratTable kategori={kategori} onCreate={() => setShowCreate(true)} />
    </DashboardPageLayout>
  );
};