/**
 * Arsip Surat Stats Widget
 */
import { useArsipSurat } from '../hooks/useArsipSurat';
import { Send, MailOpen, FileText, Calendar } from 'lucide-react';

export const ArsipStats = () => {
  const { stats, isLoading } = useArsipSurat();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Total Arsip', value: stats.total, icon: <FileText className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Surat Keluar', value: stats.total_keluar || 0, icon: <Send className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Surat Masuk', value: stats.total_masuk || 0, icon: <MailOpen className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Bulan Ini', value: stats.bulan_ini || 0, icon: <Calendar className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div key={i} className={`${item.bg} border border-transparent rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className={item.color}>{item.icon}</span>
            <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
          </div>
          <p className="text-xs font-medium text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
};