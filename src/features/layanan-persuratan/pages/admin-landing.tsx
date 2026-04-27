/**
 * Permohonan Admin Landing Page
 */
import { DashboardPageLayout } from '@/features/_global';
import { PermohonanTable } from '../containers/permohonan-table';
import { PermohonanStats } from '../containers/permohonan-stats';
import { useState } from 'react';
import { lang } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';
import { Button } from '@/core/libs';
import { cn } from '@/core/libs';

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'pending', label: 'Pending' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'diterima', label: 'Diterima' },
  { value: 'ditolak', label: 'Ditolak' },
  { value: 'selesai', label: 'Selesai' },
];

export const PermohonanAdminLanding = () => {
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <DashboardPageLayout
      siteTitle={`Layanan Persuratan | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: 'Layanan Persuratan',
          url: '/admin/permohonan',
        },
      ]}
      title="Layanan Persuratan"
    >
      {/* Stats Overview */}
      <div className="mb-6">
        <PermohonanStats />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={statusFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              statusFilter === filter.value && 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Table */}
      <PermohonanTable statusFilter={statusFilter || undefined} />

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};
