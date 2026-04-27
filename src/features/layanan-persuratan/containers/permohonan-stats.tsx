/**
 * Permohonan Stats Dashboard
 */
import { usePermohonan } from '../hooks/usePermohonan';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/libs';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function PermohonanStats() {
  const { stats, isLoading } = usePermohonan({ limit: 1 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const recent = stats?.recent || 0;

  // Calculate processed
  const byStatus = stats?.byStatus || [];
  const processed = byStatus
    .filter((s) => ['diterima', 'ditolak', 'selesai'].includes(s.status))
    .reduce((sum, s) => sum + parseInt(s.count || '0'), 0);

  const statCards = [
    {
      title: 'Total Permohonan',
      value: total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending',
      value: pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Baru (7 Hari)',
      value: recent,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Selesai',
      value: processed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Top jenis surat
export function TopJenisSurat() {
  const { stats, isLoading } = usePermohonan({ limit: 1 });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Top Jenis Surat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topJenis = stats?.topJenis || [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Top Jenis Surat</CardTitle>
      </CardHeader>
      <CardContent>
        {topJenis.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Belum ada data</p>
        ) : (
          <div className="space-y-2">
            {topJenis.slice(0, 5).map((item, index) => (
              <div key={item.jenisSurat} className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.jenisSuratLabel}</p>
                  <p className="text-xs text-gray-500">{item.count} permohonan</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
