/**
 * Public Verification Page - Untuk cek keabsahan surat
 * Bisa diakses publik tanpa login
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '@/config/api';
import { Badge } from '@/core/libs';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, QrCode } from 'lucide-react';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';

interface VerifyData {
  id: number;
  jenisSurat: string;
  status: 'pending' | 'diproses' | 'diterima' | 'ditolak' | 'selesai';
  tanggalPengajuan: string;
  tanggalProses?: string;
  catatanAdmin?: string;
  nomorSurat?: string;
}

export const VerifyPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: schoolData } = useSchoolProfile();
  const [data, setData] = useState<VerifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerify = async () => {
      if (!id) {
        setError('ID tidak valid');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_CONFIG.baseUrl}/permohonan/track/${id}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Surat tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchVerify();
  }, [id]);

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'DALAM ANTRIAN' },
    diproses: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'SEDANG DIPROSES' },
    diterima: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'DITERIMA' },
    ditolak: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'DITOLAK' },
    selesai: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800', label: 'SELESAI' },
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  const primaryColor = schoolData?.themePrimary || '#1e6fb5';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center"
          style={{ background: `linear-gradient(160deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold">Verifikasi Surat</h1>
          <p className="text-white/80 text-sm mt-1">{schoolData?.schoolName || 'Nayaka Website'}</p>
        </div>

        {error || !data ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Surat Tidak Ditemukan</h2>
            <p className="text-gray-500 text-sm">{error || 'ID tidak valid atau sudah tidak aktif'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Status */}
            <div className={`p-4 text-white text-center ${statusConfig[data.status]?.color || 'bg-gray-100'}`}>
              <div className="flex items-center justify-center gap-2">
                {React.createElement(statusConfig[data.status]?.icon || Clock, { className: 'w-5 h-5' })}
                <span className="font-bold">{statusConfig[data.status]?.label}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* ID */}
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">ID Permohonan</p>
                <p className="text-2xl font-bold text-gray-800">#{data.id}</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
              </div>

              {/* Info Surat */}
              <div className="border rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Jenis Surat</span>
                  <span className="font-medium">{data.jenisSurat}</span>
                </div>
                {data.nomorSurat && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Nomor Surat</span>
                    <span className="font-medium">{data.nomorSurat}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tanggal Pengajuan</span>
                  <span className="font-medium">
                    {new Date(data.tanggalPengajuan).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {data.tanggalProses && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tanggal Diproses</span>
                    <span className="font-medium">
                      {new Date(data.tanggalProses).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Catatan */}
              {data.catatanAdmin && (
                <div className="border rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Catatan</p>
                  <p className="text-sm">{data.catatanAdmin}</p>
                </div>
              )}

              {/* Verification badge */}
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Terverifikasi oleh sistem</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Dokumen ini diverifikasi secara digital oleh</p>
          <p className="font-semibold">{schoolData?.schoolName || 'Nayaka Website'}</p>
          <p className="mt-2">Powered by Xpresensi</p>
        </div>
      </div>
    </div>
  );
};
